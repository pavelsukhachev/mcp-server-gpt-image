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
exports.ImageGenerator = void 0;
var ImageGenerator = /** @class */ (function () {
    function ImageGenerator(openaiClient, cache, optimizer, fileConverter, conversationContext) {
        this.openaiClient = openaiClient;
        this.cache = cache;
        this.optimizer = optimizer;
        this.fileConverter = fileConverter;
        this.conversationContext = conversationContext;
    }
    ImageGenerator.prototype.generate = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var cached, enhancedPrompt, context, response, images, optimizedImages, result;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, this.cache.get('generate', input)];
                    case 1:
                        cached = _e.sent();
                        if (cached) {
                            return [2 /*return*/, cached];
                        }
                        enhancedPrompt = input.prompt;
                        if (!(input.useContext && input.conversationId && this.conversationContext)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.conversationContext.getContext(input.conversationId)];
                    case 2:
                        context = _e.sent();
                        if (!context) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.conversationContext.generateEnhancedPrompt(input.prompt, context, input.maxContextEntries)];
                    case 3:
                        enhancedPrompt = _e.sent();
                        _e.label = 4;
                    case 4: return [4 /*yield*/, this.openaiClient.generateImage({
                            model: 'gpt-image-1',
                            prompt: enhancedPrompt,
                            size: !input.size || input.size === 'auto' ? '1024x1024' : input.size,
                            quality: input.quality || 'auto',
                            n: input.n,
                        })];
                    case 5:
                        response = _e.sent();
                        images = this.extractImagesFromResponse(response);
                        return [4 /*yield*/, this.optimizeImages(images, input)];
                    case 6:
                        optimizedImages = _e.sent();
                        result = {
                            images: optimizedImages,
                            revised_prompt: (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.revised_prompt,
                        };
                        // Cache the result
                        return [4 /*yield*/, this.cache.set('generate', input, result)];
                    case 7:
                        // Cache the result
                        _e.sent();
                        if (!(input.conversationId && this.conversationContext)) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.conversationContext.addEntry(input.conversationId, {
                                prompt: input.prompt,
                                revisedPrompt: (_d = (_c = response.data) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.revised_prompt,
                                imageData: optimizedImages[0], // Store first image for context
                                imageMetadata: {
                                    size: input.size || '1024x1024',
                                    quality: input.quality || 'auto',
                                    format: input.format || 'png'
                                }
                            })];
                    case 8:
                        _e.sent();
                        _e.label = 9;
                    case 9: return [2 /*return*/, result];
                }
            });
        });
    };
    ImageGenerator.prototype.edit = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var cached, enhancedPrompt, context, imageFiles, maskFile, response, images, optimizedImages, result;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, this.cache.get('edit', input)];
                    case 1:
                        cached = _e.sent();
                        if (cached) {
                            return [2 /*return*/, cached];
                        }
                        enhancedPrompt = input.prompt;
                        if (!(input.useContext && input.conversationId && this.conversationContext)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.conversationContext.getContext(input.conversationId)];
                    case 2:
                        context = _e.sent();
                        if (!context) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.conversationContext.generateEnhancedPrompt(input.prompt, context, input.maxContextEntries)];
                    case 3:
                        enhancedPrompt = _e.sent();
                        _e.label = 4;
                    case 4:
                        imageFiles = this.convertImagesToFiles(input.images);
                        maskFile = input.mask ? this.convertMaskToFile(input.mask) : undefined;
                        return [4 /*yield*/, this.openaiClient.editImage({
                                model: 'gpt-image-1',
                                image: imageFiles[0],
                                prompt: enhancedPrompt,
                                mask: maskFile,
                                size: !input.size || input.size === 'auto' ? '1024x1024' : input.size,
                                n: input.n,
                            })];
                    case 5:
                        response = _e.sent();
                        images = this.extractImagesFromResponse(response);
                        return [4 /*yield*/, this.optimizeImages(images, input, 'edit')];
                    case 6:
                        optimizedImages = _e.sent();
                        result = {
                            images: optimizedImages,
                            revised_prompt: (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.revised_prompt,
                        };
                        // Cache the result
                        return [4 /*yield*/, this.cache.set('edit', input, result)];
                    case 7:
                        // Cache the result
                        _e.sent();
                        if (!(input.conversationId && this.conversationContext)) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.conversationContext.addEntry(input.conversationId, {
                                prompt: input.prompt,
                                revisedPrompt: (_d = (_c = response.data) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.revised_prompt,
                                imageData: optimizedImages[0], // Store first image for context
                                imageMetadata: {
                                    size: input.size || '1024x1024',
                                    quality: input.quality || 'auto',
                                    format: input.format || 'png'
                                },
                                editMask: input.mask
                            })];
                    case 8:
                        _e.sent();
                        _e.label = 9;
                    case 9: return [2 /*return*/, result];
                }
            });
        });
    };
    ImageGenerator.prototype.extractImagesFromResponse = function (response) {
        var _a;
        return ((_a = response.data) === null || _a === void 0 ? void 0 : _a.map(function (item) {
            if (item.b64_json) {
                return item.b64_json;
            }
            else if (item.url) {
                throw new Error('URL response not supported yet. Please use b64_json.');
            }
            throw new Error('Invalid response format');
        })) || [];
    };
    ImageGenerator.prototype.optimizeImages = function (images_1, input_1) {
        return __awaiter(this, arguments, void 0, function (images, input, operation) {
            var optimizedImages, i, reduction, prefix;
            if (operation === void 0) { operation = 'generate'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(input.output_compression !== undefined || input.format !== 'png')) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.optimizer.optimizeBatch(images, input)];
                    case 1:
                        optimizedImages = _a.sent();
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < images.length)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.optimizer.calculateSizeReduction(images[i], optimizedImages[i])];
                    case 3:
                        reduction = _a.sent();
                        if (reduction > 0) {
                            prefix = operation === 'edit' ? 'Edited image' : 'Image';
                            console.log("".concat(prefix, " ").concat(i + 1, " optimized: ").concat(reduction, "% size reduction"));
                        }
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, optimizedImages];
                    case 6: return [2 /*return*/, images];
                }
            });
        });
    };
    ImageGenerator.prototype.convertImagesToFiles = function (images) {
        var _this = this;
        return images.map(function (image, index) {
            var base64Data = _this.fileConverter.extractBase64FromDataUrl(image);
            return _this.fileConverter.base64ToFile(base64Data, "image_".concat(index, ".png"), 'image/png');
        });
    };
    ImageGenerator.prototype.convertMaskToFile = function (mask) {
        var base64Data = this.fileConverter.extractBase64FromDataUrl(mask);
        return this.fileConverter.base64ToFile(base64Data, 'mask.png', 'image/png');
    };
    return ImageGenerator;
}());
exports.ImageGenerator = ImageGenerator;
