import { useNavigate } from "react-router-dom";

export function NotesPage() {
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
            <h1 className="page-title">Notes</h1>
            <div className="page-placeholder">
                This page coming soon!
            </div>
        </div>
    );
}
