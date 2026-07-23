import { Prisma } from '@prisma/client';
import type { UserSummary, UserProfile } from '@atur-perjalanan/shared-types';

type UserWithCount = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    username: true;
    avatarUrl: true;
    bio: true;
    websiteUrl: true;
    locationLabel: true;
    isPublic: true;
    createdAt: true;
    updatedAt: true;
  };
}> & {
  _count?: { tripsCreated?: number };
};

export class UserSummarySerializer {
  static toSummary(user: UserWithCount): UserSummary {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      avatar_url: user.avatarUrl,
    };
  }

  static toProfile(user: UserWithCount): UserProfile {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      avatar_url: user.avatarUrl,
      bio: user.bio,
      website_url: user.websiteUrl,
      location_label: user.locationLabel,
      is_public: user.isPublic,
      trip_count: user._count?.tripsCreated ?? 0,
      created_at: user.createdAt.toISOString(),
    };
  }
}
