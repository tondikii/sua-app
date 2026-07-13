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
   * Parse a Google Maps URL and return a thumbnail URL, or null if unresolvable.
   */
  async resolveThumbnailFromMapsLink(mapsLink: string): Promise<string | null> {
    if (!this.apiKey) {
      this.logger.debug('GOOGLE_MAPS_API_KEY not set — skipping thumbnail resolve');
      return null;
    }

    const location = this.parseMapsLink(mapsLink);
    if (!location) {
      return null;
    }

    if (location.placeId) {
      const photoUrl = await this.resolvePlacePhoto(location.placeId);
      if (photoUrl) return photoUrl;
    }

    if (location.lat !== undefined && location.lng !== undefined) {
      return this.buildStaticMapUrl(location.lat, location.lng);
    }

    return null;
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

      // data param: !1sChIJ... or !1s0x...
      const dataMatch = mapsLink.match(/!1s([^!&?]+)/);
      if (dataMatch?.[1]) {
        const ref = decodeURIComponent(dataMatch[1]);
        if (ref.startsWith('ChIJ') || ref.startsWith('0x')) {
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
      const detailsUrl = new URL(
        'https://maps.googleapis.com/maps/api/place/details/json',
      );
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
      const photoUrl = new URL(
        'https://maps.googleapis.com/maps/api/place/photo',
      );
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
}
