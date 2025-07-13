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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __asyncDelegator = (this && this.__asyncDelegator) || function (o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
};
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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamingImageGenerator = void 0;
var StreamingImageGenerator = /** @class */ (function () {
    function StreamingImageGenerator(openaiClient, cache, optimizer) {
        this.openaiClient = openaiClient;
        this.cache = cache;
        this.optimizer = optimizer;
    }
    StreamingImageGenerator.prototype.generateWithStreaming = function (input) {
        return __asyncGenerator(this, arguments, function generateWithStreaming_1() {
            var cached, response, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 23, , 26]);
                        return [4 /*yield*/, __await(this.checkCache(input))];
                    case 1:
                        cached = _a.sent();
                        if (!cached) return [3 /*break*/, 5];
                        return [5 /*yield**/, __values(__asyncDelegator(__asyncValues(this.yieldCachedResult(cached))))];
                    case 2: return [4 /*yield*/, __await.apply(void 0, [_a.sent()])];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, __await(void 0)];
                    case 4: return [2 /*return*/, _a.sent()];
                    case 5: return [4 /*yield*/, __await(this.createProgressEvent(0, 'Initializing image generation...'))];
                    case 6: 
                    // Emit initial progress
                    return [4 /*yield*/, _a.sent()];
                    case 7:
                        // Emit initial progress
                        _a.sent();
                        return [4 /*yield*/, __await(this.createProgressEvent(30, 'Processing prompt...'))];
                    case 8: 
                    // Process prompt
                    return [4 /*yield*/, _a.sent()];
                    case 9:
                        // Process prompt
                        _a.sent();
                        return [4 /*yield*/, __await(this.generateImage(input))];
                    case 10:
                        response = _a.sent();
                        if (!input.partialImages) return [3 /*break*/, 13];
                        return [5 /*yield**/, __values(__asyncDelegator(__asyncValues(this.yieldPartialImages(input.partialImages, response))))];
                    case 11: return [4 /*yield*/, __await.apply(void 0, [_a.sent()])];
                    case 12:
                        _a.sent();
                        _a.label = 13;
                    case 13: return [4 /*yield*/, __await(this.createProgressEvent(90, 'Finalizing image...'))];
                    case 14: 
                    // Process final image
                    return [4 /*yield*/, _a.sent()];
                    case 15:
                        // Process final image
                        _a.sent();
                        if (!this.shouldOptimize(input)) return [3 /*break*/, 18];
                        return [4 /*yield*/, __await(this.createProgressEvent(95, 'Optimizing image...'))];
                    case 16: return [4 /*yield*/, _a.sent()];
                    case 17:
                        _a.sent();
                        _a.label = 18;
                    case 18: return [4 /*yield*/, __await(this.processFinalResult(input, response))];
                    case 19:
                        result = _a.sent();
                        // Cache result
                        return [4 /*yield*/, __await(this.cache.set('generate', input, result))];
                    case 20:
                        // Cache result
                        _a.sent();
                        return [4 /*yield*/, __await(this.createCompleteEvent(result))];
                    case 21: 
                    // Emit complete event
                    return [4 /*yield*/, _a.sent()];
                    case 22:
                        // Emit complete event
                        _a.sent();
                        return [3 /*break*/, 26];
                    case 23:
                        error_1 = _a.sent();
                        return [4 /*yield*/, __await(this.createErrorEvent(error_1))];
                    case 24: return [4 /*yield*/, _a.sent()];
                    case 25:
                        _a.sent();
                        return [3 /*break*/, 26];
                    case 26: return [2 /*return*/];
                }
            });
        });
    };
    StreamingImageGenerator.prototype.checkCache = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.cache.get('generate', input)];
            });
        });
    };
    StreamingImageGenerator.prototype.yieldCachedResult = function (cached) {
        return __asyncGenerator(this, arguments, function yieldCachedResult_1() {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, __await(this.createProgressEvent(100, 'Retrieved from cache'))];
                    case 1: return [4 /*yield*/, _a.sent()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, __await(this.createCompleteEvent(cached))];
                    case 3: return [4 /*yield*/, _a.sent()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StreamingImageGenerator.prototype.generateImage = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.openaiClient.generateImage({
                        model: 'gpt-image-1',
                        prompt: input.prompt,
                        size: !input.size || input.size === 'auto' ? '1024x1024' : input.size,
                        quality: input.quality || 'auto',
                        n: input.n,
                    })];
            });
        });
    };
    StreamingImageGenerator.prototype.yieldPartialImages = function (numPartials, response) {
        return __asyncGenerator(this, arguments, function yieldPartialImages_1() {
            var i;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(i < numPartials)) return [3 /*break*/, 7];
                        return [4 /*yield*/, __await(this.createProgressEvent(40 + (i * 15), "Generating partial image ".concat(i + 1, "/").concat(numPartials, "...")))];
                    case 2: return [4 /*yield*/, _c.sent()];
                    case 3:
                        _c.sent();
                        if (!((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.b64_json)) return [3 /*break*/, 6];
                        return [4 /*yield*/, __await(this.createPartialEvent(response.data[0].b64_json, i))];
                    case 4: return [4 /*yield*/, _c.sent()];
                    case 5:
                        _c.sent();
                        _c.label = 6;
                    case 6:
                        i++;
                        return [3 /*break*/, 1];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    StreamingImageGenerator.prototype.processFinalResult = function (input, response) {
        return __awaiter(this, void 0, void 0, function () {
            var images, optimizedImages;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        images = this.extractImages(response);
                        if (images.length === 0) {
                            throw new Error('No images generated');
                        }
                        optimizedImages = images;
                        if (!this.shouldOptimize(input)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.optimizeImages(images, input)];
                    case 1:
                        optimizedImages = _c.sent();
                        _c.label = 2;
                    case 2: return [2 /*return*/, {
                            images: optimizedImages,
                            revised_prompt: (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.revised_prompt,
                        }];
                }
            });
        });
    };
    StreamingImageGenerator.prototype.extractImages = function (response) {
        var _a;
        return ((_a = response.data) === null || _a === void 0 ? void 0 : _a.map(function (item) {
            if (item.b64_json) {
                return item.b64_json;
            }
            throw new Error('Invalid response format');
        })) || [];
    };
    StreamingImageGenerator.prototype.shouldOptimize = function (input) {
        return input.output_compression !== undefined || input.format !== 'png';
    };
    StreamingImageGenerator.prototype.optimizeImages = function (images, input) {
        return __awaiter(this, void 0, void 0, function () {
            var optimized, reduction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.optimizer.optimizeBatch(images, input)];
                    case 1:
                        optimized = _a.sent();
                        if (!(images.length > 0 && optimized.length > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.optimizer.calculateSizeReduction(images[0], optimized[0])];
                    case 2:
                        reduction = _a.sent();
                        if (reduction > 0) {
                            console.log("Image optimized: ".concat(reduction, "% size reduction"));
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/, optimized];
                }
            });
        });
    };
    StreamingImageGenerator.prototype.createProgressEvent = function (progress, message) {
        return {
            type: 'progress',
            data: { progress: progress, message: message }
        };
    };
    StreamingImageGenerator.prototype.createPartialEvent = function (partialImage, index) {
        return {
            type: 'partial',
            data: {
                partialImage: partialImage,
                partialImageIndex: index,
                progress: 50 + (index * 15),
                message: "Partial image ".concat(index + 1, " ready")
            }
        };
    };
    StreamingImageGenerator.prototype.createCompleteEvent = function (result) {
        return {
            type: 'complete',
            data: {
                finalImage: result.images[0],
                revisedPrompt: result.revised_prompt,
                progress: 100,
                message: 'Image generation completed!'
            }
        };
    };
    StreamingImageGenerator.prototype.createErrorEvent = function (error) {
        return {
            type: 'error',
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    };
    return StreamingImageGenerator;
}());
exports.StreamingImageGenerator = StreamingImageGenerator;
