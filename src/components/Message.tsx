import React, { useState } from 'react';

interface MessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  onRegenerate?: () => void;
}

const Message: React.FC<MessageProps> = ({ role, content, timestamp, onRegenerate }) => {
  const isUser = role === 'user';
  const [showCopied, setShowCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        <div className={`group relative ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
          <div
            className={`px-4 py-2 rounded-2xl ${
              isUser
                ? 'bg-blue-500 text-white rounded-br-sm'
                : 'bg-gray-100 text-gray-800 rounded-bl-sm'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
          </div>

          {/* Action Buttons */}
          <div className={`absolute ${isUser ? 'right-0' : 'left-0'} -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white rounded-lg shadow-md border border-gray-200 p-1`}>
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors relative"
              title="コピー"
            >
              {showCopied ? (
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>

            {/* Regenerate Button (only for assistant messages) */}
            {!isUser && onRegenerate && (
              <button
                onClick={onRegenerate}
                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                title="再生成"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}
          </div>

          <span className={`text-xs text-gray-500 mt-1 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {new Date(timestamp).toLocaleTimeString('ja-JP', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
        
        {isUser && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;