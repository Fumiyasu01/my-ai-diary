import React, { useState, useCallback, useEffect, useMemo } from 'react';
import Header from './components/Header';
import ChatView from './components/ChatView';
import DiaryView from './components/DiaryView';
import AgentSettings from './components/AgentSettings';
import ApiKeySettings from './components/ApiKeySettings';
import DebugInfo from './components/DebugInfo';
import DiaryGenerator from './components/DiaryGenerator';
import ConversationList from './components/chat/ConversationList';
import ChatActions from './components/chat/ChatActions';
import DataManagement from './components/DataManagement';
import { useDatabase } from './hooks/useDatabase';
import { useConversationManager } from './hooks/useConversationManager';
import { useErrorHandler } from './hooks/useErrorHandler';
import { OpenAIService } from './services/openai';
import { MessageData, DiaryEntry, AgentSettings as AgentSettingsType, ConversationData } from './types';
import { compareDateStrings } from './utils/date';

function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'diary'>('chat');
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isApiKeySettingsOpen, setIsApiKeySettingsOpen] = useState(false);
  const [isGeneratingDiary, setIsGeneratingDiary] = useState(false);
  const [isDataManagementOpen, setIsDataManagementOpen] = useState(false);
  const [agentName, setAgentName] = useState('AI アシスタント');
  const [agentPersonality, setAgentPersonality] = useState(
    '優しくて聞き上手な性格で、相手の話に共感しながら適切なアドバイスをします。'
  );
  const [apiKey, setApiKey] = useState('');
  const [openAIService, setOpenAIService] = useState<OpenAIService | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // カスタムフック
  const {
    isInitialized,
    loading: dbLoading,
    loadAgentSettings,
    saveAgentSettings,
    loadAllConversations,
    saveConversation,
    exportData,
    importData,
    clearAllData,
    exportDiariesMarkdown,
    exportDiariesHTML,
    exportDiariesPDF,
  } = useDatabase();

  const { error, showError, clearError, handleAsyncError } = useErrorHandler();

  // 会話管理フック
  const {
    conversations,
    currentConversation,
    filteredConversations,
    messages,
    handleCreateNewConversation,
    handleSelectConversation,
    handleDeleteConversation,
    handleClearConversation,
    handleUpdateTitle,
    handleSearchConversations,
    handleRegenerateMessage,
    addMessage,
    updateMessageContent,
    isRegenerating,
  } = useConversationManager({
    openAIService,
    apiKey,
    agentName,
    agentPersonality,
    saveConversation,
  });

  // Calculate storage info
  const storageInfo = useMemo(() => {
    const conversationCount = conversations.length;
    const diaryCount = diaryEntries.length;

    // Rough estimation of data size
    const conversationSize = JSON.stringify(conversations).length;
    const diarySize = JSON.stringify(diaryEntries).length;
    const totalBytes = conversationSize + diarySize;

    const totalSize = totalBytes < 1024
      ? `${totalBytes} B`
      : totalBytes < 1024 * 1024
      ? `${(totalBytes / 1024).toFixed(1)} KB`
      : `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`;

    return {
      conversationCount,
      diaryCount,
      totalSize,
    };
  }, [conversations, diaryEntries]);

  // Load saved settings and conversations on startup
  useEffect(() => {
    if (!isInitialized) return;

    const loadData = async () => {
      // Load agent settings
      const savedSettings = await loadAgentSettings();
      if (savedSettings) {
        setAgentName(savedSettings.agentName);
        setAgentPersonality(savedSettings.personality);
        if (savedSettings.apiKey) {
          setApiKey(savedSettings.apiKey);
          setOpenAIService(new OpenAIService({ apiKey: savedSettings.apiKey }));
        }
      }

      // Load all conversations for diary view
      const allConversations = await loadAllConversations();
      const diaryData: DiaryEntry[] = allConversations
        .filter(conv => conv.diary)
        .map(conv => ({
          id: conv.id,
          date: conv.date,
          ...conv.diary!,
        }));
      setDiaryEntries(diaryData);
    };

    loadData();
  }, [isInitialized, loadAgentSettings, loadAllConversations]);

  const handleSendMessage = useCallback(async (content: string) => {
    // ユーザーメッセージを追加
    const userMessage: MessageData = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    // Save user message
    await handleAsyncError(async () => {
      await addMessage(userMessage);
    }, 'メッセージの保存に失敗しました');

    setIsLoading(true);

    try {
      let aiResponse = '';

      if (openAIService && apiKey) {
        // Enhanced system prompt for deeper insights
        const systemPrompt = `あなたの名前は${agentName}です。${agentPersonality}

あなたの役割：
- ユーザーの感情に寄り添い、深く共感する
- 表面的な会話ではなく、本質的な洞察を提供する
- 適切な質問を通じて、ユーザー自身の気づきを促す
- 日記として振り返ったときに価値のある対話を心がける
- 心理的な安全性を保ちながら、成長につながる視点を提示する

対話のポイント：
- ユーザーの言葉の裏にある感情や意図を理解する
- 具体的な状況や背景を丁寧に聞く
- ポジティブな側面と課題の両方をバランスよく扱う
- 必要に応じて、建設的なアドバイスや別の視点を提供する`;

        // Create a temporary AI message for streaming
        const aiMessageId = (Date.now() + 1).toString();
        const streamingMessage: MessageData = {
          id: aiMessageId,
          role: 'assistant',
          content: '',
          timestamp: new Date().toISOString(),
        };

        // Add empty AI message first
        await addMessage(streamingMessage);

        // Stream the response
        await openAIService.sendMessageStream(
          messages.concat(userMessage),
          systemPrompt,
          // onChunk: Update message content as chunks arrive
          (chunk: string) => {
            aiResponse += chunk;
            // Update the message content in real-time
            updateMessageContent(aiMessageId, aiResponse);
          },
          // onComplete: Save final message
          async () => {
            const finalMessage: MessageData = {
              id: aiMessageId,
              role: 'assistant',
              content: aiResponse,
              timestamp: new Date().toISOString(),
            };
            await handleAsyncError(async () => {
              await addMessage(finalMessage);
            }, 'AI応答の保存に失敗しました');
          },
          // onError
          (error: Error) => {
            console.error('Streaming error:', error);
            showError('AIの応答取得に失敗しました。');
          }
        );
      } else {
        // Fallback simulation
        aiResponse = `「${content}」について話してくれてありがとう！とても興味深いですね。もっと詳しく聞かせてください。\n\n（※APIキーが設定されていないため、シミュレーション応答です。設定画面からOpenAI APIキーを設定してください）`;

        const aiMessage: MessageData = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date().toISOString(),
        };

        await handleAsyncError(async () => {
          await addMessage(aiMessage);
        }, 'AI応答の保存に失敗しました');
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      showError('AIの応答取得に失敗しました。APIキーを確認してください。');
    } finally {
      setIsLoading(false);
    }
  }, [openAIService, apiKey, messages, agentName, agentPersonality, addMessage, updateMessageContent, handleAsyncError, showError]);

  const handleTabChange = (tab: 'chat' | 'diary') => {
    setActiveTab(tab);
  };

  const handleSettingsClick = () => {
    if (!apiKey) {
      setIsApiKeySettingsOpen(true);
    } else {
      setIsSettingsOpen(true);
    }
  };

  const handleSettingsSave = useCallback(async (name: string, personality: string) => {
    setAgentName(name);
    setAgentPersonality(personality);
    
    // Save to database
    if (isInitialized) {
      const settings: AgentSettingsType = {
        agentName: name,
        personality,
        apiKey,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };
      await saveAgentSettings(settings);
    }
  }, [isInitialized, saveAgentSettings, apiKey]);

  const handleApiKeySave = useCallback(async (key: string) => {
    setApiKey(key);
    setOpenAIService(new OpenAIService({ apiKey: key }));
    
    // Save to database
    if (isInitialized) {
      const currentSettings = await loadAgentSettings();
      const settings: AgentSettingsType = {
        agentName: currentSettings?.agentName || agentName,
        personality: currentSettings?.personality || agentPersonality,
        apiKey: key,
        createdAt: currentSettings?.createdAt || new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };
      await saveAgentSettings(settings);
    }
  }, [isInitialized, saveAgentSettings, loadAgentSettings, agentName, agentPersonality]);

  const handleGenerateDiary = useCallback(async () => {
    if (!openAIService || !apiKey || messages.length < 4 || !currentConversation) return;

    setIsGeneratingDiary(true);

    const result = await handleAsyncError(async () => {
      // Generate diary summary using OpenAI
      const diaryData = await openAIService.generateDiarySummary(messages);

      // Update existing conversation with diary
      const updatedConv: ConversationData = {
        ...currentConversation,
        diary: diaryData,
        updatedAt: new Date().toISOString(),
      };

      await saveConversation(updatedConv);

      // Update diary entries state
      const newEntry: DiaryEntry = {
        id: currentConversation.id,
        date: currentConversation.date,
        ...diaryData,
      };

      setDiaryEntries(prev => {
        const filtered = prev.filter(e => e.date !== currentConversation.date);
        return [...filtered, newEntry].sort((a, b) =>
          compareDateStrings(b.date, a.date)
        );
      });

      return true;
    }, '日記の生成に失敗しました。もう一度お試しください。');

    setIsGeneratingDiary(false);

    if (result) {
      alert('日記が生成されました！「日記」タブで確認できます。');
    }
  }, [openAIService, apiKey, messages, currentConversation, saveConversation, handleAsyncError]);

  if (dbLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">データベースを初期化中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header
        agentName={agentName}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onSettingsClick={handleSettingsClick}
        onDataManagementClick={() => setIsDataManagementOpen(true)}
      />
      
      <main className="flex-1 overflow-hidden mt-[104px]">
        {activeTab === 'chat' ? (
          <div className="h-full flex">
            {/* Conversation List Sidebar */}
            {isSidebarOpen && (
              <div className="w-80 flex-shrink-0 border-r border-gray-200 overflow-hidden">
                <ConversationList
                  conversations={filteredConversations}
                  currentConversation={currentConversation}
                  onSelectConversation={handleSelectConversation}
                  onCreateNew={handleCreateNewConversation}
                  onDeleteConversation={handleDeleteConversation}
                  onSearch={handleSearchConversations}
                />
              </div>
            )}

            {/* Chat Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <ChatActions
                currentConversation={currentConversation}
                onClearConversation={handleClearConversation}
                onUpdateTitle={handleUpdateTitle}
                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                isSidebarOpen={isSidebarOpen}
              />
              <ChatView
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={isLoading || isRegenerating}
                onRegenerateMessage={handleRegenerateMessage}
                onError={showError}
              />
              <DiaryGenerator
                messages={messages}
                onGenerate={handleGenerateDiary}
                isGenerating={isGeneratingDiary}
                hasApiKey={!!apiKey}
              />
            </div>
          </div>
        ) : (
          <DiaryView entries={diaryEntries} />
        )}
      </main>

      <AgentSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        agentName={agentName}
        agentPersonality={agentPersonality}
        onSave={handleSettingsSave}
      />
      
      <ApiKeySettings
        isOpen={isApiKeySettingsOpen}
        onClose={() => setIsApiKeySettingsOpen(false)}
        apiKey={apiKey}
        onSave={handleApiKeySave}
      />

      <DataManagement
        isOpen={isDataManagementOpen}
        onClose={() => setIsDataManagementOpen(false)}
        onExport={exportData}
        onImport={importData}
        onClearAll={clearAllData}
        onExportDiaryMarkdown={() => exportDiariesMarkdown(agentName)}
        onExportDiaryHTML={() => exportDiariesHTML(agentName)}
        onExportDiaryPDF={() => exportDiariesPDF(agentName)}
        storageInfo={storageInfo}
      />

      {/* Error Toast */}
      {error && (
        <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg max-w-sm border ${
          error.type === 'error' ? 'bg-red-100 border-red-400 text-red-700' :
          error.type === 'warning' ? 'bg-yellow-100 border-yellow-400 text-yellow-700' :
          'bg-blue-100 border-blue-400 text-blue-700'
        }`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium">{error.message}</p>
            </div>
            <button
              onClick={clearError}
              className="ml-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* API Key Warning */}
      {!apiKey && !error && (
        <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg shadow-lg max-w-sm">
          <p className="text-sm font-medium">APIキーが未設定です</p>
          <p className="text-xs mt-1">設定ボタンからOpenAI APIキーを設定してください</p>
          <button
            onClick={() => setIsApiKeySettingsOpen(true)}
            className="mt-2 text-xs bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 transition-colors"
          >
            今すぐ設定
          </button>
        </div>
      )}
      
      <DebugInfo
        agentName={agentName}
        agentPersonality={agentPersonality}
        hasApiKey={!!apiKey}
      />
    </div>
  );
}

export default App;
