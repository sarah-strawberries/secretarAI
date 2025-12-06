import { useNavigate } from "react-router-dom";

export function TasksPage() {
    const navigate = useNavigate();
    return (
        <div className="page-container">
            <button
                type="button"
                className="history-back-button"
                onClick={() => navigate("/")}
            >
                &lt; Back
            </button>
            <h1 className="page-title">Tasks</h1>
            <div className="page-placeholder">
                This page coming soon!
            </div>
        </div>
    );
}
