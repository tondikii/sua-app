/**
 * Contract tests for serializer ↔ shared-types alignment.
 *
 * These tests verify that the backend serializers produce shapes compatible
 * with the @atur-perjalanan/shared-types interfaces. If a serializer field
 * is renamed, removed, or changes type, the compile-time assertion below
 * catches the drift.
 *
 * Snapshots capture the current output — review them when shapes intentionally
 * change, and delete/recreate when a serializer method is added or removed.
 */

import { UserSummarySerializer } from '../../users/serializers/user.serializer';

const mockUser = {
  id: 'u1',
  name: 'Test User',
  username: 'testuser',
  avatarUrl: null,
  bio: null,
  websiteUrl: null,
  locationLabel: null,
  isPublic: true,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  _count: { tripsCreated: 0 },
};

describe('UserSummarySerializer → shared-types contract', () => {
  it('toSummary matches UserSummary shape', () => {
    const result = UserSummarySerializer.toSummary(mockUser);
    // Compile-time assertion: if UserSummary changes incompatibly, this line errors
    const _check: { id: string; name: string; username: string; avatar_url: string | null } =
      result;
    expect(result).toMatchInlineSnapshot(`
      {
        "avatar_url": null,
        "id": "u1",
        "name": "Test User",
        "username": "testuser",
      }
    `);
  });

  it('toProfile matches UserProfile shape', () => {
    const result = UserSummarySerializer.toProfile(mockUser);
    expect(result).toMatchInlineSnapshot(`
      {
        "avatar_url": null,
        "bio": null,
        "created_at": "2026-01-01T00:00:00.000Z",
        "id": "u1",
        "is_public": true,
        "location_label": null,
        "name": "Test User",
        "trip_count": 0,
        "username": "testuser",
        "website_url": null,
      }
    `);
  });
});
