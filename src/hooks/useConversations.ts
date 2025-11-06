import { useState, useCallback, useEffect } from 'react';
import { ConversationData, MessageData } from '../types';
import { db } from '../services/database';
import { getTodayString, compareDateStrings } from '../utils/date';

export interface UseConversationsReturn {
  // 状態
  conversations: ConversationData[];
  currentConversation: ConversationData | null;
  isLoading: boolean;

  // 会話管理
  loadAllConversations: () => Promise<void>;
  createNewConversation: (title?: string) => Promise<ConversationData>;
  switchConversation: (conversationId: string) => void;
  updateConversationTitle: (conversationId: string, title: string) => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<void>;
  clearCurrentConversation: () => Promise<void>;

  // メッセージ管理
  addMessage: (message: MessageData) => Promise<void>;
  updateMessageContent: (messageId: string, content: string) => void;
  deleteMessage: (messageId: string) => Promise<void>;

  // 検索・フィルタ
  searchConversations: (query: string) => ConversationData[];
  getConversationsByDateRange: (startDate: string, endDate: string) => ConversationData[];
}

/**
 * 会話管理用カスタムフック
 *
 * 機能:
 * - 複数の会話を管理
 * - 現在アクティブな会話の管理
 * - 会話の作成、更新、削除
 * - メッセージの追加、削除
 * - 会話の検索、フィルタリング
 */
