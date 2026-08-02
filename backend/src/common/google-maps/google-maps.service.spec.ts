import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { GoogleMapsService } from './google-maps.service';

describe('GoogleMapsService', () => {
  let service: GoogleMapsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleMapsService,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => (key === 'google.mapsApiKey' ? 'test-api-key' : undefined),
          },
        },
      ],
    }).compile();

    service = module.get<GoogleMapsService>(GoogleMapsService);
  });

  describe('parseMapsLink', () => {
    it('extracts place_id from query param', () => {
      const result = service.parseMapsLink(
        'https://www.google.com/maps/place/?place_id=ChIJN1t_tDeuEmsRUsoyG83frY4',
      );
      expect(result?.placeId).toBe('ChIJN1t_tDeuEmsRUsoyG83frY4');
    });

    it('extracts lat/lng from @ pattern', () => {
      const result = service.parseMapsLink(
        'https://www.google.com/maps/place/Bali/@-8.409518,115.188919,12z',
      );
      expect(result?.lat).toBeCloseTo(-8.409518);
      expect(result?.lng).toBeCloseTo(115.188919);
    });

    it('extracts lat/lng from q param', () => {
      const result = service.parseMapsLink('https://maps.google.com/?q=-8.409518,115.188919');
      expect(result?.lat).toBeCloseTo(-8.409518);
      expect(result?.lng).toBeCloseTo(115.188919);
    });

    it('returns null for unparseable URL', () => {
      expect(service.parseMapsLink('not-a-url')).toBeNull();
    });

    it('skips 0x:0x place id pairs and falls back to coordinates', () => {
      const result = service.parseMapsLink(
        'https://www.google.com/maps/place/VOLUME/@-6.8927903,107.5812514,17z/data=!3m1!4b1!4m9!3m8!1s0x2e68e7a062f2673d:0xc78bd6e82928829!5m2!8m2!3d-6.8927903!4d107.5838263',
      );
      expect(result?.placeId).toBeUndefined();
      expect(result?.lat).toBeCloseTo(-6.8927903);
      expect(result?.lng).toBeCloseTo(107.5812514);
    });
  });

  describe('buildStaticMapUrl', () => {
    it('builds a Static Maps URL with API key', () => {
      const url = service.buildStaticMapUrl(-8.409518, 115.188919);
      expect(url).toContain('maps.googleapis.com/maps/api/staticmap');
      expect(url).toContain('center=-8.409518%2C115.188919');
      expect(url).toContain('key=test-api-key');
    });
  });

  describe('resolveThumbnailFromMapsLink', () => {
    const BOT_UA = 'facebookexternalhit/1.1';

    it('returns the og:image when the place page exposes one (WhatsApp-style preview)', async () => {
      const originalFetch = global.fetch;
      global.fetch = jest.fn().mockImplementation((input: any, init?: any) => {
        const ua = init?.headers?.['User-Agent'] ?? '';
        if (typeof ua === 'string' && ua.includes(BOT_UA)) {
          return Promise.resolve({
            ok: true,
            text: () =>
              Promise.resolve(
                '<meta property="og:image" content="https://lh3.googleusercontent.com/gps-cs-s/PHOTO123"/>',
              ),
          });
        }
        return Promise.resolve({ ok: true, url: '' });
      }) as any;

      try {
        const url = await service.resolveThumbnailFromMapsLink(
          'https://maps.app.goo.gl/dsK8dyhaZsawmgVo7',
        );
        expect(url).toBe('https://lh3.googleusercontent.com/gps-cs-s/PHOTO123');
      } finally {
        global.fetch = originalFetch;
      }
    });

    it('returns Google Static Maps URL when no og:image and static reachable', async () => {
      const originalFetch = global.fetch;
      global.fetch = jest.fn().mockImplementation((_input: any, init?: any) => {
        const ua = init?.headers?.['User-Agent'] ?? '';
        if (typeof ua === 'string' && ua.includes(BOT_UA)) {
          // no og:image on this page
          return Promise.resolve({ ok: true, text: () => Promise.resolve('<html></html>') });
        }
        return Promise.resolve({ ok: true, url: _input });
      }) as any;

      try {
        const url = await service.resolveThumbnailFromMapsLink(
          'https://maps.google.com/?q=-8.409518,115.188919',
        );
        expect(url).toContain('maps.googleapis.com/maps/api/staticmap');
      } finally {
        global.fetch = originalFetch;
      }
    });

    it('falls back to Yandex when og:image and Google static are unavailable', async () => {
      const originalFetch = global.fetch;
      // og scrape returns no image; HEAD check returns 403 (billing blocked)
      global.fetch = jest.fn().mockImplementation((_input: any, init?: any) => {
        const ua = init?.headers?.['User-Agent'] ?? '';
        if (typeof ua === 'string' && ua.includes(BOT_UA)) {
          return Promise.resolve({ ok: true, text: () => Promise.resolve('<html></html>') });
        }
        return Promise.resolve({
          ok: false,
          url: 'https://maps.google.com/?q=-8.409518,115.188919',
        });
      }) as any;

      try {
        const url = await service.resolveThumbnailFromMapsLink(
          'https://maps.google.com/?q=-8.409518,115.188919',
        );
        expect(url).toContain('static-maps.yandex.ru');
      } finally {
        global.fetch = originalFetch;
      }
    });

    it('uses Yandex fallback when API key is missing', async () => {
      const module = await Test.createTestingModule({
        providers: [
          GoogleMapsService,
          { provide: ConfigService, useValue: { get: () => undefined } },
        ],
      }).compile();
      const noKeyService = module.get<GoogleMapsService>(GoogleMapsService);

      const originalFetch = global.fetch;
      global.fetch = jest.fn().mockImplementation((_input: any, init?: any) => {
        const ua = init?.headers?.['User-Agent'] ?? '';
        if (typeof ua === 'string' && ua.includes(BOT_UA)) {
          return Promise.resolve({ ok: true, text: () => Promise.resolve('<html></html>') });
        }
        return Promise.resolve({ ok: false, url: _input });
      }) as any;

      try {
        const url = await noKeyService.resolveThumbnailFromMapsLink(
          'https://maps.google.com/?q=-8.409518,115.188919',
        );
        expect(url).toContain('static-maps.yandex.ru');
      } finally {
        global.fetch = originalFetch;
      }
    });

    it('expands short links before parsing (maps.app.goo.gl)', async () => {
      const originalFetch = global.fetch;
      global.fetch = jest.fn().mockImplementation((input: any, init?: any) => {
        const ua = init?.headers?.['User-Agent'] ?? '';
        if (typeof input === 'string' && input.includes('goo.gl') && !(typeof ua === 'string' && ua.includes(BOT_UA))) {
          // short-link redirect (expandShortLink)
          return Promise.resolve({
            ok: true,
            url: 'https://www.google.com/maps/place/Bali/@-8.409518,115.188919,12z',
          });
        }
        if (typeof ua === 'string' && ua.includes(BOT_UA)) {
          return Promise.resolve({ ok: true, text: () => Promise.resolve('<html></html>') });
        }
        // staticmap HEAD check
        return Promise.resolve({ ok: true, url: input });
      }) as any;

      try {
        const url = await service.resolveThumbnailFromMapsLink(
          'https://maps.app.goo.gl/dz7rYvw37M64qCzy6',
        );
        expect(global.fetch).toHaveBeenCalledWith(
          'https://maps.app.goo.gl/dz7rYvw37M64qCzy6',
          expect.objectContaining({ redirect: 'follow' }),
        );
        expect(url).toContain('staticmap');
      } finally {
        global.fetch = originalFetch;
      }
    });

    it('falls back to Yandex when short link expansion fails', async () => {
      const originalFetch = global.fetch;
      global.fetch = jest.fn().mockRejectedValue(new Error('network down')) as any;

      try {
        const url = await service.resolveThumbnailFromMapsLink(
          'https://maps.google.com/?q=-8.409518,115.188919',
        );
        expect(url).toContain('static-maps.yandex.ru');
      } finally {
        global.fetch = originalFetch;
      }
    });
  });
});
