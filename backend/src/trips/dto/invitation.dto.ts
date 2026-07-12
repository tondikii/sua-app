import { IsUUID, IsString, IsOptional, IsEmail, IsBoolean } from 'class-validator';

export class CreateInvitationDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}

export class RespondInvitationDto {
  @IsBoolean()
  accept: boolean;
}

export class SetTripCoverDto {
  @IsUUID()
  document_id: string;
}
