import type { ReactNode } from 'react';
import {
  Search,
  Plus,
  Navigation,
  Heart,
  MapPin,
  Link2,
  MoreHorizontal,
  Pencil,
  Trash2,
  Compass,
  AlertCircle,
} from 'lucide-react';
import { C, FONT } from '../colors';
import { BottomNav } from '../BottomNav';
import { BottomSheet, SheetPrimaryButton } from '../ui/BottomSheet';
import { ConfirmDialogModal, DESTRUCTIVE } from '../ui/ConfirmDialogModal';
import { SearchEmptyState } from '../ui/SearchEmptyState';
import { TripTags } from '../ui/TripTags';
import { FormField, FormInputBox } from '../ui/FormField';
import { ERROR_RED, TRIP_DRAFT, TRIP_DATE_CANDIDATES } from './CreateTripParts';
import {
  ActivityMapsLinkField,
  ActivityRefLinksField,
  type ActivityRefLink,
} from './ActivityParts';
import type { ItineraryDay } from './ItineraryParts';
import { TRIP_IMAGES } from '../tripImages';

// ── Types & demo data (selaras §3 Beranda · §5 Lombok · §6 Itinerary) ──

export type WishlistPriority = 'Tinggi' | 'Menengah' | 'Rendah';

export type WishlistItem = {
  id: number;
  name: string;
  location: string;
  image: string;
  priority: WishlistPriority;
  tags: string[];
  link?: string;
  notes?: string;
};

/** Destinasi impian — lokasi & tag konsisten dengan Lombok Weekend Escape (Screen5, §6) */
export const WISHLIST_ITEMS: WishlistItem[] = [
  {
    id: 1,
    name: 'Pantai Tanjung Aan',
    location: 'Lombok Timur, NTB',
    image: TRIP_IMAGES.giliBeach,
    priority: 'Tinggi',
    tags: ['#Pantai', '#Alam'],
    link: 'https://maps.app.goo.gl/tanjung-aan-lombok',
    notes: 'Pasir putih halus. Datang sore untuk sunset di Bukit Merese sekalian.',
  },
  {
    id: 2,
    name: 'Gili Trawangan',
    location: 'Lombok Utara, NTB',
    image: TRIP_IMAGES.giliBeach,
    priority: 'Tinggi',
    tags: ['#Pantai', '#Snorkeling'],
    link: 'https://maps.app.goo.gl/gili-trawangan',
    notes: 'Snorkeling di turtle point. Sewa sepeda untuk keliling pulau.',
  },
  {
    id: 3,
    name: 'Bukit Merese',
    location: 'Lombok Tengah, NTB',
    image: TRIP_IMAGES.lombok,
    priority: 'Menengah',
    tags: ['#Alam', '#Sunset'],
    notes: 'Spot sunset terbaik — sudah ada di itinerary Hari 1 (§6).',
  },
  {
    id: 4,
    name: 'Warung Plecing Kangkung',
    location: 'Mataram, NTB',
    image: TRIP_IMAGES.baliTerraces,
    priority: 'Rendah',
    tags: ['#Kuliner'],
  },
];

export const WISHLIST_SAMPLE = WISHLIST_ITEMS[0];

/** Form demo — aktivitas terisi (selaras ActivityFormSheet) */
export const WISHLIST_FORM_FILLED = {
  title: WISHLIST_SAMPLE.name,
  startTime: '13:00',
  endTime: '16:00',
  hasMapsLink: true,
  mapsPlaceName: WISHLIST_SAMPLE.name,
  refLinks: [{ id: 1, url: WISHLIST_SAMPLE.link ?? '', label: 'Panduan Pantai Tanjung Aan' }] as ActivityRefLink[],
  selectedPriority: 'high',
};

/** Subtitle trip — selaras Screen118 (tanggal pasti · sepanjang hari) */
export const WISHLIST_TRIP_SUBTITLE = `${TRIP_DATE_CANDIDATES[0].range} · Sepanjang hari`;

