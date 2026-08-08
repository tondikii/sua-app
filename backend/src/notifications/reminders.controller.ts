import { Controller, Post, Headers, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VotingReminderService } from './voting-reminder.service';
import { TripStartReminderService } from './trip-start-reminder.service';

/**
 * External-cron trigger for the hourly reminder passes.
 *
 * Vercel serverless functions have no in-process scheduler (@nestjs/schedule
 * cannot run there), so an external scheduler (cron-job.org / GitHub Actions)
 * POSTs to this endpoint ~every hour. The request must carry the shared
 * `CRON_SECRET` in the `x-cron-secret` header.
 */
@Controller('cron/reminders')
export class RemindersController {
  private readonly cronSecret: string;

  constructor(
    private readonly config: ConfigService,
    private readonly votingReminders: VotingReminderService,
    private readonly tripStartReminders: TripStartReminderService,
  ) {
    this.cronSecret = this.config.get<string>('cronSecret') ?? '';
  }

  @Post()
  async runAll(
    @Headers('x-cron-secret') secret?: string,
  ): Promise<{ ok: true; voting: string; trip_start: string }> {
    if (!this.cronSecret || secret !== this.cronSecret) {
      throw new UnauthorizedException({ code: 'INVALID_CRON_SECRET' });
    }

    const [voting, tripStart] = await Promise.all([
      this.votingReminders.handleVotingReminders(),
      this.tripStartReminders.handleTripStartReminders(),
    ]);

    return {
      ok: true,
      voting: voting ?? 'done',
      trip_start: tripStart ?? 'done',
    };
  }
}
