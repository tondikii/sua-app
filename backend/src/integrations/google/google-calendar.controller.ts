import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Res,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import type { Response } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { GoogleCalendarService } from './google-calendar.service';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('integrations/google-calendar')
@Controller('integrations/google-calendar')
export class GoogleCalendarController {
  constructor(
    private readonly googleCalendar: GoogleCalendarService,
    private readonly prisma: PrismaService,
  ) {}

  // GET /v1/integrations/google-calendar/status — JWT
  @Get('status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getStatus(@CurrentUser() user: CurrentUserPayload) {
    const connected = await this.googleCalendar.isConnected(user.userId);
    return { connected };
  }

  // GET /v1/integrations/google-calendar/auth-url — JWT
  @Get('auth-url')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getAuthUrl(
    @CurrentUser() user: CurrentUserPayload,
    @Query('redirect') redirect?: string,
  ) {
    const authUrl = await this.googleCalendar.buildAuthUrl(
      user.userId,
      redirect || '/',
    );
    return { auth_url: authUrl };
  }

  // GET /v1/integrations/google-calendar/callback — public OAuth callback
  @Get('callback')
  async callback(
    @Query('code') code: string | undefined,
    @Query('state') state: string | undefined,
    @Res() res: Response,
  ) {
    if (!code || !state) {
      throw new BadRequestException({ code: 'MISSING_OAUTH_PARAMS', message: 'Missing code/state' });
    }
    const { redirectUrl } = await this.googleCalendar.handleCallback(code, state);
    return res.redirect(redirectUrl);
  }

  // POST /v1/integrations/google-calendar/events — JWT
  @Post('events')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createEvent(
    @CurrentUser() user: CurrentUserPayload,
    @Body() body: { trip_id?: string },
  ) {
    if (!body.trip_id) {
      throw new BadRequestException({ code: 'TRIP_ID_REQUIRED', message: 'trip_id wajib diisi' });
    }

    const trip = await this.prisma.trip.findFirst({
      where: { id: body.trip_id, deletedAt: null },
      select: {
        id: true,
        name: true,
        status: true,
        startDate: true,
        endDate: true,
        isAllDay: true,
        startTime: true,
        endTime: true,
        tags: true,
        creator: { select: { name: true, email: true } },
        participants: {
          include: { user: { select: { name: true, email: true } } },
        },
        activities: {
          orderBy: [{ dayNumber: 'asc' }, { startTime: 'asc' }],
          select: {
            placeName: true,
            locationLabel: true,
            mapsLink: true,
            dayNumber: true,
            startTime: true,
            endTime: true,
          },
        },
      },
    });
    if (!trip) {
      throw new BadRequestException({ code: 'TRIP_NOT_FOUND', message: 'Perjalanan tidak ditemukan' });
    }
    if (trip.status !== 'fixed') {
      throw new BadRequestException({
        code: 'TRIP_DATE_NOT_FIXED',
        message: 'Tanggal perjalanan belum dikunci. Tambahkan ke kalender setelah tanggal diputuskan.',
      });
    }

    const tags = (trip.tags as string[]) ?? [];
    const participantNames = trip.participants
      .map((p) => p.user.name)
      .filter((n): n is string => Boolean(n));
    const creatorName = trip.creator?.name;

    // Description: who's going + date range.
    const dateLabel = trip.startDate
      ? `${this.toDateOnly(trip.startDate)}${trip.endDate && this.toDateOnly(trip.endDate) !== this.toDateOnly(trip.startDate) ? ` s/d ${this.toDateOnly(trip.endDate)}` : ''}`
      : '';
    const who = [creatorName ? `Dibuat oleh: ${creatorName}` : null, participantNames.length ? `Peserta: ${participantNames.join(', ')}` : null]
      .filter(Boolean)
      .join('\n');
    const description = [who, dateLabel ? `Tanggal: ${dateLabel}` : null, tags.length ? `Tag: ${tags.join(' ')}` : null]
      .filter(Boolean)
      .join('\n');

    // Location from the first activity that has one.
    const locationActivity = trip.activities.find((a) => a.locationLabel || a.mapsLink);
    const location = locationActivity
      ? (locationActivity.locationLabel ?? locationActivity.mapsLink ?? null)
      : null;

    // Itinerary summary per day.
    const byDay = new Map<number, typeof trip.activities>();
    for (const a of trip.activities) {
      const d = a.dayNumber ?? 1;
      if (!byDay.has(d)) byDay.set(d, []);
      byDay.get(d)!.push(a);
    }
    const itineraryLines: string[] = [];
    for (const [day, acts] of [...byDay.entries()].sort((a, b) => a[0] - b[0])) {
      const time = (a: { startTime: Date | null }) => (a.startTime ? this.toTime(a.startTime) : '');
      const actsStr = acts
        .map((a) => `${time(a)} ${a.placeName}${a.locationLabel ? ` (${a.locationLabel})` : ''}`)
        .join('\n');
      itineraryLines.push(`Hari ${day}:\n${actsStr}`);
    }

    return this.googleCalendar.createEvent(user.userId, {
      name: trip.name,
      startDate: trip.startDate ? this.toDateOnly(trip.startDate) : null,
      endDate: trip.endDate ? this.toDateOnly(trip.endDate) : null,
      isAllDay: trip.isAllDay,
      startTime: trip.startTime ? this.toTime(trip.startTime) : null,
      endTime: trip.endTime ? this.toTime(trip.endTime) : null,
      tags,
      description,
      location,
      attendees: trip.participants.map((p) => p.user.email).filter((e): e is string => Boolean(e)),
      itinerary: itineraryLines.length ? itineraryLines.join('\n\n') : undefined,
    });
  }

  private toDateOnly(d: Date): string {
    return d.toISOString().slice(0, 10);
  }

  private toTime(d: Date): string {
    const h = String(d.getUTCHours()).padStart(2, '0');
    const m = String(d.getUTCMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  }
}
