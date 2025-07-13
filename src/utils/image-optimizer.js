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
exports.ImageOptimizer = void 0;
var sharp_1 = require("sharp");
var ImageOptimizer = /** @class */ (function () {
    function ImageOptimizer() {
    }
    /**
     * Optimize a base64-encoded image
     */
    ImageOptimizer.optimizeBase64 = function (base64Image_1) {
        return __awaiter(this, arguments, void 0, function (base64Image, options) {
            var base64Data, inputBuffer, sharpInstance, metadata, format, quality, outputBuffer, error_1;
            if (options === void 0) { options = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        base64Data = base64Image.startsWith('data:')
                            ? base64Image.split(',')[1]
                            : base64Image;
                        inputBuffer = Buffer.from(base64Data, 'base64');
                        sharpInstance = (0, sharp_1.default)(inputBuffer);
                        return [4 /*yield*/, sharpInstance.metadata()];
                    case 1:
                        metadata = _a.sent();
                        // Resize if needed
                        if (options.maxWidth || options.maxHeight) {
                            sharpInstance = sharpInstance.resize({
                                width: options.maxWidth,
                                height: options.maxHeight,
                                fit: 'inside',
                                withoutEnlargement: true,
                            });
                        }
                        format = options.format || this.detectOptimalFormat(metadata);
                        quality = options.quality || this.getDefaultQuality(format);
                        switch (format) {
                            case 'jpeg':
                                sharpInstance = sharpInstance.jpeg({
                                    quality: quality,
                                    progressive: true,
                                    mozjpeg: true,
                                });
                                break;
                            case 'webp':
                                sharpInstance = sharpInstance.webp({
                                    quality: quality,
                                    effort: 6,
                                    lossless: quality === 100,
                                });
                                break;
                            case 'png':
                            default:
                                sharpInstance = sharpInstance.png({
                                    compressionLevel: 9,
                                    progressive: true,
                                    palette: quality < 100,
                                    quality: quality,
                                });
                                break;
                        }
                        return [4 /*yield*/, sharpInstance.toBuffer()];
                    case 2:
                        outputBuffer = _a.sent();
                        // Convert back to base64
                        return [2 /*return*/, outputBuffer.toString('base64')];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Image optimization error:', error_1);
                        // Return original image if optimization fails
                        return [2 /*return*/, base64Image];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Optimize images based on generation/edit input parameters
     */
    ImageOptimizer.optimizeForOutput = function (base64Image, input) {
        return __awaiter(this, void 0, void 0, function () {
            var options, _a, width, height;
            return __generator(this, function (_b) {
                options = {
                    format: input.format || 'png',
                    quality: this.mapQualityToNumber(input.quality, input.output_compression),
                    preserveTransparency: input.background === 'transparent',
                };
                // Set max dimensions based on size
                if (input.size && input.size !== 'auto') {
                    _a = input.size.split('x').map(Number), width = _a[0], height = _a[1];
                    options.maxWidth = width;
                    options.maxHeight = height;
                }
                return [2 /*return*/, this.optimizeBase64(base64Image, options)];
            });
        });
    };
    /**
     * Batch optimize multiple images
     */
    ImageOptimizer.optimizeBatch = function (base64Images, input) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, Promise.all(base64Images.map(function (image) { return _this.optimizeForOutput(image, input); }))];
            });
        });
    };
    /**
     * Detect optimal format based on image characteristics
     */
    ImageOptimizer.detectOptimalFormat = function (metadata) {
        // If image has alpha channel, prefer PNG or WebP
        if (metadata.hasAlpha) {
            return 'png';
        }
        // For photos, prefer JPEG
        if (metadata.density && metadata.density > 72) {
            return 'jpeg';
        }
        // Default to WebP for best compression
        return 'webp';
    };
    /**
     * Map quality setting to numeric value
     */
    ImageOptimizer.mapQualityToNumber = function (quality, compression) {
        // If explicit compression is provided, use it
        if (compression !== undefined) {
            return Math.max(0, Math.min(100, compression));
        }
        // Map quality levels
        switch (quality) {
            case 'low':
                return 60;
            case 'medium':
                return 80;
            case 'high':
                return 95;
            case 'auto':
            default:
                return 85;
        }
    };
    /**
     * Get default quality for format
     */
    ImageOptimizer.getDefaultQuality = function (format) {
        switch (format) {
            case 'jpeg':
                return 85;
            case 'webp':
                return 85;
            case 'png':
            default:
                return 95;
        }
    };
    /**
     * Calculate size reduction percentage
     */
    ImageOptimizer.calculateSizeReduction = function (originalBase64, optimizedBase64) {
        return __awaiter(this, void 0, void 0, function () {
            var originalSize, optimizedSize, reduction;
            return __generator(this, function (_a) {
                originalSize = Buffer.from(originalBase64, 'base64').length;
                optimizedSize = Buffer.from(optimizedBase64, 'base64').length;
                reduction = ((originalSize - optimizedSize) / originalSize) * 100;
                return [2 /*return*/, Math.round(reduction * 10) / 10]; // Round to 1 decimal place
            });
        });
    };
    return ImageOptimizer;
}());
exports.ImageOptimizer = ImageOptimizer;
