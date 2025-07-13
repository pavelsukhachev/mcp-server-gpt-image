import { v4 as uuidv4 } from 'uuid';
export class ConversationContextService {
    store;
    maxContextLength;
    constructor(store, maxContextLength = 10) {
        this.store = store;
        this.maxContextLength = maxContextLength;
    }
    async getContext(conversationId) {
        return this.store.get(conversationId);
    }
    async createContext(conversationId) {
        const history = {
            conversationId,
            createdAt: new Date(),
            updatedAt: new Date(),
            entries: [],
            metadata: {}
        };
        await this.store.set(conversationId, history);
        return history;
    }
    async addEntry(conversationId, entry) {
        let history = await this.getContext(conversationId);
        if (!history) {
            history = await this.createContext(conversationId);
        }
        const newEntry = {
            ...entry,
            id: uuidv4(),
            timestamp: new Date()
        };
        history.entries.push(newEntry);
        history.updatedAt = new Date();
        await this.store.set(conversationId, history);
        return newEntry;
    }
    async generateEnhancedPrompt(originalPrompt, context, maxContextEntries = this.maxContextLength) {
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
    async clearContext(conversationId) {
        return this.store.delete(conversationId);
    }
    async getAllConversations() {
        return this.store.list();
    }
    buildContextSummary(entries) {
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
//# sourceMappingURL=conversation-context.js.map