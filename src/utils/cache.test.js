"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var promises_1 = require("fs/promises");
var path_1 = require("path");
var crypto_1 = require("crypto");
var cache_1 = require("./cache");
vitest_1.vi.mock('fs/promises');
vitest_1.vi.mock('crypto');
(0, vitest_1.describe)('ImageCache', function () {
    var cache;
    var mockCacheDir = '/test/cache/dir';
    var mockTTL = 3600;
    var mockMaxSize = 100;
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
        vitest_1.vi.useFakeTimers();
        // Mock fs.mkdir
        promises_1.default.mkdir.mockResolvedValue(undefined);
        // Mock crypto.createHash
        var mockHash = {
            update: vitest_1.vi.fn().mockReturnThis(),
            digest: vitest_1.vi.fn().mockReturnValue('mockedhash123456'),
        };
        crypto_1.default.createHash.mockReturnValue(mockHash);
        cache = new cache_1.ImageCache({
            cacheDir: mockCacheDir,
            defaultTTL: mockTTL,
            maxSize: mockMaxSize,
        });
    });
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.useRealTimers();
    });
    (0, vitest_1.describe)('constructor and initialization', function () {
        (0, vitest_1.it)('should create cache directory on initialization', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, vitest_1.vi.runAllTimersAsync()];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(promises_1.default.mkdir).toHaveBeenCalledWith(mockCacheDir, { recursive: true });
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle cache directory creation failure', function () { return __awaiter(void 0, void 0, void 0, function () {
            var consoleErrorSpy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        consoleErrorSpy = vitest_1.vi.spyOn(console, 'error').mockImplementation(function () { });
                        promises_1.default.mkdir.mockRejectedValue(new Error('Permission denied'));
                        new cache_1.ImageCache({ cacheDir: mockCacheDir });
                        return [4 /*yield*/, vitest_1.vi.runAllTimersAsync()];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(consoleErrorSpy).toHaveBeenCalledWith('Failed to create cache directory:', vitest_1.expect.any(Error));
                        consoleErrorSpy.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should use default values when options are not provided', function () {
            var defaultCache = new cache_1.ImageCache();
            (0, vitest_1.expect)(promises_1.default.mkdir).toHaveBeenCalledWith(vitest_1.expect.stringContaining('.cache/images'), { recursive: true });
        });
    });
    (0, vitest_1.describe)('generateCacheKey', function () {
        (0, vitest_1.it)('should generate consistent keys for generation inputs', function () {
            var input = {
                prompt: 'A beautiful sunset',
                size: '1024x1024',
                quality: 'high',
                format: 'png',
            };
            // Call private method through get
            promises_1.default.stat.mockRejectedValue(new Error('Not found'));
            cache.get('generate', input);
            var firstCallCount = crypto_1.default.createHash.mock.calls.length;
            vitest_1.vi.clearAllMocks();
            promises_1.default.stat.mockRejectedValue(new Error('Not found'));
            cache.get('generate', input);
            var secondCallCount = crypto_1.default.createHash.mock.calls.length;
            // Should create same hash for same input
            (0, vitest_1.expect)(firstCallCount).toBeGreaterThan(0);
            (0, vitest_1.expect)(secondCallCount).toBe(firstCallCount);
        });
        (0, vitest_1.it)('should generate different keys for edit inputs with images', function () {
            var editInput = {
                prompt: 'Add a red bridge',
                images: ['base64imagedata'],
                mask: 'base64maskdata',
            };
            promises_1.default.stat.mockRejectedValue(new Error('Not found'));
            cache.get('edit', editInput);
            var hashCalls = crypto_1.default.createHash.mock.calls;
            (0, vitest_1.expect)(hashCalls.some(function (call) { return call[0] === 'md5'; })).toBe(true);
        });
    });
    (0, vitest_1.describe)('get', function () {
        var mockInput = {
            prompt: 'Test prompt',
            size: '1024x1024',
        };
        (0, vitest_1.it)('should return cached data from memory when not expired', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockData, key, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockData = { url: 'https://example.com/image.png' };
                        key = 'mockedhash123456';
                        // Manually set memory cache
                        cache.memoryCache.set(key, {
                            key: key,
                            timestamp: Date.now(),
                            ttl: mockTTL,
                            data: mockData,
                        });
                        return [4 /*yield*/, cache.get('generate', mockInput)];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toEqual(mockData);
                        (0, vitest_1.expect)(promises_1.default.stat).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should return null when memory cache is expired', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockData, key, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockData = { url: 'https://example.com/image.png' };
                        key = 'mockedhash123456';
                        // Set expired memory cache
                        cache.memoryCache.set(key, {
                            key: key,
                            timestamp: Date.now() - (mockTTL + 1) * 1000,
                            ttl: mockTTL,
                            data: mockData,
                        });
                        promises_1.default.stat.mockRejectedValue(new Error('Not found'));
                        return [4 /*yield*/, cache.get('generate', mockInput)];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toBeNull();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should return cached data from disk when not expired', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockData, mockFilePath, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockData = { url: 'https://example.com/image.png' };
                        mockFilePath = path_1.default.join(mockCacheDir, 'mockedhash123456.json');
                        promises_1.default.stat.mockResolvedValue({
                            mtimeMs: Date.now() - 1000, // 1 second ago
                        });
                        promises_1.default.readFile.mockResolvedValue(JSON.stringify(mockData));
                        return [4 /*yield*/, cache.get('generate', mockInput)];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toEqual(mockData);
                        (0, vitest_1.expect)(promises_1.default.readFile).toHaveBeenCalledWith(mockFilePath, 'utf-8');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should remove expired disk cache files', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockFilePath, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFilePath = path_1.default.join(mockCacheDir, 'mockedhash123456.json');
                        promises_1.default.stat.mockResolvedValue({
                            mtimeMs: Date.now() - (mockTTL + 1) * 1000, // Expired
                        });
                        promises_1.default.unlink.mockResolvedValue(undefined);
                        return [4 /*yield*/, cache.get('generate', mockInput)];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toBeNull();
                        (0, vitest_1.expect)(promises_1.default.unlink).toHaveBeenCalledWith(mockFilePath);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle disk read errors gracefully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promises_1.default.stat.mockRejectedValue(new Error('File not found'));
                        return [4 /*yield*/, cache.get('generate', mockInput)];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toBeNull();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('set', function () {
        var mockInput = {
            prompt: 'Test prompt',
        };
        var mockData = { url: 'https://example.com/image.png' };
        (0, vitest_1.it)('should store data in memory and disk', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promises_1.default.writeFile.mockResolvedValue(undefined);
                        promises_1.default.readdir.mockResolvedValue([]);
                        return [4 /*yield*/, cache.set('generate', mockInput, mockData)];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(cache.memoryCache.size).toBe(1);
                        (0, vitest_1.expect)(promises_1.default.writeFile).toHaveBeenCalledWith(path_1.default.join(mockCacheDir, 'mockedhash123456.json'), JSON.stringify(mockData, null, 2));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should use custom TTL when provided', function () { return __awaiter(void 0, void 0, void 0, function () {
            var customTTL, memEntry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customTTL = 7200;
                        promises_1.default.writeFile.mockResolvedValue(undefined);
                        promises_1.default.readdir.mockResolvedValue([]);
                        return [4 /*yield*/, cache.set('generate', mockInput, mockData, customTTL)];
                    case 1:
                        _a.sent();
                        memEntry = cache.memoryCache.get('mockedhash123456');
                        (0, vitest_1.expect)(memEntry.ttl).toBe(customTTL);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle write errors gracefully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var consoleErrorSpy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        consoleErrorSpy = vitest_1.vi.spyOn(console, 'error').mockImplementation(function () { });
                        promises_1.default.writeFile.mockRejectedValue(new Error('Write failed'));
                        return [4 /*yield*/, cache.set('generate', mockInput, mockData)];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(consoleErrorSpy).toHaveBeenCalledWith('Failed to write cache:', vitest_1.expect.any(Error));
                        consoleErrorSpy.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should trigger cleanup when needed', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promises_1.default.writeFile.mockResolvedValue(undefined);
                        promises_1.default.readdir.mockResolvedValue(['file1.json', 'file2.json']);
                        // Mock large file sizes to trigger cleanup
                        promises_1.default.stat.mockResolvedValue({
                            size: 60 * 1024 * 1024, // 60MB per file
                            mtimeMs: Date.now() - 1000,
                        });
                        return [4 /*yield*/, cache.set('generate', mockInput, mockData)];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(promises_1.default.readdir).toHaveBeenCalledWith(mockCacheDir);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('cleanupIfNeeded', function () {
        (0, vitest_1.it)('should remove oldest files when cache exceeds max size', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockFiles;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFiles = ['old.json', 'newer.json', 'newest.json'];
                        promises_1.default.readdir.mockResolvedValue(mockFiles);
                        promises_1.default.stat
                            .mockResolvedValueOnce({ size: 40 * 1024 * 1024, mtimeMs: 1000 })
                            .mockResolvedValueOnce({ size: 40 * 1024 * 1024, mtimeMs: 2000 })
                            .mockResolvedValueOnce({ size: 40 * 1024 * 1024, mtimeMs: 3000 });
                        promises_1.default.unlink.mockResolvedValue(undefined);
                        promises_1.default.writeFile.mockResolvedValue(undefined);
                        return [4 /*yield*/, cache.set('generate', { prompt: 'test' }, { data: 'test' })];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(promises_1.default.unlink).toHaveBeenCalledWith(path_1.default.join(mockCacheDir, 'old.json'));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should remove expired entries from memory cache', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promises_1.default.readdir.mockResolvedValue([]);
                        promises_1.default.writeFile.mockResolvedValue(undefined);
                        // Add expired entry to memory cache
                        cache.memoryCache.set('expired', {
                            key: 'expired',
                            timestamp: Date.now() - (mockTTL + 1) * 1000,
                            ttl: mockTTL,
                            data: {},
                        });
                        // Add valid entry
                        cache.memoryCache.set('valid', {
                            key: 'valid',
                            timestamp: Date.now(),
                            ttl: mockTTL,
                            data: {},
                        });
                        return [4 /*yield*/, cache.set('generate', { prompt: 'test' }, { data: 'test' })];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(cache.memoryCache.has('expired')).toBe(false);
                        (0, vitest_1.expect)(cache.memoryCache.has('valid')).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle cleanup errors gracefully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var consoleErrorSpy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        consoleErrorSpy = vitest_1.vi.spyOn(console, 'error').mockImplementation(function () { });
                        promises_1.default.readdir.mockRejectedValue(new Error('Read failed'));
                        promises_1.default.writeFile.mockResolvedValue(undefined);
                        return [4 /*yield*/, cache.set('generate', { prompt: 'test' }, { data: 'test' })];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(consoleErrorSpy).toHaveBeenCalledWith('Cache cleanup error:', vitest_1.expect.any(Error));
                        consoleErrorSpy.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('clear', function () {
        (0, vitest_1.it)('should clear memory cache and delete all files', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockFiles;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFiles = ['file1.json', 'file2.json'];
                        promises_1.default.readdir.mockResolvedValue(mockFiles);
                        promises_1.default.unlink.mockResolvedValue(undefined);
                        // Add items to memory cache
                        cache.memoryCache.set('key1', { data: 'test1' });
                        cache.memoryCache.set('key2', { data: 'test2' });
                        return [4 /*yield*/, cache.clear()];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(cache.memoryCache.size).toBe(0);
                        (0, vitest_1.expect)(promises_1.default.unlink).toHaveBeenCalledTimes(2);
                        (0, vitest_1.expect)(promises_1.default.unlink).toHaveBeenCalledWith(path_1.default.join(mockCacheDir, 'file1.json'));
                        (0, vitest_1.expect)(promises_1.default.unlink).toHaveBeenCalledWith(path_1.default.join(mockCacheDir, 'file2.json'));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle clear errors gracefully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var consoleErrorSpy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        consoleErrorSpy = vitest_1.vi.spyOn(console, 'error').mockImplementation(function () { });
                        promises_1.default.readdir.mockRejectedValue(new Error('Read failed'));
                        return [4 /*yield*/, cache.clear()];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(consoleErrorSpy).toHaveBeenCalledWith('Failed to clear cache:', vitest_1.expect.any(Error));
                        consoleErrorSpy.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('getCacheStats', function () {
        (0, vitest_1.it)('should return correct cache statistics', function () {
            // Add items to memory cache
            cache.memoryCache.set('key1', { data: 'test1' });
            cache.memoryCache.set('key2', { data: 'test2' });
            cache.memoryCache.set('key3', { data: 'test3' });
            var stats = cache.getCacheStats();
            (0, vitest_1.expect)(stats).toEqual({
                memoryEntries: 3,
                estimatedDiskUsage: '1.5 MB',
            });
        });
    });
    (0, vitest_1.describe)('singleton instance', function () {
        (0, vitest_1.it)('should create singleton with environment variables', function () { return __awaiter(void 0, void 0, void 0, function () {
            var originalEnv, imageCache;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        originalEnv = process.env;
                        vitest_1.vi.resetModules();
                        process.env = __assign(__assign({}, originalEnv), { CACHE_DIR: '/custom/cache', CACHE_TTL: '7200', CACHE_MAX_SIZE: '200' });
                        return [4 /*yield*/, Promise.resolve().then(function () { return require('./cache'); })];
                    case 1:
                        imageCache = (_a.sent()).imageCache;
                        (0, vitest_1.expect)(promises_1.default.mkdir).toHaveBeenCalledWith('/custom/cache', { recursive: true });
                        process.env = originalEnv;
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
