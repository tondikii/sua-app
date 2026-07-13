import { IsIn, IsString, IsUUID } from 'class-validator';

export class PresignUploadDto {
  @IsUUID()
  trip_id!: string;

  @IsIn(['photo', 'video'])
  media_type!: 'photo' | 'video';

  @IsString()
  content_type!: string;
}

export class CreateDocumentDto {
  @IsString()
  storage_key!: string;

  @IsIn(['photo', 'video'])
  media_type!: 'photo' | 'video';
}