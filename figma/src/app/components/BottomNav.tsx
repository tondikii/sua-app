import { Home, Search, Heart, User, Plus } from 'lucide-react';
import { C, FONT } from './colors';

export type NavTab = 'home' | 'search' | 'wishlist' | 'profile';

interface BottomNavProps {
  active?: NavTab;
}

export function BottomNav({ active = 'home' }: BottomNavProps) {
  const tabs = [
    { id: 'home' as NavTab, icon: Home, label: 'Beranda' },
    { id: 'search' as NavTab, icon: Search, label: 'Cari' },
  ];
  const tabsRight = [
    { id: 'wishlist' as NavTab, icon: Heart, label: 'Wishlist' },
    { id: 'profile' as NavTab, icon: User, label: 'Profil' },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 88,
        backgroundColor: C.white,
        borderTop: `1px solid ${C.border}`,
        display: 'flex',
        alignItems: 'center',
        paddingBottom: 20,
        boxShadow: '0 -8px 32px rgba(26,26,46,0.06)',
        zIndex: 100,
        fontFamily: FONT,
      }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.id;
        return (
          <div
            key={tab.id}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              cursor: 'pointer',
            }}
          >
            <Icon size={22} color={isActive ? C.coral : C.muted} strokeWidth={isActive ? 2.5 : 2} />
            <span
              style={{
                fontSize: 10,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? C.coral : C.muted,
              }}
            >
              {tab.label}
            </span>
          </div>
        );
      })}

      {/* Central FAB */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <button
          style={{
            width: 54,
            height: 54,
            backgroundColor: C.coral,
            borderRadius: 18,
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: `0 8px 24px ${C.coral}55`,
            marginTop: -28,
          }}
        >
          <Plus size={24} color="white" strokeWidth={2.5} />
        </button>
      </div>

      {tabsRight.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.id;
        return (
          <div
            key={tab.id}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              cursor: 'pointer',
            }}
          >
            <Icon size={22} color={isActive ? C.coral : C.muted} strokeWidth={isActive ? 2.5 : 2} />
            <span
              style={{
                fontSize: 10,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? C.coral : C.muted,
              }}
            >
              {tab.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
