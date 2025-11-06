import { useState, useCallback } from 'react';

export interface ErrorState {
  message: string;
  type: 'error' | 'warning' | 'info';
  timestamp: string;
}

export interface UseErrorHandlerReturn {
  error: ErrorState | null;
  showError: (message: string, type?: ErrorState['type']) => void;
  clearError: () => void;
  handleAsyncError: <T>(
    asyncFn: () => Promise<T>,
    errorMessage?: string
  ) => Promise<T | null>;
  retryWithExponentialBackoff: <T>(
    asyncFn: () => Promise<T>,
    maxRetries?: number,
    initialDelay?: number
  ) => Promise<T>;
}

/**
 * エラーハンドリングを統一的に管理するカスタムフック
 *
 * 機能:
 * - エラーの表示・クリア
 * - 非同期処理のエラーハンドリング
 * - リトライロジック（Exponential Backoff）
 */
export const useErrorHandler = (): UseErrorHandlerReturn => {
  const [error, setError] = useState<ErrorState | null>(null);

  /**
   * エラーを表示
   */
  const showError = useCallback((message: string, type: ErrorState['type'] = 'error') => {
    setError({
      message,
      type,
      timestamp: new Date().toISOString(),
    });

    // 自動的にエラーをクリア（5秒後）
    setTimeout(() => {
      setError(null);
    }, 5000);
  }, []);

  /**
   * エラーをクリア
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * 非同期処理をエラーハンドリング付きで実行
   */
  const handleAsyncError = useCallback(
    async <T,>(asyncFn: () => Promise<T>, errorMessage?: string): Promise<T | null> => {
      try {
        return await asyncFn();
      } catch (err) {
        const message = errorMessage ||
          (err instanceof Error ? err.message : '予期しないエラーが発生しました');
        showError(message);
        console.error('Async error:', err);
        return null;
      }
    },
    [showError]
  );

  /**
   * 指数バックオフを使用したリトライロジック
   */
  const retryWithExponentialBackoff = useCallback(
    async <T,>(
      asyncFn: () => Promise<T>,
      maxRetries: number = 3,
      initialDelay: number = 1000
    ): Promise<T> => {
      let lastError: Error | null = null;

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          return await asyncFn();
        } catch (err) {
          lastError = err instanceof Error ? err : new Error('Unknown error');

          if (attempt < maxRetries - 1) {
            const delay = initialDelay * Math.pow(2, attempt);
            showError(`処理に失敗しました。再試行中... (${attempt + 1}/${maxRetries})`, 'warning');
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }

      const errorMessage = `${maxRetries}回の再試行後も処理に失敗しました: ${lastError?.message}`;
      showError(errorMessage, 'error');
      throw new Error(errorMessage);
    },
    [showError]
  );

  return {
    error,
    showError,
    clearError,
    handleAsyncError,
    retryWithExponentialBackoff,
  };
};
