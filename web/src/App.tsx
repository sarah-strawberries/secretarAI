import { useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import { useAuth } from "react-oidc-context";
import { GlobalHeader } from "./components/GlobalHeader";
import { EmailManagementPage } from "./pages/EmailManagementPage";

function SigningMessage({ message }: { message: string }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[var(--tan-100)] text-lg text-[var(--coolgrey-600)]">
            {message}
        </div>
    );
}

function AuthenticatedHome({ displayName }: { displayName: string }) {
    const navigate = useNavigate();

    return (
        <section className="flex flex-col gap-6 rounded-3xl border border-[var(--bluegrey-200)] bg-white p-8 text-left shadow-sm">
            <div>
                <h1 className="text-2xl font-semibold text-[var(--blue-700)]">Welcome back, {displayName}.</h1>
                <p className="mt-2 text-sm text-[var(--coolgrey-500)]">Manage your connected inbox and preview recent conversations.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
                <button
                    type="button"
                    onClick={() => navigate("/emails")}
                    className="inline-flex items-center justify-center rounded-xl bg-[var(--blue-500)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--blue-400)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue-300)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                    Open Email Management
                </button>
            </div>
        </section>
    );
}

function App() {
    const auth = useAuth();

    useEffect(() => {
        if (auth.isAuthenticated && auth.user?.profile.name) {
            void fetch("/api/user-login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${auth.user.access_token}`,
                },
                body: JSON.stringify({ email: auth.user.profile.name }),
            });
        }
    }, [auth.isAuthenticated, auth.user]);

    switch (auth.activeNavigator) {
        case "signinSilent":
            return <SigningMessage message="Signing you in..." />;
        case "signoutRedirect":
            return <SigningMessage message="Signing you out..." />;
        default:
            break;
    }

    if (auth.isLoading) {
        return <SigningMessage message="Loading..." />;
    }

    if (auth.error) {
        return <SigningMessage message={`Oops... ${auth.error.message}`} />;
    }

    if (!auth.isAuthenticated) {
        return (
            <div className="flex min-h-screen flex-col bg-[var(--tan-100)] text-[var(--coolgrey-700)]">
                <GlobalHeader />
                <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 text-center sm:px-8">
                    <h1 className="text-3xl font-semibold tracking-tight text-[var(--blue-700)]">secretarAI</h1>
                    <button
                        type="button"
                        onClick={() => void auth.signinRedirect()}
                        className="rounded-xl bg-[var(--blue-500)] px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-[var(--blue-400)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue-300)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--tan-100)]"
                    >
                        Log in
                    </button>
                </div>
            </div>
        );
    }

    const displayName = auth.user?.profile.name ?? "there";

    return (
        <div className="flex min-h-screen flex-col bg-[var(--tan-100)] text-[var(--coolgrey-700)]">
            <GlobalHeader />
            <div className="flex flex-1 flex-col px-4 py-8 sm:px-8">
                <header className="flex flex-col gap-4 rounded-3xl border border-[var(--bluegrey-200)] bg-[var(--tan-200)] p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-[var(--coolgrey-500)]">Signed in as</p>
                        <p className="text-lg font-semibold text-[var(--blue-700)]">{displayName}</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => void auth.signoutRedirect()}
                        className="inline-flex items-center justify-center rounded-xl border border-transparent bg-white px-4 py-2 text-sm font-semibold text-[var(--blue-600)] shadow-sm transition hover:border-[var(--blue-300)] hover:bg-[var(--blue-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue-300)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--tan-200)]"
                    >
                        Log out
                    </button>
                </header>
                <main className="mt-8 flex-1 pb-8">
                    <Routes>
                        <Route path="/" element={<AuthenticatedHome displayName={displayName} />} />
                        <Route path="/emails" element={<EmailManagementPage />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}

export default App;