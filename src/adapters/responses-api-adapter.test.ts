import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ResponsesAPIAdapter } from './responses-api-adapter.js';
import type { ResponsesAPIInput, ResponsesAPIOutput } from '../interfaces/responses-api.interface.js';

// Mock OpenAI module
vi.mock('openai', () => ({
  default: vi.fn().mockImplementation(() => ({
    responses: {
      create: vi.fn(),
    },
  })),
  APIError: class MockAPIError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'APIError';
    }
  },
}));

describe('ResponsesAPIAdapter', () => {
  let adapter: ResponsesAPIAdapter;
  let mockClient: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    
    // Import OpenAI to get the mocked constructor
    const { default: OpenAI } = await import('openai');
    
    adapter = new ResponsesAPIAdapter('test-api-key');
    
    // Get the mock client instance
    mockClient = (OpenAI as any).mock.results[0].value;
  });

  describe('create', () => {
    it('should create response without streaming', async () => {
      const mockRawResponse = {
        id: 'resp_123',
        output: [{
          type: 'image_generation_call',
          status: 'completed',
          result: 'base64_image_data',
          revised_prompt: 'A beautiful sunset'
        }],
        usage: { input_tokens: 50, output_tokens: 50, total_tokens: 100 }
      };

      const expectedResponse: ResponsesAPIOutput = {
        id: 'resp_123',
        output: [{
          type: 'image_generation_call',
          status: 'completed',
          result: 'base64_image_data',
          revised_prompt: 'A beautiful sunset'
        }],
        usage: { input_tokens: 50, output_tokens: 50, total_tokens: 100 }
      };

      mockClient.responses.create.mockResolvedValue(mockRawResponse);

      const input: ResponsesAPIInput = {
        model: 'gpt-4o',
        input: 'Generate a sunset image',
        tools: [{ type: 'image_generation' }],
        tool_choice: { type: 'image_generation' }
      };

      const result = await adapter.create(input);

      expect(mockClient.responses.create).toHaveBeenCalledWith({
        model: 'gpt-4o',
        input: 'Generate a sunset image',
        tools: [{ type: 'image_generation' }],
        tool_choice: { type: 'image_generation' },
        stream: false,
      });

      expect(result).toEqual(expectedResponse);
    });

    it('should pass previous_response_id when provided', async () => {
      const mockRawResponse = {
        id: 'resp_456',
        output: [{
          type: 'image_generation_call',
          status: 'completed',
          result: 'base64_image_data',
          revised_prompt: 'An edited sunset'
        }]
      };

      mockClient.responses.create.mockResolvedValue(mockRawResponse);

      const input: ResponsesAPIInput = {
        model: 'gpt-4o',
        input: 'Edit the previous image',
        tools: [{ type: 'image_generation' }],
        tool_choice: { type: 'image_generation' },
        previous_response_id: 'resp_123'
      };

      await adapter.create(input);

      expect(mockClient.responses.create).toHaveBeenCalledWith({
        model: 'gpt-4o',
        input: 'Edit the previous image',
        tools: [{ type: 'image_generation' }],
        tool_choice: { type: 'image_generation' },
        previous_response_id: 'resp_123',
        stream: false,
      });
    });

    it('should handle API errors', async () => {
      const apiError = new Error('Invalid request');
      (apiError as any).name = 'APIError';
      
      mockClient.responses.create.mockRejectedValue(apiError);

      const input: ResponsesAPIInput = {
        model: 'gpt-4o',
        input: 'Generate an image',
        tools: [{ type: 'image_generation' }]
      };

      await expect(adapter.create(input)).rejects.toThrow();
    });

    it('should propagate non-API errors', async () => {
      const networkError = new Error('Network connection failed');
      
      mockClient.responses.create.mockRejectedValue(networkError);

      const input: ResponsesAPIInput = {
        model: 'gpt-4o',
        input: 'Generate an image',
        tools: [{ type: 'image_generation' }]
      };

      await expect(adapter.create(input)).rejects.toThrow();
    });
  });

  describe('createStream', () => {
    it('should create response with streaming enabled', async () => {
      const mockStreamResponse = {
        [Symbol.asyncIterator]: async function* () {
          yield {
            type: 'response.image_generation_call.partial_image',
            partial_image_index: 0,
            partial_image_b64: 'partial_base64_data'
          };
          yield {
            type: 'response.done'
          };
        }
      };

      mockClient.responses.create.mockResolvedValue(mockStreamResponse);

      const input: ResponsesAPIInput = {
        model: 'gpt-4o',
        input: 'Generate a sunset with streaming',
        tools: [{ type: 'image_generation' }],
        tool_choice: { type: 'image_generation' }
      };

      const streamIterator = adapter.createStream(input);
      const chunks: any[] = [];

      for await (const chunk of streamIterator) {
        chunks.push(chunk);
      }

      expect(mockClient.responses.create).toHaveBeenCalledWith({
        model: 'gpt-4o',
        input: 'Generate a sunset with streaming',
        tools: [{ type: 'image_generation' }],
        tool_choice: { type: 'image_generation' },
        stream: true,
      });

      expect(chunks).toHaveLength(2);
      expect(chunks[0].type).toBe('response.image_generation_call.partial_image');
      expect(chunks[0].partial_image_b64).toBe('partial_base64_data');
      expect(chunks[1].type).toBe('response.done');
    });

    it('should handle streaming API errors', async () => {
      const apiError = new Error('Streaming failed');
      (apiError as any).name = 'APIError';
      
      mockClient.responses.create.mockRejectedValue(apiError);

      const input: ResponsesAPIInput = {
        model: 'gpt-4o',
        input: 'Generate an image',
        tools: [{ type: 'image_generation' }]
      };

      const streamIterator = adapter.createStream(input);

      await expect(async () => {
        for await (const _chunk of streamIterator) {
          // Should not reach here
        }
      }).rejects.toThrow();
    });

    it('should handle empty streaming responses', async () => {
      const mockEmptyStreamResponse = {
        [Symbol.asyncIterator]: async function* () {
          // Empty stream
        }
      };

      mockClient.responses.create.mockResolvedValue(mockEmptyStreamResponse);

      const input: ResponsesAPIInput = {
        model: 'gpt-4o',
        input: 'Generate an image',
        tools: [{ type: 'image_generation' }]
      };

      const streamIterator = adapter.createStream(input);
      const chunks: any[] = [];

      for await (const chunk of streamIterator) {
        chunks.push(chunk);
      }

      expect(chunks).toHaveLength(0);
    });
  });

  describe('constructor', () => {
    it('should initialize with API key', () => {
      const testAdapter = new ResponsesAPIAdapter('test-key-123');
      expect(testAdapter).toBeDefined();
    });

    it('should work with undefined API key', () => {
      const testAdapter = new ResponsesAPIAdapter(undefined);
      expect(testAdapter).toBeDefined();
    });
  });
});