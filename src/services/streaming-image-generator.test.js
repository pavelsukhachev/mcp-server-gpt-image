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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var streaming_image_generator_1 = require("./streaming-image-generator");
(0, vitest_1.describe)('StreamingImageGenerator', function () {
    var streamingGenerator;
    var mockOpenAIClient;
    var mockCache;
    var mockOptimizer;
    (0, vitest_1.beforeEach)(function () {
        mockOpenAIClient = {
            generateImage: vitest_1.vi.fn(),
            editImage: vitest_1.vi.fn(),
        };
        mockCache = {
            get: vitest_1.vi.fn(),
            set: vitest_1.vi.fn(),
        };
        mockOptimizer = {
            optimizeBatch: vitest_1.vi.fn(),
            calculateSizeReduction: vitest_1.vi.fn(),
        };
        streamingGenerator = new streaming_image_generator_1.StreamingImageGenerator(mockOpenAIClient, mockCache, mockOptimizer);
    });
    (0, vitest_1.describe)('generateWithStreaming', function () {
        var mockInput = {
            prompt: 'A beautiful sunset',
        };
        function collectEvents(generator) {
            return __awaiter(this, void 0, void 0, function () {
                var events, event_1, e_1_1;
                var _a, generator_1, generator_1_1;
                var _b, e_1, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            events = [];
                            _e.label = 1;
                        case 1:
                            _e.trys.push([1, 6, 7, 12]);
                            _a = true, generator_1 = __asyncValues(generator);
                            _e.label = 2;
                        case 2: return [4 /*yield*/, generator_1.next()];
                        case 3:
                            if (!(generator_1_1 = _e.sent(), _b = generator_1_1.done, !_b)) return [3 /*break*/, 5];
                            _d = generator_1_1.value;
                            _a = false;
                            event_1 = _d;
                            events.push(event_1);
                            _e.label = 4;
                        case 4:
                            _a = true;
                            return [3 /*break*/, 2];
                        case 5: return [3 /*break*/, 12];
                        case 6:
                            e_1_1 = _e.sent();
                            e_1 = { error: e_1_1 };
                            return [3 /*break*/, 12];
                        case 7:
                            _e.trys.push([7, , 10, 11]);
                            if (!(!_a && !_b && (_c = generator_1.return))) return [3 /*break*/, 9];
                            return [4 /*yield*/, _c.call(generator_1)];
                        case 8:
                            _e.sent();
                            _e.label = 9;
                        case 9: return [3 /*break*/, 11];
                        case 10:
                            if (e_1) throw e_1.error;
                            return [7 /*endfinally*/];
                        case 11: return [7 /*endfinally*/];
                        case 12: return [2 /*return*/, events];
                    }
                });
            });
        }
        (0, vitest_1.it)('should return cached result when available', function () { return __awaiter(void 0, void 0, void 0, function () {
            var cachedResult, events;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cachedResult = {
                            images: ['cached-image-base64'],
                            revised_prompt: 'Cached sunset prompt',
                        };
                        vitest_1.vi.mocked(mockCache.get).mockResolvedValue(cachedResult);
                        return [4 /*yield*/, collectEvents(streamingGenerator.generateWithStreaming(mockInput))];
                    case 1:
                        events = _a.sent();
                        (0, vitest_1.expect)(events).toHaveLength(2);
                        (0, vitest_1.expect)(events[0]).toEqual({
                            type: 'progress',
                            data: {
                                progress: 100,
                                message: 'Retrieved from cache',
                            },
                        });
                        (0, vitest_1.expect)(events[1]).toEqual({
                            type: 'complete',
                            data: {
                                finalImage: 'cached-image-base64',
                                revisedPrompt: 'Cached sunset prompt',
                                progress: 100,
                                message: 'Image generation completed!',
                            },
                        });
                        (0, vitest_1.expect)(mockOpenAIClient.generateImage).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should generate new image when not cached', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, events;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = {
                            data: [{
                                    b64_json: 'generated-image-base64',
                                    revised_prompt: 'A stunning sunset over the ocean',
                                }],
                        };
                        vitest_1.vi.mocked(mockCache.get).mockResolvedValue(null);
                        vitest_1.vi.mocked(mockOpenAIClient.generateImage).mockResolvedValue(mockResponse);
                        vitest_1.vi.mocked(mockOptimizer.optimizeBatch).mockImplementation(function (images) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, images];
                        }); }); });
                        return [4 /*yield*/, collectEvents(streamingGenerator.generateWithStreaming(mockInput))];
                    case 1:
                        events = _a.sent();
                        // There's an optimization event because defaults trigger it
                        (0, vitest_1.expect)(events).toHaveLength(5); // init, processing, finalizing, optimizing, complete
                        (0, vitest_1.expect)(events[0].type).toBe('progress');
                        (0, vitest_1.expect)(events[0].data.message).toBe('Initializing image generation...');
                        (0, vitest_1.expect)(events[1].type).toBe('progress');
                        (0, vitest_1.expect)(events[1].data.message).toBe('Processing prompt...');
                        (0, vitest_1.expect)(events[2].type).toBe('progress');
                        (0, vitest_1.expect)(events[2].data.message).toBe('Finalizing image...');
                        (0, vitest_1.expect)(events[3].type).toBe('progress');
                        (0, vitest_1.expect)(events[3].data.message).toBe('Optimizing image...');
                        (0, vitest_1.expect)(events[4].type).toBe('complete');
                        (0, vitest_1.expect)(events[4].data.finalImage).toBe('generated-image-base64');
                        (0, vitest_1.expect)(mockCache.set).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should emit partial images when requested', function () { return __awaiter(void 0, void 0, void 0, function () {
            var inputWithPartials, mockResponse, events, partialEvents;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        inputWithPartials = __assign(__assign({}, mockInput), { partialImages: 3, format: 'webp' });
                        mockResponse = {
                            data: [{
                                    b64_json: 'final-image-base64',
                                    revised_prompt: 'Enhanced prompt',
                                }],
                        };
                        vitest_1.vi.mocked(mockCache.get).mockResolvedValue(null);
                        vitest_1.vi.mocked(mockOpenAIClient.generateImage).mockResolvedValue(mockResponse);
                        return [4 /*yield*/, collectEvents(streamingGenerator.generateWithStreaming(inputWithPartials))];
                    case 1:
                        events = _a.sent();
                        partialEvents = events.filter(function (e) { return e.type === 'partial'; });
                        (0, vitest_1.expect)(partialEvents).toHaveLength(3);
                        partialEvents.forEach(function (event, index) {
                            (0, vitest_1.expect)(event.data.partialImage).toBe('final-image-base64');
                            (0, vitest_1.expect)(event.data.partialImageIndex).toBe(index);
                            (0, vitest_1.expect)(event.data.message).toBe("Partial image ".concat(index + 1, " ready"));
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should optimize images when compression is requested', function () { return __awaiter(void 0, void 0, void 0, function () {
            var inputWithCompression, mockResponse, events, progressEvents, completeEvent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        inputWithCompression = __assign(__assign({}, mockInput), { output_compression: 80 });
                        mockResponse = {
                            data: [{
                                    b64_json: 'original-image',
                                }],
                        };
                        vitest_1.vi.mocked(mockCache.get).mockResolvedValue(null);
                        vitest_1.vi.mocked(mockOpenAIClient.generateImage).mockResolvedValue(mockResponse);
                        vitest_1.vi.mocked(mockOptimizer.optimizeBatch).mockResolvedValue(['optimized-image']);
                        vitest_1.vi.mocked(mockOptimizer.calculateSizeReduction).mockResolvedValue(25);
                        return [4 /*yield*/, collectEvents(streamingGenerator.generateWithStreaming(inputWithCompression))];
                    case 1:
                        events = _a.sent();
                        progressEvents = events.filter(function (e) { return e.type === 'progress'; });
                        (0, vitest_1.expect)(progressEvents.some(function (e) { return e.data.message === 'Optimizing image...'; })).toBe(true);
                        completeEvent = events.find(function (e) { return e.type === 'complete'; });
                        (0, vitest_1.expect)(completeEvent === null || completeEvent === void 0 ? void 0 : completeEvent.data.finalImage).toBe('optimized-image');
                        (0, vitest_1.expect)(mockOptimizer.optimizeBatch).toHaveBeenCalledWith(['original-image'], inputWithCompression);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should optimize images when format is not png', function () { return __awaiter(void 0, void 0, void 0, function () {
            var inputWithJpeg, mockResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        inputWithJpeg = __assign(__assign({}, mockInput), { format: 'jpeg' });
                        mockResponse = {
                            data: [{
                                    b64_json: 'original-image',
                                }],
                        };
                        vitest_1.vi.mocked(mockCache.get).mockResolvedValue(null);
                        vitest_1.vi.mocked(mockOpenAIClient.generateImage).mockResolvedValue(mockResponse);
                        vitest_1.vi.mocked(mockOptimizer.optimizeBatch).mockResolvedValue(['optimized-image']);
                        vitest_1.vi.mocked(mockOptimizer.calculateSizeReduction).mockResolvedValue(30);
                        return [4 /*yield*/, collectEvents(streamingGenerator.generateWithStreaming(inputWithJpeg))];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(mockOptimizer.optimizeBatch).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle errors gracefully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var events, errorEvent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vitest_1.vi.mocked(mockCache.get).mockResolvedValue(null);
                        vitest_1.vi.mocked(mockOpenAIClient.generateImage).mockRejectedValue(new Error('API rate limit exceeded'));
                        return [4 /*yield*/, collectEvents(streamingGenerator.generateWithStreaming(mockInput))];
                    case 1:
                        events = _a.sent();
                        errorEvent = events.find(function (e) { return e.type === 'error'; });
                        (0, vitest_1.expect)(errorEvent).toBeDefined();
                        (0, vitest_1.expect)(errorEvent === null || errorEvent === void 0 ? void 0 : errorEvent.error).toBe('API rate limit exceeded');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle missing images in response', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, events, errorEvent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = {
                            data: [],
                        };
                        vitest_1.vi.mocked(mockCache.get).mockResolvedValue(null);
                        vitest_1.vi.mocked(mockOpenAIClient.generateImage).mockResolvedValue(mockResponse);
                        return [4 /*yield*/, collectEvents(streamingGenerator.generateWithStreaming(mockInput))];
                    case 1:
                        events = _a.sent();
                        errorEvent = events.find(function (e) { return e.type === 'error'; });
                        (0, vitest_1.expect)(errorEvent === null || errorEvent === void 0 ? void 0 : errorEvent.error).toBe('No images generated');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle invalid response format', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, events, errorEvent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = {
                            data: [{
                                    url: 'https://example.com/image.png', // No b64_json
                                }],
                        };
                        vitest_1.vi.mocked(mockCache.get).mockResolvedValue(null);
                        vitest_1.vi.mocked(mockOpenAIClient.generateImage).mockResolvedValue(mockResponse);
                        return [4 /*yield*/, collectEvents(streamingGenerator.generateWithStreaming(mockInput))];
                    case 1:
                        events = _a.sent();
                        errorEvent = events.find(function (e) { return e.type === 'error'; });
                        (0, vitest_1.expect)(errorEvent === null || errorEvent === void 0 ? void 0 : errorEvent.error).toBe('Invalid response format');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle auto size parameter', function () { return __awaiter(void 0, void 0, void 0, function () {
            var inputWithAutoSize;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        inputWithAutoSize = __assign(__assign({}, mockInput), { size: 'auto' });
                        vitest_1.vi.mocked(mockCache.get).mockResolvedValue(null);
                        vitest_1.vi.mocked(mockOpenAIClient.generateImage).mockResolvedValue({
                            data: [{ b64_json: 'image' }],
                        });
                        return [4 /*yield*/, collectEvents(streamingGenerator.generateWithStreaming(inputWithAutoSize))];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(mockOpenAIClient.generateImage).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ size: '1024x1024' }));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should emit correct progress percentages', function () { return __awaiter(void 0, void 0, void 0, function () {
            var inputWithPartials, events, progressEvents;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        inputWithPartials = __assign(__assign({}, mockInput), { partialImages: 2 });
                        vitest_1.vi.mocked(mockCache.get).mockResolvedValue(null);
                        vitest_1.vi.mocked(mockOpenAIClient.generateImage).mockResolvedValue({
                            data: [{ b64_json: 'image' }],
                        });
                        return [4 /*yield*/, collectEvents(streamingGenerator.generateWithStreaming(inputWithPartials))];
                    case 1:
                        events = _a.sent();
                        progressEvents = events
                            .filter(function (e) { return e.type === 'progress' || e.type === 'partial'; })
                            .map(function (e) { var _a; return (_a = e.data) === null || _a === void 0 ? void 0 : _a.progress; });
                        (0, vitest_1.expect)(progressEvents).toEqual([0, 30, 40, 50, 55, 65, 90, 95]); // includes optimization
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should not emit partial images when not requested', function () { return __awaiter(void 0, void 0, void 0, function () {
            var events, partialEvents;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vitest_1.vi.mocked(mockCache.get).mockResolvedValue(null);
                        vitest_1.vi.mocked(mockOpenAIClient.generateImage).mockResolvedValue({
                            data: [{ b64_json: 'image' }],
                        });
                        return [4 /*yield*/, collectEvents(streamingGenerator.generateWithStreaming(mockInput))];
                    case 1:
                        events = _a.sent();
                        partialEvents = events.filter(function (e) { return e.type === 'partial'; });
                        (0, vitest_1.expect)(partialEvents).toHaveLength(0);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should log optimization results', function () { return __awaiter(void 0, void 0, void 0, function () {
            var consoleLogSpy, inputWithOptimization;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        consoleLogSpy = vitest_1.vi.spyOn(console, 'log').mockImplementation(function () { });
                        inputWithOptimization = __assign(__assign({}, mockInput), { format: 'webp' });
                        vitest_1.vi.mocked(mockCache.get).mockResolvedValue(null);
                        vitest_1.vi.mocked(mockOpenAIClient.generateImage).mockResolvedValue({
                            data: [{ b64_json: 'original' }],
                        });
                        vitest_1.vi.mocked(mockOptimizer.optimizeBatch).mockResolvedValue(['optimized']);
                        vitest_1.vi.mocked(mockOptimizer.calculateSizeReduction).mockResolvedValue(35.5);
                        return [4 /*yield*/, collectEvents(streamingGenerator.generateWithStreaming(inputWithOptimization))];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(consoleLogSpy).toHaveBeenCalledWith('Image optimized: 35.5% size reduction');
                        consoleLogSpy.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
