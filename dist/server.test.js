import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { ListToolsResultSchema, CallToolResultSchema } from '@modelcontextprotocol/sdk/types.js';
// Mock all dependencies before importing
vi.mock('./tools/image-generation', () => ({
    generateImage: vi.fn(),
    editImage: vi.fn(),
}));
vi.mock('./tools/image-generation-streaming', () => ({
    generateImageWithStreaming: vi.fn(),
}));
vi.mock('./utils/cache', () => ({
    imageCache: {
        clear: vi.fn(),
        getCacheStats: vi.fn(),
        get: vi.fn(),
        set: vi.fn(),
    },
}));
// Set environment variable for tests
process.env.OPENAI_API_KEY = 'test-api-key';
// Now import after mocks are set up
import { createMCPServer } from './server';
import { generateImage, editImage } from './tools/image-generation';
import { generateImageWithStreaming } from './tools/image-generation-streaming';
import { imageCache } from './utils/cache';
describe('MCP Server Integration Tests', () => {
    let server;
    let client;
    let clientTransport;
    let serverTransport;
    beforeEach(async () => {
        vi.clearAllMocks();
        server = createMCPServer();
        // Create linked transport pair
        [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
        // Create client
        client = new Client({
            name: 'test-client',
            version: '1.0.0',
        });
        // Connect both client and server
        await Promise.all([
            client.connect(clientTransport),
            server.connect(serverTransport),
        ]);
    });
    afterEach(async () => {
        vi.restoreAllMocks();
        await client.close();
    });
    describe('ListToolsRequest', () => {
        it('should list all available tools', async () => {
            const response = await client.request({
                method: 'tools/list',
                params: {},
            }, ListToolsResultSchema);
            expect(response.tools).toHaveLength(7);
            const toolNames = response.tools.map((tool) => tool.name);
            expect(toolNames).toContain('generate_image');
            expect(toolNames).toContain('edit_image');
            expect(toolNames).toContain('clear_cache');
            expect(toolNames).toContain('cache_stats');
            expect(toolNames).toContain('list_conversations');
            expect(toolNames).toContain('get_conversation');
            expect(toolNames).toContain('clear_conversation');
        });
        it('should include proper tool descriptions and schemas', async () => {
            const response = await client.request({
                method: 'tools/list',
                params: {},
            }, ListToolsResultSchema);
            const generateTool = response.tools.find((t) => t.name === 'generate_image');
            expect(generateTool).toBeDefined();
            expect(generateTool.description).toContain('GPT Image-1');
            expect(generateTool.inputSchema).toHaveProperty('type', 'object');
            expect(generateTool.inputSchema).toHaveProperty('properties');
            expect(generateTool.inputSchema).toHaveProperty('required', ['prompt']);
        });
    });
    describe('CallToolRequest - generate_image', () => {
        it('should generate image successfully', async () => {
            const mockResult = {
                images: ['aGVsbG8gd29ybGQ='], // Valid base64: "hello world"
                revised_prompt: 'A beautiful sunset over the ocean',
            };
            vi.mocked(generateImage).mockResolvedValue(mockResult);
            const response = await client.request({
                method: 'tools/call',
                params: {
                    name: 'generate_image',
                    arguments: {
                        prompt: 'A sunset',
                        size: '1024x1024',
                        quality: 'high',
                        format: 'png',
                    },
                },
            }, CallToolResultSchema);
            expect(response.content).toBeInstanceOf(Array);
            expect(response.content[0].type).toBe('text');
            expect(response.content[0].text).toContain('Generated 1 image(s) successfully');
            expect(response.content[1].type).toBe('image');
            expect(response.content[1].data).toBe('aGVsbG8gd29ybGQ=');
            expect(response.content[1].mimeType).toBe('image/png');
        });
        it('should handle multiple images', async () => {
            const mockResult = {
                images: ['aW1hZ2Ux', 'aW1hZ2Uy', 'aW1hZ2Uz'], // Valid base64
            };
            vi.mocked(generateImage).mockResolvedValue(mockResult);
            const response = await client.request({
                method: 'tools/call',
                params: {
                    name: 'generate_image',
                    arguments: {
                        prompt: 'Multiple images',
                        n: 3,
                    },
                },
            }, CallToolResultSchema);
            expect(response.content).toHaveLength(4); // 1 text + 3 images
            expect(response.content[0].text).toContain('Generated 3 image(s)');
        });
        it('should handle streaming requests', async () => {
            const mockStreamEvents = [
                { type: 'progress', data: { message: 'Starting...', percentage: 0 } },
                { type: 'partial', data: { partialImage: 'partial1', index: 0 } },
                { type: 'complete', data: { finalImage: 'ZmluYWwtaW1hZ2U=', revisedPrompt: 'Enhanced prompt' } },
            ];
            vi.mocked(generateImageWithStreaming).mockImplementation(async function* () {
                for (const event of mockStreamEvents) {
                    yield event;
                }
            });
            const response = await client.request({
                method: 'tools/call',
                params: {
                    name: 'generate_image',
                    arguments: {
                        prompt: 'Streaming test',
                        stream: true,
                        partialImages: 2,
                    },
                },
            }, CallToolResultSchema);
            expect(response.content[0].text).toContain('Generated image with streaming successfully');
            expect(response.content[0].text).toContain('Revised prompt: Enhanced prompt');
            expect(response.content[0].text).toContain('Streaming events: 3');
            expect(response.content[1].data).toBe('ZmluYWwtaW1hZ2U='); // 'final-image' in base64
        });
        it('should validate input parameters', async () => {
            await expect(client.request({
                method: 'tools/call',
                params: {
                    name: 'generate_image',
                    arguments: {
                        // Missing required 'prompt' field
                        size: '1024x1024',
                    },
                },
            }, CallToolResultSchema)).rejects.toMatchObject({
                code: ErrorCode.InvalidParams,
                message: expect.stringContaining('Invalid parameters'),
            });
        });
        it('should handle generation errors', async () => {
            vi.mocked(generateImage).mockRejectedValue(new Error('API rate limit exceeded'));
            await expect(client.request({
                method: 'tools/call',
                params: {
                    name: 'generate_image',
                    arguments: {
                        prompt: 'Test error handling',
                    },
                },
            }, CallToolResultSchema)).rejects.toMatchObject({
                code: ErrorCode.InternalError,
                message: expect.stringContaining('API rate limit exceeded'),
            });
        });
    });
    describe('CallToolRequest - edit_image', () => {
        it('should edit image successfully', async () => {
            const mockResult = {
                images: ['ZWRpdGVkLWltYWdlLWRhdGE='], // Valid base64
                revised_prompt: 'Added rainbow to sunset',
            };
            vi.mocked(editImage).mockResolvedValue(mockResult);
            const response = await client.request({
                method: 'tools/call',
                params: {
                    name: 'edit_image',
                    arguments: {
                        prompt: 'Add rainbow',
                        images: ['b3JpZ2luYWwtaW1hZ2UtZGF0YQ=='], // Valid base64
                        format: 'jpeg',
                    },
                },
            }, CallToolResultSchema);
            expect(response.content[0].text).toContain('Edited image(s) successfully');
            expect(response.content[0].text).toContain('Revised prompt: Added rainbow to sunset');
            expect(response.content[1].type).toBe('image');
            expect(response.content[1].mimeType).toBe('image/jpeg');
        });
        it('should validate edit input parameters', async () => {
            await expect(client.request({
                method: 'tools/call',
                params: {
                    name: 'edit_image',
                    arguments: {
                        prompt: 'Edit without images',
                        // Missing required 'images' field
                    },
                },
            }, CallToolResultSchema)).rejects.toMatchObject({
                code: ErrorCode.InvalidParams,
            });
        });
    });
    describe('CallToolRequest - cache operations', () => {
        it('should clear cache successfully', async () => {
            vi.mocked(imageCache.clear).mockResolvedValue(undefined);
            const response = await client.request({
                method: 'tools/call',
                params: {
                    name: 'clear_cache',
                    arguments: {},
                },
            }, CallToolResultSchema);
            expect(response.content[0].text).toBe('Image cache cleared successfully.');
            expect(imageCache.clear).toHaveBeenCalled();
        });
        it('should return cache statistics', async () => {
            vi.mocked(imageCache.getCacheStats).mockReturnValue({
                memoryEntries: 10,
                estimatedDiskUsage: '5.0 MB',
            });
            const response = await client.request({
                method: 'tools/call',
                params: {
                    name: 'cache_stats',
                    arguments: {},
                },
            }, CallToolResultSchema);
            expect(response.content[0].text).toContain('Memory entries: 10');
            expect(response.content[0].text).toContain('Estimated disk usage: 5.0 MB');
        });
    });
    describe('CallToolRequest - error handling', () => {
        it('should handle unknown tool names', async () => {
            await expect(client.request({
                method: 'tools/call',
                params: {
                    name: 'unknown_tool',
                    arguments: {},
                },
            }, CallToolResultSchema)).rejects.toMatchObject({
                code: ErrorCode.MethodNotFound,
                message: expect.stringContaining('Unknown tool: unknown_tool'),
            });
        });
        it('should handle Zod validation errors with details', async () => {
            await expect(client.request({
                method: 'tools/call',
                params: {
                    name: 'generate_image',
                    arguments: {
                        prompt: 'Test',
                        size: 'invalid-size', // Invalid enum value
                        n: 10, // Exceeds max value
                    },
                },
            }, CallToolResultSchema)).rejects.toMatchObject({
                code: ErrorCode.InvalidParams,
                message: expect.stringContaining('Invalid parameters'),
            });
        });
    });
    describe('Server instance creation', () => {
        it('should create server with correct configuration', () => {
            const server = createMCPServer();
            expect(server).toBeDefined();
            // Server name and version are private, but we can test that the server was created
            expect(server).toBeInstanceOf(Object);
            expect(typeof server.connect).toBe('function');
            expect(typeof server.setRequestHandler).toBe('function');
        });
        it('should have tools capability', () => {
            const server = createMCPServer();
            const capabilities = server.getCapabilities();
            expect(capabilities).toHaveProperty('tools', {});
        });
    });
});
//# sourceMappingURL=server.test.js.map