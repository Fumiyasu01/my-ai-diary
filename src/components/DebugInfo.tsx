import React from 'react';

interface DebugInfoProps {
  agentName: string;
  agentPersonality: string;
  hasApiKey: boolean;
}

const DebugInfo: React.FC<DebugInfoProps> = ({
  agentName,
  agentPersonality,
  hasApiKey,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-800 text-white px-3 py-1 rounded text-xs hover:bg-gray-700 transition-colors"
      >
        {isOpen ? '設定を隠す' : '現在の設定を表示'}
      </button>
      
      {isOpen && (
        <div className="mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">現在のAI設定</h3>
          <div className="space-y-2 text-xs">
            <div>
              <span className="font-medium text-gray-600">名前:</span>
              <span className="ml-2 text-gray-800">{agentName}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">性格設定:</span>
              <p className="mt-1 text-gray-800 whitespace-pre-wrap bg-gray-50 p-2 rounded">
                {agentPersonality}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600">APIキー:</span>
              <span className={`ml-2 ${hasApiKey ? 'text-green-600' : 'text-red-600'}`}>
                {hasApiKey ? '✓ 設定済み' : '✗ 未設定'}
              </span>
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            この設定がAIの応答に反映されます
          </p>
        </div>
      )}
    </div>
  );
};

export default DebugInfo;