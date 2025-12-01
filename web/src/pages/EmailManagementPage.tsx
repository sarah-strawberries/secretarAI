import { useMemo, useState } from "react";

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

  if (!selectedEmail) {
    return (
      <div className="flex min-h-[24rem] items-center justify-center rounded-xl border border-[var(--bluegrey-200)] bg-[var(--tan-200)] p-6 text-[var(--coolgrey-600)]">
        No emails to display.
      </div>
    );
  }

  return (
    <div className="flex min-h-[28rem] flex-1 flex-col gap-4">
      <h1 className="text-2xl font-semibold text-[var(--blue-700)]">Email Management</h1>
      <div className="flex flex-1 flex-col gap-4 rounded-2xl border border-[var(--bluegrey-200)] bg-[var(--tan-100)] p-4 shadow-sm sm:flex-row">
        <section className="w-full shrink-0 space-y-3 sm:w-72">
          <h2 className="text-sm font-medium uppercase tracking-wide text-[var(--coolgrey-500)]">Inbox</h2>
          <div className="space-y-2">
            {EMAILS.map((email) => {
              const isSelected = email.id === selectedEmail.id;
              return (
                <button
                  key={email.id}
                  type="button"
                  onClick={() => setSelectedEmailId(email.id)}
                  className={`w-full rounded-xl border px-4 py-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue-400)] focus-visible:ring-offset-2 ${
                    isSelected
                      ? "border-[var(--blue-400)] bg-[var(--blue-100)] text-[var(--blue-700)]"
                      : "border-transparent bg-[var(--tan-200)] text-[var(--coolgrey-600)] hover:border-[var(--bluegrey-300)] hover:bg-[var(--bluegrey-100)]"
                  }`}
                >
                  <p className="text-sm font-semibold leading-snug">{email.subject}</p>
                  <p className="mt-1 text-xs text-[var(--coolgrey-400)]">{formatDisplayDate(email.date)}</p>
                </button>
              );
            })}
          </div>
        </section>
        <section className="flex flex-1 flex-col gap-3 rounded-2xl border border-[var(--bluegrey-200)] bg-[var(--bluegrey-100)] p-5">
          <header className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--coolgrey-500)]">Subject</p>
            <h2 className="text-xl font-semibold text-[var(--blue-700)]">{selectedEmail.subject}</h2>
          </header>
          <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--coolgrey-500)]">
            <span>From {selectedEmail.sender}</span>
            <span className="hidden h-2 w-2 rounded-full bg-[var(--blue-400)] sm:inline-flex" aria-hidden="true" />
            <span>{formatDisplayDate(selectedEmail.date)}</span>
          </div>
          <article className="mt-2 flex-1 overflow-auto rounded-xl bg-white p-5 text-sm leading-relaxed text-[var(--coolgrey-700)] shadow-inner">
            <pre className="whitespace-pre-wrap font-sans">{selectedEmail.body}</pre>
          </article>
        </section>
      </div>
    </div>
  );
}
