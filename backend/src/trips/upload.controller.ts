import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../common/decorators/current-user.decorator';
import { MediaService } from './media.service';
import { PresignUploadSchema } from '@atur-perjalanan/shared-validation';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

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
    @Body(new ZodValidationPipe(PresignUploadSchema)) dto: any,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.mediaService.presignUpload(user.userId, dto);
  }
}
