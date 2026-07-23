import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  MapPin,
  Navigation,
  Link2,
  ImageIcon,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Train,
  Bus,
  Plane,
  Car,
  Ship,
  Bike,
  UtensilsCrossed,
  Coffee,
  BedDouble,
  Waves,
  Mountain,
  Camera,
  ShoppingBag,
  Ticket,
  Users,
  Sun,
  Music,
  Tent,
  Fish,
  Landmark,
  Building2,
  TreePine,
  Store,
  Binoculars,
  Anchor,
  Sparkles,
  Dumbbell,
  Fuel,
  Gift,
  Umbrella,
  PartyPopper,
  Droplets,
  Shapes,
  Smartphone,
  FolderOpen,
  Pencil,
  Trash2,
} from 'lucide-react';
import { C, FONT } from '../colors';
import { DESTRUCTIVE } from '../ui/ConfirmDialogModal';
import { BottomSheet, SheetHandle, SheetPrimaryButton, SHEET_SAFE_TOP } from '../ui/BottomSheet';
import { FormField, FormInputBox } from '../ui/FormField';
import { DestinationThumbnail } from './DestinationParts';
import { TRIP_IMAGES } from '../tripImages';
import { SAMPLE_DOCUMENTS } from './DocumentParts';
import type { ItineraryDay, ItineraryItem, ItineraryItemKind } from './ItineraryParts';
import {
  getItineraryKindIcon,
  ItineraryTabBody,
  LOMBOK_ITINERARY_PENDING_DAY,
} from './ItineraryParts';
import { TripDetailPageShell, type TripTabCounts } from './TripDetailParts';
import { TRIP_DATE_PENDING } from './CreateTripParts';

export type ActivityCoverSource = 'none' | 'maps' | 'trip_media' | 'device' | 'icon';
export type ActivityCoverIcon =
  | 'train'
  | 'bus'
  | 'plane'
  | 'car'
  | 'ship'
  | 'bike'
  | 'food'
  | 'coffee'
  | 'hotel'
  | 'beach'
  | 'hike'
  | 'camera'
  | 'shopping'
  | 'ticket'
  | 'gather'
  | 'destination'
  | 'sun'
  | 'music'
  | 'tent'
  | 'fish'
  | 'landmark'
  | 'museum'
  | 'forest'
  | 'market'
  | 'view'
  | 'marina'
  | 'spa'
  | 'sport'
  | 'fuel'
  | 'souvenir'
  | 'relax'
  | 'party'
  | 'waterfall';

export type ActivityRefLink = {
  id: number;
  url: string;
  /** Judul tampilan — opsional; kosong = tampil URL dengan elipsis */
  label?: string;
};

export type ActivityDraft = {
  id: number;
  title: string;
  location?: string;
  description?: string;
  startTime: string;
  endTime: string;
  kind?: ItineraryItemKind;
  coverUrl?: string;
  coverSource?: ActivityCoverSource;
  coverIcon?: ActivityCoverIcon;
  mapsHasCover?: boolean;
  hasMapsLink?: boolean;
  /** Nama tempat dari callback resolve link Google Maps */
  mapsPlaceName?: string;
  /** @deprecated gunakan refLinks */
  hasRefLink?: boolean;
  refLinks?: ActivityRefLink[];
};

export const DEMO_ACTIVITY_NEW: ActivityDraft = {
  id: 0,
  title: '',
  startTime: '13:00',
  endTime: '16:00',
  kind: 'destination',
  coverSource: 'none',
  hasMapsLink: false,
  hasRefLink: false,
};

export const DEMO_ACTIVITY_WITH_MAPS_COVER: ActivityDraft = {
  id: 3,
  title: 'Pantai Tiga Warna',
  location: 'Lombok Timur, NTB',
  description: 'Snorkeling & foto di spot utama',
  startTime: '13:00',
  endTime: '16:00',
  kind: 'destination',
  coverUrl: TRIP_IMAGES.giliBeach,
  coverSource: 'maps',
  mapsHasCover: true,
  hasMapsLink: true,
  mapsPlaceName: 'Pantai Tiga Warna',
  refLinks: [
    {
      id: 1,
      label: 'TikTok — spot snorkeling',
      url: 'https://tiktok.com/@lomboktrip/video/spot-snorkeling',
    },
    { id: 2, url: 'https://blog.perjalanan.id/panduan-lengkap-pantai-tiga-warna-lombok-timur' },
  ],
};

