export interface ConversationEntry {
    id: string;
    timestamp: Date;
    prompt: string;
    revisedPrompt?: string;
    imageData?: string;
    imageMetadata?: {
        size: string;
        quality: string;
        format: string;
    };
    editMask?: string;
    parentId?: string;
    metadata?: Record<string, unknown>;
}
export interface ConversationHistory {
    conversationId: string;
    createdAt: Date;
    updatedAt: Date;
    entries: ConversationEntry[];
    metadata?: Record<string, unknown>;
}
export interface IConversationContext {
    getContext(conversationId: string): Promise<ConversationHistory | null>;
    createContext(conversationId: string): Promise<ConversationHistory>;
    addEntry(conversationId: string, entry: Omit<ConversationEntry, 'id'>): Promise<ConversationEntry>;
    generateEnhancedPrompt(originalPrompt: string, context: ConversationHistory, maxContextEntries?: number): Promise<string>;
    clearContext(conversationId: string): Promise<boolean>;
    getAllConversations(): Promise<string[]>;
}
export interface IConversationStore {
    get(conversationId: string): Promise<ConversationHistory | null>;
    set(conversationId: string, history: ConversationHistory): Promise<void>;
    delete(conversationId: string): Promise<boolean>;
    list(): Promise<string[]>;
    clear(): Promise<void>;
}
//# sourceMappingURL=conversation-context.interface.d.ts.map