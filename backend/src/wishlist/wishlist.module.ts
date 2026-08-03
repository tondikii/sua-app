import { Module } from '@nestjs/common';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
import { PrismaModule } from '../prisma/prisma.module';
import { TripsModule } from '../trips/trips.module';
import { GoogleMapsModule } from '../common/google-maps/google-maps.module';
import { R2Module } from '../integrations/r2/r2.module';

@Module({
  imports: [PrismaModule, TripsModule, GoogleMapsModule, R2Module],
  controllers: [WishlistController],
  providers: [WishlistService],
  exports: [WishlistService],
})
export class WishlistModule {}
