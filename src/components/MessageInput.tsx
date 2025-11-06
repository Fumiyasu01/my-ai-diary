import React, { useState, useRef, KeyboardEvent } from 'react';
import VoiceInput from './chat/VoiceInput';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  onError?: (error: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled = false, onError }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    setMessage((prev) => prev + transcript);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleVoiceError = (error: string) => {
    if (onError) {
      onError(error);
    } else {
      console.error('Voice input error:', error);
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white px-4 py-3">
      <div className="flex items-end gap-2">
        <VoiceInput
          onTranscript={handleVoiceTranscript}
          onError={handleVoiceError}
        />
        
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyPress={handleKeyPress}
            placeholder="メッセージを入力..."
            disabled={disabled}
            className="w-full resize-none rounded-2xl border border-gray-300 px-4 py-2 pr-12 focus:border-blue-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-500"
            rows={1}
            style={{ minHeight: '40px', maxHeight: '120px' }}
          />
        </div>
        
        <button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className={`p-2 rounded-full transition-all flex-shrink-0 ${
            message.trim() && !disabled
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          aria-label="Send message"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MessageInput;