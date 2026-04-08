import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = "AIzaSyAlSTWMw2gEWvDi8pFdprb0JKB_F1yv_8k";
const ai = new GoogleGenAI({ apiKey: apiKey });

async function run() {
  try {
    const listResult = await ai.models.list();
    for await (const model of listResult) {
      if (model.name.includes("2.5") || model.name.includes("2.0")) {
        console.log(model.name, " - ", model.supportedGenerationMethods);
      }
    }
  } catch(e) {
    console.log("Error:", e.message);
  }
}

run();
