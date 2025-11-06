import { useState, useEffect, useCallback } from 'react';
import { db } from '../services/database';
import { ConversationData, AgentSettings, MessageData } from '../types';
import {
  exportDiariesAsMarkdown,
  exportDiariesAsHTML,
  generatePDFReadyHTML,
  downloadFile,
  openHTMLInNewWindow,
} from '../services/exportService';

export const useDatabase = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize database
  useEffect(() => {
    const initDB = async () => {
      try {
        await db.init();
        setIsInitialized(true);
      } catch (err) {
        setError('データベースの初期化に失敗しました');
        console.error('Database initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initDB();
  }, []);

  // Load agent settings
  const loadAgentSettings = useCallback(async (): Promise<AgentSettings | undefined> => {
    try {
      return await db.getAgentSettings();
    } catch (err) {
      console.error('Failed to load agent settings:', err);
      return undefined;
    }
  }, []);

  // Save agent settings
  const saveAgentSettings = useCallback(async (settings: AgentSettings): Promise<void> => {
    try {
      await db.saveAgentSettings(settings);
    } catch (err) {
      console.error('Failed to save agent settings:', err);
      throw err;
    }
  }, []);

  // Load today's conversation
  const loadTodayConversation = useCallback(async (): Promise<ConversationData | null> => {
    try {
      return await db.getTodayConversation();
    } catch (err) {
      console.error('Failed to load today conversation:', err);
      return null;
    }
  }, []);

  // Save message to today's conversation
  const saveMessage = useCallback(async (message: MessageData): Promise<void> => {
    try {
      let conversation = await db.getTodayConversation();
      const now = new Date().toISOString();

      if (!conversation) {
        // Create new conversation for today
        const today = new Date().toISOString().split('T')[0];
        conversation = {
          id: `conv-${today}-${Date.now()}`,
          date: today,
          conversations: [],
          createdAt: now,
          updatedAt: now,
        };
      }

      // Add message to conversation
      conversation.conversations.push(message);

      // Update metadata and timestamps
      conversation.metadata = {
        wordCount: conversation.conversations.reduce(
          (sum, msg) => sum + msg.content.split(/\s+/).length,
          0
        ),
        conversationCount: conversation.conversations.length,
        duration: 0, // Will be calculated based on first and last message timestamps
      };
      conversation.updatedAt = now;

      // Save updated conversation
      await db.saveTodayConversation(conversation);
    } catch (err) {
      console.error('Failed to save message:', err);
      throw err;
    }
  }, []);

  // Load all conversations
  const loadAllConversations = useCallback(async (): Promise<ConversationData[]> => {
    try {
      return await db.getAllConversations();
    } catch (err) {
      console.error('Failed to load conversations:', err);
      return [];
    }
  }, []);

  // Export all data
  const exportData = useCallback(async () => {
    try {
      const data = await db.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `my-ai-diary-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export data:', err);
      throw err;
    }
  }, []);

  // Import data from file
  const importData = useCallback(async (file: File): Promise<void> => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      await db.importData(data);
    } catch (err) {
      console.error('Failed to import data:', err);
      throw err;
    }
  }, []);

  // Clear all data
  const clearAllData = useCallback(async (): Promise<void> => {
    try {
      if (window.confirm('本当にすべてのデータを削除しますか？この操作は取り消せません。')) {
        await db.clearAllData();
      }
    } catch (err) {
      console.error('Failed to clear data:', err);
      throw err;
    }
  }, []);

  // Save conversation
  const saveConversation = useCallback(async (conversation: ConversationData): Promise<void> => {
    try {
      await db.saveConversation(conversation);
    } catch (err) {
      console.error('Failed to save conversation:', err);
      throw err;
    }
  }, []);

  // Export diaries as Markdown
  const exportDiariesMarkdown = useCallback(async (agentName?: string): Promise<void> => {
    try {
      const conversations = await db.getAllConversations();
      const markdown = exportDiariesAsMarkdown(conversations);
      const filename = `my-ai-diary-${new Date().toISOString().split('T')[0]}.md`;
      downloadFile(markdown, filename, 'text/markdown');
    } catch (err) {
      console.error('Failed to export diaries as Markdown:', err);
      throw err;
    }
  }, []);

  // Export diaries as HTML
  const exportDiariesHTML = useCallback(async (agentName?: string): Promise<void> => {
    try {
      const conversations = await db.getAllConversations();
      const html = exportDiariesAsHTML(conversations, agentName);
      const filename = `my-ai-diary-${new Date().toISOString().split('T')[0]}.html`;
      downloadFile(html, filename, 'text/html');
    } catch (err) {
      console.error('Failed to export diaries as HTML:', err);
      throw err;
    }
  }, []);

  // Export diaries as PDF (opens print dialog)
  const exportDiariesPDF = useCallback(async (agentName?: string): Promise<void> => {
    try {
      const conversations = await db.getAllConversations();
      const html = generatePDFReadyHTML(conversations, agentName);
      openHTMLInNewWindow(html);
    } catch (err) {
      console.error('Failed to export diaries as PDF:', err);
      throw err;
    }
  }, []);

  return {
    isInitialized,
    loading,
    error,
    loadAgentSettings,
    saveAgentSettings,
    loadTodayConversation,
    saveMessage,
    saveConversation,
    loadAllConversations,
    exportData,
    importData,
    clearAllData,
    exportDiariesMarkdown,
    exportDiariesHTML,
    exportDiariesPDF,
  };
};