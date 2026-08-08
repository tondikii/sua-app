import {
  IsString,
  IsOptional,
  IsArray,
  MaxLength,
  IsDateString,
  IsUUID,
  IsEnum,
} from 'class-validator';

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
