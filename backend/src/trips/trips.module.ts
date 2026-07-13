import { Module } from '@nestjs/common';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import { InvitationsService } from './invitations.service';
import { VotingService } from './voting.service';
import { VotingController } from './voting.controller';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { ChatService } from "./chat.service";
import { ChatController } from './chat.controller';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { UploadsController } from './upload.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { GoogleMapsModule } from '../common/google-maps/google-maps.module';
import { R2Module } from '../integrations/r2/r2.module';

@Module({
  imports: [PrismaModule, GoogleMapsModule, R2Module],
  controllers: [TripsController, VotingController, ActivityController, ChatController, MediaController, UploadsController],
  providers: [TripsService, InvitationsService, VotingService, ActivityService, ChatService, MediaService],
  exports: [TripsService, InvitationsService, VotingService, ActivityService, ChatService, MediaService],
})
export class TripsModule {}

