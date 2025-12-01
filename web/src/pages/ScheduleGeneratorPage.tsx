import { useMemo, useState } from "react";
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
    <div className="flex min-h-[28rem] flex-1 flex-col gap-4">
      <h1 className="text-2xl font-semibold text-[var(--blue-700)]">Schedule Generator</h1>
      <div className="flex flex-1 flex-col gap-4 rounded-2xl border border-[var(--bluegrey-200)] bg-[var(--tan-100)] p-4 shadow-sm sm:flex-row">
        <SidebarList title="Today" items={listItems} selectedId={selectedItemId} onSelect={setSelectedItemId} />
        <section className="flex flex-1 flex-col gap-6 rounded-2xl border border-[var(--bluegrey-200)] bg-[var(--blue-100)] p-6">
          <header className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--coolgrey-500)]">Schedule Builder</p>
            <h2 className="text-xl font-semibold text-[var(--blue-700)]">Generate a Schedule</h2>
          </header>
          <form className="flex flex-col gap-6" aria-label="Generate a Schedule">
            <div className="rounded-2xl border border-[var(--bluegrey-200)] bg-[var(--coolgrey-100)] p-4">
              <fieldset className="space-y-3">
                <legend className="text-sm font-medium text-[var(--coolgrey-600)]">Choose a bullet style for your daily tasks</legend>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex h-full items-center gap-3 rounded-xl border border-transparent bg-white px-4 py-3 text-sm font-semibold text-[var(--blue-600)] shadow-sm transition hover:border-[var(--blue-300)] hover:bg-[var(--blue-300)] hover:text-[var(--blue-700)] focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--blue-300)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--coolgrey-100)]">
                    <input
                      type="radio"
                      name="bulletStyle"
                      value="checkbox"
                      checked={bulletStyle === "checkbox"}
                      onChange={() => setBulletStyle("checkbox")}
                      className="h-4 w-4 border-[var(--bluegrey-300)] text-[var(--blue-500)] focus:ring-[var(--blue-400)]"
                    />
                    Checkbox
                  </label>
                  <label className="flex h-full items-center gap-3 rounded-xl border border-transparent bg-white px-4 py-3 text-sm font-semibold text-[var(--blue-600)] shadow-sm transition hover:border-[var(--blue-300)] hover:bg-[var(--blue-300)] hover:text-[var(--blue-700)] focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--blue-300)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--coolgrey-100)]">
                    <input
                      type="radio"
                      name="bulletStyle"
                      value="classic"
                      checked={bulletStyle === "classic"}
                      onChange={() => setBulletStyle("classic")}
                      className="h-4 w-4 border-[var(--bluegrey-300)] text-[var(--blue-500)] focus:ring-[var(--blue-400)]"
                    />
                    Classic
                  </label>
                </div>
              </fieldset>
              <label className="mt-6 flex items-center gap-3 text-sm text-[var(--coolgrey-600)]">
                <input
                  type="checkbox"
                  checked={autoIncludeTodos}
                  onChange={(event) => setAutoIncludeTodos(event.target.checked)}
                  className="h-4 w-4 rounded border-[var(--bluegrey-300)] text-[var(--blue-500)] focus:ring-[var(--blue-400)]"
                />
                Auto-include to-dos?
              </label>
              <button
                type="button"
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl border border-transparent bg-white px-5 py-3 text-sm font-semibold text-[var(--blue-600)] shadow-sm transition hover:border-[var(--blue-300)] hover:bg-[var(--blue-300)] hover:text-[var(--blue-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue-300)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--coolgrey-100)]"
              >
                Generate Schedule
              </button>
            </div>
            <div className="rounded-2xl border border-[var(--bluegrey-200)] bg-[var(--coolgrey-100)] p-4">
              <button
                type="button"
                className="inline-flex w-full items-center justify-center rounded-xl border border-transparent bg-white px-5 py-3 text-sm font-semibold text-[var(--blue-600)] shadow-sm transition hover:border-[var(--blue-300)] hover:bg-[var(--blue-300)] hover:text-[var(--blue-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue-300)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--coolgrey-100)]"
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
