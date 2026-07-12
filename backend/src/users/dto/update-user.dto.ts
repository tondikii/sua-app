import { IsOptional, IsString, IsBoolean, IsUrl, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  bio?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  website_url?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  location_label?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  is_public?: boolean;
}
