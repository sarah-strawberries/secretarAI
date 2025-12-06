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
        <div className="signing-message-container">
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
    ];

    return (
        <section className="home-card">
            <div>
                <h1 className="home-title">Why hello there, {displayName}.</h1>
                <p className="home-subtitle">How can I help your day run more smoothly?</p>
            </div>
            <div className="home-action-grid">
                {actions.map(({ path, label }) => (
                    <button
                        key={path}
                        type="button"
                        onClick={() => navigate(path)}
                        className="home-action-button"
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
            <div className="app-container">
                <GlobalHeader />
                <div className="login-page-content">
                    <h1 className="login-title">secretarAI</h1>
                    <button
                        type="button"
                        onClick={() => void auth.signinRedirect()}
                        className="login-button"
                    >
                        Log in
                    </button>
                </div>
            </div>
        );
    }

    const displayName = auth.user?.profile.name ?? "there";

    return (
        <div className="app-container">
            <GlobalHeader />
            <div className="app-content">
                <header className="app-header">
                    <div>
                        <p className="app-header-user-label">Signed in as</p>
                        <p className="app-header-user-name">{displayName}</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => void auth.signoutRedirect()}
                        className="app-logout-button"
                    >
                        Log out
                    </button>
                </header>
                <main className="app-main">
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