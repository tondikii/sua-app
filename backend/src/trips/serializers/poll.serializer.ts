import type { TripPoll } from '@atur-perjalanan/shared-types';
import type { UserSummary } from '@atur-perjalanan/shared-types';

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
};

type PollVoteLike = {
  pollId: string;
  optionId: string;
  userId: string;
  createdAt: Date;
  user?: UserLike;
};

export class PollSerializer {
  static toList(
    poll: PollLike,
    options: Array<PollOptionLike & { votes?: PollVoteLike[] }>,
    creator: UserLike,
    viewerVote: PollVoteLike | null,
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
        avatar_url: creator.avatarUrl,
      },
      options: options.map((opt) => ({
        id: opt.id,
        label: opt.label,
        sort_order: opt.sortOrder,
        candidate_id: opt.candidateId,
        vote_count: opt.votes?.length ?? 0,
        has_voted: viewerVote?.optionId === opt.id,
        voters: (opt.votes ?? [])
          .map((v) => v.user)
          .filter((u): u is UserLike => Boolean(u))
          .map((u) => ({
            id: u.id,
            name: u.name,
            username: u.username,
            avatar_url: u.avatarUrl,
          })),
      })),
      voted_option_id: viewerVote?.optionId ?? null,
      created_at: poll.createdAt.toISOString(),
    };
  }

  static toDateCandidateTally(
    candidate: { id: string; startDate: Date; endDate: Date },
    votes: Array<PollVoteLike & { user: UserLike }>,
    currentUserVoted: boolean,
  ) {
    return {
      id: candidate.id,
      start_date: candidate.startDate.toISOString().split('T')[0],
      end_date: candidate.endDate.toISOString().split('T')[0],
      vote_count: votes.length,
      voters_preview: votes.slice(0, 3).map((v) => ({
        id: v.user.id,
        name: v.user.name,
        username: v.user.username,
        avatar_url: v.user.avatarUrl,
      })),
      current_user_voted: currentUserVoted,
    };
  }
}
