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
exports.ConversationContextService = void 0;
var uuid_1 = require("uuid");
var ConversationContextService = /** @class */ (function () {
    function ConversationContextService(store, maxContextLength) {
        if (maxContextLength === void 0) { maxContextLength = 10; }
        this.store = store;
        this.maxContextLength = maxContextLength;
    }
    ConversationContextService.prototype.getContext = function (conversationId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.store.get(conversationId)];
            });
        });
    };
    ConversationContextService.prototype.createContext = function (conversationId) {
        return __awaiter(this, void 0, void 0, function () {
            var history;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        history = {
                            conversationId: conversationId,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            entries: [],
                            metadata: {}
                        };
                        return [4 /*yield*/, this.store.set(conversationId, history)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, history];
                }
            });
        });
    };
    ConversationContextService.prototype.addEntry = function (conversationId, entry) {
        return __awaiter(this, void 0, void 0, function () {
            var history, newEntry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getContext(conversationId)];
                    case 1:
                        history = _a.sent();
                        if (!!history) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.createContext(conversationId)];
                    case 2:
                        history = _a.sent();
                        _a.label = 3;
                    case 3:
                        newEntry = __assign(__assign({}, entry), { id: (0, uuid_1.v4)(), timestamp: new Date() });
                        history.entries.push(newEntry);
                        history.updatedAt = new Date();
                        return [4 /*yield*/, this.store.set(conversationId, history)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, newEntry];
                }
            });
        });
    };
    ConversationContextService.prototype.generateEnhancedPrompt = function (originalPrompt_1, context_1) {
        return __awaiter(this, arguments, void 0, function (originalPrompt, context, maxContextEntries) {
            var relevantEntries, contextSummary, enhancedPrompt;
            if (maxContextEntries === void 0) { maxContextEntries = 5; }
            return __generator(this, function (_a) {
                if (!context.entries.length) {
                    return [2 /*return*/, originalPrompt];
                }
                relevantEntries = context.entries
                    .slice(-maxContextEntries)
                    .filter(function (entry) { return entry.revisedPrompt || entry.prompt; });
                if (!relevantEntries.length) {
                    return [2 /*return*/, originalPrompt];
                }
                contextSummary = this.buildContextSummary(relevantEntries);
                enhancedPrompt = "".concat(originalPrompt, "\n\nContext from previous iterations:\n").concat(contextSummary, "\n\nApply the learnings from previous iterations while following the new instruction above.");
                return [2 /*return*/, enhancedPrompt];
            });
        });
    };
    ConversationContextService.prototype.clearContext = function (conversationId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.store.delete(conversationId)];
            });
        });
    };
    ConversationContextService.prototype.getAllConversations = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.store.list()];
            });
        });
    };
    ConversationContextService.prototype.buildContextSummary = function (entries) {
        return entries
            .map(function (entry, index) {
            var prompt = entry.revisedPrompt || entry.prompt;
            var details = [];
            if (entry.imageMetadata) {
                details.push("".concat(entry.imageMetadata.size, ", ").concat(entry.imageMetadata.quality, " quality"));
            }
            if (entry.editMask) {
                details.push('with mask editing');
            }
            var detailsStr = details.length ? " (".concat(details.join(', '), ")") : '';
            return "".concat(index + 1, ". \"").concat(prompt, "\"").concat(detailsStr);
        })
            .join('\n');
    };
    return ConversationContextService;
}());
exports.ConversationContextService = ConversationContextService;
