type CacheEntry<T> = { value: T; expiresAt: number };

export class TTLCache<T = any> {
  private store = new Map<string, CacheEntry<T>>();
  constructor(private defaultTtlMs: number = 5 * 60 * 1000, private maxEntries: number = 200) {}

  get(key: string): T | undefined {
    const it = this.store.get(key);
    if (!it) return undefined;
    if (Date.now() > it.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return it.value;
  }

  set(key: string, value: T, ttlMs?: number) {
    if (this.store.size > this.maxEntries) {
      // naive LRU: delete first key
      const first = this.store.keys().next().value as string | undefined;
      if (first) this.store.delete(first);
    }
    this.store.set(key, { value, expiresAt: Date.now() + (ttlMs ?? this.defaultTtlMs) });
  }
}

export const globalCache = new TTLCache<any>();


