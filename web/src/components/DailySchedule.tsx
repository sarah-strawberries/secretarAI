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
    <article className="daily-schedule-card">
      <header className="space-y-1">
        <h3 className="daily-schedule-title">{dateLabel}</h3>
        <p className="daily-schedule-year">{year}</p>
      </header>
      {isCheckbox ? (
        <ul className="daily-schedule-list-checkbox">
          {items.map((item) => (
            <li key={item.id} className="daily-schedule-item-checkbox">
              <input type="checkbox" className="daily-schedule-checkbox" aria-hidden="true" disabled />
              <div>
                <p className="daily-schedule-text"><span className="font-semibold">{item.startTime}</span> - {item.label}</p>
                {item.description ? <p className="daily-schedule-description">{item.description}</p> : null}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="daily-schedule-list-classic">
          {items.map((item) => (
            <li key={item.id}>
              <p className="daily-schedule-text"><span className="font-semibold">{item.startTime}</span> - {item.label}</p>
              {item.description ? <p className="daily-schedule-description">{item.description}</p> : null}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
