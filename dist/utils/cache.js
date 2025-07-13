import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
export class ImageCache {
    cacheDir;
    defaultTTL;
    maxSize;
    memoryCache;
    constructor(options = {}) {
        this.cacheDir = options.cacheDir || path.join(process.cwd(), '.cache', 'images');
        this.defaultTTL = options.defaultTTL || 3600; // 1 hour default
        this.maxSize = options.maxSize || 100; // 100MB default
        this.memoryCache = new Map();
        this.initializeCache();
    }
    async initializeCache() {
        try {
            await fs.mkdir(this.cacheDir, { recursive: true });
        }
        catch (error) {
            console.error('Failed to create cache directory:', error);
        }
    }
    generateCacheKey(type, input) {
        const normalized = {
            type,
            prompt: input.prompt,
            size: input.size || '1024x1024',
            quality: input.quality || 'auto',
            format: input.format || 'png',
            // For edit operations, include image hash
            ...(type === 'edit' && 'images' in input ? {
                imageHash: crypto.createHash('md5').update(input.images[0] || '').digest('hex').substring(0, 8),
                maskHash: input.mask ? crypto.createHash('md5').update(input.mask).digest('hex').substring(0, 8) : null,
            } : {})
        };
        const keyString = JSON.stringify(normalized, Object.keys(normalized).sort());
        return crypto.createHash('sha256').update(keyString).digest('hex');
    }
    async get(type, input) {
        const key = this.generateCacheKey(type, input);
        // Check memory cache first
        const memEntry = this.memoryCache.get(key);
        if (memEntry && Date.now() - memEntry.timestamp < memEntry.ttl * 1000) {
            console.log(`Cache hit (memory): ${key}`);
            return memEntry.data;
        }
        // Check disk cache
        try {
            const filePath = path.join(this.cacheDir, `${key}.json`);
            const stat = await fs.stat(filePath);
            // Check if file exists and is not expired
            const age = Date.now() - stat.mtimeMs;
            if (age < this.defaultTTL * 1000) {
                const content = await fs.readFile(filePath, 'utf-8');
                const data = JSON.parse(content);
                // Update memory cache
                this.memoryCache.set(key, {
                    key,
                    timestamp: stat.mtimeMs,
                    ttl: this.defaultTTL,
                    data
                });
                console.log(`Cache hit (disk): ${key}`);
                return data;
            }
            else {
                // Remove expired file
                await fs.unlink(filePath).catch(() => { });
            }
        }
        catch (error) {
            // File doesn't exist or error reading
        }
        console.log(`Cache miss: ${key}`);
        return null;
    }
    async set(type, input, data, ttl) {
        const key = this.generateCacheKey(type, input);
        const cacheTTL = ttl || this.defaultTTL;
        // Update memory cache
        this.memoryCache.set(key, {
            key,
            timestamp: Date.now(),
            ttl: cacheTTL,
            data
        });
        // Write to disk
        try {
            const filePath = path.join(this.cacheDir, `${key}.json`);
            await fs.writeFile(filePath, JSON.stringify(data, null, 2));
            console.log(`Cache set: ${key}`);
            // Clean up old entries if needed
            await this.cleanupIfNeeded();
        }
        catch (error) {
            console.error('Failed to write cache:', error);
        }
    }
    async cleanupIfNeeded() {
        try {
            const files = await fs.readdir(this.cacheDir);
            const stats = await Promise.all(files.map(async (file) => {
                const filePath = path.join(this.cacheDir, file);
                const stat = await fs.stat(filePath);
                return { path: filePath, size: stat.size, mtime: stat.mtimeMs };
            }));
            // Calculate total size
            const totalSize = stats.reduce((sum, stat) => sum + stat.size, 0) / (1024 * 1024); // MB
            if (totalSize > this.maxSize) {
                // Sort by modification time (oldest first)
                stats.sort((a, b) => a.mtime - b.mtime);
                // Remove oldest files until under limit
                let currentSize = totalSize;
                for (const stat of stats) {
                    if (currentSize <= this.maxSize * 0.8)
                        break; // Keep 80% to avoid frequent cleanups
                    await fs.unlink(stat.path).catch(() => { });
                    currentSize -= stat.size / (1024 * 1024);
                    console.log(`Cleaned up cache file: ${path.basename(stat.path)}`);
                }
            }
            // Clean up expired entries from memory cache
            const now = Date.now();
            for (const [key, entry] of this.memoryCache.entries()) {
                if (now - entry.timestamp > entry.ttl * 1000) {
                    this.memoryCache.delete(key);
                }
            }
        }
        catch (error) {
            console.error('Cache cleanup error:', error);
        }
    }
    async clear() {
        this.memoryCache.clear();
        try {
            const files = await fs.readdir(this.cacheDir);
            await Promise.all(files.map(file => fs.unlink(path.join(this.cacheDir, file)).catch(() => { })));
            console.log('Cache cleared');
        }
        catch (error) {
            console.error('Failed to clear cache:', error);
        }
    }
    getCacheStats() {
        return {
            memoryEntries: this.memoryCache.size,
            estimatedDiskUsage: `${(this.memoryCache.size * 0.5).toFixed(1)} MB` // Rough estimate
        };
    }
}
// Singleton instance
export const imageCache = new ImageCache({
    cacheDir: process.env.CACHE_DIR,
    defaultTTL: parseInt(process.env.CACHE_TTL || '3600'),
    maxSize: parseInt(process.env.CACHE_MAX_SIZE || '100')
});
//# sourceMappingURL=cache.js.map