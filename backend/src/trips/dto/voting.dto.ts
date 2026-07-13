import { IsString, IsOptional, IsArray, MaxLength, IsDateString, IsUUID, Matches, IsEnum } from 'class-validator';

/** Matches a 24-hour wall-clock time, "HH:MM" (e.g. "09:00", "23:30"). */
const TIME_HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

// Validate against allowed poll_type values
enum PollTypeEnum {
  AKTIVITAS = 'aktivitas',
  LAINNYA = 'lainnya',
}

export class CreatePollDto {
  @IsString()
  @MaxLength(255)
  title!: string;

  @IsEnum(PollTypeEnum)
  poll_type!: string; // 'aktivitas' | 'lainnya'

  @IsArray()
  @IsString({ each: true })
  options!: string[]; // option labels (min 2, max 10)

  @IsOptional()
  @IsDateString()
  deadline?: string;
}

export class VoteDto {
  @IsUUID()
  option_id!: string;
}

export class LockPollDto {
  // No body — status = 'locked' is implicit
}

export class VoteDateCandidateDto {
  @IsUUID()
  candidate_id!: string;
}