/** Tambah aktivitas — baru tempel link Maps, cover otomatis, belum isi field lain */
export const DEMO_ACTIVITY_MAPS_LINKED_ADD: ActivityDraft = {
  id: 0,
  title: '',
  location: 'Lombok Timur, NTB',
  startTime: '13:00',
  endTime: '16:00',
  kind: 'destination',
  coverUrl: TRIP_IMAGES.giliBeach,
  coverSource: 'maps',
  mapsHasCover: true,
  hasMapsLink: true,
  mapsPlaceName: 'Pantai Tiga Warna',
};

/** @deprecated use DEMO_ACTIVITY_WITH_MAPS_COVER */
export const DEMO_ACTIVITY_WITH_COVER = DEMO_ACTIVITY_WITH_MAPS_COVER;

export const DEMO_ACTIVITY_MAPS_NO_THUMB: ActivityDraft = {
  id: 5,
  title: '',
  location: 'Lombok Tengah, NTB',
  startTime: '16:30',
  endTime: '18:30',
  kind: 'destination',
  coverSource: 'none',
  mapsHasCover: false,
  hasMapsLink: true,
  mapsPlaceName: 'Bukit Merese',
  hasRefLink: false,
};

export const DEMO_ACTIVITY_NO_COVER: ActivityDraft = {
  id: 4,
  title: 'Bukit Merese',
  location: 'Lombok Tengah, NTB',
  startTime: '16:30',
  endTime: '18:30',
  kind: 'destination',
  coverSource: 'none',
  hasMapsLink: false,
  hasRefLink: false,
};

export const DEMO_ACTIVITY_ICON_COVER: ActivityDraft = {
  id: 6,
  title: 'Transfer ke penginapan',
  location: 'Lombok Tengah, NTB',
  description: 'Van sewa — 12 kursi',
  startTime: '09:00',
  endTime: '11:00',
  kind: 'transport',
  coverSource: 'icon',
  coverIcon: 'bus',
  hasMapsLink: false,
  hasRefLink: false,
};

export const DEMO_ACTIVITY_TRIP_MEDIA: ActivityDraft = {
  id: 7,
  title: 'Sunset di Gili Trawangan',
  location: 'Gili Trawangan, NTB',
  startTime: '17:30',
  endTime: '19:00',
  kind: 'destination',
  coverUrl: TRIP_IMAGES.lombok,
  coverSource: 'trip_media',
  refLinks: [{ id: 1, label: 'Instagram Reels', url: 'https://instagram.com/reel/sunset-gili' }],
};

const COVER_SOURCE_LABELS: Record<Exclude<ActivityCoverSource, 'none'>, string> = {
  maps: 'Google Maps',
  trip_media: 'Media perjalanan',
  device: 'Galeri perangkat',
  icon: 'Icon',
};

