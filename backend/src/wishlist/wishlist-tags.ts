/**
 * Tag helpers for wishlists. Filter chips come from the user's own tags
 * (`GET /v1/wishlists/tags`), not a fixed product catalog. Figma's
 * `WISHLIST_FILTER_TAGS` is design-mock data only.
 */

/**
 * Normalize a free-form tag to `#Titlecase` so invent/filter stays
 * case-insensitive against Postgres JSON `array_contains`.
 * e.g. "pantai" | "#pantai" | "#PANTAI" → "#Pantai"
 */
export function normalizeWishlistTag(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;
  const withoutHash = trimmed.startsWith('#') ? trimmed.slice(1) : trimmed;
  if (!withoutHash) return '#';
  const body =
    withoutHash.charAt(0).toUpperCase() + withoutHash.slice(1).toLowerCase();
  return `#${body}`;
}

export function normalizeWishlistTags(tags?: string[]): string[] | undefined {
  if (tags === undefined) return undefined;
  const seen = new Set<string>();
  const result: string[] = [];
  for (const t of tags) {
    const n = normalizeWishlistTag(t);
    if (!n || n === '#' || seen.has(n)) continue;
    seen.add(n);
    result.push(n);
  }
  return result;
}
