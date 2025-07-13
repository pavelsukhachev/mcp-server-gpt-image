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
var conversation_context_js_1 = require("./conversation-context.js");
var MockConversationStore = /** @class */ (function () {
    function MockConversationStore() {
        this.store = new Map();
    }
    MockConversationStore.prototype.get = function (conversationId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.store.get(conversationId) || null];
            });
        });
    };
    MockConversationStore.prototype.set = function (conversationId, history) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.store.set(conversationId, history);
                return [2 /*return*/];
            });
        });
    };
    MockConversationStore.prototype.delete = function (conversationId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.store.delete(conversationId)];
            });
        });
    };
    MockConversationStore.prototype.list = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.store.keys())];
            });
        });
    };
    MockConversationStore.prototype.clear = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.store.clear();
                return [2 /*return*/];
            });
        });
    };
    return MockConversationStore;
}());
(0, vitest_1.describe)('ConversationContextService', function () {
    var service;
    var mockStore;
    (0, vitest_1.beforeEach)(function () {
        mockStore = new MockConversationStore();
        service = new conversation_context_js_1.ConversationContextService(mockStore);
    });
    (0, vitest_1.describe)('createContext', function () {
        (0, vitest_1.it)('should create a new conversation context', function () { return __awaiter(void 0, void 0, void 0, function () {
            var conversationId, history;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conversationId = 'test-conv-1';
                        return [4 /*yield*/, service.createContext(conversationId)];
                    case 1:
                        history = _a.sent();
                        (0, vitest_1.expect)(history.conversationId).toBe(conversationId);
                        (0, vitest_1.expect)(history.entries).toHaveLength(0);
                        (0, vitest_1.expect)(history.createdAt).toBeInstanceOf(Date);
                        (0, vitest_1.expect)(history.updatedAt).toBeInstanceOf(Date);
                        (0, vitest_1.expect)(history.metadata).toEqual({});
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should persist the created context', function () { return __awaiter(void 0, void 0, void 0, function () {
            var conversationId, retrieved;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conversationId = 'test-conv-2';
                        return [4 /*yield*/, service.createContext(conversationId)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, service.getContext(conversationId)];
                    case 2:
                        retrieved = _a.sent();
                        (0, vitest_1.expect)(retrieved).toBeTruthy();
                        (0, vitest_1.expect)(retrieved === null || retrieved === void 0 ? void 0 : retrieved.conversationId).toBe(conversationId);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('getContext', function () {
        (0, vitest_1.it)('should return null for non-existent conversation', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, service.getContext('non-existent')];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toBeNull();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should return existing conversation', function () { return __awaiter(void 0, void 0, void 0, function () {
            var conversationId, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conversationId = 'test-conv-3';
                        return [4 /*yield*/, service.createContext(conversationId)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, service.getContext(conversationId)];
                    case 2:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toBeTruthy();
                        (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.conversationId).toBe(conversationId);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('addEntry', function () {
        (0, vitest_1.it)('should add entry to existing conversation', function () { return __awaiter(void 0, void 0, void 0, function () {
            var conversationId, entry, history;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conversationId = 'test-conv-4';
                        return [4 /*yield*/, service.createContext(conversationId)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, service.addEntry(conversationId, {
                                prompt: 'Generate a sunset',
                                timestamp: new Date()
                            })];
                    case 2:
                        entry = _a.sent();
                        (0, vitest_1.expect)(entry.id).toBeTruthy();
                        (0, vitest_1.expect)(entry.prompt).toBe('Generate a sunset');
                        return [4 /*yield*/, service.getContext(conversationId)];
                    case 3:
                        history = _a.sent();
                        (0, vitest_1.expect)(history === null || history === void 0 ? void 0 : history.entries).toHaveLength(1);
                        (0, vitest_1.expect)(history === null || history === void 0 ? void 0 : history.entries[0].prompt).toBe('Generate a sunset');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should create conversation if it does not exist', function () { return __awaiter(void 0, void 0, void 0, function () {
            var conversationId, entry, history;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conversationId = 'test-conv-5';
                        return [4 /*yield*/, service.addEntry(conversationId, {
                                prompt: 'Generate a mountain',
                                timestamp: new Date()
                            })];
                    case 1:
                        entry = _a.sent();
                        (0, vitest_1.expect)(entry.id).toBeTruthy();
                        return [4 /*yield*/, service.getContext(conversationId)];
                    case 2:
                        history = _a.sent();
                        (0, vitest_1.expect)(history).toBeTruthy();
                        (0, vitest_1.expect)(history === null || history === void 0 ? void 0 : history.entries).toHaveLength(1);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should add entry with all metadata', function () { return __awaiter(void 0, void 0, void 0, function () {
            var conversationId, entry;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        conversationId = 'test-conv-6';
                        return [4 /*yield*/, service.createContext(conversationId)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, service.addEntry(conversationId, {
                                prompt: 'Edit to add red bridge',
                                revisedPrompt: 'Add a vibrant red suspension bridge',
                                imageData: 'base64-image-data',
                                imageMetadata: {
                                    size: '1024x1024',
                                    quality: 'high',
                                    format: 'png'
                                },
                                editMask: 'base64-mask-data',
                                parentId: 'parent-entry-id',
                                timestamp: new Date()
                            })];
                    case 2:
                        entry = _b.sent();
                        (0, vitest_1.expect)(entry.revisedPrompt).toBe('Add a vibrant red suspension bridge');
                        (0, vitest_1.expect)((_a = entry.imageMetadata) === null || _a === void 0 ? void 0 : _a.quality).toBe('high');
                        (0, vitest_1.expect)(entry.editMask).toBe('base64-mask-data');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('generateEnhancedPrompt', function () {
        (0, vitest_1.it)('should return original prompt if no entries', function () { return __awaiter(void 0, void 0, void 0, function () {
            var history, enhanced;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        history = {
                            conversationId: 'test-conv-7',
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            entries: []
                        };
                        return [4 /*yield*/, service.generateEnhancedPrompt('Create a forest', history)];
                    case 1:
                        enhanced = _a.sent();
                        (0, vitest_1.expect)(enhanced).toBe('Create a forest');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should enhance prompt with context', function () { return __awaiter(void 0, void 0, void 0, function () {
            var history, enhanced;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        history = {
                            conversationId: 'test-conv-8',
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            entries: [
                                {
                                    id: '1',
                                    timestamp: new Date(),
                                    prompt: 'Generate a landscape',
                                    revisedPrompt: 'Serene mountain landscape at sunset'
                                },
                                {
                                    id: '2',
                                    timestamp: new Date(),
                                    prompt: 'Add a lake',
                                    imageMetadata: {
                                        size: '1536x1024',
                                        quality: 'high',
                                        format: 'png'
                                    }
                                }
                            ]
                        };
                        return [4 /*yield*/, service.generateEnhancedPrompt('Add trees', history)];
                    case 1:
                        enhanced = _a.sent();
                        (0, vitest_1.expect)(enhanced).toContain('Add trees');
                        (0, vitest_1.expect)(enhanced).toContain('Context from previous iterations:');
                        (0, vitest_1.expect)(enhanced).toContain('Serene mountain landscape at sunset');
                        (0, vitest_1.expect)(enhanced).toContain('Add a lake');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should respect maxContextEntries limit', function () { return __awaiter(void 0, void 0, void 0, function () {
            var entries, history, enhanced;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        entries = Array.from({ length: 10 }, function (_, i) { return ({
                            id: "".concat(i),
                            timestamp: new Date(),
                            prompt: "Prompt ".concat(i)
                        }); });
                        history = {
                            conversationId: 'test-conv-9',
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            entries: entries
                        };
                        return [4 /*yield*/, service.generateEnhancedPrompt('New prompt', history, 3)];
                    case 1:
                        enhanced = _a.sent();
                        // Should only include last 3 entries
                        (0, vitest_1.expect)(enhanced).toContain('Prompt 7');
                        (0, vitest_1.expect)(enhanced).toContain('Prompt 8');
                        (0, vitest_1.expect)(enhanced).toContain('Prompt 9');
                        (0, vitest_1.expect)(enhanced).not.toContain('Prompt 6');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('clearContext', function () {
        (0, vitest_1.it)('should clear existing conversation', function () { return __awaiter(void 0, void 0, void 0, function () {
            var conversationId, cleared, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conversationId = 'test-conv-10';
                        return [4 /*yield*/, service.createContext(conversationId)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, service.clearContext(conversationId)];
                    case 2:
                        cleared = _a.sent();
                        (0, vitest_1.expect)(cleared).toBe(true);
                        return [4 /*yield*/, service.getContext(conversationId)];
                    case 3:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toBeNull();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should return false for non-existent conversation', function () { return __awaiter(void 0, void 0, void 0, function () {
            var cleared;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, service.clearContext('non-existent')];
                    case 1:
                        cleared = _a.sent();
                        (0, vitest_1.expect)(cleared).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('getAllConversations', function () {
        (0, vitest_1.it)('should return empty array when no conversations', function () { return __awaiter(void 0, void 0, void 0, function () {
            var conversations;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, service.getAllConversations()];
                    case 1:
                        conversations = _a.sent();
                        (0, vitest_1.expect)(conversations).toEqual([]);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should return all conversation IDs', function () { return __awaiter(void 0, void 0, void 0, function () {
            var conversations;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, service.createContext('conv-1')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, service.createContext('conv-2')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, service.createContext('conv-3')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, service.getAllConversations()];
                    case 4:
                        conversations = _a.sent();
                        (0, vitest_1.expect)(conversations).toHaveLength(3);
                        (0, vitest_1.expect)(conversations).toContain('conv-1');
                        (0, vitest_1.expect)(conversations).toContain('conv-2');
                        (0, vitest_1.expect)(conversations).toContain('conv-3');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
