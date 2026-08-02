import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '@prisma/client';

interface PushSendOptions {
  type: NotificationType;
  actorId?: string;
  tripId?: string;
  payload?: Record<string, any>;
}

interface PushTokenRow {
  userId: string;
  token: string;
}

/**
 * PushNotificationsService
 *
 * Fire-and-forget Expo push fan-out. In-app notifications are written by
 * NotificationsService; this service mirrors each one as a push notification
 * to the recipient's registered devices (Expo push tokens).
 *
 * Never blocks the HTTP response: `sendAsync` swallows errors and logs them
 * (same pattern as `scheduleThumbnailResolve` in ActivityService).
 *
 * Dev no-op: when EXPO_ACCESS_TOKEN is not configured the service logs at
 * debug level and returns — in-app notifications still work.
 */
@Injectable()
export class PushNotificationsService {
  private readonly logger = new Logger(PushNotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  /** Fire-and-forget wrapper — never rejects. */
  sendAsync(recipientIds: string[], opts: PushSendOptions): void {
    if (recipientIds.length === 0) return;
    this.send(recipientIds, opts).catch((err) => {
      this.logger.warn(`Push notification failed: ${err.message ?? err}`);
    });
  }

  private async send(recipientIds: string[], opts: PushSendOptions): Promise<void> {
    const accessToken = this.config.get<string>('expo.accessToken');
    if (!accessToken) {
      this.logger.debug('EXPO_ACCESS_TOKEN not configured — skipping push');
      return;
    }

    // Resolve display names for the message body (batched, no N+1).
    const actor = opts.actorId
      ? await this.prisma.user.findUnique({
          where: { id: opts.actorId },
          select: { name: true },
        })
      : null;
    const trip = opts.tripId
      ? await this.prisma.trip.findUnique({
          where: { id: opts.tripId },
          select: { name: true },
        })
      : null;

    const tokens = await this.prisma.pushToken.findMany({
      where: { userId: { in: recipientIds } },
      select: { userId: true, token: true },
    });

    const { title, body, data } = this.buildContent(opts, actor?.name, trip?.name);
    const { Expo } = await import('expo-server-sdk');
    const expo = new Expo({ accessToken });

    const validTokens: PushTokenRow[] = tokens.filter((t) =>
      Expo.isExpoPushToken(t.token),
    );
    if (validTokens.length === 0) return;

    const messages = validTokens.map((t) => ({
      to: t.token,
      title,
      body,
      data,
      sound: 'default',
    }));

    const ticketChunks = await expo.chunkPushNotifications(messages);
    const tickets = [];
    for (const chunk of ticketChunks) {
      const sent = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...sent);
    }

    await this.pruneInvalidTokens(validTokens, tickets);
  }

  /** Map a notification to its push title/body/data. */
  private buildContent(
    opts: PushSendOptions,
    actorName?: string,
    tripName?: string,
  ): { title: string; body: string; data: Record<string, unknown> } {
    const name = actorName ?? 'Seseorang';
    const trip = tripName ?? 'perjalanan';
    const payload = opts.payload ?? {};

    switch (opts.type) {
      case 'invite':
        return {
          title: 'Undangan Perjalanan',
          body: `${name} mengundangmu ke ${trip}`,
          data: {
            type: opts.type,
            trip_id: opts.tripId,
            invitation_id: payload.invitation_id ?? null,
          },
        };
      case 'voting_deadline':
        return {
          title: 'Voting Segera Berakhir',
          body: `Voting ${trip} segera berakhir. Ayo vote sekarang!`,
          data: {
            type: opts.type,
            trip_id: opts.tripId,
            poll_id: payload.poll_id ?? null,
          },
        };
      case 'activity_update': {
        const activityName = (payload.activity_name as string) ?? 'aktivitas';
        return {
          title: 'Aktivitas Baru',
          body: `${name} menambahkan aktivitas ${activityName} di ${trip}`,
          data: {
            type: opts.type,
            trip_id: opts.tripId,
            activity_id: payload.activity_id ?? null,
          },
        };
      }
      default:
        return {
          title: 'Notifikasi Baru',
          body: 'Kamu punya notifikasi baru di Atur Perjalanan.',
          data: { type: opts.type },
        };
    }
  }

  /** Remove tokens that Expo reports as invalid/unregistered (device hygiene). */
  private async pruneInvalidTokens(
    tokens: PushTokenRow[],
    tickets: Array<{ status: string; id?: string }>,
  ): Promise<void> {
    const invalid = new Set<string>();
    tickets.forEach((ticket, i) => {
      const token = tokens[i]?.token;
      if (!token) return;
      if (ticket.status === 'error') {
        const errCode = (ticket as any).details?.error;
        if (errCode === 'DeviceNotRegistered' || errCode === 'InvalidExpoToken') {
          invalid.add(token);
        }
      }
    });
    if (invalid.size === 0) return;

    await this.prisma.pushToken.deleteMany({
      where: { token: { in: [...invalid] } },
    });
    this.logger.log(`Pruned ${invalid.size} invalid push token(s)`);
  }
}
