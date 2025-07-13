import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ImageGenerator } from './image-generator.js';
// Mock implementations
class MockOpenAIClient {
    async generateImage(params) {
        return {
            data: [{
                    b64_json: 'mock-base64-image',
                    revised_prompt: 'Enhanced: ' + params.prompt
                }]
        };
    }
    async editImage(params) {
        return {
            data: [{
                    b64_json: 'mock-edited-base64-image',
                    revised_prompt: 'Edited: ' + params.prompt
                }]
        };
    }
}
class MockCache {
    cache = new Map();
    async get(type, input) {
        return null; // Always return null to force generation
    }
    async set(type, input, data) {
        // No-op for tests
    }
}
class MockOptimizer {
    async optimizeBatch(images) {
        return images.map(img => 'optimized-' + img);
    }
    async calculateSizeReduction() {
        return 50;
    }
}
class MockFileConverter {
    base64ToFile(base64, filename, mimeType) {
        return new File([base64], filename, { type: mimeType });
    }
    extractBase64FromDataUrl(dataUrl) {
        return dataUrl.replace(/^data:image\/\w+;base64,/, '');
    }
}
class MockConversationContext {
    contexts = new Map();
    enhancePromptMock = vi.fn();
    async getContext(conversationId) {
        return this.contexts.get(conversationId) || {
            conversationId,
            createdAt: new Date(),
            updatedAt: new Date(),
            entries: []
        };
    }
    async createContext(conversationId) {
        const context = {
            conversationId,
            createdAt: new Date(),
            updatedAt: new Date(),
            entries: []
        };
        this.contexts.set(conversationId, context);
        return context;
    }
    async addEntry(conversationId, entry) {
        let context = this.contexts.get(conversationId);
        if (!context) {
            context = await this.createContext(conversationId);
        }
        const newEntry = { ...entry, id: 'test-id' };
        context.entries.push(newEntry);
        return newEntry;
    }
    async generateEnhancedPrompt(originalPrompt, context, maxEntries) {
        this.enhancePromptMock(originalPrompt, context, maxEntries);
        return `Enhanced with context: ${originalPrompt}`;
    }
    async clearContext(conversationId) {
        return this.contexts.delete(conversationId);
    }
    async getAllConversations() {
        return Array.from(this.contexts.keys());
    }
    getEnhancePromptMock() {
        return this.enhancePromptMock;
    }
}
describe('ImageGenerator with Conversation Context', () => {
    let imageGenerator;
    let mockConversationContext;
    let mockOpenAIClient;
    beforeEach(() => {
        mockOpenAIClient = new MockOpenAIClient();
        mockConversationContext = new MockConversationContext();
        imageGenerator = new ImageGenerator(mockOpenAIClient, new MockCache(), new MockOptimizer(), new MockFileConverter(), mockConversationContext);
    });
    describe('generate with context', () => {
        it('should use original prompt when context is disabled', async () => {
            const input = {
                prompt: 'Generate a sunset',
                useContext: false
            };
            const result = await imageGenerator.generate(input);
            expect(result.revised_prompt).toBe('Enhanced: Generate a sunset');
            expect(mockConversationContext.getEnhancePromptMock()).not.toHaveBeenCalled();
        });
        it('should enhance prompt when context is enabled', async () => {
            const input = {
                prompt: 'Add more trees',
                conversationId: 'test-conv-1',
                useContext: true
            };
            // Create some context
            await mockConversationContext.createContext('test-conv-1');
            await mockConversationContext.addEntry('test-conv-1', {
                prompt: 'Generate a forest',
                revisedPrompt: 'Dense forest with tall pine trees'
            });
            const result = await imageGenerator.generate(input);
            expect(result.revised_prompt).toBe('Enhanced: Enhanced with context: Add more trees');
            expect(mockConversationContext.getEnhancePromptMock()).toHaveBeenCalled();
        });
        it('should add entry to conversation after generation', async () => {
            const input = {
                prompt: 'Generate a mountain',
                conversationId: 'test-conv-2',
                useContext: false
            };
            await imageGenerator.generate(input);
            const conversations = await mockConversationContext.getAllConversations();
            expect(conversations).toContain('test-conv-2');
            const context = await mockConversationContext.getContext('test-conv-2');
            expect(context.entries).toHaveLength(1);
            expect(context.entries[0].prompt).toBe('Generate a mountain');
            expect(context.entries[0].imageData).toBe('optimized-mock-base64-image');
        });
        it('should respect maxContextEntries parameter', async () => {
            const input = {
                prompt: 'Add details',
                conversationId: 'test-conv-3',
                useContext: true,
                maxContextEntries: 3
            };
            await mockConversationContext.createContext('test-conv-3');
            await imageGenerator.generate(input);
            const enhancePromptMock = mockConversationContext.getEnhancePromptMock();
            expect(enhancePromptMock).toHaveBeenCalledWith('Add details', expect.any(Object), 3);
        });
    });
    describe('edit with context', () => {
        it('should enhance edit prompts with context', async () => {
            const input = {
                prompt: 'Change sky color',
                images: ['base64-image'],
                conversationId: 'test-conv-4',
                useContext: true
            };
            await mockConversationContext.createContext('test-conv-4');
            await mockConversationContext.addEntry('test-conv-4', {
                prompt: 'Generate sunset scene',
                revisedPrompt: 'Beautiful sunset with orange sky'
            });
            const result = await imageGenerator.edit(input);
            expect(result.revised_prompt).toBe('Edited: Enhanced with context: Change sky color');
        });
        it('should track edit operations with mask', async () => {
            const input = {
                prompt: 'Add a bridge',
                images: ['base64-image'],
                mask: 'base64-mask',
                conversationId: 'test-conv-5',
                useContext: false
            };
            await imageGenerator.edit(input);
            const context = await mockConversationContext.getContext('test-conv-5');
            expect(context.entries).toHaveLength(1);
            expect(context.entries[0].editMask).toBe('base64-mask');
        });
    });
    describe('without conversation context', () => {
        it('should work normally when context service is not provided', async () => {
            const generatorWithoutContext = new ImageGenerator(new MockOpenAIClient(), new MockCache(), new MockOptimizer(), new MockFileConverter()
            // No conversation context
            );
            const input = {
                prompt: 'Generate image',
                conversationId: 'test-conv',
                useContext: true
            };
            const result = await generatorWithoutContext.generate(input);
            expect(result.revised_prompt).toBe('Enhanced: Generate image');
        });
    });
});
//# sourceMappingURL=image-generator-context.test.js.map