import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DailySchedule } from "../components/DailySchedule";

type HistorySchedule = {
  id: string;
  dateLabel: string;
  year: string;
  bulletStyle: "classic" | "checkbox";
  items: {
    id: string;
    startTime: string;
    label: string;
    description?: string;
  }[];
};

const SCHEDULE_HISTORY: HistorySchedule[] = [
  {
    id: "2025-02-12",
    dateLabel: "Monday, Feb. 12th",
    year: "2025",
    bulletStyle: "classic",
    items: [
      { id: "plan", startTime: "8:00 AM", label: "Plan weekly sprint", description: "Outline roadmap priorities" },
      { id: "buddy-sync", startTime: "10:30 AM", label: "Mentor sync" },
      { id: "wrap-up", startTime: "4:30 PM", label: "Wrap up tasks", description: "Prep notes for tomorrow" },
    ],
  },
  {
    id: "2025-02-13",
    dateLabel: "Tuesday, Feb. 13th",
    year: "2025",
    bulletStyle: "checkbox",
    items: [
      { id: "standup", startTime: "9:00 AM", label: "Team stand-up" },
      { id: "draft", startTime: "11:00 AM", label: "Draft client summary", description: "Focus on key wins" },
      { id: "follow-up", startTime: "3:30 PM", label: "Send follow-up emails" },
    ],
  },
  {
    id: "2025-02-14",
    dateLabel: "Wednesday, Feb. 14th",
    year: "2025",
    bulletStyle: "classic",
    items: [
      { id: "research", startTime: "8:30 AM", label: "Research automation ideas" },
      { id: "lunch", startTime: "12:00 PM", label: "Lunch with partner team" },
      { id: "retro", startTime: "4:00 PM", label: "Sprint retro", description: "Gather action items" },
    ],
  },
  {
    id: "2025-02-15",
    dateLabel: "Thursday, Feb. 15th",
    year: "2025",
    bulletStyle: "checkbox",
    items: [
      { id: "morning-breakout", startTime: "7:30 AM", label: "Breakfast briefing", description: "Review client insights" },
      { id: "design-review", startTime: "10:00 AM", label: "Design review session" },
      { id: "product-sync", startTime: "1:00 PM", label: "Product sync", description: "Align on roadmap" },
      { id: "training", startTime: "3:00 PM", label: "AI tooling training" },
      { id: "closeout", startTime: "5:30 PM", label: "Close out tasks", description: "Document follow-ups" },
    ],
  },
  {
    id: "2025-02-16",
    dateLabel: "Friday, Feb. 16th",
    year: "2025",
    bulletStyle: "classic",
    items: [
      { id: "journaling", startTime: "7:00 AM", label: "Morning journaling" },
      { id: "ops-review", startTime: "9:15 AM", label: "Ops review" },
      { id: "client-demo", startTime: "11:30 AM", label: "Client demo", description: "Showcase new automation" },
      { id: "team-lunch", startTime: "1:00 PM", label: "Team lunch" },
      { id: "week-wrap", startTime: "4:45 PM", label: "Weekly wrap-up", description: "Send summary to leadership" },
    ],
  },
];

export function ScheduleHistoryPage() {
  const schedules = useMemo(() => SCHEDULE_HISTORY, []);
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[28rem] flex-1 flex-col gap-4">
      <button
        type="button"
        className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[var(--blue-600)] transition hover:text-[var(--blue-500)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue-300)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--tan-100)]"
        onClick={() => navigate("/schedule")}
      >
        &lt; Back
      </button>
      <h1 className="text-2xl font-semibold text-[var(--blue-700)]">Schedule History</h1>
      <section className="flex flex-1 flex-col rounded-2xl border border-[var(--bluegrey-200)] bg-[var(--tan-100)] p-4 shadow-sm">
        <div className="flex-1 min-h-0">
          <div className="h-full overflow-x-auto overflow-y-hidden pr-2">
            <div className="grid h-full grid-flow-col auto-rows-max content-start gap-4">
            {schedules.map((schedule) => (
              <DailySchedule
                key={schedule.id}
                dateLabel={schedule.dateLabel}
                year={schedule.year}
                bulletStyle={schedule.bulletStyle}
                items={schedule.items}
              />
            ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
