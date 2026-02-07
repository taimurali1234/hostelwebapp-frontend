import { useState, useCallback, useRef, useEffect } from "react";

interface VoiceConfig {
  rate?: number;
  pitch?: number;
  volume?: number;
}

const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const synth = window.speechSynthesis;
    if (!synth) {
      setIsSupported(false);
      setError("Speech synthesis not supported in this browser");
    }
  }, []);

  const getFemaleVoice = useCallback((lang: string) => {
    const synth = window.speechSynthesis;
    if (!synth) return undefined;

    // Get voices and filter for female voice in the specified language
    const voices = synth.getVoices();
    
    // Map language codes to voice search terms
    const languageVoiceMap: { [key: string]: string[] } = {
      "en-US": ["Google US English Female", "Microsoft Zira", "Samantha"],
      "en-GB": ["Google UK English Female", "Daniel", "Victoria"],
      "ur-PK": ["Urdu", "Pakistan"],
      ur: ["Urdu"],
    };

    const voiceSearchTerms = languageVoiceMap[lang] || [];
    
    // Try to find a female voice
    for (const term of voiceSearchTerms) {
      const found = voices.find(
        (v) =>
          v.lang.includes(lang.split("-")[0]) &&
          v.name.toLowerCase().includes(term.toLowerCase())
      );
      if (found) return found;
    }

    // Fallback: get any voice in the language
    const fallback = voices.find((v) => v.lang.startsWith(lang.split("-")[0]));
    return fallback || voices[0];
  }, []);

  const speak = useCallback(
    (text: string, lang: string = "en-US", config?: VoiceConfig) => {
      const synth = window.speechSynthesis;
      if (!synth) {
        setError("Speech synthesis not available");
        return;
      }

      // Cancel any ongoing speech
      synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = config?.rate || 1;
      utterance.pitch = config?.pitch || 1;
      utterance.volume = config?.volume || 1;

      const voice = getFemaleVoice(lang);
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setError(null);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };

      utterance.onerror = (event: any) => {
        setError(`Speech synthesis error: ${event.error}`);
        console.error("Speech synthesis error:", event.error);
      };

      utteranceRef.current = utterance;
      synth.speak(utterance);
    },
    [getFemaleVoice]
  );

  const pause = useCallback(() => {
    const synth = window.speechSynthesis;
    if (synth && synth.speaking) {
      synth.pause();
      setIsPaused(true);
    }
  }, []);

  const resume = useCallback(() => {
    const synth = window.speechSynthesis;
    if (synth && synth.paused) {
      synth.resume();
      setIsPaused(false);
    }
  }, []);

  const stop = useCallback(() => {
    const synth = window.speechSynthesis;
    if (synth) {
      synth.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }, []);

  return {
    speak,
    pause,
    resume,
    stop,
    isSpeaking,
    isPaused,
    isSupported,
    error,
  };
};

export default useSpeechSynthesis;
