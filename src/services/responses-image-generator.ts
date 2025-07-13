import { 
  IResponsesImageGenerator,
  IResponsesAPIClient,
  ImageGenerationTool
} from '../interfaces/responses-api.interface.js';
import { 
  IImageCache, 
  IImageOptimizer,
  IFileConverter 
} from '../interfaces/image-generation.interface.js';
import { IConversationContext } from '../interfaces/conversation-context.interface.js';
import { ImageGenerationInput, ImageEditInput } from '../types.js';

export class ResponsesImageGenerator implements IResponsesImageGenerator {
  private model = 'gpt-4o'; // Using gpt-4o which includes GPT-Image-1 capabilities

  constructor(
    private responsesClient: IResponsesAPIClient,
    private cache: IImageCache,
    private optimizer: IImageOptimizer,
    private fileConverter: IFileConverter,
    private conversationContext?: IConversationContext
  ) {}

  async generate(input: ImageGenerationInput): Promise<{
    images: string[];
    revised_prompt?: string;
    response_id?: string;
  }> {
    // Check cache first
    const cached = await this.cache.get('generate', input);
    if (cached) {
      return cached;
    }

    // Enhance prompt with context if enabled
    let enhancedPrompt = input.prompt;
    if (input.useContext && input.conversationId && this.conversationContext) {
      const context = await this.conversationContext.getContext(input.conversationId);
      if (context) {
        enhancedPrompt = await this.conversationContext.generateEnhancedPrompt(
          input.prompt,
          context,
          input.maxContextEntries
        );
      }
    }

    // Prepare the image generation tool configuration
    const tool: ImageGenerationTool = {
      type: 'image_generation'
    };

    // Include image specifications in the prompt text
    const sizeText = input.size && input.size !== 'auto' ? ` in ${input.size} resolution` : '';
    const qualityText = input.quality && input.quality !== 'auto' ? ` with ${input.quality} quality` : '';
    const formatText = input.format && input.format !== 'png' ? ` in ${input.format} format` : '';
    
    enhancedPrompt += sizeText + qualityText + formatText;

    // Call the Responses API
    const response = await this.responsesClient.create({
      model: this.model,
      input: enhancedPrompt,
      tools: [tool],
      tool_choice: { type: 'image_generation' } // Force image generation
    });

    // Extract images from response
    const imageGenerationCalls = response.output.filter(
      output => output.type === 'image_generation_call'
    );

    if (imageGenerationCalls.length === 0) {
      throw new Error('No image generation output received');
    }

    const images: string[] = [];
    let revisedPrompt: string | undefined;

    for (const call of imageGenerationCalls) {
      if (call.result) {
        images.push(call.result);
      }
      if (call.revised_prompt) {
        revisedPrompt = call.revised_prompt;
      }
    }

    // Optimize images if needed
    const optimizedImages = await this.optimizer.optimizeBatch(images, input);

    const result = {
      images: optimizedImages,
      revised_prompt: revisedPrompt,
      response_id: response.id
    };

    // Cache the result
    await this.cache.set('generate', input, result);

    // Add to conversation context if enabled
    if (input.conversationId && this.conversationContext) {
      await this.conversationContext.addEntry(input.conversationId, {
        prompt: input.prompt,
        revisedPrompt: revisedPrompt,
        imageData: optimizedImages[0],
        imageMetadata: {
          size: input.size || 'auto',
          quality: input.quality || 'auto',
          format: input.format || 'png'
        },
        timestamp: new Date()
      });
    }

    return result;
  }

