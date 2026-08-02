import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  ParseUUIDPipe,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../common/decorators/current-user.decorator';
import { ActivityService } from './activity.service';
import { CreateActivitySchema, UpdateActivitySchema } from '@atur-perjalanan/shared-validation';
import type { CreateActivityInput, UpdateActivityInput } from '@atur-perjalanan/shared-validation';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@ApiTags('activities')
@ApiBearerAuth()
@Controller('trips')
@UseGuards(JwtAuthGuard)
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  /**
   * GET /v1/trips/:tripId/activities
   * List all activities for a trip, grouped by date
   */
  @Get(':tripId/activities')
  @HttpCode(HttpStatus.OK)
  async listActivities(
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.activityService.listActivities(tripId, user.userId);
  }

  /**
   * POST /v1/trips/:tripId/activities/sync-maps-thumbnail
   * Resolve the Google Maps thumbnail for a pasted maps link ("Sinkron Maps").
   */
  @Post(':tripId/activities/sync-maps-thumbnail')
  @HttpCode(HttpStatus.OK)
  async syncMapsThumbnail(
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @Body() body: { maps_link: string },
    @CurrentUser() user: CurrentUserPayload,
  ) {
    if (!body.maps_link || !/^https?:\/\//.test(body.maps_link)) {
      throw new BadRequestException('maps_link must be a valid URL');
    }
    return this.activityService.syncMapsThumbnail(tripId, user.userId, body.maps_link);
  }

  /**
   * GET /v1/trips/:tripId/activities/:activityId
   * Get a single activity
   */
  @Get(':tripId/activities/:activityId')
  @HttpCode(HttpStatus.OK)
  async getActivity(
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @Param('activityId', ParseUUIDPipe) activityId: string,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.activityService.getActivity(tripId, activityId, user.userId);
  }

  /**
   * POST /v1/trips/:tripId/activities
   * Create a new activity. Participants can create.
   */
  @Post(':tripId/activities')
  @HttpCode(HttpStatus.CREATED)
  async createActivity(
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @Body(new ZodValidationPipe(CreateActivitySchema)) dto: CreateActivityInput,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.activityService.createActivity(tripId, user.userId, dto);
  }

  /**
   * PUT /v1/trips/:tripId/activities/:activityId
   * Update an activity
   */
  @Put(':tripId/activities/:activityId')
  @HttpCode(HttpStatus.OK)
  async updateActivity(
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @Param('activityId', ParseUUIDPipe) activityId: string,
    @Body(new ZodValidationPipe(UpdateActivitySchema)) dto: UpdateActivityInput,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.activityService.updateActivity(tripId, activityId, user.userId, dto);
  }

  /**
   * DELETE /v1/trips/:tripId/activities/:activityId
   * Delete an activity
   */
  @Delete(':tripId/activities/:activityId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteActivity(
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @Param('activityId', ParseUUIDPipe) activityId: string,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<void> {
    return this.activityService.deleteActivity(tripId, activityId, user.userId);
  }
}
