import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  ParseUUIDPipe,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../common/decorators/current-user.decorator';
import { ChatService } from './chat.service';
import { CreateMessageSchema } from '@atur-perjalanan/shared-validation';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@ApiTags('chat')
@ApiBearerAuth()
@Controller('trips')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  /**
   * GET /v1/trips/:tripId/messages
   * Cursor paginated (RFC3339 `created_at`), most recent first.
   */
  @Get(':tripId/messages')
  @HttpCode(HttpStatus.OK)
  async listMessages(
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @CurrentUser() user: CurrentUserPayload,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    return this.chatService.listMessages(
      tripId,
      user.userId,
      cursor,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  /**
   * POST /v1/trips/:tripId/messages
   */
  @Post(':tripId/messages')
  @HttpCode(HttpStatus.CREATED)
  async createMessage(
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @Body(new ZodValidationPipe(CreateMessageSchema)) dto: any,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.chatService.createMessage(tripId, user.userId, dto);
  }

  /**
   * PUT /v1/trips/:tripId/messages/read
   * Advances the caller's `trip_message_reads.last_read_at`.
   */
  @Put(':tripId/messages/read')
  @HttpCode(HttpStatus.NO_CONTENT)
  async markRead(
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.chatService.markRead(tripId, user.userId);
  }

  /**
   * DELETE /v1/trips/:tripId/messages/:messageId
   * Soft delete — sender only.
   */
  @Delete(':tripId/messages/:messageId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMessage(
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @Param('messageId', ParseUUIDPipe) messageId: string,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<void> {
    return this.chatService.deleteMessage(tripId, messageId, user.userId);
  }
}
