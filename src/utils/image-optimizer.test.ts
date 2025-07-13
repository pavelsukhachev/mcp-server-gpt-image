import { describe, it, expect, vi, beforeEach } from 'vitest';
import sharp from 'sharp';
import { ImageOptimizer } from './image-optimizer';
import { ImageGenerationInput, ImageEditInput } from '../types';

vi.mock('sharp');

describe('ImageOptimizer', () => {
  const mockSharpInstance = {
    metadata: vi.fn(),
    resize: vi.fn(),
    jpeg: vi.fn(),
    webp: vi.fn(),
    png: vi.fn(),
    toBuffer: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockSharpInstance.resize.mockReturnValue(mockSharpInstance);
    mockSharpInstance.jpeg.mockReturnValue(mockSharpInstance);
    mockSharpInstance.webp.mockReturnValue(mockSharpInstance);
    mockSharpInstance.png.mockReturnValue(mockSharpInstance);
    (sharp as any).mockReturnValue(mockSharpInstance);
  });

  describe('optimizeBase64', () => {
    const validBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    const dataUriBase64 = `data:image/png;base64,${validBase64}`;

    it('should handle base64 strings with data URI prefix', async () => {
      const mockMetadata = { hasAlpha: false, density: 72 };
      const mockOutputBuffer = Buffer.from('optimized', 'utf-8');
      
      mockSharpInstance.metadata.mockResolvedValue(mockMetadata);
      mockSharpInstance.toBuffer.mockResolvedValue(mockOutputBuffer);

      const result = await ImageOptimizer.optimizeBase64(dataUriBase64);
      
      expect(sharp).toHaveBeenCalledWith(Buffer.from(validBase64, 'base64'));
      expect(result).toBe(mockOutputBuffer.toString('base64'));
    });

    it('should handle plain base64 strings', async () => {
      const mockMetadata = { hasAlpha: false, density: 72 };
      const mockOutputBuffer = Buffer.from('optimized', 'utf-8');
      
      mockSharpInstance.metadata.mockResolvedValue(mockMetadata);
      mockSharpInstance.toBuffer.mockResolvedValue(mockOutputBuffer);

      const result = await ImageOptimizer.optimizeBase64(validBase64);
      
      expect(sharp).toHaveBeenCalledWith(Buffer.from(validBase64, 'base64'));
      expect(result).toBe(mockOutputBuffer.toString('base64'));
    });

    it('should resize image when maxWidth or maxHeight are provided', async () => {
      const mockMetadata = { hasAlpha: false, density: 72 };
      const mockOutputBuffer = Buffer.from('resized', 'utf-8');
      
      mockSharpInstance.metadata.mockResolvedValue(mockMetadata);
      mockSharpInstance.toBuffer.mockResolvedValue(mockOutputBuffer);

      await ImageOptimizer.optimizeBase64(validBase64, { maxWidth: 800, maxHeight: 600 });
      
      expect(mockSharpInstance.resize).toHaveBeenCalledWith({
        width: 800,
        height: 600,
        fit: 'inside',
        withoutEnlargement: true,
      });
    });

    it('should convert to JPEG format with proper settings', async () => {
      const mockMetadata = { hasAlpha: false, density: 150 };
      const mockOutputBuffer = Buffer.from('jpeg', 'utf-8');
      
      mockSharpInstance.metadata.mockResolvedValue(mockMetadata);
      mockSharpInstance.toBuffer.mockResolvedValue(mockOutputBuffer);

      await ImageOptimizer.optimizeBase64(validBase64, { format: 'jpeg', quality: 90 });
      
      expect(mockSharpInstance.jpeg).toHaveBeenCalledWith({
        quality: 90,
        progressive: true,
        mozjpeg: true,
      });
    });

    it('should convert to WebP format with proper settings', async () => {
      const mockMetadata = { hasAlpha: false, density: 72 };
      const mockOutputBuffer = Buffer.from('webp', 'utf-8');
      
      mockSharpInstance.metadata.mockResolvedValue(mockMetadata);
      mockSharpInstance.toBuffer.mockResolvedValue(mockOutputBuffer);

      await ImageOptimizer.optimizeBase64(validBase64, { format: 'webp', quality: 85 });
      
      expect(mockSharpInstance.webp).toHaveBeenCalledWith({
        quality: 85,
        effort: 6,
        lossless: false,
      });
    });

    it('should use lossless WebP when quality is 100', async () => {
      const mockMetadata = { hasAlpha: false, density: 72 };
      const mockOutputBuffer = Buffer.from('webp', 'utf-8');
      
      mockSharpInstance.metadata.mockResolvedValue(mockMetadata);
      mockSharpInstance.toBuffer.mockResolvedValue(mockOutputBuffer);

      await ImageOptimizer.optimizeBase64(validBase64, { format: 'webp', quality: 100 });
      
      expect(mockSharpInstance.webp).toHaveBeenCalledWith({
        quality: 100,
        effort: 6,
        lossless: true,
      });
    });

    it('should convert to PNG format with proper settings', async () => {
      const mockMetadata = { hasAlpha: true };
      const mockOutputBuffer = Buffer.from('png', 'utf-8');
      
      mockSharpInstance.metadata.mockResolvedValue(mockMetadata);
      mockSharpInstance.toBuffer.mockResolvedValue(mockOutputBuffer);

      await ImageOptimizer.optimizeBase64(validBase64, { format: 'png', quality: 95 });
      
      expect(mockSharpInstance.png).toHaveBeenCalledWith({
        compressionLevel: 9,
        progressive: true,
        palette: true,
        quality: 95,
      });
    });

    it('should return original image on error', async () => {
      mockSharpInstance.metadata.mockRejectedValue(new Error('Sharp error'));

      const result = await ImageOptimizer.optimizeBase64(validBase64);
      
      expect(result).toBe(validBase64);
    });
  });

  describe('optimizeForOutput', () => {
    const validBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';

    it('should optimize with format and quality from input', async () => {
      const mockMetadata = { hasAlpha: false, density: 72 };
      const mockOutputBuffer = Buffer.from('optimized', 'utf-8');
      
      mockSharpInstance.metadata.mockResolvedValue(mockMetadata);
      mockSharpInstance.toBuffer.mockResolvedValue(mockOutputBuffer);

      const input: ImageGenerationInput = {
        prompt: 'test',
        format: 'jpeg',
        quality: 'high',
        background: 'opaque',
      };

      await ImageOptimizer.optimizeForOutput(validBase64, input);
      
      expect(mockSharpInstance.jpeg).toHaveBeenCalled();
    });

    it('should set dimensions based on size parameter', async () => {
      const mockMetadata = { hasAlpha: false, density: 72 };
      const mockOutputBuffer = Buffer.from('optimized', 'utf-8');
      
      mockSharpInstance.metadata.mockResolvedValue(mockMetadata);
      mockSharpInstance.toBuffer.mockResolvedValue(mockOutputBuffer);

      const input: ImageGenerationInput = {
        prompt: 'test',
        size: '1024x768',
      };

      await ImageOptimizer.optimizeForOutput(validBase64, input);
      
      expect(mockSharpInstance.resize).toHaveBeenCalledWith({
        width: 1024,
        height: 768,
        fit: 'inside',
        withoutEnlargement: true,
      });
    });

    it('should not resize when size is auto', async () => {
      const mockMetadata = { hasAlpha: false, density: 72 };
      const mockOutputBuffer = Buffer.from('optimized', 'utf-8');
      
      mockSharpInstance.metadata.mockResolvedValue(mockMetadata);
      mockSharpInstance.toBuffer.mockResolvedValue(mockOutputBuffer);

      const input: ImageGenerationInput = {
        prompt: 'test',
        size: 'auto',
      };

      await ImageOptimizer.optimizeForOutput(validBase64, input);
      
      expect(mockSharpInstance.resize).not.toHaveBeenCalled();
    });

    it('should use output_compression when provided', async () => {
      const mockMetadata = { hasAlpha: false, density: 72 };
      const mockOutputBuffer = Buffer.from('optimized', 'utf-8');
      
      mockSharpInstance.metadata.mockResolvedValue(mockMetadata);
      mockSharpInstance.toBuffer.mockResolvedValue(mockOutputBuffer);

      const input: ImageGenerationInput = {
        prompt: 'test',
        format: 'jpeg',
        output_compression: 75,
      };

      await ImageOptimizer.optimizeForOutput(validBase64, input);
      
      expect(mockSharpInstance.jpeg).toHaveBeenCalledWith(
        expect.objectContaining({ quality: 75 })
      );
    });
  });

  describe('optimizeBatch', () => {
    it('should optimize multiple images in parallel', async () => {
      const mockMetadata = { hasAlpha: false, density: 72 };
      const mockOutputBuffer = Buffer.from('optimized', 'utf-8');
      
      mockSharpInstance.metadata.mockResolvedValue(mockMetadata);
      mockSharpInstance.toBuffer.mockResolvedValue(mockOutputBuffer);

      const images = ['image1', 'image2', 'image3'];
      const input: ImageGenerationInput = {
        prompt: 'test',
        format: 'jpeg',
      };

      const results = await ImageOptimizer.optimizeBatch(images, input);
      
      expect(results).toHaveLength(3);
      expect(sharp).toHaveBeenCalledTimes(3);
    });
  });

  describe('calculateSizeReduction', () => {
    it('should calculate correct size reduction percentage', async () => {
      const original = Buffer.from('a'.repeat(1000)).toString('base64');
      const optimized = Buffer.from('a'.repeat(600)).toString('base64');

      const reduction = await ImageOptimizer.calculateSizeReduction(original, optimized);
      
      expect(reduction).toBe(40);
    });

    it('should round to one decimal place', async () => {
      const original = Buffer.from('a'.repeat(1000)).toString('base64');
      const optimized = Buffer.from('a'.repeat(666)).toString('base64');

      const reduction = await ImageOptimizer.calculateSizeReduction(original, optimized);
      
      expect(reduction).toBe(33.4);
    });
  });

  describe('private methods', () => {
    describe('detectOptimalFormat', () => {
      it('should return png for images with alpha channel', () => {
        const mockMetadata = { hasAlpha: true };
        const mockOutputBuffer = Buffer.from('png', 'utf-8');
        
        mockSharpInstance.metadata.mockResolvedValue(mockMetadata);
        mockSharpInstance.toBuffer.mockResolvedValue(mockOutputBuffer);

        ImageOptimizer.optimizeBase64('test');
        
        const sharpCall = (sharp as any).mock.calls[0];
        expect(sharpCall).toBeDefined();
      });
    });

    describe('mapQualityToNumber', () => {
      const testCases = [
        { quality: 'low' as const, expected: 60 },
        { quality: 'medium' as const, expected: 80 },
        { quality: 'high' as const, expected: 95 },
        { quality: 'auto' as const, expected: 85 },
        { quality: undefined, expected: 85 },
      ];

      testCases.forEach(({ quality, expected }) => {
        it(`should map quality '${quality}' to ${expected}`, async () => {
          const mockMetadata = { hasAlpha: false, density: 72 };
          const mockOutputBuffer = Buffer.from('test', 'utf-8');
          
          mockSharpInstance.metadata.mockResolvedValue(mockMetadata);
          mockSharpInstance.toBuffer.mockResolvedValue(mockOutputBuffer);

          const input: ImageGenerationInput = {
            prompt: 'test',
            format: 'jpeg',
            quality,
          };

          await ImageOptimizer.optimizeForOutput('test', input);
          
          expect(mockSharpInstance.jpeg).toHaveBeenCalledWith(
            expect.objectContaining({ quality: expected })
          );
        });
      });
    });
  });
});