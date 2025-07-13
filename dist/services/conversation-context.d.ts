import { IConversationContext, IConversationStore, ConversationHistory, ConversationEntry } from '../interfaces/conversation-context.interface.js';
export declare class ConversationContextService implements IConversationContext {
    private store;
    private readonly maxContextLength;
    constructor(store: IConversationStore, maxContextLength?: number);
    getContext(conversationId: string): Promise<ConversationHistory | null>;
    createContext(conversationId: string): Promise<ConversationHistory>;
    addEntry(conversationId: string, entry: Omit<ConversationEntry, 'id'>): Promise<ConversationEntry>;
    generateEnhancedPrompt(originalPrompt: string, context: ConversationHistory, maxContextEntries?: number): Promise<string>;
    clearContext(conversationId: string): Promise<boolean>;
    getAllConversations(): Promise<string[]>;
    private buildContextSummary;
}
//# sourceMappingURL=conversation-context.d.ts.map