export const COVER_ICON_OPTIONS: {
  id: ActivityCoverIcon;
  label: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}[] = [
  { id: 'train', label: 'Kereta', icon: Train, color: '#5B6ABF', bg: '#EEF0FA' },
  { id: 'bus', label: 'Bus', icon: Bus, color: '#5B6ABF', bg: '#EEF0FA' },
  { id: 'plane', label: 'Pesawat', icon: Plane, color: '#5B6ABF', bg: '#EEF0FA' },
  { id: 'car', label: 'Mobil', icon: Car, color: '#5B6ABF', bg: '#EEF0FA' },
  { id: 'ship', label: 'Kapal', icon: Ship, color: '#5B6ABF', bg: '#EEF0FA' },
  { id: 'bike', label: 'Sepeda', icon: Bike, color: '#5B6ABF', bg: '#EEF0FA' },
  { id: 'food', label: 'Makan', icon: UtensilsCrossed, color: '#E09B3D', bg: '#FFF6E8' },
  { id: 'coffee', label: 'Kopi', icon: Coffee, color: '#E09B3D', bg: '#FFF6E8' },
  { id: 'hotel', label: 'Hotel', icon: BedDouble, color: '#7B6BAF', bg: '#F3F0FA' },
  { id: 'beach', label: 'Pantai', icon: Waves, color: C.teal, bg: C.tealLight },
  { id: 'hike', label: 'Hiking', icon: Mountain, color: '#4A8F5F', bg: '#E8F5EC' },
  { id: 'camera', label: 'Foto', icon: Camera, color: C.charcoal, bg: C.light },
  { id: 'shopping', label: 'Belanja', icon: ShoppingBag, color: C.coral, bg: C.coralLight },
  { id: 'ticket', label: 'Tiket', icon: Ticket, color: '#7B6BAF', bg: '#F3F0FA' },
  { id: 'gather', label: 'Kumpul', icon: Users, color: C.coral, bg: C.coralLight },
  { id: 'destination', label: 'Spot', icon: MapPin, color: C.teal, bg: C.tealLight },
  { id: 'sun', label: 'Outdoor', icon: Sun, color: '#E09B3D', bg: '#FFF6E8' },
  { id: 'music', label: 'Hiburan', icon: Music, color: '#7B6BAF', bg: '#F3F0FA' },
  { id: 'tent', label: 'Camping', icon: Tent, color: '#4A8F5F', bg: '#E8F5EC' },
  { id: 'fish', label: 'Snorkel', icon: Fish, color: C.teal, bg: C.tealLight },
  { id: 'landmark', label: 'Landmark', icon: Landmark, color: '#8B6BAF', bg: '#F3F0FA' },
  { id: 'museum', label: 'Museum', icon: Building2, color: '#6B7280', bg: '#F3F4F6' },
  { id: 'forest', label: 'Hutan', icon: TreePine, color: '#4A8F5F', bg: '#E8F5EC' },
  { id: 'market', label: 'Pasar', icon: Store, color: '#E09B3D', bg: '#FFF6E8' },
  { id: 'view', label: 'Viewpoint', icon: Binoculars, color: '#5B6ABF', bg: '#EEF0FA' },
  { id: 'marina', label: 'Marina', icon: Anchor, color: '#5B6ABF', bg: '#EEF0FA' },
  { id: 'spa', label: 'Spa', icon: Sparkles, color: '#7B6BAF', bg: '#F3F0FA' },
  { id: 'sport', label: 'Olahraga', icon: Dumbbell, color: C.coral, bg: C.coralLight },
  { id: 'fuel', label: 'BBM', icon: Fuel, color: '#6B7280', bg: '#F3F4F6' },
  { id: 'souvenir', label: 'Oleh-oleh', icon: Gift, color: C.coral, bg: C.coralLight },
  { id: 'relax', label: 'Santai', icon: Umbrella, color: '#E09B3D', bg: '#FFF6E8' },
  { id: 'party', label: 'Pesta', icon: PartyPopper, color: '#7B6BAF', bg: '#F3F0FA' },
  { id: 'waterfall', label: 'Air terjun', icon: Droplets, color: C.teal, bg: C.tealLight },
];

function getCoverIconMeta(icon?: ActivityCoverIcon) {
  return (
    COVER_ICON_OPTIONS.find((o) => o.id === icon) ??
    COVER_ICON_OPTIONS.find((o) => o.id === 'destination')!
  );
}

export function activityHasCover(activity: ActivityDraft): boolean {
  return Boolean(activity.coverUrl || activity.coverIcon);
}

function activityRefLinks(activity: ActivityDraft): ActivityRefLink[] {
  if (activity.refLinks?.length) return activity.refLinks;
  if (activity.hasRefLink) return [{ id: 1, url: 'https://example.com/referensi' }];
  return [];
}

function refLinkDisplayText(link: ActivityRefLink): string {
  return link.label?.trim() || link.url;
}

function TextAction({
  children,
  accent,
  muted,
}: {
  children: ReactNode;
  accent?: boolean;
  muted?: boolean;
}) {
  return (
    <button
      type="button"
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        fontSize: 12,
        fontWeight: 700,
        color: muted ? C.mutedLight : accent ? C.coral : C.charcoal,
        cursor: muted ? 'default' : 'pointer',
        fontFamily: FONT,
      }}
    >
      {children}
    </button>
  );
}

