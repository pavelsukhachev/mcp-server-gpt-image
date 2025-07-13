"use strict";
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
var sharp_1 = require("sharp");
var image_optimizer_1 = require("./image-optimizer");
vitest_1.vi.mock('sharp');
(0, vitest_1.describe)('ImageOptimizer', function () {
    var mockSharpInstance = {
        metadata: vitest_1.vi.fn(),
        resize: vitest_1.vi.fn(),
        jpeg: vitest_1.vi.fn(),
        webp: vitest_1.vi.fn(),
        png: vitest_1.vi.fn(),
        toBuffer: vitest_1.vi.fn(),
    };
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
        mockSharpInstance.resize.mockReturnValue(mockSharpInstance);
        mockSharpInstance.jpeg.mockReturnValue(mockSharpInstance);
        mockSharpInstance.webp.mockReturnValue(mockSharpInstance);
        mockSharpInstance.png.mockReturnValue(mockSharpInstance);
        sharp_1.default.mockReturnValue(mockSharpInstance);
    });
    (0, vitest_1.describe)('optimizeBase64', function () {
        var validBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
        var dataUriBase64 = "data:image/png;base64,".concat(validBase64);
        (0, vitest_1.it)('should handle base64 strings with data URI prefix', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockMetadata, mockOutputBuffer, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockMetadata = { hasAlpha: false, density: 72 };
                        mockOutputBuffer = Buffer.from('optimized', 'utf-8');
                        mockSharpInstance.metadata.mockResolvedValue(mockMetadata);
                        mockSharpInstance.toBuffer.mockResolvedValue(mockOutputBuffer);
                        return [4 /*yield*/, image_optimizer_1.ImageOptimizer.optimizeBase64(dataUriBase64)];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(sharp_1.default).toHaveBeenCalledWith(Buffer.from(validBase64, 'base64'));
                        (0, vitest_1.expect)(result).toBe(mockOutputBuffer.toString('base64'));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle plain base64 strings', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockMetadata, mockOutputBuffer, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockMetadata = { hasAlpha: false, density: 72 };
                        mockOutputBuffer = Buffer.from('optimized', 'utf-8');
                        mockSharpInstance.metadata.mockResolvedValue(mockMetadata);
                        mockSharpInstance.toBuffer.mockResolvedValue(mockOutputBuffer);
                        return [4 /*yield*/, image_optimizer_1.ImageOptimizer.optimizeBase64(validBase64)];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(sharp_1.default).toHaveBeenCalledWith(Buffer.from(validBase64, 'base64'));
                        (0, vitest_1.expect)(result).toBe(mockOutputBuffer.toString('base64'));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should resize image when maxWidth or maxHeight are provided', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockMetadata, mockOutputBuffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockMetadata = { hasAlpha: false, density: 72 };
                        mockOutputBuffer = Buffer.from('resized', 'utf-8');
                        mockSharpInstance.metadata.mockResolvedValue(mockMetadata);
                        mockSharpInstance.toBuffer.mockResolvedValue(mockOutputBuffer);
                        return [4 /*yield*/, image_optimizer_1.ImageOptimizer.optimizeBase64(validBase64, { maxWidth: 800, maxHeight: 600 })];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(mockSharpInstance.resize).toHaveBeenCalledWith({
                            width: 800,
                            height: 600,
                            fit: 'inside',
                            withoutEnlargement: true,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should convert to JPEG format with proper settings', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockMetadata, mockOutputBuffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockMetadata = { hasAlpha: false, density: 150 };
                        mockOutputBuffer = Buffer.from('jpeg', 'utf-8');
                        mockSharpInstance.metadata.mockResolvedValue(mockMetadata);
                        mockSharpInstance.toBuffer.mockResolvedValue(mockOutputBuffer);
                        return [4 /*yield*/, image_optimizer_1.ImageOptimizer.optimizeBase64(validBase64, { format: 'jpeg', quality: 90 })];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(mockSharpInstance.jpeg).toHaveBeenCalledWith({
                            quality: 90,
                            progressive: true,
                            mozjpeg: true,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should convert to WebP format with proper settings', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockMetadata, mockOutputBuffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockMetadata = { hasAlpha: false, density: 72 };
                        mockOutputBuffer = Buffer.from('webp', 'utf-8');
                        mockSharpInstance.metadata.mockResolvedValue(mockMetadata);
                        mockSharpInstance.toBuffer.mockResolvedValue(mockOutputBuffer);
                        return [4 /*yield*/, image_optimizer_1.ImageOptimizer.optimizeBase64(validBase64, { format: 'webp', quality: 85 })];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(mockSharpInstance.webp).toHaveBeenCalledWith({
                            quality: 85,
                            effort: 6,
                            lossless: false,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should use lossless WebP when quality is 100', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockMetadata, mockOutputBuffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockMetadata = { hasAlpha: false, density: 72 };
                        mockOutputBuffer = Buffer.from('webp', 'utf-8');
                        mockSharpInstance.metadata.mockResolvedValue(mockMetadata);
                        mockSharpInstance.toBuffer.mockResolvedValue(mockOutputBuffer);
                        return [4 /*yield*/, image_optimizer_1.ImageOptimizer.optimizeBase64(validBase64, { format: 'webp', quality: 100 })];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(mockSharpInstance.webp).toHaveBeenCalledWith({
                            quality: 100,
                            effort: 6,
                            lossless: true,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should convert to PNG format with proper settings', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockMetadata, mockOutputBuffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockMetadata = { hasAlpha: true };
                        mockOutputBuffer = Buffer.from('png', 'utf-8');
                        mockSharpInstance.metadata.mockResolvedValue(mockMetadata);
                        mockSharpInstance.toBuffer.mockResolvedValue(mockOutputBuffer);
                        return [4 /*yield*/, image_optimizer_1.ImageOptimizer.optimizeBase64(validBase64, { format: 'png', quality: 95 })];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(mockSharpInstance.png).toHaveBeenCalledWith({
                            compressionLevel: 9,
                            progressive: true,
                            palette: true,
                            quality: 95,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should return original image on error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockSharpInstance.metadata.mockRejectedValue(new Error('Sharp error'));
                        return [4 /*yield*/, image_optimizer_1.ImageOptimizer.optimizeBase64(validBase64)];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toBe(validBase64);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('optimizeForOutput', function () {
        var validBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
        (0, vitest_1.it)('should optimize with format and quality from input', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockMetadata, mockOutputBuffer, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockMetadata = { hasAlpha: false, density: 72 };
                        mockOutputBuffer = Buffer.from('optimized', 'utf-8');
                        mockSharpInstance.metadata.mockResolvedValue(mockMetadata);
                        mockSharpInstance.toBuffer.mockResolvedValue(mockOutputBuffer);
                        input = {
                            prompt: 'test',
                            format: 'jpeg',
                            quality: 'high',
                            background: 'opaque',
                        };
                        return [4 /*yield*/, image_optimizer_1.ImageOptimizer.optimizeForOutput(validBase64, input)];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(mockSharpInstance.jpeg).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should set dimensions based on size parameter', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockMetadata, mockOutputBuffer, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockMetadata = { hasAlpha: false, density: 72 };
                        mockOutputBuffer = Buffer.from('optimized', 'utf-8');
                        mockSharpInstance.metadata.mockResolvedValue(mockMetadata);
                        mockSharpInstance.toBuffer.mockResolvedValue(mockOutputBuffer);
                        input = {
                            prompt: 'test',
                            size: '1024x768',
                        };
                        return [4 /*yield*/, image_optimizer_1.ImageOptimizer.optimizeForOutput(validBase64, input)];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(mockSharpInstance.resize).toHaveBeenCalledWith({
                            width: 1024,
                            height: 768,
                            fit: 'inside',
                            withoutEnlargement: true,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should not resize when size is auto', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockMetadata, mockOutputBuffer, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockMetadata = { hasAlpha: false, density: 72 };
                        mockOutputBuffer = Buffer.from('optimized', 'utf-8');
                        mockSharpInstance.metadata.mockResolvedValue(mockMetadata);
                        mockSharpInstance.toBuffer.mockResolvedValue(mockOutputBuffer);
                        input = {
                            prompt: 'test',
                            size: 'auto',
                        };
                        return [4 /*yield*/, image_optimizer_1.ImageOptimizer.optimizeForOutput(validBase64, input)];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(mockSharpInstance.resize).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should use output_compression when provided', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockMetadata, mockOutputBuffer, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockMetadata = { hasAlpha: false, density: 72 };
                        mockOutputBuffer = Buffer.from('optimized', 'utf-8');
                        mockSharpInstance.metadata.mockResolvedValue(mockMetadata);
                        mockSharpInstance.toBuffer.mockResolvedValue(mockOutputBuffer);
                        input = {
                            prompt: 'test',
                            format: 'jpeg',
                            output_compression: 75,
                        };
                        return [4 /*yield*/, image_optimizer_1.ImageOptimizer.optimizeForOutput(validBase64, input)];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(mockSharpInstance.jpeg).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ quality: 75 }));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('optimizeBatch', function () {
        (0, vitest_1.it)('should optimize multiple images in parallel', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockMetadata, mockOutputBuffer, images, input, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockMetadata = { hasAlpha: false, density: 72 };
                        mockOutputBuffer = Buffer.from('optimized', 'utf-8');
                        mockSharpInstance.metadata.mockResolvedValue(mockMetadata);
                        mockSharpInstance.toBuffer.mockResolvedValue(mockOutputBuffer);
                        images = ['image1', 'image2', 'image3'];
                        input = {
                            prompt: 'test',
                            format: 'jpeg',
                        };
                        return [4 /*yield*/, image_optimizer_1.ImageOptimizer.optimizeBatch(images, input)];
                    case 1:
                        results = _a.sent();
                        (0, vitest_1.expect)(results).toHaveLength(3);
                        (0, vitest_1.expect)(sharp_1.default).toHaveBeenCalledTimes(3);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('calculateSizeReduction', function () {
        (0, vitest_1.it)('should calculate correct size reduction percentage', function () { return __awaiter(void 0, void 0, void 0, function () {
            var original, optimized, reduction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        original = Buffer.from('a'.repeat(1000)).toString('base64');
                        optimized = Buffer.from('a'.repeat(600)).toString('base64');
                        return [4 /*yield*/, image_optimizer_1.ImageOptimizer.calculateSizeReduction(original, optimized)];
                    case 1:
                        reduction = _a.sent();
                        (0, vitest_1.expect)(reduction).toBe(40);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should round to one decimal place', function () { return __awaiter(void 0, void 0, void 0, function () {
            var original, optimized, reduction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        original = Buffer.from('a'.repeat(1000)).toString('base64');
                        optimized = Buffer.from('a'.repeat(666)).toString('base64');
                        return [4 /*yield*/, image_optimizer_1.ImageOptimizer.calculateSizeReduction(original, optimized)];
                    case 1:
                        reduction = _a.sent();
                        (0, vitest_1.expect)(reduction).toBe(33.4);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('private methods', function () {
        (0, vitest_1.describe)('detectOptimalFormat', function () {
            (0, vitest_1.it)('should return png for images with alpha channel', function () {
                var mockMetadata = { hasAlpha: true };
                var mockOutputBuffer = Buffer.from('png', 'utf-8');
                mockSharpInstance.metadata.mockResolvedValue(mockMetadata);
                mockSharpInstance.toBuffer.mockResolvedValue(mockOutputBuffer);
                image_optimizer_1.ImageOptimizer.optimizeBase64('test');
                var sharpCall = sharp_1.default.mock.calls[0];
                (0, vitest_1.expect)(sharpCall).toBeDefined();
            });
        });
        (0, vitest_1.describe)('mapQualityToNumber', function () {
            var testCases = [
                { quality: 'low', expected: 60 },
                { quality: 'medium', expected: 80 },
                { quality: 'high', expected: 95 },
                { quality: 'auto', expected: 85 },
                { quality: undefined, expected: 85 },
            ];
            testCases.forEach(function (_a) {
                var quality = _a.quality, expected = _a.expected;
                (0, vitest_1.it)("should map quality '".concat(quality, "' to ").concat(expected), function () { return __awaiter(void 0, void 0, void 0, function () {
                    var mockMetadata, mockOutputBuffer, input;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                mockMetadata = { hasAlpha: false, density: 72 };
                                mockOutputBuffer = Buffer.from('test', 'utf-8');
                                mockSharpInstance.metadata.mockResolvedValue(mockMetadata);
                                mockSharpInstance.toBuffer.mockResolvedValue(mockOutputBuffer);
                                input = {
                                    prompt: 'test',
                                    format: 'jpeg',
                                    quality: quality,
                                };
                                return [4 /*yield*/, image_optimizer_1.ImageOptimizer.optimizeForOutput('test', input)];
                            case 1:
                                _a.sent();
                                (0, vitest_1.expect)(mockSharpInstance.jpeg).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ quality: expected }));
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
        });
    });
});
