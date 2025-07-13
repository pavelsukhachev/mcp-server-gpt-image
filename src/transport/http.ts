import express, { Request, Response } from 'express';
import cors from 'cors';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createMCPServer } from '../server.js';

interface SessionManager {
  sessions: Map<string, StreamableHTTPServerTransport>;
  pendingSessions: Map<string, Promise<StreamableHTTPServerTransport>>;
}

const sessionManager: SessionManager = {
  sessions: new Map(),
  pendingSessions: new Map(),
};

export function createHTTPServer(port: number = 3000) {
  const app = express();
  
  // Configure middleware
  app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Session-ID'],
  }));
  
  app.use(express.json({ limit: '50mb' }));

  // Health check endpoint
  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'gpt-image-1-mcp-server' });
  });

  // MCP endpoint
  app.post('/mcp', async (req: Request, res: Response) => {
    try {
      const sessionId = req.headers['x-session-id'] as string || generateSessionId();
      
      // Check if session already exists
      let transport = sessionManager.sessions.get(sessionId);
      
      if (!transport) {
        // Check if session is being created
        const pendingSession = sessionManager.pendingSessions.get(sessionId);
        if (pendingSession) {
          transport = await pendingSession;
        } else {
          // Create new session
          const sessionPromise = createSession(sessionId);
          sessionManager.pendingSessions.set(sessionId, sessionPromise);
          
          try {
            transport = await sessionPromise;
            sessionManager.sessions.set(sessionId, transport);
          } finally {
            sessionManager.pendingSessions.delete(sessionId);
          }
        }
      }

      // Set response headers
      res.setHeader('X-Session-ID', sessionId);
      res.setHeader('Content-Type', 'application/json');

      // Handle the request with body
      await transport.handleRequest(req, res, req.body);
      
    } catch (error) {
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

  // Streaming image generation endpoint
  app.post('/mcp/stream', async (req: Request, res: Response) => {
    try {
      const sessionId = req.headers['x-session-id'] as string || generateSessionId();
      
      // Set SSE headers
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Session-ID', sessionId);
      
      // Import streaming function dynamically
      const { generateImageWithStreaming } = await import('../tools/image-generation-streaming.js');
      
      // Parse request body
      const input = req.body;
      
      // Stream events
      for await (const event of generateImageWithStreaming(input)) {
        const data = JSON.stringify(event);
        res.write(`data: ${data}\n\n`);
        
        // Send keep-alive comment every few events
        res.write(': keep-alive\n\n');
      }
      
      // Send done event
      res.write('data: [DONE]\n\n');
      res.end();
      
    } catch (error) {
      console.error('Streaming error:', error);
      
      if (!res.headersSent) {
        res.status(500).json({
          error: {
            code: 'streaming_error',
            message: error instanceof Error ? error.message : 'Unknown error',
          },
        });
      } else {
        // If headers already sent, send error as SSE event
        const errorEvent = {
          type: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        };
        res.write(`data: ${JSON.stringify(errorEvent)}\n\n`);
        res.end();
      }
    }
  });

  // Session cleanup endpoint
  app.delete('/mcp/session/:sessionId', (req: Request, res: Response) => {
    const { sessionId } = req.params as { sessionId: string };
    
    if (sessionManager.sessions.has(sessionId)) {
      sessionManager.sessions.delete(sessionId);
      res.json({ message: 'Session closed' });
    } else {
      res.status(404).json({ error: 'Session not found' });
    }
  });

  // Start server
  app.listen(port, () => {
    console.log(`GPT Image-1 MCP Server running on http://localhost:${port}`);
    console.log(`Health check: http://localhost:${port}/health`);
    console.log(`MCP endpoint: http://localhost:${port}/mcp`);
    console.log(`Streaming endpoint: http://localhost:${port}/mcp/stream`);
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

async function createSession(sessionId: string): Promise<StreamableHTTPServerTransport> {
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

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}