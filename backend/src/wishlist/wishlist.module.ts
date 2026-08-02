import { Module } from '@nestjs/common';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
import { PrismaModule } from '../prisma/prisma.module';
import { TripsModule } from '../trips/trips.module';
import { GoogleMapsModule } from '../common/google-maps/google-maps.module';

@Module({
  imports: [PrismaModule, TripsModule, GoogleMapsModule],
  controllers: [WishlistController],
  providers: [WishlistService],
  exports: [WishlistService],
})
export class WishlistModule {}
