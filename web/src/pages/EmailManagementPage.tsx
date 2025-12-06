import { useMemo, useState } from "react";
import { SidebarList, type SidebarListItem } from "../components/SidebarList";

type Email = {
  id: string;
  subject: string;
  sender: string;
  date: string;
  body: string;
};

const EMAILS: Email[] = [
  {
    id: "welcome",
    subject: "Welcome to secretarAI",
    sender: "support@secretarai.com",
    date: "2025-11-12T09:15:00Z",
    body: "Hi there!\n\nThanks for trying out secretarAI. This is a quick note to let you know you're all set. If you have questions, just reply to this message.",
  },
  {
    id: "reminder",
    subject: "Daily summary ready",
    sender: "alerts@secretarai.com",
    date: "2025-11-13T17:45:00Z",
    body: "Hello again,\n\nYour daily summary is ready to review. Click the summarize button in your dashboard whenever you have a minute.",
  },
  {
    id: "feedback",
    subject: "We'd love your feedback",
    sender: "team@secretarai.com",
    date: "2025-11-20T11:30:00Z",
    body: "Hi,\n\nWe're building out the next batch of features and would love to hear how the beta is going for you. Reply with any thoughts—big or small!",
  },
];

function formatDisplayDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function EmailManagementPage() {
  const [selectedEmailId, setSelectedEmailId] = useState<string>(EMAILS[0]?.id ?? "");

  const selectedEmail = useMemo(() => EMAILS.find((email) => email.id === selectedEmailId) ?? EMAILS[0], [selectedEmailId]);
  const emailListItems = useMemo<SidebarListItem[]>(
    () =>
      EMAILS.map((email) => ({
        id: email.id,
        title: email.subject,
        subtitle: formatDisplayDate(email.date),
      })),
    []
  );

  if (!selectedEmail) {
    return (
      <div className="email-empty-state">
        No emails to display.
      </div>
    );
  }

  return (
    <div className="page-container-full">
      <h1 className="page-title">Email Management</h1>
      <div className="email-layout">
        <SidebarList title="Inbox" items={emailListItems} selectedId={selectedEmail.id} onSelect={setSelectedEmailId} />
        <section className="email-detail-section">
          <header className="space-y-1">
            <p className="email-header-label">Subject</p>
            <h2 className="email-subject">{selectedEmail.subject}</h2>
          </header>
          <div className="email-meta">
            <span>From {selectedEmail.sender}</span>
            <span className="email-meta-dot" aria-hidden="true" />
            <span>{formatDisplayDate(selectedEmail.date)}</span>
          </div>
          <article className="email-body">
            <pre className="whitespace-pre-wrap font-sans">{selectedEmail.body}</pre>
          </article>
        </section>
      </div>
    </div>
  );
}
