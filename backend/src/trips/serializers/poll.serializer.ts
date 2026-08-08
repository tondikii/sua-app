import { UserSummarySerializer } from '../../users/serializers/user.serializer';
import type { R2Service } from '../../integrations/r2/r2.service';

type UserLike = {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
};

type PollLike = {
  id: string;
  tripId: string;
  pollType: string;
  title: string;
  status: string;
  deadline: Date | null;
  lockedAt: Date | null;
  createdBy: string;
  createdAt: Date;
};

type PollOptionLike = {
  id: string;
  pollId: string;
  label: string;
  sortOrder: number;
  candidateId: string | null;
  mapsLink?: string | null;
  refLinks?: unknown;
};

type PollVoteLike = {
  pollId: string;
  optionId: string;
  userId: string;
  createdAt: Date;
  user?: UserLike;
};

export class PollSerializer {
  static async toList(
    poll: PollLike,
    options: Array<PollOptionLike & { votes?: PollVoteLike[] }>,
    creator: UserLike,
    viewerVote: PollVoteLike | null,
    r2: R2Service,
  ) {
    return {
      id: poll.id,
      poll_type: poll.pollType,
      title: poll.title,
      status: poll.status,
      deadline: poll.deadline?.toISOString() ?? null,
      locked_at: poll.lockedAt?.toISOString() ?? null,
      creator: {
        id: creator.id,
        name: creator.name,
        username: creator.username,
        avatar_url: await UserSummarySerializer.resolveAvatar(creator.avatarUrl, r2),
      },
      options: await Promise.all(
        options.map(async (opt) => ({
          id: opt.id,
          label: opt.label,
          sort_order: opt.sortOrder,
          candidate_id: opt.candidateId,
          maps_link: opt.mapsLink ?? null,
          ref_links: Array.isArray(opt.refLinks) ? opt.refLinks : [],
          vote_count: opt.votes?.length ?? 0,
          has_voted: viewerVote?.optionId === opt.id,
          voters: await Promise.all(
            (opt.votes ?? [])
              .map((v) => v.user)
              .filter((u): u is UserLike => Boolean(u))
              .map(async (u) => ({
                id: u.id,
                name: u.name,
                username: u.username,
                avatar_url: await UserSummarySerializer.resolveAvatar(u.avatarUrl, r2),
              })),
          ),
        })),
      ),
      voted_option_id: viewerVote?.optionId ?? null,
      created_at: poll.createdAt.toISOString(),
    };
  }

  static async toDateCandidateTally(
    candidate: { id: string; startDate: Date; endDate: Date },
    votes: Array<PollVoteLike & { user: UserLike }>,
    currentUserVoted: boolean,
    r2: R2Service,
  ) {
    return {
      id: candidate.id,
      start_date: candidate.startDate.toISOString().split('T')[0],
      end_date: candidate.endDate.toISOString().split('T')[0],
      vote_count: votes.length,
      voters_preview: await Promise.all(
        votes.slice(0, 3).map(async (v) => ({
          id: v.user.id,
          name: v.user.name,
          username: v.user.username,
          avatar_url: await UserSummarySerializer.resolveAvatar(v.user.avatarUrl, r2),
        })),
      ),
      current_user_voted: currentUserVoted,
    };
  }
}
