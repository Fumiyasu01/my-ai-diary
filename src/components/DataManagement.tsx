import React, { useState } from 'react';

interface DataManagementProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => Promise<void>;
  onImport: (file: File) => Promise<void>;
  onClearData: () => Promise<void>;
}

const DataManagement: React.FC<DataManagementProps> = ({
  isOpen,
  onClose,
  onExport,
  onImport,
  onClearData,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState('');

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport();
    } catch (error) {
      alert('データのエクスポートに失敗しました');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportError('');

    try {
      await onImport(file);
      alert('データのインポートが完了しました');
      onClose();
    } catch (error) {
      setImportError('データのインポートに失敗しました。ファイル形式を確認してください。');
    } finally {
      setIsImporting(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const handleClearData = async () => {
    if (window.confirm('本当にすべてのデータを削除しますか？この操作は取り消せません。')) {
      try {
        await onClearData();
        alert('すべてのデータが削除されました');
        onClose();
      } catch (error) {
        alert('データの削除に失敗しました');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">データ管理</h2>
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

        <div className="p-6 space-y-6">
          {/* Export Section */}
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-800 mb-2">データのエクスポート</h3>
            <p className="text-xs text-gray-600 mb-4">
              すべての会話と日記をJSONファイルとしてダウンロードします。
              バックアップやデータの移行に使用できます。
            </p>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  エクスポート中...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  エクスポート
                </span>
              )}
            </button>
          </div>

          {/* Import Section */}
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-800 mb-2">データのインポート</h3>
            <p className="text-xs text-gray-600 mb-4">
              以前にエクスポートしたJSONファイルからデータを復元します。
              既存のデータは上書きされます。
            </p>
            <label className="w-full block">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                disabled={isImporting}
                className="hidden"
              />
              <div className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer text-center disabled:bg-gray-300 disabled:cursor-not-allowed">
                {isImporting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    インポート中...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    ファイルを選択してインポート
                  </span>
                )}
              </div>
            </label>
            {importError && (
              <p className="mt-2 text-sm text-red-600">{importError}</p>
            )}
          </div>

          {/* Clear Data Section */}
          <div className="border border-red-200 rounded-lg p-4 bg-red-50">
            <h3 className="text-sm font-medium text-red-800 mb-2">すべてのデータを削除</h3>
            <p className="text-xs text-red-600 mb-4">
              すべての会話、日記、設定を完全に削除します。
              この操作は取り消せません。
            </p>
            <button
              onClick={handleClearData}
              className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                すべて削除
              </span>
            </button>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataManagement;
