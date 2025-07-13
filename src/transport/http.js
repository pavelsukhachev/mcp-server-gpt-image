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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHTTPServer = createHTTPServer;
var express_1 = require("express");
var cors_1 = require("cors");
var streamableHttp_js_1 = require("@modelcontextprotocol/sdk/server/streamableHttp.js");
var server_js_1 = require("../server.js");
var sessionManager = {
    sessions: new Map(),
    pendingSessions: new Map(),
};
function createHTTPServer(port) {
    var _this = this;
    if (port === void 0) { port = 3000; }
    var app = (0, express_1.default)();
    // Configure middleware
    app.use((0, cors_1.default)({
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Session-ID'],
    }));
    app.use(express_1.default.json({ limit: '50mb' }));
    // Health check endpoint
    app.get('/health', function (_req, res) {
        res.json({ status: 'ok', service: 'gpt-image-1-mcp-server' });
    });
    // MCP endpoint
    app.post('/mcp', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var sessionId, transport, pendingSession, sessionPromise, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, , 9]);
                    sessionId = req.headers['x-session-id'] || generateSessionId();
                    transport = sessionManager.sessions.get(sessionId);
                    if (!!transport) return [3 /*break*/, 6];
                    pendingSession = sessionManager.pendingSessions.get(sessionId);
                    if (!pendingSession) return [3 /*break*/, 2];
                    return [4 /*yield*/, pendingSession];
                case 1:
                    transport = _a.sent();
                    return [3 /*break*/, 6];
                case 2:
                    sessionPromise = createSession(sessionId);
                    sessionManager.pendingSessions.set(sessionId, sessionPromise);
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, , 5, 6]);
                    return [4 /*yield*/, sessionPromise];
                case 4:
                    transport = _a.sent();
                    sessionManager.sessions.set(sessionId, transport);
                    return [3 /*break*/, 6];
                case 5:
                    sessionManager.pendingSessions.delete(sessionId);
                    return [7 /*endfinally*/];
                case 6:
                    // Set response headers
                    res.setHeader('X-Session-ID', sessionId);
                    res.setHeader('Content-Type', 'application/json');
                    // Handle the request with body
                    return [4 /*yield*/, transport.handleRequest(req, res, req.body)];
                case 7:
                    // Handle the request with body
                    _a.sent();
                    return [3 /*break*/, 9];
                case 8:
                    error_1 = _a.sent();
                    console.error('MCP request error:', error_1);
                    if (!res.headersSent) {
                        res.status(500).json({
                            error: {
                                code: 'internal_error',
                                message: error_1 instanceof Error ? error_1.message : 'Unknown error',
                            },
                        });
                    }
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    }); });
    // Streaming image generation endpoint
    app.post('/mcp/stream', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var sessionId, generateImageWithStreaming, input, _a, _b, _c, event_1, data, e_1_1, error_2, errorEvent;
        var _d, e_1, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    _g.trys.push([0, 14, , 15]);
                    sessionId = req.headers['x-session-id'] || generateSessionId();
                    // Set SSE headers
                    res.setHeader('Content-Type', 'text/event-stream');
                    res.setHeader('Cache-Control', 'no-cache');
                    res.setHeader('Connection', 'keep-alive');
                    res.setHeader('X-Session-ID', sessionId);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require('../tools/image-generation-streaming.js'); })];
                case 1:
                    generateImageWithStreaming = (_g.sent()).generateImageWithStreaming;
                    input = req.body;
                    _g.label = 2;
                case 2:
                    _g.trys.push([2, 7, 8, 13]);
                    _a = true, _b = __asyncValues(generateImageWithStreaming(input));
                    _g.label = 3;
                case 3: return [4 /*yield*/, _b.next()];
                case 4:
                    if (!(_c = _g.sent(), _d = _c.done, !_d)) return [3 /*break*/, 6];
                    _f = _c.value;
                    _a = false;
                    event_1 = _f;
                    data = JSON.stringify(event_1);
                    res.write("data: ".concat(data, "\n\n"));
                    // Send keep-alive comment every few events
                    res.write(': keep-alive\n\n');
                    _g.label = 5;
                case 5:
                    _a = true;
                    return [3 /*break*/, 3];
                case 6: return [3 /*break*/, 13];
                case 7:
                    e_1_1 = _g.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 13];
                case 8:
                    _g.trys.push([8, , 11, 12]);
                    if (!(!_a && !_d && (_e = _b.return))) return [3 /*break*/, 10];
                    return [4 /*yield*/, _e.call(_b)];
                case 9:
                    _g.sent();
                    _g.label = 10;
                case 10: return [3 /*break*/, 12];
                case 11:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 12: return [7 /*endfinally*/];
                case 13:
                    // Send done event
                    res.write('data: [DONE]\n\n');
                    res.end();
                    return [3 /*break*/, 15];
                case 14:
                    error_2 = _g.sent();
                    console.error('Streaming error:', error_2);
                    if (!res.headersSent) {
                        res.status(500).json({
                            error: {
                                code: 'streaming_error',
                                message: error_2 instanceof Error ? error_2.message : 'Unknown error',
                            },
                        });
                    }
                    else {
                        errorEvent = {
                            type: 'error',
                            error: error_2 instanceof Error ? error_2.message : 'Unknown error',
                        };
                        res.write("data: ".concat(JSON.stringify(errorEvent), "\n\n"));
                        res.end();
                    }
                    return [3 /*break*/, 15];
                case 15: return [2 /*return*/];
            }
        });
    }); });
    // Session cleanup endpoint
    app.delete('/mcp/session/:sessionId', function (req, res) {
        var sessionId = req.params.sessionId;
        if (sessionManager.sessions.has(sessionId)) {
            sessionManager.sessions.delete(sessionId);
            res.json({ message: 'Session closed' });
        }
        else {
            res.status(404).json({ error: 'Session not found' });
        }
    });
    // Start server
    app.listen(port, function () {
        console.log("GPT Image-1 MCP Server running on http://localhost:".concat(port));
        console.log("Health check: http://localhost:".concat(port, "/health"));
        console.log("MCP endpoint: http://localhost:".concat(port, "/mcp"));
        console.log("Streaming endpoint: http://localhost:".concat(port, "/mcp/stream"));
    });
    // Cleanup on shutdown
    process.on('SIGINT', function () {
        console.log('Shutting down server...');
        sessionManager.sessions.clear();
        sessionManager.pendingSessions.clear();
        process.exit(0);
    });
    return app;
}
function createSession(sessionId) {
    return __awaiter(this, void 0, void 0, function () {
        var server, transport;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    server = (0, server_js_1.createMCPServer)();
                    transport = new streamableHttp_js_1.StreamableHTTPServerTransport({
                        sessionIdGenerator: function () { return sessionId; },
                        onsessioninitialized: function (id) {
                            console.log("Session initialized: ".concat(id));
                        },
                        onsessionclosed: function (id) {
                            console.log("Session closed: ".concat(id));
                            sessionManager.sessions.delete(id);
                        },
                    });
                    return [4 /*yield*/, server.connect(transport)];
                case 1:
                    _a.sent();
                    console.log("Created new session: ".concat(sessionId));
                    return [2 /*return*/, transport];
            }
        });
    });
}
function generateSessionId() {
    return "session_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9));
}
