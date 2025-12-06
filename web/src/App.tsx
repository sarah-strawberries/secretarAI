import { Navigate, Route, Routes, useNavigate, useLocation } from "react-router-dom";
// Using local SVGs in public/icons instead of react-bootstrap-icons components
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
        { path: "/emails", label: "Email Management", icon: "/icons/envelope-fill.svg" },
        { path: "/tasks", label: "Tasks", icon: "/icons/check-square-fill.svg" },
        { path: "/schedule", label: "Schedule Generator", icon: "/icons/clock-fill.svg" },
        { path: "/calendar", label: "Calendar", icon: "/icons/calendar-date-fill.svg" },
        { path: "/legalese-summarizer", label: "Legalese Summarizer", icon: "/icons/file-earmark-text-fill.svg" },
        { path: "/notes", label: "Notes", icon: "/icons/journal-text.svg" },
    ];

    return (
        <section className="home-card">
            <div>
                <h1 className="home-title">Why hello there, {displayName}.</h1>
                <p className="home-subtitle">How can I help your day run more smoothly?</p>
            </div>
            <div className="home-action-grid">
                {actions.map(({ path, label, icon }) => (
                    <button
                        key={path}
                        type="button"
                        onClick={() => navigate(path)}
                        className="home-action-button flex flex-col items-center justify-center gap-2">
                            <img src={icon} alt={`${label} icon`} className="h-8 w-8" />
                            {label}
                    </button>
                ))}
            </div>
        </section>
    );
}

function App() {
    const auth = useAppAuth();
    const navigate = useNavigate();
    const location = useLocation();

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

    const isLegalesePage = location.pathname === "/legalese-summarizer";

    if (!auth.isAuthenticated && !isLegalesePage) {
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
                    <button
                        type="button"
                        onClick={() => navigate("/legalese-summarizer")}
                        className="history-back-button"
                    >
                        I don't want to log in, but I'd like to use the Legalese Summarizer
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
                        {auth.isAuthenticated && (
                            <>
                                <p className="app-header-user-label">Signed in as</p>
                                <p className="app-header-user-name">{displayName}</p>
                            </>
                        )}
                    </div>
                    {auth.isAuthenticated ? (
                        <button
                            type="button"
                            onClick={() => void auth.signoutRedirect()}
                            className="app-logout-button"
                        >
                            Log out
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => void auth.signinRedirect()}
                            className="app-logout-button"
                        >
                            Log in
                        </button>
                    )}
                </header>
                <main className="app-main">
                    <Routes>
                        <Route path="/legalese-summarizer" element={<LegaleseSummarizerPage />} />
                        {auth.isAuthenticated && (
                            <>
                                <Route path="/" element={<AuthenticatedHome displayName={displayName} />} />
                                <Route path="/emails" element={<EmailManagementPage />} />
                                <Route path="/schedule" element={<ScheduleGeneratorPage />} />
                                <Route path="/schedule-history" element={<ScheduleHistoryPage />} />
                                <Route path="/tasks" element={<TasksPage />} />
                                <Route path="/notes" element={<NotesPage />} />
                                <Route path="/calendar" element={<CalendarPage />} />
                            </>
                        )}
                        <Route path="*" element={<Navigate to={auth.isAuthenticated ? "/" : "/legalese-summarizer"} replace />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}

export default App;