import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  ParseUUIDPipe,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../common/decorators/current-user.decorator';
import { MediaService } from './media.service';
import { CreateDocumentSchema } from '@atur-perjalanan/shared-validation';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@ApiTags('media')
@ApiBearerAuth()
@Controller('trips')
@UseGuards(JwtAuthGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  /** GET /v1/trips/:tripId/documents */
  @Get(':tripId/documents')
  @HttpCode(HttpStatus.OK)
  async listDocuments(
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.mediaService.listDocuments(tripId, user.userId);
  }

  /** POST /v1/trips/:tripId/documents — register an uploaded R2 object */
  @Post(':tripId/documents')
  @HttpCode(HttpStatus.CREATED)
  async createDocument(
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @Body(new ZodValidationPipe(CreateDocumentSchema)) dto: any,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.mediaService.createDocument(tripId, user.userId, dto);
  }

  /** DELETE /v1/trips/:tripId/documents/:documentId */
  @Delete(':tripId/documents/:documentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteDocument(
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @Param('documentId', ParseUUIDPipe) documentId: string,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<void> {
    return this.mediaService.deleteDocument(tripId, documentId, user.userId);
  }
}
