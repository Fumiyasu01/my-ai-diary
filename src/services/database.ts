import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { ConversationData, AgentSettings } from '../types';
import { getTodayString } from '../utils/date';

interface MyAIDiaryDB extends DBSchema {
  conversations: {
    key: string;
    value: ConversationData;
    indexes: { 'by-date': string };
  };
  settings: {
    key: string;
    value: AgentSettings | any;
  };
}

class DatabaseService {
  private db: IDBPDatabase<MyAIDiaryDB> | null = null;
  private readonly DB_NAME = 'my-ai-diary';
  private readonly DB_VERSION = 1;

  async init(): Promise<void> {
    if (this.db) return;

    this.db = await openDB<MyAIDiaryDB>(this.DB_NAME, this.DB_VERSION, {
      upgrade(db) {
        // Create conversations store
        if (!db.objectStoreNames.contains('conversations')) {
          const conversationStore = db.createObjectStore('conversations', {
            keyPath: 'id',
          });
          conversationStore.createIndex('by-date', 'date');
        }

        // Create settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings');
        }
      },
    });
  }

  // Conversation methods
  async saveConversation(conversation: ConversationData): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.put('conversations', conversation);
  }

  async getConversation(id: string): Promise<ConversationData | undefined> {
    if (!this.db) await this.init();
    return await this.db!.get('conversations', id);
  }

  async getConversationsByDate(date: string): Promise<ConversationData[]> {
    if (!this.db) await this.init();
    const index = this.db!.transaction('conversations').store.index('by-date');
    return await index.getAll(date);
  }

  async getAllConversations(): Promise<ConversationData[]> {
    if (!this.db) await this.init();
    return await this.db!.getAll('conversations');
  }

  async deleteConversation(id: string): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.delete('conversations', id);
  }

  // Today's conversation methods
  async getTodayConversation(): Promise<ConversationData | null> {
    const today = getTodayString();
    const conversations = await this.getConversationsByDate(today);
    return conversations[0] || null;
  }

  async saveTodayConversation(conversation: ConversationData): Promise<void> {
    const today = getTodayString();
    conversation.date = today;
    await this.saveConversation(conversation);
  }

  // Settings methods
  async saveSettings(key: string, value: any): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.put('settings', value, key);
  }

  async getSettings(key: string): Promise<any> {
    if (!this.db) await this.init();
    return await this.db!.get('settings', key);
  }

  async saveAgentSettings(settings: AgentSettings): Promise<void> {
    await this.saveSettings('agent', settings);
  }

  async getAgentSettings(): Promise<AgentSettings | undefined> {
    return await this.getSettings('agent');
  }

  // Clear all data
  async clearAllData(): Promise<void> {
    if (!this.db) await this.init();
    const tx = this.db!.transaction(['conversations', 'settings'], 'readwrite');
    await Promise.all([
      tx.objectStore('conversations').clear(),
      tx.objectStore('settings').clear(),
    ]);
  }

  // Export data for backup
  async exportData(): Promise<{
    conversations: ConversationData[];
    settings: { [key: string]: any };
  }> {
    if (!this.db) await this.init();
    
    const conversations = await this.getAllConversations();
    const settingsStore = this.db!.transaction('settings').store;
    const settingsKeys = await settingsStore.getAllKeys();
    const settings: { [key: string]: any } = {};
    
    for (const key of settingsKeys) {
      settings[key as string] = await settingsStore.get(key);
    }

    return { conversations, settings };
  }

  // Import data from backup
  async importData(data: {
    conversations: ConversationData[];
    settings: { [key: string]: any };
  }): Promise<void> {
    if (!this.db) await this.init();

    // Clear existing data
    await this.clearAllData();

    // Import conversations
    const tx = this.db!.transaction('conversations', 'readwrite');
    for (const conversation of data.conversations) {
      await tx.store.put(conversation);
    }
    await tx.done;

    // Import settings
    for (const [key, value] of Object.entries(data.settings)) {
      await this.saveSettings(key, value);
    }
  }
}

// Export singleton instance
export const db = new DatabaseService();