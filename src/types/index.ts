export interface MessageData {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ConversationMetadata {
  wordCount: number;
  conversationCount: number;
  duration: number;
}

export interface ConversationData {
  id: string;
  date: string;
  title?: string;                    // 会話のタイトル（ユーザーが設定可能）
  conversations: MessageData[];
  diary?: DiaryData;
  metadata?: ConversationMetadata;
  createdAt: string;                 // 作成日時
  updatedAt: string;                 // 最終更新日時
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