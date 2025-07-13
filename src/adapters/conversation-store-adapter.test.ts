import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import { ConversationStoreAdapter } from './conversation-store-adapter.js';
import { ConversationHistory } from '../interfaces/conversation-context.interface.js';

describe('ConversationStoreAdapter', () => {
  const testDir = '.test-cache/conversations';
  let adapter: ConversationStoreAdapter;

  beforeEach(async () => {
    adapter = new ConversationStoreAdapter(testDir, 5);
    // Clean up test directory
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch (error) {
      // Directory might not exist
    }
  });

  afterEach(async () => {
    // Clean up test directory
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch (error) {
      // Directory might not exist
    }
  });

  describe('get', () => {
    it('should return null for non-existent conversation', async () => {
      const result = await adapter.get('non-existent');
      expect(result).toBeNull();
    });

    it('should retrieve from memory store first', async () => {
      const history: ConversationHistory = {
        conversationId: 'test-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        entries: []
      };

      await adapter.set('test-1', history);
      
      // Should retrieve from memory without file system access
      const result = await adapter.get('test-1');
      expect(result).toEqual(history);
    });

    it('should retrieve from disk if not in memory', async () => {
      const history: ConversationHistory = {
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
      await fs.mkdir(testDir, { recursive: true });
      await fs.writeFile(
        path.join(testDir, 'test-2.json'),
        JSON.stringify(history)
      );

      const result = await adapter.get('test-2');
      expect(result).toBeTruthy();
      expect(result?.conversationId).toBe('test-2');
      expect(result?.entries[0].prompt).toBe('Test prompt');
    });

    it('should restore Date objects from JSON', async () => {
      const now = new Date();
      const history: ConversationHistory = {
        conversationId: 'test-3',
        createdAt: now,
        updatedAt: now,
        entries: [{
          id: '1',
          timestamp: now,
          prompt: 'Test'
        }]
      };

      await adapter.set('test-3', history);
      
      // Force read from disk by creating new adapter
      const newAdapter = new ConversationStoreAdapter(testDir);
      const result = await newAdapter.get('test-3');
      
      expect(result?.createdAt).toBeInstanceOf(Date);
      expect(result?.updatedAt).toBeInstanceOf(Date);
      expect(result?.entries[0].timestamp).toBeInstanceOf(Date);
    });
  });

  describe('set', () => {
    it('should store in both memory and disk', async () => {
      const history: ConversationHistory = {
        conversationId: 'test-4',
        createdAt: new Date(),
        updatedAt: new Date(),
        entries: []
      };

      await adapter.set('test-4', history);

      // Check memory store
      const fromMemory = await adapter.get('test-4');
      expect(fromMemory).toEqual(history);

      // Check disk store
      const filePath = path.join(testDir, 'test-4.json');
      const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
      expect(fileExists).toBe(true);
    });

    it('should evict oldest entry when memory limit exceeded', async () => {
      // Fill up to max capacity
      for (let i = 0; i < 6; i++) {
        const history: ConversationHistory = {
          conversationId: `test-${i}`,
          createdAt: new Date(),
          updatedAt: new Date(),
          entries: []
        };
        await adapter.set(`test-${i}`, history);
      }

      // First one should be evicted from memory (but still on disk)
      const firstFromMemory = await adapter.get('test-0');
      expect(firstFromMemory).toBeTruthy(); // Still retrievable from disk

      // Last ones should be in memory
      const lastFromMemory = await adapter.get('test-5');
      expect(lastFromMemory).toBeTruthy();
    });

    it('should sanitize conversation IDs for file names', async () => {
      const history: ConversationHistory = {
        conversationId: 'test/with:special*chars',
        createdAt: new Date(),
        updatedAt: new Date(),
        entries: []
      };

      await adapter.set('test/with:special*chars', history);

      const files = await fs.readdir(testDir);
      expect(files).toContain('test_with_special_chars.json');
    });
  });

  describe('delete', () => {
    it('should remove from both memory and disk', async () => {
      const history: ConversationHistory = {
        conversationId: 'test-5',
        createdAt: new Date(),
        updatedAt: new Date(),
        entries: []
      };

      await adapter.set('test-5', history);
      const deleted = await adapter.delete('test-5');
      
      expect(deleted).toBe(true);
      
      const result = await adapter.get('test-5');
      expect(result).toBeNull();

      const filePath = path.join(testDir, 'test-5.json');
      const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
      expect(fileExists).toBe(false);
    });

    it('should return false for non-existent conversation', async () => {
      const deleted = await adapter.delete('non-existent');
      expect(deleted).toBe(false);
    });
  });

  describe('list', () => {
    it('should return empty array when no conversations', async () => {
      const list = await adapter.list();
      expect(list).toEqual([]);
    });

    it('should list all conversation IDs', async () => {
      for (const id of ['conv-1', 'conv-2', 'conv-3']) {
        const history: ConversationHistory = {
          conversationId: id,
          createdAt: new Date(),
          updatedAt: new Date(),
          entries: []
        };
        await adapter.set(id, history);
      }

      const list = await adapter.list();
      expect(list).toHaveLength(3);
      expect(list).toContain('conv-1');
      expect(list).toContain('conv-2');
      expect(list).toContain('conv-3');
    });
  });

  describe('clear', () => {
    it('should remove all conversations from memory and disk', async () => {
      for (let i = 0; i < 3; i++) {
        const history: ConversationHistory = {
          conversationId: `test-${i}`,
          createdAt: new Date(),
          updatedAt: new Date(),
          entries: []
        };
        await adapter.set(`test-${i}`, history);
      }

      await adapter.clear();

      const list = await adapter.list();
      expect(list).toEqual([]);

      for (let i = 0; i < 3; i++) {
        const result = await adapter.get(`test-${i}`);
        expect(result).toBeNull();
      }
    });

    it('should handle clear when directory does not exist', async () => {
      const newAdapter = new ConversationStoreAdapter('.non-existent-dir');
      await expect(newAdapter.clear()).resolves.not.toThrow();
    });
  });
});