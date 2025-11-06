/**
 * 日付ユーティリティ関数
 * タイムゾーンを考慮したローカル日付処理
 */

/**
 * ローカルタイムゾーンで日付を YYYY-MM-DD 形式の文字列に変換
 * @param date - 変換する日付（デフォルト: 現在日時）
 * @returns YYYY-MM-DD 形式の文字列
 */
export const getLocalDateString = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * YYYY-MM-DD 形式の文字列をローカルタイムゾーンのDateオブジェクトに変換
 * @param dateString - YYYY-MM-DD 形式の日付文字列
 * @returns ローカルタイムゾーンのDateオブジェクト
 */
export const parseDateString = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * 今日の日付を YYYY-MM-DD 形式で取得
 * @returns 今日の日付文字列
 */
export const getTodayString = (): string => {
  return getLocalDateString(new Date());
};

/**
 * 2つの日付文字列を比較
 * @param dateA - 日付文字列 A
 * @param dateB - 日付文字列 B
 * @returns dateA > dateB なら正、dateA < dateB なら負、同じなら0
 */
export const compareDateStrings = (dateA: string, dateB: string): number => {
  const a = parseDateString(dateA);
  const b = parseDateString(dateB);
  return a.getTime() - b.getTime();
};