/** Preview kecil cover — foto atau icon */
export function ActivityCoverThumb({
  activity,
  size = 56,
  showLabel = false,
}: {
  activity: Pick<ActivityDraft, 'coverUrl' | 'coverIcon' | 'coverSource'>;
  size?: number;
  showLabel?: boolean;
}) {
  if (activity.coverUrl) {
    return (
      <img
        src={activity.coverUrl}
        alt=""
        style={{
          width: size,
          height: size,
          borderRadius: 12,
          objectFit: 'cover',
          display: 'block',
          flexShrink: 0,
        }}
      />
    );
  }

  if (activity.coverIcon) {
    const meta = getCoverIconMeta(activity.coverIcon);
    const Icon = meta.icon;
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: 12,
          backgroundColor: meta.bg,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: showLabel ? 3 : 0,
          flexShrink: 0,
        }}
      >
        <Icon size={Math.round(size * 0.38)} color={meta.color} strokeWidth={2.5} />
        {showLabel && (
          <span style={{ fontSize: 8, fontWeight: 700, color: meta.color }}>{meta.label}</span>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 12,
        border: `1px dashed ${C.border}`,
        backgroundColor: C.white,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <ImageIcon size={18} color={C.mutedLight} strokeWidth={2} />
    </div>
  );
}

/** Field cover — ringkas, aksi sebagai teks */
export function ActivityCoverField({ activity }: { activity: ActivityDraft }) {
  const hasCover = activityHasCover(activity);
  const sourceLabel =
    activity.coverSource && activity.coverSource !== 'none'
      ? COVER_SOURCE_LABELS[activity.coverSource]
      : null;
  const mapsNoThumb = activity.hasMapsLink && activity.mapsHasCover === false;
  const canSyncMaps = activity.hasMapsLink && activity.mapsHasCover !== false;

  return (
    <FormField
      label="Cover"
      hint={mapsNoThumb ? 'Maps tanpa gambar — pilih manual di bawah.' : undefined}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: 10,
          borderRadius: 14,
          border: `1.5px solid ${C.border}`,
          backgroundColor: C.light,
        }}
      >
        <ActivityCoverThumb activity={activity} size={52} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: C.charcoal,
              margin: 0,
              lineHeight: 1.35,
            }}
          >
            {hasCover && sourceLabel ? sourceLabel : 'Belum dipilih'}
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
        <TextAction accent>{hasCover ? 'Ubah' : 'Pilih'}</TextAction>
        {hasCover && (
          <>
            <span style={{ color: C.border }}>·</span>
            <TextAction>Hapus</TextAction>
          </>
        )}
        {activity.hasMapsLink && (
          <>
            <span style={{ color: C.border }}>·</span>
            <TextAction muted={!canSyncMaps}>Sinkron Maps</TextAction>
          </>
        )}
      </div>
    </FormField>
  );
}

/** Satu blok input link referensi — judul muncul setelah URL diisi */
function RefLinkInputGroup({
  link,
  index,
  showIndex,
}: {
  link: ActivityRefLink;
  index: number;
  showIndex: boolean;
}) {
  const hasUrl = Boolean(link.url);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {showIndex && (
        <span style={{ fontSize: 11, fontWeight: 700, color: C.muted }}>Link {index + 1}</span>
      )}
      <div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: C.muted,
            display: 'block',
            marginBottom: 6,
          }}
        >
          URL
        </span>
        <FormInputBox
          value={link.url || undefined}
          placeholder="Tempel link referensi..."
          leftIcon={<Link2 size={16} color={C.muted} strokeWidth={2.5} />}
        />
      </div>
      {hasUrl && (
        <div>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: C.muted,
              display: 'block',
              marginBottom: 6,
            }}
          >
            Judul tampilan
          </span>
          <FormInputBox value={link.label} placeholder="Kosongkan untuk tampilkan URL" />
        </div>
      )}
    </div>
  );
}

/** Field link referensi — URL + judul tampilan (muncul setelah URL diisi) */
export function ActivityRefLinksField({ links }: { links: ActivityRefLink[] }) {
  const rows = links.length > 0 ? links : [{ id: 0, url: '' }];

  return (
    <FormField label="Link Lainnya">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {rows.map((link, idx) => (
          <RefLinkInputGroup key={link.id} link={link} index={idx} showIndex={rows.length > 1} />
        ))}
        {links.length > 0 && <TextAction accent>+ Tambah link</TextAction>}
      </div>
    </FormField>
  );
}

