import React, { useState, useEffect } from 'react';

interface DataManagementProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => Promise<void>;
  onImport: (file: File) => Promise<void>;
  onClearAll: () => Promise<void>;
  onExportDiaryMarkdown: () => Promise<void>;
  onExportDiaryHTML: () => Promise<void>;
  onExportDiaryPDF: () => Promise<void>;
  storageInfo: {
    conversationCount: number;
    diaryCount: number;
    totalSize: string;
  };
}

const DataManagement: React.FC<DataManagementProps> = ({
  isOpen,
  onClose,
  onExport,
  onImport,
  onClearAll,
  onExportDiaryMarkdown,
  onExportDiaryHTML,
  onExportDiaryPDF,
  storageInfo,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isExportingDiary, setIsExportingDiary] = useState<'markdown' | 'html' | 'pdf' | null>(null);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport();
      setMessage({ type: 'success', text: 'データをエクスポートしました' });
    } catch (error) {
      setMessage({ type: 'error', text: 'エクスポートに失敗しました' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      await onImport(file);
      setMessage({ type: 'success', text: 'データをインポートしました' });
    } catch (error) {
      setMessage({ type: 'error', text: 'インポートに失敗しました。ファイル形式を確認してください' });
    } finally {
      setIsImporting(false);
      e.target.value = ''; // Reset input
    }
  };

  const handleClearAll = async () => {
    try {
      await onClearAll();
      setMessage({ type: 'success', text: 'すべてのデータを削除しました' });
      setShowDeleteConfirm(false);
    } catch (error) {
      setMessage({ type: 'error', text: '削除に失敗しました' });
    }
  };

  const handleExportDiaryMarkdown = async () => {
    setIsExportingDiary('markdown');
    try {
      await onExportDiaryMarkdown();
      setMessage({ type: 'success', text: 'Markdown形式でエクスポートしました' });
    } catch (error) {
      setMessage({ type: 'error', text: 'エクスポートに失敗しました' });
    } finally {
      setIsExportingDiary(null);
    }
  };

  const handleExportDiaryHTML = async () => {
    setIsExportingDiary('html');
    try {
      await onExportDiaryHTML();
      setMessage({ type: 'success', text: 'HTML形式でエクスポートしました' });
    } catch (error) {
      setMessage({ type: 'error', text: 'エクスポートに失敗しました' });
    } finally {
      setIsExportingDiary(null);
    }
  };

  const handleExportDiaryPDF = async () => {
    setIsExportingDiary('pdf');
    try {
      await onExportDiaryPDF();
      setMessage({ type: 'success', text: 'PDF保存用ページを開きました' });
    } catch (error) {
      setMessage({ type: 'error', text: 'エクスポートに失敗しました' });
    } finally {
      setIsExportingDiary(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">マイデータ</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Success/Error Message */}
          {message && (
            <div
              className={`p-3 rounded-lg text-sm ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Storage Info */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              ストレージ使用状況
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">会話:</span>
                <span className="font-medium text-gray-800">{storageInfo.conversationCount}件</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">日記:</span>
                <span className="font-medium text-gray-800">{storageInfo.diaryCount}件</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                <span className="text-gray-700 font-medium">合計:</span>
                <span className="font-semibold text-blue-600">{storageInfo.totalSize}</span>
              </div>
            </div>
          </div>

          {/* Export */}
          <div className="space-y-2">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-800">データをエクスポート</p>
                  <p className="text-xs text-gray-500">JSON形式でバックアップ</p>
                </div>
              </div>
              {isExporting && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500" />
              )}
            </button>
          </div>

          {/* Import */}
          <div className="space-y-2">
            <label className="w-full flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-800">データをインポート</p>
                  <p className="text-xs text-gray-500">バックアップから復元</p>
                </div>
              </div>
              {isImporting && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500" />
              )}
              <input
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                disabled={isImporting}
                className="hidden"
              />
            </label>
          </div>

          {/* Diary Export Section */}
          <div className="pt-4 border-t border-gray-200 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              日記をエクスポート
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              閲覧・共有用の形式で日記をエクスポートできます
            </p>

            {/* Markdown Export */}
            <button
              onClick={handleExportDiaryMarkdown}
              disabled={isExportingDiary === 'markdown'}
              className="w-full flex items-center justify-between p-3 bg-white border border-purple-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-purple-100 rounded group-hover:bg-purple-200 transition-colors">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-800">Markdown形式</p>
                  <p className="text-xs text-gray-500">Notion・Obsidianなどで利用</p>
                </div>
              </div>
              {isExportingDiary === 'markdown' && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500" />
              )}
            </button>

            {/* HTML Export */}
            <button
              onClick={handleExportDiaryHTML}
              disabled={isExportingDiary === 'html'}
              className="w-full flex items-center justify-between p-3 bg-white border border-purple-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-purple-100 rounded group-hover:bg-purple-200 transition-colors">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-800">HTML形式</p>
                  <p className="text-xs text-gray-500">ブラウザで開ける・デザイン付き</p>
                </div>
              </div>
              {isExportingDiary === 'html' && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500" />
              )}
            </button>

            {/* PDF Export */}
            <button
              onClick={handleExportDiaryPDF}
              disabled={isExportingDiary === 'pdf'}
              className="w-full flex items-center justify-between p-3 bg-white border border-purple-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-purple-100 rounded group-hover:bg-purple-200 transition-colors">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-800">PDF形式</p>
                  <p className="text-xs text-gray-500">印刷・共有に最適</p>
                </div>
              </div>
              {isExportingDiary === 'pdf' && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500" />
              )}
            </button>
          </div>

          {/* Delete All */}
          <div className="pt-4 border-t border-gray-200">
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full flex items-center justify-between p-4 bg-white border-2 border-red-200 rounded-xl hover:border-red-300 hover:bg-red-50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800">すべてのデータを削除</p>
                    <p className="text-xs text-red-500">⚠️ この操作は取り消せません</p>
                  </div>
                </div>
              </button>
            ) : (
              <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4">
                <p className="text-sm font-medium text-red-800 mb-3">
                  本当にすべてのデータを削除しますか？
                </p>
                <p className="text-xs text-red-600 mb-4">
                  会話履歴、日記、設定がすべて削除されます。この操作は取り消せません。
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleClearAll}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    削除する
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataManagement;
