import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleMapsService } from '../common/google-maps/google-maps.service';
import { ActivitySerializer } from './serializers/activity.serializer';
import { R2Service } from '../integrations/r2/r2.service';
import { NotificationsService } from '../notifications/notifications.service';
import { timeToHHMM } from '../common/helpers/date.helpers';

@Injectable()
export class ActivityService {
  private readonly logger = new Logger(ActivityService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly googleMaps: GoogleMapsService,
    private readonly r2: R2Service,
    private readonly notifications: NotificationsService,
  ) {}

  /**
   * List all activities for a trip, grouped by date & sorted by start_time.
   * Only participants can view.
   */
  async listActivities(tripId: string, userId: string) {
    // Verify trip exists and user is participant
    const trip = await this.prisma.trip.findFirst({
      where: {
        id: tripId,
        participants: { some: { userId } },
      },
      include: { participants: { select: { userId: true } } },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found or access denied');
    }

    const activities = await this.prisma.tripActivity.findMany({
      where: { tripId },
      include: { coverDocument: { select: { id: true, storageKey: true, storageUrl: true } } },
      orderBy: [{ dayNumber: 'asc' }, { startTime: 'asc' }],
    });

    const coverKeys = activities
      .filter((a) => !a.thumbnailUrl && a.coverDocument?.storageKey)
      .map((a) => a.coverDocument!.storageKey);
    const signedCoverUrls = await this.r2.presignDownloads(coverKeys);

    return {
      data: activities.map((a) =>
        ActivitySerializer.toList(
          a,
          a.coverDocument,
          a.thumbnailUrl ||
            (a.coverDocument?.storageKey
              ? (signedCoverUrls.get(a.coverDocument.storageKey) ?? null)
              : null),
        ),
      ),
      next_cursor: null,
    };
  }

  /**
   * Get a single activity by ID.
   * Only participants can view.
   */
  async getActivity(tripId: string, activityId: string, userId: string) {
    const trip = await this.prisma.trip.findFirst({
      where: {
        id: tripId,
        participants: { some: { userId } },
      },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found or access denied');
    }

    const activity = await this.prisma.tripActivity.findFirst({
      where: { id: activityId, tripId },
      include: { coverDocument: { select: { id: true, storageKey: true, storageUrl: true } } },
    });

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    return ActivitySerializer.toDetail(
      activity,
      activity.coverDocument,
      await this.resolveCoverThumbnailUrl(activity),
    );
  }

  /**
   * Create a new activity.
   * Participants can create. Validations:
   * - start_time <= end_time
   * - activity_date must fall within trip date range if trip.status='fixed'
   */
  async createActivity(tripId: string, userId: string, dto: any) {
    // Verify participant access
    const trip = await this.prisma.trip.findFirst({
      where: {
        id: tripId,
        participants: { some: { userId } },
      },
      include: { participants: true },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found or access denied');
    }

    // Validate time ordering
    const timeRegex = /^(\d{2}):(\d{2})$/;
    const startMatch = dto.start_time.match(timeRegex);
    const endMatch = dto.end_time.match(timeRegex);

    if (!startMatch || !endMatch) {
      throw new BadRequestException('Invalid time format (HH:MM required)');
    }

    const startMinutes = parseInt(startMatch[1]) * 60 + parseInt(startMatch[2]);
    const endMinutes = parseInt(endMatch[1]) * 60 + parseInt(endMatch[2]);

    if (startMinutes > endMinutes) {
      throw new BadRequestException('start_time must be <= end_time');
    }

    // Validate day_number for fixed trips
    const dayNumber = dto.day_number || 1;
    if (dayNumber < 1) {
      throw new BadRequestException('day_number must be >= 1');
    }

    if (trip.status === 'fixed' && trip.startDate && trip.endDate) {
      const totalDays = Math.ceil(
        (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / 86_400_000,
      ) + 1;
      if (dayNumber > totalDays) {
        throw new BadRequestException(`day_number must be <= ${totalDays} (trip duration)`);
      }
    }

    // Create activity
    const activity = await this.prisma.tripActivity.create({
      data: {
        tripId,
        placeName: dto.place_name,
        activityDate: dto.activity_date ? new Date(dto.activity_date) : null,
        dayNumber,
        startTime: this.parseTimeToDate(dto.start_time),
        endTime: this.parseTimeToDate(dto.end_time),
        kind: (dto.kind || 'activity') as any,
        description: dto.description,
        locationLabel: dto.location_label,
        mapsLink: dto.maps_link,
        refLinks: (dto.ref_links as any) || [],
        coverSource: (dto.cover_source || 'none') as any,
        coverIcon: dto.cover_icon,
        coverDocumentId: dto.cover_document_id,
        thumbnailUrl: dto.thumbnail_url,
        sortOrder: dto.sort_order || 0,
      },
      include: { coverDocument: { select: { id: true, storageKey: true, storageUrl: true } } },
    });

    // Create notifications for all trip participants (except the creator)
    const participantsToNotify = trip.participants
      .filter((p) => p.userId !== userId)
      .map((p) => p.userId);

    await this.notifications.createManyNotifications(
      participantsToNotify.map((participantId) => ({
        userId: participantId,
        type: 'activity_update',
        actorId: userId,
        tripId,
        payload: {
          activity_id: activity.id,
          activity_name: activity.placeName,
          action: 'created',
        },
      })),
    );

    this.scheduleThumbnailResolve(activity.id, dto.maps_link);

    return ActivitySerializer.toDetail(
      activity,
      activity.coverDocument,
      await this.resolveCoverThumbnailUrl(activity),
    );
  }

  /**
   * Update an existing activity.
   * Participants can edit. Same validations as create.
   */
  async updateActivity(tripId: string, activityId: string, userId: string, dto: any) {
    // Verify participant access
    const trip = await this.prisma.trip.findFirst({
      where: {
        id: tripId,
        participants: { some: { userId } },
      },
      include: { participants: true },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found or access denied');
    }

    // Fetch existing activity
    const existing = await this.prisma.tripActivity.findFirst({
      where: { id: activityId, tripId },
    });

    if (!existing) {
      throw new NotFoundException('Activity not found');
    }

    // Validate time ordering (if either time is provided)
    const startTime = dto.start_time || (existing.startTime ? timeToHHMM(existing.startTime) : undefined);
    const endTime = dto.end_time || (existing.endTime ? timeToHHMM(existing.endTime) : undefined);

    if ((dto.start_time || dto.end_time) && startTime && endTime) {
      const timeRegex = /^(\d{2}):(\d{2})$/;
      const startMatch = startTime.match(timeRegex);
      const endMatch = endTime.match(timeRegex);

      if (!startMatch || !endMatch) {
        throw new BadRequestException('Invalid time format (HH:MM required)');
      }

      const startMinutes = parseInt(startMatch[1]) * 60 + parseInt(startMatch[2]);
      const endMinutes = parseInt(endMatch[1]) * 60 + parseInt(endMatch[2]);

      if (startMinutes > endMinutes) {
        throw new BadRequestException('start_time must be <= end_time');
      }
    }

    // Validate day_number (if provided)
    const dayNumber = dto.day_number ?? existing.dayNumber;
    if (dayNumber < 1) {
      throw new BadRequestException('day_number must be >= 1');
    }
    if (trip.status === 'fixed' && trip.startDate && trip.endDate) {
      const totalDays = Math.ceil(
        (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / 86_400_000,
      ) + 1;
      if (dayNumber > totalDays) {
        throw new BadRequestException(`day_number must be <= ${totalDays} (trip duration)`);
      }
    }

    // Update activity
    const updated = await this.prisma.tripActivity.update({
      where: { id: activityId },
      data: {
        placeName: dto.place_name !== undefined ? dto.place_name : undefined,
        activityDate: dto.activity_date ? new Date(dto.activity_date) : undefined,
        dayNumber,
        startTime: dto.start_time !== undefined ? this.parseTimeToDate(dto.start_time) : undefined,
        endTime: dto.end_time !== undefined ? this.parseTimeToDate(dto.end_time) : undefined,
        kind: dto.kind !== undefined ? (dto.kind as any) : undefined,
        description: dto.description !== undefined ? dto.description : undefined,
        locationLabel: dto.location_label !== undefined ? dto.location_label : undefined,
        mapsLink: dto.maps_link !== undefined ? dto.maps_link : undefined,
        refLinks: dto.ref_links !== undefined ? (dto.ref_links as any) : undefined,
        coverSource: dto.cover_source !== undefined ? (dto.cover_source as any) : undefined,
        coverIcon: dto.cover_icon !== undefined ? dto.cover_icon : undefined,
        coverDocumentId: dto.cover_document_id !== undefined ? dto.cover_document_id : undefined,
        thumbnailUrl: dto.thumbnail_url !== undefined ? dto.thumbnail_url : undefined,
        sortOrder: dto.sort_order !== undefined ? dto.sort_order : undefined,
      },
      include: { coverDocument: { select: { id: true, storageKey: true, storageUrl: true } } },
    });

    // Create notifications for all trip participants (except the updater)
    const participantsToNotify = trip.participants
      .filter((p) => p.userId !== userId)
      .map((p) => p.userId);

    await this.notifications.createManyNotifications(
      participantsToNotify.map((participantId) => ({
        userId: participantId,
        type: 'activity_update',
        actorId: userId,
        tripId,
        payload: {
          activity_id: updated.id,
          activity_name: updated.placeName,
          action: 'updated',
        },
      })),
    );

    const mapsLink = dto.maps_link !== undefined ? dto.maps_link : existing.mapsLink;
    const hasThumbnail =
      dto.thumbnail_url !== undefined ? !!dto.thumbnail_url : !!existing.thumbnailUrl;
    if (mapsLink && !hasThumbnail) {
      this.scheduleThumbnailResolve(activityId, mapsLink);
    }

    return ActivitySerializer.toDetail(
      updated,
      updated.coverDocument,
      await this.resolveCoverThumbnailUrl(updated),
    );
  }

  /**
   * Delete an activity.
   * Participants can delete.
   */
  async deleteActivity(tripId: string, activityId: string, userId: string): Promise<void> {
    // Verify participant access
    const trip = await this.prisma.trip.findFirst({
      where: {
        id: tripId,
        participants: { some: { userId } },
      },
      include: { participants: true },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found or access denied');
    }

    const existing = await this.prisma.tripActivity.findFirst({
      where: { id: activityId, tripId },
    });

    if (!existing) {
      throw new NotFoundException('Activity not found');
    }

    await this.prisma.tripActivity.delete({
      where: { id: activityId },
    });
  }

  /**
   * Fire-and-forget: resolve thumbnail_url from maps_link in the background.
   * Does not block the HTTP response (ARCHITECTURE.md §3.3).
   */
  private scheduleThumbnailResolve(activityId: string, mapsLink: string | null | undefined): void {
    if (!mapsLink) return;

    setImmediate(() => {
      this.resolveThumbnailInBackground(activityId, mapsLink).catch((err) => {
        this.logger.warn(`Thumbnail resolve failed for activity ${activityId}: ${err}`);
      });
    });
  }

  /**
   * Resolve the Google Maps thumbnail for a pasted maps_link ("Sinkron Maps").
   * Works for unsaved activities (no activity row yet): returns the resolved
   * URL and imports it into trip media so it can also become the trip cover.
   */
  async syncMapsThumbnail(tripId: string, userId: string, mapsLink: string) {
    const trip = await this.prisma.trip.findFirst({
      where: { id: tripId, participants: { some: { userId } } },
      select: { id: true, creatorId: true },
    });
    if (!trip) {
      throw new NotFoundException('Trip not found or access denied');
    }

    const thumbnailUrl = await this.googleMaps.resolveThumbnailFromMapsLink(mapsLink);
    if (!thumbnailUrl) return { thumbnail_url: null };

    await this.importRemoteThumbnailToTripMedia(tripId, trip.creatorId, thumbnailUrl).catch(
      (err) => {
        this.logger.warn(`Import maps thumbnail to trip media failed: ${err}`);
      },
    );

    return { thumbnail_url: thumbnailUrl };
  }

  private async resolveThumbnailInBackground(activityId: string, mapsLink: string): Promise<void> {
    const thumbnailUrl = await this.googleMaps.resolveThumbnailFromMapsLink(mapsLink);
    if (!thumbnailUrl) return;

    await this.prisma.tripActivity.update({
      where: { id: activityId },
      data: { thumbnailUrl, coverSource: 'maps' },
    });

    const activity = await this.prisma.tripActivity.findFirst({
      where: { id: activityId },
      select: { tripId: true },
    });
    if (!activity) return;

    const trip = await this.prisma.trip.findFirst({
      where: { id: activity.tripId },
      select: { creatorId: true },
    });

    // Persist the remote maps thumbnail into trip media so it can double as
    // the trip cover / Media-tab item (same behaviour as wishlist thumbnails).
    if (trip?.creatorId) {
      await this.importRemoteThumbnailToTripMedia(
        activity.tripId,
        trip.creatorId,
        thumbnailUrl,
      ).catch((err) => {
        this.logger.warn(`Import maps thumbnail to trip media failed for activity ${activityId}: ${err}`);
      });
    }
  }

  /**
   * Downloads a remote thumbnail (e.g. Google Maps og:image) and stores it in
   * the trip's R2 bucket, registering a `trip_documents` row so it appears in
   * the Media tab and can be set as the trip cover. No-op when already imported.
   */
  private async importRemoteThumbnailToTripMedia(
    tripId: string,
    uploaderId: string | undefined,
    thumbnailUrl: string,
  ): Promise<void> {
    // Skip if this exact URL was already imported for this trip.
    const existing = await this.prisma.tripDocument.findFirst({
      where: { tripId, storageUrl: thumbnailUrl },
    });
    if (existing) return;

    const res = await fetch(thumbnailUrl);
    if (!res.ok) return;
    const buffer = Buffer.from(await res.arrayBuffer());
    const contentType = res.headers.get('content-type') ?? 'image/jpeg';

    const { storageKey, storageUrl } = await this.r2.putObject(
      tripId,
      contentType,
      buffer,
    );

    await this.prisma.tripDocument.create({
      data: {
        tripId,
        uploadedBy: uploaderId!,
        mediaType: 'photo',
        storageKey,
        storageUrl,
        fromChat: false,
      },
    });
  }

  /**
   * Helper: Convert "HH:MM" string to a Date object (midnight-relative).
   */
  private async resolveCoverThumbnailUrl(activity: {
    thumbnailUrl: string | null;
    coverDocument?: { storageKey: string } | null;
  }): Promise<string | null> {
    if (activity.thumbnailUrl) return activity.thumbnailUrl;
    if (!activity.coverDocument?.storageKey) return null;
    return this.r2.presignDownload(activity.coverDocument.storageKey);
  }

  private parseTimeToDate(timeStr: string): Date {
    const [h, m] = timeStr.split(':').map(Number);
    // Build a UTC date so the HH:MM survives Prisma's `@db.Time` UTC round-trip.
    const d = new Date(Date.UTC(1970, 0, 1, h, m, 0, 0));
    return d;
  }
}
