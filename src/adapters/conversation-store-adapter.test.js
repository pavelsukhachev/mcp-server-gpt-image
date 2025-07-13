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
var fs_1 = require("fs");
var path_1 = require("path");
var conversation_store_adapter_js_1 = require("./conversation-store-adapter.js");
(0, vitest_1.describe)('ConversationStoreAdapter', function () {
    var testDir = '.test-cache/conversations';
    var adapter;
    (0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    adapter = new conversation_store_adapter_js_1.ConversationStoreAdapter(testDir, 5);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fs_1.promises.rm(testDir, { recursive: true, force: true })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs_1.promises.rm(testDir, { recursive: true, force: true })];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.describe)('get', function () {
        (0, vitest_1.it)('should return null for non-existent conversation', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adapter.get('non-existent')];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toBeNull();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should retrieve from memory store first', function () { return __awaiter(void 0, void 0, void 0, function () {
            var history, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        history = {
                            conversationId: 'test-1',
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            entries: []
                        };
                        return [4 /*yield*/, adapter.set('test-1', history)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adapter.get('test-1')];
                    case 2:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toEqual(history);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should retrieve from disk if not in memory', function () { return __awaiter(void 0, void 0, void 0, function () {
            var history, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        history = {
                            conversationId: 'test-2',
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            entries: [{
                                    id: '1',
                                    timestamp: new Date(),
                                    prompt: 'Test prompt'
                                }]
                        };
                        // Write directly to disk
                        return [4 /*yield*/, fs_1.promises.mkdir(testDir, { recursive: true })];
                    case 1:
                        // Write directly to disk
                        _a.sent();
                        return [4 /*yield*/, fs_1.promises.writeFile(path_1.default.join(testDir, 'test-2.json'), JSON.stringify(history))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, adapter.get('test-2')];
                    case 3:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toBeTruthy();
                        (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.conversationId).toBe('test-2');
                        (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.entries[0].prompt).toBe('Test prompt');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should restore Date objects from JSON', function () { return __awaiter(void 0, void 0, void 0, function () {
            var now, history, newAdapter, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        now = new Date();
                        history = {
                            conversationId: 'test-3',
                            createdAt: now,
                            updatedAt: now,
                            entries: [{
                                    id: '1',
                                    timestamp: now,
                                    prompt: 'Test'
                                }]
                        };
                        return [4 /*yield*/, adapter.set('test-3', history)];
                    case 1:
                        _a.sent();
                        newAdapter = new conversation_store_adapter_js_1.ConversationStoreAdapter(testDir);
                        return [4 /*yield*/, newAdapter.get('test-3')];
                    case 2:
                        result = _a.sent();
                        (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.createdAt).toBeInstanceOf(Date);
                        (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.updatedAt).toBeInstanceOf(Date);
                        (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.entries[0].timestamp).toBeInstanceOf(Date);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('set', function () {
        (0, vitest_1.it)('should store in both memory and disk', function () { return __awaiter(void 0, void 0, void 0, function () {
            var history, fromMemory, filePath, fileExists;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        history = {
                            conversationId: 'test-4',
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            entries: []
                        };
                        return [4 /*yield*/, adapter.set('test-4', history)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adapter.get('test-4')];
                    case 2:
                        fromMemory = _a.sent();
                        (0, vitest_1.expect)(fromMemory).toEqual(history);
                        filePath = path_1.default.join(testDir, 'test-4.json');
                        return [4 /*yield*/, fs_1.promises.access(filePath).then(function () { return true; }).catch(function () { return false; })];
                    case 3:
                        fileExists = _a.sent();
                        (0, vitest_1.expect)(fileExists).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should evict oldest entry when memory limit exceeded', function () { return __awaiter(void 0, void 0, void 0, function () {
            var i, history_1, firstFromMemory, lastFromMemory;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < 6)) return [3 /*break*/, 4];
                        history_1 = {
                            conversationId: "test-".concat(i),
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            entries: []
                        };
                        return [4 /*yield*/, adapter.set("test-".concat(i), history_1)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [4 /*yield*/, adapter.get('test-0')];
                    case 5:
                        firstFromMemory = _a.sent();
                        (0, vitest_1.expect)(firstFromMemory).toBeTruthy(); // Still retrievable from disk
                        return [4 /*yield*/, adapter.get('test-5')];
                    case 6:
                        lastFromMemory = _a.sent();
                        (0, vitest_1.expect)(lastFromMemory).toBeTruthy();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should sanitize conversation IDs for file names', function () { return __awaiter(void 0, void 0, void 0, function () {
            var history, files;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        history = {
                            conversationId: 'test/with:special*chars',
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            entries: []
                        };
                        return [4 /*yield*/, adapter.set('test/with:special*chars', history)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, fs_1.promises.readdir(testDir)];
                    case 2:
                        files = _a.sent();
                        (0, vitest_1.expect)(files).toContain('test_with_special_chars.json');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('delete', function () {
        (0, vitest_1.it)('should remove from both memory and disk', function () { return __awaiter(void 0, void 0, void 0, function () {
            var history, deleted, result, filePath, fileExists;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        history = {
                            conversationId: 'test-5',
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            entries: []
                        };
                        return [4 /*yield*/, adapter.set('test-5', history)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adapter.delete('test-5')];
                    case 2:
                        deleted = _a.sent();
                        (0, vitest_1.expect)(deleted).toBe(true);
                        return [4 /*yield*/, adapter.get('test-5')];
                    case 3:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toBeNull();
                        filePath = path_1.default.join(testDir, 'test-5.json');
                        return [4 /*yield*/, fs_1.promises.access(filePath).then(function () { return true; }).catch(function () { return false; })];
                    case 4:
                        fileExists = _a.sent();
                        (0, vitest_1.expect)(fileExists).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should return false for non-existent conversation', function () { return __awaiter(void 0, void 0, void 0, function () {
            var deleted;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adapter.delete('non-existent')];
                    case 1:
                        deleted = _a.sent();
                        (0, vitest_1.expect)(deleted).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('list', function () {
        (0, vitest_1.it)('should return empty array when no conversations', function () { return __awaiter(void 0, void 0, void 0, function () {
            var list;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adapter.list()];
                    case 1:
                        list = _a.sent();
                        (0, vitest_1.expect)(list).toEqual([]);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should list all conversation IDs', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _i, _a, id, history_2, list;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, _a = ['conv-1', 'conv-2', 'conv-3'];
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        id = _a[_i];
                        history_2 = {
                            conversationId: id,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            entries: []
                        };
                        return [4 /*yield*/, adapter.set(id, history_2)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [4 /*yield*/, adapter.list()];
                    case 5:
                        list = _b.sent();
                        (0, vitest_1.expect)(list).toHaveLength(3);
                        (0, vitest_1.expect)(list).toContain('conv-1');
                        (0, vitest_1.expect)(list).toContain('conv-2');
                        (0, vitest_1.expect)(list).toContain('conv-3');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('clear', function () {
        (0, vitest_1.it)('should remove all conversations from memory and disk', function () { return __awaiter(void 0, void 0, void 0, function () {
            var i, history_3, list, i, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < 3)) return [3 /*break*/, 4];
                        history_3 = {
                            conversationId: "test-".concat(i),
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            entries: []
                        };
                        return [4 /*yield*/, adapter.set("test-".concat(i), history_3)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [4 /*yield*/, adapter.clear()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, adapter.list()];
                    case 6:
                        list = _a.sent();
                        (0, vitest_1.expect)(list).toEqual([]);
                        i = 0;
                        _a.label = 7;
                    case 7:
                        if (!(i < 3)) return [3 /*break*/, 10];
                        return [4 /*yield*/, adapter.get("test-".concat(i))];
                    case 8:
                        result = _a.sent();
                        (0, vitest_1.expect)(result).toBeNull();
                        _a.label = 9;
                    case 9:
                        i++;
                        return [3 /*break*/, 7];
                    case 10: return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle clear when directory does not exist', function () { return __awaiter(void 0, void 0, void 0, function () {
            var newAdapter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newAdapter = new conversation_store_adapter_js_1.ConversationStoreAdapter('.non-existent-dir');
                        return [4 /*yield*/, (0, vitest_1.expect)(newAdapter.clear()).resolves.not.toThrow()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
