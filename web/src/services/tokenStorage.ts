export function tokenStorage(): Storage {
  if (typeof window === 'undefined') {
    const memory = new Map<string, string>();
    const fallback = {
      getItem: (k: string) => memory.has(k) ? memory.get(k)! : null,
      setItem: (k: string, v: string) => { memory.set(k, v); },
      removeItem: (k: string) => { memory.delete(k); },
      clear: () => { memory.clear(); },
      key: (i: number) => Array.from(memory.keys())[i] ?? null,
      get length() { return memory.size; },
    } as unknown as Storage;
    return fallback;
  }

  try {
    // Test access to localStorage (can throw an error in some browsers/privacy modes)
    const ls = window.localStorage;
    const testKey = '__storage_test__';
    ls.setItem(testKey, '1');
    ls.removeItem(testKey);
    return ls;
  } catch (error) {
    const memory = new Map<string, string>();
    const fallback = {
      getItem: (k: string) => memory.has(k) ? memory.get(k)! : null,
      setItem: (k: string, v: string) => { memory.set(k, v); },
      removeItem: (k: string) => { memory.delete(k); },
      clear: () => { memory.clear(); },
      key: (i: number) => Array.from(memory.keys())[i] ?? null,
      get length() { return memory.size; },
    } as unknown as Storage;
    return fallback;
  }
}
