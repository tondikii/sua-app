import { CalendarDays, Settings2, Trash2, Users } from 'lucide-react';
import { C, FONT } from '../colors';

export type TripMenuItemId = 'members' | 'calendar' | 'edit' | 'delete';

const MENU_ITEMS: { id: TripMenuItemId; label: string; icon: typeof Users; color: string }[] = [
  { id: 'members', label: 'Daftar Anggota', icon: Users, color: C.teal },
  { id: 'calendar', label: 'Tambah ke Google Calendar', icon: CalendarDays, color: C.teal },
  { id: 'edit', label: 'Edit Info Perjalanan', icon: Settings2, color: C.charcoal },
  { id: 'delete', label: 'Hapus Perjalanan', icon: Trash2, color: C.danger },
];

type TripDetailMenuSheetProps = {
  highlightId?: TripMenuItemId;
};

export function TripDetailMenuSheet({ highlightId }: TripDetailMenuSheetProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 52,
        right: 16,
        width: 232,
        backgroundColor: C.white,
        borderRadius: 16,
        padding: '6px 0',
        zIndex: 15,
        boxShadow: `0 12px 40px ${C.shadow}, 0 0 0 1px ${C.border}`,
        fontFamily: FONT,
      }}
    >
      {MENU_ITEMS.map((item) => {
        const Icon = item.icon;
        const highlighted = item.id === highlightId;
        return (
          <button
            key={item.id}
            type="button"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 16px',
              backgroundColor: highlighted ? C.tealLight : 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontFamily: FONT,
              textAlign: 'left',
            }}
          >
            <Icon size={16} color={item.color} strokeWidth={2.5} />
            <span style={{ fontSize: 13, fontWeight: highlighted ? 700 : 600, color: item.color }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
