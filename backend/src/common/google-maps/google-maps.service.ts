import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type MapsLocation = {
  placeId?: string;
  lat?: number;
  lng?: number;
};

/**
 * Resolves a thumbnail URL from a Google Maps link via Places API or Static Maps API.
 * Per ARCHITECTURE.md §3.3 — called in the background after activity create/update;
 * never blocks the HTTP response.
 */
@Injectable()
export class GoogleMapsService {
  private readonly logger = new Logger(GoogleMapsService.name);
  private readonly apiKey: string | undefined;

  constructor(private readonly config: ConfigService) {
    this.apiKey = this.config.get<string>('google.mapsApiKey');
  }

  /**
   * Resolve a cover thumbnail from a Google Maps link.
   * Priority:
   *   1. `og:image` scraped with a social-media bot User-Agent — the same photo
   *      preview WhatsApp shows. Free, no API key, no billing.
   *   2. Places API photo (when GOOGLE_MAPS_API_KEY + billing are set).
   *   3. Google Static Map (same requirement as #2).
   *   4. Yandex Static Map — billing-free map fallback.
   */
  async resolveThumbnailFromMapsLink(mapsLink: string): Promise<string | null> {
    const resolved = await this.expandShortLink(mapsLink);
    const location = this.parseMapsLink(resolved);

    const ogImage = await this.resolveOgImage(mapsLink);
    if (ogImage) return ogImage;

    if (this.apiKey) {
      if (location?.placeId) {
        const photoUrl = await this.resolvePlacePhoto(location.placeId);
        if (photoUrl) return photoUrl;
      }

      if (location?.lat !== undefined && location?.lng !== undefined) {
        const staticUrl = this.buildStaticMapUrl(location.lat, location.lng);
        if (await this.isUrlReachable(staticUrl)) return staticUrl;
      }
    } else {
      this.logger.debug('GOOGLE_MAPS_API_KEY not set — using billing-free fallback');
    }

    if (location?.lat !== undefined && location?.lng !== undefined) {
      return this.buildFallbackStaticMapUrl(location.lat, location.lng);
    }

    return null;
  }

  /**
   * Fetch the Open Graph image from the Maps place page using a social-media bot
   * User-Agent (same trick WhatsApp / Facebook use to show the preview). Returns
   * the `lh3.googleusercontent.com` photo URL or null.
   */
  private async resolveOgImage(mapsLink: string): Promise<string | null> {
    const BOT_UA =
      'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)';
    try {
      const res = await fetch(mapsLink, {
        redirect: 'follow',
        method: 'GET',
        headers: {
          'User-Agent': BOT_UA,
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      });
      if (!res.ok) return null;
      const html = await res.text();

      const og = html.match(
        /property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
      ) ?? html.match(
        /content=["']([^"']+)["'][^>]*property=["']og:image["']/i,
      );
      return og?.[1] || null;
    } catch (err) {
      this.logger.warn(`og:image scrape failed for ${mapsLink}: ${err}`);
      return null;
    }
  }

  /** Lightweight reachability check (HEAD) so dead/billing-blocked URLs fall through. */
  private async isUrlReachable(url: string): Promise<boolean> {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      return res.ok;
    } catch {
      return false;
    }
  }

  /**
   * Follow redirects for short links (maps.app.goo.gl/...) so the underlying
   * Google Maps URL (with place_id / @lat,lng) can be parsed. Returns the
   * original URL when no redirect happens or on failure.
   */
  private async expandShortLink(mapsLink: string): Promise<string> {
    try {
      const res = await fetch(mapsLink, { redirect: 'follow', method: 'GET' });
      return res.url || mapsLink;
    } catch (err) {
      this.logger.warn(`Short link expand failed for ${mapsLink}: ${err}`);
      return mapsLink;
    }
  }

  /** Extract place_id or lat/lng from common Google Maps URL formats. */
  parseMapsLink(mapsLink: string): MapsLocation | null {
    try {
      const url = new URL(mapsLink);

      // ?place_id=ChIJ...
      const placeIdParam = url.searchParams.get('place_id');
      if (placeIdParam) {
        return { placeId: placeIdParam };
      }

      // data param: !1sChIJ... or !1s0x... (skip "0x...:0x..." pairs — not a
      // valid Places API place id, coordinates fallback will handle it)
      const dataMatch = mapsLink.match(/!1s([^!&?]+)/);
      if (dataMatch?.[1]) {
        const ref = decodeURIComponent(dataMatch[1]);
        if (ref.startsWith('ChIJ')) {
          return { placeId: ref };
        }
        if (/^0x[0-9a-fA-F]{16}$/.test(ref)) {
          return { placeId: ref };
        }
      }

      // /@lat,lng,zoom
      const atMatch = mapsLink.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
      if (atMatch) {
        return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
      }

      // ?q=lat,lng or ?query=lat,lng
      for (const key of ['q', 'query']) {
        const q = url.searchParams.get(key);
        if (q) {
          const coordMatch = q.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
          if (coordMatch) {
            return {
              lat: parseFloat(coordMatch[1]),
              lng: parseFloat(coordMatch[2]),
            };
          }
        }
      }

      return null;
    } catch {
      return null;
    }
  }

  private async resolvePlacePhoto(placeId: string): Promise<string | null> {
    try {
      const detailsUrl = new URL('https://maps.googleapis.com/maps/api/place/details/json');
      detailsUrl.searchParams.set('place_id', placeId);
      detailsUrl.searchParams.set('fields', 'photos');
      detailsUrl.searchParams.set('key', this.apiKey!);

      const res = await fetch(detailsUrl.toString());
      if (!res.ok) return null;

      const data = (await res.json()) as {
        status: string;
        result?: { photos?: Array<{ photo_reference: string }> };
      };

      if (data.status !== 'OK' || !data.result?.photos?.length) {
        return null;
      }

      const photoRef = data.result.photos[0].photo_reference;
      const photoUrl = new URL('https://maps.googleapis.com/maps/api/place/photo');
      photoUrl.searchParams.set('maxwidth', '400');
      photoUrl.searchParams.set('photo_reference', photoRef);
      photoUrl.searchParams.set('key', this.apiKey!);

      return photoUrl.toString();
    } catch (err) {
      this.logger.warn(`Places API failed for place_id=${placeId}: ${err}`);
      return null;
    }
  }

  buildStaticMapUrl(lat: number, lng: number): string {
    const url = new URL('https://maps.googleapis.com/maps/api/staticmap');
    url.searchParams.set('center', `${lat},${lng}`);
    url.searchParams.set('zoom', '15');
    url.searchParams.set('size', '400x300');
    url.searchParams.set('maptype', 'roadmap');
    url.searchParams.set('key', this.apiKey!);
    return url.toString();
  }

  /**
   * Billing-free fallback (Yandex Static Maps). No API key required, so the
   * wishlist still gets a map cover even when Google Cloud billing is off.
   */
  buildFallbackStaticMapUrl(lat: number, lng: number): string {
    const url = new URL('https://static-maps.yandex.ru/1.x/');
    url.searchParams.set('ll', `${lng},${lat}`);
    url.searchParams.set('z', '15');
    url.searchParams.set('size', '400,300');
    url.searchParams.set('l', 'map');
    return url.toString();
  }
}
