import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema, ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { generateImage, editImage } from './tools/image-generation.js';
import { generateImageWithStreaming } from './tools/image-generation-streaming.js';
import { ImageGenerationSchema, ImageEditSchema } from './types.js';
import { imageCache } from './utils/cache.js';
import { ConversationContextService } from './services/conversation-context.js';
import { ConversationStoreAdapter } from './adapters/conversation-store-adapter.js';

export function createMCPServer() {
  // Initialize conversation context service
  const conversationStore = new ConversationStoreAdapter();
  const conversationContext = new ConversationContextService(conversationStore);

  const server = new Server(
    {
      name: 'gpt-image-1-mcp-server',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // List available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: 'generate_image',
          description: 'Generate images using OpenAI GPT Image-1 model. Supports streaming with partial_images parameter.',
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
        {
          name: 'clear_cache',
          description: 'Clear the image generation cache',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'cache_stats',
          description: 'Get cache statistics',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'list_conversations',
          description: 'List all conversation IDs',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'get_conversation',
          description: 'Get conversation history by ID',
          inputSchema: {
            type: 'object',
            properties: {
              conversationId: {
                type: 'string',
                description: 'The conversation ID to retrieve'
              }
            },
            required: ['conversationId'],
          },
        },
        {
          name: 'clear_conversation',
          description: 'Clear a specific conversation history',
          inputSchema: {
            type: 'object',
            properties: {
              conversationId: {
                type: 'string',
                description: 'The conversation ID to clear'
              }
            },
            required: ['conversationId'],
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
          
          // Check if streaming is requested
          if (input.stream || input.partialImages) {
            // For streaming, we need to handle it differently
            // For now, collect all events and return the final result
            const events: any[] = [];
            
            for await (const event of generateImageWithStreaming(input)) {
              events.push(event);
              if (event.type === 'complete' && event.data?.finalImage) {
                return {
                  content: [
                    {
                      type: 'text',
                      text: `Generated image with streaming successfully.${
                        event.data.revisedPrompt ? `\nRevised prompt: ${event.data.revisedPrompt}` : ''
                      }\nStreaming events: ${events.length}`,
                    },
                    {
                      type: 'image' as const,
                      data: event.data.finalImage,
                      mimeType: `image/${input.format || 'png'}`,
                    },
                  ],
                };
              }
            }
            
            throw new Error('Streaming completed without final image');
          } else {
            // Use regular generation
            const result = await generateImage(input);
            
            return {
              content: [
                {
                  type: 'text',
                  text: `Generated ${result.images.length} image(s) successfully.${
                    result.revised_prompt ? `\nRevised prompt: ${result.revised_prompt}` : ''
                  }`,
                },
                ...result.images.map((image) => ({
                  type: 'image' as const,
                  data: image,
                  mimeType: `image/${input.format || 'png'}`,
                })),
              ],
            };
          }
        }

        case 'edit_image': {
          const input = ImageEditSchema.parse(args);
          const result = await editImage(input);
          
          return {
            content: [
              {
                type: 'text',
                text: `Edited image(s) successfully.${
                  result.revised_prompt ? `\nRevised prompt: ${result.revised_prompt}` : ''
                }`,
              },
              ...result.images.map((image) => ({
                type: 'image' as const,
                data: image,
                mimeType: `image/${input.format || 'png'}`,
              })),
            ],
          };
        }

        case 'clear_cache': {
          await imageCache.clear();
          
          return {
            content: [
              {
                type: 'text',
                text: 'Image cache cleared successfully.',
              },
            ],
          };
        }

        case 'cache_stats': {
          const stats = imageCache.getCacheStats();
          
          return {
            content: [
              {
                type: 'text',
                text: `Cache Statistics:\n- Memory entries: ${stats.memoryEntries}\n- Estimated disk usage: ${stats.estimatedDiskUsage}`,
              },
            ],
          };
        }

        case 'list_conversations': {
          const conversations = await conversationContext.getAllConversations();
          
          return {
            content: [
              {
                type: 'text',
                text: conversations.length > 0 
                  ? `Active conversations:\n${conversations.map(id => `- ${id}`).join('\n')}`
                  : 'No active conversations found.',
              },
            ],
          };
        }

        case 'get_conversation': {
          const { conversationId } = args as { conversationId: string };
          const history = await conversationContext.getContext(conversationId);
          
          if (!history) {
            return {
              content: [
                {
                  type: 'text',
                  text: `Conversation '${conversationId}' not found.`,
                },
              ],
            };
          }

          const entries = history.entries.map((entry, index) => {
            const details = [];
            if (entry.revisedPrompt) details.push(`revised: "${entry.revisedPrompt}"`);
            if (entry.imageMetadata) details.push(`${entry.imageMetadata.size}, ${entry.imageMetadata.quality}`);
            if (entry.editMask) details.push('with mask');
            
            return `${index + 1}. "${entry.prompt}" ${details.length ? `(${details.join(', ')})` : ''}`;
          }).join('\n');

          return {
            content: [
              {
                type: 'text',
                text: `Conversation: ${conversationId}\nCreated: ${history.createdAt.toISOString()}\nEntries:\n${entries || 'No entries yet'}`,
              },
            ],
          };
        }

        case 'clear_conversation': {
          const { conversationId } = args as { conversationId: string };
          const success = await conversationContext.clearContext(conversationId);
          
          return {
            content: [
              {
                type: 'text',
                text: success 
                  ? `Conversation '${conversationId}' cleared successfully.`
                  : `Conversation '${conversationId}' not found.`,
              },
            ],
          };
        }

        default:
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${name}`
          );
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new McpError(
          ErrorCode.InvalidParams,
          `Invalid parameters: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`
        );
      }
      
      if (error instanceof McpError) {
        throw error;
      }
      
      throw new McpError(
        ErrorCode.InternalError,
        `Tool execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
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