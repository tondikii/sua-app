import { Prisma } from '@prisma/client';
import { toDateOnly, toTime } from '../../common/helpers/date.helpers';
import type {
  UserSummary,
  TripSummary,
  TripDetail,
  TripStatus,
} from '@atur-perjalanan/shared-types';

type UserLike = {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
};

type ParticipantLike = {
  userId: string;
  joinedAt: Date;
  user: UserLike;
};

type TripLike = {
  id: string;
  creatorId: string;
  name: string;
  tags: unknown;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
  isAllDay: boolean;
  startTime: Date | null;
  endTime: Date | null;
  isPublic: boolean;
  coverDocumentId: string | null;
  votingDeadline: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export class TripSerializer {
  static userSummary(user: UserLike): UserSummary {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      avatar_url: user.avatarUrl,
    };
  }

  static toCard(
    trip: TripLike & {
      participants: ParticipantLike[];
      _count?: { participants: number };
    },
    coverUrl: string | null,
  ) {
    return {
      id: trip.id,
      name: trip.name,
      tags: (trip.tags as string[]) ?? [],
      status: trip.status,
      start_date: toDateOnly(trip.startDate),
      end_date: toDateOnly(trip.endDate),
      is_all_day: trip.isAllDay,
      start_time: toTime(trip.startTime),
      end_time: toTime(trip.endTime),
      is_public: trip.isPublic,
      cover_image_url: coverUrl,
      voting_deadline: trip.votingDeadline?.toISOString() ?? null,
      participant_count: trip._count?.participants ?? trip.participants.length,
      participants_preview: trip.participants
        .slice(0, 5)
        .map((p) => TripSerializer.userSummary(p.user)),
      created_at: trip.createdAt.toISOString(),
    };
  }

  static toDetail(
    trip: TripLike & {
      creator: UserLike;
      participants: ParticipantLike[];
      coverDocument?: { storageKey?: string; storageUrl?: string } | null;
      dateCandidates?: Array<{
        id: string;
        startDate: Date;
        endDate: Date;
        votes: Array<{ userId: string }>;
      }>;
    },
    coverImageUrl: string | null = null,
  ) {
    return {
      id: trip.id,
      name: trip.name,
      tags: (trip.tags as string[]) ?? [],
      status: trip.status,
      start_date: toDateOnly(trip.startDate),
      end_date: toDateOnly(trip.endDate),
      is_all_day: trip.isAllDay,
      start_time: toTime(trip.startTime),
      end_time: toTime(trip.endTime),
      is_public: trip.isPublic,
      cover_image_url: coverImageUrl,
      voting_deadline: trip.votingDeadline?.toISOString() ?? null,
      creator: TripSerializer.userSummary(trip.creator),
      participant_count: trip.participants.length,
      participants: trip.participants.map((p) => ({
        ...TripSerializer.userSummary(p.user),
        joined_at: p.joinedAt.toISOString(),
        role: p.userId === trip.creatorId ? 'creator' : 'member',
      })),
      date_candidates:
        trip.dateCandidates?.map((c) => ({
          id: c.id,
          start_date: toDateOnly(c.startDate),
          end_date: toDateOnly(c.endDate),
          vote_count: c.votes.length,
        })) ?? [],
      created_at: trip.createdAt.toISOString(),
      updated_at: trip.updatedAt.toISOString(),
    };
  }

  static toMember(participant: ParticipantLike & { creatorId: string }) {
    return {
      ...TripSerializer.userSummary(participant.user),
      joined_at: participant.joinedAt.toISOString(),
      role: participant.userId === participant.creatorId ? 'creator' : 'member',
    };
  }
}
