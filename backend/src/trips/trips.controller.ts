import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../common/decorators/current-user.decorator';
import { TripsService } from './trips.service';
import { InvitationsService } from './invitations.service';
import {
  CreateTripDto,
  UpdateTripDto,
  CreateInvitationDto,
  RespondInvitationDto,
  SetTripCoverDto,
} from './dto';

@ApiTags('trips')
@ApiBearerAuth()
@Controller('trips')
@UseGuards(JwtAuthGuard)
export class TripsController {
  constructor(
    private readonly tripsService: TripsService,
    private readonly invitationsService: InvitationsService,
  ) {}

  // POST /v1/trips
  @Post()
  createTrip(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateTripDto) {
    return this.tripsService.createTrip(user.userId, dto);
  }

  // GET /v1/trips?tab=upcoming|completed&cursor=&limit=
  @Get()
  listTrips(
    @CurrentUser() user: CurrentUserPayload,
    @Query('tab') tab: 'upcoming' | 'completed' = 'upcoming',
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    if (!['upcoming', 'completed'].includes(tab)) {
      throw new BadRequestException({
        code: 'INVALID_TAB',
        message: 'tab must be "upcoming" or "completed"',
      });
    }
    return this.tripsService.listTrips(
      user.userId,
      tab,
      cursor,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  // GET /v1/trips/invitations  (must precede :tripId)
  @Get('invitations')
  getMyInvitations(
    @CurrentUser() user: CurrentUserPayload,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    return this.invitationsService.getUserInvitations(
      user.userId,
      cursor,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  // GET /v1/trips/:tripId
  @Get(':tripId')
  getTripDetail(
    @CurrentUser() user: CurrentUserPayload,
    @Param('tripId') tripId: string,
  ) {
    return this.tripsService.getTripDetail(tripId, user.userId);
  }

  // PUT /v1/trips/:tripId  (creator only)
  @Put(':tripId')
  updateTrip(
    @CurrentUser() user: CurrentUserPayload,
    @Param('tripId') tripId: string,
    @Body() dto: UpdateTripDto,
  ) {
    return this.tripsService.updateTrip(tripId, user.userId, dto);
  }

  // DELETE /v1/trips/:tripId  (soft delete, creator only)
  @Delete(':tripId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTrip(
    @CurrentUser() user: CurrentUserPayload,
    @Param('tripId') tripId: string,
  ) {
    return this.tripsService.deleteTrip(tripId, user.userId);
  }

  // PUT /v1/trips/:tripId/cover
  @Put(':tripId/cover')
  setTripCover(
    @CurrentUser() user: CurrentUserPayload,
    @Param('tripId') tripId: string,
    @Body() dto: SetTripCoverDto,
  ) {
    return this.tripsService.setTripCover(tripId, user.userId, dto.document_id);
  }

  // GET /v1/trips/:tripId/members
  @Get(':tripId/members')
  getTripMembers(
    @CurrentUser() user: CurrentUserPayload,
    @Param('tripId') tripId: string,
  ) {
    return this.tripsService.getTripMembers(tripId, user.userId);
  }

  // DELETE /v1/trips/:tripId/members/:memberId  (creator only)
  @Delete(':tripId/members/:memberId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeMember(
    @CurrentUser() user: CurrentUserPayload,
    @Param('tripId') tripId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.tripsService.removeMember(tripId, memberId, user.userId);
  }

  // POST /v1/trips/:tripId/invitations
  @Post(':tripId/invitations')
  createInvitation(
    @CurrentUser() user: CurrentUserPayload,
    @Param('tripId') tripId: string,
    @Body() dto: CreateInvitationDto,
  ) {
    return this.invitationsService.createInvitation(tripId, user.userId, dto);
  }

  // PUT /v1/trips/:tripId/invitations/:invitationId  (accept/decline)
  @Put(':tripId/invitations/:invitationId')
  @HttpCode(HttpStatus.NO_CONTENT)
  respondToInvitation(
    @CurrentUser() user: CurrentUserPayload,
    @Param('tripId') tripId: string,
    @Param('invitationId') invitationId: string,
    @Body() dto: RespondInvitationDto,
  ) {
    return this.invitationsService.respondToInvitation(
      tripId,
      invitationId,
      user.userId,
      dto.accept,
    );
  }

  // DELETE /v1/trips/:tripId/invitations/:invitationId  (cancel, inviter only)
  @Delete(':tripId/invitations/:invitationId')
  @HttpCode(HttpStatus.NO_CONTENT)
  cancelInvitation(
    @CurrentUser() user: CurrentUserPayload,
    @Param('tripId') tripId: string,
    @Param('invitationId') invitationId: string,
  ) {
    return this.invitationsService.cancelInvitation(tripId, invitationId, user.userId);
  }
}
