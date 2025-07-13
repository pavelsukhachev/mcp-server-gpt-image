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
exports.imageCache = exports.ImageCache = void 0;
var crypto_1 = require("crypto");
var promises_1 = require("fs/promises");
var path_1 = require("path");
var ImageCache = /** @class */ (function () {
    function ImageCache(options) {
        if (options === void 0) { options = {}; }
        this.cacheDir = options.cacheDir || path_1.default.join(process.cwd(), '.cache', 'images');
        this.defaultTTL = options.defaultTTL || 3600; // 1 hour default
        this.maxSize = options.maxSize || 100; // 100MB default
        this.memoryCache = new Map();
        this.initializeCache();
    }
    ImageCache.prototype.initializeCache = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, promises_1.default.mkdir(this.cacheDir, { recursive: true })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Failed to create cache directory:', error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ImageCache.prototype.generateCacheKey = function (type, input) {
        var normalized = __assign({ type: type, prompt: input.prompt, size: input.size || '1024x1024', quality: input.quality || 'auto', format: input.format || 'png' }, (type === 'edit' && 'images' in input ? {
            imageHash: crypto_1.default.createHash('md5').update(input.images[0] || '').digest('hex').substring(0, 8),
            maskHash: input.mask ? crypto_1.default.createHash('md5').update(input.mask).digest('hex').substring(0, 8) : null,
        } : {}));
        var keyString = JSON.stringify(normalized, Object.keys(normalized).sort());
        return crypto_1.default.createHash('sha256').update(keyString).digest('hex');
    };
    ImageCache.prototype.get = function (type, input) {
        return __awaiter(this, void 0, void 0, function () {
            var key, memEntry, filePath, stat, age, content, data, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        key = this.generateCacheKey(type, input);
                        memEntry = this.memoryCache.get(key);
                        if (memEntry && Date.now() - memEntry.timestamp < memEntry.ttl * 1000) {
                            console.log("Cache hit (memory): ".concat(key));
                            return [2 /*return*/, memEntry.data];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        filePath = path_1.default.join(this.cacheDir, "".concat(key, ".json"));
                        return [4 /*yield*/, promises_1.default.stat(filePath)];
                    case 2:
                        stat = _a.sent();
                        age = Date.now() - stat.mtimeMs;
                        if (!(age < this.defaultTTL * 1000)) return [3 /*break*/, 4];
                        return [4 /*yield*/, promises_1.default.readFile(filePath, 'utf-8')];
                    case 3:
                        content = _a.sent();
                        data = JSON.parse(content);
                        // Update memory cache
                        this.memoryCache.set(key, {
                            key: key,
                            timestamp: stat.mtimeMs,
                            ttl: this.defaultTTL,
                            data: data
                        });
                        console.log("Cache hit (disk): ".concat(key));
                        return [2 /*return*/, data];
                    case 4: 
                    // Remove expired file
                    return [4 /*yield*/, promises_1.default.unlink(filePath).catch(function () { })];
                    case 5:
                        // Remove expired file
                        _a.sent();
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_2 = _a.sent();
                        return [3 /*break*/, 8];
                    case 8:
                        console.log("Cache miss: ".concat(key));
                        return [2 /*return*/, null];
                }
            });
        });
    };
    ImageCache.prototype.set = function (type, input, data, ttl) {
        return __awaiter(this, void 0, void 0, function () {
            var key, cacheTTL, filePath, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        key = this.generateCacheKey(type, input);
                        cacheTTL = ttl || this.defaultTTL;
                        // Update memory cache
                        this.memoryCache.set(key, {
                            key: key,
                            timestamp: Date.now(),
                            ttl: cacheTTL,
                            data: data
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        filePath = path_1.default.join(this.cacheDir, "".concat(key, ".json"));
                        return [4 /*yield*/, promises_1.default.writeFile(filePath, JSON.stringify(data, null, 2))];
                    case 2:
                        _a.sent();
                        console.log("Cache set: ".concat(key));
                        // Clean up old entries if needed
                        return [4 /*yield*/, this.cleanupIfNeeded()];
                    case 3:
                        // Clean up old entries if needed
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_3 = _a.sent();
                        console.error('Failed to write cache:', error_3);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ImageCache.prototype.cleanupIfNeeded = function () {
        return __awaiter(this, void 0, void 0, function () {
            var files, stats, totalSize, currentSize, _i, stats_1, stat, now, _a, _b, _c, key, entry, error_4;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, promises_1.default.readdir(this.cacheDir)];
                    case 1:
                        files = _d.sent();
                        return [4 /*yield*/, Promise.all(files.map(function (file) { return __awaiter(_this, void 0, void 0, function () {
                                var filePath, stat;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            filePath = path_1.default.join(this.cacheDir, file);
                                            return [4 /*yield*/, promises_1.default.stat(filePath)];
                                        case 1:
                                            stat = _a.sent();
                                            return [2 /*return*/, { path: filePath, size: stat.size, mtime: stat.mtimeMs }];
                                    }
                                });
                            }); }))];
                    case 2:
                        stats = _d.sent();
                        totalSize = stats.reduce(function (sum, stat) { return sum + stat.size; }, 0) / (1024 * 1024);
                        if (!(totalSize > this.maxSize)) return [3 /*break*/, 6];
                        // Sort by modification time (oldest first)
                        stats.sort(function (a, b) { return a.mtime - b.mtime; });
                        currentSize = totalSize;
                        _i = 0, stats_1 = stats;
                        _d.label = 3;
                    case 3:
                        if (!(_i < stats_1.length)) return [3 /*break*/, 6];
                        stat = stats_1[_i];
                        if (currentSize <= this.maxSize * 0.8)
                            return [3 /*break*/, 6]; // Keep 80% to avoid frequent cleanups
                        return [4 /*yield*/, promises_1.default.unlink(stat.path).catch(function () { })];
                    case 4:
                        _d.sent();
                        currentSize -= stat.size / (1024 * 1024);
                        console.log("Cleaned up cache file: ".concat(path_1.default.basename(stat.path)));
                        _d.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6:
                        now = Date.now();
                        for (_a = 0, _b = this.memoryCache.entries(); _a < _b.length; _a++) {
                            _c = _b[_a], key = _c[0], entry = _c[1];
                            if (now - entry.timestamp > entry.ttl * 1000) {
                                this.memoryCache.delete(key);
                            }
                        }
                        return [3 /*break*/, 8];
                    case 7:
                        error_4 = _d.sent();
                        console.error('Cache cleanup error:', error_4);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    ImageCache.prototype.clear = function () {
        return __awaiter(this, void 0, void 0, function () {
            var files, error_5;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.memoryCache.clear();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, promises_1.default.readdir(this.cacheDir)];
                    case 2:
                        files = _a.sent();
                        return [4 /*yield*/, Promise.all(files.map(function (file) { return promises_1.default.unlink(path_1.default.join(_this.cacheDir, file)).catch(function () { }); }))];
                    case 3:
                        _a.sent();
                        console.log('Cache cleared');
                        return [3 /*break*/, 5];
                    case 4:
                        error_5 = _a.sent();
                        console.error('Failed to clear cache:', error_5);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ImageCache.prototype.getCacheStats = function () {
        return {
            memoryEntries: this.memoryCache.size,
            estimatedDiskUsage: "".concat((this.memoryCache.size * 0.5).toFixed(1), " MB") // Rough estimate
        };
    };
    return ImageCache;
}());
exports.ImageCache = ImageCache;
// Singleton instance
exports.imageCache = new ImageCache({
    cacheDir: process.env.CACHE_DIR,
    defaultTTL: parseInt(process.env.CACHE_TTL || '3600'),
    maxSize: parseInt(process.env.CACHE_MAX_SIZE || '100')
});
