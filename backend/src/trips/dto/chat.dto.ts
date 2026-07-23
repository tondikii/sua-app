import { IsIn, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateMessageDto {
  @IsIn(['text', 'photo', 'video'])
  message_kind!: 'text' | 'photo' | 'video';

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  message_text?: string;

  @IsOptional()
  @IsString()
  media_url?: string;

  @IsOptional()
  @IsUUID()
  reply_to_id?: string;
}

export class MarkReadDto {
  // Empty body — advances trip_message_reads.last_read_at to NOW().
}
