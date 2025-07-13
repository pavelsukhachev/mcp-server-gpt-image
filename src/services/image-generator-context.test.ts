import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ImageGenerator } from './image-generator.js';
import { 
  IImageCache, 
  IImageOptimizer, 
  IOpenAIClient, 
  IFileConverter 
} from '../interfaces/image-generation.interface.js';
import { IConversationContext } from '../interfaces/conversation-context.interface.js';
import { ImageGenerationInput, ImageEditInput } from '../types.js';

// Mock implementations
class MockOpenAIClient implements IOpenAIClient {
  async generateImage(params: any) {
    return {
      data: [{
        b64_json: 'mock-base64-image',
        revised_prompt: 'Enhanced: ' + params.prompt
      }]
    };
  }

  async editImage(params: any) {
    return {
      data: [{
        b64_json: 'mock-edited-base64-image',
        revised_prompt: 'Edited: ' + params.prompt
      }]
    };
  }
}

class MockCache implements IImageCache {
  private cache = new Map<string, any>();

  async get(type: string, input: any) {
    return null; // Always return null to force generation
  }

  async set(type: string, input: any, data: any) {
    // No-op for tests
  }
}

class MockOptimizer implements IImageOptimizer {
  async optimizeBatch(images: string[]) {
    return images.map(img => 'optimized-' + img);
  }

  async calculateSizeReduction() {
    return 50;
  }
}

class MockFileConverter implements IFileConverter {
  base64ToFile(base64: string, filename: string, mimeType: string): File {
    return new File([base64], filename, { type: mimeType });
  }

  extractBase64FromDataUrl(dataUrl: string): string {
    return dataUrl.replace(/^data:image\/\w+;base64,/, '');
  }
}

class MockConversationContext implements IConversationContext {
  private contexts = new Map<string, any>();
  private enhancePromptMock = vi.fn();

  async getContext(conversationId: string) {
    return this.contexts.get(conversationId) || {
      conversationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      entries: []
    };
  }

  async createContext(conversationId: string) {
    const context = {
      conversationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      entries: []
    };
    this.contexts.set(conversationId, context);
    return context;
  }

  async addEntry(conversationId: string, entry: any) {
    let context = this.contexts.get(conversationId);
    if (!context) {
      context = await this.createContext(conversationId);
    }
    const newEntry = { ...entry, id: 'test-id' };
    context.entries.push(newEntry);
    return newEntry;
  }

  async generateEnhancedPrompt(originalPrompt: string, context: any, maxEntries?: number) {
    this.enhancePromptMock(originalPrompt, context, maxEntries);
    return `Enhanced with context: ${originalPrompt}`;
  }

  async clearContext(conversationId: string) {
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
  let imageGenerator: ImageGenerator;
  let mockConversationContext: MockConversationContext;
  let mockOpenAIClient: MockOpenAIClient;

  beforeEach(() => {
    mockOpenAIClient = new MockOpenAIClient();
    mockConversationContext = new MockConversationContext();
    
    imageGenerator = new ImageGenerator(
      mockOpenAIClient,
      new MockCache(),
      new MockOptimizer(),
      new MockFileConverter(),
      mockConversationContext
    );
  });

  describe('generate with context', () => {
    it('should use original prompt when context is disabled', async () => {
      const input: ImageGenerationInput = {
        prompt: 'Generate a sunset',
        useContext: false
      };

      const result = await imageGenerator.generate(input);
      
      expect(result.revised_prompt).toBe('Enhanced: Generate a sunset');
      expect(mockConversationContext.getEnhancePromptMock()).not.toHaveBeenCalled();
    });

    it('should enhance prompt when context is enabled', async () => {
      const input: ImageGenerationInput = {
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
      const input: ImageGenerationInput = {
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
      const input: ImageGenerationInput = {
        prompt: 'Add details',
        conversationId: 'test-conv-3',
        useContext: true,
        maxContextEntries: 3
      };

      await mockConversationContext.createContext('test-conv-3');

      await imageGenerator.generate(input);

      const enhancePromptMock = mockConversationContext.getEnhancePromptMock();
      expect(enhancePromptMock).toHaveBeenCalledWith(
        'Add details',
        expect.any(Object),
        3
      );
    });
  });

  describe('edit with context', () => {
    it('should enhance edit prompts with context', async () => {
      const input: ImageEditInput = {
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
      const input: ImageEditInput = {
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
      const generatorWithoutContext = new ImageGenerator(
        new MockOpenAIClient(),
        new MockCache(),
        new MockOptimizer(),
        new MockFileConverter()
        // No conversation context
      );

      const input: ImageGenerationInput = {
        prompt: 'Generate image',
        conversationId: 'test-conv',
        useContext: true
      };

      const result = await generatorWithoutContext.generate(input);
      expect(result.revised_prompt).toBe('Enhanced: Generate image');
    });
  });
});