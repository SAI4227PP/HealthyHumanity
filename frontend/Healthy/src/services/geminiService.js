import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const generationConfig = {
  temperature: 0.9,
  topP: 0.8,
  topK: 40,
  maxOutputTokens: 2048,
};

const model = genAI.getGenerativeModel({
  model: "gemini-pro",
  generationConfig,
});

let chatSession = null;

export const initializeChatSession = () => {
  chatSession = model.startChat({
    generationConfig,
    history: [],
  });
  return chatSession;
};

export const generateResponse = async (prompt) => {
  try {
    if (!chatSession) {
      chatSession = initializeChatSession();
    }
    const result = await chatSession.sendMessage(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error generating response:", error);
    throw error;
  }
};
