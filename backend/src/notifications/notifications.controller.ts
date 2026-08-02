import {
  Controller,
  Get,
  Put,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../common/decorators/current-user.decorator';
import { NotificationsService } from './notifications.service';

@ApiTags('notifications')
@ApiBearerAuth()
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // GET /v1/notifications
  @Get()
  listNotifications(
    @CurrentUser() user: CurrentUserPayload,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    const rawLimit = limit ? parseInt(limit, 10) : 20;
    const safeLimit = Number.isNaN(rawLimit) ? 20 : Math.min(100, Math.max(1, rawLimit));

    return this.notificationsService.listNotifications(user.userId, cursor, safeLimit);
  }

  // GET /v1/notifications/unread-count
  @Get('unread-count')
  getUnreadCount(@CurrentUser() user: CurrentUserPayload) {
    return this.notificationsService.getUnreadCount(user.userId);
  }

  // PUT /v1/notifications/:id/read
  @Put(':id/read')
  @HttpCode(HttpStatus.NO_CONTENT)
  markAsRead(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.notificationsService.markAsRead(id, user.userId);
  }

  // PUT /v1/notifications/read-all
  @Put('read-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  markAllAsRead(@CurrentUser() user: CurrentUserPayload) {
    return this.notificationsService.markAllAsRead(user.userId);
  }
}
