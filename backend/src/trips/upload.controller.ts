import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import {
  CurrentUser,
  CurrentUserPayload,
} from '../common/decorators/current-user.decorator';
import { MediaService } from './media.service';
import { PresignUploadDto } from './dto/media.dto';

@ApiTags('uploads')
@ApiBearerAuth()
@Controller('uploads')
@UseGuards(JwtAuthGuard)
export class UploadsController {
  constructor(private readonly mediaService: MediaService) {}

  /** POST /v1/uploads/presign */
  @Post('presign')
  @HttpCode(HttpStatus.OK)
  async presign(
    @Body() dto: PresignUploadDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.mediaService.presignUpload(user.userId, dto);
  }
}