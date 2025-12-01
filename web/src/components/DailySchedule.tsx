type DailyScheduleItem = {
  id: string;
  startTime: string;
  label: string;
  description?: string;
};

type DailyScheduleProps = {
  dateLabel: string;
  year: string;
  items: DailyScheduleItem[];
  bulletStyle?: "classic" | "checkbox";
};

export function DailySchedule({ dateLabel, year, items, bulletStyle = "classic" }: DailyScheduleProps) {
  const isCheckbox = bulletStyle === "checkbox";

  return (
    <article className="flex w-80 flex-col gap-4 rounded-2xl border border-[var(--bluegrey-200)] bg-white p-6 shadow-sm">
      <header className="space-y-1">
        <h3 className="text-lg font-semibold text-[var(--blue-700)]">{dateLabel}</h3>
        <p className="text-sm text-[var(--coolgrey-500)]">{year}</p>
      </header>
      {isCheckbox ? (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="flex items-start gap-3 text-sm text-[var(--coolgrey-600)]">
              <input type="checkbox" className="mt-1 h-4 w-4 rounded border-[var(--bluegrey-300)] text-[var(--blue-500)] focus:ring-[var(--blue-400)]" aria-hidden="true" disabled />
              <div>
                <p className="text-[var(--coolgrey-700)]"><span className="font-semibold">{item.startTime}</span> - {item.label}</p>
                {item.description ? <p className="text-xs text-[var(--coolgrey-500)]">{item.description}</p> : null}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="list-disc space-y-3 pl-6 text-sm text-[var(--coolgrey-600)]">
          {items.map((item) => (
            <li key={item.id}>
              <p className="text-[var(--coolgrey-700)]"><span className="font-semibold">{item.startTime}</span> - {item.label}</p>
              {item.description ? <p className="text-xs text-[var(--coolgrey-500)]">{item.description}</p> : null}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
