import { MessageData } from '../types';

interface OpenAIConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

interface ChatCompletionMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class OpenAIService {
  private apiKey: string;
  private model: string;
  private temperature: number;
  private maxTokens: number;
  private apiUrl = 'https://api.openai.com/v1/chat/completions';

  constructor(config: OpenAIConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model || 'gpt-3.5-turbo';
    this.temperature = config.temperature || 0.7;
    this.maxTokens = config.maxTokens || 800;
  }

  async sendMessage(
    messages: MessageData[],
    systemPrompt: string
  ): Promise<string> {
    try {
      // Convert messages to OpenAI format
      const openAIMessages: ChatCompletionMessage[] = [
        {
          role: 'system',
          content: systemPrompt,
        },
        ...messages.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })),
      ];

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: openAIMessages,
          temperature: this.temperature,
          max_tokens: this.maxTokens,
          stream: false,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'OpenAI API error');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
    }
  }

  // Generate diary summary from conversations
  async generateDiarySummary(
    conversations: MessageData[]
  ): Promise<{
    summary: string;
    emotion: string[];
    keywords: string[];
  }> {
    try {
      const conversationText = conversations
        .map(msg => `${msg.role === 'user' ? 'ユーザー' : 'AI'}: ${msg.content}`)
        .join('\n');

      const prompt = `
以下の会話を日記形式で要約してください。
また、会話から読み取れる感情とキーワードを抽出してください。

会話:
${conversationText}

以下のJSON形式で回答してください:
{
  "summary": "日記形式の要約（100文字程度）",
  "emotion": ["感情1", "感情2"],
  "keywords": ["キーワード1", "キーワード2", "キーワード3"]
}
`;

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'あなたは日記作成アシスタントです。会話を分析して、簡潔な日記と感情分析を行います。',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.5,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate diary summary');
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      try {
        // Parse JSON response
        const parsed = JSON.parse(content);
        return {
          summary: parsed.summary || '',
          emotion: parsed.emotion || [],
          keywords: parsed.keywords || [],
        };
      } catch {
        // Fallback if JSON parsing fails
        return {
          summary: content,
          emotion: [],
          keywords: [],
        };
      }
    } catch (error) {
      console.error('Diary generation error:', error);
      throw error;
    }
  }

  // Validate API key
  async validateApiKey(): Promise<boolean> {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  // Update configuration
  updateConfig(config: Partial<OpenAIConfig>) {
    if (config.apiKey) this.apiKey = config.apiKey;
    if (config.model) this.model = config.model;
    if (config.temperature !== undefined) this.temperature = config.temperature;
    if (config.maxTokens !== undefined) this.maxTokens = config.maxTokens;
  }
}