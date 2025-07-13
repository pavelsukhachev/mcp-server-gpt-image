import { z } from 'zod';
export const ImageGenerationSchema = z.object({
    prompt: z.string().describe('The text prompt to generate an image from'),
    size: z.enum(['1024x1024', '1024x1536', '1536x1024', 'auto']).optional().default('1024x1024').describe('Image dimensions'),
    quality: z.enum(['low', 'medium', 'high', 'auto']).optional().default('auto').describe('Rendering quality'),
    format: z.enum(['png', 'jpeg', 'webp']).optional().default('png').describe('Output format'),
    background: z.enum(['transparent', 'opaque', 'auto']).optional().default('auto').describe('Background transparency (only for png/webp)'),
    output_compression: z.number().min(0).max(100).optional().describe('Compression level for jpeg/webp (0-100%)'),
    moderation: z.enum(['auto', 'low']).optional().default('auto').describe('Content moderation strictness'),
    n: z.number().min(1).max(4).optional().default(1).describe('Number of images to generate'),
    partialImages: z.number().min(1).max(3).optional().describe('Number of partial images to stream (enables streaming)'),
    stream: z.boolean().optional().default(false).describe('Enable streaming mode for image generation'),
});
export const ImageEditSchema = z.object({
    prompt: z.string().describe('The text prompt for editing the image'),
    images: z.array(z.string()).describe('Base64-encoded images or file IDs to edit'),
    mask: z.string().optional().describe('Base64-encoded mask image for inpainting'),
    size: z.enum(['1024x1024', '1024x1536', '1536x1024', 'auto']).optional().default('1024x1024'),
    quality: z.enum(['low', 'medium', 'high', 'auto']).optional().default('auto'),
    format: z.enum(['png', 'jpeg', 'webp']).optional().default('png'),
    background: z.enum(['transparent', 'opaque', 'auto']).optional().default('auto'),
    output_compression: z.number().min(0).max(100).optional(),
    moderation: z.enum(['auto', 'low']).optional().default('auto'),
    n: z.number().min(1).max(4).optional().default(1),
});
//# sourceMappingURL=types.js.map