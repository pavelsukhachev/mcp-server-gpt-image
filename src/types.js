"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageEditSchema = exports.ImageGenerationSchema = void 0;
var zod_1 = require("zod");
exports.ImageGenerationSchema = zod_1.z.object({
    prompt: zod_1.z.string().describe('The text prompt to generate an image from'),
    size: zod_1.z.enum(['1024x1024', '1024x1536', '1536x1024', 'auto']).optional().default('1024x1024').describe('Image dimensions'),
    quality: zod_1.z.enum(['low', 'medium', 'high', 'auto']).optional().default('auto').describe('Rendering quality'),
    format: zod_1.z.enum(['png', 'jpeg', 'webp']).optional().default('png').describe('Output format'),
    background: zod_1.z.enum(['transparent', 'opaque', 'auto']).optional().default('auto').describe('Background transparency (only for png/webp)'),
    output_compression: zod_1.z.number().min(0).max(100).optional().describe('Compression level for jpeg/webp (0-100%)'),
    moderation: zod_1.z.enum(['auto', 'low']).optional().default('auto').describe('Content moderation strictness'),
    n: zod_1.z.number().min(1).max(4).optional().default(1).describe('Number of images to generate'),
    partialImages: zod_1.z.number().min(1).max(3).optional().describe('Number of partial images to stream (enables streaming)'),
    stream: zod_1.z.boolean().optional().default(false).describe('Enable streaming mode for image generation'),
    conversationId: zod_1.z.string().optional().describe('ID for conversation context tracking'),
    useContext: zod_1.z.boolean().optional().default(false).describe('Whether to use conversation context from previous interactions'),
    maxContextEntries: zod_1.z.number().min(1).max(10).optional().default(5).describe('Maximum number of context entries to consider'),
});
exports.ImageEditSchema = zod_1.z.object({
    prompt: zod_1.z.string().describe('The text prompt for editing the image'),
    images: zod_1.z.array(zod_1.z.string()).describe('Base64-encoded images or file IDs to edit'),
    mask: zod_1.z.string().optional().describe('Base64-encoded mask image for inpainting'),
    size: zod_1.z.enum(['1024x1024', '1024x1536', '1536x1024', 'auto']).optional().default('1024x1024'),
    quality: zod_1.z.enum(['low', 'medium', 'high', 'auto']).optional().default('auto'),
    format: zod_1.z.enum(['png', 'jpeg', 'webp']).optional().default('png'),
    background: zod_1.z.enum(['transparent', 'opaque', 'auto']).optional().default('auto'),
    output_compression: zod_1.z.number().min(0).max(100).optional(),
    moderation: zod_1.z.enum(['auto', 'low']).optional().default('auto'),
    n: zod_1.z.number().min(1).max(4).optional().default(1),
    conversationId: zod_1.z.string().optional().describe('ID for conversation context tracking'),
    useContext: zod_1.z.boolean().optional().default(false).describe('Whether to use conversation context from previous interactions'),
    maxContextEntries: zod_1.z.number().min(1).max(10).optional().default(5).describe('Maximum number of context entries to consider'),
});
