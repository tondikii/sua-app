import { IsString, IsArray, IsOptional, MaxLength, IsDateString, IsBoolean, Matches } from 'class-validator';

/** Matches a 24-hour wall-clock time, "HH:MM" (e.g. "09:00", "23:30"). */
const TIME_HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

export class UpdateTripDto {
  @IsString()
  @MaxLength(255)
  @IsOptional()
  name?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;

  @IsOptional()
  @IsBoolean()
  is_all_day?: boolean;

  @IsOptional()
  @Matches(TIME_HHMM, { message: 'start_time must be in HH:MM format' })
  start_time?: string;

  @IsOptional()
  @Matches(TIME_HHMM, { message: 'end_time must be in HH:MM format' })
  end_time?: string;

  @IsOptional()
  @IsBoolean()
  is_public?: boolean;
}
