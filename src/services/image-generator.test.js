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
var image_generator_1 = require("./image-generator");
(0, vitest_1.describe)('ImageGenerator', function () {
    var imageGenerator;
    var mockOpenAIClient;
    var mockCache;
    var mockOptimizer;
    var mockFileConverter;
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
        mockFileConverter = {
            base64ToFile: vitest_1.vi.fn(),
            extractBase64FromDataUrl: vitest_1.vi.fn(),
        };
        imageGenerator = new image_generator_1.ImageGenerator(mockOpenAIClient, mockCache, mockOptimizer, mockFileConverter);
    });
    (0, vitest_1.describe)('generate', function () {
        var mockInput = {
            prompt: 'A beautiful sunset',
            size: '1024x1024',
            quality: 'high',
        };
        (0, vitest_1.it)('should return cached result if available', function () { return __awaiter(void 0, void 0, void 0, function () {
            var cachedResult, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cachedResult = {
                            images: ['cached-image-base64'],
                            revised_prompt: 'A beautiful sunset over the ocean',
                        };
                        vitest_1.vi.mocked(mockCache.get).mockResolvedValue(cachedResult);
                        return [4 /*yield*/, imageGenerator.generate(mockInput)];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toEqual(cachedResult);
                        (0, vitest_1.expect)(mockCache.get).toHaveBeenCalledWith('generate', mockInput);
                        (0, vitest_1.expect)(mockOpenAIClient.generateImage).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should generate new image when not cached', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = {
                            data: [{
                                    b64_json: 'generated-image-base64',
                                    revised_prompt: 'A stunning sunset',
                                }],
                        };
                        vitest_1.vi.mocked(mockCache.get).mockResolvedValue(null);
                        vitest_1.vi.mocked(mockOpenAIClient.generateImage).mockResolvedValue(mockResponse);
                        vitest_1.vi.mocked(mockOptimizer.optimizeBatch).mockImplementation(function (images) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, images];
                        }); }); });
                        return [4 /*yield*/, imageGenerator.generate(mockInput)];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toEqual({
                            images: ['generated-image-base64'],
                            revised_prompt: 'A stunning sunset',
                        });
                        (0, vitest_1.expect)(mockOpenAIClient.generateImage).toHaveBeenCalledWith({
                            model: 'gpt-image-1',
                            prompt: mockInput.prompt,
                            size: mockInput.size,
                            quality: mockInput.quality,
                            n: undefined,
                        });
                        (0, vitest_1.expect)(mockCache.set).toHaveBeenCalledWith('generate', mockInput, result);
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
                        vitest_1.vi.mocked(mockOpenAIClient.generateImage).mockResolvedValue({ data: [] });
                        return [4 /*yield*/, imageGenerator.generate(inputWithAutoSize)];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(mockOpenAIClient.generateImage).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ size: '1024x1024' }));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should optimize images when compression is requested', function () { return __awaiter(void 0, void 0, void 0, function () {
            var inputWithCompression, mockResponse, result;
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
                        return [4 /*yield*/, imageGenerator.generate(inputWithCompression)];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(mockOptimizer.optimizeBatch).toHaveBeenCalledWith(['original-image'], inputWithCompression);
                        (0, vitest_1.expect)(result.images).toEqual(['optimized-image']);
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
                        return [4 /*yield*/, imageGenerator.generate(inputWithJpeg)];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(mockOptimizer.optimizeBatch).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should throw error for URL response format', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResponse = {
                            data: [{
                                    url: 'https://example.com/image.png',
                                }],
                        };
                        vitest_1.vi.mocked(mockCache.get).mockResolvedValue(null);
                        vitest_1.vi.mocked(mockOpenAIClient.generateImage).mockResolvedValue(mockResponse);
                        return [4 /*yield*/, (0, vitest_1.expect)(imageGenerator.generate(mockInput)).rejects.toThrow('URL response not supported yet. Please use b64_json.')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle multiple images', function () { return __awaiter(void 0, void 0, void 0, function () {
            var inputWithMultiple, mockResponse, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        inputWithMultiple = __assign(__assign({}, mockInput), { n: 3 });
                        mockResponse = {
                            data: [
                                { b64_json: 'image-1' },
                                { b64_json: 'image-2' },
                                { b64_json: 'image-3' },
                            ],
                        };
                        vitest_1.vi.mocked(mockCache.get).mockResolvedValue(null);
                        vitest_1.vi.mocked(mockOpenAIClient.generateImage).mockResolvedValue(mockResponse);
                        vitest_1.vi.mocked(mockOptimizer.optimizeBatch).mockImplementation(function (images) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, images];
                        }); }); });
                        return [4 /*yield*/, imageGenerator.generate(inputWithMultiple)];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.images).toHaveLength(3);
                        (0, vitest_1.expect)(result.images).toEqual(['image-1', 'image-2', 'image-3']);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('edit', function () {
        var mockInput = {
            prompt: 'Add a rainbow',
            images: ['base64-image-data'],
        };
        (0, vitest_1.it)('should return cached result if available', function () { return __awaiter(void 0, void 0, void 0, function () {
            var cachedResult, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cachedResult = {
                            images: ['cached-edited-image'],
                            revised_prompt: 'Added a rainbow to the image',
                        };
                        vitest_1.vi.mocked(mockCache.get).mockResolvedValue(cachedResult);
                        return [4 /*yield*/, imageGenerator.edit(mockInput)];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toEqual(cachedResult);
                        (0, vitest_1.expect)(mockCache.get).toHaveBeenCalledWith('edit', mockInput);
                        (0, vitest_1.expect)(mockOpenAIClient.editImage).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should edit image when not cached', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockFile, mockResponse, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockFile = new File(['content'], 'image.png', { type: 'image/png' });
                        mockResponse = {
                            data: [{
                                    b64_json: 'edited-image-base64',
                                    revised_prompt: 'Added a vibrant rainbow',
                                }],
                        };
                        vitest_1.vi.mocked(mockCache.get).mockResolvedValue(null);
                        vitest_1.vi.mocked(mockFileConverter.extractBase64FromDataUrl).mockReturnValue('base64-image-data');
                        vitest_1.vi.mocked(mockFileConverter.base64ToFile).mockReturnValue(mockFile);
                        vitest_1.vi.mocked(mockOpenAIClient.editImage).mockResolvedValue(mockResponse);
                        vitest_1.vi.mocked(mockOptimizer.optimizeBatch).mockImplementation(function (images) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, images];
                        }); }); });
                        return [4 /*yield*/, imageGenerator.edit(mockInput)];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toEqual({
                            images: ['edited-image-base64'],
                            revised_prompt: 'Added a vibrant rainbow',
                        });
                        (0, vitest_1.expect)(mockFileConverter.extractBase64FromDataUrl).toHaveBeenCalledWith('base64-image-data');
                        (0, vitest_1.expect)(mockFileConverter.base64ToFile).toHaveBeenCalledWith('base64-image-data', 'image_0.png', 'image/png');
                        (0, vitest_1.expect)(mockOpenAIClient.editImage).toHaveBeenCalledWith({
                            model: 'gpt-image-1',
                            image: mockFile,
                            prompt: mockInput.prompt,
                            mask: undefined,
                            size: '1024x1024',
                            n: undefined,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle data URL format', function () { return __awaiter(void 0, void 0, void 0, function () {
            var inputWithDataUrl, mockFile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        inputWithDataUrl = {
                            prompt: 'Add a rainbow',
                            images: ['data:image/png;base64,abc123'],
                        };
                        mockFile = new File(['content'], 'image.png', { type: 'image/png' });
                        vitest_1.vi.mocked(mockCache.get).mockResolvedValue(null);
                        vitest_1.vi.mocked(mockFileConverter.extractBase64FromDataUrl).mockReturnValue('abc123');
                        vitest_1.vi.mocked(mockFileConverter.base64ToFile).mockReturnValue(mockFile);
                        vitest_1.vi.mocked(mockOpenAIClient.editImage).mockResolvedValue({ data: [] });
                        return [4 /*yield*/, imageGenerator.edit(inputWithDataUrl)];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(mockFileConverter.extractBase64FromDataUrl).toHaveBeenCalledWith('data:image/png;base64,abc123');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle mask parameter', function () { return __awaiter(void 0, void 0, void 0, function () {
            var inputWithMask, mockImageFile, mockMaskFile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        inputWithMask = __assign(__assign({}, mockInput), { mask: 'mask-base64-data' });
                        mockImageFile = new File(['image'], 'image.png', { type: 'image/png' });
                        mockMaskFile = new File(['mask'], 'mask.png', { type: 'image/png' });
                        vitest_1.vi.mocked(mockCache.get).mockResolvedValue(null);
                        vitest_1.vi.mocked(mockFileConverter.extractBase64FromDataUrl)
                            .mockReturnValueOnce('base64-image-data')
                            .mockReturnValueOnce('mask-base64-data');
                        vitest_1.vi.mocked(mockFileConverter.base64ToFile)
                            .mockReturnValueOnce(mockImageFile)
                            .mockReturnValueOnce(mockMaskFile);
                        vitest_1.vi.mocked(mockOpenAIClient.editImage).mockResolvedValue({ data: [] });
                        return [4 /*yield*/, imageGenerator.edit(inputWithMask)];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(mockOpenAIClient.editImage).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                            mask: mockMaskFile,
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should optimize edited images when requested', function () { return __awaiter(void 0, void 0, void 0, function () {
            var inputWithOptimization, mockFile, mockResponse, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        inputWithOptimization = __assign(__assign({}, mockInput), { format: 'webp' });
                        mockFile = new File(['content'], 'image.png', { type: 'image/png' });
                        mockResponse = {
                            data: [{
                                    b64_json: 'original-edited-image',
                                }],
                        };
                        vitest_1.vi.mocked(mockCache.get).mockResolvedValue(null);
                        vitest_1.vi.mocked(mockFileConverter.extractBase64FromDataUrl).mockReturnValue('base64-image-data');
                        vitest_1.vi.mocked(mockFileConverter.base64ToFile).mockReturnValue(mockFile);
                        vitest_1.vi.mocked(mockOpenAIClient.editImage).mockResolvedValue(mockResponse);
                        vitest_1.vi.mocked(mockOptimizer.optimizeBatch).mockResolvedValue(['optimized-edited-image']);
                        vitest_1.vi.mocked(mockOptimizer.calculateSizeReduction).mockResolvedValue(20);
                        return [4 /*yield*/, imageGenerator.edit(inputWithOptimization)];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(mockOptimizer.optimizeBatch).toHaveBeenCalledWith(['original-edited-image'], inputWithOptimization);
                        (0, vitest_1.expect)(result.images).toEqual(['optimized-edited-image']);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
