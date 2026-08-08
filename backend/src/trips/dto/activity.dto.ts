import {
  IsString,
  IsOptional,
  IsDateString,
  Matches,
  IsEnum,
  IsArray,
  IsUrl,
  IsUUID,
  MaxLength,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

/** Matches a 24-hour wall-clock time, "HH:MM" (e.g. "09:00", "23:30"). */
const TIME_HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

enum ActivityKindEnum {
  GATHER = 'gather',
  TRANSPORT = 'transport',
  MEAL = 'meal',
  ACTIVITY = 'activity',
  DESTINATION = 'destination',
}

enum CoverSourceEnum {
  NONE = 'none',
  MAPS = 'maps',
  TRIP_MEDIA = 'trip_media',
  DEVICE = 'device',
  ICON = 'icon',
}

export class RefLinkDto {
  @IsUrl()
  url!: string;

  @IsString()
  @MaxLength(255)
  label!: string;
}

export class CreateActivityDto {
  @IsString()
  @MaxLength(255)
  place_name!: string;

  @IsOptional()
  @IsDateString()
  activity_date?: string; // ISO 8601 date; optional if trip status=voting_pending

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  day_number?: number; // 1-based day index within the trip

  @Matches(TIME_HHMM)
  start_time!: string; // HH:MM

  @Matches(TIME_HHMM)
  end_time!: string; // HH:MM

  @IsOptional()
  @IsEnum(ActivityKindEnum)
  kind?: string; // default 'activity'

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  location_label?: string;

  @IsOptional()
  @IsUrl()
  maps_link?: string;

  @IsOptional()
  @IsArray()
  @Type(() => RefLinkDto)
  ref_links?: RefLinkDto[];

  @IsOptional()
  @IsEnum(CoverSourceEnum)
  cover_source?: string; // default 'none'

  @IsOptional()
  @IsString()
  cover_icon?: string; // when cover_source='icon'

  @IsOptional()
  @IsUUID()
  cover_document_id?: string; // when cover_source='trip_media'

  @IsOptional()
  @IsString()
  thumbnail_url?: string;

  @IsOptional()
  @Type(() => Number)
  sort_order?: number;
}

export class UpdateActivityDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  place_name?: string;

  @IsOptional()
  @IsDateString()
  activity_date?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  day_number?: number;

  @IsOptional()
  @Matches(TIME_HHMM)
  start_time?: string;

  @IsOptional()
  @Matches(TIME_HHMM)
  end_time?: string;

  @IsOptional()
  @IsEnum(ActivityKindEnum)
  kind?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  location_label?: string;

  @IsOptional()
  @IsUrl()
  maps_link?: string;

  @IsOptional()
  @IsArray()
  @Type(() => RefLinkDto)
  ref_links?: RefLinkDto[];

  @IsOptional()
  @IsEnum(CoverSourceEnum)
  cover_source?: string;

  @IsOptional()
  @IsString()
  cover_icon?: string;

  @IsOptional()
  @IsUUID()
  cover_document_id?: string;

  @IsOptional()
  @IsString()
  thumbnail_url?: string;

  @IsOptional()
  @Type(() => Number)
  sort_order?: number;
}
