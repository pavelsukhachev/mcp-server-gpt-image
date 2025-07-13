import express from 'express';
import cors from 'cors';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createMCPServer } from '../server.js';
const sessionManager = {
    sessions: new Map(),
    pendingSessions: new Map(),
};
export function createHTTPServer(port = 3000) {
    const app = express();
    // Configure middleware
    app.use(cors({
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Session-ID'],
    }));
    app.use(express.json({ limit: '50mb' }));
    // Health check endpoint
    app.get('/health', (_req, res) => {
        res.json({ status: 'ok', service: 'gpt-image-1-mcp-server' });
    });
    // MCP endpoint
    app.post('/mcp', async (req, res) => {
        try {
            const sessionId = req.headers['x-session-id'] || generateSessionId();
            // Check if session already exists
            let transport = sessionManager.sessions.get(sessionId);
            if (!transport) {
                // Check if session is being created
                const pendingSession = sessionManager.pendingSessions.get(sessionId);
                if (pendingSession) {
                    transport = await pendingSession;
                }
                else {
                    // Create new session
                    const sessionPromise = createSession(sessionId);
                    sessionManager.pendingSessions.set(sessionId, sessionPromise);
                    try {
                        transport = await sessionPromise;
                        sessionManager.sessions.set(sessionId, transport);
                    }
                    finally {
                        sessionManager.pendingSessions.delete(sessionId);
                    }
                }
            }
            // Set response headers
            res.setHeader('X-Session-ID', sessionId);
            res.setHeader('Content-Type', 'application/json');
            // Handle the request with body
            await transport.handleRequest(req, res, req.body);
        }
        catch (error) {
            console.error('MCP request error:', error);
            if (!res.headersSent) {
                res.status(500).json({
                    error: {
                        code: 'internal_error',
                        message: error instanceof Error ? error.message : 'Unknown error',
                    },
                });
            }
        }
    });
    // Session cleanup endpoint
    app.delete('/mcp/session/:sessionId', (req, res) => {
        const { sessionId } = req.params;
        if (sessionManager.sessions.has(sessionId)) {
            sessionManager.sessions.delete(sessionId);
            res.json({ message: 'Session closed' });
        }
        else {
            res.status(404).json({ error: 'Session not found' });
        }
    });
    // Start server
    app.listen(port, () => {
        console.log(`GPT Image-1 MCP Server running on http://localhost:${port}`);
        console.log(`Health check: http://localhost:${port}/health`);
        console.log(`MCP endpoint: http://localhost:${port}/mcp`);
    });
    // Cleanup on shutdown
    process.on('SIGINT', () => {
        console.log('Shutting down server...');
        sessionManager.sessions.clear();
        sessionManager.pendingSessions.clear();
        process.exit(0);
    });
    return app;
}
async function createSession(sessionId) {
    const server = createMCPServer();
    const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => sessionId,
        onsessioninitialized: (id) => {
            console.log(`Session initialized: ${id}`);
        },
        onsessionclosed: (id) => {
            console.log(`Session closed: ${id}`);
            sessionManager.sessions.delete(id);
        },
    });
    await server.connect(transport);
    console.log(`Created new session: ${sessionId}`);
    return transport;
}
function generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
//# sourceMappingURL=http.js.map