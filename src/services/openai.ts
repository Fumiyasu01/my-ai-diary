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
    this.model = config.model || 'gpt-4o-mini';
    this.temperature = config.temperature || 0.7;
    this.maxTokens = config.maxTokens || 2000;
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

  // Streaming version of sendMessage
  async sendMessageStream(
    messages: MessageData[],
    systemPrompt: string,
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: Error) => void
  ): Promise<void> {
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
          stream: true,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'OpenAI API error');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          onComplete();
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine === '' || trimmedLine === 'data: [DONE]') {
            continue;
          }

          if (trimmedLine.startsWith('data: ')) {
            try {
              const jsonStr = trimmedLine.slice(6);
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices[0]?.delta?.content;

              if (content) {
                onChunk(content);
              }
            } catch (parseError) {
              console.error('Failed to parse chunk:', parseError);
            }
          }
        }
      }
    } catch (error) {
      console.error('OpenAI Streaming Error:', error);
      onError(error as Error);
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
以下の会話を分析し、意味のある日記として要約してください。

会話:
${conversationText}

# 日記作成のポイント
1. **対話の流れを捉える**: 会話がどのように始まり、どう展開し、どこに至ったか
2. **感情の変化を追う**: 会話を通じてユーザーの感情がどう変化したか
3. **気づきや洞察**: 会話から得られた重要な気づきや学び
4. **具体的なエピソード**: 印象的だった話題や出来事
5. **成長のポイント**: 今後につながる視点や課題

# 出力形式（JSON）
{
  "summary": "日記形式の要約（300〜500文字）。会話の流れ、感情の変化、重要な気づきを含めた、後から読み返して価値のある内容にしてください。",
  "emotion": ["主要な感情1", "主要な感情2", "主要な感情3"],
  "keywords": ["重要なキーワード1", "重要なキーワード2", "重要なキーワード3", "重要なキーワード4", "重要なキーワード5"]
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
              content: `あなたは優秀な日記作成アシスタントです。会話を深く分析し、後から読み返したときに意味のある、洞察に富んだ日記を作成します。

あなたの役割：
- 会話の表面的な内容だけでなく、その背後にある感情や意図を読み取る
- 時系列に沿った対話の流れと感情の変化を捉える
- ユーザーの成長や気づきにつながるポイントを抽出する
- 具体的で、後から振り返って価値のある記録を作る
- 適切な長さ（300〜500文字）で、要点を押さえた要約をする`,
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.5,
          max_tokens: 1500,
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