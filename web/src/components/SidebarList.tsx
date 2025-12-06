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
        <section className="sidebar-list-section">
            <h2 className="sidebar-list-title">{title}</h2>
            <div className="sidebar-list-container">
                {items.map((item) => {
                    const isSelected = item.id === selectedId;
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => onSelect(item.id)}
                            className={`sidebar-list-item ${
                                isSelected
                                    ? "sidebar-list-item-selected"
                                    : "sidebar-list-item-default"
                            }`}
                        >
                            <p className="sidebar-list-item-title">{item.title}</p>
                            {item.subtitle ? <p className="sidebar-list-item-subtitle">{item.subtitle}</p> : null}
                            {item.description ? <p className="sidebar-list-item-description">{item.description}</p> : null}
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
