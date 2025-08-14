import React, { useState, useMemo } from 'react';
import CalendarView from './CalendarView';

interface DiaryEntry {
  id: string;
  date: string;
  summary: string;
  emotion: string[];
  keywords: string[];
  content?: string;
}

interface DiaryViewProps {
  entries: DiaryEntry[];
  selectedDate?: string;
}

const DiaryView: React.FC<DiaryViewProps> = ({ entries: allEntries, selectedDate: initialDate }) => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedDate, setSelectedDate] = useState<string | undefined>(initialDate);

  // Filter entries based on selected date
  const filteredEntries = useMemo(() => {
    if (!selectedDate || viewMode === 'list') {
      return allEntries;
    }
    return allEntries.filter(entry => entry.date === selectedDate);
  }, [allEntries, selectedDate, viewMode]);

  const getEmotionEmoji = (emotion: string): string => {
    const emotionMap: { [key: string]: string } = {
      '嬉しい': '😊',
      '楽しい': '😄',
      '悲しい': '😢',
      '怒り': '😠',
      '不安': '😟',
      '驚き': '😮',
      '感謝': '🙏',
      '達成感': '🎯',
      '疲れ': '😫',
      '普通': '😐',
    };
    return emotionMap[emotion] || '😊';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      weekday: 'long' 
    };
    return date.toLocaleDateString('ja-JP', options);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setViewMode('list');
  };

  const handleViewModeChange = (mode: 'list' | 'calendar') => {
    setViewMode(mode);
    if (mode === 'list') {
      setSelectedDate(undefined);
    }
  };

  if (allEntries.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50">
        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <p className="text-lg font-medium text-gray-600 mb-2">まだ日記がありません</p>
        <p className="text-sm text-gray-400 text-center max-w-xs">
          AIとの会話が自動的に日記として保存されます。
          チャットタブから会話を始めてください。
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* View Mode Switcher */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleViewModeChange('list')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                リスト表示
              </span>
            </button>
            <button
              onClick={() => handleViewModeChange('calendar')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                カレンダー表示
              </span>
            </button>
          </div>
          
          {selectedDate && viewMode === 'list' && (
            <button
              onClick={() => setSelectedDate(undefined)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              すべての日記を表示
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {viewMode === 'calendar' ? (
          <div className="max-w-4xl mx-auto p-4">
            <CalendarView
              entries={allEntries}
              onDateSelect={handleDateSelect}
              selectedDate={selectedDate}
            />
          </div>
        ) : (
          <div className="max-w-2xl mx-auto p-4 space-y-4">
            {selectedDate && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-4">
                <p className="text-sm text-blue-700">
                  {formatDate(selectedDate)} の日記を表示中
                </p>
              </div>
            )}
            
            {filteredEntries.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <p className="text-gray-500">この日の日記はありません</p>
              </div>
            ) : (
              filteredEntries.map((entry) => (
                <article key={entry.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                  <header className="mb-4 border-b pb-3">
                    <time className="text-sm text-gray-500">{formatDate(entry.date)}</time>
                    <div className="flex items-center gap-2 mt-2">
                      {entry.emotion.map((emotion, index) => (
                        <span key={index} className="text-2xl" title={emotion}>
                          {getEmotionEmoji(emotion)}
                        </span>
                      ))}
                      <span className="text-sm text-gray-600 ml-2">
                        今日の気分: {entry.emotion.join('、')}
                      </span>
                    </div>
                  </header>
                  
                  <div className="prose prose-sm max-w-none">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{entry.summary}</h3>
                    {entry.content && (
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{entry.content}</p>
                    )}
                  </div>
                  
                  {entry.keywords.length > 0 && (
                    <footer className="mt-4 pt-3 border-t">
                      <div className="flex flex-wrap gap-2">
                        {entry.keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
                          >
                            #{keyword}
                          </span>
                        ))}
                      </div>
                    </footer>
                  )}
                </article>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiaryView;