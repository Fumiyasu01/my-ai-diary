import React, { useEffect, useRef } from 'react';
import Message from './Message';

interface MessageData {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface MessageListProps {
  messages: MessageData[];
  onRegenerateMessage?: () => void;
}

const MessageList: React.FC<MessageListProps> = ({ messages, onRegenerateMessage }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 bg-white">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-lg font-medium mb-2">会話を始めましょう</p>
          <p className="text-sm text-gray-400 text-center max-w-xs">
            AIエージェントに何でも話しかけてください。
            あなたの会話が自動的に日記になります。
          </p>
        </div>
      ) : (
        <>
          {messages.map((message, index) => {
            // Only allow regeneration for the last assistant message
            const isLastMessage = index === messages.length - 1;
            const canRegenerate = isLastMessage && message.role === 'assistant' && onRegenerateMessage;

            return (
              <Message
                key={message.id}
                role={message.role}
                content={message.content}
                timestamp={message.timestamp}
                onRegenerate={canRegenerate ? onRegenerateMessage : undefined}
              />
            );
          })}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};

export default MessageList;