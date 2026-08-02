import { toDateOnly, toTime } from '../../common/helpers/date.helpers';
import { UserSummarySerializer } from '../../users/serializers/user.serializer';
import type { R2Service } from '../../integrations/r2/r2.service';
import type { TripInvitation } from '@atur-perjalanan/shared-types';

type UserLike = {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
};

type TripSummaryLike = {
  id: string;
  name: string;
  startDate: Date | null;
  endDate: Date | null;
  status: string;
  isAllDay: boolean;
  startTime: Date | null;
  endTime: Date | null;
};

type InvitationLike = {
  id: string;
  tripId: string;
  invitedBy: string;
  invitedUserId: string | null;
  invitedEmail: string | null;
  method: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  /** Set only for email invites: whether the SMTP delivery succeeded. */
  emailDelivered?: boolean;
};

export type InvitationState = 'email_sent' | 'pending_accept' | 'rejected';

export class InvitationSerializer {
  static deriveState(inv: Pick<InvitationLike, 'status' | 'invitedUserId'>): InvitationState {
    if (inv.status === 'declined') return 'rejected';
    return inv.invitedUserId ? 'pending_accept' : 'email_sent';
  }

  static toBasic(inv: InvitationLike) {
    return {
      id: inv.id,
      trip_id: inv.tripId,
      invited_by: inv.invitedBy,
      invited_user_id: inv.invitedUserId,
      invited_email: inv.invitedEmail,
      method: inv.method,
      status: inv.status,
      email_delivered: inv.emailDelivered ?? false,
      created_at: inv.createdAt.toISOString(),
      updated_at: inv.updatedAt.toISOString(),
    };
  }

  static async toManaged(
    inv: InvitationLike & { invitedUser?: UserLike | null },
    r2: R2Service,
  ) {
    return {
      id: inv.id,
      method: inv.method,
      status: inv.status,
      state: InvitationSerializer.deriveState(inv),
      invited_user: inv.invitedUser
        ? {
            id: inv.invitedUser.id,
            name: inv.invitedUser.name,
            username: inv.invitedUser.username,
            avatar_url: await UserSummarySerializer.resolveAvatar(inv.invitedUser.avatarUrl, r2),
          }
        : null,
      invited_email: inv.invitedEmail,
      invited_by: inv.invitedBy,
      created_at: inv.createdAt.toISOString(),
    };
  }

  static async toEnriched(
    inv: InvitationLike & {
      trip: TripSummaryLike;
      inviter: UserLike;
    },
    r2: R2Service,
  ) {
    return {
      id: inv.id,
      method: inv.method,
      status: inv.status,
      created_at: inv.createdAt.toISOString(),
      trip: {
        id: inv.trip.id,
        name: inv.trip.name,
        status: inv.trip.status,
        start_date: toDateOnly(inv.trip.startDate),
        end_date: toDateOnly(inv.trip.endDate),
        is_all_day: inv.trip.isAllDay,
        start_time: toTime(inv.trip.startTime),
        end_time: toTime(inv.trip.endTime),
      },
      inviter: {
        id: inv.inviter.id,
        name: inv.inviter.name,
        username: inv.inviter.username,
        avatar_url: await UserSummarySerializer.resolveAvatar(inv.inviter.avatarUrl, r2),
      },
    };
  }
}
