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
var image_generator_js_1 = require("./image-generator.js");
// Mock implementations
var MockOpenAIClient = /** @class */ (function () {
    function MockOpenAIClient() {
    }
    MockOpenAIClient.prototype.generateImage = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, {
                        data: [{
                                b64_json: 'mock-base64-image',
                                revised_prompt: 'Enhanced: ' + params.prompt
                            }]
                    }];
            });
        });
    };
    MockOpenAIClient.prototype.editImage = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, {
                        data: [{
                                b64_json: 'mock-edited-base64-image',
                                revised_prompt: 'Edited: ' + params.prompt
                            }]
                    }];
            });
        });
    };
    return MockOpenAIClient;
}());
var MockCache = /** @class */ (function () {
    function MockCache() {
        this.cache = new Map();
    }
    MockCache.prototype.get = function (type, input) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, null]; // Always return null to force generation
            });
        });
    };
    MockCache.prototype.set = function (type, input, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    return MockCache;
}());
var MockOptimizer = /** @class */ (function () {
    function MockOptimizer() {
    }
    MockOptimizer.prototype.optimizeBatch = function (images) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, images.map(function (img) { return 'optimized-' + img; })];
            });
        });
    };
    MockOptimizer.prototype.calculateSizeReduction = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, 50];
            });
        });
    };
    return MockOptimizer;
}());
var MockFileConverter = /** @class */ (function () {
    function MockFileConverter() {
    }
    MockFileConverter.prototype.base64ToFile = function (base64, filename, mimeType) {
        return new File([base64], filename, { type: mimeType });
    };
    MockFileConverter.prototype.extractBase64FromDataUrl = function (dataUrl) {
        return dataUrl.replace(/^data:image\/\w+;base64,/, '');
    };
    return MockFileConverter;
}());
var MockConversationContext = /** @class */ (function () {
    function MockConversationContext() {
        this.contexts = new Map();
        this.enhancePromptMock = vitest_1.vi.fn();
    }
    MockConversationContext.prototype.getContext = function (conversationId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.contexts.get(conversationId) || {
                        conversationId: conversationId,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        entries: []
                    }];
            });
        });
    };
    MockConversationContext.prototype.createContext = function (conversationId) {
        return __awaiter(this, void 0, void 0, function () {
            var context;
            return __generator(this, function (_a) {
                context = {
                    conversationId: conversationId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    entries: []
                };
                this.contexts.set(conversationId, context);
                return [2 /*return*/, context];
            });
        });
    };
    MockConversationContext.prototype.addEntry = function (conversationId, entry) {
        return __awaiter(this, void 0, void 0, function () {
            var context, newEntry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        context = this.contexts.get(conversationId);
                        if (!!context) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.createContext(conversationId)];
                    case 1:
                        context = _a.sent();
                        _a.label = 2;
                    case 2:
                        newEntry = __assign(__assign({}, entry), { id: 'test-id' });
                        context.entries.push(newEntry);
                        return [2 /*return*/, newEntry];
                }
            });
        });
    };
    MockConversationContext.prototype.generateEnhancedPrompt = function (originalPrompt, context, maxEntries) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.enhancePromptMock(originalPrompt, context, maxEntries);
                return [2 /*return*/, "Enhanced with context: ".concat(originalPrompt)];
            });
        });
    };
    MockConversationContext.prototype.clearContext = function (conversationId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.contexts.delete(conversationId)];
            });
        });
    };
    MockConversationContext.prototype.getAllConversations = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.contexts.keys())];
            });
        });
    };
    MockConversationContext.prototype.getEnhancePromptMock = function () {
        return this.enhancePromptMock;
    };
    return MockConversationContext;
}());
(0, vitest_1.describe)('ImageGenerator with Conversation Context', function () {
    var imageGenerator;
    var mockConversationContext;
    var mockOpenAIClient;
    (0, vitest_1.beforeEach)(function () {
        mockOpenAIClient = new MockOpenAIClient();
        mockConversationContext = new MockConversationContext();
        imageGenerator = new image_generator_js_1.ImageGenerator(mockOpenAIClient, new MockCache(), new MockOptimizer(), new MockFileConverter(), mockConversationContext);
    });
    (0, vitest_1.describe)('generate with context', function () {
        (0, vitest_1.it)('should use original prompt when context is disabled', function () { return __awaiter(void 0, void 0, void 0, function () {
            var input, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        input = {
                            prompt: 'Generate a sunset',
                            useContext: false
                        };
                        return [4 /*yield*/, imageGenerator.generate(input)];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.revised_prompt).toBe('Enhanced: Generate a sunset');
                        (0, vitest_1.expect)(mockConversationContext.getEnhancePromptMock()).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should enhance prompt when context is enabled', function () { return __awaiter(void 0, void 0, void 0, function () {
            var input, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        input = {
                            prompt: 'Add more trees',
                            conversationId: 'test-conv-1',
                            useContext: true
                        };
                        // Create some context
                        return [4 /*yield*/, mockConversationContext.createContext('test-conv-1')];
                    case 1:
                        // Create some context
                        _a.sent();
                        return [4 /*yield*/, mockConversationContext.addEntry('test-conv-1', {
                                prompt: 'Generate a forest',
                                revisedPrompt: 'Dense forest with tall pine trees'
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, imageGenerator.generate(input)];
                    case 3:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.revised_prompt).toBe('Enhanced: Enhanced with context: Add more trees');
                        (0, vitest_1.expect)(mockConversationContext.getEnhancePromptMock()).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should add entry to conversation after generation', function () { return __awaiter(void 0, void 0, void 0, function () {
            var input, conversations, context;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        input = {
                            prompt: 'Generate a mountain',
                            conversationId: 'test-conv-2',
                            useContext: false
                        };
                        return [4 /*yield*/, imageGenerator.generate(input)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, mockConversationContext.getAllConversations()];
                    case 2:
                        conversations = _a.sent();
                        (0, vitest_1.expect)(conversations).toContain('test-conv-2');
                        return [4 /*yield*/, mockConversationContext.getContext('test-conv-2')];
                    case 3:
                        context = _a.sent();
                        (0, vitest_1.expect)(context.entries).toHaveLength(1);
                        (0, vitest_1.expect)(context.entries[0].prompt).toBe('Generate a mountain');
                        (0, vitest_1.expect)(context.entries[0].imageData).toBe('optimized-mock-base64-image');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should respect maxContextEntries parameter', function () { return __awaiter(void 0, void 0, void 0, function () {
            var input, enhancePromptMock;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        input = {
                            prompt: 'Add details',
                            conversationId: 'test-conv-3',
                            useContext: true,
                            maxContextEntries: 3
                        };
                        return [4 /*yield*/, mockConversationContext.createContext('test-conv-3')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, imageGenerator.generate(input)];
                    case 2:
                        _a.sent();
                        enhancePromptMock = mockConversationContext.getEnhancePromptMock();
                        (0, vitest_1.expect)(enhancePromptMock).toHaveBeenCalledWith('Add details', vitest_1.expect.any(Object), 3);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('edit with context', function () {
        (0, vitest_1.it)('should enhance edit prompts with context', function () { return __awaiter(void 0, void 0, void 0, function () {
            var input, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        input = {
                            prompt: 'Change sky color',
                            images: ['base64-image'],
                            conversationId: 'test-conv-4',
                            useContext: true
                        };
                        return [4 /*yield*/, mockConversationContext.createContext('test-conv-4')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, mockConversationContext.addEntry('test-conv-4', {
                                prompt: 'Generate sunset scene',
                                revisedPrompt: 'Beautiful sunset with orange sky'
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, imageGenerator.edit(input)];
                    case 3:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.revised_prompt).toBe('Edited: Enhanced with context: Change sky color');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should track edit operations with mask', function () { return __awaiter(void 0, void 0, void 0, function () {
            var input, context;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        input = {
                            prompt: 'Add a bridge',
                            images: ['base64-image'],
                            mask: 'base64-mask',
                            conversationId: 'test-conv-5',
                            useContext: false
                        };
                        return [4 /*yield*/, imageGenerator.edit(input)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, mockConversationContext.getContext('test-conv-5')];
                    case 2:
                        context = _a.sent();
                        (0, vitest_1.expect)(context.entries).toHaveLength(1);
                        (0, vitest_1.expect)(context.entries[0].editMask).toBe('base64-mask');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('without conversation context', function () {
        (0, vitest_1.it)('should work normally when context service is not provided', function () { return __awaiter(void 0, void 0, void 0, function () {
            var generatorWithoutContext, input, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        generatorWithoutContext = new image_generator_js_1.ImageGenerator(new MockOpenAIClient(), new MockCache(), new MockOptimizer(), new MockFileConverter()
                        // No conversation context
                        );
                        input = {
                            prompt: 'Generate image',
                            conversationId: 'test-conv',
                            useContext: true
                        };
                        return [4 /*yield*/, generatorWithoutContext.generate(input)];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.revised_prompt).toBe('Enhanced: Generate image');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
