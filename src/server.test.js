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
var vitest_1 = require("vitest");
var types_js_1 = require("@modelcontextprotocol/sdk/types.js");
var index_js_1 = require("@modelcontextprotocol/sdk/client/index.js");
var inMemory_js_1 = require("@modelcontextprotocol/sdk/inMemory.js");
var types_js_2 = require("@modelcontextprotocol/sdk/types.js");
// Mock all dependencies before importing
vitest_1.vi.mock('./tools/image-generation', function () { return ({
    generateImage: vitest_1.vi.fn(),
    editImage: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock('./tools/image-generation-streaming', function () { return ({
    generateImageWithStreaming: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock('./utils/cache', function () { return ({
    imageCache: {
        clear: vitest_1.vi.fn(),
        getCacheStats: vitest_1.vi.fn(),
        get: vitest_1.vi.fn(),
        set: vitest_1.vi.fn(),
    },
}); });
// Set environment variable for tests
process.env.OPENAI_API_KEY = 'test-api-key';
// Now import after mocks are set up
var server_1 = require("./server");
var image_generation_1 = require("./tools/image-generation");
var image_generation_streaming_1 = require("./tools/image-generation-streaming");
var cache_1 = require("./utils/cache");
(0, vitest_1.describe)('MCP Server Integration Tests', function () {
    var server;
    var client;
    var clientTransport;
    var serverTransport;
    (0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    vitest_1.vi.clearAllMocks();
                    server = (0, server_1.createMCPServer)();
                    // Create linked transport pair
                    _a = inMemory_js_1.InMemoryTransport.createLinkedPair(), clientTransport = _a[0], serverTransport = _a[1];
                    // Create client
                    client = new index_js_1.Client({
                        name: 'test-client',
                        version: '1.0.0',
                    });
                    // Connect both client and server
                    return [4 /*yield*/, Promise.all([
                            client.connect(clientTransport),
                            server.connect(serverTransport),
                        ])];
                case 1:
                    // Connect both client and server
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.restoreAllMocks();
                    return [4 /*yield*/, client.close()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.describe)('ListToolsRequest', function () {
        (0, vitest_1.it)('should list all available tools', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, toolNames;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.request({
                            method: 'tools/list',
                            params: {},
                        }, types_js_2.ListToolsResultSchema)];
                    case 1:
                        response = _a.sent();
                        (0, vitest_1.expect)(response.tools).toHaveLength(7);
                        toolNames = response.tools.map(function (tool) { return tool.name; });
                        (0, vitest_1.expect)(toolNames).toContain('generate_image');
                        (0, vitest_1.expect)(toolNames).toContain('edit_image');
                        (0, vitest_1.expect)(toolNames).toContain('clear_cache');
                        (0, vitest_1.expect)(toolNames).toContain('cache_stats');
                        (0, vitest_1.expect)(toolNames).toContain('list_conversations');
                        (0, vitest_1.expect)(toolNames).toContain('get_conversation');
                        (0, vitest_1.expect)(toolNames).toContain('clear_conversation');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should include proper tool descriptions and schemas', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, generateTool;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.request({
                            method: 'tools/list',
                            params: {},
                        }, types_js_2.ListToolsResultSchema)];
                    case 1:
                        response = _a.sent();
                        generateTool = response.tools.find(function (t) { return t.name === 'generate_image'; });
                        (0, vitest_1.expect)(generateTool).toBeDefined();
                        (0, vitest_1.expect)(generateTool.description).toContain('GPT Image-1');
                        (0, vitest_1.expect)(generateTool.inputSchema).toHaveProperty('type', 'object');
                        (0, vitest_1.expect)(generateTool.inputSchema).toHaveProperty('properties');
                        (0, vitest_1.expect)(generateTool.inputSchema).toHaveProperty('required', ['prompt']);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('CallToolRequest - generate_image', function () {
        (0, vitest_1.it)('should generate image successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResult, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResult = {
                            images: ['aGVsbG8gd29ybGQ='], // Valid base64: "hello world"
                            revised_prompt: 'A beautiful sunset over the ocean',
                        };
                        vitest_1.vi.mocked(image_generation_1.generateImage).mockResolvedValue(mockResult);
                        return [4 /*yield*/, client.request({
                                method: 'tools/call',
                                params: {
                                    name: 'generate_image',
                                    arguments: {
                                        prompt: 'A sunset',
                                        size: '1024x1024',
                                        quality: 'high',
                                        format: 'png',
                                    },
                                },
                            }, types_js_2.CallToolResultSchema)];
                    case 1:
                        response = _a.sent();
                        (0, vitest_1.expect)(response.content).toBeInstanceOf(Array);
                        (0, vitest_1.expect)(response.content[0].type).toBe('text');
                        (0, vitest_1.expect)(response.content[0].text).toContain('Generated 1 image(s) successfully');
                        (0, vitest_1.expect)(response.content[1].type).toBe('image');
                        (0, vitest_1.expect)(response.content[1].data).toBe('aGVsbG8gd29ybGQ=');
                        (0, vitest_1.expect)(response.content[1].mimeType).toBe('image/png');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle multiple images', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResult, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResult = {
                            images: ['aW1hZ2Ux', 'aW1hZ2Uy', 'aW1hZ2Uz'], // Valid base64
                        };
                        vitest_1.vi.mocked(image_generation_1.generateImage).mockResolvedValue(mockResult);
                        return [4 /*yield*/, client.request({
                                method: 'tools/call',
                                params: {
                                    name: 'generate_image',
                                    arguments: {
                                        prompt: 'Multiple images',
                                        n: 3,
                                    },
                                },
                            }, types_js_2.CallToolResultSchema)];
                    case 1:
                        response = _a.sent();
                        (0, vitest_1.expect)(response.content).toHaveLength(4); // 1 text + 3 images
                        (0, vitest_1.expect)(response.content[0].text).toContain('Generated 3 image(s)');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle streaming requests', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockStreamEvents, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockStreamEvents = [
                            { type: 'progress', data: { message: 'Starting...', percentage: 0 } },
                            { type: 'partial', data: { partialImage: 'partial1', index: 0 } },
                            { type: 'complete', data: { finalImage: 'ZmluYWwtaW1hZ2U=', revisedPrompt: 'Enhanced prompt' } },
                        ];
                        vitest_1.vi.mocked(image_generation_streaming_1.generateImageWithStreaming).mockImplementation(function () {
                            return __asyncGenerator(this, arguments, function () {
                                var _i, mockStreamEvents_1, event_1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _i = 0, mockStreamEvents_1 = mockStreamEvents;
                                            _a.label = 1;
                                        case 1:
                                            if (!(_i < mockStreamEvents_1.length)) return [3 /*break*/, 5];
                                            event_1 = mockStreamEvents_1[_i];
                                            return [4 /*yield*/, __await(event_1)];
                                        case 2: return [4 /*yield*/, _a.sent()];
                                        case 3:
                                            _a.sent();
                                            _a.label = 4;
                                        case 4:
                                            _i++;
                                            return [3 /*break*/, 1];
                                        case 5: return [2 /*return*/];
                                    }
                                });
                            });
                        });
                        return [4 /*yield*/, client.request({
                                method: 'tools/call',
                                params: {
                                    name: 'generate_image',
                                    arguments: {
                                        prompt: 'Streaming test',
                                        stream: true,
                                        partialImages: 2,
                                    },
                                },
                            }, types_js_2.CallToolResultSchema)];
                    case 1:
                        response = _a.sent();
                        (0, vitest_1.expect)(response.content[0].text).toContain('Generated image with streaming successfully');
                        (0, vitest_1.expect)(response.content[0].text).toContain('Revised prompt: Enhanced prompt');
                        (0, vitest_1.expect)(response.content[0].text).toContain('Streaming events: 3');
                        (0, vitest_1.expect)(response.content[1].data).toBe('ZmluYWwtaW1hZ2U='); // 'final-image' in base64
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should validate input parameters', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, vitest_1.expect)(client.request({
                            method: 'tools/call',
                            params: {
                                name: 'generate_image',
                                arguments: {
                                    // Missing required 'prompt' field
                                    size: '1024x1024',
                                },
                            },
                        }, types_js_2.CallToolResultSchema)).rejects.toMatchObject({
                            code: types_js_1.ErrorCode.InvalidParams,
                            message: vitest_1.expect.stringContaining('Invalid parameters'),
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle generation errors', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vitest_1.vi.mocked(image_generation_1.generateImage).mockRejectedValue(new Error('API rate limit exceeded'));
                        return [4 /*yield*/, (0, vitest_1.expect)(client.request({
                                method: 'tools/call',
                                params: {
                                    name: 'generate_image',
                                    arguments: {
                                        prompt: 'Test error handling',
                                    },
                                },
                            }, types_js_2.CallToolResultSchema)).rejects.toMatchObject({
                                code: types_js_1.ErrorCode.InternalError,
                                message: vitest_1.expect.stringContaining('API rate limit exceeded'),
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('CallToolRequest - edit_image', function () {
        (0, vitest_1.it)('should edit image successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResult, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResult = {
                            images: ['ZWRpdGVkLWltYWdlLWRhdGE='], // Valid base64
                            revised_prompt: 'Added rainbow to sunset',
                        };
                        vitest_1.vi.mocked(image_generation_1.editImage).mockResolvedValue(mockResult);
                        return [4 /*yield*/, client.request({
                                method: 'tools/call',
                                params: {
                                    name: 'edit_image',
                                    arguments: {
                                        prompt: 'Add rainbow',
                                        images: ['b3JpZ2luYWwtaW1hZ2UtZGF0YQ=='], // Valid base64
                                        format: 'jpeg',
                                    },
                                },
                            }, types_js_2.CallToolResultSchema)];
                    case 1:
                        response = _a.sent();
                        (0, vitest_1.expect)(response.content[0].text).toContain('Edited image(s) successfully');
                        (0, vitest_1.expect)(response.content[0].text).toContain('Revised prompt: Added rainbow to sunset');
                        (0, vitest_1.expect)(response.content[1].type).toBe('image');
                        (0, vitest_1.expect)(response.content[1].mimeType).toBe('image/jpeg');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should validate edit input parameters', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, vitest_1.expect)(client.request({
                            method: 'tools/call',
                            params: {
                                name: 'edit_image',
                                arguments: {
                                    prompt: 'Edit without images',
                                    // Missing required 'images' field
                                },
                            },
                        }, types_js_2.CallToolResultSchema)).rejects.toMatchObject({
                            code: types_js_1.ErrorCode.InvalidParams,
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('CallToolRequest - cache operations', function () {
        (0, vitest_1.it)('should clear cache successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vitest_1.vi.mocked(cache_1.imageCache.clear).mockResolvedValue(undefined);
                        return [4 /*yield*/, client.request({
                                method: 'tools/call',
                                params: {
                                    name: 'clear_cache',
                                    arguments: {},
                                },
                            }, types_js_2.CallToolResultSchema)];
                    case 1:
                        response = _a.sent();
                        (0, vitest_1.expect)(response.content[0].text).toBe('Image cache cleared successfully.');
                        (0, vitest_1.expect)(cache_1.imageCache.clear).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should return cache statistics', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vitest_1.vi.mocked(cache_1.imageCache.getCacheStats).mockReturnValue({
                            memoryEntries: 10,
                            estimatedDiskUsage: '5.0 MB',
                        });
                        return [4 /*yield*/, client.request({
                                method: 'tools/call',
                                params: {
                                    name: 'cache_stats',
                                    arguments: {},
                                },
                            }, types_js_2.CallToolResultSchema)];
                    case 1:
                        response = _a.sent();
                        (0, vitest_1.expect)(response.content[0].text).toContain('Memory entries: 10');
                        (0, vitest_1.expect)(response.content[0].text).toContain('Estimated disk usage: 5.0 MB');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('CallToolRequest - error handling', function () {
        (0, vitest_1.it)('should handle unknown tool names', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, vitest_1.expect)(client.request({
                            method: 'tools/call',
                            params: {
                                name: 'unknown_tool',
                                arguments: {},
                            },
                        }, types_js_2.CallToolResultSchema)).rejects.toMatchObject({
                            code: types_js_1.ErrorCode.MethodNotFound,
                            message: vitest_1.expect.stringContaining('Unknown tool: unknown_tool'),
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('should handle Zod validation errors with details', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, vitest_1.expect)(client.request({
                            method: 'tools/call',
                            params: {
                                name: 'generate_image',
                                arguments: {
                                    prompt: 'Test',
                                    size: 'invalid-size', // Invalid enum value
                                    n: 10, // Exceeds max value
                                },
                            },
                        }, types_js_2.CallToolResultSchema)).rejects.toMatchObject({
                            code: types_js_1.ErrorCode.InvalidParams,
                            message: vitest_1.expect.stringContaining('Invalid parameters'),
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)('Server instance creation', function () {
        (0, vitest_1.it)('should create server with correct configuration', function () {
            var server = (0, server_1.createMCPServer)();
            (0, vitest_1.expect)(server).toBeDefined();
            // Server name and version are private, but we can test that the server was created
            (0, vitest_1.expect)(server).toBeInstanceOf(Object);
            (0, vitest_1.expect)(typeof server.connect).toBe('function');
            (0, vitest_1.expect)(typeof server.setRequestHandler).toBe('function');
        });
        (0, vitest_1.it)('should have tools capability', function () {
            var server = (0, server_1.createMCPServer)();
            var capabilities = server.getCapabilities();
            (0, vitest_1.expect)(capabilities).toHaveProperty('tools', {});
        });
    });
});
