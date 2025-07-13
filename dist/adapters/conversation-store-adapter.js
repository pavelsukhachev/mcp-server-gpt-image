import { promises as fs } from 'fs';
import path from 'path';
export class ConversationStoreAdapter {
    memoryStore = new Map();
    persistenceDir;
    maxMemoryEntries;
    constructor(persistenceDir = '.cache/conversations', maxMemoryEntries = 100) {
        this.persistenceDir = persistenceDir;
        this.maxMemoryEntries = maxMemoryEntries;
    }
    async get(conversationId) {
        if (this.memoryStore.has(conversationId)) {
            return this.memoryStore.get(conversationId);
        }
        try {
            const filePath = this.getFilePath(conversationId);
            const data = await fs.readFile(filePath, 'utf-8');
            const history = JSON.parse(data);
            history.entries.forEach(entry => {
                entry.timestamp = new Date(entry.timestamp);
            });
            history.createdAt = new Date(history.createdAt);
            history.updatedAt = new Date(history.updatedAt);
            if (this.memoryStore.size < this.maxMemoryEntries) {
                this.memoryStore.set(conversationId, history);
            }
            return history;
        }
        catch (error) {
            if (error.code === 'ENOENT') {
                return null;
            }
            throw error;
        }
    }
    async set(conversationId, history) {
        this.memoryStore.set(conversationId, history);
        if (this.memoryStore.size > this.maxMemoryEntries) {
            const firstKey = this.memoryStore.keys().next().value;
            if (firstKey) {
                this.memoryStore.delete(firstKey);
            }
        }
        try {
            await this.ensureDirectoryExists();
            const filePath = this.getFilePath(conversationId);
            await fs.writeFile(filePath, JSON.stringify(history, null, 2));
        }
        catch (error) {
            console.error('Failed to persist conversation:', error);
            throw error;
        }
    }
    async delete(conversationId) {
        this.memoryStore.delete(conversationId);
        try {
            const filePath = this.getFilePath(conversationId);
            await fs.unlink(filePath);
            return true;
        }
        catch (error) {
            if (error.code === 'ENOENT') {
                return false;
            }
            throw error;
        }
    }
    async list() {
        try {
            const files = await fs.readdir(this.persistenceDir);
            return files
                .filter(file => file.endsWith('.json'))
                .map(file => path.basename(file, '.json'));
        }
        catch (error) {
            if (error.code === 'ENOENT') {
                return [];
            }
            throw error;
        }
    }
    async clear() {
        this.memoryStore.clear();
        try {
            const files = await fs.readdir(this.persistenceDir);
            await Promise.all(files
                .filter(file => file.endsWith('.json'))
                .map(file => fs.unlink(path.join(this.persistenceDir, file))));
        }
        catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }
    }
    getFilePath(conversationId) {
        const safeId = conversationId.replace(/[^a-zA-Z0-9-_]/g, '_');
        return path.join(this.persistenceDir, `${safeId}.json`);
    }
    async ensureDirectoryExists() {
        try {
            await fs.mkdir(this.persistenceDir, { recursive: true });
        }
        catch (error) {
            console.error('Failed to create conversation directory:', error);
        }
    }
}
//# sourceMappingURL=conversation-store-adapter.js.map