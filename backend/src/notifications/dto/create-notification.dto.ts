import { IsEnum, IsOptional, IsString, IsDateString, IsInt, Min, Max, IsBoolean } from 'class-validator';
import { NotificationType } from '@prisma/client';

export class CreateNotificationDto {
  @IsString()
  userId: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsOptional()
  @IsString()
  actorId?: string;

  @IsOptional()
  @IsString()
  tripId?: string;

  @IsOptional()
  payload?: Record<string, any>;
}

export class MarkAsReadDto {
  @IsOptional()
  @IsBoolean()
  is_read?: boolean;
}