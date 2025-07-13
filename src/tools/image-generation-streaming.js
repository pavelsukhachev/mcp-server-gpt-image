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
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
    function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
    function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateImageWithStreaming = generateImageWithStreaming;
exports.generateImageStandard = generateImageStandard;
exports.editImageWithStreaming = editImageWithStreaming;
var openai_1 = require("openai");
var cache_js_1 = require("../utils/cache.js");
var image_optimizer_js_1 = require("../utils/image-optimizer.js");
var openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
// Simulated streaming implementation
// Note: The actual Responses API with streaming is not yet available in the SDK
// This implementation simulates streaming behavior for demonstration
function generateImageWithStreaming(input) {
    return __asyncGenerator(this, arguments, function generateImageWithStreaming_1() {
        var cached, response, numPartials, i, images, optimizedImages, reduction, result, error_1;
        var _a, _b, _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    _h.trys.push([0, 32, , 35]);
                    return [4 /*yield*/, __await(cache_js_1.imageCache.get('generate', input))];
                case 1:
                    cached = _h.sent();
                    if (!cached) return [3 /*break*/, 7];
                    return [4 /*yield*/, __await({
                            type: 'progress',
                            data: {
                                progress: 100,
                                message: 'Retrieved from cache',
                            },
                        })];
                case 2: return [4 /*yield*/, _h.sent()];
                case 3:
                    _h.sent();
                    return [4 /*yield*/, __await({
                            type: 'complete',
                            data: {
                                finalImage: cached.images[0],
                                revisedPrompt: cached.revised_prompt,
                                progress: 100,
                                message: 'Image retrieved from cache!',
                            },
                        })];
                case 4: return [4 /*yield*/, _h.sent()];
                case 5:
                    _h.sent();
                    return [4 /*yield*/, __await(void 0)];
                case 6: return [2 /*return*/, _h.sent()];
                case 7: return [4 /*yield*/, __await({
                        type: 'progress',
                        data: {
                            progress: 0,
                            message: 'Initializing image generation...',
                        },
                    })];
                case 8: 
                // Emit progress events
                return [4 /*yield*/, _h.sent()];
                case 9:
                    // Emit progress events
                    _h.sent();
                    return [4 /*yield*/, __await({
                            type: 'progress',
                            data: {
                                progress: 30,
                                message: 'Processing prompt...',
                            },
                        })];
                case 10: 
                // Simulate partial images by making the actual request
                // In a real implementation, this would use the Responses API
                return [4 /*yield*/, _h.sent()];
                case 11:
                    // Simulate partial images by making the actual request
                    // In a real implementation, this would use the Responses API
                    _h.sent();
                    return [4 /*yield*/, __await(openai.images.generate({
                            model: 'gpt-image-1',
                            prompt: input.prompt,
                            size: input.size === 'auto' ? '1024x1024' : input.size,
                            quality: input.quality || 'auto',
                            n: input.n,
                        }))];
                case 12:
                    response = _h.sent();
                    if (!input.partialImages) return [3 /*break*/, 19];
                    numPartials = input.partialImages || 3;
                    i = 0;
                    _h.label = 13;
                case 13:
                    if (!(i < numPartials)) return [3 /*break*/, 19];
                    return [4 /*yield*/, __await({
                            type: 'progress',
                            data: {
                                progress: 40 + (i * 15),
                                message: "Generating partial image ".concat(i + 1, "/").concat(numPartials, "..."),
                            },
                        })];
                case 14: return [4 /*yield*/, _h.sent()];
                case 15:
                    _h.sent();
                    if (!((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.b64_json)) return [3 /*break*/, 18];
                    return [4 /*yield*/, __await({
                            type: 'partial',
                            data: {
                                partialImage: response.data[0].b64_json,
                                partialImageIndex: i,
                                progress: 50 + (i * 15),
                                message: "Partial image ".concat(i + 1, " ready"),
                            },
                        })];
                case 16: return [4 /*yield*/, _h.sent()];
                case 17:
                    _h.sent();
                    _h.label = 18;
                case 18:
                    i++;
                    return [3 /*break*/, 13];
                case 19: return [4 /*yield*/, __await({
                        type: 'progress',
                        data: {
                            progress: 90,
                            message: 'Finalizing image...',
                        },
                    })];
                case 20: 
                // Final image
                return [4 /*yield*/, _h.sent()];
                case 21:
                    // Final image
                    _h.sent();
                    images = ((_c = response.data) === null || _c === void 0 ? void 0 : _c.map(function (item) {
                        if (item.b64_json) {
                            return item.b64_json;
                        }
                        throw new Error('Invalid response format');
                    })) || [];
                    if (!(images.length > 0)) return [3 /*break*/, 30];
                    optimizedImages = images;
                    if (!(input.output_compression !== undefined || input.format !== 'png')) return [3 /*break*/, 26];
                    return [4 /*yield*/, __await({
                            type: 'progress',
                            data: {
                                progress: 95,
                                message: 'Optimizing image...',
                            },
                        })];
                case 22: return [4 /*yield*/, _h.sent()];
                case 23:
                    _h.sent();
                    return [4 /*yield*/, __await(image_optimizer_js_1.ImageOptimizer.optimizeBatch(images, input))];
                case 24:
                    optimizedImages = _h.sent();
                    return [4 /*yield*/, __await(image_optimizer_js_1.ImageOptimizer.calculateSizeReduction(images[0], optimizedImages[0]))];
                case 25:
                    reduction = _h.sent();
                    if (reduction > 0) {
                        console.log("Image optimized: ".concat(reduction, "% size reduction"));
                    }
                    _h.label = 26;
                case 26:
                    result = {
                        images: optimizedImages,
                        revised_prompt: (_e = (_d = response.data) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.revised_prompt,
                    };
                    // Cache the result
                    return [4 /*yield*/, __await(cache_js_1.imageCache.set('generate', input, result))];
                case 27:
                    // Cache the result
                    _h.sent();
                    return [4 /*yield*/, __await({
                            type: 'complete',
                            data: {
                                finalImage: optimizedImages[0],
                                revisedPrompt: (_g = (_f = response.data) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.revised_prompt,
                                progress: 100,
                                message: 'Image generation completed!',
                            },
                        })];
                case 28: return [4 /*yield*/, _h.sent()];
                case 29:
                    _h.sent();
                    return [3 /*break*/, 31];
                case 30: throw new Error('No images generated');
                case 31: return [3 /*break*/, 35];
                case 32:
                    error_1 = _h.sent();
                    return [4 /*yield*/, __await({
                            type: 'error',
                            error: error_1 instanceof Error ? error_1.message : 'Unknown error occurred',
                        })];
                case 33: return [4 /*yield*/, _h.sent()];
                case 34:
                    _h.sent();
                    return [3 /*break*/, 35];
                case 35: return [2 /*return*/];
            }
        });
    });
}
// Non-streaming version using the standard API
function generateImageStandard(input) {
    return __awaiter(this, void 0, void 0, function () {
        var response, images, error_2;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, openai.images.generate({
                            model: 'gpt-image-1',
                            prompt: input.prompt,
                            size: input.size === 'auto' ? '1024x1024' : input.size,
                            quality: input.quality || 'auto',
                            n: input.n,
                        })];
                case 1:
                    response = _d.sent();
                    images = ((_a = response.data) === null || _a === void 0 ? void 0 : _a.map(function (item) {
                        if (item.b64_json) {
                            return item.b64_json;
                        }
                        throw new Error('Invalid response format');
                    })) || [];
                    return [2 /*return*/, {
                            images: images,
                            revised_prompt: (_c = (_b = response.data) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.revised_prompt,
                        }];
                case 2:
                    error_2 = _d.sent();
                    if (error_2 instanceof openai_1.default.APIError) {
                        throw new Error("OpenAI API error: ".concat(error_2.message));
                    }
                    throw error_2;
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Simulated streaming for image editing
function editImageWithStreaming(input) {
    return __asyncGenerator(this, arguments, function editImageWithStreaming_1() {
        var imageFile, imageData, imageBuffer, imageFileObj, maskFileObj, maskData, maskBuffer, response, images, error_3;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 12, , 15]);
                    return [4 /*yield*/, __await({
                            type: 'progress',
                            data: {
                                progress: 0,
                                message: 'Preparing image for editing...',
                            },
                        })];
                case 1: return [4 /*yield*/, _d.sent()];
                case 2:
                    _d.sent();
                    imageFile = input.images[0];
                    if (!imageFile) {
                        throw new Error('No image provided for editing');
                    }
                    imageData = imageFile.startsWith('data:')
                        ? imageFile.split(',')[1]
                        : imageFile;
                    imageBuffer = Buffer.from(imageData, 'base64');
                    imageFileObj = new File([imageBuffer], 'image.png', { type: 'image/png' });
                    maskFileObj = void 0;
                    if (input.mask) {
                        maskData = input.mask.startsWith('data:')
                            ? input.mask.split(',')[1]
                            : input.mask;
                        maskBuffer = Buffer.from(maskData, 'base64');
                        maskFileObj = new File([maskBuffer], 'mask.png', { type: 'image/png' });
                    }
                    return [4 /*yield*/, __await({
                            type: 'progress',
                            data: {
                                progress: 30,
                                message: 'Processing edit request...',
                            },
                        })];
                case 3: return [4 /*yield*/, _d.sent()];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, __await(openai.images.edit({
                            model: 'gpt-image-1',
                            image: imageFileObj,
                            prompt: input.prompt,
                            mask: maskFileObj,
                            size: input.size === 'auto' ? '1024x1024' : input.size,
                            n: input.n,
                        }))];
                case 5:
                    response = _d.sent();
                    return [4 /*yield*/, __await({
                            type: 'progress',
                            data: {
                                progress: 80,
                                message: 'Finalizing edited image...',
                            },
                        })];
                case 6: return [4 /*yield*/, _d.sent()];
                case 7:
                    _d.sent();
                    images = ((_a = response.data) === null || _a === void 0 ? void 0 : _a.map(function (item) {
                        if (item.b64_json) {
                            return item.b64_json;
                        }
                        throw new Error('Invalid response format');
                    })) || [];
                    if (!(images.length > 0)) return [3 /*break*/, 10];
                    return [4 /*yield*/, __await({
                            type: 'complete',
                            data: {
                                finalImage: images[0],
                                revisedPrompt: (_c = (_b = response.data) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.revised_prompt,
                                progress: 100,
                                message: 'Image editing completed!',
                            },
                        })];
                case 8: return [4 /*yield*/, _d.sent()];
                case 9:
                    _d.sent();
                    return [3 /*break*/, 11];
                case 10: throw new Error('No edited images generated');
                case 11: return [3 /*break*/, 15];
                case 12:
                    error_3 = _d.sent();
                    return [4 /*yield*/, __await({
                            type: 'error',
                            error: error_3 instanceof Error ? error_3.message : 'Unknown error occurred',
                        })];
                case 13: return [4 /*yield*/, _d.sent()];
                case 14:
                    _d.sent();
                    return [3 /*break*/, 15];
                case 15: return [2 /*return*/];
            }
        });
    });
}
