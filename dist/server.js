import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema, ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { generateImage, editImage } from './tools/image-generation.js';
import { ImageGenerationSchema, ImageEditSchema } from './types.js';
export function createMCPServer() {
    const server = new Server({
        name: 'gpt-image-1-mcp-server',
        version: '1.0.0',
    }, {
        capabilities: {
            tools: {},
        },
    });
    // List available tools
    server.setRequestHandler(ListToolsRequestSchema, async () => {
        return {
            tools: [
                {
                    name: 'generate_image',
                    description: 'Generate images using OpenAI GPT Image-1 model',
                    inputSchema: {
                        type: 'object',
                        properties: ImageGenerationSchema.shape,
                        required: ['prompt'],
                    },
                },
                {
                    name: 'edit_image',
                    description: 'Edit existing images using OpenAI GPT Image-1 model',
                    inputSchema: {
                        type: 'object',
                        properties: ImageEditSchema.shape,
                        required: ['prompt', 'images'],
                    },
                },
            ],
        };
    });
    // Handle tool calls
    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        try {
            const { name, arguments: args } = request.params;
            switch (name) {
                case 'generate_image': {
                    const input = ImageGenerationSchema.parse(args);
                    const result = await generateImage(input);
                    return {
                        content: [
                            {
                                type: 'text',
                                text: `Generated ${result.images.length} image(s) successfully.${result.revised_prompt ? `\nRevised prompt: ${result.revised_prompt}` : ''}`,
                            },
                            ...result.images.map((image) => ({
                                type: 'image',
                                data: image,
                                mimeType: `image/${input.format || 'png'}`,
                            })),
                        ],
                    };
                }
                case 'edit_image': {
                    const input = ImageEditSchema.parse(args);
                    const result = await editImage(input);
                    return {
                        content: [
                            {
                                type: 'text',
                                text: `Edited image(s) successfully.${result.revised_prompt ? `\nRevised prompt: ${result.revised_prompt}` : ''}`,
                            },
                            ...result.images.map((image) => ({
                                type: 'image',
                                data: image,
                                mimeType: `image/${input.format || 'png'}`,
                            })),
                        ],
                    };
                }
                default:
                    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
            }
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                throw new McpError(ErrorCode.InvalidParams, `Invalid parameters: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
            }
            if (error instanceof McpError) {
                throw error;
            }
            throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    });
    return server;
}
export async function runStdioServer() {
    const server = createMCPServer();
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('GPT Image-1 MCP Server running on stdio');
}
//# sourceMappingURL=server.js.map