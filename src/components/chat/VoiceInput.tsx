import React, { useState, useEffect, useRef } from 'react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  onError: (error: string) => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, onError }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if browser supports Web Speech API
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'ja-JP';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPart;
        } else {
          interimTranscript += transcriptPart;
        }
      }

      setTranscript(finalTranscript || interimTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);

      switch (event.error) {
        case 'no-speech':
          onError('音声が検出されませんでした');
          break;
        case 'audio-capture':
          onError('マイクにアクセスできません');
          break;
        case 'not-allowed':
          onError('マイクの使用が許可されていません');
          break;
        default:
          onError('音声認識エラーが発生しました');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      if (transcript.trim()) {
        onTranscript(transcript.trim());
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [transcript, onTranscript, onError]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Failed to start recognition:', error);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const isSupported = ('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window);

  if (!isSupported) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={isListening ? stopListening : startListening}
        className={`p-2 rounded-lg transition-all ${
          isListening
            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
        }`}
        title={isListening ? '音声入力を停止' : '音声入力を開始'}
      >
        {isListening ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 6h12v12H6z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        )}
      </button>

      {/* Listening Indicator */}
      {isListening && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-red-500 text-white text-sm rounded-lg shadow-lg whitespace-nowrap">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <span className="w-1 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></span>
            </div>
            <span>聞き取り中...</span>
          </div>
          {transcript && (
            <p className="mt-1 text-xs opacity-90">{transcript}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default VoiceInput;
