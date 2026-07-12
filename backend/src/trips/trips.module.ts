import { Module } from '@nestjs/common';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import { InvitationsService } from './invitations.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TripsController],
  providers: [TripsService, InvitationsService],
  exports: [TripsService, InvitationsService],
})
export class TripsModule {}
