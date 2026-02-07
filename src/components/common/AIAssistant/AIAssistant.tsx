import React, { useState, useRef, useEffect } from "react";
import "./AIAssistant.css";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";
import useSpeechSynthesis from "@/hooks/useSpeechSynthesis";
import { aiAssistantApi } from "@/services/aiAssistant.api";
import type { AIMessage, BrowserSupportStatus } from "@/types/aiAssistant.types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { sanitizeForSpeech } from "@/utils/sanitizeForSpeech";

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "ur" | "ur-roman">("en");
  const [isLoading, setIsLoading] = useState(false);
  const [hasWelcomed, setHasWelcomed] = useState(false);
  const [browserSupport, setBrowserSupport] = useState<BrowserSupportStatus>({
    speechRecognition: true,
    speechSynthesis: true,
    webSpeechAPI: true,
  });

  const [hasAutoSent, setHasAutoSent] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  const speechRecognition = useSpeechRecognition();
  const speechSynthesis = useSpeechSynthesis();

  // Check browser support
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    const hasSynthesis = typeof window !== "undefined" && "speechSynthesis" in window;

    setBrowserSupport({
      speechRecognition: !!SpeechRecognition,
      speechSynthesis: hasSynthesis,
      webSpeechAPI: !!SpeechRecognition && hasSynthesis,
    });
  }, []);

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Welcome message on first open
  useEffect(() => {
    if (isOpen && !hasWelcomed && !isLoading) {
      handleWelcome();
    }
  }, [isOpen]);

  const handleWelcome = async () => {
    try {
      setIsLoading(true);
      const welcomeResponse = await aiAssistantApi.getWelcomeMessage(currentLanguage);
console.log("Welcome response:", welcomeResponse);
      const welcomeMessage: AIMessage = {
        id: `msg-${Date.now()}`,
        text: welcomeResponse.data.reply,
        sender: "assistant",
        timestamp: new Date(),
        language: welcomeResponse.data.language as "en" | "ur" | "ur-roman",
        audio: welcomeResponse.data.audio,
      };

      setMessages([welcomeMessage]);

      // Determine language for TTS
      const ttsLanguage =
        welcomeResponse.data.language === "ur" ? "ur-PK" : "en-US";

      // Speak welcome message
      if (browserSupport.speechSynthesis) {
       speechSynthesis.speak(
  sanitizeForSpeech(welcomeResponse.data.reply),
  ttsLanguage,
  {
    rate: 0.9,
    pitch: 1.1,
    volume: 1,
  }
);
      }

      setHasWelcomed(true);
    } catch (error) {
      console.error("Welcome error:", error);
      const errorMsg: AIMessage = {
        id: `msg-${Date.now()}`,
        text: "Hello! How can I help you today?",
        sender: "assistant",
        timestamp: new Date(),
        language: currentLanguage,
      };
      setMessages([errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!inputValue.trim() || isLoading || speechSynthesis.isSpeaking) return;

  const userMessage: AIMessage = {
    id: `msg-${Date.now()}`,
    text: inputValue,
    sender: "user",
    timestamp: new Date(),
    language: currentLanguage,
  };

  // 1ï¸âƒ£ Add user message ONCE
  setMessages(prev => [...prev, userMessage]);
  setInputValue("");
  setIsLoading(true);

  try {
    const response = await aiAssistantApi.sendMessage(
      userMessage.text,
      currentLanguage
    );
    console.log("Assistant response:", response);

    const assistantMessage: AIMessage = {
      id: `msg-${Date.now() + 1}`,
      text: response.data.reply,
      sender: "assistant",
      timestamp: new Date(),
      language: response.data.language as "en" | "ur" | "ur-roman",
      audio: response.data.audio,
    };

    // 2ï¸âƒ£ Add assistant message ONCE
    setMessages(prev => [...prev, assistantMessage]);

    if (response.data.language === "ur") {
      setCurrentLanguage("ur");
    }

  } catch (error) {
    const errorMessage: AIMessage = {
      id: `msg-${Date.now() + 1}`,
      text: "Sorry, I couldn't process that. Please try again.",
      sender: "assistant",
      timestamp: new Date(),
      language: currentLanguage,
    };

    // 3ï¸âƒ£ Add error message ONCE
    setMessages(prev => [...prev, errorMessage]);
    console.error("Message error:", error);
  } finally {
    setIsLoading(false);
    inputRef.current?.focus();
  }
};


  const handleMicrophoneClick = () => {
    if (!browserSupport.speechRecognition) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    if (speechRecognition.isListening) {
      speechRecognition.stopListening();
    } else {
      const langMap: { [key: string]: string } = {
        en: "en-US",
        ur: "ur-PK",
        "ur-roman": "ur-PK",
      };

      speechRecognition.resetTranscript();
      speechRecognition.startListening(langMap[currentLanguage] || "en-US");
    }
  };

  // Handle speech recognition completion
  useEffect(() => {
    if (
      !speechRecognition.isListening &&
      speechRecognition.transcript &&
      !isLoading &&
      !hasAutoSent
    ) {
      setHasAutoSent(true);
      setInputValue(speechRecognition.transcript);
      // Auto-send after recognition stops
      setTimeout(() => {
        const form = document.querySelector(
          ".ai-assistant-input-form"
        ) as HTMLFormElement;
        if (form) {
          form.dispatchEvent(new Event("submit", { bubbles: true }));
        }
        // Reset the flag after sending
        setTimeout(() => {
          setHasAutoSent(false);
          speechRecognition.resetTranscript();
        }, 100);
      }, 500);
    }
  }, [speechRecognition.isListening, speechRecognition.transcript, isLoading, hasAutoSent]);

  const handleLanguageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCurrentLanguage(e.target.value as "en" | "ur" | "ur-roman");
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const stopCurrentAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    audioRef.current = null;
    setPlayingMessageId(null);
    setIsAudioPlaying(false);
  };

  const playMessageAudio = (messageId: string, base64: string) => {
    // Toggle pause/resume for the same message
    if (audioRef.current && playingMessageId === messageId) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsAudioPlaying(true);
      } else {
        audioRef.current.pause();
        setIsAudioPlaying(false);
      }
      return;
    }

    // Stop any other audio first
    stopCurrentAudio();

    const audioBlob = new Blob(
      [Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))],
      { type: "audio/wav" }
    );
    const url = URL.createObjectURL(audioBlob);
    const audio = new Audio(url);

    audioUrlRef.current = url;
    audioRef.current = audio;
    setPlayingMessageId(messageId);
    setIsAudioPlaying(true);

    audio.onended = () => {
      stopCurrentAudio();
    };
    audio.onerror = () => {
      stopCurrentAudio();
    };

    audio.play();
  };

  if (!browserSupport.webSpeechAPI) {
    return null; // Don't render if Web Speech API is not supported
  }

  return (
    <div className={`ai-assistant ${isOpen ? "open" : "closed"}`}>
      {/* Chat Container */}
      <div className="ai-assistant-container">
        {/* Header */}
        <div className="ai-assistant-header">
          <div className="ai-assistant-title">
            <h3>Support Assistant</h3>
            <p className="ai-assistant-status">
              {speechSynthesis.isSpeaking
                ? "Speaking..."
                : speechRecognition.isListening
                  ? "Listening..."
                  : isLoading
                    ? "Processing..."
                    : "Online"}
            </p>
          </div>
          <button
            className="ai-assistant-close"
            onClick={toggleOpen}
            aria-label="Close assistant"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <path
                d="M3.5 3.5L12.5 12.5M12.5 3.5L3.5 12.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Messages Area */}
        <div className="ai-assistant-messages">
          {messages.length === 0 ? (
            <div className="ai-assistant-empty">
              <p>Start a conversation with our AI assistant</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`ai-assistant-message ${message.sender}`}
              >
                <div className="ai-assistant-message-content markdown">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.text}
                  </ReactMarkdown>
                </div>
                {message.sender === "assistant" && message.audio && (
                  <button
                    type="button"
                    onClick={() => playMessageAudio(message.id, message.audio!)}
                    className="ai-assistant-play-btn"
                    aria-pressed={
                      playingMessageId === message.id && isAudioPlaying
                    }
                  >
                    {playingMessageId === message.id && isAudioPlaying
                      ? "Pause"
                      : "Play"}
                  </button>
                )}
              </div>
            ))
          )}
          {isLoading && (
            <div className="ai-assistant-message assistant ai-assistant-typing">
              <div className="ai-assistant-message-content">
                <span className="ai-assistant-typing-dots" aria-label="AI is typing">
                  <span className="ai-assistant-typing-dot" />
                  <span className="ai-assistant-typing-dot" />
                  <span className="ai-assistant-typing-dot" />
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Language Selector */}
        <div className="ai-assistant-controls">
          <select
            value={currentLanguage}
            onChange={handleLanguageChange}
            className="ai-assistant-language-select"
            disabled={isLoading || speechSynthesis.isSpeaking}
          >
            <option value="en">English</option>
            <option value="ur">Urdu</option>
            <option value="ur-roman">Roman Urdu</option>
          </select>
        </div>

        {/* Input Area */}
        <form
          className="ai-assistant-input-form"
          onSubmit={handleSendMessage}
        >
          <div className="ai-assistant-input-group">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                speechRecognition.isListening
                  ? "Listening..."
                  : "Type or speak your message..."
              }
              disabled={
                isLoading ||
                speechSynthesis.isSpeaking ||
                speechRecognition.isListening
              }
              className="ai-assistant-input"
              maxLength={1000}
            />
            <button
              type="button"
              onClick={handleMicrophoneClick}
              disabled={
                isLoading ||
                speechSynthesis.isSpeaking ||
                !browserSupport.speechRecognition
              }
              className={`ai-assistant-mic-btn ${
                speechRecognition.isListening ? "active" : ""
              }`}
              aria-label="Voice input"
              title={
                browserSupport.speechRecognition
                  ? "Click to use voice input"
                  : "Speech recognition not supported"
              }
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z"
                  fill="currentColor"
                />
                <path
                  d="M5 11a1 1 0 1 0-2 0 9 9 0 0 0 8 8.94V22a1 1 0 1 0 2 0v-2.06A9 9 0 0 0 21 11a1 1 0 1 0-2 0 7 7 0 0 1-14 0Z"
                  fill="currentColor"
                />
              </svg>
            </button>
            <button
              type="submit"
              disabled={
                isLoading ||
                speechSynthesis.isSpeaking ||
                !inputValue.trim()
              }
              className="ai-assistant-send-btn"
              aria-label="Send message"
            >
              {isLoading ? (
                "Sending..."
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M3.4 20.6 21 12 3.4 3.4 5.6 11l9.6 1-9.6 1-2.2 7.6Z"
                    fill="currentColor"
                  />
                </svg>
              )}
            </button>
          </div>
          {speechRecognition.interimTranscript && (
            <small className="ai-assistant-interim">
              {speechRecognition.interimTranscript}
            </small>
          )}
          {speechRecognition.error && (
            <small className="ai-assistant-error">
              {speechRecognition.error}
            </small>
          )}
        </form>
      </div>

      {/* Floating Button */}
      <button
        className="ai-assistant-toggle"
        onClick={toggleOpen}
        aria-label="Toggle AI Assistant"
        title="AI Support Assistant"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M4 4h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  );
};

export default AIAssistant;

