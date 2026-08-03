import { IsString, IsArray, IsOptional, MaxLength, IsDateString, IsBoolean, Matches } from 'class-validator';

const TIME_HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

/**
 * "Jadikan Perjalanan" (WORKFLOW §12, Screen114-115). Conversion always
 * produces a `fixed` trip — no voting-candidate mode here, matching the
 * three-table atomic transaction listed in ARCHITECTURE.md §3.4
 * (trips INSERT, trip_activities seed, wishlists soft DELETE).
 */
export class ConvertToTripDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  trip_name?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsDateString()
  start_date!: string;

  @IsDateString()
  end_date!: string;

  @IsOptional()
  @IsBoolean()
  is_all_day?: boolean;

  @IsOptional()
  @Matches(TIME_HHMM, { message: 'start_time must be in HH:MM format' })
  start_time?: string;

  @IsOptional()
  @Matches(TIME_HHMM, { message: 'end_time must be in HH:MM format' })
  end_time?: string;
}
