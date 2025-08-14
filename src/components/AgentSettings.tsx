import React, { useState, useEffect } from 'react';

interface AgentSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  agentName: string;
  agentPersonality: string;
  onSave: (name: string, personality: string) => void;
}

const AgentSettings: React.FC<AgentSettingsProps> = ({
  isOpen,
  onClose,
  agentName,
  agentPersonality,
  onSave,
}) => {
  const [name, setName] = useState(agentName);
  const [personality, setPersonality] = useState(agentPersonality);

  // Update local state when props change
  useEffect(() => {
    setName(agentName);
    setPersonality(agentPersonality);
  }, [agentName, agentPersonality, isOpen]);

  const handleSave = () => {
    onSave(name, personality);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">AIエージェント設定</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          <div>
            <label htmlFor="agent-name" className="block text-sm font-medium text-gray-700 mb-2">
              エージェント名
            </label>
            <input
              id="agent-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: みゆき"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            <p className="mt-1 text-xs text-gray-500">
              AIエージェントの呼び名を設定します
            </p>
          </div>

          <div>
            <label htmlFor="agent-personality" className="block text-sm font-medium text-gray-700 mb-2">
              性格・話し方の設定
            </label>
            <textarea
              id="agent-personality"
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              placeholder="例: 優しくて聞き上手な30代の女性で、関西弁で話す。時々冗談を言って和ませてくれる。悩み事には共感してからアドバイスをくれる。"
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              AIの性格や話し方を自由に設定できます。詳しく書くほど、あなた好みのAIになります。
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">設定例</h3>
            <ul className="space-y-2 text-xs text-blue-700">
              <li>• 明るく元気な20代女性。語尾に「〜だよ！」をつける</li>
              <li>• 冷静で論理的な男性。丁寧語で話し、的確なアドバイスをする</li>
              <li>• 優しいお姉さんキャラ。共感を大切にし、励ましの言葉をかけてくれる</li>
            </ul>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentSettings;