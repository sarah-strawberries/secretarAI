import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from "react-oidc-context";
import { WebStorageStateStore, Log } from 'oidc-client-ts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import './index.css'
import App from './App.tsx'
import { tokenStorage } from './services/tokenStorage.ts';
import { MessageProvider } from './context/MessageProvider.tsx';

Log.setLogger(console);
Log.setLevel(Log.INFO);

const queryClient = new QueryClient();

const oidcConfig = {
  authority: import.meta.env.VITE_OIDC_AUTHORITY ?? "",
  client_id: import.meta.env.VITE_OIDC_CLIENT_ID ?? "",
  redirect_uri: import.meta.env.VITE_OIDC_REDIRECT_URI ?? "",
  post_logout_redirect_uri: window.location.origin,
  extraQueryParams: { kc_idp_hint: "google" },
};

const userStore = new WebStorageStateStore({ store: tokenStorage() });
const stateStore = new WebStorageStateStore({ store: tokenStorage() });

const onSigninCallback = () => {
  window.history.replaceState({}, document.title, "/")
}

createRoot(document.getElementById('root')!).render(
    <AuthProvider {...oidcConfig} userStore={userStore} stateStore={stateStore} onSigninCallback={onSigninCallback}>
      <QueryClientProvider client={queryClient}>
        <MessageProvider>
          <BrowserRouter>
            <App />
            <Toaster
              toastOptions={{
                className: 'toast-base',
                error: {
                  className: 'toast-error',
                  iconTheme: {
                    primary: 'var(--tan-800)',
                    secondary: 'var(--tan-100)',
                  },
                },
                success: {
                  className: 'toast-success',
                  iconTheme: {
                    primary: 'var(--blue-500)',
                    secondary: 'var(--tan-100)',
                  },
                },
              }}
            />
          </BrowserRouter>
        </MessageProvider>
      </QueryClientProvider>
    </AuthProvider>,
)
