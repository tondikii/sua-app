import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

/** Presigned PUT URL for direct client uploads (ARCHITECTURE §7). */
export const PRESIGN_UPLOAD_EXPIRY_SECONDS = 300;

/** Presigned GET URL for serving media to clients without a public bucket URL. */
export const PRESIGN_DOWNLOAD_EXPIRY_SECONDS = 3600;

const EXTENSION_BY_CONTENT_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'video/mp4': 'mp4',
  'video/quicktime': 'mov',
};

/**
 * Thin wrapper around the S3-compatible Cloudflare R2 API.
 * NestJS never proxies binary bytes — it only issues/validates presigned
 * URLs (ARCHITECTURE §4.6, §7).
 */
@Injectable()
export class R2Service {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;

  constructor(private readonly config: ConfigService) {
    const accountId = this.config.get<string>('R2_ACCOUNT_ID');
    this.bucket = this.config.get<string>('R2_BUCKET_NAME')!;
    this.publicUrl = this.config.get<string>('R2_PUBLIC_URL')!;

    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: this.config.get<string>('R2_ACCESS_KEY_ID')!,
        secretAccessKey: this.config.get<string>('R2_SECRET_ACCESS_KEY')!,
      },
    });
  }

  /**
   * Build a fresh object key and a presigned PUT URL for the client to
   * upload directly to. Bucket layout: `trips/{tripId}/{uuid}.{ext}`.
   */
  async presignUpload(tripId: string, contentType: string) {
    const ext = EXTENSION_BY_CONTENT_TYPE[contentType] ?? 'bin';
    const storageKey = `trips/${tripId}/${randomUUID()}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: storageKey,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(this.client, command, {
      expiresIn: PRESIGN_UPLOAD_EXPIRY_SECONDS,
    });

    return {
      upload_url: uploadUrl,
      storage_key: storageKey,
      expires_in: PRESIGN_UPLOAD_EXPIRY_SECONDS,
    };
  }

  /**
   * Issue a time-limited presigned GET URL so clients can fetch an object
   * without relying on R2 public dev URLs or a custom domain.
   */
  async presignDownload(storageKey: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: storageKey,
    });

    return getSignedUrl(this.client, command, {
      expiresIn: PRESIGN_DOWNLOAD_EXPIRY_SECONDS,
    });
  }

  /** Batch variant for list endpoints (e.g. trip cards with cover images). */
  async presignDownloads(storageKeys: string[]): Promise<Map<string, string>> {
    const uniqueKeys = [...new Set(storageKeys.filter(Boolean))];
    const entries = await Promise.all(
      uniqueKeys.map(async (key) => [key, await this.presignDownload(key)] as const),
    );
    return new Map(entries);
  }

  /** Derive the R2 object key from a stored URL or return the key as-is. */
  extractStorageKey(urlOrKey: string): string {
    try {
      const { pathname } = new URL(urlOrKey);
      return pathname.replace(/^\/+/, '');
    } catch {
      return urlOrKey;
    }
  }

  /** Verify an object actually landed in R2 before registering it as a document. */
  async headObject(storageKey: string): Promise<{ exists: boolean; size?: number }> {
    try {
      const result = await this.client.send(
        new HeadObjectCommand({ Bucket: this.bucket, Key: storageKey }),
      );
      return { exists: true, size: result.ContentLength };
    } catch {
      return { exists: false };
    }
  }

  /** Resolve the public/CDN URL for a stored object key. */
  resolvePublicUrl(storageKey: string): string {
    return `${this.publicUrl.replace(/\/+$/, '')}/${storageKey}`;
  }
}
