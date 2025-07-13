import { imageCache } from '../utils/cache.js';
import { ImageGenerator } from '../services/image-generator.js';
import { ResponsesImageGenerator } from '../services/responses-image-generator.js';
import { OpenAIClientAdapter } from '../services/openai-client-adapter.js';
import { ResponsesAPIAdapter } from '../adapters/responses-api-adapter.js';
import { CacheAdapter } from '../adapters/cache-adapter.js';
import { OptimizerAdapter } from '../adapters/optimizer-adapter.js';
import { FileConverter } from '../services/file-converter.js';
import { ConversationContextService } from '../services/conversation-context.js';
import { ConversationStoreAdapter } from '../adapters/conversation-store-adapter.js';
import { getConfig } from '../config.js';
// Get configuration
const config = getConfig();
// Create shared instances
const cacheAdapter = new CacheAdapter(imageCache);
const optimizerAdapter = new OptimizerAdapter();
const fileConverter = new FileConverter();
const conversationStore = new ConversationStoreAdapter();
const conversationContext = config.enableConversationContext
    ? new ConversationContextService(conversationStore)
    : undefined;
// Create API-specific generator
let imageGeneratorInstance;
if (config.apiMode === 'responses') {
    // Use new Responses API
    const responsesClient = new ResponsesAPIAdapter(config.openaiApiKey);
    imageGeneratorInstance = new ResponsesImageGenerator(responsesClient, cacheAdapter, optimizerAdapter, fileConverter, conversationContext);
}
else {
    // Use legacy Images API
    const openaiClient = new OpenAIClientAdapter(config.openaiApiKey);
    imageGeneratorInstance = new ImageGenerator(openaiClient, cacheAdapter, optimizerAdapter, fileConverter, conversationContext);
}
export async function generateImage(input) {
    if (config.apiMode === 'responses' && imageGeneratorInstance instanceof ResponsesImageGenerator) {
        const result = await imageGeneratorInstance.generate(input);
        return {
            images: result.images,
            revised_prompt: result.revised_prompt,
            id: result.response_id
        };
    }
    else if (imageGeneratorInstance instanceof ImageGenerator) {
        return imageGeneratorInstance.generate(input);
    }
    throw new Error('Image generator not properly initialized');
}
export async function editImage(input) {
    if (config.apiMode === 'responses' && imageGeneratorInstance instanceof ResponsesImageGenerator) {
        const result = await imageGeneratorInstance.edit(input);
        return {
            images: result.images,
            revised_prompt: result.revised_prompt,
            id: result.response_id
        };
    }
    else if (imageGeneratorInstance instanceof ImageGenerator) {
        return imageGeneratorInstance.edit(input);
    }
    throw new Error('Image generator not properly initialized');
}
export async function* generateImageWithStreaming(input) {
    if (config.apiMode === 'responses' && imageGeneratorInstance instanceof ResponsesImageGenerator) {
        yield* imageGeneratorInstance.generateWithStreaming(input);
    }
    else {
        throw new Error('Streaming is only supported with Responses API. Set API_MODE=responses in your environment.');
    }
}
//# sourceMappingURL=image-generation.js.map