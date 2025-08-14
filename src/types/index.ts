export interface MessageData {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ConversationData {
  id: string;
  date: string;
  conversations: MessageData[];
  diary?: DiaryData;
  metadata?: {
    wordCount: number;
    conversationCount: number;
    duration: number;
  };
}

export interface DiaryData {
  summary: string;
  emotion: string[];
  keywords: string[];
  content?: string;
}

export interface DiaryEntry extends DiaryData {
  id: string;
  date: string;
}

export interface AgentSettings {
  agentName: string;
  personality: string;
  createdAt: string;
  lastUpdated: string;
  apiProvider?: 'openai' | 'claude';
  apiKey?: string;
}