  async edit(input: ImageEditInput): Promise<{
    images: string[];
    revised_prompt?: string;
    response_id?: string;
  }> {
    // Check cache first
    const cached = await this.cache.get('edit', input);
    if (cached) {
      return cached;
    }

    // Enhance prompt with context if enabled
    let enhancedPrompt = input.prompt;
    let previousResponseId: string | undefined;

    if (input.useContext && input.conversationId && this.conversationContext) {
      const context = await this.conversationContext.getContext(input.conversationId);
      if (context) {
        enhancedPrompt = await this.conversationContext.generateEnhancedPrompt(
          input.prompt,
          context,
          input.maxContextEntries
        );
        
        // Get the last entry's response ID if available
        const lastEntry = context.entries[context.entries.length - 1];
        if (lastEntry && lastEntry.metadata?.responseId) {
          previousResponseId = lastEntry.metadata.responseId as string;
        }
      }
    }

    // Prepare the image generation tool configuration
    const tool: ImageGenerationTool = {
      type: 'image_generation',
      size: input.size || 'auto',
      quality: input.quality || 'auto',
      format: input.format || 'png',
      background: input.background || 'auto'
    };

    if (input.output_compression !== undefined) {
      tool.compression = input.output_compression;
    }

    // Prepare input with image data
    const inputContent = [
      {
        type: 'input_text' as const,
        text: enhancedPrompt
      },
      ...input.images.map(image => ({
        type: 'input_image' as const,
        image: this.fileConverter.extractBase64FromDataUrl(image)
      }))
    ];

    // Call the Responses API with previous response ID if available
    const response = await this.responsesClient.create({
      model: this.model,
      input: [{
        role: 'user',
        content: inputContent
      }],
      tools: [tool],
      tool_choice: { type: 'image_generation' },
      previous_response_id: previousResponseId
    });

    // Extract images from response
    const imageGenerationCalls = response.output.filter(
      output => output.type === 'image_generation_call'
    );

    if (imageGenerationCalls.length === 0) {
      throw new Error('No image generation output received');
    }

    const images: string[] = [];
    let revisedPrompt: string | undefined;

    for (const call of imageGenerationCalls) {
      if (call.result) {
        images.push(call.result);
      }
      if (call.revised_prompt) {
        revisedPrompt = call.revised_prompt;
      }
    }

    // Optimize images if needed
    const optimizedImages = await this.optimizer.optimizeBatch(images, input);

    const result = {
      images: optimizedImages,
      revised_prompt: revisedPrompt,
      response_id: response.id
    };

    // Cache the result
    await this.cache.set('edit', input, result);

    // Add to conversation context if enabled
    if (input.conversationId && this.conversationContext) {
      await this.conversationContext.addEntry(input.conversationId, {
        prompt: input.prompt,
        revisedPrompt: revisedPrompt,
        imageData: optimizedImages[0],
        imageMetadata: {
          size: input.size || 'auto',
          quality: input.quality || 'auto',
          format: input.format || 'png'
        },
        editMask: input.mask,
        timestamp: new Date(),
        metadata: { responseId: response.id }
      });
    }

    return result;
  }

  async *generateWithStreaming(input: ImageGenerationInput): AsyncGenerator<{
    type: 'partial' | 'complete' | 'progress';
    data: {
      partialImage?: string;
      index?: number;
      finalImage?: string;
      revisedPrompt?: string;
      message?: string;
      percentage?: number;
    };
  }, void, unknown> {
    // Enhance prompt with context if enabled
    let enhancedPrompt = input.prompt;
    if (input.useContext && input.conversationId && this.conversationContext) {
      const context = await this.conversationContext.getContext(input.conversationId);
      if (context) {
        enhancedPrompt = await this.conversationContext.generateEnhancedPrompt(
          input.prompt,
          context,
          input.maxContextEntries
        );
      }
    }

    // Prepare the image generation tool configuration
    const tool: ImageGenerationTool = {
      type: 'image_generation',
      size: input.size || 'auto',
      quality: input.quality || 'auto',
      format: input.format || 'png',
      background: input.background || 'auto',
      partial_images: input.partialImages || 2
    };

    yield {
      type: 'progress',
      data: { message: 'Starting image generation...', percentage: 0 }
    };

    // Stream the response
    const stream = this.responsesClient.createStream({
      model: this.model,
      input: enhancedPrompt,
      tools: [tool],
      tool_choice: { type: 'image_generation' },
      stream: true
    });

    let partialCount = 0;
    let finalImage: string | undefined;
    let revisedPrompt: string | undefined;

    for await (const event of stream) {
      if (event.type === 'response.image_generation_call.partial_image') {
        partialCount++;
        yield {
          type: 'partial',
          data: {
            partialImage: event.partial_image_b64,
            index: event.partial_image_index,
            message: `Generating partial image ${partialCount}...`,
            percentage: Math.min(30 + (partialCount * 20), 90)
          }
        };
      } else if (event.type === 'response.content.delta' && event.delta) {
        // Handle any text content
        yield {
          type: 'progress',
          data: { message: event.delta, percentage: 50 }
        };
      } else if (event.type === 'response.done') {
        // Final processing would happen here
        yield {
          type: 'progress',
          data: { message: 'Finalizing image...', percentage: 95 }
        };
      }
    }

    // In a real implementation, we would extract the final image from the complete response
    // For now, we'll simulate completion
    yield {
      type: 'complete',
      data: {
        finalImage: finalImage || '',
        revisedPrompt: revisedPrompt,
        message: 'Image generation complete',
        percentage: 100
      }
    };
  }
}