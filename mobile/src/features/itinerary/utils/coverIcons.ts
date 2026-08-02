import { MapPin } from '@/components/icons/MapPin';
import { Users } from '@/components/icons/Users';
import { Compass } from '@/components/icons/Compass';
import { Clock } from '@/components/icons/Clock';
import { Heart } from '@/components/icons/Heart';
import { Globe } from '@/components/icons/Globe';
import { Calendar } from '@/components/icons/Calendar';
import { Bell } from '@/components/icons/Bell';
import { FileText } from '@/components/icons/FileText';
import { Home } from '@/components/icons/Home';
import { Settings } from '@/components/icons/Settings';
import { ThumbsUp } from '@/components/icons/ThumbsUp';
import { ListChecks } from '@/components/icons/ListChecks';
import { Paperclip } from '@/components/icons/Paperclip';
import { Mail } from '@/components/icons/Mail';
import { Search } from '@/components/icons/Search';
import { colors } from '@/theme/colors';

export interface CoverIconOption {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  color: string;
  bg: string;
}

/**
 * Ikon cover aktivitas — subset dari Figma `COVER_ICON_OPTIONS` (ActivityParts.tsx),
 * dipetakan ke ikon SVG yang tersedia di project. Dipakai di cover picker & timeline.
 */
export const COVER_ICON_OPTIONS: CoverIconOption[] = [
  { id: 'gather', label: 'Kumpul', icon: Users, color: colors.coral, bg: colors.coralLight },
  { id: 'destination', label: 'Spot', icon: MapPin, color: colors.teal, bg: colors.tealLight },
  { id: 'view', label: 'Viewpoint', icon: Compass, color: '#5B6ABF', bg: '#EEF0FA' },
  { id: 'relax', label: 'Santai', icon: Heart, color: '#E09B3D', bg: '#FFF6E8' },
  { id: 'museum', label: 'Museum', icon: Globe, color: '#6B7280', bg: '#F3F4F6' },
  { id: 'landmark', label: 'Landmark', icon: Compass, color: '#8B6BAF', bg: '#F3F0FA' },
  { id: 'coffee', label: 'Kopi', icon: Clock, color: '#E09B3D', bg: '#FFF6E8' },
  { id: 'food', label: 'Makan', icon: ThumbsUp, color: '#E09B3D', bg: '#FFF6E8' },
  { id: 'hotel', label: 'Hotel', icon: Home, color: '#7B6BAF', bg: '#F3F0FA' },
  { id: 'ticket', label: 'Tiket', icon: Calendar, color: '#7B6BAF', bg: '#F3F0FA' },
  { id: 'music', label: 'Hiburan', icon: Bell, color: '#7B6BAF', bg: '#F3F0FA' },
  { id: 'camera', label: 'Foto', icon: FileText, color: colors.charcoal, bg: colors.light },
  { id: 'shopping', label: 'Belanja', icon: Settings, color: colors.coral, bg: colors.coralLight },
  { id: 'sport', label: 'Olahraga', icon: ListChecks, color: colors.coral, bg: colors.coralLight },
  { id: 'spa', label: 'Spa', icon: Paperclip, color: '#7B6BAF', bg: '#F3F0FA' },
  { id: 'souvenir', label: 'Oleh-oleh', icon: Mail, color: colors.coral, bg: colors.coralLight },
  { id: 'marina', label: 'Marina', icon: Search, color: '#5B6ABF', bg: '#EEF0FA' },
  { id: 'hike', label: 'Hiking', icon: Compass, color: '#4A8F5F', bg: '#E8F5EC' },
];

export function getCoverIconMeta(icon?: string | null): CoverIconOption {
  return (
    COVER_ICON_OPTIONS.find((o) => o.id === icon) ??
    COVER_ICON_OPTIONS.find((o) => o.id === 'destination')!
  );
}
