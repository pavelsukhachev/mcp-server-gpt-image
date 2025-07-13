import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ImageGenerator } from './image-generator';
import { 
  IImageCache, 
  IImageOptimizer, 
  IOpenAIClient,
  IFileConverter 
} from '../interfaces/image-generation.interface';
import { ImageGenerationInput, ImageEditInput } from '../types';

describe('ImageGenerator', () => {
  let imageGenerator: ImageGenerator;
  let mockOpenAIClient: IOpenAIClient;
  let mockCache: IImageCache;
  let mockOptimizer: IImageOptimizer;
  let mockFileConverter: IFileConverter;

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

    mockFileConverter = {
      base64ToFile: vi.fn(),
      extractBase64FromDataUrl: vi.fn(),
    };

    imageGenerator = new ImageGenerator(
      mockOpenAIClient,
      mockCache,
      mockOptimizer,
      mockFileConverter
    );
  });

  describe('generate', () => {
    const mockInput: ImageGenerationInput = {
      prompt: 'A beautiful sunset',
      size: '1024x1024',
      quality: 'high',
    };

    it('should return cached result if available', async () => {
      const cachedResult = {
        images: ['cached-image-base64'],
        revised_prompt: 'A beautiful sunset over the ocean',
      };

      vi.mocked(mockCache.get).mockResolvedValue(cachedResult);

      const result = await imageGenerator.generate(mockInput);

      expect(result).toEqual(cachedResult);
      expect(mockCache.get).toHaveBeenCalledWith('generate', mockInput);
      expect(mockOpenAIClient.generateImage).not.toHaveBeenCalled();
    });

    it('should generate new image when not cached', async () => {
      const mockResponse = {
        data: [{
          b64_json: 'generated-image-base64',
          revised_prompt: 'A stunning sunset',
        }],
      };

      vi.mocked(mockCache.get).mockResolvedValue(null);
      vi.mocked(mockOpenAIClient.generateImage).mockResolvedValue(mockResponse);
      vi.mocked(mockOptimizer.optimizeBatch).mockImplementation(async (images) => images);

      const result = await imageGenerator.generate(mockInput);

      expect(result).toEqual({
        images: ['generated-image-base64'],
        revised_prompt: 'A stunning sunset',
      });

      expect(mockOpenAIClient.generateImage).toHaveBeenCalledWith({
        model: 'gpt-image-1',
        prompt: mockInput.prompt,
        size: mockInput.size,
        quality: mockInput.quality,
        n: undefined,
      });

      expect(mockCache.set).toHaveBeenCalledWith('generate', mockInput, result);
    });

    it('should handle auto size parameter', async () => {
      const inputWithAutoSize = { ...mockInput, size: 'auto' as const };

      vi.mocked(mockCache.get).mockResolvedValue(null);
      vi.mocked(mockOpenAIClient.generateImage).mockResolvedValue({ data: [] });

      await imageGenerator.generate(inputWithAutoSize);

      expect(mockOpenAIClient.generateImage).toHaveBeenCalledWith(
        expect.objectContaining({ size: '1024x1024' })
      );
    });

    it('should optimize images when compression is requested', async () => {
      const inputWithCompression = { ...mockInput, output_compression: 80 };
      const mockResponse = {
        data: [{
          b64_json: 'original-image',
        }],
      };

      vi.mocked(mockCache.get).mockResolvedValue(null);
      vi.mocked(mockOpenAIClient.generateImage).mockResolvedValue(mockResponse);
      vi.mocked(mockOptimizer.optimizeBatch).mockResolvedValue(['optimized-image']);
      vi.mocked(mockOptimizer.calculateSizeReduction).mockResolvedValue(25);

      const result = await imageGenerator.generate(inputWithCompression);

      expect(mockOptimizer.optimizeBatch).toHaveBeenCalledWith(
        ['original-image'],
        inputWithCompression
      );
      expect(result.images).toEqual(['optimized-image']);
    });

    it('should optimize images when format is not png', async () => {
      const inputWithJpeg = { ...mockInput, format: 'jpeg' as const };
      const mockResponse = {
        data: [{
          b64_json: 'original-image',
        }],
      };

      vi.mocked(mockCache.get).mockResolvedValue(null);
      vi.mocked(mockOpenAIClient.generateImage).mockResolvedValue(mockResponse);
      vi.mocked(mockOptimizer.optimizeBatch).mockResolvedValue(['optimized-image']);
      vi.mocked(mockOptimizer.calculateSizeReduction).mockResolvedValue(30);

      await imageGenerator.generate(inputWithJpeg);

      expect(mockOptimizer.optimizeBatch).toHaveBeenCalled();
    });

    it('should throw error for URL response format', async () => {
      const mockResponse = {
        data: [{
          url: 'https://example.com/image.png',
        }],
      };

      vi.mocked(mockCache.get).mockResolvedValue(null);
      vi.mocked(mockOpenAIClient.generateImage).mockResolvedValue(mockResponse);

      await expect(imageGenerator.generate(mockInput)).rejects.toThrow(
        'URL response not supported yet. Please use b64_json.'
      );
    });

    it('should handle multiple images', async () => {
      const inputWithMultiple = { ...mockInput, n: 3 };
      const mockResponse = {
        data: [
          { b64_json: 'image-1' },
          { b64_json: 'image-2' },
          { b64_json: 'image-3' },
        ],
      };

      vi.mocked(mockCache.get).mockResolvedValue(null);
      vi.mocked(mockOpenAIClient.generateImage).mockResolvedValue(mockResponse);
      vi.mocked(mockOptimizer.optimizeBatch).mockImplementation(async (images) => images);

      const result = await imageGenerator.generate(inputWithMultiple);

      expect(result.images).toHaveLength(3);
      expect(result.images).toEqual(['image-1', 'image-2', 'image-3']);
    });
  });

  describe('edit', () => {
    const mockInput: ImageEditInput = {
      prompt: 'Add a rainbow',
      images: ['base64-image-data'],
    };

    it('should return cached result if available', async () => {
      const cachedResult = {
        images: ['cached-edited-image'],
        revised_prompt: 'Added a rainbow to the image',
      };

      vi.mocked(mockCache.get).mockResolvedValue(cachedResult);

      const result = await imageGenerator.edit(mockInput);

      expect(result).toEqual(cachedResult);
      expect(mockCache.get).toHaveBeenCalledWith('edit', mockInput);
      expect(mockOpenAIClient.editImage).not.toHaveBeenCalled();
    });

    it('should edit image when not cached', async () => {
      const mockFile = new File(['content'], 'image.png', { type: 'image/png' });
      const mockResponse = {
        data: [{
          b64_json: 'edited-image-base64',
          revised_prompt: 'Added a vibrant rainbow',
        }],
      };

      vi.mocked(mockCache.get).mockResolvedValue(null);
      vi.mocked(mockFileConverter.extractBase64FromDataUrl).mockReturnValue('base64-image-data');
      vi.mocked(mockFileConverter.base64ToFile).mockReturnValue(mockFile);
      vi.mocked(mockOpenAIClient.editImage).mockResolvedValue(mockResponse);
      vi.mocked(mockOptimizer.optimizeBatch).mockImplementation(async (images) => images);

      const result = await imageGenerator.edit(mockInput);

      expect(result).toEqual({
        images: ['edited-image-base64'],
        revised_prompt: 'Added a vibrant rainbow',
      });

      expect(mockFileConverter.extractBase64FromDataUrl).toHaveBeenCalledWith('base64-image-data');
      expect(mockFileConverter.base64ToFile).toHaveBeenCalledWith(
        'base64-image-data',
        'image_0.png',
        'image/png'
      );

      expect(mockOpenAIClient.editImage).toHaveBeenCalledWith({
        model: 'gpt-image-1',
        image: mockFile,
        prompt: mockInput.prompt,
        mask: undefined,
        size: '1024x1024',
        n: undefined,
      });
    });

    it('should handle data URL format', async () => {
      const inputWithDataUrl: ImageEditInput = {
        prompt: 'Add a rainbow',
        images: ['data:image/png;base64,abc123'],
      };
      const mockFile = new File(['content'], 'image.png', { type: 'image/png' });

      vi.mocked(mockCache.get).mockResolvedValue(null);
      vi.mocked(mockFileConverter.extractBase64FromDataUrl).mockReturnValue('abc123');
      vi.mocked(mockFileConverter.base64ToFile).mockReturnValue(mockFile);
      vi.mocked(mockOpenAIClient.editImage).mockResolvedValue({ data: [] });

      await imageGenerator.edit(inputWithDataUrl);

      expect(mockFileConverter.extractBase64FromDataUrl).toHaveBeenCalledWith(
        'data:image/png;base64,abc123'
      );
    });

    it('should handle mask parameter', async () => {
      const inputWithMask: ImageEditInput = {
        ...mockInput,
        mask: 'mask-base64-data',
      };
      const mockImageFile = new File(['image'], 'image.png', { type: 'image/png' });
      const mockMaskFile = new File(['mask'], 'mask.png', { type: 'image/png' });

      vi.mocked(mockCache.get).mockResolvedValue(null);
      vi.mocked(mockFileConverter.extractBase64FromDataUrl)
        .mockReturnValueOnce('base64-image-data')
        .mockReturnValueOnce('mask-base64-data');
      vi.mocked(mockFileConverter.base64ToFile)
        .mockReturnValueOnce(mockImageFile)
        .mockReturnValueOnce(mockMaskFile);
      vi.mocked(mockOpenAIClient.editImage).mockResolvedValue({ data: [] });

      await imageGenerator.edit(inputWithMask);

      expect(mockOpenAIClient.editImage).toHaveBeenCalledWith(
        expect.objectContaining({
          mask: mockMaskFile,
        })
      );
    });

    it('should optimize edited images when requested', async () => {
      const inputWithOptimization: ImageEditInput = {
        ...mockInput,
        format: 'webp',
      };
      const mockFile = new File(['content'], 'image.png', { type: 'image/png' });
      const mockResponse = {
        data: [{
          b64_json: 'original-edited-image',
        }],
      };

      vi.mocked(mockCache.get).mockResolvedValue(null);
      vi.mocked(mockFileConverter.extractBase64FromDataUrl).mockReturnValue('base64-image-data');
      vi.mocked(mockFileConverter.base64ToFile).mockReturnValue(mockFile);
      vi.mocked(mockOpenAIClient.editImage).mockResolvedValue(mockResponse);
      vi.mocked(mockOptimizer.optimizeBatch).mockResolvedValue(['optimized-edited-image']);
      vi.mocked(mockOptimizer.calculateSizeReduction).mockResolvedValue(20);

      const result = await imageGenerator.edit(inputWithOptimization);

      expect(mockOptimizer.optimizeBatch).toHaveBeenCalledWith(
        ['original-edited-image'],
        inputWithOptimization
      );
      expect(result.images).toEqual(['optimized-edited-image']);
    });
  });
});