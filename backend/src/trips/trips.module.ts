import { Module } from '@nestjs/common';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import { InvitationsService } from './invitations.service';
import { VotingService } from './voting.service';
import { VotingController } from './voting.controller';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { GoogleMapsModule } from '../common/google-maps/google-maps.module';

@Module({
  imports: [PrismaModule, GoogleMapsModule],
  controllers: [TripsController, VotingController, ActivityController],
  providers: [TripsService, InvitationsService, VotingService, ActivityService],
  exports: [TripsService, InvitationsService, VotingService, ActivityService],
})
export class TripsModule {}