/** Itinerary hari 1 — 1 aktivitas hasil konversi wishlist (Screen120) */
export const WISHLIST_IMPORTED_DAY: ItineraryDay = {
  id: 1,
  dateLabel: `${TRIP_DRAFT.dateStart} Juni 2026`,
  dayLabel: 'Hari 1',
  windowStart: '13:00',
  windowEnd: '16:00',
  items: [
    {
      id: 1,
      startTime: '13:00',
      endTime: '16:00',
      title: WISHLIST_SAMPLE.name,
      location: WISHLIST_SAMPLE.location,
      kind: 'destination',
      gmapsThumbUrl: WISHLIST_SAMPLE.image,
    },
  ],
};

export const TRIP_COUNTS_FROM_WISHLIST = {
  itinerary: 1,
  voting: 2,
  chat: 0,
  media: 0,
};

/** Prefill buat perjalanan — nama & tag sama dengan trip Mendatang di Beranda (Screen5) */
export const WISHLIST_TO_TRIP = {
  name: 'Lombok Weekend Escape',
  tags: ['#Pantai', '#Alam', '#Snorkeling', '#Sunset'] as string[],
  sourceWishlist: WISHLIST_SAMPLE.name,
};

export type WishlistSortTab = 'semua' | 'tinggi' | 'menengah' | 'rendah';

export const WISHLIST_SORT_COUNTS: Record<WishlistSortTab, number> = {
  semua: WISHLIST_ITEMS.length,
  tinggi: WISHLIST_ITEMS.filter((i) => i.priority === 'Tinggi').length,
  menengah: WISHLIST_ITEMS.filter((i) => i.priority === 'Menengah').length,
  rendah: WISHLIST_ITEMS.filter((i) => i.priority === 'Rendah').length,
};

export const WISHLIST_FILTER_TAGS = ['#Pantai', '#Alam', '#Kuliner', '#Snorkeling', '#Sunset'] as const;

export const WISHLIST_PRIORITIES: { label: WishlistPriority; value: string; bg: string; color: string }[] = [
  { label: 'Tinggi', value: 'high', bg: C.coralLight, color: C.coral },
  { label: 'Menengah', value: 'mid', bg: '#FFF8ED', color: '#F59E0B' },
  { label: 'Rendah', value: 'low', bg: C.tealLight, color: C.teal },
];

const SORT_TAB_LABELS: { id: WishlistSortTab; label: string }[] = [
  { id: 'semua', label: 'Semua' },
  { id: 'tinggi', label: 'Tinggi' },
  { id: 'menengah', label: 'Menengah' },
  { id: 'rendah', label: 'Rendah' },
];

export function priorityStyle(priority: WishlistPriority) {
  if (priority === 'Tinggi') return { bg: C.coralLight, color: C.coral };
  if (priority === 'Menengah') return { bg: '#FFF8ED', color: '#F59E0B' };
  return { bg: C.tealLight, color: C.teal };
}

export function wishlistSortCounts(items: WishlistItem[]): Record<WishlistSortTab, number> {
  return {
    semua: items.length,
    tinggi: items.filter((i) => i.priority === 'Tinggi').length,
    menengah: items.filter((i) => i.priority === 'Menengah').length,
    rendah: items.filter((i) => i.priority === 'Rendah').length,
  };
}

// ── Page shell (selaras HomePageShell · HomeHeader · HomeTabs) ──

type WishlistPageShellProps = {
  items?: WishlistItem[];
  activeSort?: WishlistSortTab;
  activeTag?: string | null;
  searchValue?: string;
  showFab?: boolean;
  showAddButton?: boolean;
  menuOpenItemId?: number;
  children?: ReactNode;
  emptyContent?: ReactNode;
};

