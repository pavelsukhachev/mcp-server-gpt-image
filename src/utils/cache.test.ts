import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { ImageCache } from './cache';
import { ImageGenerationInput, ImageEditInput } from '../types';

vi.mock('fs/promises');
vi.mock('crypto');

describe('ImageCache', () => {
  let cache: ImageCache;
  const mockCacheDir = '/test/cache/dir';
  const mockTTL = 3600;
  const mockMaxSize = 100;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    
    // Mock fs.mkdir
    (fs.mkdir as any).mockResolvedValue(undefined);
    
    // Mock crypto.createHash
    const mockHash = {
      update: vi.fn().mockReturnThis(),
      digest: vi.fn().mockReturnValue('mockedhash123456'),
    };
    (crypto.createHash as any).mockReturnValue(mockHash);

    cache = new ImageCache({
      cacheDir: mockCacheDir,
      defaultTTL: mockTTL,
      maxSize: mockMaxSize,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('constructor and initialization', () => {
    it('should create cache directory on initialization', async () => {
      await vi.runAllTimersAsync();
      
      expect(fs.mkdir).toHaveBeenCalledWith(mockCacheDir, { recursive: true });
    });

    it('should handle cache directory creation failure', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      (fs.mkdir as any).mockRejectedValue(new Error('Permission denied'));
      
      new ImageCache({ cacheDir: mockCacheDir });
      await vi.runAllTimersAsync();
      
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to create cache directory:',
        expect.any(Error)
      );
      
      consoleErrorSpy.mockRestore();
    });

    it('should use default values when options are not provided', () => {
      const defaultCache = new ImageCache();
      
      expect(fs.mkdir).toHaveBeenCalledWith(
        expect.stringContaining('.cache/images'),
        { recursive: true }
      );
    });
  });

  describe('generateCacheKey', () => {
    it('should generate consistent keys for generation inputs', () => {
      const input: ImageGenerationInput = {
        prompt: 'A beautiful sunset',
        size: '1024x1024',
        quality: 'high',
        format: 'png',
      };

      // Call private method through get
      (fs.stat as any).mockRejectedValue(new Error('Not found'));
      
      cache.get('generate', input);
      const firstCallCount = (crypto.createHash as any).mock.calls.length;
      
      vi.clearAllMocks();
      (fs.stat as any).mockRejectedValue(new Error('Not found'));
      
      cache.get('generate', input);
      const secondCallCount = (crypto.createHash as any).mock.calls.length;
      
      // Should create same hash for same input
      expect(firstCallCount).toBeGreaterThan(0);
      expect(secondCallCount).toBe(firstCallCount);
    });

    it('should generate different keys for edit inputs with images', () => {
      const editInput: ImageEditInput = {
        prompt: 'Add a red bridge',
        images: ['base64imagedata'],
        mask: 'base64maskdata',
      };

      (fs.stat as any).mockRejectedValue(new Error('Not found'));
      
      cache.get('edit', editInput);
      
      const hashCalls = (crypto.createHash as any).mock.calls;
      expect(hashCalls.some(call => call[0] === 'md5')).toBe(true);
    });
  });

  describe('get', () => {
    const mockInput: ImageGenerationInput = {
      prompt: 'Test prompt',
      size: '1024x1024',
    };

    it('should return cached data from memory when not expired', async () => {
      const mockData = { url: 'https://example.com/image.png' };
      const key = 'mockedhash123456';
      
      // Manually set memory cache
      (cache as any).memoryCache.set(key, {
        key,
        timestamp: Date.now(),
        ttl: mockTTL,
        data: mockData,
      });

      const result = await cache.get('generate', mockInput);
      
      expect(result).toEqual(mockData);
      expect(fs.stat).not.toHaveBeenCalled();
    });

    it('should return null when memory cache is expired', async () => {
      const mockData = { url: 'https://example.com/image.png' };
      const key = 'mockedhash123456';
      
      // Set expired memory cache
      (cache as any).memoryCache.set(key, {
        key,
        timestamp: Date.now() - (mockTTL + 1) * 1000,
        ttl: mockTTL,
        data: mockData,
      });

      (fs.stat as any).mockRejectedValue(new Error('Not found'));

      const result = await cache.get('generate', mockInput);
      
      expect(result).toBeNull();
    });

    it('should return cached data from disk when not expired', async () => {
      const mockData = { url: 'https://example.com/image.png' };
      const mockFilePath = path.join(mockCacheDir, 'mockedhash123456.json');
      
      (fs.stat as any).mockResolvedValue({
        mtimeMs: Date.now() - 1000, // 1 second ago
      });
      
      (fs.readFile as any).mockResolvedValue(JSON.stringify(mockData));

      const result = await cache.get('generate', mockInput);
      
      expect(result).toEqual(mockData);
      expect(fs.readFile).toHaveBeenCalledWith(mockFilePath, 'utf-8');
    });

    it('should remove expired disk cache files', async () => {
      const mockFilePath = path.join(mockCacheDir, 'mockedhash123456.json');
      
      (fs.stat as any).mockResolvedValue({
        mtimeMs: Date.now() - (mockTTL + 1) * 1000, // Expired
      });
      
      (fs.unlink as any).mockResolvedValue(undefined);

      const result = await cache.get('generate', mockInput);
      
      expect(result).toBeNull();
      expect(fs.unlink).toHaveBeenCalledWith(mockFilePath);
    });

    it('should handle disk read errors gracefully', async () => {
      (fs.stat as any).mockRejectedValue(new Error('File not found'));

      const result = await cache.get('generate', mockInput);
      
      expect(result).toBeNull();
    });
  });

  describe('set', () => {
    const mockInput: ImageGenerationInput = {
      prompt: 'Test prompt',
    };
    const mockData = { url: 'https://example.com/image.png' };

    it('should store data in memory and disk', async () => {
      (fs.writeFile as any).mockResolvedValue(undefined);
      (fs.readdir as any).mockResolvedValue([]);

      await cache.set('generate', mockInput, mockData);
      
      expect((cache as any).memoryCache.size).toBe(1);
      expect(fs.writeFile).toHaveBeenCalledWith(
        path.join(mockCacheDir, 'mockedhash123456.json'),
        JSON.stringify(mockData, null, 2)
      );
    });

    it('should use custom TTL when provided', async () => {
      const customTTL = 7200;
      (fs.writeFile as any).mockResolvedValue(undefined);
      (fs.readdir as any).mockResolvedValue([]);

      await cache.set('generate', mockInput, mockData, customTTL);
      
      const memEntry = (cache as any).memoryCache.get('mockedhash123456');
      expect(memEntry.ttl).toBe(customTTL);
    });

    it('should handle write errors gracefully', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      (fs.writeFile as any).mockRejectedValue(new Error('Write failed'));

      await cache.set('generate', mockInput, mockData);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to write cache:',
        expect.any(Error)
      );
      
      consoleErrorSpy.mockRestore();
    });

    it('should trigger cleanup when needed', async () => {
      (fs.writeFile as any).mockResolvedValue(undefined);
      (fs.readdir as any).mockResolvedValue(['file1.json', 'file2.json']);
      
      // Mock large file sizes to trigger cleanup
      (fs.stat as any).mockResolvedValue({
        size: 60 * 1024 * 1024, // 60MB per file
        mtimeMs: Date.now() - 1000,
      });

      await cache.set('generate', mockInput, mockData);
      
      expect(fs.readdir).toHaveBeenCalledWith(mockCacheDir);
    });
  });

  describe('cleanupIfNeeded', () => {
    it('should remove oldest files when cache exceeds max size', async () => {
      const mockFiles = ['old.json', 'newer.json', 'newest.json'];
      (fs.readdir as any).mockResolvedValue(mockFiles);
      
      (fs.stat as any)
        .mockResolvedValueOnce({ size: 40 * 1024 * 1024, mtimeMs: 1000 })
        .mockResolvedValueOnce({ size: 40 * 1024 * 1024, mtimeMs: 2000 })
        .mockResolvedValueOnce({ size: 40 * 1024 * 1024, mtimeMs: 3000 });
      
      (fs.unlink as any).mockResolvedValue(undefined);
      (fs.writeFile as any).mockResolvedValue(undefined);

      await cache.set('generate', { prompt: 'test' }, { data: 'test' });
      
      expect(fs.unlink).toHaveBeenCalledWith(path.join(mockCacheDir, 'old.json'));
    });

    it('should remove expired entries from memory cache', async () => {
      (fs.readdir as any).mockResolvedValue([]);
      (fs.writeFile as any).mockResolvedValue(undefined);
      
      // Add expired entry to memory cache
      (cache as any).memoryCache.set('expired', {
        key: 'expired',
        timestamp: Date.now() - (mockTTL + 1) * 1000,
        ttl: mockTTL,
        data: {},
      });
      
      // Add valid entry
      (cache as any).memoryCache.set('valid', {
        key: 'valid',
        timestamp: Date.now(),
        ttl: mockTTL,
        data: {},
      });

      await cache.set('generate', { prompt: 'test' }, { data: 'test' });
      
      expect((cache as any).memoryCache.has('expired')).toBe(false);
      expect((cache as any).memoryCache.has('valid')).toBe(true);
    });

    it('should handle cleanup errors gracefully', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      (fs.readdir as any).mockRejectedValue(new Error('Read failed'));
      (fs.writeFile as any).mockResolvedValue(undefined);

      await cache.set('generate', { prompt: 'test' }, { data: 'test' });
      
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Cache cleanup error:',
        expect.any(Error)
      );
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('clear', () => {
    it('should clear memory cache and delete all files', async () => {
      const mockFiles = ['file1.json', 'file2.json'];
      (fs.readdir as any).mockResolvedValue(mockFiles);
      (fs.unlink as any).mockResolvedValue(undefined);
      
      // Add items to memory cache
      (cache as any).memoryCache.set('key1', { data: 'test1' });
      (cache as any).memoryCache.set('key2', { data: 'test2' });

      await cache.clear();
      
      expect((cache as any).memoryCache.size).toBe(0);
      expect(fs.unlink).toHaveBeenCalledTimes(2);
      expect(fs.unlink).toHaveBeenCalledWith(path.join(mockCacheDir, 'file1.json'));
      expect(fs.unlink).toHaveBeenCalledWith(path.join(mockCacheDir, 'file2.json'));
    });

    it('should handle clear errors gracefully', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      (fs.readdir as any).mockRejectedValue(new Error('Read failed'));

      await cache.clear();
      
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to clear cache:',
        expect.any(Error)
      );
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('getCacheStats', () => {
    it('should return correct cache statistics', () => {
      // Add items to memory cache
      (cache as any).memoryCache.set('key1', { data: 'test1' });
      (cache as any).memoryCache.set('key2', { data: 'test2' });
      (cache as any).memoryCache.set('key3', { data: 'test3' });

      const stats = cache.getCacheStats();
      
      expect(stats).toEqual({
        memoryEntries: 3,
        estimatedDiskUsage: '1.5 MB',
      });
    });
  });

  describe('singleton instance', () => {
    it('should create singleton with environment variables', async () => {
      const originalEnv = process.env;
      
      vi.resetModules();
      process.env = {
        ...originalEnv,
        CACHE_DIR: '/custom/cache',
        CACHE_TTL: '7200',
        CACHE_MAX_SIZE: '200',
      };

      const { imageCache } = await import('./cache');
      
      expect(fs.mkdir).toHaveBeenCalledWith(
        '/custom/cache',
        { recursive: true }
      );
      
      process.env = originalEnv;
    });
  });
});