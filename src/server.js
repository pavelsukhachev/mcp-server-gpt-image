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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMCPServer = createMCPServer;
exports.runStdioServer = runStdioServer;
var index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
var stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
var types_js_1 = require("@modelcontextprotocol/sdk/types.js");
var zod_1 = require("zod");
var image_generation_js_1 = require("./tools/image-generation.js");
var image_generation_streaming_js_1 = require("./tools/image-generation-streaming.js");
var types_js_2 = require("./types.js");
var cache_js_1 = require("./utils/cache.js");
var conversation_context_js_1 = require("./services/conversation-context.js");
var conversation_store_adapter_js_1 = require("./adapters/conversation-store-adapter.js");
function createMCPServer() {
    var _this = this;
    // Initialize conversation context service
    var conversationStore = new conversation_store_adapter_js_1.ConversationStoreAdapter();
    var conversationContext = new conversation_context_js_1.ConversationContextService(conversationStore);
    var server = new index_js_1.Server({
        name: 'gpt-image-1-mcp-server',
        version: '1.0.0',
    }, {
        capabilities: {
            tools: {},
        },
    });
    // List available tools
    server.setRequestHandler(types_js_1.ListToolsRequestSchema, function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, {
                    tools: [
                        {
                            name: 'generate_image',
                            description: 'Generate images using OpenAI GPT Image-1 model. Supports streaming with partial_images parameter.',
                            inputSchema: {
                                type: 'object',
                                properties: types_js_2.ImageGenerationSchema.shape,
                                required: ['prompt'],
                            },
                        },
                        {
                            name: 'edit_image',
                            description: 'Edit existing images using OpenAI GPT Image-1 model',
                            inputSchema: {
                                type: 'object',
                                properties: types_js_2.ImageEditSchema.shape,
                                required: ['prompt', 'images'],
                            },
                        },
                        {
                            name: 'clear_cache',
                            description: 'Clear the image generation cache',
                            inputSchema: {
                                type: 'object',
                                properties: {},
                            },
                        },
                        {
                            name: 'cache_stats',
                            description: 'Get cache statistics',
                            inputSchema: {
                                type: 'object',
                                properties: {},
                            },
                        },
                        {
                            name: 'list_conversations',
                            description: 'List all conversation IDs',
                            inputSchema: {
                                type: 'object',
                                properties: {},
                            },
                        },
                        {
                            name: 'get_conversation',
                            description: 'Get conversation history by ID',
                            inputSchema: {
                                type: 'object',
                                properties: {
                                    conversationId: {
                                        type: 'string',
                                        description: 'The conversation ID to retrieve'
                                    }
                                },
                                required: ['conversationId'],
                            },
                        },
                        {
                            name: 'clear_conversation',
                            description: 'Clear a specific conversation history',
                            inputSchema: {
                                type: 'object',
                                properties: {
                                    conversationId: {
                                        type: 'string',
                                        description: 'The conversation ID to clear'
                                    }
                                },
                                required: ['conversationId'],
                            },
                        },
                    ],
                }];
        });
    }); });
    // Handle tool calls
    server.setRequestHandler(types_js_1.CallToolRequestSchema, function (request) { return __awaiter(_this, void 0, void 0, function () {
        var _a, name_1, args, _b, input_1, events, _c, _d, _e, event_1, e_1_1, result, input_2, result, stats, conversations, conversationId, history_1, entries, conversationId, success, error_1;
        var _f, e_1, _g, _h;
        var _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    _k.trys.push([0, 29, , 30]);
                    _a = request.params, name_1 = _a.name, args = _a.arguments;
                    _b = name_1;
                    switch (_b) {
                        case 'generate_image': return [3 /*break*/, 1];
                        case 'edit_image': return [3 /*break*/, 16];
                        case 'clear_cache': return [3 /*break*/, 18];
                        case 'cache_stats': return [3 /*break*/, 20];
                        case 'list_conversations': return [3 /*break*/, 21];
                        case 'get_conversation': return [3 /*break*/, 23];
                        case 'clear_conversation': return [3 /*break*/, 25];
                    }
                    return [3 /*break*/, 27];
                case 1:
                    input_1 = types_js_2.ImageGenerationSchema.parse(args);
                    if (!(input_1.stream || input_1.partialImages)) return [3 /*break*/, 14];
                    events = [];
                    _k.label = 2;
                case 2:
                    _k.trys.push([2, 7, 8, 13]);
                    _c = true, _d = __asyncValues((0, image_generation_streaming_js_1.generateImageWithStreaming)(input_1));
                    _k.label = 3;
                case 3: return [4 /*yield*/, _d.next()];
                case 4:
                    if (!(_e = _k.sent(), _f = _e.done, !_f)) return [3 /*break*/, 6];
                    _h = _e.value;
                    _c = false;
                    event_1 = _h;
                    events.push(event_1);
                    if (event_1.type === 'complete' && ((_j = event_1.data) === null || _j === void 0 ? void 0 : _j.finalImage)) {
                        return [2 /*return*/, {
                                content: [
                                    {
                                        type: 'text',
                                        text: "Generated image with streaming successfully.".concat(event_1.data.revisedPrompt ? "\nRevised prompt: ".concat(event_1.data.revisedPrompt) : '', "\nStreaming events: ").concat(events.length),
                                    },
                                    {
                                        type: 'image',
                                        data: event_1.data.finalImage,
                                        mimeType: "image/".concat(input_1.format || 'png'),
                                    },
                                ],
                            }];
                    }
                    _k.label = 5;
                case 5:
                    _c = true;
                    return [3 /*break*/, 3];
                case 6: return [3 /*break*/, 13];
                case 7:
                    e_1_1 = _k.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 13];
                case 8:
                    _k.trys.push([8, , 11, 12]);
                    if (!(!_c && !_f && (_g = _d.return))) return [3 /*break*/, 10];
                    return [4 /*yield*/, _g.call(_d)];
                case 9:
                    _k.sent();
                    _k.label = 10;
                case 10: return [3 /*break*/, 12];
                case 11:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 12: return [7 /*endfinally*/];
                case 13: throw new Error('Streaming completed without final image');
                case 14: return [4 /*yield*/, (0, image_generation_js_1.generateImage)(input_1)];
                case 15:
                    result = _k.sent();
                    return [2 /*return*/, {
                            content: __spreadArray([
                                {
                                    type: 'text',
                                    text: "Generated ".concat(result.images.length, " image(s) successfully.").concat(result.revised_prompt ? "\nRevised prompt: ".concat(result.revised_prompt) : ''),
                                }
                            ], result.images.map(function (image) { return ({
                                type: 'image',
                                data: image,
                                mimeType: "image/".concat(input_1.format || 'png'),
                            }); }), true),
                        }];
                case 16:
                    input_2 = types_js_2.ImageEditSchema.parse(args);
                    return [4 /*yield*/, (0, image_generation_js_1.editImage)(input_2)];
                case 17:
                    result = _k.sent();
                    return [2 /*return*/, {
                            content: __spreadArray([
                                {
                                    type: 'text',
                                    text: "Edited image(s) successfully.".concat(result.revised_prompt ? "\nRevised prompt: ".concat(result.revised_prompt) : ''),
                                }
                            ], result.images.map(function (image) { return ({
                                type: 'image',
                                data: image,
                                mimeType: "image/".concat(input_2.format || 'png'),
                            }); }), true),
                        }];
                case 18: return [4 /*yield*/, cache_js_1.imageCache.clear()];
                case 19:
                    _k.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: 'Image cache cleared successfully.',
                                },
                            ],
                        }];
                case 20:
                    {
                        stats = cache_js_1.imageCache.getCacheStats();
                        return [2 /*return*/, {
                                content: [
                                    {
                                        type: 'text',
                                        text: "Cache Statistics:\n- Memory entries: ".concat(stats.memoryEntries, "\n- Estimated disk usage: ").concat(stats.estimatedDiskUsage),
                                    },
                                ],
                            }];
                    }
                    _k.label = 21;
                case 21: return [4 /*yield*/, conversationContext.getAllConversations()];
                case 22:
                    conversations = _k.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: conversations.length > 0
                                        ? "Active conversations:\n".concat(conversations.map(function (id) { return "- ".concat(id); }).join('\n'))
                                        : 'No active conversations found.',
                                },
                            ],
                        }];
                case 23:
                    conversationId = args.conversationId;
                    return [4 /*yield*/, conversationContext.getContext(conversationId)];
                case 24:
                    history_1 = _k.sent();
                    if (!history_1) {
                        return [2 /*return*/, {
                                content: [
                                    {
                                        type: 'text',
                                        text: "Conversation '".concat(conversationId, "' not found."),
                                    },
                                ],
                            }];
                    }
                    entries = history_1.entries.map(function (entry, index) {
                        var details = [];
                        if (entry.revisedPrompt)
                            details.push("revised: \"".concat(entry.revisedPrompt, "\""));
                        if (entry.imageMetadata)
                            details.push("".concat(entry.imageMetadata.size, ", ").concat(entry.imageMetadata.quality));
                        if (entry.editMask)
                            details.push('with mask');
                        return "".concat(index + 1, ". \"").concat(entry.prompt, "\" ").concat(details.length ? "(".concat(details.join(', '), ")") : '');
                    }).join('\n');
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: "Conversation: ".concat(conversationId, "\nCreated: ").concat(history_1.createdAt.toISOString(), "\nEntries:\n").concat(entries || 'No entries yet'),
                                },
                            ],
                        }];
                case 25:
                    conversationId = args.conversationId;
                    return [4 /*yield*/, conversationContext.clearContext(conversationId)];
                case 26:
                    success = _k.sent();
                    return [2 /*return*/, {
                            content: [
                                {
                                    type: 'text',
                                    text: success
                                        ? "Conversation '".concat(conversationId, "' cleared successfully.")
                                        : "Conversation '".concat(conversationId, "' not found."),
                                },
                            ],
                        }];
                case 27: throw new types_js_1.McpError(types_js_1.ErrorCode.MethodNotFound, "Unknown tool: ".concat(name_1));
                case 28: return [3 /*break*/, 30];
                case 29:
                    error_1 = _k.sent();
                    if (error_1 instanceof zod_1.z.ZodError) {
                        throw new types_js_1.McpError(types_js_1.ErrorCode.InvalidParams, "Invalid parameters: ".concat(error_1.errors.map(function (e) { return "".concat(e.path.join('.'), ": ").concat(e.message); }).join(', ')));
                    }
                    if (error_1 instanceof types_js_1.McpError) {
                        throw error_1;
                    }
                    throw new types_js_1.McpError(types_js_1.ErrorCode.InternalError, "Tool execution failed: ".concat(error_1 instanceof Error ? error_1.message : 'Unknown error'));
                case 30: return [2 /*return*/];
            }
        });
    }); });
    return server;
}
function runStdioServer() {
    return __awaiter(this, void 0, void 0, function () {
        var server, transport;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    server = createMCPServer();
                    transport = new stdio_js_1.StdioServerTransport();
                    return [4 /*yield*/, server.connect(transport)];
                case 1:
                    _a.sent();
                    console.error('GPT Image-1 MCP Server running on stdio');
                    return [2 /*return*/];
            }
        });
    });
}
