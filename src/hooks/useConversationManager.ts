import { useState, useCallback, useMemo } from 'react';
import { useConversations } from './useConversations';
import { useErrorHandler } from './useErrorHandler';
import { OpenAIService } from '../services/openai';
import { MessageData, ConversationData } from '../types';

interface UseConversationManagerProps {
  openAIService: OpenAIService | null;
  apiKey: string;
  agentName: string;
  agentPersonality: string;
  saveConversation: (conversation: ConversationData) => Promise<void>;
}

interface UseConversationManagerReturn {
  // State
  conversations: ConversationData[];
  currentConversation: ConversationData | null;
  filteredConversations: ConversationData[];
  messages: MessageData[];

  // Conversation management
  handleCreateNewConversation: () => Promise<void>;
  handleSelectConversation: (conversationId: string) => void;
  handleDeleteConversation: (conversationId: string) => Promise<void>;
  handleClearConversation: () => Promise<void>;
  handleUpdateTitle: (title: string) => Promise<void>;
  handleSearchConversations: (query: string) => void;

  // Message management
  handleRegenerateMessage: () => Promise<void>;
  addMessage: (message: MessageData) => Promise<void>;
  updateMessageContent: (messageId: string, content: string) => void;

  // Loading state
  isRegenerating: boolean;
}

export const useConversationManager = ({
  openAIService,
  apiKey,
  agentName,
  agentPersonality,
  saveConversation,
}: UseConversationManagerProps): UseConversationManagerReturn => {
  const [filteredConversations, setFilteredConversations] = useState<ConversationData[]>([]);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const {
    conversations,
    currentConversation,
    addMessage,
    updateMessageContent,
    loadAllConversations: reloadConversations,
    createNewConversation,
    switchConversation,
    updateConversationTitle,
    deleteConversation,
    clearCurrentConversation,
    searchConversations,
  } = useConversations();

  const { handleAsyncError, showError } = useErrorHandler();

  // Memoize messages to prevent unnecessary re-renders
  const messages = useMemo(() => currentConversation?.conversations || [], [currentConversation?.conversations]);

  // Initialize filtered conversations
  useState(() => {
    setFilteredConversations(conversations);
  });

  // Create new conversation
  const handleCreateNewConversation = useCallback(async () => {
    await handleAsyncError(async () => {
      await createNewConversation();
    }, '新しい会話の作成に失敗しました');
  }, [createNewConversation, handleAsyncError]);

  // Select conversation
  const handleSelectConversation = useCallback((conversationId: string) => {
    switchConversation(conversationId);
  }, [switchConversation]);

  // Delete conversation
  const handleDeleteConversation = useCallback(async (conversationId: string) => {
    await handleAsyncError(async () => {
      await deleteConversation(conversationId);
    }, '会話の削除に失敗しました');
  }, [deleteConversation, handleAsyncError]);

  // Clear current conversation
  const handleClearConversation = useCallback(async () => {
    await handleAsyncError(async () => {
      await clearCurrentConversation();
    }, '会話のクリアに失敗しました');
  }, [clearCurrentConversation, handleAsyncError]);

  // Update conversation title
  const handleUpdateTitle = useCallback(async (title: string) => {
    if (!currentConversation) return;
    await handleAsyncError(async () => {
      await updateConversationTitle(currentConversation.id, title);
    }, 'タイトルの更新に失敗しました');
  }, [currentConversation, updateConversationTitle, handleAsyncError]);

  // Search conversations
  const handleSearchConversations = useCallback((query: string) => {
    const results = searchConversations(query);
    setFilteredConversations(results);
  }, [searchConversations]);

  // Regenerate last AI message
  const handleRegenerateMessage = useCallback(async () => {
    if (!openAIService || !apiKey || messages.length < 2) return;

    setIsRegenerating(true);

    try {
      // Get all messages except the last AI message
      const messagesWithoutLast = messages.slice(0, -1);

      // Regenerate AI response
      const systemPrompt = `あなたの名前は${agentName}です。${agentPersonality}`;
      const aiResponse = await openAIService.sendMessage(messagesWithoutLast, systemPrompt);

      const aiMessage: MessageData = {
        id: Date.now().toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString(),
      };

      // Replace the last AI message
      await handleAsyncError(async () => {
        if (!currentConversation) return;
        const updatedMessages = [...messagesWithoutLast, aiMessage];
        const updatedConv: ConversationData = {
          ...currentConversation,
          conversations: updatedMessages,
          updatedAt: new Date().toISOString(),
        };
        await saveConversation(updatedConv);
        await reloadConversations();
      }, 'AI応答の再生成に失敗しました');
    } catch (error) {
      console.error('Error regenerating AI response:', error);
      showError('AIの応答再生成に失敗しました。APIキーを確認してください。');
    } finally {
      setIsRegenerating(false);
    }
  }, [
    openAIService,
    apiKey,
    messages,
    agentName,
    agentPersonality,
    currentConversation,
    saveConversation,
    reloadConversations,
    handleAsyncError,
    showError,
  ]);

  return {
    // State
    conversations,
    currentConversation,
    filteredConversations,
    messages,

    // Conversation management
    handleCreateNewConversation,
    handleSelectConversation,
    handleDeleteConversation,
    handleClearConversation,
    handleUpdateTitle,
    handleSearchConversations,

    // Message management
    handleRegenerateMessage,
    addMessage,
    updateMessageContent,

    // Loading state
    isRegenerating,
  };
};
