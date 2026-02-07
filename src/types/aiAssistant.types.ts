export interface AIMessage {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
  language: "en" | "ur" | "ur-roman";
  audio?: string;
}

export interface AssistantResponse {
  success: boolean;
  data: {
    reply: string;
    language: "en" | "ur";
    audio?: string;
  };
}

export interface SpeechRecognitionConfig {
  language: string;
  continuous: boolean;
  interimResults: boolean;
}

export interface SpeechSynthesisConfig {
  language: string;
  rate: number;
  pitch: number;
  volume: number;
}

export interface AIAssistantState {
  isOpen: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  isLoading: boolean;
  currentLanguage: "en" | "ur" | "ur-roman";
  error: string | null;
}

export interface BrowserSupportStatus {
  speechRecognition: boolean;
  speechSynthesis: boolean;
  webSpeechAPI: boolean;
}
