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
            get: (key: string) =>
              key === 'google.mapsApiKey' ? 'test-api-key' : undefined,
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
      const result = service.parseMapsLink(
        'https://maps.google.com/?q=-8.409518,115.188919',
      );
      expect(result?.lat).toBeCloseTo(-8.409518);
      expect(result?.lng).toBeCloseTo(115.188919);
    });

    it('returns null for unparseable URL', () => {
      expect(service.parseMapsLink('not-a-url')).toBeNull();
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
    it('returns Static Maps URL when only coordinates available', async () => {
      const url = await service.resolveThumbnailFromMapsLink(
        'https://maps.google.com/?q=-8.409518,115.188919',
      );
      expect(url).toContain('staticmap');
    });

    it('returns null when API key is missing', async () => {
      const module = await Test.createTestingModule({
        providers: [
          GoogleMapsService,
          { provide: ConfigService, useValue: { get: () => undefined } },
        ],
      }).compile();
      const noKeyService = module.get<GoogleMapsService>(GoogleMapsService);

      const url = await noKeyService.resolveThumbnailFromMapsLink(
        'https://maps.google.com/?q=-8.409518,115.188919',
      );
      expect(url).toBeNull();
    });
  });
});
