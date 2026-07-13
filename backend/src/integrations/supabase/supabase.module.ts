import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RealtimeTokenService } from './realtime-token.service';

@Module({
  imports: [ConfigModule],
  providers: [RealtimeTokenService],
  exports: [RealtimeTokenService],
})
export class SupabaseModule {}
