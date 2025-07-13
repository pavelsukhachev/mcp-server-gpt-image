import { describe, it, expect, beforeEach } from 'vitest';
import { ConversationContextService } from './conversation-context.js';
class MockConversationStore {
    store = new Map();
    async get(conversationId) {
        return this.store.get(conversationId) || null;
    }
    async set(conversationId, history) {
        this.store.set(conversationId, history);
    }
    async delete(conversationId) {
        return this.store.delete(conversationId);
    }
    async list() {
        return Array.from(this.store.keys());
    }
    async clear() {
        this.store.clear();
    }
}
describe('ConversationContextService', () => {
    let service;
    let mockStore;
    beforeEach(() => {
        mockStore = new MockConversationStore();
        service = new ConversationContextService(mockStore);
    });
    describe('createContext', () => {
        it('should create a new conversation context', async () => {
            const conversationId = 'test-conv-1';
            const history = await service.createContext(conversationId);
            expect(history.conversationId).toBe(conversationId);
            expect(history.entries).toHaveLength(0);
            expect(history.createdAt).toBeInstanceOf(Date);
            expect(history.updatedAt).toBeInstanceOf(Date);
            expect(history.metadata).toEqual({});
        });
        it('should persist the created context', async () => {
            const conversationId = 'test-conv-2';
            await service.createContext(conversationId);
            const retrieved = await service.getContext(conversationId);
            expect(retrieved).toBeTruthy();
            expect(retrieved?.conversationId).toBe(conversationId);
        });
    });
    describe('getContext', () => {
        it('should return null for non-existent conversation', async () => {
            const result = await service.getContext('non-existent');
            expect(result).toBeNull();
        });
        it('should return existing conversation', async () => {
            const conversationId = 'test-conv-3';
            await service.createContext(conversationId);
            const result = await service.getContext(conversationId);
            expect(result).toBeTruthy();
            expect(result?.conversationId).toBe(conversationId);
        });
    });
    describe('addEntry', () => {
        it('should add entry to existing conversation', async () => {
            const conversationId = 'test-conv-4';
            await service.createContext(conversationId);
            const entry = await service.addEntry(conversationId, {
                prompt: 'Generate a sunset',
                timestamp: new Date()
            });
            expect(entry.id).toBeTruthy();
            expect(entry.prompt).toBe('Generate a sunset');
            const history = await service.getContext(conversationId);
            expect(history?.entries).toHaveLength(1);
            expect(history?.entries[0].prompt).toBe('Generate a sunset');
        });
        it('should create conversation if it does not exist', async () => {
            const conversationId = 'test-conv-5';
            const entry = await service.addEntry(conversationId, {
                prompt: 'Generate a mountain',
                timestamp: new Date()
            });
            expect(entry.id).toBeTruthy();
            const history = await service.getContext(conversationId);
            expect(history).toBeTruthy();
            expect(history?.entries).toHaveLength(1);
        });
        it('should add entry with all metadata', async () => {
            const conversationId = 'test-conv-6';
            await service.createContext(conversationId);
            const entry = await service.addEntry(conversationId, {
                prompt: 'Edit to add red bridge',
                revisedPrompt: 'Add a vibrant red suspension bridge',
                imageData: 'base64-image-data',
                imageMetadata: {
                    size: '1024x1024',
                    quality: 'high',
                    format: 'png'
                },
                editMask: 'base64-mask-data',
                parentId: 'parent-entry-id',
                timestamp: new Date()
            });
            expect(entry.revisedPrompt).toBe('Add a vibrant red suspension bridge');
            expect(entry.imageMetadata?.quality).toBe('high');
            expect(entry.editMask).toBe('base64-mask-data');
        });
    });
    describe('generateEnhancedPrompt', () => {
        it('should return original prompt if no entries', async () => {
            const history = {
                conversationId: 'test-conv-7',
                createdAt: new Date(),
                updatedAt: new Date(),
                entries: []
            };
            const enhanced = await service.generateEnhancedPrompt('Create a forest', history);
            expect(enhanced).toBe('Create a forest');
        });
        it('should enhance prompt with context', async () => {
            const history = {
                conversationId: 'test-conv-8',
                createdAt: new Date(),
                updatedAt: new Date(),
                entries: [
                    {
                        id: '1',
                        timestamp: new Date(),
                        prompt: 'Generate a landscape',
                        revisedPrompt: 'Serene mountain landscape at sunset'
                    },
                    {
                        id: '2',
                        timestamp: new Date(),
                        prompt: 'Add a lake',
                        imageMetadata: {
                            size: '1536x1024',
                            quality: 'high',
                            format: 'png'
                        }
                    }
                ]
            };
            const enhanced = await service.generateEnhancedPrompt('Add trees', history);
            expect(enhanced).toContain('Add trees');
            expect(enhanced).toContain('Context from previous iterations:');
            expect(enhanced).toContain('Serene mountain landscape at sunset');
            expect(enhanced).toContain('Add a lake');
        });
        it('should respect maxContextEntries limit', async () => {
            const entries = Array.from({ length: 10 }, (_, i) => ({
                id: `${i}`,
                timestamp: new Date(),
                prompt: `Prompt ${i}`
            }));
            const history = {
                conversationId: 'test-conv-9',
                createdAt: new Date(),
                updatedAt: new Date(),
                entries
            };
            const enhanced = await service.generateEnhancedPrompt('New prompt', history, 3);
            // Should only include last 3 entries
            expect(enhanced).toContain('Prompt 7');
            expect(enhanced).toContain('Prompt 8');
            expect(enhanced).toContain('Prompt 9');
            expect(enhanced).not.toContain('Prompt 6');
        });
    });
    describe('clearContext', () => {
        it('should clear existing conversation', async () => {
            const conversationId = 'test-conv-10';
            await service.createContext(conversationId);
            const cleared = await service.clearContext(conversationId);
            expect(cleared).toBe(true);
            const result = await service.getContext(conversationId);
            expect(result).toBeNull();
        });
        it('should return false for non-existent conversation', async () => {
            const cleared = await service.clearContext('non-existent');
            expect(cleared).toBe(false);
        });
    });
    describe('getAllConversations', () => {
        it('should return empty array when no conversations', async () => {
            const conversations = await service.getAllConversations();
            expect(conversations).toEqual([]);
        });
        it('should return all conversation IDs', async () => {
            await service.createContext('conv-1');
            await service.createContext('conv-2');
            await service.createContext('conv-3');
            const conversations = await service.getAllConversations();
            expect(conversations).toHaveLength(3);
            expect(conversations).toContain('conv-1');
            expect(conversations).toContain('conv-2');
            expect(conversations).toContain('conv-3');
        });
    });
});
//# sourceMappingURL=conversation-context.test.js.map