export function WishlistPageShell({
  items = WISHLIST_ITEMS,
  activeSort = 'semua',
  activeTag = null,
  searchValue,
  showFab = false,
  showAddButton = true,
  menuOpenItemId,
  children,
  emptyContent,
}: WishlistPageShellProps) {
  const sortCounts = wishlistSortCounts(items);
  const hasEmptyContent = Boolean(emptyContent);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: C.white,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: FONT,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div style={{ height: 60 }} />

      <WishlistHeader showAddButton={showAddButton} />

      <WishlistSearchBar value={searchValue} />

      <WishlistSortTabs activeSort={activeSort} counts={sortCounts} />

      <WishlistTagFilters activeTag={activeTag} />

      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          ...(hasEmptyContent ? { justifyContent: 'center', alignItems: 'center' } : {}),
        }}
      >
        {children ?? (emptyContent ?? <WishlistGrid items={items} menuOpenItemId={menuOpenItemId} />)}
      </div>

      {showFab && <WishlistFab />}
      <BottomNav active="wishlist" />
    </div>
  );
}

function WishlistHeader({ showAddButton }: { showAddButton: boolean }) {
  return (
    <div
      style={{
        padding: '8px 22px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        flexShrink: 0,
      }}
    >
      <h2 style={{ fontSize: 22, fontWeight: 800, color: C.charcoal, margin: 0, letterSpacing: -0.5, flex: 1 }}>
        Wishlist Aktivitas
      </h2>
      {showAddButton && <WishlistAddButton />}
    </div>
  );
}

function WishlistAddButton() {
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: C.coral,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: `0 6px 18px ${C.coral}45`,
        flexShrink: 0,
      }}
    >
      <Plus size={20} color="white" strokeWidth={2.5} />
    </div>
  );
}

function WishlistSearchBar({ value }: { value?: string }) {
  const focused = Boolean(value);
  return (
    <div style={{ padding: '14px 22px 0', flexShrink: 0 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          backgroundColor: C.light,
          borderRadius: 14,
          padding: '12px 16px',
          border: focused ? `1.5px solid ${C.coral}` : `1px solid ${C.border}`,
          boxShadow: focused ? `0 0 0 3px ${C.coralLight}` : 'none',
        }}
      >
        <Search size={16} color={focused ? C.coral : C.muted} strokeWidth={2} />
        <span style={{ fontSize: 14, color: focused ? C.charcoal : C.mutedLight, fontWeight: focused ? 600 : 400 }}>
          {value ?? 'Cari aktivitas wishlist...'}
        </span>
      </div>
    </div>
  );
}

export function WishlistSortTabs({
  activeSort,
  counts,
}: {
  activeSort: WishlistSortTab;
  counts: Record<WishlistSortTab, number>;
}) {
  return (
    <div style={{ display: 'flex', margin: '14px 22px 0', borderBottom: `1.5px solid ${C.border}`, overflowX: 'auto', scrollbarWidth: 'none' }}>
      {SORT_TAB_LABELS.map((tab) => {
        const active = tab.id === activeSort;
        const count = counts[tab.id];
        return (
          <div
            key={tab.id}
            style={{
              paddingBottom: 12,
              paddingTop: 2,
              marginRight: 16,
              cursor: 'pointer',
              borderBottom: active ? `2.5px solid ${C.coral}` : 'none',
              marginBottom: -1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? C.coral : C.muted }}>
              {tab.label}
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: active ? C.coral : C.muted,
                backgroundColor: active ? C.coralLight : C.light,
                padding: '2px 7px',
                borderRadius: 8,
                minWidth: 20,
                textAlign: 'center',
                lineHeight: 1.35,
              }}
            >
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function WishlistTagFilters({ activeTag }: { activeTag: string | null }) {
  const chips = [{ label: 'Semua', value: null as string | null }, ...WISHLIST_FILTER_TAGS.map((t) => ({ label: t, value: t }))];

  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        padding: '12px 22px 0',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        flexShrink: 0,
      }}
    >
      {chips.map((chip) => {
        const active = activeTag === chip.value;
        return (
          <div
            key={chip.label}
            style={{
              padding: '7px 14px',
              borderRadius: 20,
              backgroundColor: active ? C.teal : C.light,
              color: active ? 'white' : C.muted,
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              flexShrink: 0,
              whiteSpace: 'nowrap',
              border: active ? 'none' : `1px solid ${C.border}`,
            }}
          >
            {chip.label}
          </div>
        );
      })}
    </div>
  );
}

export function WishlistFab() {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 100,
        right: 22,
        width: 54,
        height: 54,
        backgroundColor: C.coral,
        borderRadius: 18,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: `0 8px 24px ${C.coral}55`,
        zIndex: 50,
      }}
    >
      <Plus size={24} color="white" strokeWidth={2.5} />
    </div>
  );
}

