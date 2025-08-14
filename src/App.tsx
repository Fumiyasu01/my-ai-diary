import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import ChatView from './components/ChatView';
import DiaryView from './components/DiaryView';
import AgentSettings from './components/AgentSettings';
import ApiKeySettings from './components/ApiKeySettings';
import DebugInfo from './components/DebugInfo';
import DiaryGenerator from './components/DiaryGenerator';
import { useDatabase } from './hooks/useDatabase';
import { OpenAIService } from './services/openai';
import { MessageData, DiaryEntry, AgentSettings as AgentSettingsType, ConversationData } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'diary'>('chat');
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isApiKeySettingsOpen, setIsApiKeySettingsOpen] = useState(false);
  const [isGeneratingDiary, setIsGeneratingDiary] = useState(false);
  const [agentName, setAgentName] = useState('AI アシスタント');
  const [agentPersonality, setAgentPersonality] = useState(
    '優しくて聞き上手な性格で、相手の話に共感しながら適切なアドバイスをします。'
  );
  const [apiKey, setApiKey] = useState('');
  const [openAIService, setOpenAIService] = useState<OpenAIService | null>(null);

  const {
    isInitialized,
    loading: dbLoading,
    loadAgentSettings,
    saveAgentSettings,
    loadTodayConversation,
    saveMessage,
    loadAllConversations,
    saveConversation,
  } = useDatabase();

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

      // Load today's conversation
      const todayConv = await loadTodayConversation();
      if (todayConv && todayConv.conversations) {
        setMessages(todayConv.conversations);
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
  }, [isInitialized, loadAgentSettings, loadTodayConversation, loadAllConversations]);

  const handleSendMessage = useCallback(async (content: string) => {
    // ユーザーメッセージを追加
    const userMessage: MessageData = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Save to database
    if (isInitialized) {
      await saveMessage(userMessage);
    }
    
    setIsLoading(true);

    try {
      let aiResponse: string;
      
      if (openAIService && apiKey) {
        // Use OpenAI API
        const systemPrompt = `あなたの名前は${agentName}です。${agentPersonality}`;
        aiResponse = await openAIService.sendMessage(messages.concat(userMessage), systemPrompt);
      } else {
        // Fallback simulation
        aiResponse = `「${content}」について話してくれてありがとう！とても興味深いですね。もっと詳しく聞かせてください。\n\n（※APIキーが設定されていないため、シミュレーション応答です。設定画面からOpenAI APIキーを設定してください）`;
      }

      const aiMessage: MessageData = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Save AI response to database
      if (isInitialized) {
        await saveMessage(aiMessage);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      alert('AIの応答取得に失敗しました。APIキーを確認してください。');
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized, saveMessage, openAIService, apiKey, messages, agentName, agentPersonality]);

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
    if (!openAIService || !apiKey || messages.length < 4) return;
    
    setIsGeneratingDiary(true);
    
    try {
      // Generate diary summary using OpenAI
      const diaryData = await openAIService.generateDiarySummary(messages);
      
      // Get today's conversation
      const todayConv = await loadTodayConversation();
      
      if (todayConv) {
        // Update existing conversation with diary
        const updatedConv: ConversationData = {
          ...todayConv,
          diary: diaryData,
        };
        
        await saveConversation(updatedConv);
        
        // Update diary entries state
        const newEntry: DiaryEntry = {
          id: todayConv.id,
          date: todayConv.date,
          ...diaryData,
        };
        
        setDiaryEntries(prev => {
          const filtered = prev.filter(e => e.date !== todayConv.date);
          return [...filtered, newEntry].sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
        });
        
        alert('日記が生成されました！「日記」タブで確認できます。');
      }
    } catch (error) {
      console.error('Failed to generate diary:', error);
      alert('日記の生成に失敗しました。もう一度お試しください。');
    } finally {
      setIsGeneratingDiary(false);
    }
  }, [openAIService, apiKey, messages, loadTodayConversation, saveConversation]);

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
      />
      
      <main className="flex-1 overflow-hidden mt-[104px]">
        {activeTab === 'chat' ? (
          <div className="h-full flex flex-col">
            <ChatView
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
            <DiaryGenerator
              messages={messages}
              onGenerate={handleGenerateDiary}
              isGenerating={isGeneratingDiary}
              hasApiKey={!!apiKey}
            />
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

      {!apiKey && (
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
