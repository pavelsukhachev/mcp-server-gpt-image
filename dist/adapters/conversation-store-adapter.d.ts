import { IConversationStore, ConversationHistory } from '../interfaces/conversation-context.interface.js';
export declare class ConversationStoreAdapter implements IConversationStore {
    private memoryStore;
    private persistenceDir;
    private maxMemoryEntries;
    constructor(persistenceDir?: string, maxMemoryEntries?: number);
    get(conversationId: string): Promise<ConversationHistory | null>;
    set(conversationId: string, history: ConversationHistory): Promise<void>;
    delete(conversationId: string): Promise<boolean>;
    list(): Promise<string[]>;
    clear(): Promise<void>;
    private getFilePath;
    private ensureDirectoryExists;
}
//# sourceMappingURL=conversation-store-adapter.d.ts.map