// ── Cards (selaras TripCard · InvitationCard) ──

type WishlistCardsProps = {
  items: WishlistItem[];
  menuOpenItemId?: number;
};

export function WishlistGrid({ items, menuOpenItemId }: WishlistCardsProps) {
  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        padding: '8px 22px 100px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 14,
        alignContent: 'start',
        overflowY: 'auto',
      }}
    >
      {items.map((item) => (
        <WishlistGridCard key={item.id} item={item} menuOpen={menuOpenItemId === item.id} />
      ))}
    </div>
  );
}

function WishlistGridCard({ item, menuOpen }: { item: WishlistItem; menuOpen?: boolean }) {
  const ps = priorityStyle(item.priority);

  return (
    <div
      style={{
        borderRadius: 20,
        overflow: 'visible',
        backgroundColor: C.white,
        boxShadow: `0 4px 24px ${C.shadow}, 0 0 0 1px rgba(0,0,0,0.04)`,
        position: 'relative',
      }}
    >
      <div style={{ position: 'relative', height: 118, backgroundColor: '#D8D4CC', borderRadius: '20px 20px 0 0', overflow: 'hidden' }}>
        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            backgroundColor: ps.bg,
            color: ps.color,
            fontSize: 9,
            fontWeight: 800,
            padding: '4px 9px',
            borderRadius: 20,
            border: `1px solid ${ps.color}25`,
          }}
        >
          {item.priority}
        </div>
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 28,
            height: 28,
            backgroundColor: 'rgba(255,255,255,0.92)',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(4px)',
          }}
        >
          <Navigation size={13} color={C.teal} strokeWidth={2.5} />
        </div>
      </div>

      <div style={{ padding: '11px 12px 13px', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 4, marginBottom: 4 }}>
          <h3 style={{ fontSize: 13, fontWeight: 800, color: C.charcoal, margin: 0, letterSpacing: -0.2, lineHeight: 1.3, flex: 1 }}>
            {item.name}
          </h3>
          <div style={{ position: 'relative', flexShrink: 0, marginTop: -2 }}>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 8,
                backgroundColor: menuOpen ? C.coralLight : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MoreHorizontal size={15} color={menuOpen ? C.coral : C.muted} strokeWidth={2.5} />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
          <MapPin size={11} color={C.muted} strokeWidth={2.5} />
          <span style={{ fontSize: 10, color: C.muted, fontWeight: 500, lineHeight: 1.35 }}>{item.location}</span>
        </div>
        <TripTags tags={item.tags} variant="card" maxVisible={2} />
      </div>

      {menuOpen && (
        <div
          style={{
            position: 'absolute',
            top: 126,
            left: 10,
            right: 10,
            zIndex: 40,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <WishlistCardMenuSheet />
        </div>
      )}
    </div>
  );
}

// ── Empty states ──

function WishlistEmptyIllustration() {
  return (
    <svg width={180} height={156} viewBox="0 0 180 156" fill="none">
      <circle cx="90" cy="78" r="68" fill={C.coralLight} />
      <circle cx="90" cy="78" r="48" fill="white" stroke="#FFE0E0" strokeWidth="2" />
      <path
        d="M90 108 C90 108 58 88 58 68 C58 56 68 48 78 48 C84 48 88 52 90 56 C92 52 96 48 102 48 C112 48 122 56 122 68 C122 88 90 108 90 108Z"
        fill={C.coral}
        opacity="0.85"
      />
      <circle cx="58" cy="52" r="4" fill={C.teal} opacity="0.7" />
      <circle cx="128" cy="48" r="3.5" fill="#FFB347" />
      <circle cx="132" cy="98" r="3" fill={C.teal} opacity="0.6" />
      <circle cx="90" cy="72" r="14" fill="white" stroke={C.teal} strokeWidth="1.5" opacity="0.9" />
      <path d="M90 62 C86 62 83 65 83 69 C83 74 90 82 90 82 C90 82 97 74 97 69 C97 65 94 62 90 62Z" fill={C.teal} />
      <circle cx="90" cy="69" r="2.5" fill="white" />
    </svg>
  );
}

