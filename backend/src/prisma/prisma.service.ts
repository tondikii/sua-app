import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: process.env.APP_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
    });

    // Soft-delete extension: automatically filter deleted_at IS NULL
    // for models that support soft-delete (Trip, Wishlist, TripMessage)
    Object.assign(
      this,
      (this as PrismaClient).$extends({
        query: {
          trip: {
            async findFirst({ args, query }) {
              args.where = { ...args.where, deletedAt: null };
              return query(args);
            },
            async findFirstOrThrow({ args, query }) {
              args.where = { ...args.where, deletedAt: null };
              return query(args);
            },
            async findMany({ args, query }) {
              args.where = { ...args.where, deletedAt: null };
              return query(args);
            },
            async findUnique({ args, query }) {
              return query(args);
            },
            async findUniqueOrThrow({ args, query }) {
              return query(args);
            },
            async count({ args, query }) {
              args.where = { ...args.where, deletedAt: null };
              return query(args);
            },
          },
          wishlist: {
            async findFirst({ args, query }) {
              args.where = { ...args.where, deletedAt: null };
              return query(args);
            },
            async findFirstOrThrow({ args, query }) {
              args.where = { ...args.where, deletedAt: null };
              return query(args);
            },
            async findMany({ args, query }) {
              args.where = { ...args.where, deletedAt: null };
              return query(args);
            },
            async count({ args, query }) {
              args.where = { ...args.where, deletedAt: null };
              return query(args);
            },
          },
          tripMessage: {
            async findMany({ args, query }) {
              args.where = { ...args.where, deletedAt: null };
              return query(args);
            },
          },
        },
      }),
    );
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
