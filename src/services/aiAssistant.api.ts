import { type AssistantResponse } from "../types/aiAssistant.types";
import apiClient from "./apiClient";


export const aiAssistantApi = {
  
  async sendMessage(
    message: string,
    language: "en" | "ur" | "ur-roman" = "en"
  ): Promise<AssistantResponse> {
    try {
      // Normalize language code for backend
      const backendLanguage = language === "ur-roman" ? "ur" : language;

      const response = await apiClient.post<AssistantResponse>(
        `${import.meta.env.VITE_BACKEND_URL}/ai-assistant/chat`,
        {
          message: message.trim(),
          language: backendLanguage,
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error communicating with AI assistant:", error);
      // Fallback response for development - remove when backend is ready
      const backendLanguage = language === "ur-roman" ? "ur" : language;
      if (process.env.NODE_ENV === "development") {
        return {
          success: true,
          data: {
            reply:
              language === "ur"
                ? "معاف کیجیے، براہ کرم بعد میں دوبارہ کوشش کریں۔ ہماری ٹیم مسئلہ حل کر رہی ہے۔"
                : language === "ur-roman"
                  ? "Mujhe afsos hai, kripaya baad mein dobarah koshish Karen. Hamari team masla hal kar rahi hai."
                  : "I apologize, the assistant is currently unavailable. Our team is working on resolving this. Please try again shortly.",
            language: backendLanguage === "ur" ? "ur" : "en",
          },
        };
      }
      throw new Error(
        "Failed to get response from AI assistant. Please try again."
      );
    }
  },

  /**
   * Get initial welcome message from assistant
   * @param language - User's preferred language
   * @returns Promise with welcome message
   */
  async getWelcomeMessage(
    language: "en" | "ur" | "ur-roman" = "en"
  ): Promise<AssistantResponse> {
    try {
      const backendLanguage = language === "ur-roman" ? "ur" : language;

      const response = await apiClient.get<AssistantResponse>(
        `${import.meta.env.VITE_BACKEND_URL}/ai-assistant/welcome`,
        {
          params: {
            language: backendLanguage,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching welcome message:", error);
      // Return default welcome message if API fails
      const backendLanguage = language === "ur-roman" ? "ur" : language;
      return {
        success: true,
        data: {
          reply:
            language === "ur"
              ? "السلام وعليكم۔ میں آپ کی مدد کے لیے یہاں ہوں۔"
              : language === "ur-roman"
                ? "Assalamu Alaikum. Main aapki madad ke liye yahan hoon."
                : "Hello! I'm here to assist you with your booking needs.",
          language: backendLanguage === "ur" ? "ur" : "en",
        },
      };
    }
  },
};
