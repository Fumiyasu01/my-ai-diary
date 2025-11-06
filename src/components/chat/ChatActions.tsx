import React, { useState } from 'react';
import { ConversationData } from '../../types';

interface ChatActionsProps {
  currentConversation: ConversationData | null;
  onClearConversation: () => void;
  onUpdateTitle: (title: string) => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const ChatActions: React.FC<ChatActionsProps> = ({
  currentConversation,
  onClearConversation,
  onUpdateTitle,
  onToggleSidebar,
  isSidebarOpen,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleTitleEdit = () => {
    setTitleInput(currentConversation?.title || '');
    setIsEditingTitle(true);
  };

  const handleTitleSave = () => {
    if (titleInput.trim()) {
      onUpdateTitle(titleInput.trim());
    }
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setIsEditingTitle(false);
    setTitleInput('');
  };

  const handleClear = () => {
    setShowClearConfirm(true);
  };

  const confirmClear = () => {
    onClearConversation();
    setShowClearConfirm(false);
  };

  const messageCount = currentConversation?.conversations.length || 0;
  const displayTitle = currentConversation?.title || `${currentConversation?.date}の会話`;

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Sidebar Toggle */}
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={isSidebarOpen ? 'サイドバーを閉じる' : 'サイドバーを開く'}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isSidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Title */}
          <div className="flex-1 min-w-0">
            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleTitleSave();
                    if (e.key === 'Escape') handleTitleCancel();
                  }}
                  className="flex-1 px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <button
                  onClick={handleTitleSave}
                  className="p-1 text-blue-500 hover:text-blue-600"
                  aria-label="保存"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button
                  onClick={handleTitleCancel}
                  className="p-1 text-gray-500 hover:text-gray-600"
                  aria-label="キャンセル"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group">
                <h2 className="text-lg font-semibold text-gray-900 truncate">
                  {displayTitle}
                </h2>
                <button
                  onClick={handleTitleEdit}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-all"
                  aria-label="タイトルを編集"
                >
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
                <span className="text-sm text-gray-500">
                  ({messageCount}件)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Clear Button */}
          {messageCount > 0 && (
            <button
              onClick={handleClear}
              className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              aria-label="会話をクリア"
              title="会話をクリア"
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
          )}
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              会話をクリアしますか？
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              この操作は取り消せません。{messageCount}件のメッセージが削除されます。
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={confirmClear}
                className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
              >
                クリア
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatActions;
