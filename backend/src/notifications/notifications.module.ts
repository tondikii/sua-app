import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { VotingReminderService } from './voting-reminder.service';
import { TripStartReminderService } from './trip-start-reminder.service';
import { RemindersController } from './reminders.controller';
import { PushNotificationsService } from './push-notifications.service';
import { PushTokensService } from './push-tokens.service';
import { PushTokensController } from './push-tokens.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { R2Module } from '../integrations/r2/r2.module';

@Module({
  imports: [PrismaModule, R2Module],
  controllers: [NotificationsController, PushTokensController, RemindersController],
  providers: [
    NotificationsService,
    VotingReminderService,
    TripStartReminderService,
    PushNotificationsService,
    PushTokensService,
  ],
  exports: [NotificationsService], // Export for other services to use
})
export class NotificationsModule {}
