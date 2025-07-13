import { promises as fs } from 'fs';
import path from 'path';
import { 
  IConversationStore, 
  ConversationHistory 
} from '../interfaces/conversation-context.interface.js';

export class ConversationStoreAdapter implements IConversationStore {
  private memoryStore: Map<string, ConversationHistory> = new Map();
  private persistenceDir: string;
  private maxMemoryEntries: number;

  constructor(
    persistenceDir: string = '.cache/conversations',
    maxMemoryEntries: number = 100
  ) {
    this.persistenceDir = persistenceDir;
    this.maxMemoryEntries = maxMemoryEntries;
  }

  async get(conversationId: string): Promise<ConversationHistory | null> {
    if (this.memoryStore.has(conversationId)) {
      return this.memoryStore.get(conversationId)!;
    }

    try {
      const filePath = this.getFilePath(conversationId);
      const data = await fs.readFile(filePath, 'utf-8');
      const history = JSON.parse(data) as ConversationHistory;
      
      history.entries.forEach(entry => {
        entry.timestamp = new Date(entry.timestamp);
      });
      history.createdAt = new Date(history.createdAt);
      history.updatedAt = new Date(history.updatedAt);

      if (this.memoryStore.size < this.maxMemoryEntries) {
        this.memoryStore.set(conversationId, history);
      }

      return history;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }

  async set(conversationId: string, history: ConversationHistory): Promise<void> {
    this.memoryStore.set(conversationId, history);

    if (this.memoryStore.size > this.maxMemoryEntries) {
      const firstKey = this.memoryStore.keys().next().value;
      if (firstKey) {
        this.memoryStore.delete(firstKey);
      }
    }

    try {
      await this.ensureDirectoryExists();
      const filePath = this.getFilePath(conversationId);
      await fs.writeFile(filePath, JSON.stringify(history, null, 2));
    } catch (error) {
      console.error('Failed to persist conversation:', error);
      throw error;
    }
  }

  async delete(conversationId: string): Promise<boolean> {
    this.memoryStore.delete(conversationId);

    try {
      const filePath = this.getFilePath(conversationId);
      await fs.unlink(filePath);
      return true;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return false;
      }
      throw error;
    }
  }

  async list(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.persistenceDir);
      return files
        .filter(file => file.endsWith('.json'))
        .map(file => path.basename(file, '.json'));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  async clear(): Promise<void> {
    this.memoryStore.clear();

    try {
      const files = await fs.readdir(this.persistenceDir);
      await Promise.all(
        files
          .filter(file => file.endsWith('.json'))
          .map(file => fs.unlink(path.join(this.persistenceDir, file)))
      );
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }
  }

  private getFilePath(conversationId: string): string {
    const safeId = conversationId.replace(/[^a-zA-Z0-9-_]/g, '_');
    return path.join(this.persistenceDir, `${safeId}.json`);
  }

  private async ensureDirectoryExists(): Promise<void> {
    try {
      await fs.mkdir(this.persistenceDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create conversation directory:', error);
    }
  }
}