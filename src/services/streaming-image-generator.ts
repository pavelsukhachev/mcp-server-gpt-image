import { 
  IImageCache, 
  IImageOptimizer, 
  IOpenAIClient 
} from '../interfaces/image-generation.interface.js';
import { ImageGenerationInput, ImageGenerationResult } from '../types.js';

export interface StreamingImageEvent {
  type: 'partial' | 'progress' | 'complete' | 'error';
  data?: {
    partialImage?: string;
    partialImageIndex?: number;
    progress?: number;
    message?: string;
    finalImage?: string;
    revisedPrompt?: string;
  };
  error?: string;
}

export interface IStreamingImageGenerator {
  generateWithStreaming(input: ImageGenerationInput): AsyncGenerator<StreamingImageEvent, void, unknown>;
}

export class StreamingImageGenerator implements IStreamingImageGenerator {
  constructor(
    private openaiClient: IOpenAIClient,
    private cache: IImageCache,
    private optimizer: IImageOptimizer
  ) {}

  async* generateWithStreaming(
    input: ImageGenerationInput
  ): AsyncGenerator<StreamingImageEvent, void, unknown> {
    try {
      // Check cache first
      const cached = await this.checkCache(input);
      if (cached) {
        yield* this.yieldCachedResult(cached);
        return;
      }

      // Emit initial progress
      yield this.createProgressEvent(0, 'Initializing image generation...');

      // Process prompt
      yield this.createProgressEvent(30, 'Processing prompt...');

      // Generate image
      const response = await this.generateImage(input);

      // Emit partial images if requested
      if (input.partialImages) {
        yield* this.yieldPartialImages(input.partialImages, response);
      }

      // Process final image
      yield this.createProgressEvent(90, 'Finalizing image...');

      // Check if optimization is needed
      if (this.shouldOptimize(input)) {
        yield this.createProgressEvent(95, 'Optimizing image...');
      }

      const result = await this.processFinalResult(input, response);

      // Cache result
      await this.cache.set('generate', input, result);

      // Emit complete event
      yield this.createCompleteEvent(result);

    } catch (error) {
      yield this.createErrorEvent(error);
    }
  }

  private async checkCache(input: ImageGenerationInput): Promise<ImageGenerationResult | null> {
    return this.cache.get('generate', input);
  }

  private async* yieldCachedResult(cached: ImageGenerationResult): AsyncGenerator<StreamingImageEvent> {
    yield this.createProgressEvent(100, 'Retrieved from cache');
    yield this.createCompleteEvent(cached);
  }

  private async generateImage(input: ImageGenerationInput) {
    return this.openaiClient.generateImage({
      model: 'gpt-image-1',
      prompt: input.prompt,
      size: !input.size || input.size === 'auto' ? '1024x1024' : input.size,
      quality: input.quality || 'auto',
      n: input.n,
    });
  }

  private async* yieldPartialImages(
    numPartials: number, 
    response: any
  ): AsyncGenerator<StreamingImageEvent> {
    for (let i = 0; i < numPartials; i++) {
      yield this.createProgressEvent(
        40 + (i * 15), 
        `Generating partial image ${i + 1}/${numPartials}...`
      );

      if (response.data?.[0]?.b64_json) {
        yield this.createPartialEvent(response.data[0].b64_json, i);
      }
    }
  }

  private async processFinalResult(
    input: ImageGenerationInput,
    response: any
  ): Promise<ImageGenerationResult> {
    const images = this.extractImages(response);

    if (images.length === 0) {
      throw new Error('No images generated');
    }

    let optimizedImages = images;
    if (this.shouldOptimize(input)) {
      optimizedImages = await this.optimizeImages(images, input);
    }

    return {
      images: optimizedImages,
      revised_prompt: response.data?.[0]?.revised_prompt,
    };
  }

  private extractImages(response: any): string[] {
    return response.data?.map((item: any) => {
      if (item.b64_json) {
        return item.b64_json;
      }
      throw new Error('Invalid response format');
    }) || [];
  }

  private shouldOptimize(input: ImageGenerationInput): boolean {
    return input.output_compression !== undefined || input.format !== 'png';
  }

  private async optimizeImages(images: string[], input: ImageGenerationInput): Promise<string[]> {
    const optimized = await this.optimizer.optimizeBatch(images, input);
    
    if (images.length > 0 && optimized.length > 0) {
      const reduction = await this.optimizer.calculateSizeReduction(images[0]!, optimized[0]!);
      if (reduction > 0) {
        console.log(`Image optimized: ${reduction}% size reduction`);
      }
    }
    
    return optimized;
  }

  private createProgressEvent(progress: number, message: string): StreamingImageEvent {
    return {
      type: 'progress',
      data: { progress, message }
    };
  }

  private createPartialEvent(partialImage: string, index: number): StreamingImageEvent {
    return {
      type: 'partial',
      data: {
        partialImage,
        partialImageIndex: index,
        progress: 50 + (index * 15),
        message: `Partial image ${index + 1} ready`
      }
    };
  }

  private createCompleteEvent(result: ImageGenerationResult): StreamingImageEvent {
    return {
      type: 'complete',
      data: {
        finalImage: result.images[0],
        revisedPrompt: result.revised_prompt,
        progress: 100,
        message: 'Image generation completed!'
      }
    };
  }

  private createErrorEvent(error: unknown): StreamingImageEvent {
    return {
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}