/** Baris Google Maps di form — tampil nama tempat setelah resolve link */
export function ActivityMapsLinkField({
  connected,
  placeName,
}: {
  connected: boolean;
  placeName?: string;
}) {
  const displayValue = connected ? placeName || 'Terhubung' : undefined;

  return (
    <FormField label="Google Maps">
      <FormInputBox
        value={displayValue}
        placeholder="Tempel link Google Maps..."
        leftIcon={<Navigation size={16} color={C.muted} strokeWidth={2.5} />}
      />
    </FormField>
  );
}

function DetailLinkRow({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
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
      <span
        style={{
          flex: 1,
          minWidth: 0,
          fontSize: 13,
          fontWeight: 600,
          color: C.charcoal,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
      <ChevronRight size={15} color={C.mutedLight} strokeWidth={2.5} />
    </button>
  );
}

type ActivityFormSheetProps = {
  title: string;
  subtitle?: string;
  activity: ActivityDraft;
  mode?: 'add' | 'edit';
  onBack?: boolean;
};

export function ActivityFormSheet({
  title,
  subtitle,
  activity,
  mode = 'add',
  onBack,
}: ActivityFormSheetProps) {
  const refLinks = activityRefLinks(activity);

  return (
    <BottomSheet
      title={title}
      subtitle={subtitle}
      onBack={onBack}
      height="fixed"
      bodyGap={16}
      footer={
        <SheetPrimaryButton label={mode === 'edit' ? 'Simpan Perubahan' : 'Simpan Aktivitas'} />
      }
    >
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <FormField label="Mulai" required>
            <FormInputBox value={activity.startTime} />
          </FormField>
        </div>
        <div style={{ flex: 1 }}>
          <FormField label="Selesai" required>
            <FormInputBox value={activity.endTime} />
          </FormField>
        </div>
      </div>

      <FormField label="Nama Aktivitas" required>
        <FormInputBox
          value={activity.title || undefined}
          placeholder="Contoh: Pantai Tiga Warna"
          leftIcon={<MapPin size={16} color={C.muted} strokeWidth={2.5} />}
        />
      </FormField>

      <ActivityCoverField activity={activity} />

      <ActivityMapsLinkField
        connected={Boolean(activity.hasMapsLink)}
        placeName={activity.mapsPlaceName}
      />
      <ActivityRefLinksField links={refLinks} />
    </BottomSheet>
  );
}

type ActivityDetailSheetProps = {
  activity: ActivityDraft;
  onBack?: boolean;
};

/** Detail aktivitas — sheet ringkas, tautan sebagai baris bukan tombol */
export function ActivityDetailSheet({ activity, onBack }: ActivityDetailSheetProps) {
  const hasCover = activityHasCover(activity);
  const refLinks = activityRefLinks(activity);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        pointerEvents: 'none',
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          backgroundColor: C.white,
          borderRadius: '26px 26px 0 0',
          pointerEvents: 'auto',
          boxShadow: '0 -10px 40px rgba(26,26,46,0.14)',
          maxHeight: `calc(100% - ${SHEET_SAFE_TOP}px)`,
          overflowY: 'auto',
        }}
      >
        <SheetHandle />

        {onBack && (
          <div style={{ padding: '0 16px 4px' }}>
            <button
              type="button"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                fontFamily: FONT,
                color: C.muted,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              <ChevronLeft size={16} strokeWidth={2.5} />
              Kembali
            </button>
          </div>
        )}

        {hasCover && activity.coverUrl && (
          <img
            src={activity.coverUrl}
            alt=""
            style={{ width: '100%', height: 112, objectFit: 'cover', display: 'block' }}
          />
        )}

        {hasCover && activity.coverIcon && !activity.coverUrl && (
          <div
            style={{
              height: 80,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: C.light,
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            <ActivityCoverThumb activity={activity} size={52} showLabel />
          </div>
        )}

        <div style={{ padding: '14px 20px 32px' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: C.muted, margin: '0 0 4px' }}>
            {activity.startTime} – {activity.endTime}
          </p>
          <h2
            style={{
              fontSize: 17,
              fontWeight: 800,
              color: C.charcoal,
              margin: '0 0 6px',
              letterSpacing: -0.2,
            }}
          >
            {activity.title}
          </h2>
          {activity.location && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                marginBottom: activity.description ? 8 : 0,
              }}
            >
              <MapPin size={13} color={C.muted} strokeWidth={2.5} />
              <span style={{ fontSize: 13, color: C.muted, fontWeight: 500 }}>
                {activity.location}
              </span>
            </div>
          )}
          {activity.description && (
            <p
              style={{
                fontSize: 13,
                color: C.charcoal,
                margin: 0,
                lineHeight: 1.55,
                fontWeight: 500,
              }}
            >
              {activity.description}
            </p>
          )}

          {(activity.hasMapsLink || refLinks.length > 0) && (
            <div style={{ marginTop: 14 }}>
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
                {activity.hasMapsLink && (
                  <DetailLinkRow
                    icon={Navigation}
                    label={activity.mapsPlaceName || 'Google Maps'}
                  />
                )}
                {refLinks.map((link) => (
                  <DetailLinkRow key={link.id} icon={Link2} label={refLinkDisplayText(link)} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type ActivityCoverPickerSection = 'trip_media' | 'device' | 'icon';

type ActivityCoverPickerSheetProps = {
  activity?: ActivityDraft;
  activeSection?: ActivityCoverPickerSection;
  selectedTripMediaId?: number;
  selectedIcon?: ActivityCoverIcon;
};

export function ActivityCoverPickerSheet({
  activity = DEMO_ACTIVITY_MAPS_NO_THUMB,
  activeSection = 'trip_media',
  selectedTripMediaId = 2,
  selectedIcon = 'bus',
}: ActivityCoverPickerSheetProps) {
  const sections: {
    id: ActivityCoverPickerSection;
    label: string;
    hint: string;
    icon: LucideIcon;
  }[] = [
    { id: 'trip_media', label: 'Media perjalanan', hint: 'Foto di tab Media', icon: FolderOpen },
    { id: 'device', label: 'Galeri perangkat', hint: 'Pilih dari foto lokal', icon: Smartphone },
    { id: 'icon', label: 'Ilustrasi', hint: 'Icon untuk aktivitas', icon: Shapes },
  ];

  const sourceSelector = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {sections.map((sec) => {
        const active = sec.id === activeSection;
        const SecIcon = sec.icon;
        return (
          <button
            key={sec.id}
            type="button"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 12,
              border: active ? `1.5px solid ${C.coral}` : `1px solid ${C.border}`,
              backgroundColor: active ? C.coralLight : C.white,
              cursor: 'pointer',
              fontFamily: FONT,
              textAlign: 'left',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor: active ? C.white : C.light,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <SecIcon size={15} color={active ? C.coral : C.muted} strokeWidth={2.5} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: C.charcoal, margin: 0 }}>
                {sec.label}
              </p>
              <p style={{ fontSize: 11, color: C.muted, margin: '2px 0 0' }}>{sec.hint}</p>
            </div>
            {active && <Check size={16} color={C.coral} strokeWidth={2.5} />}
          </button>
        );
      })}
    </div>
  );

  return (
    <BottomSheet
      title="Pilih Cover"
      onBack
      zIndex={30}
      height={activeSection === 'icon' ? 'fixed' : 'auto'}
      bodyPinned={sourceSelector}
      bodyGap={0}
      footer={<SheetPrimaryButton label="Gunakan" />}
    >
      <div
        style={{
          paddingTop: 16,
          borderTop: `1px solid ${C.border}`,
        }}
      >
        {activeSection === 'trip_media' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {SAMPLE_DOCUMENTS.filter((d) => d.type === 'photo').map((doc) => {
              const selected = doc.id === selectedTripMediaId;
              return (
                <div
                  key={doc.id}
                  style={{
                    aspectRatio: '1',
                    borderRadius: 12,
                    overflow: 'hidden',
                    position: 'relative',
                    border: selected ? `2px solid ${C.coral}` : `1px solid ${C.border}`,
                    cursor: 'pointer',
                  }}
                >
                  <img
                    src={doc.url}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {selected && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 5,
                        right: 5,
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        backgroundColor: C.coral,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Check size={10} color="white" strokeWidth={3} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeSection === 'device' && (
          <button
            type="button"
            style={{
              width: '100%',
              height: 88,
              borderRadius: 12,
              border: `1px dashed ${C.border}`,
              backgroundColor: C.light,
              cursor: 'pointer',
              fontFamily: FONT,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <Smartphone size={22} color={C.muted} strokeWidth={2} />
            <span style={{ fontSize: 12, fontWeight: 600, color: C.charcoal }}>
              Pilih dari galeri
            </span>
          </button>
        )}

        {activeSection === 'icon' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {COVER_ICON_OPTIONS.map((opt) => {
              const selected = opt.id === selectedIcon;
              const Icon = opt.icon;
              return (
                <div
                  key={opt.id}
                  style={{
                    borderRadius: 12,
                    padding: '8px 4px',
                    border: selected ? `2px solid ${C.coral}` : `1px solid ${C.border}`,
                    backgroundColor: selected ? C.coralLight : C.white,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 5,
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      backgroundColor: opt.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={17} color={opt.color} strokeWidth={2.5} />
                  </div>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 600,
                      color: C.muted,
                      textAlign: 'center',
                      lineHeight: 1.2,
                    }}
                  >
                    {opt.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </BottomSheet>
  );
}

/** Menu ⋮ pada item aktivitas di itinerary */
export function ActivityItemMenuSheet() {
  return (
    <div
      style={{
        position: 'absolute',
        top: '100%',
        right: 0,
        marginTop: 4,
        width: 160,
        backgroundColor: C.white,
        borderRadius: 12,
        padding: '4px 0',
        zIndex: 30,
        boxShadow: `0 10px 32px ${C.shadow}, 0 0 0 1px ${C.border}`,
        fontFamily: FONT,
      }}
    >
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
        <Pencil size={15} color={C.charcoal} strokeWidth={2.5} />
        <span style={{ fontSize: 13, fontWeight: 600, color: C.charcoal }}>Edit</span>
      </button>
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
        <Trash2 size={15} color={DESTRUCTIVE.softText} strokeWidth={2.5} />
        <span style={{ fontSize: 13, fontWeight: 600, color: DESTRUCTIVE.softText }}>Hapus</span>
      </button>
    </div>
  );
}

/** Thumbnail kecil di timeline */
export function ActivityTimelineThumb({ item }: { item: ItineraryItem }) {
  if (item.gmapsThumbUrl) {
    return <DestinationThumbnail gmapsThumbUrl={item.gmapsThumbUrl} size={44} />;
  }

  if (item.coverIcon) {
    const meta = getCoverIconMeta(item.coverIcon as ActivityCoverIcon);
    const Icon = meta.icon;
    return (
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          backgroundColor: meta.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={18} color={meta.color} strokeWidth={2.5} />
      </div>
    );
  }

  return (
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        border: `2px dashed ${C.border}`,
        backgroundColor: C.light,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        flexShrink: 0,
      }}
    >
      {(() => {
        const KindIcon = getItineraryKindIcon(item.kind);
        return <KindIcon size={16} color={C.muted} strokeWidth={2.5} />;
      })()}
    </div>
  );
}

export function ActivityTimeBadge({
  startTime,
  endTime,
  color,
}: {
  startTime: string;
  endTime: string;
  color: string;
}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 11,
        fontWeight: 700,
        color,
      }}
    >
      <Clock size={11} strokeWidth={2.5} />
      {startTime} – {endTime}
    </span>
  );
}

/** Backdrop itinerary — dipakai sheet tambah/edit/detail aktivitas */
export function ActivitySheetBackdrop({
  subtitle = TRIP_DATE_PENDING,
  days = [LOMBOK_ITINERARY_PENDING_DAY],
  activeDayId = 1,
  datePending = true,
  counts,
}: {
  subtitle?: string;
  days?: ItineraryDay[];
  activeDayId?: number;
  datePending?: boolean;
  counts?: TripTabCounts;
}) {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <TripDetailPageShell
          title="Lombok Weekend Escape"
          subtitle={subtitle}
          activeTab="itinerary"
          counts={counts}
        >
          <ItineraryTabBody days={days} activeDayId={activeDayId} datePending={datePending} />
        </TripDetailPageShell>
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(26,26,46,0.45)',
          zIndex: 10,
        }}
      />
    </>
  );
}

type ActivitySheetBackdropConfig = Parameters<typeof ActivitySheetBackdrop>[0];

/** Wrapper layar sheet aktivitas — backdrop itinerary + konten sheet */
export function ActivitySheetScreen({
  backdrop,
  children,
}: {
  backdrop: ActivitySheetBackdropConfig;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: FONT,
      }}
    >
      <ActivitySheetBackdrop {...backdrop} />
      {children}
    </div>
  );
}
