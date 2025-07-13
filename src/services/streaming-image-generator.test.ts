import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StreamingImageGenerator } from './streaming-image-generator';
import { 
  IImageCache, 
  IImageOptimizer, 
  IOpenAIClient 
} from '../interfaces/image-generation.interface';
import { ImageGenerationInput } from '../types';

describe('StreamingImageGenerator', () => {
  let streamingGenerator: StreamingImageGenerator;
  let mockOpenAIClient: IOpenAIClient;
  let mockCache: IImageCache;
  let mockOptimizer: IImageOptimizer;

  beforeEach(() => {
    mockOpenAIClient = {
      generateImage: vi.fn(),
      editImage: vi.fn(),
    };

    mockCache = {
      get: vi.fn(),
      set: vi.fn(),
    };

    mockOptimizer = {
      optimizeBatch: vi.fn(),
      calculateSizeReduction: vi.fn(),
    };

    streamingGenerator = new StreamingImageGenerator(
      mockOpenAIClient,
      mockCache,
      mockOptimizer
    );
  });

  describe('generateWithStreaming', () => {
    const mockInput: ImageGenerationInput = {
      prompt: 'A beautiful sunset',
    } as ImageGenerationInput;

    async function collectEvents(generator: AsyncGenerator<any>): Promise<any[]> {
      const events = [];
      for await (const event of generator) {
        events.push(event);
      }
      return events;
    }

    it('should return cached result when available', async () => {
      const cachedResult = {
        images: ['cached-image-base64'],
        revised_prompt: 'Cached sunset prompt',
      };

      vi.mocked(mockCache.get).mockResolvedValue(cachedResult);

      const events = await collectEvents(
        streamingGenerator.generateWithStreaming(mockInput)
      );

      expect(events).toHaveLength(2);
      expect(events[0]).toEqual({
        type: 'progress',
        data: {
          progress: 100,
          message: 'Retrieved from cache',
        },
      });
      expect(events[1]).toEqual({
        type: 'complete',
        data: {
          finalImage: 'cached-image-base64',
          revisedPrompt: 'Cached sunset prompt',
          progress: 100,
          message: 'Image generation completed!',
        },
      });

      expect(mockOpenAIClient.generateImage).not.toHaveBeenCalled();
    });

    it('should generate new image when not cached', async () => {
      const mockResponse = {
        data: [{
          b64_json: 'generated-image-base64',
          revised_prompt: 'A stunning sunset over the ocean',
        }],
      };

      vi.mocked(mockCache.get).mockResolvedValue(null);
      vi.mocked(mockOpenAIClient.generateImage).mockResolvedValue(mockResponse);
      vi.mocked(mockOptimizer.optimizeBatch).mockImplementation(async (images) => images);

      const events = await collectEvents(
        streamingGenerator.generateWithStreaming(mockInput)
      );

      // There's an optimization event because defaults trigger it
      expect(events).toHaveLength(5); // init, processing, finalizing, optimizing, complete
      expect(events[0].type).toBe('progress');
      expect(events[0].data.message).toBe('Initializing image generation...');
      expect(events[1].type).toBe('progress');
      expect(events[1].data.message).toBe('Processing prompt...');
      expect(events[2].type).toBe('progress');
      expect(events[2].data.message).toBe('Finalizing image...');
      expect(events[3].type).toBe('progress');
      expect(events[3].data.message).toBe('Optimizing image...');
      expect(events[4].type).toBe('complete');
      expect(events[4].data.finalImage).toBe('generated-image-base64');

      expect(mockCache.set).toHaveBeenCalled();
    });

    it('should emit partial images when requested', async () => {
      const inputWithPartials = {
        ...mockInput,
        partialImages: 3,
        format: 'webp', // This will trigger optimization
      } as ImageGenerationInput;

      const mockResponse = {
        data: [{
          b64_json: 'final-image-base64',
          revised_prompt: 'Enhanced prompt',
        }],
      };

      vi.mocked(mockCache.get).mockResolvedValue(null);
      vi.mocked(mockOpenAIClient.generateImage).mockResolvedValue(mockResponse);

      const events = await collectEvents(
        streamingGenerator.generateWithStreaming(inputWithPartials)
      );

      const partialEvents = events.filter(e => e.type === 'partial');
      expect(partialEvents).toHaveLength(3);

      partialEvents.forEach((event, index) => {
        expect(event.data.partialImage).toBe('final-image-base64');
        expect(event.data.partialImageIndex).toBe(index);
        expect(event.data.message).toBe(`Partial image ${index + 1} ready`);
      });
    });

    it('should optimize images when compression is requested', async () => {
      const inputWithCompression = {
        ...mockInput,
        output_compression: 80,
      };

      const mockResponse = {
        data: [{
          b64_json: 'original-image',
        }],
      };

      vi.mocked(mockCache.get).mockResolvedValue(null);
      vi.mocked(mockOpenAIClient.generateImage).mockResolvedValue(mockResponse);
      vi.mocked(mockOptimizer.optimizeBatch).mockResolvedValue(['optimized-image']);
      vi.mocked(mockOptimizer.calculateSizeReduction).mockResolvedValue(25);

      const events = await collectEvents(
        streamingGenerator.generateWithStreaming(inputWithCompression)
      );

      const progressEvents = events.filter(e => e.type === 'progress');
      expect(progressEvents.some(e => e.data.message === 'Optimizing image...')).toBe(true);

      const completeEvent = events.find(e => e.type === 'complete');
      expect(completeEvent?.data.finalImage).toBe('optimized-image');

      expect(mockOptimizer.optimizeBatch).toHaveBeenCalledWith(
        ['original-image'],
        inputWithCompression
      );
    });

    it('should optimize images when format is not png', async () => {
      const inputWithJpeg = {
        ...mockInput,
        format: 'jpeg' as const,
      };

      const mockResponse = {
        data: [{
          b64_json: 'original-image',
        }],
      };

      vi.mocked(mockCache.get).mockResolvedValue(null);
      vi.mocked(mockOpenAIClient.generateImage).mockResolvedValue(mockResponse);
      vi.mocked(mockOptimizer.optimizeBatch).mockResolvedValue(['optimized-image']);
      vi.mocked(mockOptimizer.calculateSizeReduction).mockResolvedValue(30);

      await collectEvents(
        streamingGenerator.generateWithStreaming(inputWithJpeg)
      );

      expect(mockOptimizer.optimizeBatch).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      vi.mocked(mockCache.get).mockResolvedValue(null);
      vi.mocked(mockOpenAIClient.generateImage).mockRejectedValue(
        new Error('API rate limit exceeded')
      );

      const events = await collectEvents(
        streamingGenerator.generateWithStreaming(mockInput)
      );

      const errorEvent = events.find(e => e.type === 'error');
      expect(errorEvent).toBeDefined();
      expect(errorEvent?.error).toBe('API rate limit exceeded');
    });

    it('should handle missing images in response', async () => {
      const mockResponse = {
        data: [],
      };

      vi.mocked(mockCache.get).mockResolvedValue(null);
      vi.mocked(mockOpenAIClient.generateImage).mockResolvedValue(mockResponse);

      const events = await collectEvents(
        streamingGenerator.generateWithStreaming(mockInput)
      );

      const errorEvent = events.find(e => e.type === 'error');
      expect(errorEvent?.error).toBe('No images generated');
    });

    it('should handle invalid response format', async () => {
      const mockResponse = {
        data: [{
          url: 'https://example.com/image.png', // No b64_json
        }],
      };

      vi.mocked(mockCache.get).mockResolvedValue(null);
      vi.mocked(mockOpenAIClient.generateImage).mockResolvedValue(mockResponse);

      const events = await collectEvents(
        streamingGenerator.generateWithStreaming(mockInput)
      );

      const errorEvent = events.find(e => e.type === 'error');
      expect(errorEvent?.error).toBe('Invalid response format');
    });

    it('should handle auto size parameter', async () => {
      const inputWithAutoSize = {
        ...mockInput,
        size: 'auto' as const,
      };

      vi.mocked(mockCache.get).mockResolvedValue(null);
      vi.mocked(mockOpenAIClient.generateImage).mockResolvedValue({
        data: [{ b64_json: 'image' }],
      });

      await collectEvents(
        streamingGenerator.generateWithStreaming(inputWithAutoSize)
      );

      expect(mockOpenAIClient.generateImage).toHaveBeenCalledWith(
        expect.objectContaining({ size: '1024x1024' })
      );
    });

    it('should emit correct progress percentages', async () => {
      const inputWithPartials = {
        ...mockInput,
        partialImages: 2,
      };

      vi.mocked(mockCache.get).mockResolvedValue(null);
      vi.mocked(mockOpenAIClient.generateImage).mockResolvedValue({
        data: [{ b64_json: 'image' }],
      });

      const events = await collectEvents(
        streamingGenerator.generateWithStreaming(inputWithPartials)
      );

      const progressEvents = events
        .filter(e => e.type === 'progress' || e.type === 'partial')
        .map(e => e.data?.progress);

      expect(progressEvents).toEqual([0, 30, 40, 50, 55, 65, 90, 95]); // includes optimization
    });

    it('should not emit partial images when not requested', async () => {
      vi.mocked(mockCache.get).mockResolvedValue(null);
      vi.mocked(mockOpenAIClient.generateImage).mockResolvedValue({
        data: [{ b64_json: 'image' }],
      });

      const events = await collectEvents(
        streamingGenerator.generateWithStreaming(mockInput)
      );

      const partialEvents = events.filter(e => e.type === 'partial');
      expect(partialEvents).toHaveLength(0);
    });

    it('should log optimization results', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      const inputWithOptimization = {
        ...mockInput,
        format: 'webp' as const,
      };

      vi.mocked(mockCache.get).mockResolvedValue(null);
      vi.mocked(mockOpenAIClient.generateImage).mockResolvedValue({
        data: [{ b64_json: 'original' }],
      });
      vi.mocked(mockOptimizer.optimizeBatch).mockResolvedValue(['optimized']);
      vi.mocked(mockOptimizer.calculateSizeReduction).mockResolvedValue(35.5);

      await collectEvents(
        streamingGenerator.generateWithStreaming(inputWithOptimization)
      );

      expect(consoleLogSpy).toHaveBeenCalledWith('Image optimized: 35.5% size reduction');
      
      consoleLogSpy.mockRestore();
    });
  });
});