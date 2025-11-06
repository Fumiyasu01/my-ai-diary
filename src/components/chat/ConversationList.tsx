import React, { useState } from 'react';
import { ConversationData } from '../../types';
import { parseDateString } from '../../utils/date';

interface ConversationListProps {
  conversations: ConversationData[];
  currentConversation: ConversationData | null;
  onSelectConversation: (conversationId: string) => void;
  onCreateNew: () => void;
  onDeleteConversation: (conversationId: string) => void;
  onSearch: (query: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  currentConversation,
  onSelectConversation,
  onCreateNew,
  onDeleteConversation,
  onSearch,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleDelete = (conversationId: string) => {
    setShowDeleteConfirm(conversationId);
  };

  const confirmDelete = (conversationId: string) => {
    onDeleteConversation(conversationId);
    setShowDeleteConfirm(null);
  };

  const formatDate = (dateString: string): string => {
    const date = parseDateString(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateString === today.toISOString().split('T')[0]) {
      return '今日';
    } else if (dateString === yesterday.toISOString().split('T')[0]) {
      return '昨日';
    }

    return date.toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getConversationPreview = (conv: ConversationData): string => {
    if (conv.conversations.length === 0) return '会話なし';
    const lastMessage = conv.conversations[conv.conversations.length - 1];
    return lastMessage.content.slice(0, 50) + (lastMessage.content.length > 50 ? '...' : '');
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={onCreateNew}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          + 新しい会話
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="会話を検索..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <p>会話がありません</p>
            <p className="text-sm mt-2">新しい会話を始めましょう</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {conversations.map((conv) => (
              <div key={conv.id} className="relative">
                <button
                  onClick={() => onSelectConversation(conv.id)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                    currentConversation?.id === conv.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-500 font-medium">
                          {formatDate(conv.date)}
                        </span>
                        <span className="text-xs text-gray-400">
                          {conv.conversations.length}件
                        </span>
                      </div>
                      <h3 className="font-medium text-gray-900 truncate">
                        {conv.title || `${conv.date}の会話`}
                      </h3>
                      <p className="text-sm text-gray-600 truncate mt-1">
                        {getConversationPreview(conv)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(conv.id);
                      }}
                      className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </button>

                {/* Delete Confirmation */}
                {showDeleteConfirm === conv.id && (
                  <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center p-4 z-10">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900 mb-3">削除しますか？</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => confirmDelete(conv.id)}
                          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                        >
                          削除
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(null)}
                          className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                        >
                          キャンセル
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
