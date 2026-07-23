import { IsOptional, IsBoolean } from 'class-validator';

export class MarkAsReadDto {
  @IsOptional()
  @IsBoolean()
  is_read?: boolean;
}
