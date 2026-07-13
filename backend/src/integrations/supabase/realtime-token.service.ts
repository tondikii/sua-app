import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

const REALTIME_TOKEN_TTL_SECONDS = 60 * 60; // 1 hour

/**
 * Mints a short-lived, Supabase-compatible JWT so the mobile client can open
 * a Supabase Realtime WebSocket whose `auth.uid()` resolves to the app's own
 * user id (ARCHITECTURE §6). This token is NEVER used against NestJS REST
 * endpoints — only to authenticate the Supabase Realtime connection.
 */
@Injectable()
export class RealtimeTokenService {
  constructor(private readonly config: ConfigService) {}

  mint(userId: string): string {
    const secret =
      this.config.get<string>('supabase.jwtSecret') ??
      this.config.get<string>('SUPABASE_JWT_SECRET') ??
      '';

    // Gracefully no-op when the secret isn't configured (e.g. local dev without
    // Realtime) rather than throwing and breaking the whole sign-in response.
    if (!secret) return '';

    return jwt.sign(
      {
        sub: userId,
        role: 'authenticated',
        aud: 'authenticated',
      },
      secret,
      { expiresIn: REALTIME_TOKEN_TTL_SECONDS },
    );
  }
}
