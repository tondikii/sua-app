import { Prisma } from '@prisma/client';
import type { UserSummary, UserProfile } from '@atur-perjalanan/shared-types';
import { R2Service } from '../../integrations/r2/r2.service';

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

const R2_AVATAR_PREFIX = 'avatars/';
const R2_DEV_HOST = 'r2.dev';

export class UserSummarySerializer {
  /**
   * Avatar URLs come in three shapes:
   * - `avatars/{userId}/{uuid}.{ext}` — R2 storage key (uploaded via app)
   * - `https://pub-*.r2.dev/avatars/...` — legacy stored public URL
   * - any other https URL (e.g. Google `lh3.googleusercontent.com`)
   *
   * R2 objects in this bucket are private, so keys/legacy r2.dev URLs must be
   * resolved to a time-limited presigned GET so browsers can render them.
   * External URLs (Google avatar) are returned as-is.
   */
  static async resolveAvatar(
    avatarUrl: string | null,
    r2: R2Service,
  ): Promise<string | null> {
    if (!avatarUrl) return null;

    let key = avatarUrl;
    if (avatarUrl.startsWith(R2_AVATAR_PREFIX)) {
      key = avatarUrl;
    } else if (avatarUrl.includes(R2_DEV_HOST)) {
      const { pathname } = new URL(avatarUrl);
      key = pathname.replace(/^\/+/, '');
      if (!key.startsWith(R2_AVATAR_PREFIX)) return avatarUrl;
    } else {
      // External URL (Google, etc.) — not an R2 object.
      return avatarUrl;
    }

    try {
      return await r2.presignDownload(key);
    } catch {
      return avatarUrl;
    }
  }

  static async toSummary(
    user: UserWithCount,
    r2: R2Service,
  ): Promise<UserSummary> {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      avatar_url: await UserSummarySerializer.resolveAvatar(user.avatarUrl, r2),
    };
  }

  static async toProfile(
    user: UserWithCount,
    r2: R2Service,
  ): Promise<UserProfile> {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      avatar_url: await UserSummarySerializer.resolveAvatar(user.avatarUrl, r2),
      bio: user.bio,
      website_url: user.websiteUrl,
      location_label: user.locationLabel,
      is_public: user.isPublic,
      trip_count: user._count?.tripsCreated ?? 0,
      created_at: user.createdAt.toISOString(),
    };
  }
}
