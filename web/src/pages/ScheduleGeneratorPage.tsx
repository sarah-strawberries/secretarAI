import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarList, type SidebarListItem } from "../components/SidebarList";

type CalendarItem = {
  id: string;
  name: string;
  startTime: string;
  description?: string;
};

const CALENDAR_ITEMS: CalendarItem[] = [
  {
    id: "morning-checkin",
    name: "Morning Check-in",
    startTime: "2025-11-30T09:00:00Z",
    description: "Outline priorities for the day",
  },
  {
    id: "client-sync",
    name: "Client Sync",
    startTime: "2025-11-30T11:30:00Z",
    description: "Review status updates",
  },
  {
    id: "deep-work",
    name: "Deep Work Block",
    startTime: "2025-11-30T14:00:00Z",
  },
];

function formatStartTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function ScheduleGeneratorPage() {
  const [selectedItemId, setSelectedItemId] = useState<string>(CALENDAR_ITEMS[0]?.id ?? "");
  const [bulletStyle, setBulletStyle] = useState<"checkbox" | "classic">("checkbox");
  const [autoIncludeTodos, setAutoIncludeTodos] = useState<boolean>(true);
  const navigate = useNavigate();

  const listItems = useMemo<SidebarListItem[]>(
    () =>
      CALENDAR_ITEMS.map((item) => ({
        id: item.id,
        title: item.name,
        subtitle: formatStartTime(item.startTime),
        description: item.description,
      })),
    []
  );

  return (
    <div className="page-container-full">
      <h1 className="page-title">Schedule Generator</h1>
      <div className="schedule-generator-layout">
        <SidebarList title="Today" items={listItems} selectedId={selectedItemId} onSelect={setSelectedItemId} />
        <section className="schedule-form-section">
          <header className="space-y-1">
            <p className="email-header-label">Schedule Builder</p>
            <h2 className="email-subject">Generate a Schedule</h2>
          </header>
          <form className="flex flex-col gap-6" aria-label="Generate a Schedule">
            <div className="schedule-fieldset">
              <fieldset className="space-y-3">
                <legend className="schedule-legend">Choose a bullet style for your daily tasks</legend>
                <div className="schedule-radio-group">
                  <label className="schedule-radio-label">
                    <input
                      type="radio"
                      name="bulletStyle"
                      value="checkbox"
                      checked={bulletStyle === "checkbox"}
                      onChange={() => setBulletStyle("checkbox")}
                      className="schedule-radio-input"
                    />
                    Checkbox
                  </label>
                  <label className="schedule-radio-label">
                    <input
                      type="radio"
                      name="bulletStyle"
                      value="classic"
                      checked={bulletStyle === "classic"}
                      onChange={() => setBulletStyle("classic")}
                      className="schedule-radio-input"
                    />
                    Classic
                  </label>
                </div>
              </fieldset>
              <label className="schedule-checkbox-label">
                <input
                  type="checkbox"
                  checked={autoIncludeTodos}
                  onChange={(event) => setAutoIncludeTodos(event.target.checked)}
                  className="schedule-checkbox-input"
                />
                Auto-include to-dos?
              </label>
              <button
                type="button"
                className="mt-6 schedule-secondary-button"
              >
                Generate Schedule (this feature coming soon!)
              </button>
            </div>
            <div className="schedule-fieldset">
              <button
                type="button"
                className="schedule-secondary-button"
                onClick={() => navigate("/schedule-history")}
              >
                View Past Schedules
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
