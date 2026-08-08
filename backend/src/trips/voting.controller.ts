import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../common/decorators/current-user.decorator';
import { VotingService } from './voting.service';
import { CreatePollSchema, UpdatePollSchema, VoteSchema } from '@atur-perjalanan/shared-validation';
import type { CreatePollInput, UpdatePollInput } from '@atur-perjalanan/shared-validation';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@ApiTags('voting')
@ApiBearerAuth()
@Controller('trips')
@UseGuards(JwtAuthGuard)
export class VotingController {
  constructor(private readonly votingService: VotingService) {}

  // GET /v1/trips/:tripId/polls
  @Get(':tripId/polls')
  listPolls(
    @CurrentUser() user: CurrentUserPayload,
    @Param('tripId', ParseUUIDPipe) tripId: string,
  ) {
    return this.votingService.listPolls(tripId, user.userId);
  }

  // POST /v1/trips/:tripId/polls
  @Post(':tripId/polls')
  @HttpCode(HttpStatus.CREATED)
  createPoll(
    @CurrentUser() user: CurrentUserPayload,
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @Body(new ZodValidationPipe(CreatePollSchema)) dto: CreatePollInput,
  ) {
    return this.votingService.createPoll(tripId, user.userId, dto);
  }

  // POST /v1/trips/:tripId/polls/:pollId/vote
  @Post(':tripId/polls/:pollId/vote')
  @HttpCode(HttpStatus.NO_CONTENT)
  voteOnPoll(
    @CurrentUser() user: CurrentUserPayload,
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @Param('pollId', ParseUUIDPipe) pollId: string,
    @Body(new ZodValidationPipe(VoteSchema)) dto: { option_id: string },
  ) {
    return this.votingService.voteOnPoll(tripId, pollId, user.userId, dto.option_id);
  }

  // PATCH /v1/trips/:tripId/polls/:pollId  (edit poll — creator only)
  @Patch(':tripId/polls/:pollId')
  updatePoll(
    @CurrentUser() user: CurrentUserPayload,
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @Param('pollId', ParseUUIDPipe) pollId: string,
    @Body(new ZodValidationPipe(UpdatePollSchema)) dto: UpdatePollInput,
  ) {
    return this.votingService.updatePoll(tripId, pollId, user.userId, dto);
  }

  // DELETE /v1/trips/:tripId/polls/:pollId/vote
  @Delete(':tripId/polls/:pollId/vote')
  @HttpCode(HttpStatus.NO_CONTENT)
  retractVote(
    @CurrentUser() user: CurrentUserPayload,
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @Param('pollId', ParseUUIDPipe) pollId: string,
  ) {
    return this.votingService.retractVote(tripId, pollId, user.userId);
  }

  // POST /v1/trips/:tripId/candidates/:candidateId/vote
  @Post(':tripId/candidates/:candidateId/vote')
  @HttpCode(HttpStatus.NO_CONTENT)
  voteOnDateCandidate(
    @CurrentUser() user: CurrentUserPayload,
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @Param('candidateId', ParseUUIDPipe) candidateId: string,
  ) {
    return this.votingService.voteOnDateCandidate(tripId, candidateId, user.userId);
  }

  // DELETE /v1/trips/:tripId/candidates/:candidateId/vote
  @Delete(':tripId/candidates/:candidateId/vote')
  @HttpCode(HttpStatus.NO_CONTENT)
  retractDateVote(
    @CurrentUser() user: CurrentUserPayload,
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @Param('candidateId', ParseUUIDPipe) candidateId: string,
  ) {
    return this.votingService.retractDateVote(tripId, candidateId, user.userId);
  }

  // POST /v1/trips/:tripId/polls/:pollId/lock
  @Post(':tripId/polls/:pollId/lock')
  @HttpCode(HttpStatus.NO_CONTENT)
  lockPoll(
    @CurrentUser() user: CurrentUserPayload,
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @Param('pollId', ParseUUIDPipe) pollId: string,
    @Body() _dto: Record<string, never>, // Empty body, but accepts {}
  ) {
    return this.votingService.lockPoll(tripId, pollId, user.userId);
  }

  // DELETE /v1/trips/:tripId/polls/:pollId
  @Delete(':tripId/polls/:pollId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deletePoll(
    @CurrentUser() user: CurrentUserPayload,
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @Param('pollId', ParseUUIDPipe) pollId: string,
  ) {
    return this.votingService.deletePoll(tripId, pollId, user.userId);
  }
}
