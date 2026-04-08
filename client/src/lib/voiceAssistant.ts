import {
  GoogleGenAI,
  LiveServerMessage,
  Modality,
  StartSensitivity,
  ActivityHandling,
} from "@google/genai";

// Audio processing constants
const INPUT_SAMPLE_RATE = 16000;
const OUTPUT_SAMPLE_RATE = 24000;
const CHUNK_SIZE = 4096;

export class VoiceAssistant {
  private ai: any = null;
  private session: any = null;
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private nextStartTime = 0;
  private activeSources: AudioBufferSourceNode[] = [];
  public isMuted = false;

  /** Speaker mute (UI). Does not stop the model; only adjusts playback volume. */
  setSpeakerMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.playbackGain) {
      this.playbackGain.gain.value = muted ? 0 : 1;
    }
  }

  /** True while model is sending audio or local playback queue is non-empty (user can tap to interrupt). */
  isSpeaking(): boolean {
    return this.isGenerating || this.activeSources.length > 0;
  }

  /**
   * When false, only silence is sent to the Live API (mic "muted" for the server).
   * Playback of the current AI reply continues. Default true after start().
   */
  private micInputToServerEnabled = true;

  setMicInputToServer(enabled: boolean) {
    this.micInputToServerEnabled = enabled;
  }

  getMicInputToServer(): boolean {
    return this.micInputToServerEnabled;
  }

  public isStopping = false;
  private isGenerating = false;
  private statusCallback: ((status: string) => void) | null = null;
  /** Mic graph: filter -> processor -> muteGain -> destination (gain 0 = no speaker bleed / feedback). */
  private muteMonitorGain: GainNode | null = null;
  /** AI playback volume; isMuted only sets gain to 0 — chunks are still decoded/queued so the turn can finish. */
  private playbackGain: GainNode | null = null;

  constructor() {
    try {
      const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY || "";
      console.log("VoiceAssistant initialized (v1beta). API Key starts with:", (apiKey ? apiKey.substring(0, 8) : "MISSING") + "...");
      // Pass the API key as an object property
      this.ai = new GoogleGenAI({ apiKey: apiKey, apiVersion: "v1beta" as any });
    } catch (err) {
      console.error("Critical: VoiceAssistant failed to initialize AI:", err);
    }
  }

  private floatTo16BitPCM(input: Float32Array): Int16Array {
    const output = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
      const s = Math.max(-1, Math.min(1, input[i]));
      output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return output;
  }

  private uint8ArrayToBase64(bytes: Uint8Array): string {
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private base64ToUint8Array(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  async start(
    systemInstruction: string,
    onTranscription: (text: string) => void,
    onStatusChange: (status: string) => void
  ) {
    if (this.session) return;
    this.isStopping = false;
    this.isGenerating = false;
    this.micInputToServerEnabled = true;
    this.statusCallback = onStatusChange;
    if (!this.ai) {
      console.error("AI not initialized, cannot start session");
      onStatusChange("Error: AI Init Failed");
      return;
    }

    try {
      console.log("Starting VoiceAssistant...");
      
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000,
      });
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } as MediaTrackConstraints,
      });
      
      if (!this.audioContext) throw new Error("AudioContext creation failed");

      this.source = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
      
      const filter = this.audioContext.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 8000;
      
      this.source.connect(filter);
      filter.connect(this.processor);
      this.muteMonitorGain = this.audioContext.createGain();
      this.muteMonitorGain.gain.value = 0;
      this.processor.connect(this.muteMonitorGain);
      this.muteMonitorGain.connect(this.audioContext.destination);

      this.playbackGain = this.audioContext.createGain();
      this.playbackGain.gain.value = 1;
      this.playbackGain.connect(this.audioContext.destination);

      const modelName = "models/gemini-2.5-flash-native-audio-latest";
      console.log(`Connecting to: ${modelName} via v1beta`);

      await this.audioContext.resume();
      console.log("AudioContext state:", this.audioContext.state);

      this.session = await this.ai.live.connect({
        model: modelName,
        config: {
          systemInstruction: { parts: [{ text: systemInstruction }] },
          responseModalities: ["AUDIO"] as any,
          maxOutputTokens: 8192,
          realtimeInputConfig: {
            // Allow voice "barge-in" during replies; echo is mitigated via AEC + low sensitivity
            activityHandling: ActivityHandling.START_OF_ACTIVITY_INTERRUPTS,
            automaticActivityDetection: {
              startOfSpeechSensitivity: StartSensitivity.START_SENSITIVITY_LOW,
              prefixPaddingMs: 400,
              silenceDurationMs: 600,
            },
          },
        },
        callbacks: {
          onopen: () => {
            console.log("WebSocket opened successfully!");
            onStatusChange("Connected");
            this.startStreaming();
          },
          onmessage: async (message: LiveServerMessage) => {
            console.log("Gemini Message:", message);

            if (message.serverContent?.modelTurn?.parts) {
              this.isGenerating = true;
              for (const part of message.serverContent.modelTurn.parts) {
                if (part.text) {
                  console.log("AI Text Response:", part.text);
                  onTranscription(part.text);
                }
                if (part.inlineData?.data) {
                  await this.playAudio(part.inlineData.data);
                }
              }
            }

            if (message.serverContent?.interrupted) {
              console.log("Turn interrupted.");
              this.isGenerating = false;
              this.stopPlayback();
            }

            if (message.serverContent?.turnComplete) {
              console.log("Turn complete.");
              this.isGenerating = false;
              if (this.isStopping && this.activeSources.length === 0) {
                 this.stop();
              }
            }
          },
          onerror: (err: any) => {
            console.error("WebSocket error:", err);
            onStatusChange("Error");
          },
          onclose: (event: any) => {
            console.log("WebSocket closed:", event.code, event.reason);
            this.session = null;
            onStatusChange("Disconnected");
          }
        }
      });
    } catch (error) {
      console.error("Failed to start voice assistant:", error);
      onStatusChange("Error");
      this.stop();
    }
  }

  private startStreaming() {
    if (!this.processor) return;
    console.log("Starting Audio Processor stream...");
    let chunkCount = 0;
    
    // Explicitly set the handler on the processor
    this.processor.onaudioprocess = (e) => {
      // Very safe check
      if (!this.session) return;
      
      try {
        const inputData = e.inputBuffer.getChannelData(0);
        const capture = this.micInputToServerEnabled
          ? inputData
          : new Float32Array(inputData.length);

        let maxAmp = 0;
        for (let i = 0; i < capture.length; i++) {
          const abs = Math.abs(capture[i]);
          if (abs > maxAmp) maxAmp = abs;
        }

        if (chunkCount === 0) {
          console.log("FIRST AUDIO CHUNK CAPTURED. maxAmp:", maxAmp.toFixed(4), "micToServer:", this.micInputToServerEnabled);
        }

        const pcmData = this.floatTo16BitPCM(capture);
        const base64Data = this.uint8ArrayToBase64(new Uint8Array(pcmData.buffer));
        
        if (chunkCount % 40 === 0) { 
          console.log(`Streaming chunks... count: ${chunkCount}, maxAmp: ${maxAmp.toFixed(4)}`);
        }
        chunkCount++;

        this.session.sendRealtimeInput({
          audio: {
            mimeType: "audio/pcm;rate=16000",
            data: base64Data
          }
        });
      } catch (err) {
        console.error("Error in onaudioprocess:", err);
      }
    };
  }

  private async playAudio(base64Data: string) {
    if (!this.audioContext || !this.playbackGain) return;
    try {
      this.playbackGain.gain.value = this.isMuted ? 0 : 1;

      const bytes = this.base64ToUint8Array(base64Data);
      const view = new DataView(bytes.buffer);
      const floatArray = new Float32Array(bytes.length / 2);
      for (let i = 0; i < floatArray.length; i++) {
        const int16 = view.getInt16(i * 2, true);
        floatArray[i] = int16 / (int16 < 0 ? 0x8000 : 0x7FFF);
      }
      
      const audioBuffer = this.audioContext.createBuffer(1, floatArray.length, 24000);
      audioBuffer.getChannelData(0).set(floatArray);
      
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.playbackGain);
      
      const now = this.audioContext.currentTime;
      let startTime = this.nextStartTime;
      
      // If we underrun (queue ran out) or are just starting, add a small buffer (50ms)
      if (startTime < now) {
        startTime = now + 0.05;
      }
      
      source.start(startTime);
      this.nextStartTime = startTime + audioBuffer.duration;
      this.activeSources.push(source);
      
      source.onended = () => {
        this.activeSources = this.activeSources.filter(s => s !== source);
        if (this.isStopping && !this.isGenerating && this.activeSources.length === 0) {
          this.stop();
        }
      };
    } catch (e) {
      console.error("Audio playback error:", e);
    }
  }

  private stopPlayback() {
    this.activeSources.forEach(s => {
      try { s.stop(); } catch {}
    });
    this.activeSources = [];
    this.nextStartTime = 0;
  }

  /** @deprecated Use stop(); kept for compatibility */
  requestStop() {
    this.stop();
  }

  stop() {
    console.log("Stopping VoiceAssistant...");
    this.isStopping = false;

    this.session?.close();
    this.session = null;
    
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(t => t.stop());
      this.mediaStream = null;
    }
    
    if (this.processor) {
      this.processor.disconnect();
      this.processor.onaudioprocess = null;
      this.processor = null;
    }
    
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }

    this.muteMonitorGain = null;
    this.playbackGain = null;

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    this.stopPlayback();

    // Ensure UI knows we're disconnected
    if (this.statusCallback) {
      this.statusCallback("Disconnected");
    }
  }
}
