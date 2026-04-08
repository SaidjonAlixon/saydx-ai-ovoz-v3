import { GoogleGenAI } from '@google/genai';

const apiKey = "AIzaSyDAJ2yi0Q7OOQ24VlCPy7QGWGzuilWYW3M";
const ai = new GoogleGenAI({ apiKey: apiKey });

async function run() {
  console.log("Testing text generation...");
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'hello',
    });
    console.log("Success:", response.text);
  } catch(e) {
    console.log("Text Gen Error:");
    console.log(e);
  }
}

run();
