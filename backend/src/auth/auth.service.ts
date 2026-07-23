import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { PrismaService } from '../prisma/prisma.service';
import type {
  GoogleAuthInput,
  CompleteRegistrationInput,
} from '@atur-perjalanan/shared-validation';
import { UserSummarySerializer } from '../users/serializers/user.serializer';
import { RealtimeTokenService } from '../integrations/supabase/realtime-token.service';

@Injectable()
export class AuthService {
  private readonly googleClient: OAuth2Client;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly realtimeToken: RealtimeTokenService,
  ) {
    this.googleClient = new OAuth2Client(config.get<string>('google.clientId'));
  }

  async googleLogin(dto: GoogleAuthInput) {
    // Verify the Google ID token
    let ticket;
    try {
      ticket = await this.googleClient.verifyIdToken({
        idToken: dto.id_token,
        audience: this.config.get<string>('google.clientId'),
      });
    } catch {
      throw new UnauthorizedException('Invalid Google ID token');
    }

    const payload = ticket.getPayload();
    if (!payload || !payload.sub || !payload.email) {
      throw new UnauthorizedException('Invalid Google token payload');
    }

    // Upsert user
    const existing = await this.prisma.user.findFirst({
      where: { googleId: payload.sub },
    });

    let isNewUser = false;

    const user = existing
      ? await this.prisma.user.update({
          where: { id: existing.id },
          data: {
            email: payload.email,
            name: payload.name ?? existing.name,
            avatarUrl: payload.picture ?? existing.avatarUrl,
          },
        })
      : await (async () => {
          isNewUser = true;
          // Generate a temporary placeholder username — must be replaced via complete-registration
          const tempUsername = `user_${Date.now()}`;
          return this.prisma.user.create({
            data: {
              googleId: payload.sub,
              email: payload.email ?? '',
              name: payload.name ?? payload.email ?? 'User',
              username: tempUsername,
              avatarUrl: payload.picture,
            },
          });
        })();

    // Check if user still has placeholder username (starts with "user_" and no real username set)
    const needsRegistration = isNewUser || /^user_\d+$/.test(user.username);

    const accessToken = this.signAppJwt(user.id);
    const realtimeToken = this.realtimeToken.mint(user.id);

    return {
      access_token: accessToken,
      realtime_token: realtimeToken,
      is_new_user: needsRegistration,
      ...(needsRegistration ? {} : { user: UserSummarySerializer.toProfile(user) }),
    };
  }

  async completeRegistration(userId: string, dto: CompleteRegistrationInput) {
    const username = dto.username.toLowerCase();

    // Check uniqueness
    const conflict = await this.prisma.user.findFirst({
      where: { username, NOT: { id: userId } },
    });
    if (conflict) {
      throw new ConflictException({
        code: 'USERNAME_TAKEN',
        message: 'Username is already taken',
      });
    }

    // Validate format (belt-and-suspenders beyond DTO)
    if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
      throw new BadRequestException({
        code: 'USERNAME_INVALID',
        message: 'Username must be 3–30 characters: letters, numbers, underscores only',
      });
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { username },
    });

    return { user: UserSummarySerializer.toProfile(user) };
  }

  private signAppJwt(userId: string): string {
    return this.jwtService.sign({ sub: userId });
  }
}
