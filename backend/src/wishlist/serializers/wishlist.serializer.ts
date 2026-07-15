type WishlistLike = {
    id: string;
    userId: string;
    placeName: string;
    startTime: Date | null;
    endTime: Date | null;
    locationLabel: string | null;
    link: string | null;
    notes: string | null;
    tags: unknown;
    priorityLevel: string;
    thumbnailUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  
  const toTime = (d: Date | null): string | null =>
    d ? new Date(d).toTimeString().slice(0, 5) : null;
  
  export class WishlistSerializer {
    /** List/detail shape for `/v1/wishlists` (WORKFLOW §12, `WishlistGridCard` / `WishlistDetailSheet`). */
    static toItem(wishlist: WishlistLike) {
      return {
        id: wishlist.id,
        place_name: wishlist.placeName,
        start_time: toTime(wishlist.startTime),
        end_time: toTime(wishlist.endTime),
        location_label: wishlist.locationLabel,
        link: wishlist.link,
        notes: wishlist.notes,
        tags: (wishlist.tags as string[]) ?? [],
        priority_level: wishlist.priorityLevel,
        thumbnail_url: wishlist.thumbnailUrl,
        created_at: wishlist.createdAt.toISOString(),
        updated_at: wishlist.updatedAt.toISOString(),
      };
    }
  }