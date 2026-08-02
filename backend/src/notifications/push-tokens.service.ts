import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { RegisterPushTokenInput } from '@atur-perjalanan/shared-validation';

@Injectable()
export class PushTokensService {
  constructor(private readonly prisma: PrismaService) {}

  /** Register (or refresh) a device push token for the current user. */
  async register(userId: string, dto: RegisterPushTokenInput) {
    return this.prisma.pushToken.upsert({
      where: { userId_token: { userId, token: dto.token } },
      create: {
        userId,
        token: dto.token,
        platform: dto.platform,
      },
      update: { platform: dto.platform },
    });
  }

  /** Remove a device push token (e.g. on sign-out or invalid token). */
  async unregister(userId: string, token: string) {
    await this.prisma.pushToken.deleteMany({
      where: { userId, token },
    });
  }
}
