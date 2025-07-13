import { v4 as uuidv4 } from 'uuid';
import { 
  IConversationContext, 
  IConversationStore,
  ConversationHistory,
  ConversationEntry
} from '../interfaces/conversation-context.interface.js';

export class ConversationContextService implements IConversationContext {
  constructor(
    private store: IConversationStore,
    private readonly maxContextLength: number = 10
  ) {}

  async getContext(conversationId: string): Promise<ConversationHistory | null> {
    return this.store.get(conversationId);
  }

  async createContext(conversationId: string): Promise<ConversationHistory> {
    const history: ConversationHistory = {
      conversationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      entries: [],
      metadata: {}
    };

    await this.store.set(conversationId, history);
    return history;
  }

  async addEntry(
    conversationId: string, 
    entry: Omit<ConversationEntry, 'id'>
  ): Promise<ConversationEntry> {
    let history = await this.getContext(conversationId);
    
    if (!history) {
      history = await this.createContext(conversationId);
    }

    const newEntry: ConversationEntry = {
      ...entry,
      id: uuidv4(),
      timestamp: new Date()
    };

    history.entries.push(newEntry);
    history.updatedAt = new Date();

    await this.store.set(conversationId, history);
    return newEntry;
  }

  async generateEnhancedPrompt(
    originalPrompt: string,
    context: ConversationHistory,
    maxContextEntries: number = this.maxContextLength
  ): Promise<string> {
    if (!context.entries.length) {
      return originalPrompt;
    }

    const relevantEntries = context.entries
      .slice(-maxContextEntries)
      .filter(entry => entry.revisedPrompt || entry.prompt);

    if (!relevantEntries.length) {
      return originalPrompt;
    }

    const contextSummary = this.buildContextSummary(relevantEntries);
    
    const enhancedPrompt = `${originalPrompt}

Context from previous iterations:
${contextSummary}

Apply the learnings from previous iterations while following the new instruction above.`;

    return enhancedPrompt;
  }

  async clearContext(conversationId: string): Promise<boolean> {
    return this.store.delete(conversationId);
  }

  async getAllConversations(): Promise<string[]> {
    return this.store.list();
  }

  private buildContextSummary(entries: ConversationEntry[]): string {
    return entries
      .map((entry, index) => {
        const prompt = entry.revisedPrompt || entry.prompt;
        const details = [];
        
        if (entry.imageMetadata) {
          details.push(`${entry.imageMetadata.size}, ${entry.imageMetadata.quality} quality`);
        }
        
        if (entry.editMask) {
          details.push('with mask editing');
        }

        const detailsStr = details.length ? ` (${details.join(', ')})` : '';
        return `${index + 1}. "${prompt}"${detailsStr}`;
      })
      .join('\n');
  }
}