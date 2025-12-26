import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Google Generative AI with API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Generation configuration for text generation
const generationConfig = {
  temperature: 0.9,
  topP: 0.8,
  topK: 40,
  maxOutputTokens: 2048,
};

// Model setup for text and vision
const textModel = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",  // Updated model name
  generationConfig,
});

const visionModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",  // Updated to latest vision model
  generationConfig: {
    ...generationConfig,
    maxOutputTokens: 4096,  // Increased for better analysis
  },
});

let chatSession = null;

// Initialize a chat session with text model
export const initializeChatSession = () => {
  chatSession = textModel.startChat({
    generationConfig,
    history: [],
  });
  return chatSession;
};

export const generateResponse = async (prompt, imageData = null) => {
  try {
    if (imageData) {
      // For image analysis, use vision model with updated prompt format
      const base64Data = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(imageData);
      });

      const result = await visionModel.generateContent({
        contents: [{
          parts: [
            { text: `
              Please analyze this medical report image and provide a structured response in the following format:
              
              ## EXTRACTED DATA
              List all visible text and values from the image in a structured format.
              
              ## MEASUREMENTS & RESULTS
              List all test results with their values and units.
              
              ## REFERENCE RANGES
              List all reference ranges and normal values mentioned.
              
              ## INTERPRETATION
              Provide a brief interpretation of the results.
              
              Please format the response using markdown for better readability.
            `},
            {
              inlineData: {
                mimeType: imageData.type,
                data: base64Data.split(',')[1]
              }
            }
          ]
        }]
      });

      const response = await result.response;
      return response.text();
    } else {
      // For text analysis
      if (!chatSession) {
        chatSession = initializeChatSession();
      }
      const result = await chatSession.sendMessage(`
        Please analyze this medical data and provide a response in the following format:
        
        ## ANALYSIS SUMMARY
        Brief overview of the findings.
        
        ## KEY FINDINGS
        List of significant results.
        
        ## RECOMMENDATIONS
        Suggested actions based on the results.
        
        ## MEDICAL CONTEXT
        Relevant medical guidelines and context.
        
        Content to analyze:
        ${prompt}
      `);
      return result.response.text();
    }
  } catch (error) {
    console.error("Detailed error:", error);
    if (error.message.includes('quota')) {
      throw new Error('API quota exceeded. Please try again later.');
    }
    throw new Error(`AI Processing Error: ${error.message}`);
  }
};
