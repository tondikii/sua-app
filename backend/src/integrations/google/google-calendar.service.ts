import { Injectable, Logger, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { PrismaService } from '../../prisma/prisma.service';

const CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar.events';
const CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3';
const CALLBACK_PATH = '/v1/integrations/google-calendar/callback';

interface StoredTokens {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: Date | null;
}

/**
 * Google Calendar integration (M16) — per-user OAuth.
 *
 * The user authorizes the app to create events in their OWN calendar
 * (`calendarId: 'primary'`) with the `calendar.events` scope. Access tokens
 * are stored on the User row and refreshed automatically via refresh token.
 */
@Injectable()
export class GoogleCalendarService {
  private readonly logger = new Logger(GoogleCalendarService.name);
  private readonly oauth: OAuth2Client;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly appWebUrl: string;

  constructor(
    private readonly prisma: PrismaService,
    config: ConfigService,
  ) {
    this.clientId = config.get<string>('google.calendarClientId') ?? '';
    this.clientSecret = config.get<string>('google.calendarClientSecret') ?? '';
    this.appWebUrl = config.get<string>('app.webUrl') ?? 'http://localhost:8081';
    this.oauth = new OAuth2Client({
      clientId: this.clientId,
      clientSecret: this.clientSecret,
      redirectUri: this.redirectUri(),
    });
  }

  private redirectUri(): string {
    const port = process.env.PORT ?? '8080';
    return `http://localhost:${port}${CALLBACK_PATH}`;
  }

  get configured(): boolean {
    return !!this.clientId && !!this.clientSecret;
  }

  /**
   * Build the Google OAuth consent URL. `access_type=offline` + `prompt=consent`
   * guarantee a refresh_token on first authorization.
   */
  buildAuthUrl(userId: string, redirectPath = '/trip'): string {
    if (!this.configured) {
      throw new BadRequestException({
        code: 'CALENDAR_NOT_CONFIGURED',
        message: 'Google Calendar integration is not configured on the server',
      });
    }
    const state = Buffer.from(JSON.stringify({ userId, redirectPath })).toString('base64url');
    return this.oauth.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: CALENDAR_SCOPE,
      state,
    });
  }

  /**
   * Exchange an OAuth authorization code for tokens and store them on the user.
   * Returns the redirect target so the client can bounce back into the app.
   */
  async handleCallback(code: string, state: string): Promise<{ redirectUrl: string }> {
    let userId: string;
    let redirectPath = '/';
    try {
      const parsed = JSON.parse(Buffer.from(state, 'base64url').toString());
      userId = parsed.userId as string;
      redirectPath = (parsed.redirectPath as string) || '/';
    } catch {
      throw new BadRequestException({ code: 'INVALID_OAUTH_STATE', message: 'Invalid OAuth state' });
    }

    const { tokens } = await this.oauth.getToken(code);
    if (!tokens.access_token) {
      throw new BadRequestException({
        code: 'OAUTH_NO_ACCESS_TOKEN',
        message: 'Google did not return an access token',
      });
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        googleAccessToken: tokens.access_token,
        googleRefreshToken: tokens.refresh_token ?? null,
        googleTokenExpiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
      },
    });

    return { redirectUrl: `${this.appWebUrl}${redirectPath}` };
  }

  /** True when the user has stored calendar tokens. */
  async isConnected(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
      select: { googleAccessToken: true, googleRefreshToken: true },
    });
    return !!user?.googleAccessToken;
  }

  /** Fetch stored tokens; refresh via refresh_token when expired. */
  private async getAccessToken(userId: string): Promise<string> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
      select: {
        googleAccessToken: true,
        googleRefreshToken: true,
        googleTokenExpiresAt: true,
      },
    });
    if (!user?.googleAccessToken) {
      throw new UnauthorizedException({
        code: 'CALENDAR_NOT_CONNECTED',
        message: 'Google Calendar belum dihubungkan. Silakan hubungkan dulu.',
      });
    }

    const tokens: StoredTokens = {
      accessToken: user.googleAccessToken,
      refreshToken: user.googleRefreshToken,
      expiresAt: user.googleTokenExpiresAt,
    };

    const expired = !tokens.expiresAt || tokens.expiresAt.getTime() <= Date.now() + 60_000;
    if (expired) {
      if (!tokens.refreshToken) {
        throw new UnauthorizedException({
          code: 'CALENDAR_TOKEN_EXPIRED',
          message: 'Sesi Google Calendar sudah berakhir. Hubungkan ulang.',
        });
      }
      this.oauth.setCredentials({ refresh_token: tokens.refreshToken });
      const { credentials } = await this.oauth.refreshAccessToken();
      if (!credentials.access_token) {
        throw new UnauthorizedException({
          code: 'CALENDAR_REFRESH_FAILED',
          message: 'Gagal memperbarui sesi Google Calendar. Hubungkan ulang.',
        });
      }
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          googleAccessToken: credentials.access_token,
          googleTokenExpiresAt: credentials.expiry_date
            ? new Date(credentials.expiry_date)
            : null,
        },
      });
      return credentials.access_token;
    }

    return tokens.accessToken!;
  }

  /**
   * Create a calendar event for the trip in the user's own calendar.
   * - All-day trips → `start.date`/`end.date` (end exclusive: end_date + 1 day).
   * - Timed trips → `start.dateTime`/`end.dateTime` as local wall-clock,
   *   combining the stored date + HH:MM without any timezone conversion.
   */
  async createEvent(
    userId: string,
    trip: {
      name: string;
      startDate: string | null;
      endDate: string | null;
      isAllDay: boolean;
      startTime: string | null;
      endTime: string | null;
    },
  ): Promise<{ id: string; html_link: string | null }> {
    if (!trip.startDate) {
      throw new BadRequestException({
        code: 'TRIP_NO_DATE',
        message: 'Perjalanan belum memiliki tanggal',
      });
    }

    const accessToken = await this.getAccessToken(userId);
    const endDate = trip.endDate ?? trip.startDate;

    let event: Record<string, unknown>;
    if (trip.isAllDay) {
      event = {
        summary: trip.name,
        start: { date: trip.startDate },
        end: { date: this.addDays(endDate, 1) },
      };
    } else {
      const startDateTime = this.combineDateTime(trip.startDate, trip.startTime ?? '09:00');
      const endDateTime = this.combineDateTime(endDate, trip.endTime ?? '10:00');
      event = {
        summary: trip.name,
        start: { dateTime: startDateTime },
        end: { dateTime: endDateTime },
      };
    }

    const res = await fetch(`${CALENDAR_API_BASE}/calendars/primary/events`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });

    if (!res.ok) {
      const body = await res.text();
      this.logger.error(`Google Calendar API error ${res.status}: ${body}`);
      throw new BadRequestException({
        code: 'GOOGLE_CALENDAR_ERROR',
        message: 'Gagal menambahkan event ke Google Calendar',
      });
    }

    const data = (await res.json()) as { id: string; htmlLink?: string };
    return { id: data.id, html_link: data.htmlLink ?? null };
  }

  /** Add one day to a YYYY-MM-DD string (Google all-day end is exclusive). */
  private addDays(dateStr: string, days: number): string {
    const [y, m, d] = dateStr.split('-').map(Number);
    const dt = new Date(y, m - 1, d + days);
    const yy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const dd = String(dt.getDate()).padStart(2, '0');
    return `${yy}-${mm}-${dd}`;
  }

  /** Combine YYYY-MM-DD + HH:MM into a local wall-clock RFC3339 string. */
  private combineDateTime(dateStr: string, timeStr: string): string {
    return `${dateStr}T${timeStr}:00`;
  }
}