export function WishlistEmptyState() {
  return (
    <div
      style={{
        flex: 1,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 36px 88px',
        textAlign: 'center',
      }}
    >
      <WishlistEmptyIllustration />
      <h3 style={{ fontSize: 20, fontWeight: 800, color: C.charcoal, margin: '18px 0 10px', letterSpacing: -0.3 }}>
        Wishlist masih kosong
      </h3>
      <p style={{ fontSize: 14, color: C.muted, margin: '0 0 28px', lineHeight: 1.55, fontWeight: 500, maxWidth: 280 }}>
        Simpan aktivitas impianmu di sini — nanti bisa dijadikan perjalanan dengan satu tap.
      </p>
      <button
        type="button"
        style={{
          height: 52,
          padding: '0 28px',
          backgroundColor: C.coral,
          color: 'white',
          border: 'none',
          borderRadius: 16,
          fontSize: 15,
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: `0 8px 20px ${C.coral}40`,
          fontFamily: FONT,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Plus size={18} strokeWidth={2.5} />
        Tambah Aktivitas
      </button>
    </div>
  );
}

export function WishlistFilterEmptyState() {
  return (
    <div
      style={{
        flex: 1,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <SearchEmptyState
        title="Tidak ada hasil"
        description="Tidak ada wishlist yang cocok dengan filter atau pencarian. Coba tag lain atau hapus filter."
      />
    </div>
  );
}

/** Backdrop statis untuk sheet/modal — grid terisi, tanpa FAB */
export function WishlistSheetBackdrop({ dimmed = true }: { dimmed?: boolean }) {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <WishlistPageShell items={WISHLIST_ITEMS} showFab={false} showAddButton={false} activeSort="semua" activeTag={null} />
      {dimmed && (
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(26,26,46,0.45)', zIndex: 10, pointerEvents: 'none' }} />
      )}
    </div>
  );
}

// ── Form (selaras CreateTripParts · FormField) ──

type WishlistFormBodyProps = {
  title?: string;
  startTime?: string;
  endTime?: string;
  hasMapsLink?: boolean;
  mapsPlaceName?: string;
  refLinks?: ActivityRefLink[];
  selectedPriority?: string;
  titleError?: string;
};

export function WishlistFormBody({
  title,
  startTime = '13:00',
  endTime = '16:00',
  hasMapsLink = false,
  mapsPlaceName,
  refLinks,
  selectedPriority = 'high',
  titleError,
}: WishlistFormBodyProps) {
  const hasError = Boolean(titleError);
  const links = refLinks ?? [{ id: 0, url: '' }];

  return (
    <>
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <FormField label="Mulai" required>
            <FormInputBox value={startTime} />
          </FormField>
        </div>
        <div style={{ flex: 1 }}>
          <FormField label="Selesai" required>
            <FormInputBox value={endTime} />
          </FormField>
        </div>
      </div>

      <div>
        <FormField label="Nama Aktivitas" required focused={Boolean(title) && !hasError}>
          <div
            style={
              hasError
                ? {
                    borderRadius: 14,
                    boxShadow: `0 0 0 4px ${C.dangerLight}`,
                  }
                : undefined
            }
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                backgroundColor: hasError ? '#FFF5F5' : C.light,
                borderRadius: 14,
                padding: '13px 16px',
                border: hasError ? `2px solid ${ERROR_RED}` : title ? `1.5px solid ${C.coral}` : `1.5px solid ${C.border}`,
              }}
            >
              <MapPin size={16} color={hasError ? ERROR_RED : title ? C.coral : C.muted} strokeWidth={2.5} />
              <span style={{ fontSize: title ? 15 : 14, color: title ? C.charcoal : C.mutedLight, fontWeight: title ? 500 : 400, flex: 1 }}>
                {title || 'Contoh: Pantai Tanjung Aan'}
              </span>
              {hasError && <AlertCircle size={17} color={ERROR_RED} strokeWidth={2.5} />}
            </div>
          </div>
        </FormField>
        {titleError && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6, paddingLeft: 2 }}>
            <AlertCircle size={12} color={ERROR_RED} strokeWidth={2.5} />
            <span style={{ fontSize: 12, color: ERROR_RED, fontWeight: 600 }}>{titleError}</span>
          </div>
        )}
      </div>

      <div>
        <label style={{ fontSize: 13, fontWeight: 700, color: C.charcoal, display: 'block', marginBottom: 10 }}>
          Prioritas
        </label>
        <div style={{ display: 'flex', gap: 10 }}>
          {WISHLIST_PRIORITIES.map((p) => {
            const selected = selectedPriority === p.value;
            return (
              <button
                key={p.value}
                type="button"
                style={{
                  flex: 1,
                  height: 40,
                  backgroundColor: p.bg,
                  color: p.color,
                  border: selected ? `2px solid ${p.color}` : `1.5px solid ${p.color}35`,
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: FONT,
                  boxShadow: selected ? `0 4px 14px ${p.color}30` : 'none',
                  opacity: selected ? 1 : 0.82,
                }}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      <ActivityMapsLinkField connected={hasMapsLink} placeName={mapsPlaceName} />
      <ActivityRefLinksField links={links} />
    </>
  );
}

type WishlistFormSheetProps = {
  title: string;
  subtitle?: string;
  submitLabel?: string;
  submitDisabled?: boolean;
  onBack?: boolean;
} & WishlistFormBodyProps;

function WishlistSubmitButton({ label, disabled }: { label: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      style={{
        width: '100%',
        height: 50,
        backgroundColor: disabled ? C.border : C.coral,
        color: disabled ? C.muted : 'white',
        border: 'none',
        borderRadius: 14,
        fontSize: 15,
        fontWeight: 800,
        cursor: disabled ? 'default' : 'pointer',
        fontFamily: FONT,
        boxShadow: disabled ? 'none' : `0 8px 24px ${C.coral}40`,
      }}
    >
      {label}
    </button>
  );
}

export function WishlistFormSheet({
  title,
  subtitle,
  submitLabel = 'Simpan Aktivitas',
  submitDisabled = false,
  onBack,
  ...formProps
}: WishlistFormSheetProps) {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', fontFamily: FONT }}>
      <WishlistSheetBackdrop />
      <BottomSheet
        title={title}
        subtitle={subtitle}
        onBack={onBack}
        height="fixed"
        bodyGap={16}
        footer={<WishlistSubmitButton label={submitLabel} disabled={submitDisabled} />}
      >
        <WishlistFormBody {...formProps} />
      </BottomSheet>
    </div>
  );
}

// ── Menu · Modal · Detail ──

export function WishlistCardMenuSheet() {
  return (
    <div
      style={{
        width: 172,
        backgroundColor: C.white,
        borderRadius: 12,
        padding: '4px 0',
        boxShadow: `0 10px 32px ${C.shadow}, 0 0 0 1px ${C.border}`,
        fontFamily: FONT,
      }}
    >
      <WishlistMenuRow icon={Compass} label="Jadikan Perjalanan" color={C.teal} />
      <WishlistMenuRow icon={Pencil} label="Edit" color={C.charcoal} />
      <WishlistMenuRow icon={Trash2} label="Hapus" color={DESTRUCTIVE.softText} />
    </div>
  );
}

function WishlistMenuRow({
  icon: Icon,
  label,
  color,
}: {
  icon: typeof Compass;
  label: string;
  color: string;
}) {
  return (
    <button
      type="button"
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '11px 14px',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontFamily: FONT,
        textAlign: 'left',
      }}
    >
      <Icon size={15} color={color} strokeWidth={2.5} />
      <span style={{ fontSize: 13, fontWeight: 600, color }}>{label}</span>
    </button>
  );
}

