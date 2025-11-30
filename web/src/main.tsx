import { createRoot } from 'react-dom/client'
import { AuthProvider } from "react-oidc-context";
import { WebStorageStateStore, Log } from 'oidc-client-ts';
import './index.css'
import App from './App.tsx'

Log.setLogger(console);
Log.setLevel(Log.INFO);

const oidcConfig = {
  authority: import.meta.env.VITE_OIDC_AUTHORITY ?? "",
  client_id: import.meta.env.VITE_OIDC_CLIENT_ID ?? "",
  // redirect_uri: "https://secretarai.duckdns.org/auth/callback",
  // redirect_uri: "http://localhost:5173/auth/callback",
  redirect_uri: import.meta.env.VITE_OIDC_REDIRECT_URI ?? "",
  post_logout_redirect_uri: window.location.origin,
  extraQueryParams: { kc_idp_hint: "google" },
};

// Create a safe storage wrapper that falls back to an in-memory store when
// window.localStorage is unavailable (for example, in certain iframe/third-party
// cookie/storage-blocking environments). oidc-client-ts expects a storage
// object implementing getItem/setItem/removeItem.
function createSafeStorage(): Storage {
  if (typeof window === 'undefined') {
    // Server-side rendering: provide a simple in-memory store
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
    // Test access to localStorage (can throw in some browsers/privacy modes)
    const ls = window.localStorage;
    const testKey = '__storage_test__';
    ls.setItem(testKey, '1');
    ls.removeItem(testKey);
    return ls;
  } catch (e) {
    // Fallback to in-memory store
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

const userStore = new WebStorageStateStore({ store: createSafeStorage() });
const stateStore = new WebStorageStateStore({ store: createSafeStorage() });

const onSigninCallback = () => {
  window.history.replaceState({}, document.title, "/")
}

createRoot(document.getElementById('root')!).render(
    <AuthProvider {...oidcConfig} userStore={userStore} stateStore={stateStore} onSigninCallback={onSigninCallback}>
      <App />
    </AuthProvider>,
)
