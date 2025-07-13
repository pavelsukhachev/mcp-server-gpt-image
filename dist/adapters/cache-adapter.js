export class CacheAdapter {
    cache;
    constructor(cache) {
        this.cache = cache;
    }
    async get(type, input) {
        return this.cache.get(type, input);
    }
    async set(type, input, data, ttl) {
        return this.cache.set(type, input, data, ttl);
    }
}
//# sourceMappingURL=cache-adapter.js.map