import {
  IsString,
  IsArray,
  IsOptional,
  MaxLength,
  IsUrl,
  IsIn,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

/** Matches a 24-hour wall-clock time, "HH:MM" (e.g. "09:00", "23:30"). */
const TIME_HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

export const PRIORITY_LEVELS = ['high', 'medium', 'low'] as const;
export type PriorityLevelDto = (typeof PRIORITY_LEVELS)[number];

export class RefLinkDto {
  @IsUrl({}, { message: 'ref link url must be a valid URL' })
  url!: string;

  @IsOptional()
  @IsString()
  label?: string;
}

export class CreateWishlistDto {
  @IsString()
  @MaxLength(255)
  place_name!: string;

  @IsOptional()
  @Matches(TIME_HHMM, { message: 'start_time must be in HH:MM format' })
  start_time?: string;

  @IsOptional()
  @Matches(TIME_HHMM, { message: 'end_time must be in HH:MM format' })
  end_time?: string;

  @IsOptional()
  @IsString()
  location_label?: string;

  @IsOptional()
  @IsUrl({}, { message: 'maps_link must be a valid URL' })
  maps_link?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RefLinkDto)
  ref_links?: RefLinkDto[];

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsIn(PRIORITY_LEVELS)
  priority_level?: PriorityLevelDto;

  @IsOptional()
  @IsString()
  thumbnail_url?: string;
}
