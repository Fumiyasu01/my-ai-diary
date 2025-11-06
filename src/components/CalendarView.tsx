import React, { useState, useMemo } from 'react';
import { DiaryEntry } from '../types';
import { getLocalDateString } from '../utils/date';

interface CalendarViewProps {
  entries: DiaryEntry[];
  onDateSelect: (date: string) => void;
  selectedDate?: string;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  entries,
  onDateSelect,
  selectedDate,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Create a map of dates with diary entries
  const entryDates = useMemo(() => {
    const dates = new Set<string>();
    entries.forEach(entry => {
      dates.add(entry.date);
    });
    return dates;
  }, [entries]);

  // Get emotion for a specific date
  const getEmotionForDate = (date: string): string => {
    const entry = entries.find(e => e.date === date);
    if (!entry || !entry.emotion || entry.emotion.length === 0) return '';
    
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
    
    return emotionMap[entry.emotion[0]] || '📝';
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    while (current <= lastDay || current.getDay() !== 0) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const days = generateCalendarDays();
  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ];
  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const formatDate = (date: Date): string => {
    return getLocalDateString(date);
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentMonth.getMonth();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Previous month"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h2 className="text-xl font-semibold text-gray-800">
          {currentMonth.getFullYear()}年 {monthNames[currentMonth.getMonth()]}
        </h2>
        
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Next month"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Week days header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div
            key={day}
            className={`text-center text-xs font-medium py-2 ${
              day === '日' ? 'text-red-500' : day === '土' ? 'text-blue-500' : 'text-gray-600'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const dateStr = formatDate(date);
          const hasEntry = entryDates.has(dateStr);
          const isSelected = selectedDate === dateStr;
          const emotion = hasEntry ? getEmotionForDate(dateStr) : '';
          
          return (
            <button
              key={index}
              onClick={() => hasEntry && onDateSelect(dateStr)}
              disabled={!hasEntry}
              className={`
                relative aspect-square p-1 rounded-lg transition-all
                ${!isCurrentMonth(date) ? 'text-gray-300' : ''}
                ${isToday(date) ? 'bg-blue-50 font-bold' : ''}
                ${isSelected ? 'bg-blue-100 ring-2 ring-blue-400' : ''}
                ${hasEntry && !isSelected ? 'hover:bg-gray-50' : ''}
                ${!hasEntry ? 'cursor-default' : 'cursor-pointer'}
                ${date.getDay() === 0 ? 'text-red-500' : ''}
                ${date.getDay() === 6 ? 'text-blue-500' : ''}
              `}
            >
              <div className="text-sm">{date.getDate()}</div>
              {hasEntry && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                  <span className="text-lg">{emotion}</span>
                </div>
              )}
              {hasEntry && (
                <div className="absolute top-1 right-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span>日記あり</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-lg">😊</span>
              <span>今日の感情</span>
            </div>
          </div>
          <div className="text-gray-500">
            {entries.length}件の日記
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;