import { useState, useEffect, useRef } from 'react';

export function useVoice(onTranscript: (newInput: string) => void, currentInput: string) {
  const [isListening, setIsListening] = useState(false);
  const speechRecognitionRef = useRef<any>(null);
  const baselineInputRef = useRef('');

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const sr = new SR();
    sr.continuous = true;
    sr.interimResults = true;

    sr.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      onTranscript(baselineInputRef.current + (baselineInputRef.current ? ' ' : '') + currentTranscript);
    };

    sr.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    sr.onend = () => {
      setIsListening(false);
    };

    speechRecognitionRef.current = sr;
  }, [onTranscript]);

  const toggleListening = () => {
    const sr = speechRecognitionRef.current;
    if (!sr) {
      alert('Voice input is not supported in this browser (try Chrome/Edge).');
      return;
    }

    if (isListening) {
      sr.stop();
      setIsListening(false);
    } else {
      try {
        baselineInputRef.current = currentInput;
        sr.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  };

  return { isListening, toggleListening };
}