export function WishlistDeleteModal({ itemName = WISHLIST_SAMPLE.name }: { itemName?: string }) {
  return (
    <ConfirmDialogModal
      variant="destructive"
      title="Hapus dari wishlist?"
      description={
        <>
          <strong style={{ color: C.charcoal }}>{itemName}</strong> akan dihapus dari daftar wishlistmu.
        </>
      }
      icon={
        <div
          style={{
            width: 48,
            height: 48,
            backgroundColor: DESTRUCTIVE.softBg,
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Trash2 size={22} color={DESTRUCTIVE.softText} strokeWidth={2.5} />
        </div>
      }
      confirmLabel="Hapus"
    />
  );
}

function WishlistDetailLinkRow({ icon: Icon, label }: { icon: typeof Navigation; label: string }) {
  return (
    <button
      type="button"
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '11px 12px',
        borderRadius: 12,
        border: `1px solid ${C.border}`,
        backgroundColor: C.white,
        cursor: 'pointer',
        fontFamily: FONT,
        textAlign: 'left',
      }}
    >
      <Icon size={15} color={C.teal} strokeWidth={2.5} />
      <span style={{ fontSize: 13, color: C.charcoal, fontWeight: 600, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {label}
      </span>
    </button>
  );
}

type WishlistDetailSheetProps = {
  item?: WishlistItem;
};

/** Detail item — selaras ActivityDetailSheet */
export function WishlistDetailSheet({ item = WISHLIST_SAMPLE }: WishlistDetailSheetProps) {
  const ps = priorityStyle(item.priority);

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', fontFamily: FONT }}>
      <WishlistSheetBackdrop />
      <BottomSheet
        title={item.name}
        subtitle={item.location}
        height="fixed"
        footer={<SheetPrimaryButton label="Jadikan Perjalanan" />}
        bodyPinned={
          <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', height: 148 }}>
            <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(26,26,46,0.35), transparent 50%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 10,
                left: 10,
                backgroundColor: ps.bg,
                color: ps.color,
                fontSize: 11,
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: 20,
              }}
            >
              Prioritas {item.priority}
            </div>
          </div>
        }
      >
        <TripTags tags={item.tags} variant="card" />

        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <MapPin size={13} color={C.muted} strokeWidth={2.5} />
          <span style={{ fontSize: 13, color: C.muted, fontWeight: 500 }}>{item.location}</span>
        </div>

        {item.notes && (
          <p style={{ fontSize: 13, color: C.charcoal, margin: 0, lineHeight: 1.55, fontWeight: 500 }}>{item.notes}</p>
        )}

        <div>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: C.muted,
              margin: '0 0 8px',
              textTransform: 'uppercase',
              letterSpacing: 0.4,
            }}
          >
            Tautan
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <WishlistDetailLinkRow icon={Navigation} label="Buka di Google Maps" />
            {item.link && <WishlistDetailLinkRow icon={Link2} label={item.link} />}
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}

/** Banner — wishlist item dihapus otomatis setelah jadi perjalanan */
export function WishlistRemovedBanner({ itemName = WISHLIST_SAMPLE.name }: { itemName?: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        backgroundColor: C.tealLight,
        borderRadius: 12,
        padding: '12px 14px',
        border: `1px solid ${C.teal}30`,
        fontFamily: FONT,
      }}
    >
      <Heart size={16} color={C.coral} fill={C.coral} strokeWidth={0} style={{ flexShrink: 0, marginTop: 1 }} />
      <p style={{ fontSize: 12, color: C.charcoal, margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
        <strong style={{ fontWeight: 700 }}>{itemName}</strong> dihapus dari wishlist karena sudah dijadikan perjalanan.
      </p>
    </div>
  );
}
