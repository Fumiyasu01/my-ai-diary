import React from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

interface MessageData {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatViewProps {
  messages: MessageData[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

const ChatView: React.FC<ChatViewProps> = ({ messages, onSendMessage, isLoading = false }) => {
  return (
    <div className="flex flex-col flex-1 bg-gray-50">
      <MessageList messages={messages} />
      
      {isLoading && (
        <div className="px-4 py-2 bg-white border-t border-gray-100">
          <div className="flex items-center gap-2 text-gray-500">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
            <span className="text-sm">AIが入力中...</span>
          </div>
        </div>
      )}
      
      <MessageInput onSendMessage={onSendMessage} disabled={isLoading} />
    </div>
  );
};

export default ChatView;