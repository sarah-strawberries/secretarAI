export type SidebarListItem = {
    id: string;
    title: string;
    subtitle?: string;
    description?: string;
};

type SidebarListProps = {
    title: string;
    items: SidebarListItem[];
    selectedId?: string;
    onSelect: (id: string) => void;
};

export function SidebarList({ title, items, selectedId, onSelect }: SidebarListProps) {
    return (
        <section className="w-full shrink-0 space-y-3 sm:w-72">
            <h2 className="text-sm font-medium uppercase tracking-wide text-[var(--coolgrey-500)]">{title}</h2>
            <div className="space-y-2">
                {items.map((item) => {
                    const isSelected = item.id === selectedId;
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => onSelect(item.id)}
                            className={`w-full rounded-xl border px-4 py-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue-400)] focus-visible:ring-offset-2 ${
                                isSelected
                                    ? "border-[var(--blue-400)] bg-[var(--blue-100)] text-[var(--blue-700)]"
                                    : "border-transparent bg-[var(--tan-200)] text-[var(--coolgrey-600)] hover:border-[var(--bluegrey-300)] hover:bg-[var(--bluegrey-100)]"
                            }`}
                        >
                            <p className="text-sm font-semibold leading-snug">{item.title}</p>
                            {item.subtitle ? <p className="mt-1 text-xs text-[var(--coolgrey-400)]">{item.subtitle}</p> : null}
                            {item.description ? <p className="mt-1 text-xs text-[var(--coolgrey-500)]">{item.description}</p> : null}
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
