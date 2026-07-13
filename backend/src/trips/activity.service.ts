import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleMapsService } from '../common/google-maps/google-maps.service';
import { CreateActivityDto, UpdateActivityDto } from './dto/activity.dto';
import { ActivitySerializer } from './serializers/activity.serializer';

@Injectable()
export class ActivityService {
  private readonly logger = new Logger(ActivityService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly googleMaps: GoogleMapsService,
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
      include: { coverDocument: { select: { id: true, storageUrl: true } } },
      orderBy: [{ activityDate: 'asc' }, { startTime: 'asc' }],
    });

    return {
      data: activities.map((a) =>
        ActivitySerializer.toList(a, a.coverDocument),
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
      include: { coverDocument: { select: { id: true, storageUrl: true } } },
    });

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    return ActivitySerializer.toDetail(activity, activity.coverDocument);
  }

  /**
   * Create a new activity.
   * Participants can create. Validations:
   * - start_time <= end_time
   * - activity_date must fall within trip date range if trip.status='fixed'
   */
  async createActivity(
    tripId: string,
    userId: string,
    dto: CreateActivityDto,
  ) {
    // Verify participant access
    const trip = await this.prisma.trip.findFirst({
      where: {
        id: tripId,
        participants: { some: { userId } },
      },
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

    const startMinutes =
      parseInt(startMatch[1]) * 60 + parseInt(startMatch[2]);
    const endMinutes = parseInt(endMatch[1]) * 60 + parseInt(endMatch[2]);

    if (startMinutes > endMinutes) {
      throw new BadRequestException('start_time must be <= end_time');
    }

    // Validate activity_date falls within trip range (if fixed)
    if (trip.status === 'fixed') {
      if (!dto.activity_date) {
        throw new BadRequestException(
          'activity_date required when trip status is fixed',
        );
      }

      const actDate = new Date(dto.activity_date);
      const startDate = new Date(trip.startDate!);
      const endDate = new Date(trip.endDate!);

      if (actDate < startDate || actDate > endDate) {
        throw new BadRequestException(
          'activity_date must fall within trip date range',
        );
      }
    }

    // Create activity
    const activity = await this.prisma.tripActivity.create({
      data: {
        tripId,
        placeName: dto.place_name,
        activityDate: dto.activity_date ? new Date(dto.activity_date) : null,
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
      include: { coverDocument: { select: { id: true, storageUrl: true } } },
    });

    this.scheduleThumbnailResolve(activity.id, dto.maps_link);

    return ActivitySerializer.toDetail(activity, activity.coverDocument);
  }

  /**
   * Update an existing activity.
   * Participants can edit. Same validations as create.
   */
  async updateActivity(
    tripId: string,
    activityId: string,
    userId: string,
    dto: UpdateActivityDto,
  ) {
    // Verify participant access
    const trip = await this.prisma.trip.findFirst({
      where: {
        id: tripId,
        participants: { some: { userId } },
      },
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
    const startTime = dto.start_time || existing.startTime.toISOString().slice(11, 16) as any;
    const endTime = dto.end_time || existing.endTime.toISOString().slice(11, 16) as any;

    if (dto.start_time || dto.end_time) {
      const timeRegex = /^(\d{2}):(\d{2})$/;
      const startMatch = startTime.match(timeRegex);
      const endMatch = endTime.match(timeRegex);

      if (!startMatch || !endMatch) {
        throw new BadRequestException('Invalid time format (HH:MM required)');
      }

      const startMinutes =
        parseInt(startMatch[1]) * 60 + parseInt(startMatch[2]);
      const endMinutes = parseInt(endMatch[1]) * 60 + parseInt(endMatch[2]);

      if (startMinutes > endMinutes) {
        throw new BadRequestException('start_time must be <= end_time');
      }
    }

    // Validate activity_date (if trip is fixed)
    let activityDate: Date | null = existing.activityDate;
    if (dto.activity_date) {
      if (trip.status === 'fixed') {
        const actDate = new Date(dto.activity_date);
        const startDate = new Date(trip.startDate!);
        const endDate = new Date(trip.endDate!);

        if (actDate < startDate || actDate > endDate) {
          throw new BadRequestException(
            'activity_date must fall within trip date range',
          );
        }
      }
      activityDate = new Date(dto.activity_date);
    } else if (trip.status === 'fixed' && !existing.activityDate) {
      throw new BadRequestException(
        'activity_date required when trip status is fixed',
      );
    }

    // Update activity
    const updated = await this.prisma.tripActivity.update({
      where: { id: activityId },
      data: {
        placeName: dto.place_name !== undefined ? dto.place_name : undefined,
        activityDate: activityDate,
        startTime:
          dto.start_time !== undefined
            ? this.parseTimeToDate(dto.start_time)
            : undefined,
        endTime:
          dto.end_time !== undefined
            ? this.parseTimeToDate(dto.end_time)
            : undefined,
        kind: dto.kind !== undefined ? (dto.kind as any) : undefined,
        description: dto.description !== undefined ? dto.description : undefined,
        locationLabel:
          dto.location_label !== undefined ? dto.location_label : undefined,
        mapsLink: dto.maps_link !== undefined ? dto.maps_link : undefined,
        refLinks: dto.ref_links !== undefined ? (dto.ref_links as any) : undefined,
        coverSource:
          dto.cover_source !== undefined ? (dto.cover_source as any) : undefined,
        coverIcon: dto.cover_icon !== undefined ? dto.cover_icon : undefined,
        coverDocumentId:
          dto.cover_document_id !== undefined ? dto.cover_document_id : undefined,
        thumbnailUrl:
          dto.thumbnail_url !== undefined ? dto.thumbnail_url : undefined,
        sortOrder:
          dto.sort_order !== undefined ? dto.sort_order : undefined,
      },
      include: { coverDocument: { select: { id: true, storageUrl: true } } },
    });

    const mapsLink =
      dto.maps_link !== undefined ? dto.maps_link : existing.mapsLink;
    const hasThumbnail =
      dto.thumbnail_url !== undefined
        ? !!dto.thumbnail_url
        : !!existing.thumbnailUrl;
    if (mapsLink && !hasThumbnail) {
      this.scheduleThumbnailResolve(activityId, mapsLink);
    }

    return ActivitySerializer.toDetail(updated, updated.coverDocument);
  }

  /**
   * Delete an activity.
   * Participants can delete.
   */
  async deleteActivity(
    tripId: string,
    activityId: string,
    userId: string,
  ): Promise<void> {
    // Verify participant access
    const trip = await this.prisma.trip.findFirst({
      where: {
        id: tripId,
        participants: { some: { userId } },
      },
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
  private scheduleThumbnailResolve(
    activityId: string,
    mapsLink: string | null | undefined,
  ): void {
    if (!mapsLink) return;

    setImmediate(() => {
      this.resolveThumbnailInBackground(activityId, mapsLink).catch((err) => {
        this.logger.warn(
          `Thumbnail resolve failed for activity ${activityId}: ${err}`,
        );
      });
    });
  }

  private async resolveThumbnailInBackground(
    activityId: string,
    mapsLink: string,
  ): Promise<void> {
    const thumbnailUrl =
      await this.googleMaps.resolveThumbnailFromMapsLink(mapsLink);
    if (!thumbnailUrl) return;

    await this.prisma.tripActivity.update({
      where: { id: activityId },
      data: { thumbnailUrl, coverSource: 'maps' },
    });
  }

  /**
   * Helper: Convert "HH:MM" string to a Date object (midnight-relative).
   */
  private parseTimeToDate(timeStr: string): Date {
    const [h, m] = timeStr.split(':').map(Number);
    const d = new Date('1970-01-01');
    d.setHours(h, m, 0, 0);
    return d;
  }
}
