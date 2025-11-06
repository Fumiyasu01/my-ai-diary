import React from 'react';
import { MessageData } from '../types';

interface DiaryGeneratorProps {
  messages: MessageData[];
  onGenerate: () => void;
  isGenerating: boolean;
  hasApiKey: boolean;
}

const DiaryGenerator: React.FC<DiaryGeneratorProps> = ({
  messages,
  onGenerate,
  isGenerating,
  hasApiKey,
}) => {
  const canGenerate = messages.length >= 4 && hasApiKey; // 最低4つの会話が必要

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-700">
            今日の日記を生成
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {messages.length > 0 
              ? `${messages.length}件の会話から日記を作成します`
              : '会話を始めると日記が生成できます'}
          </p>
        </div>
        
        <button
          onClick={onGenerate}
          disabled={!canGenerate || isGenerating}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            canGenerate && !isGenerating
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isGenerating ? (
            <span className="flex items-center">
              <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              生成中...
            </span>
          ) : (
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              日記を生成
            </span>
          )}
        </button>
      </div>

      {!hasApiKey && messages.length > 0 && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-700">
            日記を生成するにはAPIキーの設定が必要です
          </p>
        </div>
      )}

      {messages.length < 4 && messages.length > 0 && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-700">
            あと{4 - messages.length}回会話すると日記が生成できます
          </p>
        </div>
      )}
    </div>
  );
};

export default DiaryGenerator;