import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useAppAuth } from "./hooks/useAppAuth";
import { GlobalHeader } from "./components/GlobalHeader";
import { CalendarPage } from "./pages/CalendarPage";
import { EmailManagementPage } from "./pages/EmailManagementPage";
import { LegaleseSummarizerPage } from "./pages/LegaleseSummarizerPage";
import { NotesPage } from "./pages/NotesPage";
import { ScheduleGeneratorPage } from "./pages/ScheduleGeneratorPage";
import { ScheduleHistoryPage } from "./pages/ScheduleHistoryPage";
import { TasksPage } from "./pages/TasksPage";

function SigningMessage({ message }: { message: string }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[var(--tan-100)] text-lg text-[var(--coolgrey-600)]">
            {message}
        </div>
    );
}

function AuthenticatedHome({ displayName }: { displayName: string }) {
    const navigate = useNavigate();
    const actions = [
        { path: "/emails", label: "Email Management" },
        { path: "/schedule", label: "Schedule Generator" },
        { path: "/tasks", label: "Tasks" },
        { path: "/notes", label: "Notes" },
        { path: "/legalese-summarizer", label: "Legalese Summarizer" },
        { path: "/calendar", label: "Calendar" },
    ];;/

    return (
        <section className="flex flex-col gap-6 rounded-3xl border border-[var(--bluegrey-200)] bg-white p-8 text-left shadow-sm">
            <div>
                <h1 className="text-2xl font-semibold text-[var(--blue-700)]">Why hello there, {displayName}.</h1>
                <p className="mt-2 text-sm text-[var(--coolgrey-500)]">How can I help your day run more smoothly today?</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {actions.map(({ path, label }) => (
                    <button
                        key={path}
                        type="button"
                        onClick={() => navigate(path)}
                        className="inline-flex items-center justify-center rounded-xl bg-[var(--blue-500)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--blue-400)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue-300)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                        {label}
                    </button>
                ))}
            </div>
        </section>
    );
}

function App() {
    const auth = useAppAuth();

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
                        <Route path="/schedule" element={<ScheduleGeneratorPage />} />
                        <Route path="/schedule-history" element={<ScheduleHistoryPage />} />
                        <Route path="/tasks" element={<TasksPage />} />
                        <Route path="/notes" element={<NotesPage />} />
                        <Route path="/legalese-summarizer" element={<LegaleseSummarizerPage />} />
                        <Route path="/calendar" element={<CalendarPage />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}

export default App;