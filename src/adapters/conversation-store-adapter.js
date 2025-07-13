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
exports.ConversationStoreAdapter = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
var ConversationStoreAdapter = /** @class */ (function () {
    function ConversationStoreAdapter(persistenceDir, maxMemoryEntries) {
        if (persistenceDir === void 0) { persistenceDir = '.cache/conversations'; }
        if (maxMemoryEntries === void 0) { maxMemoryEntries = 100; }
        this.memoryStore = new Map();
        this.persistenceDir = persistenceDir;
        this.maxMemoryEntries = maxMemoryEntries;
    }
    ConversationStoreAdapter.prototype.get = function (conversationId) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, data, history_1, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.memoryStore.has(conversationId)) {
                            return [2 /*return*/, this.memoryStore.get(conversationId)];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        filePath = this.getFilePath(conversationId);
                        return [4 /*yield*/, fs_1.promises.readFile(filePath, 'utf-8')];
                    case 2:
                        data = _a.sent();
                        history_1 = JSON.parse(data);
                        history_1.entries.forEach(function (entry) {
                            entry.timestamp = new Date(entry.timestamp);
                        });
                        history_1.createdAt = new Date(history_1.createdAt);
                        history_1.updatedAt = new Date(history_1.updatedAt);
                        if (this.memoryStore.size < this.maxMemoryEntries) {
                            this.memoryStore.set(conversationId, history_1);
                        }
                        return [2 /*return*/, history_1];
                    case 3:
                        error_1 = _a.sent();
                        if (error_1.code === 'ENOENT') {
                            return [2 /*return*/, null];
                        }
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ConversationStoreAdapter.prototype.set = function (conversationId, history) {
        return __awaiter(this, void 0, void 0, function () {
            var firstKey, filePath, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.memoryStore.set(conversationId, history);
                        if (this.memoryStore.size > this.maxMemoryEntries) {
                            firstKey = this.memoryStore.keys().next().value;
                            if (firstKey) {
                                this.memoryStore.delete(firstKey);
                            }
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.ensureDirectoryExists()];
                    case 2:
                        _a.sent();
                        filePath = this.getFilePath(conversationId);
                        return [4 /*yield*/, fs_1.promises.writeFile(filePath, JSON.stringify(history, null, 2))];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _a.sent();
                        console.error('Failed to persist conversation:', error_2);
                        throw error_2;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ConversationStoreAdapter.prototype.delete = function (conversationId) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.memoryStore.delete(conversationId);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        filePath = this.getFilePath(conversationId);
                        return [4 /*yield*/, fs_1.promises.unlink(filePath)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 3:
                        error_3 = _a.sent();
                        if (error_3.code === 'ENOENT') {
                            return [2 /*return*/, false];
                        }
                        throw error_3;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ConversationStoreAdapter.prototype.list = function () {
        return __awaiter(this, void 0, void 0, function () {
            var files, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, fs_1.promises.readdir(this.persistenceDir)];
                    case 1:
                        files = _a.sent();
                        return [2 /*return*/, files
                                .filter(function (file) { return file.endsWith('.json'); })
                                .map(function (file) { return path_1.default.basename(file, '.json'); })];
                    case 2:
                        error_4 = _a.sent();
                        if (error_4.code === 'ENOENT') {
                            return [2 /*return*/, []];
                        }
                        throw error_4;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ConversationStoreAdapter.prototype.clear = function () {
        return __awaiter(this, void 0, void 0, function () {
            var files, error_5;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.memoryStore.clear();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, fs_1.promises.readdir(this.persistenceDir)];
                    case 2:
                        files = _a.sent();
                        return [4 /*yield*/, Promise.all(files
                                .filter(function (file) { return file.endsWith('.json'); })
                                .map(function (file) { return fs_1.promises.unlink(path_1.default.join(_this.persistenceDir, file)); }))];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_5 = _a.sent();
                        if (error_5.code !== 'ENOENT') {
                            throw error_5;
                        }
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ConversationStoreAdapter.prototype.getFilePath = function (conversationId) {
        var safeId = conversationId.replace(/[^a-zA-Z0-9-_]/g, '_');
        return path_1.default.join(this.persistenceDir, "".concat(safeId, ".json"));
    };
    ConversationStoreAdapter.prototype.ensureDirectoryExists = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, fs_1.promises.mkdir(this.persistenceDir, { recursive: true })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        console.error('Failed to create conversation directory:', error_6);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return ConversationStoreAdapter;
}());
exports.ConversationStoreAdapter = ConversationStoreAdapter;