export const useConversations = (): UseConversationsReturn => {
  const [conversations, setConversations] = useState<ConversationData[]>([]);
  const [currentConversation, setCurrentConversation] = useState<ConversationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * すべての会話を読み込み
   */
  const loadAllConversations = useCallback(async () => {
    setIsLoading(true);
    try {
      const allConversations = await db.getAllConversations();
      // 日付順（新しい順）にソート
      const sorted = allConversations.sort((a, b) =>
        compareDateStrings(b.date, a.date)
      );
      setConversations(sorted);

      // 今日の会話を現在の会話として設定
      const today = getTodayString();
      const todayConv = sorted.find(c => c.date === today);
      if (todayConv) {
        setCurrentConversation(todayConv);
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 初期ロード
   */
  useEffect(() => {
    loadAllConversations();
  }, [loadAllConversations]);

  /**
   * 新しい会話を作成
   */
  const createNewConversation = useCallback(async (title?: string): Promise<ConversationData> => {
    const today = getTodayString();
    const now = new Date().toISOString();

    const newConversation: ConversationData = {
      id: `conv-${today}-${Date.now()}`,
      date: today,
      title: title || `${today}の会話`,
      conversations: [],
      createdAt: now,
      updatedAt: now,
      metadata: {
        wordCount: 0,
        conversationCount: 0,
        duration: 0,
      },
    };

    await db.saveConversation(newConversation);
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversation(newConversation);

    return newConversation;
  }, []);

  /**
   * 会話を切り替え
   */
  const switchConversation = useCallback((conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setCurrentConversation(conversation);
    }
  }, [conversations]);

  /**
   * 会話のタイトルを更新
   */
  const updateConversationTitle = useCallback(async (conversationId: string, title: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;

    const updated: ConversationData = {
      ...conversation,
      title,
      updatedAt: new Date().toISOString(),
    };

    await db.saveConversation(updated);

    setConversations(prev =>
      prev.map(c => (c.id === conversationId ? updated : c))
    );

    if (currentConversation?.id === conversationId) {
      setCurrentConversation(updated);
    }
  }, [conversations, currentConversation]);

  /**
   * 会話を削除
   */
  const deleteConversation = useCallback(async (conversationId: string) => {
    await db.deleteConversation(conversationId);

    setConversations(prev => prev.filter(c => c.id !== conversationId));

    if (currentConversation?.id === conversationId) {
      setCurrentConversation(null);
    }
  }, [currentConversation]);

  /**
   * 現在の会話をクリア
   */
  const clearCurrentConversation = useCallback(async () => {
    if (!currentConversation) return;

    const cleared: ConversationData = {
      ...currentConversation,
      conversations: [],
      updatedAt: new Date().toISOString(),
      metadata: {
        wordCount: 0,
        conversationCount: 0,
        duration: 0,
      },
    };

    await db.saveConversation(cleared);
    setCurrentConversation(cleared);

    setConversations(prev =>
      prev.map(c => (c.id === currentConversation.id ? cleared : c))
    );
  }, [currentConversation]);

  /**
   * メッセージを追加または更新
   */
  const addMessage = useCallback(async (message: MessageData) => {
    if (!currentConversation) {
      // 会話がない場合は新規作成
      const newConv = await createNewConversation();
      const updated = {
        ...newConv,
        conversations: [message],
        updatedAt: new Date().toISOString(),
      };
      await db.saveConversation(updated);
      setCurrentConversation(updated);
      setConversations(prev => [updated, ...prev]);
      return;
    }

    // 既存のメッセージを確認
    const existingIndex = currentConversation.conversations.findIndex(m => m.id === message.id);

    let newConversations: MessageData[];
    if (existingIndex >= 0) {
      // 既存メッセージを更新
      newConversations = currentConversation.conversations.map((m, i) =>
        i === existingIndex ? message : m
      );
    } else {
      // 新規メッセージを追加
      newConversations = [...currentConversation.conversations, message];
    }

    const updated: ConversationData = {
      ...currentConversation,
      conversations: newConversations,
      updatedAt: new Date().toISOString(),
      metadata: {
        wordCount:
          (currentConversation.metadata?.wordCount || 0) +
          message.content.split(/\s+/).length,
        conversationCount: newConversations.length,
        duration: 0,
      },
    };

    await db.saveConversation(updated);
    setCurrentConversation(updated);

    setConversations(prev =>
      prev.map(c => (c.id === currentConversation.id ? updated : c))
    );
  }, [currentConversation, createNewConversation]);

  /**
   * メッセージの内容を更新（リアルタイムストリーミング用）
   * データベースには保存せず、状態のみ更新
   */
  const updateMessageContent = useCallback((messageId: string, content: string) => {
    if (!currentConversation) return;

    const updated: ConversationData = {
      ...currentConversation,
      conversations: currentConversation.conversations.map(msg =>
        msg.id === messageId ? { ...msg, content } : msg
      ),
    };

    setCurrentConversation(updated);

    setConversations(prev =>
      prev.map(c => (c.id === currentConversation.id ? updated : c))
    );
  }, [currentConversation]);

  /**
   * メッセージを削除
   */
  const deleteMessage = useCallback(async (messageId: string) => {
    if (!currentConversation) return;

    const updated: ConversationData = {
      ...currentConversation,
      conversations: currentConversation.conversations.filter(m => m.id !== messageId),
      updatedAt: new Date().toISOString(),
    };

    await db.saveConversation(updated);
    setCurrentConversation(updated);

    setConversations(prev =>
      prev.map(c => (c.id === currentConversation.id ? updated : c))
    );
  }, [currentConversation]);

  /**
   * 会話を検索
   */
  const searchConversations = useCallback((query: string): ConversationData[] => {
    if (!query.trim()) return conversations;

    const lowerQuery = query.toLowerCase();
    return conversations.filter(conv => {
      // タイトルで検索
      if (conv.title?.toLowerCase().includes(lowerQuery)) return true;

      // メッセージ内容で検索
      return conv.conversations.some(msg =>
        msg.content.toLowerCase().includes(lowerQuery)
      );
    });
  }, [conversations]);

  /**
   * 日付範囲で会話を取得
   */
  const getConversationsByDateRange = useCallback(
    (startDate: string, endDate: string): ConversationData[] => {
      return conversations.filter(conv => {
        const convDate = conv.date;
        return (
          compareDateStrings(convDate, startDate) >= 0 &&
          compareDateStrings(convDate, endDate) <= 0
        );
      });
    },
    [conversations]
  );

  return {
    conversations,
    currentConversation,
    isLoading,
    loadAllConversations,
    createNewConversation,
    switchConversation,
    updateConversationTitle,
    deleteConversation,
    clearCurrentConversation,
    addMessage,
    updateMessageContent,
    deleteMessage,
    searchConversations,
    getConversationsByDateRange,
  };
};
