import {
    Injectable,
    BadRequestException,
    NotFoundException,
    ForbiddenException,
  } from '@nestjs/common';
  import { PrismaService } from '../prisma/prisma.service';
  import { R2Service } from '../integrations/r2/r2.service';
  import { PresignUploadDto, CreateDocumentDto } from './dto/media.dto';
  import { DocumentSerializer } from './serializers/document.serializer';
  
  @Injectable()
  export class MediaService {
    constructor(
      private readonly prisma: PrismaService,
      private readonly r2: R2Service,
    ) {}
  
    /**
     * Issue a presigned R2 PUT URL for a trip's media bucket path. Participants
     * only (ARCHITECTURE §7 — direct-to-R2 upload, never proxied through NestJS).
     */
    async presignUpload(userId: string, dto: PresignUploadDto) {
      await this.assertParticipant(dto.trip_id, userId);
  
      return this.r2.presignUpload(dto.trip_id, dto.content_type);
    }
  
    /**
     * List all media for a trip's Media tab, most recent first. Participants only.
     * (WORKFLOW §10)
     */
    async listDocuments(tripId: string, userId: string) {
      const trip = await this.assertParticipant(tripId, userId);
  
      const documents = await this.prisma.tripDocument.findMany({
        where: { tripId },
        orderBy: { createdAt: 'desc' },
      });
  
      return {
        data: documents.map((d) => DocumentSerializer.toList(d, trip.coverDocumentId)),
      };
    }
  
    /**
     * Register an object already uploaded to R2 as a `trip_documents` row.
     * Verifies the object actually exists via `HeadObject` before inserting
     * (ARCHITECTURE §7 sequence).
     */
    async createDocument(tripId: string, userId: string, dto: CreateDocumentDto) {
      await this.assertParticipant(tripId, userId);
  
      if (!dto.storage_key.startsWith(`trips/${tripId}/`)) {
        throw new BadRequestException({
          code: 'INVALID_STORAGE_KEY',
          message: 'storage_key does not belong to this trip',
        });
      }
  
      const head = await this.r2.headObject(dto.storage_key);
      if (!head.exists) {
        throw new BadRequestException({
          code: 'OBJECT_NOT_FOUND',
          message: 'Uploaded object not found in R2 — upload may still be in progress',
        });
      }
  
      const document = await this.prisma.tripDocument.create({
        data: {
          tripId,
          uploadedBy: userId,
          mediaType: dto.media_type,
          storageKey: dto.storage_key,
          storageUrl: this.r2.resolvePublicUrl(dto.storage_key),
          fromChat: false,
        },
      });
  
      const trip = await this.prisma.trip.findFirst({
        where: { id: tripId },
        select: { coverDocumentId: true },
      });
  
      return DocumentSerializer.toList(document, trip?.coverDocumentId ?? null);
    }
  
    /**
     * Delete a media item — uploader or trip creator only.
     */
    async deleteDocument(tripId: string, documentId: string, userId: string): Promise<void> {
      const trip = await this.prisma.trip.findFirst({
        where: { id: tripId },
        select: { id: true, creatorId: true },
      });
  
      if (!trip) {
        throw new NotFoundException({ code: 'TRIP_NOT_FOUND', message: 'Trip not found' });
      }
  
      const document = await this.prisma.tripDocument.findFirst({
        where: { id: documentId, tripId },
      });
  
      if (!document) {
        throw new NotFoundException({
          code: 'DOCUMENT_NOT_FOUND',
          message: 'Document not found in this trip',
        });
      }
  
      const isUploader = document.uploadedBy === userId;
      const isCreator = trip.creatorId === userId;
      if (!isUploader && !isCreator) {
        throw new ForbiddenException({
          code: 'NOT_DOCUMENT_OWNER',
          message: 'Only the uploader or trip creator can delete this document',
        });
      }
  
      await this.prisma.$transaction(async (tx) => {
        // Clear any cover references pointing at this document before deleting it.
        await tx.trip.updateMany({
          where: { id: tripId, coverDocumentId: documentId },
          data: { coverDocumentId: null },
        });
        await tx.tripActivity.updateMany({
          where: { tripId, coverDocumentId: documentId },
          data: { coverDocumentId: null, coverSource: 'none' },
        });
        await tx.tripDocument.delete({ where: { id: documentId } });
      });
    }
  
    private async assertParticipant(tripId: string, userId: string) {
      const trip = await this.prisma.trip.findFirst({
        where: { id: tripId, participants: { some: { userId } } },
        select: { id: true, coverDocumentId: true },
      });
  
      if (!trip) {
        throw new NotFoundException({
          code: 'TRIP_NOT_FOUND',
          message: 'Trip not found or access denied',
        });
      }
  
      return trip;
    }
  }