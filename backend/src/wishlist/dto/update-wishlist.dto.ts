import { IsString, IsArray, IsOptional, MaxLength, IsUrl, IsIn, Matches } from 'class-validator';
import { PRIORITY_LEVELS, PriorityLevelDto } from './create-wishlist.dto';

/** Matches a 24-hour wall-clock time, "HH:MM" (e.g. "09:00", "23:30"). */
const TIME_HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

export class UpdateWishlistDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  place_name?: string;

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
  @IsUrl({}, { message: 'link must be a valid URL' })
  link?: string;

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
