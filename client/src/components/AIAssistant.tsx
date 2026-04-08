import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, X, Settings, Volume2, VolumeX, Eye, Power } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { VoiceAssistant } from "@/lib/voiceAssistant";
import { WEBSITE_INFO } from "@/lib/ai-context";

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState("Ready");
  const [isMuted, setIsMuted] = useState(false);
  const [isAutoNav, setIsAutoNav] = useState(true);
  const [lastTranscript, setLastTranscript] = useState("");
  /** Jonli sessiyada: true = serverga mikrofon yuborilmaydi (AI javobi ovozda davom etadi) */
  const [micSendPaused, setMicSendPaused] = useState(false);
  const [, setLocation] = useLocation();
  const assistantRef = useRef<VoiceAssistant | null>(null);

  useEffect(() => {
    try {
      console.log("AIAssistant Mounting - API Key Check:", !!(import.meta as any).env.VITE_GEMINI_API_KEY);
      assistantRef.current = new VoiceAssistant();
    } catch (err) {
      console.error("AIAssistant Effect Error:", err);
    }

    // Wake Word Listener Initialization
    let recognition: any = null;
    let isListeningForWakeWord = false;

    const startWakeWordListener = () => {
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.warn("Speech recognition not supported in this browser. Wake word won't work.");
        return;
      }

      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'uz-UZ';

      recognition.onstart = () => {
        isListeningForWakeWord = true;
        console.log("Wake word listener started.");
      };

      recognition.onresult = (event: any) => {
        // If Gemini is already active or connecting, we ignore the wake word listener
        if (isActiveRef.current || isConnectingRef.current) return;

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            const transcript = event.results[i][0].transcript.toLowerCase();
            console.log("Wake word check:", transcript);
            
            // Checking common variations of "Saydx"
            if (
              transcript.includes('sayd') || 
              transcript.includes('said') || 
              transcript.includes('sayt') || 
              transcript.includes('say x')
            ) {
              console.log("🔥 Wake word detected! Starting Assistant...");
              startAssistant();
              recognition.stop();
              break;
            }
          }
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error !== 'no-speech') {
          console.error("Wake Word Listener Error:", event.error);
        }
      };

      recognition.onend = () => {
        isListeningForWakeWord = false;
        // Auto restart if AI is not active and not connecting
        if (!isActiveRef.current && !isConnectingRef.current) {
          setTimeout(() => {
            try {
              recognition.start();
            } catch (e) {}
          }, 1000);
        }
      };

      try {
        recognition.start();
      } catch (e) {
        console.error("Could not start wake word recognition:", e);
      }
    };

    // Delay start slightly to ensure component is fully mounted
    setTimeout(startWakeWordListener, 1000);

    return () => {
      assistantRef.current?.stop();
      if (recognition) {
        recognition.onend = null;
        recognition.stop();
      }
    };
  }, []);

  useEffect(() => {
    assistantRef.current?.setSpeakerMuted(isMuted);
  }, [isMuted]);

  useEffect(() => {
    if (isActive && assistantRef.current) {
      assistantRef.current.setMicInputToServer(!micSendPaused);
    }
  }, [micSendPaused, isActive]);

  const handleCommand = (command: string) => {
    console.log("Raw Command:", command);
    
    // Format: [CMD: TYPE, VALUE]
    const cmdMatch = command.match(/\[CMD: (\w+), ([^\]]+)\]/);
    if (cmdMatch) {
      const type = cmdMatch[1].toUpperCase();
      const value = cmdMatch[2].trim();
      console.log(`AI ACTION: ${type} -> ${value}`);

      if (!isAutoNav) {
        console.log("Auto-nav disabled, ignoring command:", type);
        return;
      }

      switch (type) {
        case "NAVIGATE":
          setLocation(value);
          break;
        case "SCROLL":
          const el = document.querySelector(value);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
          break;
        case "UI_EVENT":
          window.dispatchEvent(new CustomEvent("ai-ui-event", { detail: value }));
          break;
        case "SELECT_TEAM":
          window.dispatchEvent(new CustomEvent("ai-select-team", { detail: value }));
          break;
        case "OPEN_SERVICE":
          window.dispatchEvent(new CustomEvent("ai-open-service", { detail: value }));
          break;
        case "PORTFOLIO_TAB":
          window.dispatchEvent(new CustomEvent("ai-portfolio-tab", { detail: value }));
          break;
        case "HELP_ACTION":
          window.dispatchEvent(new CustomEvent("ai-help-action", { detail: value }));
          break;
      }
      return;
    }

    // Fallback for legacy [NAVIGATE: /path]
    const navMatch = command.match(/\[NAVIGATE: ([^\]]+)\]/);
    if (navMatch) {
      setLocation(navMatch[1].trim());
    }
  };

  const [isConnecting, setIsConnecting] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const isActiveRef = useRef(false);
  const isConnectingRef = useRef(false);
  const isStoppingRef = useRef(false);

  const startAssistant = async () => {
    if (isConnectingRef.current) {
      console.log("Already connecting, skipping...");
      return;
    }
    
    setIsConnecting(true);
    isConnectingRef.current = true;
    setStatus("Connecting...");
    
    let accumulatedText = "";
    let lastProcessedIndex = 0;
    
    try {
      await assistantRef.current?.start(
        WEBSITE_INFO,
        (text) => {
          setLastTranscript(text);
          accumulatedText += text;
          const searchSpace = accumulatedText.substring(lastProcessedIndex);
          const allCommandMatches = searchSpace.match(/\[(CMD|NAVIGATE): [^\]]+\]/g);
          
          if (allCommandMatches) {
            allCommandMatches.forEach(cmd => {
              handleCommand(cmd);
              // Advance the index so we don't process the same substring again
              const foundAt = searchSpace.indexOf(cmd);
              if (foundAt !== -1) {
                lastProcessedIndex += foundAt + cmd.length;
              }
            });
          }
        },
        (s) => {
          console.log("AIAssistant Status Update:", s);
          setStatus(s);
          
          if (s === "Connected") {
            setIsConnecting(false);
            isConnectingRef.current = false;
            setIsActive(true);
            isActiveRef.current = true;
            setMicSendPaused(false);
          }

          if ((s === "Disconnected" || s === "Error")) {
            const wasActive = isActiveRef.current;
            const wasStopping = isStoppingRef.current;
            
            setIsConnecting(false);
            isConnectingRef.current = false;
            
            setIsStopping(false);
            isStoppingRef.current = false;

            setMicSendPaused(false);
            
            setIsActive(false);
            isActiveRef.current = false;
            
            // Only auto-reconnect if it dropped unexpectedly (not stopping gracefully)
            if (wasActive && !wasStopping) {
              console.log("Connection dropped unexpectedly. Auto-reconnecting in 1.5s...");
              setStatus("Reconnecting...");
              setTimeout(() => {
                if (!isStoppingRef.current) startAssistant();
              }, 1500);
            } else if (wasStopping || s === "Disconnected") {
              setStatus("Idle");
            }
          }
        }
      );
    } catch (err) {
      console.error("AI Start Error:", err);
      setStatus("Error");
      setIsConnecting(false);
      isConnectingRef.current = false;
    }
  };

  /** Sessiyani butunlay yopish (WebSocket + mikrofon). Tugma faqat mikrofon tinglashini almashtiradi. */
  const stopAssistantFully = () => {
    isStoppingRef.current = true;
    setMicSendPaused(false);
    setIsStopping(true);
    setStatus("Yopilmoqda...");
    assistantRef.current?.stop();
  };

  /** Asosiy tugma: yoqilmagan bo'lsa — ulanish; jonli bo'lsa — serverga mikrofon yuborishni yoqish/o'chirish (AI javobi davom etadi) */
  const toggleAssistant = async () => {
    if (isConnecting) return;

    if (!isActive) {
      setMicSendPaused(false);
      setIsStopping(false);
      isStoppingRef.current = false;
      await startAssistant();
      return;
    }

    setMicSendPaused((prev) => !prev);
  };

  return (
    <div className="fixed bottom-24 md:bottom-6 right-2 md:right-6 z-[100] flex flex-col items-end pointer-events-none gap-4">
      {/* Settings Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
            className="mb-2 w-72 bg-zinc-950/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-6 pointer-events-auto overflow-hidden relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent opacity-50" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-bold tracking-tight">Boshqaruv Paneli</h3>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-zinc-400" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Auto Nav Toggle */}
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/20 rounded-lg text-orange-500">
                      <Settings className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">Avto-Navigatsiya</p>
                      <p className="text-[10px] text-zinc-400">{isAutoNav ? "Yoqilgan" : "O'chirilgan"}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsAutoNav(!isAutoNav)}
                    className={`w-10 h-5 rounded-full transition-colors relative ${isAutoNav ? "bg-orange-600" : "bg-zinc-700"}`}
                  >
                    <motion.div 
                      animate={{ x: isAutoNav ? 22 : 2 }}
                      className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm"
                    />
                  </button>
                </div>

                {/* Mute Toggle */}
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isMuted ? "bg-red-500/20 text-red-500" : "bg-green-500/20 text-green-500"}`}>
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">Ovozni o'chirish</p>
                      <p className="text-[10px] text-zinc-400">{isMuted ? "Ovoz o'chirilgan" : "Ovoz yoqilgan"}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className={`w-10 h-5 rounded-full transition-colors relative ${isMuted ? "bg-red-600" : "bg-zinc-700"}`}
                  >
                    <motion.div 
                      animate={{ x: isMuted ? 22 : 2 }}
                      className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm"
                    />
                  </button>
                </div>

                {/* Last Transcript Display */}
                <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-3 h-3 text-zinc-400" />
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Oxirgi muloqot</p>
                  </div>
                  <div className="max-h-20 overflow-y-auto custom-scrollbar">
                    <p className="text-xs text-zinc-300 leading-relaxed italic">
                      {lastTranscript || "Hozircha muloqot yo'q..."}
                    </p>
                  </div>
                </div>

                {/* Status indicator */}
                <div className="flex items-center gap-2 pt-2">
                  <div className={`w-2 h-2 rounded-full ${status === "Connected" ? "bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-zinc-600"}`} />
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Status: {status}</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    stopAssistantFully();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider hover:bg-red-500/20 transition-colors"
                >
                  <Power className="w-4 h-4" />
                  Yordamchini to'liq yopish
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Boshqaruv paneli"
          onClick={() => setIsOpen((o) => !o)}
          className="pointer-events-auto p-3 rounded-full bg-zinc-900/90 backdrop-blur-md border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-colors shadow-lg"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* AI Orb Button */}
        <div className="relative cursor-pointer group pointer-events-auto" onClick={toggleAssistant}>
          <AnimatePresence>
            {isActive && !micSendPaused && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ 
                  opacity: [0.2, 0.4, 0.2], 
                  scale: [1, 1.4, 1],
                  filter: ["blur(20px)", "blur(40px)", "blur(20px)"]
                } as any}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                transition={{ 
                  opacity: { repeat: Infinity, duration: 2 },
                  scale: { repeat: Infinity, duration: 2 },
                  filter: { repeat: Infinity, duration: 2 }
                }}
                className="absolute inset-0 bg-gradient-to-tr from-orange-600 to-amber-400 rounded-full -z-10"
              />
            )}
          </AnimatePresence>

          <motion.div
            animate={isActive ? {
              y: [0, -8, 0],
              scale: [1, 1.05, 1],
            } : {
              y: [0, -4, 0]
            }}
            transition={{
              repeat: Infinity,
              duration: isActive && !micSendPaused ? 2 : 4,
              ease: "easeInOut"
            }}
            whileHover={{ scale: 1.1 }}
            className={`relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center rounded-full overflow-hidden transition-all duration-500 
              ${isActive && micSendPaused ? "bg-gradient-to-br from-amber-900/90 to-zinc-900 border-2 border-amber-500/60 shadow-[0_0_24px_rgba(245,158,11,0.25)]" : isStopping ? "bg-zinc-800 border-orange-500 border-2" : 
                isActive ? "bg-gradient-to-br from-orange-500 to-amber-600 shadow-[0_0_30px_rgba(234,88,12,0.4)]" : "bg-zinc-900/80 backdrop-blur-md border border-white/10"}`}
          >
            {/* Orb Interior Visuals */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]" />
               {isActive && (
                 <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                   className="absolute inset-0 border-t border-r border-white/20 rounded-full"
                 />
               )}
            </div>

            <div className="flex items-center justify-center relative z-10 pb-2">
              <AnimatePresence>
                {isStopping ? (
                  <motion.div
                    key="stopping"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1, rotate: 360 }}
                    transition={{ 
                      scale: { duration: 0.2 },
                      opacity: { duration: 0.2 },
                      rotate: { duration: 2, repeat: Infinity, ease: "linear" }
                    }}
                    exit={{ scale: 0.5, opacity: 0, transition: { duration: 0.2 } }}
                    className="absolute"
                  >
                    <Mic className="w-6 h-6 md:w-8 md:h-8 text-orange-500 drop-shadow-md" />
                  </motion.div>
                ) : isActive && micSendPaused ? (
                  <motion.div
                    key="paused"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    exit={{ scale: 0.5, opacity: 0, transition: { duration: 0.2 } }}
                    className="absolute"
                  >
                    <MicOff className="w-6 h-6 md:w-8 md:h-8 text-amber-300 drop-shadow-lg" />
                  </motion.div>
                ) : isActive ? (
                  <motion.div
                    key="active"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    exit={{ scale: 0.5, opacity: 0, transition: { duration: 0.2 } }}
                    className="absolute"
                  >
                    <Mic className="w-6 h-6 md:w-8 md:h-8 text-white drop-shadow-lg" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="inactive"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    exit={{ scale: 0.5, opacity: 0, transition: { duration: 0.2 } }}
                    className="absolute"
                  >
                    <MicOff className="w-6 h-6 md:w-8 md:h-8 text-zinc-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Status Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/20 backdrop-blur-sm border border-white/5 max-w-[95%]">
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isStopping ? "bg-orange-500 animate-pulse" : isActive && micSendPaused ? "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]" : isActive ? "bg-green-500 shadow-[0_0_8px_#22c55e]" : "bg-zinc-600"}`} />
              <span className="text-[7px] font-bold text-white/70 uppercase tracking-tighter truncate">
                {isConnecting ? "Ulanmoqda" : isStopping ? "Yopilmoqda" : isActive && micSendPaused ? "Mik o'chiq" : isActive ? "Tinglash" : "Kutish"}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
