import { useNavigate } from "react-router-dom";
import ChatComponent from "../components/ChatComponent";
import { JobContext } from "../types/JobContext";

export function LegaleseSummarizerPage() {
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
            <h1 className="page-title">Legalese Summarizer</h1>
            <div className="mt-8 max-w-4xl mx-auto">
                <ChatComponent jobContext={JobContext.LegaleseSummarization} />
            </div>
        </div>
    );
}
