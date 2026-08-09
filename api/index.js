"use strict";
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// dist/config/configuration.js
var require_configuration = __commonJS({
  "dist/config/configuration.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.default = () => ({
      port: parseInt(process.env.PORT ?? "8080", 10),
      appEnv: process.env.APP_ENV ?? "development",
      app: {
        webUrl: process.env.APP_WEB_URL ?? "http://localhost:8081"
      },
      userLimit: parseInt(process.env.USER_LIMIT ?? "50", 10),
      cronSecret: process.env.CRON_SECRET ?? "",
      database: {
        url: process.env.DATABASE_URL,
        directUrl: process.env.DIRECT_URL
      },
      supabase: {
        url: process.env.SUPABASE_URL,
        serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        jwtSecret: process.env.SUPABASE_JWT_SECRET,
        anonKey: process.env.SUPABASE_ANON_KEY
      },
      jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: "24h"
      },
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        mapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
        calendarClientId: process.env.GOOGLE_CALENDAR_CLIENT_ID,
        calendarClientSecret: process.env.GOOGLE_CALENDAR_CLIENT_SECRET
      },
      r2: {
        accountId: process.env.R2_ACCOUNT_ID,
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
        bucketName: process.env.R2_BUCKET_NAME,
        publicUrl: process.env.R2_PUBLIC_URL
      },
      mail: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE,
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
        from: process.env.MAIL_FROM
      },
      expo: {
        accessToken: process.env.EXPO_ACCESS_TOKEN
      }
    });
  }
});

// dist/prisma/prisma.service.js
var require_prisma_service = __commonJS({
  "dist/prisma/prisma.service.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = exports2 && exports2.__metadata || function(k, v) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.PrismaService = void 0;
    var common_1 = require("@nestjs/common");
    var client_1 = require("@prisma/client");
    var PrismaService = class PrismaService extends client_1.PrismaClient {
      constructor() {
        super({
          log: process.env.APP_ENV === "development" ? ["query", "warn", "error"] : ["error"]
        });
        Object.assign(this, this.$extends({
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
              }
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
              }
            },
            tripMessage: {
              async findMany({ args, query }) {
                args.where = { ...args.where, deletedAt: null };
                return query(args);
              }
            }
          }
        }));
      }
      async onModuleInit() {
        await this.$connect();
      }
      async onModuleDestroy() {
        await this.$disconnect();
      }
    };
    exports2.PrismaService = PrismaService;
    exports2.PrismaService = PrismaService = __decorate([
      (0, common_1.Injectable)(),
      __metadata("design:paramtypes", [])
    ], PrismaService);
  }
});

// dist/prisma/prisma.module.js
var require_prisma_module = __commonJS({
  "dist/prisma/prisma.module.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.PrismaModule = void 0;
    var common_1 = require("@nestjs/common");
    var prisma_service_1 = require_prisma_service();
    var PrismaModule = class PrismaModule {
    };
    exports2.PrismaModule = PrismaModule;
    exports2.PrismaModule = PrismaModule = __decorate([
      (0, common_1.Global)(),
      (0, common_1.Module)({
        providers: [prisma_service_1.PrismaService],
        exports: [prisma_service_1.PrismaService]
      })
    ], PrismaModule);
  }
});

// dist/users/serializers/user.serializer.js
var require_user_serializer = __commonJS({
  "dist/users/serializers/user.serializer.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.UserSummarySerializer = void 0;
    var R2_AVATAR_PREFIX = "avatars/";
    var R2_DEV_HOST = "r2.dev";
    var UserSummarySerializer = class _UserSummarySerializer {
      static async resolveAvatar(avatarUrl, r2) {
        if (!avatarUrl)
          return null;
        let key = avatarUrl;
        if (avatarUrl.startsWith(R2_AVATAR_PREFIX)) {
          key = avatarUrl;
        } else if (avatarUrl.includes(R2_DEV_HOST)) {
          const { pathname } = new URL(avatarUrl);
          key = pathname.replace(/^\/+/, "");
          if (!key.startsWith(R2_AVATAR_PREFIX))
            return avatarUrl;
        } else {
          return avatarUrl;
        }
        try {
          return await r2.presignDownload(key);
        } catch {
          return avatarUrl;
        }
      }
      static async toSummary(user, r2) {
        return {
          id: user.id,
          name: user.name,
          username: user.username,
          avatar_url: await _UserSummarySerializer.resolveAvatar(user.avatarUrl, r2)
        };
      }
      static async toProfile(user, r2) {
        return {
          id: user.id,
          name: user.name,
          username: user.username,
          avatar_url: await _UserSummarySerializer.resolveAvatar(user.avatarUrl, r2),
          bio: user.bio,
          website_url: user.websiteUrl,
          location_label: user.locationLabel,
          is_public: user.isPublic,
          trip_count: user._count?.tripsCreated ?? 0,
          created_at: user.createdAt.toISOString()
        };
      }
    };
    exports2.UserSummarySerializer = UserSummarySerializer;
  }
});

// dist/integrations/supabase/realtime-token.service.js
var require_realtime_token_service = __commonJS({
  "dist/integrations/supabase/realtime-token.service.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __importStar = exports2 && exports2.__importStar || /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    var __metadata = exports2 && exports2.__metadata || function(k, v) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.RealtimeTokenService = void 0;
    var common_1 = require("@nestjs/common");
    var config_1 = require("@nestjs/config");
    var jwt = __importStar(require("jsonwebtoken"));
    var REALTIME_TOKEN_TTL_SECONDS = 60 * 60;
    var RealtimeTokenService = class RealtimeTokenService {
      constructor(config) {
        this.config = config;
      }
      mint(userId) {
        const secret = this.config.get("supabase.jwtSecret") ?? this.config.get("SUPABASE_JWT_SECRET") ?? "";
        if (!secret)
          return "";
        return jwt.sign({
          sub: userId,
          role: "authenticated",
          aud: "authenticated"
        }, secret, { expiresIn: REALTIME_TOKEN_TTL_SECONDS });
      }
    };
    exports2.RealtimeTokenService = RealtimeTokenService;
    exports2.RealtimeTokenService = RealtimeTokenService = __decorate([
      (0, common_1.Injectable)(),
      __metadata("design:paramtypes", [config_1.ConfigService])
    ], RealtimeTokenService);
  }
});

// dist/integrations/r2/r2.service.js
var require_r2_service = __commonJS({
  "dist/integrations/r2/r2.service.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = exports2 && exports2.__metadata || function(k, v) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.R2Service = exports2.PRESIGN_DOWNLOAD_EXPIRY_SECONDS = exports2.PRESIGN_UPLOAD_EXPIRY_SECONDS = void 0;
    var common_1 = require("@nestjs/common");
    var config_1 = require("@nestjs/config");
    var client_s3_1 = require("@aws-sdk/client-s3");
    var s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
    var crypto_1 = require("crypto");
    exports2.PRESIGN_UPLOAD_EXPIRY_SECONDS = 300;
    exports2.PRESIGN_DOWNLOAD_EXPIRY_SECONDS = 3600;
    var EXTENSION_BY_CONTENT_TYPE = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "video/mp4": "mp4",
      "video/quicktime": "mov"
    };
    var R2Service = class R2Service {
      constructor(config) {
        this.config = config;
        const accountId = this.config.get("R2_ACCOUNT_ID");
        this.bucket = this.config.get("R2_BUCKET_NAME");
        this.publicUrl = this.config.get("R2_PUBLIC_URL");
        this.client = new client_s3_1.S3Client({
          region: "auto",
          endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
          credentials: {
            accessKeyId: this.config.get("R2_ACCESS_KEY_ID"),
            secretAccessKey: this.config.get("R2_SECRET_ACCESS_KEY")
          },
          requestChecksumCalculation: "WHEN_REQUIRED"
        });
      }
      async presignUpload(tripId, contentType) {
        const ext = EXTENSION_BY_CONTENT_TYPE[contentType] ?? "bin";
        const storageKey = `trips/${tripId}/${(0, crypto_1.randomUUID)()}.${ext}`;
        const command = new client_s3_1.PutObjectCommand({
          Bucket: this.bucket,
          Key: storageKey,
          ContentType: contentType
        });
        const uploadUrl = await (0, s3_request_presigner_1.getSignedUrl)(this.client, command, {
          expiresIn: exports2.PRESIGN_UPLOAD_EXPIRY_SECONDS
        });
        return {
          upload_url: uploadUrl,
          storage_key: storageKey,
          expires_in: exports2.PRESIGN_UPLOAD_EXPIRY_SECONDS
        };
      }
      async presignAvatarUpload(userId, contentType) {
        const ext = EXTENSION_BY_CONTENT_TYPE[contentType] ?? "bin";
        const storageKey = `avatars/${userId}/${(0, crypto_1.randomUUID)()}.${ext}`;
        const command = new client_s3_1.PutObjectCommand({
          Bucket: this.bucket,
          Key: storageKey,
          ContentType: contentType
        });
        const uploadUrl = await (0, s3_request_presigner_1.getSignedUrl)(this.client, command, {
          expiresIn: exports2.PRESIGN_UPLOAD_EXPIRY_SECONDS
        });
        return {
          upload_url: uploadUrl,
          storage_key: storageKey,
          expires_in: exports2.PRESIGN_UPLOAD_EXPIRY_SECONDS
        };
      }
      async presignDownload(storageKey) {
        const command = new client_s3_1.GetObjectCommand({
          Bucket: this.bucket,
          Key: storageKey
        });
        return (0, s3_request_presigner_1.getSignedUrl)(this.client, command, {
          expiresIn: exports2.PRESIGN_DOWNLOAD_EXPIRY_SECONDS
        });
      }
      async presignDownloads(storageKeys) {
        const uniqueKeys = [...new Set(storageKeys.filter(Boolean))];
        const entries = await Promise.all(uniqueKeys.map(async (key) => [key, await this.presignDownload(key)]));
        return new Map(entries);
      }
      async putObject(tripId, contentType, body) {
        const ext = EXTENSION_BY_CONTENT_TYPE[contentType] ?? "bin";
        const storageKey = `trips/${tripId}/${(0, crypto_1.randomUUID)()}.${ext}`;
        await this.client.send(new client_s3_1.PutObjectCommand({
          Bucket: this.bucket,
          Key: storageKey,
          ContentType: contentType,
          Body: body
        }));
        return {
          storageKey,
          storageUrl: this.resolvePublicUrl(storageKey)
        };
      }
      extractStorageKey(urlOrKey) {
        try {
          const { pathname } = new URL(urlOrKey);
          return pathname.replace(/^\/+/, "");
        } catch {
          return urlOrKey;
        }
      }
      async headObject(storageKey) {
        try {
          const result = await this.client.send(new client_s3_1.HeadObjectCommand({ Bucket: this.bucket, Key: storageKey }));
          return { exists: true, size: result.ContentLength };
        } catch {
          return { exists: false };
        }
      }
      resolvePublicUrl(storageKey) {
        return `${this.publicUrl.replace(/\/+$/, "")}/${storageKey}`;
      }
    };
    exports2.R2Service = R2Service;
    exports2.R2Service = R2Service = __decorate([
      (0, common_1.Injectable)(),
      __metadata("design:paramtypes", [config_1.ConfigService])
    ], R2Service);
  }
});

// dist/auth/auth.service.js
var require_auth_service = __commonJS({
  "dist/auth/auth.service.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = exports2 && exports2.__metadata || function(k, v) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.AuthService = void 0;
    var common_1 = require("@nestjs/common");
    var jwt_1 = require("@nestjs/jwt");
    var config_1 = require("@nestjs/config");
    var google_auth_library_1 = require("google-auth-library");
    var prisma_service_1 = require_prisma_service();
    var user_serializer_1 = require_user_serializer();
    var realtime_token_service_1 = require_realtime_token_service();
    var r2_service_1 = require_r2_service();
    var AuthService = class AuthService {
      constructor(prisma, jwtService, config, realtimeToken, r2) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.config = config;
        this.realtimeToken = realtimeToken;
        this.r2 = r2;
        this.googleClient = new google_auth_library_1.OAuth2Client(config.get("google.clientId"));
      }
      async googleLogin(dto) {
        let ticket;
        try {
          ticket = await this.googleClient.verifyIdToken({
            idToken: dto.id_token,
            audience: this.config.get("google.clientId")
          });
        } catch {
          throw new common_1.UnauthorizedException("Invalid Google ID token");
        }
        const payload = ticket.getPayload();
        if (!payload || !payload.sub || !payload.email) {
          throw new common_1.UnauthorizedException("Invalid Google token payload");
        }
        const existing = await this.prisma.user.findFirst({
          where: { googleId: payload.sub }
        });
        let isNewUser = false;
        const user = existing ? await this.prisma.user.update({
          where: { id: existing.id },
          data: {
            email: payload.email,
            name: payload.name ?? existing.name,
            avatarUrl: payload.picture ?? existing.avatarUrl
          }
        }) : await (async () => {
          isNewUser = true;
          const activeUsers = await this.prisma.user.count();
          const userLimit = this.config.get("userLimit") ?? 50;
          if (activeUsers >= userLimit) {
            throw new common_1.ForbiddenException({
              code: "USER_LIMIT_REACHED",
              message: "Aplikasi sedang penuh. Batas pengguna aktif sudah tercapai \u2014 coba lagi nanti ya."
            });
          }
          const tempUsername = `user_${Date.now()}`;
          return this.prisma.user.create({
            data: {
              googleId: payload.sub,
              email: payload.email ?? "",
              name: payload.name ?? payload.email ?? "User",
              username: tempUsername,
              avatarUrl: payload.picture
            }
          });
        })();
        const needsRegistration = isNewUser || /^user_\d+$/.test(user.username);
        const accessToken = this.signAppJwt(user.id);
        const realtimeToken = this.realtimeToken.mint(user.id);
        return {
          access_token: accessToken,
          realtime_token: realtimeToken,
          is_new_user: needsRegistration,
          ...needsRegistration ? {} : { user: await user_serializer_1.UserSummarySerializer.toProfile(user, this.r2) }
        };
      }
      async completeRegistration(userId, dto) {
        const username = dto.username.toLowerCase();
        const conflict = await this.prisma.user.findFirst({
          where: { username, NOT: { id: userId } }
        });
        if (conflict) {
          throw new common_1.ConflictException({
            code: "USERNAME_TAKEN",
            message: "Username is already taken"
          });
        }
        if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
          throw new common_1.BadRequestException({
            code: "USERNAME_INVALID",
            message: "Username must be 3\u201330 characters: letters, numbers, underscores only"
          });
        }
        const user = await this.prisma.user.update({
          where: { id: userId },
          data: { username }
        });
        return { user: await user_serializer_1.UserSummarySerializer.toProfile(user, this.r2) };
      }
      signAppJwt(userId) {
        return this.jwtService.sign({ sub: userId });
      }
    };
    exports2.AuthService = AuthService;
    exports2.AuthService = AuthService = __decorate([
      (0, common_1.Injectable)(),
      __metadata("design:paramtypes", [
        prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService,
        realtime_token_service_1.RealtimeTokenService,
        r2_service_1.R2Service
      ])
    ], AuthService);
  }
});

// dist/common/pipes/zod-validation.pipe.js
var require_zod_validation_pipe = __commonJS({
  "dist/common/pipes/zod-validation.pipe.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = exports2 && exports2.__metadata || function(k, v) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ZodValidationPipe = void 0;
    var common_1 = require("@nestjs/common");
    var zod_1 = require("zod");
    var ZodValidationPipe = class ZodValidationPipe {
      constructor(schema) {
        this.schema = schema;
      }
      transform(value, _metadata) {
        const result = this.schema.safeParse(value);
        if (!result.success) {
          const errors = result.error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
            code: e.code
          }));
          throw new common_1.BadRequestException({
            statusCode: 400,
            message: "Validation failed",
            errors
          });
        }
        return result.data;
      }
    };
    exports2.ZodValidationPipe = ZodValidationPipe;
    exports2.ZodValidationPipe = ZodValidationPipe = __decorate([
      (0, common_1.Injectable)(),
      __metadata("design:paramtypes", [zod_1.ZodSchema])
    ], ZodValidationPipe);
  }
});

// dist/common/guards/jwt-auth.guard.js
var require_jwt_auth_guard = __commonJS({
  "dist/common/guards/jwt-auth.guard.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.JwtAuthGuard = void 0;
    var common_1 = require("@nestjs/common");
    var passport_1 = require("@nestjs/passport");
    var JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)("jwt") {
    };
    exports2.JwtAuthGuard = JwtAuthGuard;
    exports2.JwtAuthGuard = JwtAuthGuard = __decorate([
      (0, common_1.Injectable)()
    ], JwtAuthGuard);
  }
});

// dist/common/decorators/current-user.decorator.js
var require_current_user_decorator = __commonJS({
  "dist/common/decorators/current-user.decorator.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.CurrentUser = void 0;
    var common_1 = require("@nestjs/common");
    exports2.CurrentUser = (0, common_1.createParamDecorator)((_data, ctx) => {
      const request = ctx.switchToHttp().getRequest();
      return request.user;
    });
  }
});

// dist/auth/auth.controller.js
var require_auth_controller = __commonJS({
  "dist/auth/auth.controller.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = exports2 && exports2.__metadata || function(k, v) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var __param = exports2 && exports2.__param || function(paramIndex, decorator) {
      return function(target, key) {
        decorator(target, key, paramIndex);
      };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.AuthController = void 0;
    var common_1 = require("@nestjs/common");
    var swagger_1 = require("@nestjs/swagger");
    var auth_service_1 = require_auth_service();
    var shared_validation_1 = require("@atur-perjalanan/shared-validation");
    var zod_validation_pipe_1 = require_zod_validation_pipe();
    var jwt_auth_guard_1 = require_jwt_auth_guard();
    var current_user_decorator_1 = require_current_user_decorator();
    var AuthController = class AuthController {
      constructor(authService) {
        this.authService = authService;
      }
      googleLogin(dto) {
        return this.authService.googleLogin(dto);
      }
      completeRegistration(user, dto) {
        return this.authService.completeRegistration(user.userId, dto);
      }
    };
    exports2.AuthController = AuthController;
    __decorate([
      (0, common_1.Post)("google"),
      __param(0, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(shared_validation_1.GoogleAuthSchema))),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object]),
      __metadata("design:returntype", void 0)
    ], AuthController.prototype, "googleLogin", null);
    __decorate([
      (0, common_1.Post)("complete-registration"),
      (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
      (0, swagger_1.ApiBearerAuth)(),
      __param(0, (0, current_user_decorator_1.CurrentUser)()),
      __param(1, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(shared_validation_1.CompleteRegistrationSchema))),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object, Object]),
      __metadata("design:returntype", void 0)
    ], AuthController.prototype, "completeRegistration", null);
    exports2.AuthController = AuthController = __decorate([
      (0, swagger_1.ApiTags)("auth"),
      (0, common_1.Controller)("auth"),
      __metadata("design:paramtypes", [auth_service_1.AuthService])
    ], AuthController);
  }
});

// dist/auth/strategies/jwt.strategy.js
var require_jwt_strategy = __commonJS({
  "dist/auth/strategies/jwt.strategy.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = exports2 && exports2.__metadata || function(k, v) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.JwtStrategy = void 0;
    var common_1 = require("@nestjs/common");
    var passport_1 = require("@nestjs/passport");
    var passport_jwt_1 = require("passport-jwt");
    var config_1 = require("@nestjs/config");
    var JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
      constructor(config) {
        super({
          jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
          ignoreExpiration: false,
          secretOrKey: config.get("jwt.secret")
        });
      }
      validate(payload) {
        return { userId: payload.sub };
      }
    };
    exports2.JwtStrategy = JwtStrategy;
    exports2.JwtStrategy = JwtStrategy = __decorate([
      (0, common_1.Injectable)(),
      __metadata("design:paramtypes", [config_1.ConfigService])
    ], JwtStrategy);
  }
});

// dist/integrations/supabase/supabase.module.js
var require_supabase_module = __commonJS({
  "dist/integrations/supabase/supabase.module.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.SupabaseModule = void 0;
    var common_1 = require("@nestjs/common");
    var config_1 = require("@nestjs/config");
    var realtime_token_service_1 = require_realtime_token_service();
    var SupabaseModule = class SupabaseModule {
    };
    exports2.SupabaseModule = SupabaseModule;
    exports2.SupabaseModule = SupabaseModule = __decorate([
      (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        providers: [realtime_token_service_1.RealtimeTokenService],
        exports: [realtime_token_service_1.RealtimeTokenService]
      })
    ], SupabaseModule);
  }
});

// dist/integrations/r2/r2.module.js
var require_r2_module = __commonJS({
  "dist/integrations/r2/r2.module.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.R2Module = void 0;
    var common_1 = require("@nestjs/common");
    var config_1 = require("@nestjs/config");
    var r2_service_1 = require_r2_service();
    var R2Module = class R2Module {
    };
    exports2.R2Module = R2Module;
    exports2.R2Module = R2Module = __decorate([
      (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        providers: [r2_service_1.R2Service],
        exports: [r2_service_1.R2Service]
      })
    ], R2Module);
  }
});

// dist/auth/auth.module.js
var require_auth_module = __commonJS({
  "dist/auth/auth.module.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.AuthModule = void 0;
    var common_1 = require("@nestjs/common");
    var jwt_1 = require("@nestjs/jwt");
    var passport_1 = require("@nestjs/passport");
    var config_1 = require("@nestjs/config");
    var auth_controller_1 = require_auth_controller();
    var auth_service_1 = require_auth_service();
    var jwt_strategy_1 = require_jwt_strategy();
    var supabase_module_1 = require_supabase_module();
    var r2_module_1 = require_r2_module();
    var AuthModule = class AuthModule {
    };
    exports2.AuthModule = AuthModule;
    exports2.AuthModule = AuthModule = __decorate([
      (0, common_1.Module)({
        imports: [
          passport_1.PassportModule,
          supabase_module_1.SupabaseModule,
          r2_module_1.R2Module,
          jwt_1.JwtModule.registerAsync({
            inject: [config_1.ConfigService],
            useFactory: (config) => ({
              secret: config.get("jwt.secret"),
              signOptions: { expiresIn: config.get("jwt.expiresIn") }
            })
          })
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy],
        exports: [jwt_1.JwtModule]
      })
    ], AuthModule);
  }
});

// dist/common/helpers/date.helpers.js
var require_date_helpers = __commonJS({
  "dist/common/helpers/date.helpers.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.toDateOnly = toDateOnly;
    exports2.toTime = toTime;
    exports2.timeToHHMM = timeToHHMM;
    exports2.dateToISO = dateToISO;
    exports2.toTimeDate = toTimeDate;
    function toDateOnly(date) {
      return date ? date.toISOString().split("T")[0] : null;
    }
    function toTime(date) {
      return date ? timeToHHMM(new Date(date)) : null;
    }
    function timeToHHMM(date) {
      const h = String(date.getUTCHours()).padStart(2, "0");
      const m = String(date.getUTCMinutes()).padStart(2, "0");
      return `${h}:${m}`;
    }
    function dateToISO(date) {
      return date ? date.toISOString().split("T")[0] : null;
    }
    function toTimeDate(time) {
      if (!time)
        return null;
      const [h, m] = time.split(":").map(Number);
      return new Date(Date.UTC(1970, 0, 1, h, m, 0, 0));
    }
  }
});

// dist/users/users.service.js
var require_users_service = __commonJS({
  "dist/users/users.service.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = exports2 && exports2.__metadata || function(k, v) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.UsersService = void 0;
    var common_1 = require("@nestjs/common");
    var client_1 = require("@prisma/client");
    var prisma_service_1 = require_prisma_service();
    var user_serializer_1 = require_user_serializer();
    var date_helpers_1 = require_date_helpers();
    var r2_service_1 = require_r2_service();
    var USER_SELECT = {
      id: true,
      name: true,
      username: true,
      avatarUrl: true,
      bio: true,
      websiteUrl: true,
      locationLabel: true,
      isPublic: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { tripsCreated: true } }
    };
    var UsersService = class UsersService {
      constructor(prisma, r2) {
        this.prisma = prisma;
        this.r2 = r2;
      }
      async checkUsername(username) {
        const lower = username.toLowerCase();
        const existing = await this.prisma.user.findFirst({
          where: { username: lower },
          select: { id: true }
        });
        return {
          username: lower,
          available: !existing
        };
      }
      async searchUsers(q, cursor, limit = 20) {
        const take = Math.min(limit, 100);
        const cursorCondition = cursor ? client_1.Prisma.sql`AND u.id < ${cursor}::uuid` : client_1.Prisma.empty;
        const users = await this.prisma.$queryRaw`
      SELECT
        u.id,
        u.name,
        u.username,
        u.avatar_url,
        COUNT(DISTINCT t.id) AS trip_count
      FROM users u
      LEFT JOIN trips t ON t.creator_id = u.id AND t.deleted_at IS NULL AND t.is_public = TRUE
      WHERE
        (u.username ILIKE ${`%${q}%`} OR u.name ILIKE ${`%${q}%`})
        ${cursorCondition}
      GROUP BY u.id
      ORDER BY
        CASE WHEN u.username ILIKE ${`${q}%`} THEN 0
             WHEN u.name ILIKE ${`${q}%`} THEN 1
             ELSE 2
        END,
        u.username
      LIMIT ${take + 1}
    `;
        const hasMore = users.length > take;
        const results = hasMore ? users.slice(0, take) : users;
        const avatarKeys = results.map((u) => u.avatar_url).filter((url) => !!url && !url.includes("://"));
        const signedAvatars = await this.r2.presignDownloads(avatarKeys);
        const resolveAvatar = async (url) => {
          if (!url)
            return null;
          if (url.includes("://"))
            return user_serializer_1.UserSummarySerializer.resolveAvatar(url, this.r2);
          return signedAvatars.get(url) ?? url;
        };
        return {
          data: await Promise.all(results.map(async (u) => ({
            id: u.id,
            name: u.name,
            username: u.username,
            avatar_url: await resolveAvatar(u.avatar_url),
            trip_count: Number(u.trip_count)
          }))),
          next_cursor: hasMore ? results[results.length - 1]?.id ?? null : null
        };
      }
      async getMe(userId) {
        const user = await this.prisma.user.findFirst({
          where: { id: userId },
          select: USER_SELECT
        });
        if (!user) {
          throw new common_1.UnauthorizedException({
            code: "USER_NOT_FOUND",
            message: "Account no longer exists"
          });
        }
        return user_serializer_1.UserSummarySerializer.toProfile(user, this.r2);
      }
      async updateMe(userId, dto) {
        const user = await this.prisma.user.update({
          where: { id: userId },
          data: {
            ...dto.name !== void 0 && { name: dto.name },
            ...dto.bio !== void 0 && { bio: dto.bio },
            ...dto.website_url !== void 0 && { websiteUrl: dto.website_url },
            ...dto.location_label !== void 0 && { locationLabel: dto.location_label },
            ...dto.is_public !== void 0 && { isPublic: dto.is_public }
          },
          select: USER_SELECT
        });
        return user_serializer_1.UserSummarySerializer.toProfile(user, this.r2);
      }
      async presignAvatarUpload(userId, contentType) {
        return this.r2.presignAvatarUpload(userId, contentType);
      }
      async updateAvatar(userId, storageKey) {
        if (!storageKey.startsWith(`avatars/${userId}/`)) {
          throw new common_1.BadRequestException({
            code: "INVALID_STORAGE_KEY",
            message: "storage_key does not belong to this user"
          });
        }
        const head = await this.r2.headObject(storageKey);
        if (!head.exists) {
          throw new common_1.BadRequestException({
            code: "OBJECT_NOT_FOUND",
            message: "Uploaded object not found in R2 \u2014 upload may still be in progress"
          });
        }
        const user = await this.prisma.user.update({
          where: { id: userId },
          data: { avatarUrl: storageKey },
          select: USER_SELECT
        });
        return user_serializer_1.UserSummarySerializer.toProfile(user, this.r2);
      }
      async deleteMe(userId) {
        await this.prisma.user.delete({ where: { id: userId } });
      }
      async getPublicProfile(username, viewerUserId) {
        const user = await this.prisma.user.findFirst({
          where: { username: username.toLowerCase() },
          select: USER_SELECT
        });
        if (!user) {
          throw new common_1.NotFoundException({ code: "USER_NOT_FOUND", message: "User not found" });
        }
        if (!user.isPublic && user.id !== viewerUserId) {
          throw new common_1.ForbiddenException({ code: "PROFILE_PRIVATE", message: "This profile is private" });
        }
        return user_serializer_1.UserSummarySerializer.toProfile(user, this.r2);
      }
      async getUserTrips(username, viewerUserId, cursor, limit = 20) {
        const take = Math.min(limit, 100);
        const user = await this.prisma.user.findFirst({
          where: { username: username.toLowerCase() },
          select: { id: true, isPublic: true }
        });
        if (!user) {
          throw new common_1.NotFoundException({ code: "USER_NOT_FOUND", message: "User not found" });
        }
        const isOwner = user.id === viewerUserId;
        const trips = await this.prisma.trip.findMany({
          where: {
            creatorId: user.id,
            deletedAt: null,
            ...isOwner ? {} : { isPublic: true },
            ...cursor ? { id: { lt: cursor } } : {}
          },
          orderBy: { createdAt: "desc" },
          include: {
            coverDocument: { select: { storageKey: true, storageUrl: true } },
            _count: { select: { participants: true } },
            participants: {
              take: 4,
              orderBy: { joinedAt: "asc" },
              select: {
                user: {
                  select: { id: true, name: true, username: true, avatarUrl: true }
                }
              }
            }
          }
        });
        const hasMore = trips.length > take;
        const results = hasMore ? trips.slice(0, take) : trips;
        const coverKeys = results.map((t) => this.resolveCoverKey(t.coverDocument)).filter((key) => Boolean(key));
        const signedCovers = await this.r2.presignDownloads(coverKeys);
        const resolveCover = (t) => {
          const key = this.resolveCoverKey(t.coverDocument);
          if (!key)
            return null;
          return signedCovers.get(key) ?? null;
        };
        const avatarKeys = results.flatMap((t) => t.participants.map((p) => p.user.avatarUrl)).filter((url) => !!url && !url.includes("://"));
        const signedAvatars = await this.r2.presignDownloads(avatarKeys);
        const resolveAvatar = async (url) => {
          if (!url)
            return null;
          if (url.includes("://"))
            return user_serializer_1.UserSummarySerializer.resolveAvatar(url, this.r2);
          return signedAvatars.get(url) ?? url;
        };
        return {
          data: await Promise.all(results.map(async (t) => ({
            id: t.id,
            name: t.name,
            tags: t.tags ?? [],
            status: t.status,
            start_date: (0, date_helpers_1.toDateOnly)(t.startDate),
            end_date: (0, date_helpers_1.toDateOnly)(t.endDate),
            is_all_day: t.isAllDay,
            start_time: (0, date_helpers_1.toTime)(t.startTime),
            end_time: (0, date_helpers_1.toTime)(t.endTime),
            cover_image_url: resolveCover(t),
            voting_deadline: t.votingDeadline?.toISOString() ?? null,
            participant_count: t._count.participants,
            participants_preview: await Promise.all(t.participants.map(async (p) => ({
              id: p.user.id,
              name: p.user.name,
              username: p.user.username,
              avatar_url: await resolveAvatar(p.user.avatarUrl)
            })))
          }))),
          next_cursor: hasMore ? results[results.length - 1]?.id ?? null : null
        };
      }
      resolveCoverKey(coverDocument) {
        if (!coverDocument)
          return null;
        if (coverDocument.storageKey)
          return coverDocument.storageKey;
        if (coverDocument.storageUrl)
          return this.r2.extractStorageKey(coverDocument.storageUrl);
        return null;
      }
    };
    exports2.UsersService = UsersService;
    exports2.UsersService = UsersService = __decorate([
      (0, common_1.Injectable)(),
      __metadata("design:paramtypes", [
        prisma_service_1.PrismaService,
        r2_service_1.R2Service
      ])
    ], UsersService);
  }
});

// dist/users/users.controller.js
var require_users_controller = __commonJS({
  "dist/users/users.controller.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = exports2 && exports2.__metadata || function(k, v) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var __param = exports2 && exports2.__param || function(paramIndex, decorator) {
      return function(target, key) {
        decorator(target, key, paramIndex);
      };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.UsersController = void 0;
    var common_1 = require("@nestjs/common");
    var swagger_1 = require("@nestjs/swagger");
    var users_service_1 = require_users_service();
    var jwt_auth_guard_1 = require_jwt_auth_guard();
    var current_user_decorator_1 = require_current_user_decorator();
    var shared_validation_1 = require("@atur-perjalanan/shared-validation");
    var zod_validation_pipe_1 = require_zod_validation_pipe();
    var UsersController = class UsersController {
      constructor(usersService) {
        this.usersService = usersService;
      }
      checkUsername(query) {
        return this.usersService.checkUsername(query.username);
      }
      searchUsers(query) {
        return this.usersService.searchUsers(query.q, query.cursor, query.limit);
      }
      getMe(user) {
        return this.usersService.getMe(user.userId);
      }
      updateMe(user, dto) {
        return this.usersService.updateMe(user.userId, dto);
      }
      presignAvatar(user, dto) {
        return this.usersService.presignAvatarUpload(user.userId, dto.content_type);
      }
      updateAvatar(user, dto) {
        return this.usersService.updateAvatar(user.userId, dto.storage_key);
      }
      deleteMe(user) {
        return this.usersService.deleteMe(user.userId);
      }
      getProfile(username, user) {
        return this.usersService.getPublicProfile(username, user?.userId);
      }
      getUserTrips(username, user, cursor, limit) {
        return this.usersService.getUserTrips(username, user?.userId, cursor, limit);
      }
    };
    exports2.UsersController = UsersController;
    __decorate([
      (0, common_1.Get)("check-username"),
      __param(0, (0, common_1.Query)(new zod_validation_pipe_1.ZodValidationPipe(shared_validation_1.CheckUsernameSchema))),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object]),
      __metadata("design:returntype", void 0)
    ], UsersController.prototype, "checkUsername", null);
    __decorate([
      (0, common_1.Get)("search"),
      (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
      (0, swagger_1.ApiBearerAuth)(),
      __param(0, (0, common_1.Query)(new zod_validation_pipe_1.ZodValidationPipe(shared_validation_1.SearchUsersSchema))),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object]),
      __metadata("design:returntype", void 0)
    ], UsersController.prototype, "searchUsers", null);
    __decorate([
      (0, common_1.Get)("me"),
      (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
      (0, swagger_1.ApiBearerAuth)(),
      __param(0, (0, current_user_decorator_1.CurrentUser)()),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object]),
      __metadata("design:returntype", void 0)
    ], UsersController.prototype, "getMe", null);
    __decorate([
      (0, common_1.Put)("me"),
      (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
      (0, swagger_1.ApiBearerAuth)(),
      __param(0, (0, current_user_decorator_1.CurrentUser)()),
      __param(1, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(shared_validation_1.UpdateUserSchema))),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object, Object]),
      __metadata("design:returntype", void 0)
    ], UsersController.prototype, "updateMe", null);
    __decorate([
      (0, common_1.Post)("me/avatar/presign"),
      (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
      (0, swagger_1.ApiBearerAuth)(),
      __param(0, (0, current_user_decorator_1.CurrentUser)()),
      __param(1, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(shared_validation_1.PresignAvatarSchema))),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object, Object]),
      __metadata("design:returntype", void 0)
    ], UsersController.prototype, "presignAvatar", null);
    __decorate([
      (0, common_1.Put)("me/avatar"),
      (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
      (0, swagger_1.ApiBearerAuth)(),
      __param(0, (0, current_user_decorator_1.CurrentUser)()),
      __param(1, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(shared_validation_1.UpdateAvatarSchema))),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object, Object]),
      __metadata("design:returntype", void 0)
    ], UsersController.prototype, "updateAvatar", null);
    __decorate([
      (0, common_1.Delete)("me"),
      (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
      (0, swagger_1.ApiBearerAuth)(),
      (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
      __param(0, (0, current_user_decorator_1.CurrentUser)()),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object]),
      __metadata("design:returntype", void 0)
    ], UsersController.prototype, "deleteMe", null);
    __decorate([
      (0, common_1.Get)(":username"),
      (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
      (0, swagger_1.ApiBearerAuth)(),
      __param(0, (0, common_1.Param)("username")),
      __param(1, (0, current_user_decorator_1.CurrentUser)()),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [String, Object]),
      __metadata("design:returntype", void 0)
    ], UsersController.prototype, "getProfile", null);
    __decorate([
      (0, common_1.Get)(":username/trips"),
      (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
      (0, swagger_1.ApiBearerAuth)(),
      __param(0, (0, common_1.Param)("username")),
      __param(1, (0, current_user_decorator_1.CurrentUser)()),
      __param(2, (0, common_1.Query)("cursor")),
      __param(3, (0, common_1.Query)("limit")),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [String, Object, String, Number]),
      __metadata("design:returntype", void 0)
    ], UsersController.prototype, "getUserTrips", null);
    exports2.UsersController = UsersController = __decorate([
      (0, swagger_1.ApiTags)("users"),
      (0, common_1.Controller)("users"),
      __metadata("design:paramtypes", [users_service_1.UsersService])
    ], UsersController);
  }
});

// dist/users/users.module.js
var require_users_module = __commonJS({
  "dist/users/users.module.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.UsersModule = void 0;
    var common_1 = require("@nestjs/common");
    var users_controller_1 = require_users_controller();
    var users_service_1 = require_users_service();
    var r2_module_1 = require_r2_module();
    var UsersModule = class UsersModule {
    };
    exports2.UsersModule = UsersModule;
    exports2.UsersModule = UsersModule = __decorate([
      (0, common_1.Module)({
        imports: [r2_module_1.R2Module],
        controllers: [users_controller_1.UsersController],
        providers: [users_service_1.UsersService],
        exports: [users_service_1.UsersService]
      })
    ], UsersModule);
  }
});

// dist/trips/serializers/trip.serializer.js
var require_trip_serializer = __commonJS({
  "dist/trips/serializers/trip.serializer.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.TripSerializer = void 0;
    var date_helpers_1 = require_date_helpers();
    var user_serializer_1 = require_user_serializer();
    var TripSerializer = class _TripSerializer {
      static async userSummary(user, r2) {
        return {
          id: user.id,
          name: user.name,
          username: user.username,
          avatar_url: await user_serializer_1.UserSummarySerializer.resolveAvatar(user.avatarUrl, r2)
        };
      }
      static async toCard(trip, coverUrl, r2) {
        return {
          id: trip.id,
          name: trip.name,
          tags: trip.tags ?? [],
          status: trip.status,
          start_date: (0, date_helpers_1.toDateOnly)(trip.startDate),
          end_date: (0, date_helpers_1.toDateOnly)(trip.endDate),
          is_all_day: trip.isAllDay,
          start_time: (0, date_helpers_1.toTime)(trip.startTime),
          end_time: (0, date_helpers_1.toTime)(trip.endTime),
          is_public: trip.isPublic,
          cover_image_url: coverUrl,
          voting_deadline: trip.votingDeadline?.toISOString() ?? null,
          participant_count: trip._count?.participants ?? trip.participants.length,
          participants_preview: await Promise.all(trip.participants.slice(0, 5).map((p) => _TripSerializer.userSummary(p.user, r2))),
          created_at: trip.createdAt.toISOString()
        };
      }
      static async toDetail(trip, coverImageUrl = null, r2) {
        return {
          id: trip.id,
          name: trip.name,
          tags: trip.tags ?? [],
          status: trip.status,
          start_date: (0, date_helpers_1.toDateOnly)(trip.startDate),
          end_date: (0, date_helpers_1.toDateOnly)(trip.endDate),
          is_all_day: trip.isAllDay,
          start_time: (0, date_helpers_1.toTime)(trip.startTime),
          end_time: (0, date_helpers_1.toTime)(trip.endTime),
          is_public: trip.isPublic,
          cover_image_url: coverImageUrl,
          voting_deadline: trip.votingDeadline?.toISOString() ?? null,
          creator: await _TripSerializer.userSummary(trip.creator, r2),
          participant_count: trip.participants.length,
          participants: await Promise.all(trip.participants.map(async (p) => ({
            ...await _TripSerializer.userSummary(p.user, r2),
            joined_at: p.joinedAt.toISOString(),
            role: p.userId === trip.creatorId ? "creator" : "member"
          }))),
          date_candidates: trip.dateCandidates?.map((c) => ({
            id: c.id,
            start_date: (0, date_helpers_1.toDateOnly)(c.startDate),
            end_date: (0, date_helpers_1.toDateOnly)(c.endDate),
            vote_count: c.votes.length
          })) ?? [],
          created_at: trip.createdAt.toISOString(),
          updated_at: trip.updatedAt.toISOString()
        };
      }
      static async toMember(participant, r2) {
        return {
          ...await _TripSerializer.userSummary(participant.user, r2),
          joined_at: participant.joinedAt.toISOString(),
          role: participant.userId === participant.creatorId ? "creator" : "member"
        };
      }
    };
    exports2.TripSerializer = TripSerializer;
  }
});

// dist/trips/serializers/invitation.serializer.js
var require_invitation_serializer = __commonJS({
  "dist/trips/serializers/invitation.serializer.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.InvitationSerializer = void 0;
    var date_helpers_1 = require_date_helpers();
    var user_serializer_1 = require_user_serializer();
    var InvitationSerializer = class _InvitationSerializer {
      static deriveState(inv) {
        if (inv.status === "declined")
          return "rejected";
        return inv.invitedUserId ? "pending_accept" : "email_sent";
      }
      static toBasic(inv) {
        return {
          id: inv.id,
          trip_id: inv.tripId,
          invited_by: inv.invitedBy,
          invited_user_id: inv.invitedUserId,
          invited_email: inv.invitedEmail,
          method: inv.method,
          status: inv.status,
          email_delivered: inv.emailDelivered ?? false,
          created_at: inv.createdAt.toISOString(),
          updated_at: inv.updatedAt.toISOString()
        };
      }
      static async toManaged(inv, r2) {
        return {
          id: inv.id,
          method: inv.method,
          status: inv.status,
          state: _InvitationSerializer.deriveState(inv),
          invited_user: inv.invitedUser ? {
            id: inv.invitedUser.id,
            name: inv.invitedUser.name,
            username: inv.invitedUser.username,
            avatar_url: await user_serializer_1.UserSummarySerializer.resolveAvatar(inv.invitedUser.avatarUrl, r2)
          } : null,
          invited_email: inv.invitedEmail,
          invited_by: inv.invitedBy,
          created_at: inv.createdAt.toISOString()
        };
      }
      static async toEnriched(inv, r2) {
        return {
          id: inv.id,
          method: inv.method,
          status: inv.status,
          created_at: inv.createdAt.toISOString(),
          trip: {
            id: inv.trip.id,
            name: inv.trip.name,
            status: inv.trip.status,
            start_date: (0, date_helpers_1.toDateOnly)(inv.trip.startDate),
            end_date: (0, date_helpers_1.toDateOnly)(inv.trip.endDate),
            is_all_day: inv.trip.isAllDay,
            start_time: (0, date_helpers_1.toTime)(inv.trip.startTime),
            end_time: (0, date_helpers_1.toTime)(inv.trip.endTime)
          },
          inviter: {
            id: inv.inviter.id,
            name: inv.inviter.name,
            username: inv.inviter.username,
            avatar_url: await user_serializer_1.UserSummarySerializer.resolveAvatar(inv.inviter.avatarUrl, r2)
          }
        };
      }
    };
    exports2.InvitationSerializer = InvitationSerializer;
  }
});

// dist/trips/trips.service.js
var require_trips_service = __commonJS({
  "dist/trips/trips.service.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = exports2 && exports2.__metadata || function(k, v) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.TripsService = void 0;
    var common_1 = require("@nestjs/common");
    var prisma_service_1 = require_prisma_service();
    var client_1 = require("@prisma/client");
    var trip_serializer_1 = require_trip_serializer();
    var invitation_serializer_1 = require_invitation_serializer();
    var r2_service_1 = require_r2_service();
    var USER_SUMMARY_SELECT = {
      id: true,
      name: true,
      username: true,
      avatarUrl: true
    };
    var TripsService = class TripsService {
      constructor(prisma, r2) {
        this.prisma = prisma;
        this.r2 = r2;
      }
      async createTrip(userId, dto) {
        const { name, tags = [], start_date, end_date, is_all_day = true, start_time, end_time, candidates, voting_deadline } = dto;
        const hasCandidates = Array.isArray(candidates) && candidates.length > 0;
        const hasFixedDates = Boolean(start_date || end_date);
        if (!hasFixedDates && !hasCandidates) {
          throw new common_1.BadRequestException({
            code: "INVALID_TRIP_DATES",
            message: "Provide either start_date/end_date (fixed) or 1\u20133 candidates (voting)"
          });
        }
        if (hasCandidates) {
          return this.createVotingTrip(userId, {
            name,
            tags,
            candidates,
            voting_deadline
          });
        }
        return this.createFixedTrip(userId, {
          name,
          tags,
          start_date,
          end_date,
          is_all_day,
          start_time,
          end_time
        });
      }
      async createFixedTrip(userId, data) {
        const startDate = data.start_date ? new Date(data.start_date) : null;
        const endDate = data.end_date ? new Date(data.end_date) : null;
        if (startDate && endDate && startDate > endDate) {
          throw new common_1.BadRequestException({
            code: "INVALID_DATE_RANGE",
            message: "start_date must be on or before end_date"
          });
        }
        const trip = await this.prisma.$transaction(async (tx) => {
          const created = await tx.trip.create({
            data: {
              creatorId: userId,
              name: data.name,
              tags: data.tags,
              status: client_1.TripStatus.fixed,
              startDate,
              endDate,
              isAllDay: data.is_all_day,
              startTime: !data.is_all_day && data.start_time ? /* @__PURE__ */ new Date(`2000-01-01T${data.start_time}:00Z`) : null,
              endTime: !data.is_all_day && data.end_time ? /* @__PURE__ */ new Date(`2000-01-01T${data.end_time}:00Z`) : null
            }
          });
          await tx.tripParticipant.create({
            data: { tripId: created.id, userId }
          });
          return created;
        });
        return this.getTripDetail(trip.id, userId);
      }
      async createVotingTrip(userId, data) {
        if (data.candidates.length > 3) {
          throw new common_1.BadRequestException({
            code: "TOO_MANY_CANDIDATES",
            message: "Maximum 3 date candidates allowed"
          });
        }
        for (const candidate of data.candidates) {
          const start = new Date(candidate.start_date);
          const end = new Date(candidate.end_date);
          if (start > end) {
            throw new common_1.BadRequestException({
              code: "INVALID_CANDIDATE_RANGE",
              message: `Invalid candidate range: ${candidate.start_date} \u2013 ${candidate.end_date}`
            });
          }
        }
        const trip = await this.prisma.$transaction(async (tx) => {
          const created = await tx.trip.create({
            data: {
              creatorId: userId,
              name: data.name,
              tags: data.tags,
              status: client_1.TripStatus.voting_pending,
              isAllDay: true
            }
          });
          await tx.tripParticipant.create({
            data: { tripId: created.id, userId }
          });
          const createdCandidates = await Promise.all(data.candidates.map((candidate) => tx.tripDateCandidate.create({
            data: {
              tripId: created.id,
              startDate: new Date(candidate.start_date),
              endDate: new Date(candidate.end_date)
            }
          })));
          const poll = await tx.tripPoll.create({
            data: {
              tripId: created.id,
              pollType: "tanggal",
              title: "Tanggal Perjalanan",
              status: "active",
              createdBy: userId
            }
          });
          await Promise.all(createdCandidates.map((candidate, idx) => tx.tripPollOption.create({
            data: {
              pollId: poll.id,
              label: `${candidate.startDate.toISOString().split("T")[0]} \u2013 ${candidate.endDate.toISOString().split("T")[0]}`,
              sortOrder: idx,
              candidateId: candidate.id
            }
          })));
          const votingDeadline = data.voting_deadline ? new Date(data.voting_deadline) : this.calculateVotingDeadline(createdCandidates.map((c) => c.startDate));
          return tx.trip.update({
            where: { id: created.id },
            data: { votingDeadline }
          });
        });
        return this.getTripDetail(trip.id, userId);
      }
      calculateVotingDeadline(candidateStartDates) {
        const now = Date.now();
        const earliest = Math.min(...candidateStartDates.map((d) => d.getTime()));
        const plus14d = now + 14 * 24 * 60 * 60 * 1e3;
        const threeDaysBefore = earliest - 3 * 24 * 60 * 60 * 1e3;
        const minDeadline = now + 7 * 24 * 60 * 60 * 1e3;
        const deadline = Math.max(Math.min(plus14d, threeDaysBefore), minDeadline);
        return new Date(deadline);
      }
      async listTrips(userId, tab, cursor, limit = 20) {
        const take = Math.min(limit, 100);
        const today = /* @__PURE__ */ new Date();
        today.setHours(0, 0, 0, 0);
        const tabWhere = tab === "completed" ? { status: client_1.TripStatus.fixed, endDate: { lt: today } } : {
          OR: [
            { status: client_1.TripStatus.voting_pending },
            { endDate: { gte: today } },
            { endDate: null }
          ]
        };
        const trips = await this.prisma.trip.findMany({
          where: {
            participants: { some: { userId } },
            ...tabWhere,
            ...cursor ? { id: { lt: cursor } } : {}
          },
          orderBy: { createdAt: "desc" },
          take: take + 1,
          include: {
            coverDocument: { select: { storageKey: true } },
            _count: { select: { participants: true } },
            participants: {
              take: 5,
              orderBy: { joinedAt: "asc" },
              include: { user: { select: USER_SUMMARY_SELECT } }
            }
          }
        });
        const hasMore = trips.length > take;
        const results = hasMore ? trips.slice(0, take) : trips;
        const coverKeys = results.map((trip) => trip.coverDocument?.storageKey).filter((key) => Boolean(key));
        const signedCoverUrls = await this.r2.presignDownloads(coverKeys);
        return {
          data: await Promise.all(results.map((trip) => trip_serializer_1.TripSerializer.toCard(trip, trip.coverDocument?.storageKey ? signedCoverUrls.get(trip.coverDocument.storageKey) ?? null : null, this.r2))),
          next_cursor: hasMore ? results[results.length - 1]?.id ?? null : null
        };
      }
      async getTripDetail(tripId, userId) {
        const trip = await this.prisma.trip.findFirst({
          where: { id: tripId },
          include: {
            creator: { select: USER_SUMMARY_SELECT },
            coverDocument: { select: { storageKey: true } },
            participants: {
              orderBy: { joinedAt: "asc" },
              include: { user: { select: USER_SUMMARY_SELECT } }
            },
            invitations: true,
            dateCandidates: {
              orderBy: { startDate: "asc" },
              include: { votes: { select: { userId: true } } }
            }
          }
        });
        if (!trip) {
          throw new common_1.NotFoundException({ code: "TRIP_NOT_FOUND", message: "Trip not found" });
        }
        const isCreator = trip.creatorId === userId;
        const isParticipant = trip.participants.some((p) => p.userId === userId);
        const isInvited = trip.invitations.some((i) => i.invitedUserId === userId && i.status === "pending");
        if (!isCreator && !isParticipant && !isInvited) {
          throw new common_1.ForbiddenException({
            code: "TRIP_ACCESS_DENIED",
            message: "You do not have access to this trip"
          });
        }
        return trip_serializer_1.TripSerializer.toDetail(trip, trip.coverDocument?.storageKey ? await this.r2.presignDownload(trip.coverDocument.storageKey) : null, this.r2);
      }
      async updateTrip(tripId, userId, dto) {
        await this.assertCreator(tripId, userId);
        await this.prisma.trip.update({
          where: { id: tripId },
          data: {
            name: dto.name,
            tags: dto.tags ?? void 0,
            startDate: dto.start_date ? new Date(dto.start_date) : void 0,
            endDate: dto.end_date ? new Date(dto.end_date) : void 0,
            isAllDay: dto.is_all_day,
            startTime: dto.start_time ? /* @__PURE__ */ new Date(`2000-01-01T${dto.start_time}:00Z`) : void 0,
            endTime: dto.end_time ? /* @__PURE__ */ new Date(`2000-01-01T${dto.end_time}:00Z`) : void 0,
            isPublic: dto.is_public
          }
        });
        return this.getTripDetail(tripId, userId);
      }
      async deleteTrip(tripId, userId) {
        await this.assertCreator(tripId, userId);
        await this.prisma.trip.update({
          where: { id: tripId },
          data: { deletedAt: /* @__PURE__ */ new Date() }
        });
      }
      async setTripCover(tripId, userId, documentId) {
        await this.assertCreator(tripId, userId);
        const doc = await this.prisma.tripDocument.findUnique({
          where: { id: documentId },
          select: { id: true, tripId: true }
        });
        if (!doc || doc.tripId !== tripId) {
          throw new common_1.NotFoundException({
            code: "DOCUMENT_NOT_FOUND",
            message: "Document not found in this trip"
          });
        }
        await this.prisma.trip.update({
          where: { id: tripId },
          data: { coverDocumentId: documentId }
        });
        return this.getTripDetail(tripId, userId);
      }
      async removeTripCover(tripId, userId) {
        await this.assertCreator(tripId, userId);
        await this.prisma.trip.update({
          where: { id: tripId },
          data: { coverDocumentId: null }
        });
        return this.getTripDetail(tripId, userId);
      }
      async getTripMembers(tripId, userId) {
        const trip = await this.prisma.trip.findFirst({
          where: { id: tripId },
          select: { id: true, creatorId: true }
        });
        if (!trip) {
          throw new common_1.NotFoundException({ code: "TRIP_NOT_FOUND", message: "Trip not found" });
        }
        const participants = await this.prisma.tripParticipant.findMany({
          where: { tripId },
          orderBy: { joinedAt: "asc" },
          include: { user: { select: USER_SUMMARY_SELECT } }
        });
        const isMember = trip.creatorId === userId || participants.some((p) => p.userId === userId);
        if (!isMember) {
          throw new common_1.ForbiddenException({
            code: "TRIP_ACCESS_DENIED",
            message: "You do not have access to this trip"
          });
        }
        const invitations = await this.prisma.tripInvitation.findMany({
          where: { tripId, status: { in: ["pending", "declined"] } },
          orderBy: { createdAt: "desc" },
          include: { invitedUser: { select: USER_SUMMARY_SELECT } }
        });
        return {
          is_creator: trip.creatorId === userId,
          members: await Promise.all(participants.map((p) => trip_serializer_1.TripSerializer.toMember({ ...p, creatorId: trip.creatorId }, this.r2))),
          invitations: await Promise.all(invitations.map((inv) => invitation_serializer_1.InvitationSerializer.toManaged(inv, this.r2)))
        };
      }
      async leaveTrip(tripId, userId) {
        const trip = await this.prisma.trip.findFirst({
          where: { id: tripId },
          select: { id: true, creatorId: true }
        });
        if (!trip) {
          throw new common_1.NotFoundException({ code: "TRIP_NOT_FOUND", message: "Trip not found" });
        }
        if (trip.creatorId === userId) {
          throw new common_1.BadRequestException({
            code: "CREATOR_CANNOT_LEAVE",
            message: "The trip creator cannot leave the trip"
          });
        }
        const participant = await this.prisma.tripParticipant.findUnique({
          where: { tripId_userId: { tripId, userId } }
        });
        if (!participant) {
          throw new common_1.NotFoundException({
            code: "MEMBER_NOT_FOUND",
            message: "You are not a member of this trip"
          });
        }
        await this.prisma.tripParticipant.delete({
          where: { tripId_userId: { tripId, userId } }
        });
      }
      async removeMember(tripId, memberId, userId) {
        const trip = await this.assertCreator(tripId, userId);
        if (memberId === trip.creatorId) {
          throw new common_1.BadRequestException({
            code: "CANNOT_REMOVE_CREATOR",
            message: "The trip creator cannot be removed"
          });
        }
        const participant = await this.prisma.tripParticipant.findUnique({
          where: { tripId_userId: { tripId, userId: memberId } }
        });
        if (!participant) {
          throw new common_1.NotFoundException({
            code: "MEMBER_NOT_FOUND",
            message: "Member not found in this trip"
          });
        }
        await this.prisma.tripParticipant.delete({
          where: { tripId_userId: { tripId, userId: memberId } }
        });
      }
      async assertCreator(tripId, userId) {
        const trip = await this.prisma.trip.findFirst({
          where: { id: tripId },
          select: { id: true, creatorId: true }
        });
        if (!trip) {
          throw new common_1.NotFoundException({ code: "TRIP_NOT_FOUND", message: "Trip not found" });
        }
        if (trip.creatorId !== userId) {
          throw new common_1.ForbiddenException({
            code: "NOT_TRIP_CREATOR",
            message: "Only the trip creator can perform this action"
          });
        }
        return trip;
      }
    };
    exports2.TripsService = TripsService;
    exports2.TripsService = TripsService = __decorate([
      (0, common_1.Injectable)(),
      __metadata("design:paramtypes", [
        prisma_service_1.PrismaService,
        r2_service_1.R2Service
      ])
    ], TripsService);
  }
});

// dist/notifications/push-notifications.service.js
var require_push_notifications_service = __commonJS({
  "dist/notifications/push-notifications.service.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __importStar = exports2 && exports2.__importStar || /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    var __metadata = exports2 && exports2.__metadata || function(k, v) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var PushNotificationsService_1;
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.PushNotificationsService = void 0;
    var common_1 = require("@nestjs/common");
    var config_1 = require("@nestjs/config");
    var prisma_service_1 = require_prisma_service();
    var PushNotificationsService = PushNotificationsService_1 = class PushNotificationsService {
      constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
        this.logger = new common_1.Logger(PushNotificationsService_1.name);
      }
      sendAsync(recipientIds, opts) {
        if (recipientIds.length === 0)
          return;
        this.send(recipientIds, opts).catch((err) => {
          this.logger.warn(`Push notification failed: ${err.message ?? err}`);
        });
      }
      async send(recipientIds, opts) {
        const accessToken = this.config.get("expo.accessToken");
        if (!accessToken) {
          this.logger.debug("EXPO_ACCESS_TOKEN not configured \u2014 skipping push");
          return;
        }
        const actor = opts.actorId ? await this.prisma.user.findUnique({
          where: { id: opts.actorId },
          select: { name: true }
        }) : null;
        const trip = opts.tripId ? await this.prisma.trip.findUnique({
          where: { id: opts.tripId },
          select: { name: true }
        }) : null;
        const tokens = await this.prisma.pushToken.findMany({
          where: { userId: { in: recipientIds } },
          select: { userId: true, token: true }
        });
        const { title, body, data } = this.buildContent(opts, actor?.name, trip?.name);
        const { Expo } = await Promise.resolve().then(() => __importStar(require("expo-server-sdk")));
        const expo = new Expo({ accessToken });
        const validTokens = tokens.filter((t) => Expo.isExpoPushToken(t.token));
        if (validTokens.length === 0)
          return;
        const messages = validTokens.map((t) => ({
          to: t.token,
          title,
          body,
          data,
          sound: "default"
        }));
        const ticketChunks = await expo.chunkPushNotifications(messages);
        const tickets = [];
        for (const chunk of ticketChunks) {
          const sent = await expo.sendPushNotificationsAsync(chunk);
          tickets.push(...sent);
        }
        await this.pruneInvalidTokens(validTokens, tickets);
      }
      buildContent(opts, actorName, tripName) {
        const name = actorName ?? "Seseorang";
        const trip = tripName ?? "perjalanan";
        const payload = opts.payload ?? {};
        switch (opts.type) {
          case "invite":
            return {
              title: "Undangan Perjalanan",
              body: `${name} mengundangmu ke ${trip}`,
              data: {
                type: opts.type,
                trip_id: opts.tripId,
                invitation_id: payload.invitation_id ?? null
              }
            };
          case "voting_deadline":
            return {
              title: "Voting Segera Berakhir",
              body: `Voting ${trip} segera berakhir. Ayo vote sekarang!`,
              data: {
                type: opts.type,
                trip_id: opts.tripId,
                poll_id: payload.poll_id ?? null
              }
            };
          case "activity_update": {
            const activityName = payload.activity_name ?? "aktivitas";
            return {
              title: "Aktivitas Baru",
              body: `${name} menambahkan aktivitas ${activityName} di ${trip}`,
              data: {
                type: opts.type,
                trip_id: opts.tripId,
                activity_id: payload.activity_id ?? null
              }
            };
          }
          case "trip_start_soon": {
            const startDatetime = payload.start_datetime;
            const formatted = startDatetime ? new Date(startDatetime).toLocaleString("id-ID", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit"
            }) : "segera";
            return {
              title: "Perjalanan Segera Dimulai",
              body: `${trip} berangkat ${formatted}. Siap-siap!`,
              data: {
                type: opts.type,
                trip_id: opts.tripId,
                start_datetime: payload.start_datetime ?? null,
                is_all_day: payload.is_all_day ?? null
              }
            };
          }
          default:
            return {
              title: "Notifikasi Baru",
              body: "Kamu punya notifikasi baru di Atur Perjalanan.",
              data: { type: opts.type }
            };
        }
      }
      async pruneInvalidTokens(tokens, tickets) {
        const invalid = /* @__PURE__ */ new Set();
        tickets.forEach((ticket, i) => {
          const token = tokens[i]?.token;
          if (!token)
            return;
          if (ticket.status === "error") {
            const errCode = ticket.details?.error;
            if (errCode === "DeviceNotRegistered" || errCode === "InvalidExpoToken") {
              invalid.add(token);
            }
          }
        });
        if (invalid.size === 0)
          return;
        await this.prisma.pushToken.deleteMany({
          where: { token: { in: [...invalid] } }
        });
        this.logger.log(`Pruned ${invalid.size} invalid push token(s)`);
      }
    };
    exports2.PushNotificationsService = PushNotificationsService;
    exports2.PushNotificationsService = PushNotificationsService = PushNotificationsService_1 = __decorate([
      (0, common_1.Injectable)(),
      __metadata("design:paramtypes", [
        prisma_service_1.PrismaService,
        config_1.ConfigService
      ])
    ], PushNotificationsService);
  }
});

// dist/notifications/notifications.service.js
var require_notifications_service = __commonJS({
  "dist/notifications/notifications.service.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = exports2 && exports2.__metadata || function(k, v) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.NotificationsService = void 0;
    var common_1 = require("@nestjs/common");
    var prisma_service_1 = require_prisma_service();
    var r2_service_1 = require_r2_service();
    var push_notifications_service_1 = require_push_notifications_service();
    var NotificationsService = class NotificationsService {
      constructor(prisma, r2, push) {
        this.prisma = prisma;
        this.r2 = r2;
        this.push = push;
      }
      async createNotification(params) {
        const { userId, type, actorId, tripId, payload = {} } = params;
        const notification = await this.prisma.notification.create({
          data: {
            userId,
            type,
            actorId,
            tripId,
            payload: payload ?? {}
          }
        });
        this.push.sendAsync([userId], { type, actorId, tripId, payload });
        return notification;
      }
      async createManyNotifications(items) {
        if (items.length === 0)
          return { count: 0 };
        const result = await this.prisma.notification.createMany({
          data: items.map((item) => ({
            userId: item.userId,
            type: item.type,
            actorId: item.actorId,
            tripId: item.tripId,
            payload: item.payload ?? {}
          })),
          skipDuplicates: true
        });
        const first = items[0];
        this.push.sendAsync(items.map((i) => i.userId), {
          type: first.type,
          actorId: first.actorId,
          tripId: first.tripId,
          payload: first.payload
        });
        return result;
      }
      async listNotifications(userId, cursor, limit = 20) {
        const take = Math.min(limit, 100);
        let skip = 0;
        if (cursor) {
          const cursorDate = new Date(cursor);
          const newerCount = await this.prisma.notification.count({
            where: {
              userId,
              createdAt: { gt: cursorDate }
            }
          });
          skip = newerCount;
        }
        const notifications = await this.prisma.notification.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: take + 1,
          skip
        });
        const hasNextPage = notifications.length > take;
        const data = notifications.slice(0, take);
        if (data.length === 0) {
          return { data: [], next_cursor: null };
        }
        const actorIds = data.map((n) => n.actorId).filter((id) => id != null);
        const tripIds = data.map((n) => n.tripId).filter((id) => id != null);
        const [actors, trips] = await Promise.all([
          this.fetchActors(actorIds),
          this.fetchTrips(tripIds)
        ]);
        const actorMap = new Map(actors.map((a) => [a.id, a]));
        const tripMap = new Map(trips.map((t) => [t.id, t]));
        const avatarKeys = actors.map((a) => a.avatarUrl).filter((url) => !!url && !url.includes("://"));
        const signedAvatars = await this.r2.presignDownloads(avatarKeys);
        const resolveAvatar = async (url) => {
          if (!url)
            return null;
          if (url.includes("://"))
            return url;
          return signedAvatars.get(url) ?? url;
        };
        const enrichedData = await Promise.all(data.map(async (notification) => {
          const actor = notification.actorId ? actorMap.get(notification.actorId) || null : null;
          const trip = notification.tripId ? tripMap.get(notification.tripId) || null : null;
          return {
            id: notification.id,
            type: notification.type,
            actor: actor ? {
              id: actor.id,
              name: actor.name,
              username: actor.username,
              avatar_url: await resolveAvatar(actor.avatarUrl)
            } : null,
            trip: trip ? {
              id: trip.id,
              name: trip.name,
              status: trip.status,
              start_date: trip.startDate,
              end_date: trip.endDate
            } : null,
            payload: notification.payload,
            is_read: notification.isRead,
            created_at: notification.createdAt
          };
        }));
        return {
          data: enrichedData,
          next_cursor: hasNextPage ? enrichedData[enrichedData.length - 1].created_at.toISOString() : null
        };
      }
      async getUnreadCount(userId) {
        const unreadCount = await this.prisma.notification.count({
          where: {
            userId,
            isRead: false
          }
        });
        return { unread_count: unreadCount };
      }
      async markAsRead(notificationId, userId) {
        const notification = await this.prisma.notification.findUnique({
          where: { id: notificationId }
        });
        if (!notification) {
          throw new common_1.NotFoundException("Notification not found");
        }
        if (notification.userId !== userId) {
          throw new common_1.ForbiddenException("Access denied to this notification");
        }
        await this.prisma.notification.update({
          where: { id: notificationId },
          data: { isRead: true }
        });
      }
      async markAllAsRead(userId) {
        await this.prisma.notification.updateMany({
          where: {
            userId,
            isRead: false
          },
          data: { isRead: true }
        });
      }
      async fetchActors(actorIds) {
        if (actorIds.length === 0)
          return [];
        return this.prisma.user.findMany({
          where: { id: { in: actorIds } },
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true
          }
        });
      }
      async fetchTrips(tripIds) {
        if (tripIds.length === 0)
          return [];
        return this.prisma.trip.findMany({
          where: { id: { in: tripIds } },
          select: {
            id: true,
            name: true,
            status: true,
            startDate: true,
            endDate: true,
            coverDocumentId: true
          }
        });
      }
    };
    exports2.NotificationsService = NotificationsService;
    exports2.NotificationsService = NotificationsService = __decorate([
      (0, common_1.Injectable)(),
      __metadata("design:paramtypes", [
        prisma_service_1.PrismaService,
        r2_service_1.R2Service,
        push_notifications_service_1.PushNotificationsService
      ])
    ], NotificationsService);
  }
});

// dist/mail/mail.service.js
var require_mail_service = __commonJS({
  "dist/mail/mail.service.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __importStar = exports2 && exports2.__importStar || /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    var __metadata = exports2 && exports2.__metadata || function(k, v) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var MailService_1;
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.MailService = void 0;
    var common_1 = require("@nestjs/common");
    var config_1 = require("@nestjs/config");
    var nodemailer = __importStar(require("nodemailer"));
    var MailService = MailService_1 = class MailService {
      constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(MailService_1.name);
        const host = this.config.get("mail.host");
        if (!host) {
          this.logger.warn("SMTP_HOST not configured \u2014 invitation emails will not be sent");
          this.transporter = null;
          return;
        }
        this.transporter = nodemailer.createTransport({
          host,
          port: parseInt(this.config.get("mail.port") ?? "587", 10),
          secure: this.config.get("mail.secure") === "true",
          auth: this.config.get("mail.user") ? {
            user: this.config.get("mail.user"),
            pass: this.config.get("mail.pass") ?? ""
          } : void 0
        });
      }
      async sendInvitationEmail({ to, tripId, tripName, inviterName }) {
        if (!this.transporter)
          return false;
        const webUrl = this.config.get("app.webUrl") ?? "http://localhost:8081";
        const tripUrl = `${webUrl}/trip/${tripId}`;
        const from = this.config.get("mail.from") ?? "Atur Perjalanan <noreply@atur-perjalanan.app>";
        try {
          await this.transporter.sendMail({
            from,
            to,
            subject: `${inviterName} mengundangmu bergabung ke "${tripName}"`,
            text: [
              `Hai,`,
              ``,
              `${inviterName} mengundangmu untuk bergabung ke perjalanan "${tripName}" di Atur Perjalanan.`,
              ``,
              `Buka link berikut untuk melihat detailnya:`,
              tripUrl,
              ``,
              `\u2014 Atur Perjalanan`
            ].join("\n"),
            html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
            <h2 style="color: #1A1A2E;">Kamu diundang ke "${tripName}"</h2>
            <p style="color: #1A1A2E; font-size: 14px; line-height: 1.6;">
              ${inviterName} mengundangmu untuk bergabung ke perjalanan
              <strong>${tripName}</strong> di Atur Perjalanan.
            </p>
            <a href="${tripUrl}"
               style="display: inline-block; background: #FF6B6B; color: #FFFFFF;
                      text-decoration: none; font-weight: 700; padding: 12px 24px;
                      border-radius: 14px; margin-top: 8px;">
              Lihat Perjalanan
            </a>
            <p style="color: #9091A0; font-size: 12px; margin-top: 24px;">
              Atur Perjalanan \u2014 ubah wacana perjalanan menjadi kenyataan.
            </p>
          </div>
        `
          });
          return true;
        } catch (err) {
          this.logger.error(`Failed to send invitation email to ${to}: ${err instanceof Error ? err.message : String(err)}`);
          return false;
        }
      }
    };
    exports2.MailService = MailService;
    exports2.MailService = MailService = MailService_1 = __decorate([
      (0, common_1.Injectable)(),
      __metadata("design:paramtypes", [config_1.ConfigService])
    ], MailService);
  }
});

// dist/trips/invitations.service.js
var require_invitations_service = __commonJS({
  "dist/trips/invitations.service.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = exports2 && exports2.__metadata || function(k, v) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.InvitationsService = void 0;
    var common_1 = require("@nestjs/common");
    var prisma_service_1 = require_prisma_service();
    var invitation_serializer_1 = require_invitation_serializer();
    var notifications_service_1 = require_notifications_service();
    var mail_service_1 = require_mail_service();
    var r2_service_1 = require_r2_service();
    var InvitationsService = class InvitationsService {
      constructor(prisma, notifications, mail, r2) {
        this.prisma = prisma;
        this.notifications = notifications;
        this.mail = mail;
        this.r2 = r2;
      }
      async createInvitation(tripId, inviterId, dto) {
        if (!!dto.username && !!dto.email || !dto.username && !dto.email) {
          throw new common_1.BadRequestException({
            code: "INVALID_INVITATION_TARGET",
            message: "Provide exactly one of: username or email"
          });
        }
        const trip = await this.prisma.trip.findFirst({
          where: { id: tripId },
          include: { participants: { select: { userId: true } } }
        });
        if (!trip) {
          throw new common_1.NotFoundException({ code: "TRIP_NOT_FOUND", message: "Trip not found" });
        }
        const isParticipant = trip.participants.some((p) => p.userId === inviterId);
        if (!isParticipant) {
          throw new common_1.ForbiddenException({
            code: "NOT_TRIP_PARTICIPANT",
            message: "Only trip participants can invite others"
          });
        }
        const inv = dto.username ? await this.inviteByUsername(tripId, inviterId, dto.username, trip.participants) : await this.inviteByEmail(tripId, inviterId, dto.email, trip.participants, {
          tripName: trip.name
        });
        return invitation_serializer_1.InvitationSerializer.toBasic(inv);
      }
      async inviteByUsername(tripId, inviterId, username, participants) {
        const invitedUser = await this.prisma.user.findFirst({
          where: { username: username.toLowerCase() },
          select: { id: true }
        });
        if (!invitedUser) {
          throw new common_1.NotFoundException({
            code: "USER_NOT_FOUND",
            message: `User @${username} not found`
          });
        }
        if (invitedUser.id === inviterId) {
          throw new common_1.BadRequestException({
            code: "CANNOT_INVITE_SELF",
            message: "You cannot invite yourself"
          });
        }
        if (participants.some((p) => p.userId === invitedUser.id)) {
          throw new common_1.ConflictException({
            code: "ALREADY_PARTICIPANT",
            message: "User is already a participant"
          });
        }
        const existing = await this.prisma.tripInvitation.findFirst({
          where: { tripId, invitedUserId: invitedUser.id },
          orderBy: { createdAt: "desc" }
        });
        if (existing?.status === "pending") {
          throw new common_1.ConflictException({
            code: "INVITATION_EXISTS",
            message: "User already has a pending invitation"
          });
        }
        if (existing) {
          const invitation2 = await this.prisma.tripInvitation.update({
            where: { id: existing.id },
            data: { status: "pending", method: "username", invitedBy: inviterId }
          });
          await this.notifications.createNotification({
            userId: invitedUser.id,
            type: "invite",
            actorId: inviterId,
            tripId,
            payload: { invitation_id: invitation2.id }
          });
          return invitation2;
        }
        const invitation = await this.prisma.tripInvitation.create({
          data: {
            tripId,
            invitedBy: inviterId,
            invitedUserId: invitedUser.id,
            method: "username",
            status: "pending"
          }
        });
        await this.notifications.createNotification({
          userId: invitedUser.id,
          type: "invite",
          actorId: inviterId,
          tripId,
          payload: { invitation_id: invitation.id }
        });
        return invitation;
      }
      async inviteByEmail(tripId, inviterId, email, participants, tripMeta) {
        const normalizedEmail = email.toLowerCase();
        const existingUser = await this.prisma.user.findFirst({
          where: { email: normalizedEmail },
          select: { id: true, name: true }
        });
        if (existingUser) {
          if (existingUser.id === inviterId) {
            throw new common_1.BadRequestException({
              code: "CANNOT_INVITE_SELF",
              message: "You cannot invite yourself"
            });
          }
          if (participants.some((p) => p.userId === existingUser.id)) {
            throw new common_1.ConflictException({
              code: "ALREADY_PARTICIPANT",
              message: "User is already a participant"
            });
          }
        }
        const existing = await this.prisma.tripInvitation.findFirst({
          where: { tripId, invitedEmail: normalizedEmail },
          orderBy: { createdAt: "desc" }
        });
        if (existing?.status === "pending") {
          throw new common_1.ConflictException({
            code: "INVITATION_EXISTS",
            message: "This email already has a pending invitation"
          });
        }
        let invitation;
        if (existing) {
          invitation = await this.prisma.tripInvitation.update({
            where: { id: existing.id },
            data: {
              status: "pending",
              method: "email",
              invitedBy: inviterId,
              invitedUserId: existingUser?.id ?? null
            }
          });
        } else {
          invitation = await this.prisma.tripInvitation.create({
            data: {
              tripId,
              invitedBy: inviterId,
              invitedUserId: existingUser?.id ?? null,
              invitedEmail: normalizedEmail,
              method: "email",
              status: "pending"
            }
          });
        }
        if (existingUser) {
          await this.notifications.createNotification({
            userId: existingUser.id,
            type: "invite",
            actorId: inviterId,
            tripId,
            payload: { invitation_id: invitation.id }
          });
        }
        const inviter = await this.prisma.user.findUnique({
          where: { id: inviterId },
          select: { name: true }
        });
        const emailDelivered = await this.mail.sendInvitationEmail({
          to: normalizedEmail,
          tripId,
          tripName: tripMeta.tripName,
          inviterName: inviter?.name ?? "Seorang pengguna"
        });
        return { ...invitation, emailDelivered };
      }
      async getUserInvitations(userId, cursor, limit = 20) {
        const take = Math.min(limit, 100);
        const invitations = await this.prisma.tripInvitation.findMany({
          where: {
            invitedUserId: userId,
            status: "pending",
            trip: { deletedAt: null }
          },
          orderBy: { createdAt: "desc" },
          take: take + 1,
          ...cursor ? { skip: 1, cursor: { id: cursor } } : {},
          include: {
            trip: {
              select: {
                id: true,
                name: true,
                startDate: true,
                endDate: true,
                status: true,
                isAllDay: true,
                startTime: true,
                endTime: true
              }
            },
            inviter: {
              select: { id: true, name: true, username: true, avatarUrl: true }
            }
          }
        });
        const hasMore = invitations.length > take;
        const results = hasMore ? invitations.slice(0, take) : invitations;
        return {
          data: await Promise.all(results.map((inv) => invitation_serializer_1.InvitationSerializer.toEnriched(inv, this.r2))),
          next_cursor: hasMore ? results[results.length - 1]?.id ?? null : null
        };
      }
      async respondToInvitation(tripId, invitationId, userId, accept) {
        const invitation = await this.prisma.tripInvitation.findUnique({
          where: { id: invitationId }
        });
        if (!invitation || invitation.tripId !== tripId) {
          throw new common_1.NotFoundException({
            code: "INVITATION_NOT_FOUND",
            message: "Invitation not found"
          });
        }
        if (invitation.invitedUserId !== userId) {
          throw new common_1.ForbiddenException({
            code: "INVITATION_ACCESS_DENIED",
            message: "This invitation is not addressed to you"
          });
        }
        if (invitation.status !== "pending") {
          throw new common_1.BadRequestException({
            code: "INVITATION_NOT_PENDING",
            message: `Invitation is already ${invitation.status}`
          });
        }
        await this.prisma.$transaction(async (tx) => {
          await tx.tripInvitation.update({
            where: { id: invitationId },
            data: { status: accept ? "accepted" : "declined" }
          });
          if (accept) {
            await tx.tripParticipant.upsert({
              where: { tripId_userId: { tripId: invitation.tripId, userId } },
              create: { tripId: invitation.tripId, userId },
              update: {}
            });
          }
          const inviteNotifs = await tx.notification.findMany({
            where: {
              userId,
              tripId: invitation.tripId,
              type: "invite"
            }
          });
          for (const notif of inviteNotifs) {
            const payload = notif.payload ?? {};
            if (payload.invitation_id === invitationId) {
              await tx.notification.update({
                where: { id: notif.id },
                data: { payload: { ...payload, resolved: true, accepted: accept } }
              });
            }
          }
        });
      }
      async cancelInvitation(tripId, invitationId, userId) {
        const invitation = await this.prisma.tripInvitation.findUnique({
          where: { id: invitationId }
        });
        if (!invitation || invitation.tripId !== tripId) {
          throw new common_1.NotFoundException({
            code: "INVITATION_NOT_FOUND",
            message: "Invitation not found"
          });
        }
        if (invitation.invitedBy !== userId) {
          throw new common_1.ForbiddenException({
            code: "NOT_INVITER",
            message: "Only the inviter can cancel this invitation"
          });
        }
        if (invitation.status !== "pending") {
          throw new common_1.BadRequestException({
            code: "INVITATION_NOT_PENDING",
            message: `Cannot cancel an invitation that is ${invitation.status}`
          });
        }
        await this.prisma.tripInvitation.update({
          where: { id: invitationId },
          data: { status: "cancelled" }
        });
      }
    };
    exports2.InvitationsService = InvitationsService;
    exports2.InvitationsService = InvitationsService = __decorate([
      (0, common_1.Injectable)(),
      __metadata("design:paramtypes", [
        prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService,
        mail_service_1.MailService,
        r2_service_1.R2Service
      ])
    ], InvitationsService);
  }
});

// dist/trips/trips.controller.js
var require_trips_controller = __commonJS({
  "dist/trips/trips.controller.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = exports2 && exports2.__metadata || function(k, v) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var __param = exports2 && exports2.__param || function(paramIndex, decorator) {
      return function(target, key) {
        decorator(target, key, paramIndex);
      };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.TripsController = void 0;
    var common_1 = require("@nestjs/common");
    var swagger_1 = require("@nestjs/swagger");
    var jwt_auth_guard_1 = require_jwt_auth_guard();
    var current_user_decorator_1 = require_current_user_decorator();
    var trips_service_1 = require_trips_service();
    var invitations_service_1 = require_invitations_service();
    var shared_validation_1 = require("@atur-perjalanan/shared-validation");
    var zod_validation_pipe_1 = require_zod_validation_pipe();
    var TripsController = class TripsController {
      constructor(tripsService, invitationsService) {
        this.tripsService = tripsService;
        this.invitationsService = invitationsService;
      }
      createTrip(user, dto) {
        return this.tripsService.createTrip(user.userId, dto);
      }
      listTrips(user, tab = "upcoming", cursor, limit) {
        if (!["upcoming", "completed"].includes(tab)) {
          throw new common_1.BadRequestException({
            code: "INVALID_TAB",
            message: 'tab must be "upcoming" or "completed"'
          });
        }
        return this.tripsService.listTrips(user.userId, tab, cursor, limit ? parseInt(limit, 10) : 20);
      }
      getMyInvitations(user, cursor, limit) {
        return this.invitationsService.getUserInvitations(user.userId, cursor, limit ? parseInt(limit, 10) : 20);
      }
      getTripDetail(user, tripId) {
        return this.tripsService.getTripDetail(tripId, user.userId);
      }
      updateTrip(user, tripId, dto) {
        return this.tripsService.updateTrip(tripId, user.userId, dto);
      }
      deleteTrip(user, tripId) {
        return this.tripsService.deleteTrip(tripId, user.userId);
      }
      setTripCover(user, tripId, dto) {
        return this.tripsService.setTripCover(tripId, user.userId, dto.document_id);
      }
      removeTripCover(user, tripId) {
        return this.tripsService.removeTripCover(tripId, user.userId);
      }
      getTripMembers(user, tripId) {
        return this.tripsService.getTripMembers(tripId, user.userId);
      }
      removeMember(user, tripId, memberId) {
        return this.tripsService.removeMember(tripId, memberId, user.userId);
      }
      leaveTrip(user, tripId) {
        return this.tripsService.leaveTrip(tripId, user.userId);
      }
      createInvitation(user, tripId, dto) {
        return this.invitationsService.createInvitation(tripId, user.userId, dto);
      }
      respondToInvitation(user, tripId, invitationId, dto) {
        return this.invitationsService.respondToInvitation(tripId, invitationId, user.userId, dto.accept);
      }
      cancelInvitation(user, tripId, invitationId) {
        return this.invitationsService.cancelInvitation(tripId, invitationId, user.userId);
      }
    };
    exports2.TripsController = TripsController;
    __decorate([
      (0, common_1.Post)(),
      __param(0, (0, current_user_decorator_1.CurrentUser)()),
      __param(1, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(shared_validation_1.CreateTripSchema))),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object, Object]),
      __metadata("design:returntype", void 0)
    ], TripsController.prototype, "createTrip", null);
    __decorate([
      (0, common_1.Get)(),
      __param(0, (0, current_user_decorator_1.CurrentUser)()),
      __param(1, (0, common_1.Query)("tab")),
      __param(2, (0, common_1.Query)("cursor")),
      __param(3, (0, common_1.Query)("limit")),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object, String, String, String]),
      __metadata("design:returntype", void 0)
    ], TripsController.prototype, "listTrips", null);
    __decorate([
      (0, common_1.Get)("invitations"),
      __param(0, (0, current_user_decorator_1.CurrentUser)()),
      __param(1, (0, common_1.Query)("cursor")),
      __param(2, (0, common_1.Query)("limit")),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object, String, String]),
      __metadata("design:returntype", void 0)
    ], TripsController.prototype, "getMyInvitations", null);
    __decorate([
      (0, common_1.Get)(":tripId"),
      __param(0, (0, current_user_decorator_1.CurrentUser)()),
      __param(1, (0, common_1.Param)("tripId")),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object, String]),
      __metadata("design:returntype", void 0)
    ], TripsController.prototype, "getTripDetail", null);
    __decorate([
      (0, common_1.Put)(":tripId"),
      __param(0, (0, current_user_decorator_1.CurrentUser)()),
      __param(1, (0, common_1.Param)("tripId")),
      __param(2, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(shared_validation_1.UpdateTripSchema))),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object, String, Object]),
      __metadata("design:returntype", void 0)
    ], TripsController.prototype, "updateTrip", null);
    __decorate([
      (0, common_1.Delete)(":tripId"),
      (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
      __param(0, (0, current_user_decorator_1.CurrentUser)()),
      __param(1, (0, common_1.Param)("tripId")),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object, String]),
      __metadata("design:returntype", void 0)
    ], TripsController.prototype, "deleteTrip", null);
    __decorate([
      (0, common_1.Put)(":tripId/cover"),
      __param(0, (0, current_user_decorator_1.CurrentUser)()),
      __param(1, (0, common_1.Param)("tripId")),
      __param(2, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(shared_validation_1.SetTripCoverSchema))),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object, String, Object]),
      __metadata("design:returntype", void 0)
    ], TripsController.prototype, "setTripCover", null);
    __decorate([
      (0, common_1.Delete)(":tripId/cover"),
      __param(0, (0, current_user_decorator_1.CurrentUser)()),
      __param(1, (0, common_1.Param)("tripId")),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object, String]),
      __metadata("design:returntype", void 0)
    ], TripsController.prototype, "removeTripCover", null);
    __decorate([
      (0, common_1.Get)(":tripId/members"),
      __param(0, (0, current_user_decorator_1.CurrentUser)()),
      __param(1, (0, common_1.Param)("tripId")),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object, String]),
      __metadata("design:returntype", void 0)
    ], TripsController.prototype, "getTripMembers", null);
    __decorate([
      (0, common_1.Delete)(":tripId/members/:memberId"),
      (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
      __param(0, (0, current_user_decorator_1.CurrentUser)()),
      __param(1, (0, common_1.Param)("tripId")),
      __param(2, (0, common_1.Param)("memberId")),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object, String, String]),
      __metadata("design:returntype", void 0)
    ], TripsController.prototype, "removeMember", null);
    __decorate([
      (0, common_1.Post)(":tripId/leave"),
      (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
      __param(0, (0, current_user_decorator_1.CurrentUser)()),
      __param(1, (0, common_1.Param)("tripId")),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object, String]),
      __metadata("design:returntype", void 0)
    ], TripsController.prototype, "leaveTrip", null);
    __decorate([
      (0, common_1.Post)(":tripId/invitations"),
      __param(0, (0, current_user_decorator_1.CurrentUser)()),
      __param(1, (0, common_1.Param)("tripId")),
      __param(2, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(shared_validation_1.CreateInvitationSchema))),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object, String, Object]),
      __metadata("design:returntype", void 0)
    ], TripsController.prototype, "createInvitation", null);
    __decorate([
      (0, common_1.Put)(":tripId/invitations/:invitationId"),
      (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
      __param(0, (0, current_user_decorator_1.CurrentUser)()),
      __param(1, (0, common_1.Param)("tripId")),
      __param(2, (0, common_1.Param)("invitationId")),
      __param(3, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(shared_validation_1.RespondInvitationSchema))),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object, String, String, Object]),
      __metadata("design:returntype", void 0)
    ], TripsController.prototype, "respondToInvitation", null);
    __decorate([
      (0, common_1.Delete)(":tripId/invitations/:invitationId"),
      (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
      __param(0, (0, current_user_decorator_1.CurrentUser)()),
      __param(1, (0, common_1.Param)("tripId")),
      __param(2, (0, common_1.Param)("invitationId")),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object, String, String]),
      __metadata("design:returntype", void 0)
    ], TripsController.prototype, "cancelInvitation", null);
    exports2.TripsController = TripsController = __decorate([
      (0, swagger_1.ApiTags)("trips"),
      (0, swagger_1.ApiBearerAuth)(),
      (0, common_1.Controller)("trips"),
      (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
      __metadata("design:paramtypes", [
        trips_service_1.TripsService,
        invitations_service_1.InvitationsService
      ])
    ], TripsController);
  }
});

// dist/trips/serializers/poll.serializer.js
var require_poll_serializer = __commonJS({
  "dist/trips/serializers/poll.serializer.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.PollSerializer = void 0;
    var user_serializer_1 = require_user_serializer();
    var PollSerializer = class {
      static async toList(poll, options, creator, viewerVote, r2) {
        return {
          id: poll.id,
          poll_type: poll.pollType,
          title: poll.title,
          status: poll.status,
          deadline: poll.deadline?.toISOString() ?? null,
          locked_at: poll.lockedAt?.toISOString() ?? null,
          creator: {
            id: creator.id,
            name: creator.name,
            username: creator.username,
            avatar_url: await user_serializer_1.UserSummarySerializer.resolveAvatar(creator.avatarUrl, r2)
          },
          options: await Promise.all(options.map(async (opt) => ({
            id: opt.id,
            label: opt.label,
            sort_order: opt.sortOrder,
            candidate_id: opt.candidateId,
            maps_link: opt.mapsLink ?? null,
            ref_links: Array.isArray(opt.refLinks) ? opt.refLinks : [],
            vote_count: opt.votes?.length ?? 0,
            has_voted: viewerVote?.optionId === opt.id,
            voters: await Promise.all((opt.votes ?? []).map((v) => v.user).filter((u) => Boolean(u)).map(async (u) => ({
              id: u.id,
              name: u.name,
              username: u.username,
              avatar_url: await user_serializer_1.UserSummarySerializer.resolveAvatar(u.avatarUrl, r2)
            })))
          }))),
          voted_option_id: viewerVote?.optionId ?? null,
          created_at: poll.createdAt.toISOString()
        };
      }
      static async toDateCandidateTally(candidate, votes, currentUserVoted, r2) {
        return {
          id: candidate.id,
          start_date: candidate.startDate.toISOString().split("T")[0],
          end_date: candidate.endDate.toISOString().split("T")[0],
          vote_count: votes.length,
          voters_preview: await Promise.all(votes.slice(0, 3).map(async (v) => ({
            id: v.user.id,
            name: v.user.name,
            username: v.user.username,
            avatar_url: await user_serializer_1.UserSummarySerializer.resolveAvatar(v.user.avatarUrl, r2)
          }))),
          current_user_voted: currentUserVoted
        };
      }
    };
    exports2.PollSerializer = PollSerializer;
  }
});

// dist/trips/voting.service.js
var require_voting_service = __commonJS({
  "dist/trips/voting.service.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = exports2 && exports2.__metadata || function(k, v) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.VotingService = void 0;
    var common_1 = require("@nestjs/common");
    var prisma_service_1 = require_prisma_service();
    var poll_serializer_1 = require_poll_serializer();
    var r2_service_1 = require_r2_service();
    var USER_SUMMARY_SELECT = {
      id: true,
      name: true,
      username: true,
      avatarUrl: true
    };
    var VotingService = class VotingService {
      constructor(prisma, r2) {
        this.prisma = prisma;
        this.r2 = r2;
      }
      async listPolls(tripId, userId) {
        const trip = await this.prisma.trip.findFirst({
          where: { id: tripId },
          select: { id: true, creatorId: true }
        });
        if (!trip) {
          throw new common_1.NotFoundException({ code: "TRIP_NOT_FOUND", message: "Trip not found" });
        }
        const isParticipant = await this.prisma.tripParticipant.findUnique({
          where: { tripId_userId: { tripId, userId } }
        });
        if (!isParticipant && trip.creatorId !== userId) {
          throw new common_1.ForbiddenException({
            code: "NOT_TRIP_PARTICIPANT",
            message: "You are not a member of this trip"
          });
        }
        const now = /* @__PURE__ */ new Date();
        await this.prisma.tripPoll.updateMany({
          where: { tripId, status: "active", deadline: { lt: now } },
          data: { status: "expired" }
        });
        const polls = await this.prisma.tripPoll.findMany({
          where: { tripId, status: { not: "cancelled" } },
          orderBy: { createdAt: "asc" },
          include: {
            creator: { select: USER_SUMMARY_SELECT },
            options: {
              orderBy: { sortOrder: "asc" },
              include: {
                votes: { include: { user: { select: USER_SUMMARY_SELECT } } }
              }
            }
          }
        });
        const data = await Promise.all(polls.map(async (poll) => {
          const viewerVote = await this.prisma.tripPollVote.findFirst({
            where: { pollId: poll.id, userId }
          });
          return poll_serializer_1.PollSerializer.toList(poll, poll.options, poll.creator, viewerVote, this.r2);
        }));
        return { data };
      }
      async createPoll(tripId, userId, dto) {
        if (!["tanggal", "aktivitas", "lainnya"].includes(dto.poll_type)) {
          throw new common_1.BadRequestException({
            code: "INVALID_POLL_TYPE",
            message: "poll_type must be 'tanggal', 'aktivitas' or 'lainnya'"
          });
        }
        const rawOptions = dto.options.map((opt) => typeof opt === "string" ? { label: opt } : opt);
        if (rawOptions.length < 1 || rawOptions.length > 10) {
          throw new common_1.BadRequestException({
            code: "INVALID_OPTIONS_COUNT",
            message: "Must provide 1\u201310 options"
          });
        }
        const trip = await this.prisma.trip.findFirst({
          where: { id: tripId },
          include: { participants: { select: { userId: true } } }
        });
        if (!trip) {
          throw new common_1.NotFoundException({ code: "TRIP_NOT_FOUND", message: "Trip not found" });
        }
        const isParticipant = trip.participants.some((p) => p.userId === userId);
        if (!isParticipant && trip.creatorId !== userId) {
          throw new common_1.ForbiddenException({
            code: "NOT_TRIP_PARTICIPANT",
            message: "Only trip participants can create polls"
          });
        }
        const existingActive = await this.prisma.tripPoll.findFirst({
          where: { tripId, pollType: dto.poll_type, status: "active" }
        });
        if (existingActive) {
          throw new common_1.ConflictException({
            code: "POLL_TYPE_ACTIVE",
            message: `An active ${dto.poll_type} poll already exists for this trip`
          });
        }
        const poll = await this.prisma.$transaction(async (tx) => {
          const created = await tx.tripPoll.create({
            data: {
              tripId,
              pollType: dto.poll_type,
              title: dto.title,
              status: "active",
              deadline: dto.deadline ? new Date(dto.deadline) : null,
              createdBy: userId
            }
          });
          await Promise.all(rawOptions.map(async (opt, idx) => {
            let candidateId = opt.candidate_id ?? null;
            if (dto.poll_type === "tanggal" && opt.start_date && opt.end_date) {
              const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(opt.candidate_id || "");
              let tripDateCandidate = null;
              if (isValidUuid && opt.candidate_id) {
                tripDateCandidate = await tx.tripDateCandidate.findUnique({
                  where: { id: opt.candidate_id }
                });
              }
              if (!tripDateCandidate) {
                const newCandidate = await tx.tripDateCandidate.create({
                  data: {
                    tripId,
                    startDate: new Date(opt.start_date),
                    endDate: new Date(opt.end_date)
                  }
                });
                candidateId = newCandidate.id;
              } else {
                candidateId = tripDateCandidate.id;
              }
            }
            return tx.tripPollOption.create({
              data: {
                pollId: created.id,
                label: opt.label,
                candidateId,
                sortOrder: idx,
                mapsLink: opt.maps_link?.trim() || null,
                refLinks: opt.ref_links ?? []
              }
            });
          }));
          return created;
        });
        const full = await this.prisma.tripPoll.findUnique({
          where: { id: poll.id },
          include: {
            creator: { select: USER_SUMMARY_SELECT },
            options: {
              orderBy: { sortOrder: "asc" },
              include: {
                votes: { include: { user: { select: USER_SUMMARY_SELECT } } }
              }
            }
          }
        });
        return poll_serializer_1.PollSerializer.toList(full, full.options, full.creator, null, this.r2);
      }
      async updatePoll(tripId, pollId, userId, dto) {
        const poll = await this.prisma.tripPoll.findFirst({
          where: { id: pollId, tripId }
        });
        if (!poll) {
          throw new common_1.NotFoundException({ code: "POLL_NOT_FOUND", message: "Poll not found" });
        }
        const trip = await this.prisma.trip.findUnique({
          where: { id: tripId },
          select: { creatorId: true }
        });
        if (trip?.creatorId !== userId) {
          throw new common_1.ForbiddenException({
            code: "NOT_TRIP_CREATOR",
            message: "Only the trip creator can edit polls"
          });
        }
        if (poll.status !== "active") {
          throw new common_1.BadRequestException({
            code: "POLL_NOT_ACTIVE",
            message: `Cannot edit a ${poll.status} poll`
          });
        }
        if (dto.options && (dto.options.length < 1 || dto.options.length > 10)) {
          throw new common_1.BadRequestException({
            code: "INVALID_OPTIONS_COUNT",
            message: "Must provide 1\u201310 options"
          });
        }
        await this.prisma.$transaction(async (tx) => {
          if (dto.options) {
            const rawOptions = dto.options.map((opt) => typeof opt === "string" ? { label: opt } : opt);
            const oldOptions = await tx.tripPollOption.findMany({ where: { pollId } });
            await tx.tripPollVote.deleteMany({
              where: { optionId: { in: oldOptions.map((o) => o.id) } }
            });
            await tx.tripPollOption.deleteMany({ where: { pollId } });
            await Promise.all(rawOptions.map(async (opt, idx) => {
              let candidateId = opt.candidate_id ?? null;
              if (poll.pollType === "tanggal" && opt.start_date && opt.end_date) {
                const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(opt.candidate_id || "");
                let tripDateCandidate = null;
                if (isValidUuid && opt.candidate_id) {
                  tripDateCandidate = await tx.tripDateCandidate.findUnique({
                    where: { id: opt.candidate_id }
                  });
                }
                if (!tripDateCandidate) {
                  const newCandidate = await tx.tripDateCandidate.create({
                    data: {
                      tripId,
                      startDate: new Date(opt.start_date),
                      endDate: new Date(opt.end_date)
                    }
                  });
                  candidateId = newCandidate.id;
                } else {
                  candidateId = tripDateCandidate.id;
                }
              }
              return tx.tripPollOption.create({
                data: {
                  pollId,
                  label: opt.label,
                  candidateId,
                  sortOrder: idx,
                  mapsLink: opt.maps_link?.trim() || null,
                  refLinks: opt.ref_links ?? []
                }
              });
            }));
          }
          await tx.tripPoll.update({
            where: { id: pollId },
            data: {
              title: dto.title ?? poll.title,
              deadline: dto.deadline !== void 0 ? dto.deadline ? new Date(dto.deadline) : null : poll.deadline
            }
          });
        });
        const full = await this.prisma.tripPoll.findUnique({
          where: { id: pollId },
          include: {
            creator: { select: USER_SUMMARY_SELECT },
            options: {
              orderBy: { sortOrder: "asc" },
              include: {
                votes: { include: { user: { select: USER_SUMMARY_SELECT } } }
              }
            }
          }
        });
        const viewerVote = await this.prisma.tripPollVote.findFirst({
          where: { pollId, userId }
        });
        return poll_serializer_1.PollSerializer.toList(full, full.options, full.creator, viewerVote, this.r2);
      }
      async voteOnPoll(tripId, pollId, userId, optionId) {
        const poll = await this.prisma.tripPoll.findFirst({
          where: { id: pollId, tripId }
        });
        if (!poll) {
          throw new common_1.NotFoundException({ code: "POLL_NOT_FOUND", message: "Poll not found" });
        }
        if (poll.status !== "active") {
          throw new common_1.BadRequestException({
            code: "POLL_NOT_ACTIVE",
            message: `Cannot vote on a ${poll.status} poll`
          });
        }
        const isParticipant = await this.prisma.tripParticipant.findUnique({
          where: { tripId_userId: { tripId, userId } }
        });
        if (!isParticipant) {
          throw new common_1.ForbiddenException({
            code: "NOT_TRIP_PARTICIPANT",
            message: "Only trip participants can vote"
          });
        }
        const option = await this.prisma.tripPollOption.findFirst({
          where: { id: optionId, pollId }
        });
        if (!option) {
          throw new common_1.NotFoundException({
            code: "OPTION_NOT_FOUND",
            message: "Option not found in this poll"
          });
        }
        const existingVote = await this.prisma.tripPollVote.findFirst({
          where: { pollId, userId }
        });
        if (existingVote && existingVote.optionId === optionId) {
          return;
        }
        await this.prisma.$transaction(async (tx) => {
          if (existingVote) {
            await tx.tripPollVote.delete({
              where: { pollId_userId: { pollId, userId } }
            });
          }
          await tx.tripPollVote.create({
            data: { pollId, optionId, userId }
          });
        });
      }
      async retractVote(tripId, pollId, userId) {
        const poll = await this.prisma.tripPoll.findFirst({
          where: { id: pollId, tripId }
        });
        if (!poll) {
          throw new common_1.NotFoundException({ code: "POLL_NOT_FOUND", message: "Poll not found" });
        }
        const vote = await this.prisma.tripPollVote.findFirst({
          where: { pollId, userId }
        });
        if (!vote) {
          throw new common_1.NotFoundException({
            code: "VOTE_NOT_FOUND",
            message: "You have not voted on this poll"
          });
        }
        await this.prisma.tripPollVote.delete({
          where: { pollId_userId: { pollId, userId } }
        });
      }
      async voteOnDateCandidate(tripId, candidateId, userId) {
        const candidate = await this.prisma.tripDateCandidate.findFirst({
          where: { id: candidateId, tripId }
        });
        if (!candidate) {
          throw new common_1.NotFoundException({
            code: "CANDIDATE_NOT_FOUND",
            message: "Candidate not found"
          });
        }
        const isParticipant = await this.prisma.tripParticipant.findUnique({
          where: { tripId_userId: { tripId, userId } }
        });
        if (!isParticipant) {
          throw new common_1.ForbiddenException({
            code: "NOT_TRIP_PARTICIPANT",
            message: "Only trip participants can vote"
          });
        }
        const existingVote = await this.prisma.tripDateVote.findUnique({
          where: { candidateId_userId: { candidateId, userId } }
        });
        if (existingVote) {
          return;
        }
        await this.prisma.tripDateVote.create({
          data: { candidateId, userId }
        });
      }
      async retractDateVote(tripId, candidateId, userId) {
        const candidate = await this.prisma.tripDateCandidate.findFirst({
          where: { id: candidateId, tripId }
        });
        if (!candidate) {
          throw new common_1.NotFoundException({
            code: "CANDIDATE_NOT_FOUND",
            message: "Candidate not found"
          });
        }
        const vote = await this.prisma.tripDateVote.findUnique({
          where: { candidateId_userId: { candidateId, userId } }
        });
        if (!vote) {
          throw new common_1.NotFoundException({
            code: "VOTE_NOT_FOUND",
            message: "You have not voted on this candidate"
          });
        }
        await this.prisma.tripDateVote.delete({
          where: { candidateId_userId: { candidateId, userId } }
        });
      }
      async lockPoll(tripId, pollId, userId) {
        const poll = await this.prisma.tripPoll.findFirst({
          where: { id: pollId, tripId }
        });
        if (!poll) {
          throw new common_1.NotFoundException({ code: "POLL_NOT_FOUND", message: "Poll not found" });
        }
        const trip = await this.prisma.trip.findUnique({
          where: { id: tripId },
          select: { creatorId: true, status: true, startDate: true }
        });
        if (trip?.creatorId !== userId) {
          throw new common_1.ForbiddenException({
            code: "NOT_TRIP_CREATOR",
            message: "Only the trip creator can lock polls"
          });
        }
        if (poll.status !== "active" && poll.status !== "expired") {
          throw new common_1.BadRequestException({
            code: "POLL_NOT_ACTIVE",
            message: `Cannot lock a ${poll.status} poll`
          });
        }
        if (poll.pollType === "tanggal") {
          const options = await this.prisma.tripPollOption.findMany({
            where: { pollId },
            include: { votes: true }
          });
          const winningOption = this.pickWinningOption(options);
          const winningCandidate = winningOption?.candidateId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(winningOption.candidateId) ? await this.prisma.tripDateCandidate.findUnique({
            where: { id: winningOption.candidateId }
          }) : null;
          await this.prisma.$transaction(async (tx) => {
            await tx.tripPoll.update({
              where: { id: pollId },
              data: { status: "locked", lockedAt: /* @__PURE__ */ new Date() }
            });
            if (winningCandidate) {
              await tx.trip.update({
                where: { id: tripId },
                data: {
                  startDate: winningCandidate.startDate,
                  endDate: winningCandidate.endDate,
                  status: "fixed",
                  votingDeadline: null
                }
              });
            }
          });
        } else if (poll.pollType === "aktivitas") {
          const options = await this.prisma.tripPollOption.findMany({
            where: { pollId },
            include: { votes: true },
            orderBy: { sortOrder: "asc" }
          });
          const winningOption = this.pickWinningOption(options);
          await this.prisma.$transaction(async (tx) => {
            await tx.tripPoll.update({
              where: { id: pollId },
              data: { status: "locked", lockedAt: /* @__PURE__ */ new Date() }
            });
            if (winningOption) {
              const activityCount = await tx.tripActivity.count({ where: { tripId } });
              await tx.tripActivity.create({
                data: {
                  tripId,
                  placeName: winningOption.label,
                  kind: "activity",
                  activityDate: trip.status === "fixed" ? trip.startDate : null,
                  sortOrder: activityCount
                }
              });
            }
          });
        } else {
          await this.prisma.tripPoll.update({
            where: { id: pollId },
            data: { status: "locked", lockedAt: /* @__PURE__ */ new Date() }
          });
        }
      }
      pickWinningOption(options) {
        if (options.length === 0)
          return void 0;
        let winner = options[0];
        let maxVotes = winner.votes.length;
        for (const opt of options) {
          if (opt.votes.length > maxVotes) {
            maxVotes = opt.votes.length;
            winner = opt;
          }
        }
        return winner;
      }
      async deletePoll(tripId, pollId, userId) {
        const poll = await this.prisma.tripPoll.findFirst({
          where: { id: pollId, tripId }
        });
        if (!poll) {
          throw new common_1.NotFoundException({ code: "POLL_NOT_FOUND", message: "Poll not found" });
        }
        const trip = await this.prisma.trip.findUnique({
          where: { id: tripId },
          select: { creatorId: true }
        });
        if (trip?.creatorId !== userId) {
          throw new common_1.ForbiddenException({
            code: "NOT_TRIP_CREATOR",
            message: "Only the trip creator can delete polls"
          });
        }
        if (poll.status !== "active" && poll.status !== "expired" && poll.status !== "locked") {
          throw new common_1.BadRequestException({
            code: "POLL_NOT_ACTIVE",
            message: "Can only delete active, expired, or locked polls"
          });
        }
        await this.prisma.tripPoll.delete({
          where: { id: pollId }
        });
      }
    };
    exports2.VotingService = VotingService;
    exports2.VotingService = VotingService = __decorate([
      (0, common_1.Injectable)(),
      __metadata("design:paramtypes", [
        prisma_service_1.PrismaService,
        r2_service_1.R2Service
      ])
    ], VotingService);
  }
});

// dist/trips/voting.controller.js
var require_voting_controller = __commonJS({
  "dist/trips/voting.controller.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = exports2 && exports2.__metadata || function(k, v) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var __param = exports2 && exports2.__param || function(paramIndex, decorator) {
      return function(target, key) {
        decorator(target, key, paramIndex);
      };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.VotingController = void 0;
    var common_1 = require("@nestjs/common");
    var swagger_1 = require("@nestjs/swagger");
    var jwt_auth_guard_1 = require_jwt_auth_guard();
    var current_user_decorator_1 = require_current_user_decorator();
    var voting_service_1 = require_voting_service();
    var shared_validation_1 = require("@atur-perjalanan/shared-validation");
    var zod_validation_pipe_1 = require_zod_validation_pipe();
    var VotingController = class VotingController {
      constructor(votingService) {
        this.votingService = votingService;
      }
      listPolls(user, tripId) {
        return this.votingService.listPolls(tripId, user.userId);
      }
      createPoll(user, tripId, dto) {
        return this.votingService.createPoll(tripId, user.userId, dto);
      }
      voteOnPoll(user, tripId, pollId, dto) {
        return this.votingService.voteOnPoll(tripId, pollId, user.userId, dto.option_id);
      }
      updatePoll(user, tripId, pollId, dto) {
        return this.votingService.updatePoll(tripId, pollId, user.userId, dto);
      }
      retractVote(user, tripId, pollId) {
        return this.votingService.retractVote(tripId, pollId, user.userId);
      }
      voteOnDateCandidate(user, tripId, candidateId) {
        return this.votingService.voteOnDateCandidate(tripId, candidateId, user.userId);
      }
      retractDateVote(user, tripId, candidateId) {
        return this.votingService.retractDateVote(tripId, candidateId, user.userId);
      }
      lockPoll(user, tripId, pollId, _dto) {
        return this.votingService.lockPoll(tripId, pollId, user.userId);
      }
      deletePoll(user, tripId, pollId) {
        return this.votingService.deletePoll(tripId, pollId, user.userId);
      }
    };
    exports2.VotingController = VotingController;
    __decorate([
      (0, common_1.Get)(":tripId/polls"),
      __param(0, (0, current_user_decorator_1.CurrentUser)()),
      __param(1, (0, common_1.Param)("tripId", common_1.ParseUUIDPipe)),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object, String]),
      __metadata("design:returntype", void 0)
    ], VotingController.prototype, "listPolls", null);
    __decorate([
      (0, common_1.Post)(":tripId/polls"),
      (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
      __param(0, (0, current_user_decorator_1.CurrentUser)()),
      __param(1, (0, common_1.Param)("tripId", common_1.ParseUUIDPipe)),
      __param(2, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(shared_validation_1.CreatePollSchema))),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object, String, Object]),
      __metadata("design:returntype", void 0)
    ], VotingController.prototype, "createPoll", null);
    __decorate([
      (0, common_1.Post)(":tripId/polls/:pollId/vote"),
      (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
      __param(0, (0, current_user_decorator_1.CurrentUser)()),
      __param(1, (0, common_1.Param)("tripId", common_1.ParseUUIDPipe)),
      __param(2, (0, common_1.Param)("pollId", common_1.ParseUUIDPipe)),
      __param(3, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(shared_validation_1.VoteSchema))),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object, String, String, Object]),
      __metadata("design:returntype", void 0)
    ], VotingController.prototype, "voteOnPoll", null);
    __decorate([
      (0, common_1.Patch)(":tripId/polls/:pollId"),
      __param(0, (0, current_user_decorator_1.CurrentUser)()),
      __param(1, (0, common_1.Param)("tripId", common_1.ParseUUIDPipe)),
      __param(2, (0, common_1.Param)("pollId", common_1.ParseUUIDPipe)),
      __param(3, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(shared_validation_1.UpdatePollSchema))),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object, String, String, Object]),
      __metadata("design:returntype", void 0)
    ], VotingController.prototype, "updatePoll", null);
    __decorate([
      (0, common_1.Delete)(":tripId/polls/:pollId/vote"),
      (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
      __param(0, (0, current_user_decorator_1.CurrentUser)()),
      __param(1, (0, common_1.Param)("tripId", common_1.ParseUUIDPipe)),
      __param(2, (0, common_1.Param)("pollId", common_1.ParseUUIDPipe)),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object, String, String]),
      __metadata("design:returntype", void 0)
    ], VotingController.prototype, "retractVote", null);
    __decorate([
      (0, common_1.Post)(":tripId/candidates/:candidateId/vote"),
      (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
      __param(0, (0, current_user_decorator_1.CurrentUser)()),
      __param(1, (0, common_1.Param)("tripId", common_1.ParseUUIDPipe)),
      __param(2, (0, common_1.Param)("candidateId", common_1.ParseUUIDPipe)),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object, String, String]),
      __metadata("design:returntype", void 0)
    ], VotingController.prototype, "voteOnDateCandidate", null);
    __decorate([
      (0, common_1.Delete)(":tripId/candidates/:candidateId/vote"),
      (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
      __param(0, (0, current_user_decorator_1.CurrentUser)()),
      __param(1, (0, common_1.Param)("tripId", common_1.ParseUUIDPipe)),
      __param(2, (0, common_1.Param)("candidateId", common_1.ParseUUIDPipe)),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object, String, String]),
      __metadata("design:returntype", void 0)
    ], VotingController.prototype, "retractDateVote", null);
    __decorate([
      (0, common_1.Post)(":tripId/polls/:pollId/lock"),
      (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
      __param(0, (0, current_user_decorator_1.CurrentUser)()),
      __param(1, (0, common_1.Param)("tripId", common_1.ParseUUIDPipe)),
      __param(2, (0, common_1.Param)("pollId", common_1.ParseUUIDPipe)),
      __param(3, (0, common_1.Body)()),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object, String, String, Object]),
      __metadata("design:returntype", void 0)
    ], VotingController.prototype, "lockPoll", null);
    __decorate([
      (0, common_1.Delete)(":tripId/polls/:pollId"),
      (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
      __param(0, (0, current_user_decorator_1.CurrentUser)()),
      __param(1, (0, common_1.Param)("tripId", common_1.ParseUUIDPipe)),
      __param(2, (0, common_1.Param)("pollId", common_1.ParseUUIDPipe)),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object, String, String]),
      __metadata("design:returntype", void 0)
    ], VotingController.prototype, "deletePoll", null);
    exports2.VotingController = VotingController = __decorate([
      (0, swagger_1.ApiTags)("voting"),
      (0, swagger_1.ApiBearerAuth)(),
      (0, common_1.Controller)("trips"),
      (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
      __metadata("design:paramtypes", [voting_service_1.VotingService])
    ], VotingController);
  }
});

// dist/common/google-maps/google-maps.service.js
var require_google_maps_service = __commonJS({
  "dist/common/google-maps/google-maps.service.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = exports2 && exports2.__metadata || function(k, v) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var GoogleMapsService_1;
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.GoogleMapsService = void 0;
    var common_1 = require("@nestjs/common");
    var config_1 = require("@nestjs/config");
    var GoogleMapsService = GoogleMapsService_1 = class GoogleMapsService {
      constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(GoogleMapsService_1.name);
        this.apiKey = this.config.get("google.mapsApiKey");
      }
      async resolveThumbnailFromMapsLink(mapsLink) {
        const resolved = await this.expandShortLink(mapsLink);
        const location = this.parseMapsLink(resolved);
        const ogImage = await this.resolveOgImage(mapsLink);
        if (ogImage)
          return ogImage;
        if (this.apiKey) {
          if (location?.placeId) {
            const photoUrl = await this.resolvePlacePhoto(location.placeId);
            if (photoUrl)
              return photoUrl;
          }
          if (location?.lat !== void 0 && location?.lng !== void 0) {
            const staticUrl = this.buildStaticMapUrl(location.lat, location.lng);
            if (await this.isUrlReachable(staticUrl))
              return staticUrl;
          }
        } else {
          this.logger.debug("GOOGLE_MAPS_API_KEY not set \u2014 using billing-free fallback");
        }
        if (location?.lat !== void 0 && location?.lng !== void 0) {
          return this.buildFallbackStaticMapUrl(location.lat, location.lng);
        }
        return null;
      }
      async resolveOgImage(mapsLink) {
        const BOT_UA = "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)";
        try {
          const res = await fetch(mapsLink, {
            redirect: "follow",
            method: "GET",
            headers: {
              "User-Agent": BOT_UA,
              Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
            }
          });
          if (!res.ok)
            return null;
          const html = await res.text();
          const og = html.match(/property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ?? html.match(/content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
          return og?.[1] || null;
        } catch (err) {
          this.logger.warn(`og:image scrape failed for ${mapsLink}: ${err}`);
          return null;
        }
      }
      async isUrlReachable(url) {
        try {
          const res = await fetch(url, { method: "HEAD" });
          return res.ok;
        } catch {
          return false;
        }
      }
      async expandShortLink(mapsLink) {
        try {
          const res = await fetch(mapsLink, { redirect: "follow", method: "GET" });
          return res.url || mapsLink;
        } catch (err) {
          this.logger.warn(`Short link expand failed for ${mapsLink}: ${err}`);
          return mapsLink;
        }
      }
      parseMapsLink(mapsLink) {
        try {
          const url = new URL(mapsLink);
          const placeIdParam = url.searchParams.get("place_id");
          if (placeIdParam) {
            return { placeId: placeIdParam };
          }
          const dataMatch = mapsLink.match(/!1s([^!&?]+)/);
          if (dataMatch?.[1]) {
            const ref = decodeURIComponent(dataMatch[1]);
            if (ref.startsWith("ChIJ")) {
              return { placeId: ref };
            }
            if (/^0x[0-9a-fA-F]{16}$/.test(ref)) {
              return { placeId: ref };
            }
          }
          const atMatch = mapsLink.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
          if (atMatch) {
            return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
          }
          for (const key of ["q", "query"]) {
            const q = url.searchParams.get(key);
            if (q) {
              const coordMatch = q.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
              if (coordMatch) {
                return {
                  lat: parseFloat(coordMatch[1]),
                  lng: parseFloat(coordMatch[2])
                };
              }
            }
          }
          return null;
        } catch {
          return null;
        }
      }
      async resolvePlacePhoto(placeId) {
        try {
          const detailsUrl = new URL("https://maps.googleapis.com/maps/api/place/details/json");
          detailsUrl.searchParams.set("place_id", placeId);
          detailsUrl.searchParams.set("fields", "photos");
          detailsUrl.searchParams.set("key", this.apiKey);
          const res = await fetch(detailsUrl.toString());
          if (!res.ok)
            return null;
          const data = await res.json();
          if (data.status !== "OK" || !data.result?.photos?.length) {
            return null;
          }
          const photoRef = data.result.photos[0].photo_reference;
          const photoUrl = new URL("https://maps.googleapis.com/maps/api/place/photo");
          photoUrl.searchParams.set("maxwidth", "400");
          photoUrl.searchParams.set("photo_reference", photoRef);
          photoUrl.searchParams.set("key", this.apiKey);
          return photoUrl.toString();
        } catch (err) {
          this.logger.warn(`Places API failed for place_id=${placeId}: ${err}`);
          return null;
        }
      }
      buildStaticMapUrl(lat, lng) {
        const url = new URL("https://maps.googleapis.com/maps/api/staticmap");
        url.searchParams.set("center", `${lat},${lng}`);
        url.searchParams.set("zoom", "15");
        url.searchParams.set("size", "400x300");
        url.searchParams.set("maptype", "roadmap");
        url.searchParams.set("key", this.apiKey);
        return url.toString();
      }
      buildFallbackStaticMapUrl(lat, lng) {
        const url = new URL("https://static-maps.yandex.ru/1.x/");
        url.searchParams.set("ll", `${lng},${lat}`);
        url.searchParams.set("z", "15");
        url.searchParams.set("size", "400,300");
        url.searchParams.set("l", "map");
        return url.toString();
      }
    };
    exports2.GoogleMapsService = GoogleMapsService;
    exports2.GoogleMapsService = GoogleMapsService = GoogleMapsService_1 = __decorate([
      (0, common_1.Injectable)(),
      __metadata("design:paramtypes", [config_1.ConfigService])
    ], GoogleMapsService);
  }
});

// dist/trips/serializers/activity.serializer.js
var require_activity_serializer = __commonJS({
  "dist/trips/serializers/activity.serializer.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ActivitySerializer = void 0;
    var date_helpers_1 = require_date_helpers();
    var ActivitySerializer = class {
      static toList(activity, coverDocument, coverThumbnailUrl) {
        return {
          id: activity.id,
          place_name: activity.placeName,
          activity_date: (0, date_helpers_1.dateToISO)(activity.activityDate),
          day_number: activity.dayNumber,
          start_time: (0, date_helpers_1.timeToHHMM)(activity.startTime),
          end_time: (0, date_helpers_1.timeToHHMM)(activity.endTime),
          kind: activity.kind,
          description: activity.description,
          location_label: activity.locationLabel,
          maps_link: activity.mapsLink,
          ref_links: activity.refLinks || [],
          cover_source: activity.coverSource,
          cover_icon: activity.coverIcon,
          cover_document_id: activity.coverDocumentId,
          thumbnail_url: activity.thumbnailUrl || coverThumbnailUrl || coverDocument?.storageUrl || null,
          sort_order: activity.sortOrder,
          created_at: activity.createdAt.toISOString(),
          updated_at: activity.updatedAt.toISOString()
        };
      }
      static toDetail(activity, coverDocument, coverThumbnailUrl) {
        return {
          id: activity.id,
          place_name: activity.placeName,
          activity_date: (0, date_helpers_1.dateToISO)(activity.activityDate),
          day_number: activity.dayNumber,
          start_time: (0, date_helpers_1.timeToHHMM)(activity.startTime),
          end_time: (0, date_helpers_1.timeToHHMM)(activity.endTime),
          kind: activity.kind,
          description: activity.description,
          location_label: activity.locationLabel,
          maps_link: activity.mapsLink,
          ref_links: activity.refLinks || [],
          cover_source: activity.coverSource,
          cover_icon: activity.coverIcon,
          cover_document_id: activity.coverDocumentId,
          thumbnail_url: activity.thumbnailUrl || coverThumbnailUrl || coverDocument?.storageUrl || null,
          sort_order: activity.sortOrder,
          created_at: activity.createdAt.toISOString(),
          updated_at: activity.updatedAt.toISOString()
        };
      }
    };
    exports2.ActivitySerializer = ActivitySerializer;
  }
});

// dist/trips/activity.service.js
var require_activity_service = __commonJS({
  "dist/trips/activity.service.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = exports2 && exports2.__metadata || function(k, v) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var ActivityService_1;
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ActivityService = void 0;
    var common_1 = require("@nestjs/common");
    var prisma_service_1 = require_prisma_service();
    var google_maps_service_1 = require_google_maps_service();
    var activity_serializer_1 = require_activity_serializer();
    var r2_service_1 = require_r2_service();
    var notifications_service_1 = require_notifications_service();
    var date_helpers_1 = require_date_helpers();
    var ActivityService = ActivityService_1 = class ActivityService {
      constructor(prisma, googleMaps, r2, notifications) {
        this.prisma = prisma;
        this.googleMaps = googleMaps;
        this.r2 = r2;
        this.notifications = notifications;
        this.logger = new common_1.Logger(ActivityService_1.name);
      }
      async listActivities(tripId, userId) {
        const trip = await this.prisma.trip.findFirst({
          where: {
            id: tripId,
            participants: { some: { userId } }
          },
          include: { participants: { select: { userId: true } } }
        });
        if (!trip) {
          throw new common_1.NotFoundException("Trip not found or access denied");
        }
        const activities = await this.prisma.tripActivity.findMany({
          where: { tripId },
          include: { coverDocument: { select: { id: true, storageKey: true, storageUrl: true } } },
          orderBy: [{ dayNumber: "asc" }, { startTime: "asc" }]
        });
        const coverKeys = activities.filter((a) => !a.thumbnailUrl && a.coverDocument?.storageKey).map((a) => a.coverDocument.storageKey);
        const signedCoverUrls = await this.r2.presignDownloads(coverKeys);
        return {
          data: activities.map((a) => activity_serializer_1.ActivitySerializer.toList(a, a.coverDocument, a.thumbnailUrl || (a.coverDocument?.storageKey ? signedCoverUrls.get(a.coverDocument.storageKey) ?? null : null))),
          next_cursor: null
        };
      }
      async getActivity(tripId, activityId, userId) {
        const trip = await this.prisma.trip.findFirst({
          where: {
            id: tripId,
            participants: { some: { userId } }
          }
        });
        if (!trip) {
          throw new common_1.NotFoundException("Trip not found or access denied");
        }
        const activity = await this.prisma.tripActivity.findFirst({
          where: { id: activityId, tripId },
          include: { coverDocument: { select: { id: true, storageKey: true, storageUrl: true } } }
        });
        if (!activity) {
          throw new common_1.NotFoundException("Activity not found");
        }
        return activity_serializer_1.ActivitySerializer.toDetail(activity, activity.coverDocument, await this.resolveCoverThumbnailUrl(activity));
      }
      async createActivity(tripId, userId, dto) {
        const trip = await this.prisma.trip.findFirst({
          where: {
            id: tripId,
            participants: { some: { userId } }
          },
          include: { participants: true }
        });
        if (!trip) {
          throw new common_1.NotFoundException("Trip not found or access denied");
        }
        const timeRegex = /^(\d{2}):(\d{2})$/;
        const startMatch = dto.start_time.match(timeRegex);
        const endMatch = dto.end_time.match(timeRegex);
        if (!startMatch || !endMatch) {
          throw new common_1.BadRequestException("Invalid time format (HH:MM required)");
        }
        const startMinutes = parseInt(startMatch[1]) * 60 + parseInt(startMatch[2]);
        const endMinutes = parseInt(endMatch[1]) * 60 + parseInt(endMatch[2]);
        if (startMinutes > endMinutes) {
          throw new common_1.BadRequestException("start_time must be <= end_time");
        }
        const dayNumber = dto.day_number || 1;
        if (dayNumber < 1) {
          throw new common_1.BadRequestException("day_number must be >= 1");
        }
        if (trip.status === "fixed" && trip.startDate && trip.endDate) {
          const totalDays = Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / 864e5) + 1;
          if (dayNumber > totalDays) {
            throw new common_1.BadRequestException(`day_number must be <= ${totalDays} (trip duration)`);
          }
        }
        const activity = await this.prisma.tripActivity.create({
          data: {
            tripId,
            placeName: dto.place_name,
            activityDate: dto.activity_date ? new Date(dto.activity_date) : null,
            dayNumber,
            startTime: this.parseTimeToDate(dto.start_time),
            endTime: this.parseTimeToDate(dto.end_time),
            kind: dto.kind || "activity",
            description: dto.description,
            locationLabel: dto.location_label,
            mapsLink: dto.maps_link,
            refLinks: dto.ref_links ?? [],
            coverSource: dto.cover_source || "none",
            coverIcon: dto.cover_icon,
            coverDocumentId: dto.cover_document_id,
            thumbnailUrl: dto.thumbnail_url,
            sortOrder: dto.sort_order || 0
          },
          include: { coverDocument: { select: { id: true, storageKey: true, storageUrl: true } } }
        });
        const participantsToNotify = trip.participants.filter((p) => p.userId !== userId).map((p) => p.userId);
        await this.notifications.createManyNotifications(participantsToNotify.map((participantId) => ({
          userId: participantId,
          type: "activity_update",
          actorId: userId,
          tripId,
          payload: {
            activity_id: activity.id,
            activity_name: activity.placeName,
            action: "created"
          }
        })));
        this.scheduleThumbnailResolve(activity.id, dto.maps_link);
        return activity_serializer_1.ActivitySerializer.toDetail(activity, activity.coverDocument, await this.resolveCoverThumbnailUrl(activity));
      }
      async updateActivity(tripId, activityId, userId, dto) {
        const trip = await this.prisma.trip.findFirst({
          where: {
            id: tripId,
            participants: { some: { userId } }
          },
          include: { participants: true }
        });
        if (!trip) {
          throw new common_1.NotFoundException("Trip not found or access denied");
        }
        const existing = await this.prisma.tripActivity.findFirst({
          where: { id: activityId, tripId }
        });
        if (!existing) {
          throw new common_1.NotFoundException("Activity not found");
        }
        const startTime = dto.start_time || (existing.startTime ? (0, date_helpers_1.timeToHHMM)(existing.startTime) : void 0);
        const endTime = dto.end_time || (existing.endTime ? (0, date_helpers_1.timeToHHMM)(existing.endTime) : void 0);
        if ((dto.start_time || dto.end_time) && startTime && endTime) {
          const timeRegex = /^(\d{2}):(\d{2})$/;
          const startMatch = startTime.match(timeRegex);
          const endMatch = endTime.match(timeRegex);
          if (!startMatch || !endMatch) {
            throw new common_1.BadRequestException("Invalid time format (HH:MM required)");
          }
          const startMinutes = parseInt(startMatch[1]) * 60 + parseInt(startMatch[2]);
          const endMinutes = parseInt(endMatch[1]) * 60 + parseInt(endMatch[2]);
          if (startMinutes > endMinutes) {
            throw new common_1.BadRequestException("start_time must be <= end_time");
          }
        }
        const dayNumber = dto.day_number ?? existing.dayNumber;
        if (dayNumber < 1) {
          throw new common_1.BadRequestException("day_number must be >= 1");
        }
        if (trip.status === "fixed" && trip.startDate && trip.endDate) {
          const totalDays = Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / 864e5) + 1;
          if (dayNumber > totalDays) {
            throw new common_1.BadRequestException(`day_number must be <= ${totalDays} (trip duration)`);
          }
        }
        const updated = await this.prisma.tripActivity.update({
          where: { id: activityId },
          data: {
            placeName: dto.place_name !== void 0 ? dto.place_name : void 0,
            activityDate: dto.activity_date ? new Date(dto.activity_date) : void 0,
            dayNumber,
            startTime: dto.start_time !== void 0 ? this.parseTimeToDate(dto.start_time) : void 0,
            endTime: dto.end_time !== void 0 ? this.parseTimeToDate(dto.end_time) : void 0,
            kind: dto.kind !== void 0 ? dto.kind : void 0,
            description: dto.description !== void 0 ? dto.description : void 0,
            locationLabel: dto.location_label !== void 0 ? dto.location_label : void 0,
            mapsLink: dto.maps_link !== void 0 ? dto.maps_link : void 0,
            refLinks: dto.ref_links ?? void 0,
            coverSource: dto.cover_source !== void 0 ? dto.cover_source : void 0,
            coverIcon: dto.cover_icon !== void 0 ? dto.cover_icon : void 0,
            coverDocumentId: dto.cover_document_id !== void 0 ? dto.cover_document_id : void 0,
            thumbnailUrl: dto.thumbnail_url !== void 0 ? dto.thumbnail_url : void 0,
            sortOrder: dto.sort_order !== void 0 ? dto.sort_order : void 0
          },
          include: { coverDocument: { select: { id: true, storageKey: true, storageUrl: true } } }
        });
        const participantsToNotify = trip.participants.filter((p) => p.userId !== userId).map((p) => p.userId);
        await this.notifications.createManyNotifications(participantsToNotify.map((participantId) => ({
          userId: participantId,
          type: "activity_update",
          actorId: userId,
          tripId,
          payload: {
            activity_id: updated.id,
            activity_name: updated.placeName,
            action: "updated"
          }
        })));
        const mapsLink = dto.maps_link !== void 0 ? dto.maps_link : existing.mapsLink;
        const hasThumbnail = dto.thumbnail_url !== void 0 ? !!dto.thumbnail_url : !!existing.thumbnailUrl;
        if (mapsLink && !hasThumbnail) {
          this.scheduleThumbnailResolve(activityId, mapsLink);
        }
        return activity_serializer_1.ActivitySerializer.toDetail(updated, updated.coverDocument, await this.resolveCoverThumbnailUrl(updated));
      }
      async deleteActivity(tripId, activityId, userId) {
        const trip = await this.prisma.trip.findFirst({
          where: {
            id: tripId,
            participants: { some: { userId } }
          },
          include: { participants: true }
        });
        if (!trip) {
          throw new common_1.NotFoundException("Trip not found or access denied");
        }
        const existing = await this.prisma.tripActivity.findFirst({
          where: { id: activityId, tripId }
        });
        if (!existing) {
          throw new common_1.NotFoundException("Activity not found");
        }
        await this.prisma.tripActivity.delete({
          where: { id: activityId }
        });
      }
      scheduleThumbnailResolve(activityId, mapsLink) {
        if (!mapsLink)
          return;
        setImmediate(() => {
          this.resolveThumbnailInBackground(activityId, mapsLink).catch((err) => {
            this.logger.warn(`Thumbnail resolve failed for activity ${activityId}: ${err}`);
          });
        });
      }
      async syncMapsThumbnail(tripId, userId, mapsLink) {
        const trip = await this.prisma.trip.findFirst({
          where: { id: tripId, participants: { some: { userId } } },
          select: { id: true, creatorId: true }
        });
        if (!trip) {
          throw new common_1.NotFoundException("Trip not found or access denied");
        }
        const thumbnailUrl = await this.googleMaps.resolveThumbnailFromMapsLink(mapsLink);
        if (!thumbnailUrl)
          return { thumbnail_url: null };
        await this.importRemoteThumbnailToTripMedia(tripId, trip.creatorId, thumbnailUrl).catch((err) => {
          this.logger.warn(`Import maps thumbnail to trip media failed: ${err}`);
        });
        return { thumbnail_url: thumbnailUrl };
      }
      async resolveThumbnailInBackground(activityId, mapsLink) {
        const thumbnailUrl = await this.googleMaps.resolveThumbnailFromMapsLink(mapsLink);
        if (!thumbnailUrl)
          return;
        await this.prisma.tripActivity.update({
          where: { id: activityId },
          data: { thumbnailUrl, coverSource: "maps" }
        });
        const activity = await this.prisma.tripActivity.findFirst({
          where: { id: activityId },
          select: { tripId: true }
        });
        if (!activity)
          return;
        const trip = await this.prisma.trip.findFirst({
          where: { id: activity.tripId },
          select: { creatorId: true }
        });
        if (trip?.creatorId) {
          await this.importRemoteThumbnailToTripMedia(activity.tripId, trip.creatorId, thumbnailUrl).catch((err) => {
            this.logger.warn(`Import maps thumbnail to trip media failed for activity ${activityId}: ${err}`);
          });
        }
      }
      async importRemoteThumbnailToTripMedia(tripId, uploaderId, thumbnailUrl) {
        const existing = await this.prisma.tripDocument.findFirst({
          where: { tripId, storageUrl: thumbnailUrl }
        });
        if (existing)
          return;
        const res = await fetch(thumbnailUrl);
        if (!res.ok)
          return;
        const buffer = Buffer.from(await res.arrayBuffer());
        const contentType = res.headers.get("content-type") ?? "image/jpeg";
        const { storageKey, storageUrl } = await this.r2.putObject(tripId, contentType, buffer);
        await this.prisma.tripDocument.create({
          data: {
            tripId,
            uploadedBy: uploaderId,
            mediaType: "photo",
            storageKey,
            storageUrl,
            fromChat: false
          }
        });
      }
      async resolveCoverThumbnailUrl(activity) {
        if (activity.thumbnailUrl)
          return activity.thumbnailUrl;
        if (!activity.coverDocument?.storageKey)
          return null;
        return this.r2.presignDownload(activity.coverDocument.storageKey);
      }
      parseTimeToDate(timeStr) {
        const [h, m] = timeStr.split(":").map(Number);
        const d = new Date(Date.UTC(1970, 0, 1, h, m, 0, 0));
        return d;
      }
    };
    exports2.ActivityService = ActivityService;
    exports2.ActivityService = ActivityService = ActivityService_1 = __decorate([
      (0, common_1.Injectable)(),
      __metadata("design:paramtypes", [
        prisma_service_1.PrismaService,
        google_maps_service_1.GoogleMapsService,
        r2_service_1.R2Service,
        notifications_service_1.NotificationsService
      ])
    ], ActivityService);
  }
});

// dist/trips/activity.controller.js
var require_activity_controller = __commonJS({
  "dist/trips/activity.controller.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = exports2 && exports2.__metadata || function(k, v) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var __param = exports2 && exports2.__param || function(paramIndex, decorator) {
      return function(target, key) {
        decorator(target, key, paramIndex);
      };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ActivityController = void 0;
    var common_1 = require("@nestjs/common");
    var swagger_1 = require("@nestjs/swagger");
    var jwt_auth_guard_1 = require_jwt_auth_guard();
    var current_user_decorator_1 = require_current_user_decorator();
    var activity_service_1 = require_activity_service();
    var shared_validation_1 = require("@atur-perjalanan/shared-validation");
    var zod_validation_pipe_1 = require_zod_validation_pipe();
    var ActivityController = class ActivityController {
      constructor(activityService) {
        this.activityService = activityService;
      }
      async listActivities(tripId, user) {
        return this.activityService.listActivities(tripId, user.userId);
      }
      async syncMapsThumbnail(tripId, body, user) {
        if (!body.maps_link || !/^https?:\/\//.test(body.maps_link)) {
          throw new common_1.BadRequestException("maps_link must be a valid URL");
        }
        return this.activityService.syncMapsThumbnail(tripId, user.userId, body.maps_link);
      }
      async getActivity(tripId, activityId, user) {
        return this.activityService.getActivity(tripId, activityId, user.userId);
      }
      async createActivity(tripId, dto, user) {
        return this.activityService.createActivity(tripId, user.userId, dto);
      }
      async updateActivity(tripId, activityId, dto, user) {
        return this.activityService.updateActivity(tripId, activityId, user.userId, dto);
      }
      async deleteActivity(tripId, activityId, user) {
        return this.activityService.deleteActivity(tripId, activityId, user.userId);
      }
    };
    exports2.ActivityController = ActivityController;
    __decorate([
      (0, common_1.Get)(":tripId/activities"),
      (0, common_1.HttpCode)(common_1.HttpStatus.OK),
      __param(0, (0, common_1.Param)("tripId", common_1.ParseUUIDPipe)),
      __param(1, (0, current_user_decorator_1.CurrentUser)()),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [String, Object]),
      __metadata("design:returntype", Promise)
    ], ActivityController.prototype, "listActivities", null);
    __decorate([
      (0, common_1.Post)(":tripId/activities/sync-maps-thumbnail"),
      (0, common_1.HttpCode)(common_1.HttpStatus.OK),
      __param(0, (0, common_1.Param)("tripId", common_1.ParseUUIDPipe)),
      __param(1, (0, common_1.Body)()),
      __param(2, (0, current_user_decorator_1.CurrentUser)()),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [String, Object, Object]),
      __metadata("design:returntype", Promise)
    ], ActivityController.prototype, "syncMapsThumbnail", null);
    __decorate([
      (0, common_1.Get)(":tripId/activities/:activityId"),
      (0, common_1.HttpCode)(common_1.HttpStatus.OK),
      __param(0, (0, common_1.Param)("tripId", common_1.ParseUUIDPipe)),
      __param(1, (0, common_1.Param)("activityId", common_1.ParseUUIDPipe)),
      __param(2, (0, current_user_decorator_1.CurrentUser)()),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [String, String, Object]),
      __metadata("design:returntype", Promise)
    ], ActivityController.prototype, "getActivity", null);
    __decorate([
      (0, common_1.Post)(":tripId/activities"),
      (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
      __param(0, (0, common_1.Param)("tripId", common_1.ParseUUIDPipe)),
      __param(1, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(shared_validation_1.CreateActivitySchema))),
      __param(2, (0, current_user_decorator_1.CurrentUser)()),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [String, Object, Object]),
      __metadata("design:returntype", Promise)
    ], ActivityController.prototype, "createActivity", null);
    __decorate([
      (0, common_1.Put)(":tripId/activities/:activityId"),
      (0, common_1.HttpCode)(common_1.HttpStatus.OK),
      __param(0, (0, common_1.Param)("tripId", common_1.ParseUUIDPipe)),
      __param(1, (0, common_1.Param)("activityId", common_1.ParseUUIDPipe)),
      __param(2, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(shared_validation_1.UpdateActivitySchema))),
      __param(3, (0, current_user_decorator_1.CurrentUser)()),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [String, String, Object, Object]),
      __metadata("design:returntype", Promise)
    ], ActivityController.prototype, "updateActivity", null);
    __decorate([
      (0, common_1.Delete)(":tripId/activities/:activityId"),
      (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
      __param(0, (0, common_1.Param)("tripId", common_1.ParseUUIDPipe)),
      __param(1, (0, common_1.Param)("activityId", common_1.ParseUUIDPipe)),
      __param(2, (0, current_user_decorator_1.CurrentUser)()),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [String, String, Object]),
      __metadata("design:returntype", Promise)
    ], ActivityController.prototype, "deleteActivity", null);
    exports2.ActivityController = ActivityController = __decorate([
      (0, swagger_1.ApiTags)("activities"),
      (0, swagger_1.ApiBearerAuth)(),
      (0, common_1.Controller)("trips"),
      (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
      __metadata("design:paramtypes", [activity_service_1.ActivityService])
    ], ActivityController);
  }
});

// dist/trips/serializers/message.serializer.js
var require_message_serializer = __commonJS({
  "dist/trips/serializers/message.serializer.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.MessageSerializer = void 0;
    var user_serializer_1 = require_user_serializer();
    async function toUserSummary(user, r2) {
      if (!user)
        return null;
      return {
        id: user.id,
        name: user.name,
        username: user.username,
        avatar_url: await user_serializer_1.UserSummarySerializer.resolveAvatar(user.avatarUrl, r2)
      };
    }
    var MessageSerializer = class {
      static async toList(message, mediaUrlOverride, r2) {
        const isDeleted = !!message.deletedAt;
        const mediaUrl = mediaUrlOverride ?? message.mediaUrl;
        return {
          id: message.id,
          trip_id: message.tripId,
          sender: await toUserSummary(message.sender ?? null, r2),
          message_kind: message.messageKind,
          message_text: isDeleted ? null : message.messageText,
          media_url: isDeleted ? null : mediaUrl,
          media_duration_seconds: this.durationToSeconds(message.mediaDuration),
          reply_to: message.replyTo ? {
            id: message.replyTo.id,
            sender: await toUserSummary(message.replyTo.sender ?? null, r2),
            message_kind: message.replyTo.messageKind,
            message_text: message.replyTo.deletedAt ? null : message.replyTo.messageText
          } : null,
          is_deleted: isDeleted,
          created_at: message.createdAt.toISOString()
        };
      }
      static durationToSeconds(duration) {
        if (!duration)
          return null;
        if (typeof duration === "string") {
          const parts = duration.split(":").map(Number);
          if (parts.length === 3) {
            const [h, m, s] = parts;
            return h * 3600 + m * 60 + s;
          }
        }
        return null;
      }
    };
    exports2.MessageSerializer = MessageSerializer;
  }
});

// dist/trips/chat.service.js
var require_chat_service = __commonJS({
  "dist/trips/chat.service.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = exports2 && exports2.__metadata || function(k, v) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ChatService = void 0;
    var common_1 = require("@nestjs/common");
    var prisma_service_1 = require_prisma_service();
    var message_serializer_1 = require_message_serializer();
    var r2_service_1 = require_r2_service();
    var USER_SUMMARY_SELECT = {
      id: true,
      name: true,
      username: true,
      avatarUrl: true
    };
    var MESSAGE_INCLUDE = {
      sender: { select: USER_SUMMARY_SELECT },
      replyTo: {
        include: { sender: { select: USER_SUMMARY_SELECT } }
      }
    };
    var ChatService = class ChatService {
      constructor(prisma, r2) {
        this.prisma = prisma;
        this.r2 = r2;
      }
      async listMessages(tripId, userId, cursor, limit = 20) {
        await this.assertParticipant(tripId, userId);
        const take = Math.min(limit, 100);
        const messages = await this.prisma.tripMessage.findMany({
          where: {
            tripId,
            deletedAt: null,
            ...cursor ? { createdAt: { lt: new Date(cursor) } } : {}
          },
          orderBy: { createdAt: "desc" },
          take: take + 1,
          include: MESSAGE_INCLUDE
        });
        const hasMore = messages.length > take;
        const results = hasMore ? messages.slice(0, take) : messages;
        const readRow = await this.prisma.tripMessageRead.findUnique({
          where: { tripId_userId: { tripId, userId } }
        });
        const unreadCount = readRow ? await this.prisma.tripMessage.count({
          where: {
            tripId,
            deletedAt: null,
            createdAt: { gt: readRow.lastReadAt },
            senderId: { not: userId }
          }
        }) : await this.prisma.tripMessage.count({
          where: { tripId, deletedAt: null, senderId: { not: userId } }
        });
        return {
          data: await Promise.all(results.map((m) => this.toMessageResponse(m))),
          next_cursor: hasMore ? results[results.length - 1]?.createdAt.toISOString() ?? null : null,
          unread_count: unreadCount
        };
      }
      async createMessage(tripId, userId, dto) {
        await this.assertParticipant(tripId, userId);
        if (dto.message_kind === "text") {
          if (!dto.message_text) {
            throw new common_1.BadRequestException({
              code: "MESSAGE_TEXT_REQUIRED",
              message: "message_text is required for text messages"
            });
          }
        } else {
          if (!dto.media_url) {
            throw new common_1.BadRequestException({
              code: "MEDIA_URL_REQUIRED",
              message: "media_url is required for photo/video messages"
            });
          }
        }
        if (dto.reply_to_id) {
          const replyTarget = await this.prisma.tripMessage.findFirst({
            where: { id: dto.reply_to_id, tripId }
          });
          if (!replyTarget) {
            throw new common_1.NotFoundException({
              code: "REPLY_TARGET_NOT_FOUND",
              message: "The message being replied to was not found in this trip"
            });
          }
        }
        const message = await this.prisma.$transaction(async (tx) => {
          const storageKey = dto.message_kind === "photo" || dto.message_kind === "video" ? this.r2.extractStorageKey(dto.media_url) : null;
          const created = await tx.tripMessage.create({
            data: {
              tripId,
              senderId: userId,
              messageKind: dto.message_kind,
              messageText: dto.message_text ?? null,
              mediaUrl: storageKey ? this.r2.resolvePublicUrl(storageKey) : null,
              mediaDuration: dto.media_duration_seconds ? this.toIntervalString(dto.media_duration_seconds) : null,
              replyToId: dto.reply_to_id ?? null
            },
            include: MESSAGE_INCLUDE
          });
          if (storageKey) {
            const mediaDuration = dto.media_duration_seconds ? this.toIntervalString(dto.media_duration_seconds) : null;
            await tx.tripDocument.create({
              data: {
                tripId,
                uploadedBy: userId,
                mediaType: dto.message_kind,
                storageKey,
                storageUrl: this.r2.resolvePublicUrl(storageKey),
                mediaDuration,
                fromChat: true,
                messageId: created.id
              }
            });
          }
          return created;
        });
        return this.toMessageResponse(message);
      }
      async deleteMessage(tripId, messageId, userId) {
        const message = await this.prisma.tripMessage.findFirst({
          where: { id: messageId, tripId }
        });
        if (!message) {
          throw new common_1.NotFoundException({
            code: "MESSAGE_NOT_FOUND",
            message: "Message not found"
          });
        }
        if (message.senderId !== userId) {
          throw new common_1.ForbiddenException({
            code: "NOT_MESSAGE_SENDER",
            message: "Only the sender can delete this message"
          });
        }
        if (message.deletedAt) {
          return;
        }
        await this.prisma.$transaction(async (tx) => {
          await tx.tripMessage.update({
            where: { id: messageId },
            data: { deletedAt: /* @__PURE__ */ new Date() }
          });
          const linkedDocs = await tx.tripDocument.findMany({
            where: { messageId }
          });
          for (const doc of linkedDocs) {
            await tx.trip.updateMany({
              where: { id: tripId, coverDocumentId: doc.id },
              data: { coverDocumentId: null }
            });
            await tx.tripActivity.updateMany({
              where: { tripId, coverDocumentId: doc.id },
              data: { coverDocumentId: null, coverSource: "none" }
            });
          }
          await tx.tripDocument.deleteMany({
            where: { messageId }
          });
        });
      }
      async markRead(tripId, userId) {
        await this.assertParticipant(tripId, userId);
        await this.prisma.tripMessageRead.upsert({
          where: { tripId_userId: { tripId, userId } },
          create: { tripId, userId, lastReadAt: /* @__PURE__ */ new Date() },
          update: { lastReadAt: /* @__PURE__ */ new Date() }
        });
      }
      async toMessageResponse(message) {
        const mediaUrl = await this.resolveMediaUrl(message);
        return message_serializer_1.MessageSerializer.toList(message, mediaUrl, this.r2);
      }
      toIntervalString(totalSeconds) {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor(totalSeconds % 3600 / 60);
        const s = totalSeconds % 60;
        return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
      }
      async resolveMediaUrl(message) {
        if (message.deletedAt || !message.mediaUrl)
          return message.mediaUrl;
        if (message.messageKind !== "photo" && message.messageKind !== "video") {
          return message.mediaUrl;
        }
        return this.r2.presignDownload(this.r2.extractStorageKey(message.mediaUrl));
      }
      async assertParticipant(tripId, userId) {
        const trip = await this.prisma.trip.findFirst({
          where: { id: tripId, participants: { some: { userId } } },
          select: { id: true }
        });
        if (!trip) {
          throw new common_1.NotFoundException({
            code: "TRIP_NOT_FOUND",
            message: "Trip not found or access denied"
          });
        }
        return trip;
      }
    };
    exports2.ChatService = ChatService;
    exports2.ChatService = ChatService = __decorate([
      (0, common_1.Injectable)(),
      __metadata("design:paramtypes", [
        prisma_service_1.PrismaService,
        r2_service_1.R2Service
      ])
    ], ChatService);
  }
});

// dist/trips/chat.controller.js
var require_chat_controller = __commonJS({
  "dist/trips/chat.controller.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = exports2 && exports2.__metadata || function(k, v) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var __param = exports2 && exports2.__param || function(paramIndex, decorator) {
      return function(target, key) {
        decorator(target, key, paramIndex);
      };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ChatController = void 0;
    var common_1 = require("@nestjs/common");
    var swagger_1 = require("@nestjs/swagger");
    var jwt_auth_guard_1 = require_jwt_auth_guard();
    var current_user_decorator_1 = require_current_user_decorator();
    var chat_service_1 = require_chat_service();
    var shared_validation_1 = require("@atur-perjalanan/shared-validation");
    var zod_validation_pipe_1 = require_zod_validation_pipe();
    var ChatController = class ChatController {
      constructor(chatService) {
        this.chatService = chatService;
      }
      async listMessages(tripId, user, cursor, limit) {
        return this.chatService.listMessages(tripId, user.userId, cursor, limit ? parseInt(limit, 10) : 20);
      }
      async createMessage(tripId, dto, user) {
        return this.chatService.createMessage(tripId, user.userId, dto);
      }
      async markRead(tripId, user) {
        return this.chatService.markRead(tripId, user.userId);
      }
      async deleteMessage(tripId, messageId, user) {
        return this.chatService.deleteMessage(tripId, messageId, user.userId);
      }
    };
    exports2.ChatController = ChatController;
    __decorate([
      (0, common_1.Get)(":tripId/messages"),
      (0, common_1.HttpCode)(common_1.HttpStatus.OK),
      __param(0, (0, common_1.Param)("tripId", common_1.ParseUUIDPipe)),
      __param(1, (0, current_user_decorator_1.CurrentUser)()),
      __param(2, (0, common_1.Query)("cursor")),
      __param(3, (0, common_1.Query)("limit")),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [String, Object, String, String]),
      __metadata("design:returntype", Promise)
    ], ChatController.prototype, "listMessages", null);
    __decorate([
      (0, common_1.Post)(":tripId/messages"),
      (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
      __param(0, (0, common_1.Param)("tripId", common_1.ParseUUIDPipe)),
      __param(1, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(shared_validation_1.CreateMessageSchema))),
      __param(2, (0, current_user_decorator_1.CurrentUser)()),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [String, Object, Object]),
      __metadata("design:returntype", Promise)
    ], ChatController.prototype, "createMessage", null);
    __decorate([
      (0, common_1.Put)(":tripId/messages/read"),
      (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
      __param(0, (0, common_1.Param)("tripId", common_1.ParseUUIDPipe)),
      __param(1, (0, current_user_decorator_1.CurrentUser)()),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [String, Object]),
      __metadata("design:returntype", Promise)
    ], ChatController.prototype, "markRead", null);
    __decorate([
      (0, common_1.Delete)(":tripId/messages/:messageId"),
      (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
      __param(0, (0, common_1.Param)("tripId", common_1.ParseUUIDPipe)),
      __param(1, (0, common_1.Param)("messageId", common_1.ParseUUIDPipe)),
      __param(2, (0, current_user_decorator_1.CurrentUser)()),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [String, String, Object]),
      __metadata("design:returntype", Promise)
    ], ChatController.prototype, "deleteMessage", null);
    exports2.ChatController = ChatController = __decorate([
      (0, swagger_1.ApiTags)("chat"),
      (0, swagger_1.ApiBearerAuth)(),
      (0, common_1.Controller)("trips"),
      (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
      __metadata("design:paramtypes", [chat_service_1.ChatService])
    ], ChatController);
  }
});

// dist/trips/serializers/document.serializer.js
var require_document_serializer = __commonJS({
  "dist/trips/serializers/document.serializer.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.DocumentSerializer = void 0;
    function durationToSeconds(duration) {
      if (!duration)
        return null;
      if (typeof duration === "string") {
        const parts = duration.split(":").map(Number);
        if (parts.length === 3) {
          const [h, m, s] = parts;
          return h * 3600 + m * 60 + s;
        }
      }
      return null;
    }
    var DocumentSerializer = class {
      static toList(doc, coverDocumentId, accessUrl, urlExpiresIn) {
        return {
          id: doc.id,
          trip_id: doc.tripId,
          uploaded_by: doc.uploadedBy,
          media_type: doc.mediaType,
          storage_key: doc.storageKey,
          url: accessUrl ?? doc.storageUrl,
          ...urlExpiresIn ? { url_expires_in: urlExpiresIn } : {},
          is_cover: doc.id === coverDocumentId,
          from_chat: doc.fromChat,
          media_duration_seconds: durationToSeconds(doc.mediaDuration),
          created_at: doc.createdAt.toISOString()
        };
      }
    };
    exports2.DocumentSerializer = DocumentSerializer;
  }
});

// dist/trips/media.service.js
var require_media_service = __commonJS({
  "dist/trips/media.service.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = exports2 && exports2.__metadata || function(k, v) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.MediaService = void 0;
    var common_1 = require("@nestjs/common");
    var prisma_service_1 = require_prisma_service();
    var r2_service_1 = require_r2_service();
    var document_serializer_1 = require_document_serializer();
    var MediaService = class MediaService {
      constructor(prisma, r2) {
        this.prisma = prisma;
        this.r2 = r2;
      }
      async presignUpload(userId, dto) {
        await this.assertParticipant(dto.trip_id, userId);
        return this.r2.presignUpload(dto.trip_id, dto.content_type);
      }
      async listDocuments(tripId, userId) {
        const trip = await this.assertParticipant(tripId, userId);
        const documents = await this.prisma.tripDocument.findMany({
          where: { tripId },
          orderBy: { createdAt: "desc" }
        });
        return {
          data: await Promise.all(documents.map((d) => this.toDocumentResponse(d, trip.coverDocumentId)))
        };
      }
      async createDocument(tripId, userId, dto) {
        await this.assertParticipant(tripId, userId);
        if (!dto.storage_key.startsWith(`trips/${tripId}/`)) {
          throw new common_1.BadRequestException({
            code: "INVALID_STORAGE_KEY",
            message: "storage_key does not belong to this trip"
          });
        }
        const head = await this.r2.headObject(dto.storage_key);
        if (!head.exists) {
          throw new common_1.BadRequestException({
            code: "OBJECT_NOT_FOUND",
            message: "Uploaded object not found in R2 \u2014 upload may still be in progress"
          });
        }
        const document = await this.prisma.tripDocument.create({
          data: {
            tripId,
            uploadedBy: userId,
            mediaType: dto.media_type,
            storageKey: dto.storage_key,
            storageUrl: this.r2.resolvePublicUrl(dto.storage_key),
            fromChat: false
          }
        });
        const trip = await this.prisma.trip.findFirst({
          where: { id: tripId },
          select: { coverDocumentId: true }
        });
        return this.toDocumentResponse(document, trip?.coverDocumentId ?? null);
      }
      async deleteDocument(tripId, documentId, userId) {
        const trip = await this.prisma.trip.findFirst({
          where: { id: tripId },
          select: { id: true, creatorId: true }
        });
        if (!trip) {
          throw new common_1.NotFoundException({ code: "TRIP_NOT_FOUND", message: "Trip not found" });
        }
        const document = await this.prisma.tripDocument.findFirst({
          where: { id: documentId, tripId }
        });
        if (!document) {
          throw new common_1.NotFoundException({
            code: "DOCUMENT_NOT_FOUND",
            message: "Document not found in this trip"
          });
        }
        const isUploader = document.uploadedBy === userId;
        const isCreator = trip.creatorId === userId;
        if (!isUploader && !isCreator) {
          throw new common_1.ForbiddenException({
            code: "NOT_DOCUMENT_OWNER",
            message: "Only the uploader or trip creator can delete this document"
          });
        }
        await this.prisma.$transaction(async (tx) => {
          await tx.trip.updateMany({
            where: { id: tripId, coverDocumentId: documentId },
            data: { coverDocumentId: null }
          });
          await tx.tripActivity.updateMany({
            where: { tripId, coverDocumentId: documentId },
            data: { coverDocumentId: null, coverSource: "none" }
          });
          await tx.tripDocument.delete({ where: { id: documentId } });
        });
      }
      async toDocumentResponse(doc, coverDocumentId) {
        const accessUrl = await this.r2.presignDownload(doc.storageKey);
        return document_serializer_1.DocumentSerializer.toList(doc, coverDocumentId, accessUrl, r2_service_1.PRESIGN_DOWNLOAD_EXPIRY_SECONDS);
      }
      async assertParticipant(tripId, userId) {
        const trip = await this.prisma.trip.findFirst({
          where: { id: tripId, participants: { some: { userId } } },
          select: { id: true, coverDocumentId: true }
        });
        if (!trip) {
          throw new common_1.NotFoundException({
            code: "TRIP_NOT_FOUND",
            message: "Trip not found or access denied"
          });
        }
        return trip;
      }
    };
    exports2.MediaService = MediaService;
    exports2.MediaService = MediaService = __decorate([
      (0, common_1.Injectable)(),
      __metadata("design:paramtypes", [
        prisma_service_1.PrismaService,
        r2_service_1.R2Service
      ])
    ], MediaService);
  }
});

// dist/trips/media.controller.js
var require_media_controller = __commonJS({
  "dist/trips/media.controller.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = exports2 && exports2.__metadata || function(k, v) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var __param = exports2 && exports2.__param || function(paramIndex, decorator) {
      return function(target, key) {
        decorator(target, key, paramIndex);
      };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.MediaController = void 0;
    var common_1 = require("@nestjs/common");
    var swagger_1 = require("@nestjs/swagger");
    var jwt_auth_guard_1 = require_jwt_auth_guard();
    var current_user_decorator_1 = require_current_user_decorator();
    var media_service_1 = require_media_service();
    var shared_validation_1 = require("@atur-perjalanan/shared-validation");
    var zod_validation_pipe_1 = require_zod_validation_pipe();
    var MediaController = class MediaController {
      constructor(mediaService) {
        this.mediaService = mediaService;
      }
      async listDocuments(tripId, user) {
        return this.mediaService.listDocuments(tripId, user.userId);
      }
      async createDocument(tripId, dto, user) {
        return this.mediaService.createDocument(tripId, user.userId, dto);
      }
      async deleteDocument(tripId, documentId, user) {
        return this.mediaService.deleteDocument(tripId, documentId, user.userId);
      }
    };
    exports2.MediaController = MediaController;
    __decorate([
      (0, common_1.Get)(":tripId/documents"),
      (0, common_1.HttpCode)(common_1.HttpStatus.OK),
      __param(0, (0, common_1.Param)("tripId", common_1.ParseUUIDPipe)),
      __param(1, (0, current_user_decorator_1.CurrentUser)()),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [String, Object]),
      __metadata("design:returntype", Promise)
    ], MediaController.prototype, "listDocuments", null);
    __decorate([
      (0, common_1.Post)(":tripId/documents"),
      (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
      __param(0, (0, common_1.Param)("tripId", common_1.ParseUUIDPipe)),
      __param(1, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(shared_validation_1.CreateDocumentSchema))),
      __param(2, (0, current_user_decorator_1.CurrentUser)()),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [String, Object, Object]),
      __metadata("design:returntype", Promise)
    ], MediaController.prototype, "createDocument", null);
    __decorate([
      (0, common_1.Delete)(":tripId/documents/:documentId"),
      (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
      __param(0, (0, common_1.Param)("tripId", common_1.ParseUUIDPipe)),
      __param(1, (0, common_1.Param)("documentId", common_1.ParseUUIDPipe)),
      __param(2, (0, current_user_decorator_1.CurrentUser)()),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [String, String, Object]),
      __metadata("design:returntype", Promise)
    ], MediaController.prototype, "deleteDocument", null);
    exports2.MediaController = MediaController = __decorate([
      (0, swagger_1.ApiTags)("media"),
      (0, swagger_1.ApiBearerAuth)(),
      (0, common_1.Controller)("trips"),
      (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
      __metadata("design:paramtypes", [media_service_1.MediaService])
    ], MediaController);
  }
});

// dist/trips/upload.controller.js
var require_upload_controller = __commonJS({
  "dist/trips/upload.controller.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = exports2 && exports2.__metadata || function(k, v) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var __param = exports2 && exports2.__param || function(paramIndex, decorator) {
      return function(target, key) {
        decorator(target, key, paramIndex);
      };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.UploadsController = void 0;
    var common_1 = require("@nestjs/common");
    var swagger_1 = require("@nestjs/swagger");
    var jwt_auth_guard_1 = require_jwt_auth_guard();
    var current_user_decorator_1 = require_current_user_decorator();
    var media_service_1 = require_media_service();
    var shared_validation_1 = require("@atur-perjalanan/shared-validation");
    var zod_validation_pipe_1 = require_zod_validation_pipe();
    var UploadsController = class UploadsController {
      constructor(mediaService) {
        this.mediaService = mediaService;
      }
      async presign(dto, user) {
        return this.mediaService.presignUpload(user.userId, dto);
      }
    };
    exports2.UploadsController = UploadsController;
    __decorate([
      (0, common_1.Post)("presign"),
      (0, common_1.HttpCode)(common_1.HttpStatus.OK),
      __param(0, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(shared_validation_1.PresignUploadSchema))),
      __param(1, (0, current_user_decorator_1.CurrentUser)()),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object, Object]),
      __metadata("design:returntype", Promise)
    ], UploadsController.prototype, "presign", null);
    exports2.UploadsController = UploadsController = __decorate([
      (0, swagger_1.ApiTags)("uploads"),
      (0, swagger_1.ApiBearerAuth)(),
      (0, common_1.Controller)("uploads"),
      (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
      __metadata("design:paramtypes", [media_service_1.MediaService])
    ], UploadsController);
  }
});

// dist/common/google-maps/google-maps.module.js
var require_google_maps_module = __commonJS({
  "dist/common/google-maps/google-maps.module.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.GoogleMapsModule = void 0;
    var common_1 = require("@nestjs/common");
    var google_maps_service_1 = require_google_maps_service();
    var GoogleMapsModule = class GoogleMapsModule {
    };
    exports2.GoogleMapsModule = GoogleMapsModule;
    exports2.GoogleMapsModule = GoogleMapsModule = __decorate([
      (0, common_1.Module)({
        providers: [google_maps_service_1.GoogleMapsService],
        exports: [google_maps_service_1.GoogleMapsService]
      })
    ], GoogleMapsModule);
  }
});

// dist/notifications/notifications.controller.js
var require_notifications_controller = __commonJS({
  "dist/notifications/notifications.controller.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = exports2 && exports2.__metadata || function(k, v) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var __param = exports2 && exports2.__param || function(paramIndex, decorator) {
      return function(target, key) {
        decorator(target, key, paramIndex);
      };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.NotificationsController = void 0;
    var common_1 = require("@nestjs/common");
    var swagger_1 = require("@nestjs/swagger");
    var jwt_auth_guard_1 = require_jwt_auth_guard();
    var current_user_decorator_1 = require_current_user_decorator();
    var notifications_service_1 = require_notifications_service();
    var NotificationsController = class NotificationsController {
      constructor(notificationsService) {
        this.notificationsService = notificationsService;
      }
      listNotifications(user, cursor, limit) {
        const rawLimit = limit ? parseInt(limit, 10) : 20;
        const safeLimit = Number.isNaN(rawLimit) ? 20 : Math.min(100, Math.max(1, rawLimit));
        return this.notificationsService.listNotifications(user.userId, cursor, safeLimit);
      }
      getUnreadCount(user) {
        return this.notificationsService.getUnreadCount(user.userId);
      }
      markAsRead(user, id) {
        return this.notificationsService.markAsRead(id, user.userId);
      }
      markAllAsRead(user) {
        return this.notificationsService.markAllAsRead(user.userId);
      }
    };
    exports2.NotificationsController = NotificationsController;
    __decorate([
      (0, common_1.Get)(),
      __param(0, (0, current_user_decorator_1.CurrentUser)()),
      __param(1, (0, common_1.Query)("cursor")),
      __param(2, (0, common_1.Query)("limit")),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object, String, String]),
      __metadata("design:returntype", void 0)
    ], NotificationsController.prototype, "listNotifications", null);
    __decorate([
      (0, common_1.Get)("unread-count"),
      __param(0, (0, current_user_decorator_1.CurrentUser)()),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object]),
      __metadata("design:returntype", void 0)
    ], NotificationsController.prototype, "getUnreadCount", null);
    __decorate([
      (0, common_1.Put)(":id/read"),
      (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
      __param(0, (0, current_user_decorator_1.CurrentUser)()),
      __param(1, (0, common_1.Param)("id")),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object, String]),
      __metadata("design:returntype", void 0)
    ], NotificationsController.prototype, "markAsRead", null);
    __decorate([
      (0, common_1.Put)("read-all"),
      (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
      __param(0, (0, current_user_decorator_1.CurrentUser)()),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object]),
      __metadata("design:returntype", void 0)
    ], NotificationsController.prototype, "markAllAsRead", null);
    exports2.NotificationsController = NotificationsController = __decorate([
      (0, swagger_1.ApiTags)("notifications"),
      (0, swagger_1.ApiBearerAuth)(),
      (0, common_1.Controller)("notifications"),
      (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
      __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
    ], NotificationsController);
  }
});

// dist/notifications/reminder-horizons.js
var require_reminder_horizons = __commonJS({
  "dist/notifications/reminder-horizons.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.REMINDER_ORDER = void 0;
    exports2.getReminderTargets = getReminderTargets;
    exports2.dueTarget = dueTarget;
    var FRACTIONS = {
      r1: 0.5,
      r2: 0.25
    };
    var MIN_LEAD_MS = {
      r1: 30 * 60 * 1e3,
      r2: 5 * 60 * 1e3
    };
    exports2.REMINDER_ORDER = ["r1", "r2"];
    var HOUR_MS = 60 * 60 * 1e3;
    function getReminderTargets(deadline, anchor = /* @__PURE__ */ new Date()) {
      const targets = [];
      const gap = deadline.getTime() - anchor.getTime();
      for (const type of exports2.REMINDER_ORDER) {
        const lead = Math.max(gap * FRACTIONS[type], MIN_LEAD_MS[type]);
        const at = new Date(deadline.getTime() - lead);
        if (at.getTime() >= anchor.getTime()) {
          targets.push({ type, at });
        }
      }
      return targets;
    }
    function dueTarget(targets, now) {
      const start = now.getTime();
      const end = start + HOUR_MS;
      for (const t of targets) {
        const atMs = t.at.getTime();
        if (atMs >= start && atMs < end)
          return t.type;
      }
      return null;
    }
  }
});

// dist/notifications/voting-reminder.service.js
var require_voting_reminder_service = __commonJS({
  "dist/notifications/voting-reminder.service.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = exports2 && exports2.__metadata || function(k, v) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var VotingReminderService_1;
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.VotingReminderService = void 0;
    var common_1 = require("@nestjs/common");
    var prisma_service_1 = require_prisma_service();
    var notifications_service_1 = require_notifications_service();
    var client_1 = require("@prisma/client");
    var reminder_horizons_1 = require_reminder_horizons();
    var VotingReminderService = VotingReminderService_1 = class VotingReminderService {
      constructor(prisma, notifications) {
        this.prisma = prisma;
        this.notifications = notifications;
        this.logger = new common_1.Logger(VotingReminderService_1.name);
      }
      async handleVotingReminders() {
        try {
          const now = /* @__PURE__ */ new Date();
          const lookahead = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1e3);
          const trips = await this.prisma.trip.findMany({
            where: {
              status: client_1.TripStatus.voting_pending,
              votingDeadline: {
                gte: now,
                lt: lookahead
              },
              deletedAt: null
            },
            include: {
              participants: {
                include: {
                  user: {
                    select: { id: true }
                  }
                }
              },
              dateCandidates: {
                include: {
                  votes: {
                    select: { userId: true }
                  }
                }
              },
              polls: {
                where: {
                  status: client_1.PollStatus.active,
                  pollType: client_1.PollType.tanggal
                },
                select: { id: true },
                take: 1
              }
            }
          });
          if (trips.length === 0)
            return;
          for (const trip of trips) {
            const deadline = trip.votingDeadline;
            const anchor = trip.updatedAt;
            if (deadline.getTime() < now.getTime())
              continue;
            const targets = (0, reminder_horizons_1.getReminderTargets)(deadline, anchor);
            const due = (0, reminder_horizons_1.dueTarget)(targets, now);
            if (!due)
              continue;
            await this.sendForTrip(trip, due);
          }
        } catch (error) {
          this.logger.error(`Failed to send voting reminders: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
      async sendForTrip(trip, reminderType) {
        const participantsToNotify = trip.participants.filter((participant) => {
          const hasVoted = trip.dateCandidates.some((candidate) => candidate.votes.some((vote) => vote.userId === participant.userId));
          return !hasVoted;
        });
        if (participantsToNotify.length === 0)
          return;
        const existing = await this.prisma.notification.findMany({
          where: {
            userId: { in: participantsToNotify.map((p) => p.userId) },
            tripId: trip.id,
            type: client_1.NotificationType.voting_deadline
          },
          select: { userId: true, payload: true }
        });
        const alreadyNotified = new Set(existing.filter((n) => n.payload?.reminder_type === reminderType).map((n) => n.userId));
        const recipients = participantsToNotify.filter((p) => !alreadyNotified.has(p.userId));
        if (recipients.length === 0)
          return;
        const pollId = trip.polls[0]?.id ?? null;
        await this.notifications.createManyNotifications(recipients.map((participant) => ({
          userId: participant.userId,
          type: client_1.NotificationType.voting_deadline,
          actorId: trip.creatorId,
          tripId: trip.id,
          payload: {
            reminder_type: reminderType,
            voting_deadline: trip.votingDeadline.toISOString(),
            poll_type: "tanggal",
            poll_id: pollId
          }
        })));
        this.logger.log(`Sent ${reminderType} voting reminders for ${recipients.length} user(s) in trip ${trip.id}`);
      }
    };
    exports2.VotingReminderService = VotingReminderService;
    exports2.VotingReminderService = VotingReminderService = VotingReminderService_1 = __decorate([
      (0, common_1.Injectable)(),
      __metadata("design:paramtypes", [
        prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService
      ])
    ], VotingReminderService);
  }
});

// dist/notifications/trip-start-reminder.service.js
var require_trip_start_reminder_service = __commonJS({
  "dist/notifications/trip-start-reminder.service.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = exports2 && exports2.__metadata || function(k, v) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var TripStartReminderService_1;
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.TripStartReminderService = void 0;
    var common_1 = require("@nestjs/common");
    var prisma_service_1 = require_prisma_service();
    var notifications_service_1 = require_notifications_service();
    var client_1 = require("@prisma/client");
    var reminder_horizons_1 = require_reminder_horizons();
    var TripStartReminderService = TripStartReminderService_1 = class TripStartReminderService {
      constructor(prisma, notifications) {
        this.prisma = prisma;
        this.notifications = notifications;
        this.logger = new common_1.Logger(TripStartReminderService_1.name);
      }
      async handleTripStartReminders() {
        try {
          const now = /* @__PURE__ */ new Date();
          const lookahead = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1e3);
          const trips = await this.prisma.trip.findMany({
            where: {
              status: client_1.TripStatus.fixed,
              deletedAt: null,
              startDate: {
                gte: now,
                lt: lookahead
              }
            },
            include: {
              participants: {
                include: {
                  user: { select: { id: true } }
                }
              }
            }
          });
          if (trips.length === 0)
            return;
          for (const trip of trips) {
            const startDatetime = this.tripStartDateTime(trip);
            if (!startDatetime)
              continue;
            if (startDatetime.getTime() < now.getTime())
              continue;
            const targets = (0, reminder_horizons_1.getReminderTargets)(startDatetime, trip.updatedAt);
            const due = (0, reminder_horizons_1.dueTarget)(targets, now);
            if (!due)
              continue;
            await this.sendForTrip(trip, startDatetime, due);
          }
        } catch (error) {
          this.logger.error(`Failed to send trip start reminders: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
      tripStartDateTime(trip) {
        if (!trip.startDate)
          return null;
        if (trip.isAllDay) {
          return /* @__PURE__ */ new Date(`${trip.startDate.toISOString().slice(0, 10)}T00:00:00.000Z`);
        }
        if (!trip.startTime)
          return null;
        const time = trip.startTime.toISOString().slice(11, 16);
        return /* @__PURE__ */ new Date(`${trip.startDate.toISOString().slice(0, 10)}T${time}:00.000Z`);
      }
      async sendForTrip(trip, startDatetime, reminderType) {
        const recipientIds = trip.participants.map((p) => p.userId);
        if (recipientIds.length === 0)
          return;
        const existing = await this.prisma.notification.findMany({
          where: {
            userId: { in: recipientIds },
            tripId: trip.id,
            type: client_1.NotificationType.trip_start_soon
          },
          select: { userId: true, payload: true }
        });
        const alreadyNotified = new Set(existing.filter((n) => n.payload?.reminder_type === reminderType).map((n) => n.userId));
        const recipients = recipientIds.filter((userId) => !alreadyNotified.has(userId));
        if (recipients.length === 0)
          return;
        await this.notifications.createManyNotifications(recipients.map((userId) => ({
          userId,
          type: client_1.NotificationType.trip_start_soon,
          actorId: trip.creatorId,
          tripId: trip.id,
          payload: {
            reminder_type: reminderType,
            start_datetime: startDatetime.toISOString(),
            is_all_day: trip.isAllDay,
            start_time: trip.startTime ? trip.startTime.toISOString().slice(11, 16) : null
          }
        })));
        this.logger.log(`Sent ${reminderType} trip start reminder for ${recipients.length} user(s) in trip ${trip.id}`);
      }
    };
    exports2.TripStartReminderService = TripStartReminderService;
    exports2.TripStartReminderService = TripStartReminderService = TripStartReminderService_1 = __decorate([
      (0, common_1.Injectable)(),
      __metadata("design:paramtypes", [
        prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService
      ])
    ], TripStartReminderService);
  }
});

// dist/notifications/reminders.controller.js
var require_reminders_controller = __commonJS({
  "dist/notifications/reminders.controller.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = exports2 && exports2.__metadata || function(k, v) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var __param = exports2 && exports2.__param || function(paramIndex, decorator) {
      return function(target, key) {
        decorator(target, key, paramIndex);
      };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.RemindersController = void 0;
    var common_1 = require("@nestjs/common");
    var config_1 = require("@nestjs/config");
    var voting_reminder_service_1 = require_voting_reminder_service();
    var trip_start_reminder_service_1 = require_trip_start_reminder_service();
    var RemindersController = class RemindersController {
      constructor(config, votingReminders, tripStartReminders) {
        this.config = config;
        this.votingReminders = votingReminders;
        this.tripStartReminders = tripStartReminders;
        this.cronSecret = this.config.get("cronSecret") ?? "";
      }
      async runAll(secret) {
        if (!this.cronSecret || secret !== this.cronSecret) {
          throw new common_1.UnauthorizedException({ code: "INVALID_CRON_SECRET" });
        }
        const [voting, tripStart] = await Promise.all([
          this.votingReminders.handleVotingReminders(),
          this.tripStartReminders.handleTripStartReminders()
        ]);
        return {
          ok: true,
          voting: voting ?? "done",
          trip_start: tripStart ?? "done"
        };
      }
    };
    exports2.RemindersController = RemindersController;
    __decorate([
      (0, common_1.Post)(),
      __param(0, (0, common_1.Headers)("x-cron-secret")),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [String]),
      __metadata("design:returntype", Promise)
    ], RemindersController.prototype, "runAll", null);
    exports2.RemindersController = RemindersController = __decorate([
      (0, common_1.Controller)("cron/reminders"),
      __metadata("design:paramtypes", [
        config_1.ConfigService,
        voting_reminder_service_1.VotingReminderService,
        trip_start_reminder_service_1.TripStartReminderService
      ])
    ], RemindersController);
  }
});

// dist/notifications/push-tokens.service.js
var require_push_tokens_service = __commonJS({
  "dist/notifications/push-tokens.service.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = exports2 && exports2.__metadata || function(k, v) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.PushTokensService = void 0;
    var common_1 = require("@nestjs/common");
    var prisma_service_1 = require_prisma_service();
    var PushTokensService = class PushTokensService {
      constructor(prisma) {
        this.prisma = prisma;
      }
      async register(userId, dto) {
        return this.prisma.pushToken.upsert({
          where: { userId_token: { userId, token: dto.token } },
          create: {
            userId,
            token: dto.token,
            platform: dto.platform
          },
          update: { platform: dto.platform }
        });
      }
      async unregister(userId, token) {
        await this.prisma.pushToken.deleteMany({
          where: { userId, token }
        });
      }
    };
    exports2.PushTokensService = PushTokensService;
    exports2.PushTokensService = PushTokensService = __decorate([
      (0, common_1.Injectable)(),
      __metadata("design:paramtypes", [prisma_service_1.PrismaService])
    ], PushTokensService);
  }
});

// dist/notifications/push-tokens.controller.js
var require_push_tokens_controller = __commonJS({
  "dist/notifications/push-tokens.controller.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = exports2 && exports2.__metadata || function(k, v) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var __param = exports2 && exports2.__param || function(paramIndex, decorator) {
      return function(target, key) {
        decorator(target, key, paramIndex);
      };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.PushTokensController = void 0;
    var common_1 = require("@nestjs/common");
    var swagger_1 = require("@nestjs/swagger");
    var class_validator_1 = require("class-validator");
    var jwt_auth_guard_1 = require_jwt_auth_guard();
    var current_user_decorator_1 = require_current_user_decorator();
    var push_tokens_service_1 = require_push_tokens_service();
    var RegisterPushTokenDto = class {
    };
    __decorate([
      (0, class_validator_1.IsString)(),
      __metadata("design:type", String)
    ], RegisterPushTokenDto.prototype, "token", void 0);
    __decorate([
      (0, class_validator_1.IsIn)(["ios", "android"]),
      __metadata("design:type", String)
    ], RegisterPushTokenDto.prototype, "platform", void 0);
    var PushTokensController = class PushTokensController {
      constructor(pushTokensService) {
        this.pushTokensService = pushTokensService;
      }
      register(user, dto) {
        return this.pushTokensService.register(user.userId, dto);
      }
      unregister(user, token) {
        return this.pushTokensService.unregister(user.userId, token);
      }
    };
    exports2.PushTokensController = PushTokensController;
    __decorate([
      (0, common_1.Post)(),
      __param(0, (0, current_user_decorator_1.CurrentUser)()),
      __param(1, (0, common_1.Body)()),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object, RegisterPushTokenDto]),
      __metadata("design:returntype", void 0)
    ], PushTokensController.prototype, "register", null);
    __decorate([
      (0, common_1.Delete)(":token"),
      (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
      __param(0, (0, current_user_decorator_1.CurrentUser)()),
      __param(1, (0, common_1.Param)("token")),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object, String]),
      __metadata("design:returntype", void 0)
    ], PushTokensController.prototype, "unregister", null);
    exports2.PushTokensController = PushTokensController = __decorate([
      (0, swagger_1.ApiTags)("push-tokens"),
      (0, swagger_1.ApiBearerAuth)(),
      (0, common_1.Controller)("push-tokens"),
      (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
      __metadata("design:paramtypes", [push_tokens_service_1.PushTokensService])
    ], PushTokensController);
  }
});

// dist/notifications/notifications.module.js
var require_notifications_module = __commonJS({
  "dist/notifications/notifications.module.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.NotificationsModule = void 0;
    var common_1 = require("@nestjs/common");
    var notifications_controller_1 = require_notifications_controller();
    var notifications_service_1 = require_notifications_service();
    var voting_reminder_service_1 = require_voting_reminder_service();
    var trip_start_reminder_service_1 = require_trip_start_reminder_service();
    var reminders_controller_1 = require_reminders_controller();
    var push_notifications_service_1 = require_push_notifications_service();
    var push_tokens_service_1 = require_push_tokens_service();
    var push_tokens_controller_1 = require_push_tokens_controller();
    var prisma_module_1 = require_prisma_module();
    var r2_module_1 = require_r2_module();
    var NotificationsModule = class NotificationsModule {
    };
    exports2.NotificationsModule = NotificationsModule;
    exports2.NotificationsModule = NotificationsModule = __decorate([
      (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, r2_module_1.R2Module],
        controllers: [notifications_controller_1.NotificationsController, push_tokens_controller_1.PushTokensController, reminders_controller_1.RemindersController],
        providers: [
          notifications_service_1.NotificationsService,
          voting_reminder_service_1.VotingReminderService,
          trip_start_reminder_service_1.TripStartReminderService,
          push_notifications_service_1.PushNotificationsService,
          push_tokens_service_1.PushTokensService
        ],
        exports: [notifications_service_1.NotificationsService]
      })
    ], NotificationsModule);
  }
});

// dist/trips/trips.module.js
var require_trips_module = __commonJS({
  "dist/trips/trips.module.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.TripsModule = void 0;
    var common_1 = require("@nestjs/common");
    var trips_controller_1 = require_trips_controller();
    var trips_service_1 = require_trips_service();
    var invitations_service_1 = require_invitations_service();
    var voting_service_1 = require_voting_service();
    var voting_controller_1 = require_voting_controller();
    var activity_service_1 = require_activity_service();
    var activity_controller_1 = require_activity_controller();
    var chat_service_1 = require_chat_service();
    var chat_controller_1 = require_chat_controller();
    var media_service_1 = require_media_service();
    var media_controller_1 = require_media_controller();
    var upload_controller_1 = require_upload_controller();
    var prisma_module_1 = require_prisma_module();
    var google_maps_module_1 = require_google_maps_module();
    var r2_module_1 = require_r2_module();
    var notifications_module_1 = require_notifications_module();
    var TripsModule = class TripsModule {
    };
    exports2.TripsModule = TripsModule;
    exports2.TripsModule = TripsModule = __decorate([
      (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, google_maps_module_1.GoogleMapsModule, r2_module_1.R2Module, notifications_module_1.NotificationsModule],
        controllers: [
          trips_controller_1.TripsController,
          voting_controller_1.VotingController,
          activity_controller_1.ActivityController,
          chat_controller_1.ChatController,
          media_controller_1.MediaController,
          upload_controller_1.UploadsController
        ],
        providers: [
          trips_service_1.TripsService,
          invitations_service_1.InvitationsService,
          voting_service_1.VotingService,
          activity_service_1.ActivityService,
          chat_service_1.ChatService,
          media_service_1.MediaService
        ],
        exports: [
          trips_service_1.TripsService,
          invitations_service_1.InvitationsService,
          voting_service_1.VotingService,
          activity_service_1.ActivityService,
          chat_service_1.ChatService,
          media_service_1.MediaService
        ]
      })
    ], TripsModule);
  }
});

// dist/wishlist/serializers/wishlist.serializer.js
var require_wishlist_serializer = __commonJS({
  "dist/wishlist/serializers/wishlist.serializer.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.WishlistSerializer = void 0;
    var date_helpers_1 = require_date_helpers();
    var WishlistSerializer = class {
      static toItem(wishlist) {
        return {
          id: wishlist.id,
          place_name: wishlist.placeName,
          start_time: (0, date_helpers_1.toTime)(wishlist.startTime),
          end_time: (0, date_helpers_1.toTime)(wishlist.endTime),
          location_label: wishlist.locationLabel,
          maps_link: wishlist.mapsLink,
          ref_links: wishlist.refLinks ?? [],
          notes: wishlist.notes,
          tags: wishlist.tags ?? [],
          priority_level: wishlist.priorityLevel,
          thumbnail_url: wishlist.thumbnailUrl,
          created_at: wishlist.createdAt.toISOString(),
          updated_at: wishlist.updatedAt.toISOString()
        };
      }
    };
    exports2.WishlistSerializer = WishlistSerializer;
  }
});

// dist/wishlist/wishlist-tags.js
var require_wishlist_tags = __commonJS({
  "dist/wishlist/wishlist-tags.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.normalizeWishlistTag = normalizeWishlistTag;
    exports2.normalizeWishlistTags = normalizeWishlistTags;
    function normalizeWishlistTag(raw) {
      const trimmed = raw.trim();
      if (!trimmed)
        return trimmed;
      const withoutHash = trimmed.startsWith("#") ? trimmed.slice(1) : trimmed;
      if (!withoutHash)
        return "#";
      const body = withoutHash.charAt(0).toUpperCase() + withoutHash.slice(1).toLowerCase();
      return `#${body}`;
    }
    function normalizeWishlistTags(tags) {
      if (tags === void 0)
        return void 0;
      const seen = /* @__PURE__ */ new Set();
      const result = [];
      for (const t of tags) {
        const n = normalizeWishlistTag(t);
        if (!n || n === "#" || seen.has(n))
          continue;
        seen.add(n);
        result.push(n);
      }
      return result;
    }
  }
});

// dist/wishlist/wishlist.service.js
var require_wishlist_service = __commonJS({
  "dist/wishlist/wishlist.service.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = exports2 && exports2.__metadata || function(k, v) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var WishlistService_1;
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.WishlistService = void 0;
    var common_1 = require("@nestjs/common");
    var prisma_service_1 = require_prisma_service();
    var trips_service_1 = require_trips_service();
    var wishlist_serializer_1 = require_wishlist_serializer();
    var date_helpers_1 = require_date_helpers();
    var google_maps_service_1 = require_google_maps_service();
    var r2_service_1 = require_r2_service();
    var wishlist_tags_1 = require_wishlist_tags();
    var client_1 = require("@prisma/client");
    var WishlistService = WishlistService_1 = class WishlistService {
      constructor(prisma, tripsService, googleMaps, r2) {
        this.prisma = prisma;
        this.tripsService = tripsService;
        this.googleMaps = googleMaps;
        this.r2 = r2;
        this.logger = new common_1.Logger(WishlistService_1.name);
      }
      async createWishlist(userId, dto) {
        const wishlist = await this.prisma.wishlist.create({
          data: {
            userId,
            placeName: dto.place_name,
            startTime: (0, date_helpers_1.toTimeDate)(dto.start_time),
            endTime: (0, date_helpers_1.toTimeDate)(dto.end_time),
            locationLabel: dto.location_label,
            mapsLink: dto.maps_link,
            refLinks: dto.ref_links ?? [],
            notes: dto.notes,
            tags: (0, wishlist_tags_1.normalizeWishlistTags)(dto.tags) ?? [],
            priorityLevel: dto.priority_level ?? "medium",
            thumbnailUrl: dto.thumbnail_url
          }
        });
        let thumbnailUrl = wishlist.thumbnailUrl;
        if (!thumbnailUrl) {
          thumbnailUrl = await this.resolveThumbnailNow(wishlist.id, dto.maps_link);
        }
        return wishlist_serializer_1.WishlistSerializer.toItem(thumbnailUrl ? { ...wishlist, thumbnailUrl } : wishlist);
      }
      async listWishlists(userId, options = {}) {
        const { priority, tag, cursor, limit = 20 } = options;
        const take = Math.min(limit, 100);
        const wishlists = await this.prisma.wishlist.findMany({
          where: {
            userId,
            deletedAt: null,
            ...priority ? { priorityLevel: priority } : {},
            ...tag ? { tags: { array_contains: [tag] } } : {},
            ...cursor ? { id: { lt: cursor } } : {}
          },
          orderBy: { createdAt: "desc" },
          take: take + 1
        });
        const hasMore = wishlists.length > take;
        const results = hasMore ? wishlists.slice(0, take) : wishlists;
        for (const w of results) {
          if (w.mapsLink && this.isFallbackThumbnail(w.thumbnailUrl)) {
            this.scheduleThumbnailResolve(w.id, w.mapsLink);
          }
        }
        return {
          data: results.map((w) => wishlist_serializer_1.WishlistSerializer.toItem(w)),
          next_cursor: hasMore ? results[results.length - 1]?.id ?? null : null
        };
      }
      isFallbackThumbnail(thumbnailUrl) {
        if (!thumbnailUrl)
          return true;
        return thumbnailUrl.startsWith("https://static-maps.yandex.ru/");
      }
      async updateWishlist(wishlistId, userId, dto) {
        const existing = await this.assertOwner(wishlistId, userId);
        const wishlist = await this.prisma.wishlist.update({
          where: { id: wishlistId },
          data: {
            placeName: dto.place_name,
            startTime: dto.start_time !== void 0 ? (0, date_helpers_1.toTimeDate)(dto.start_time) : void 0,
            endTime: dto.end_time !== void 0 ? (0, date_helpers_1.toTimeDate)(dto.end_time) : void 0,
            locationLabel: dto.location_label,
            mapsLink: dto.maps_link,
            refLinks: dto.ref_links,
            notes: dto.notes,
            tags: (0, wishlist_tags_1.normalizeWishlistTags)(dto.tags),
            priorityLevel: dto.priority_level,
            thumbnailUrl: dto.thumbnail_url
          }
        });
        const mapsLinkChanged = dto.maps_link !== void 0 && dto.maps_link !== existing.mapsLink;
        const needsResolve = !dto.thumbnail_url && (mapsLinkChanged || this.isFallbackThumbnail(existing.thumbnailUrl));
        let thumbnailUrl = wishlist.thumbnailUrl;
        if (needsResolve) {
          const resolved = await this.resolveThumbnailNow(wishlistId, dto.maps_link ?? existing.mapsLink);
          if (resolved)
            thumbnailUrl = resolved;
        }
        return wishlist_serializer_1.WishlistSerializer.toItem(thumbnailUrl ? { ...wishlist, thumbnailUrl } : wishlist);
      }
      async deleteWishlist(wishlistId, userId) {
        await this.assertOwner(wishlistId, userId);
        await this.prisma.wishlist.update({
          where: { id: wishlistId },
          data: { deletedAt: /* @__PURE__ */ new Date() }
        });
      }
      async convertToTrip(wishlistId, userId, dto) {
        const wishlist = await this.assertOwner(wishlistId, userId);
        const startDate = new Date(dto.start_date);
        const endDate = new Date(dto.end_date);
        if (startDate > endDate) {
          throw new common_1.BadRequestException({
            code: "INVALID_DATE_RANGE",
            message: "start_date must be on or before end_date"
          });
        }
        const isAllDay = dto.is_all_day ?? true;
        const TIME_HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;
        if (!isAllDay) {
          for (const [key, value] of [
            ["start_time", dto.start_time],
            ["end_time", dto.end_time]
          ]) {
            if (value !== void 0 && value !== null && !TIME_HHMM.test(String(value))) {
              throw new common_1.BadRequestException({
                code: "INVALID_TIME_FORMAT",
                message: `${key} must be in HH:MM format`
              });
            }
          }
        }
        const startTimeStr = !isAllDay && dto.start_time ? dto.start_time : void 0;
        const endTimeStr = !isAllDay && dto.end_time ? dto.end_time : void 0;
        const activityStart = startTimeStr ? (0, date_helpers_1.toTimeDate)(startTimeStr) : wishlist.startTime;
        const activityEnd = endTimeStr ? (0, date_helpers_1.toTimeDate)(endTimeStr) : wishlist.endTime;
        const tripStartTime = startTimeStr ? (0, date_helpers_1.toTimeDate)(startTimeStr) : null;
        const tripEndTime = endTimeStr ? (0, date_helpers_1.toTimeDate)(endTimeStr) : null;
        const trip = await this.prisma.$transaction(async (tx) => {
          const created = await tx.trip.create({
            data: {
              creatorId: userId,
              name: dto.trip_name ?? wishlist.placeName,
              tags: dto.tags ?? wishlist.tags ?? [],
              status: client_1.TripStatus.fixed,
              startDate,
              endDate,
              isAllDay,
              startTime: tripStartTime,
              endTime: tripEndTime
            }
          });
          await tx.tripParticipant.create({
            data: { tripId: created.id, userId }
          });
          await tx.tripActivity.create({
            data: {
              tripId: created.id,
              placeName: wishlist.placeName,
              activityDate: startDate,
              ...activityStart ? { startTime: activityStart } : {},
              ...activityEnd ? { endTime: activityEnd } : {},
              description: wishlist.notes,
              locationLabel: wishlist.locationLabel,
              mapsLink: wishlist.mapsLink ?? wishlist.link,
              refLinks: wishlist.refLinks ?? [],
              thumbnailUrl: wishlist.thumbnailUrl,
              coverSource: wishlist.thumbnailUrl ? "maps" : "none"
            }
          });
          await tx.wishlist.update({
            where: { id: wishlistId },
            data: { deletedAt: /* @__PURE__ */ new Date() }
          });
          return created;
        });
        if (wishlist.thumbnailUrl) {
          await this.importThumbnailToTripMedia(trip.id, userId, wishlist.thumbnailUrl).catch((err) => {
            this.logger.warn(`Import wishlist thumbnail to trip media failed for wishlist ${wishlistId}: ${err}`);
          });
        }
        return this.tripsService.getTripDetail(trip.id, userId);
      }
      async getWishlistTags(userId) {
        const wishlists = await this.prisma.wishlist.findMany({
          where: { userId, deletedAt: null },
          select: { tags: true }
        });
        const allTags = wishlists.flatMap((w) => w.tags ?? []);
        const uniqueTags = [...new Set(allTags)].sort();
        return { data: uniqueTags };
      }
      async assertOwner(wishlistId, userId) {
        const wishlist = await this.prisma.wishlist.findFirst({
          where: { id: wishlistId, deletedAt: null }
        });
        if (!wishlist) {
          throw new common_1.NotFoundException({
            code: "WISHLIST_NOT_FOUND",
            message: "Wishlist item not found"
          });
        }
        if (wishlist.userId !== userId) {
          throw new common_1.ForbiddenException({
            code: "WISHLIST_ACCESS_DENIED",
            message: "You do not have access to this wishlist item"
          });
        }
        return wishlist;
      }
      async resolveThumbnailNow(wishlistId, mapsLink) {
        if (!mapsLink)
          return null;
        try {
          const thumbnailUrl = await Promise.race([
            this.googleMaps.resolveThumbnailFromMapsLink(mapsLink),
            new Promise((resolve) => setTimeout(() => resolve(null), 1e4))
          ]);
          if (!thumbnailUrl)
            return null;
          await this.prisma.wishlist.update({
            where: { id: wishlistId },
            data: { thumbnailUrl }
          });
          return thumbnailUrl;
        } catch (err) {
          this.logger.warn(`Synchronous thumbnail resolve failed for wishlist ${wishlistId}: ${err}`);
          return null;
        }
      }
      scheduleThumbnailResolve(wishlistId, mapsLink) {
        if (!mapsLink)
          return;
        setImmediate(() => {
          this.resolveThumbnailInBackground(wishlistId, mapsLink).catch((err) => {
            this.logger.warn(`Thumbnail resolve failed for wishlist ${wishlistId}: ${err}`);
          });
        });
      }
      async resolveThumbnailInBackground(wishlistId, mapsLink) {
        const thumbnailUrl = await this.googleMaps.resolveThumbnailFromMapsLink(mapsLink);
        if (!thumbnailUrl)
          return;
        await this.prisma.wishlist.update({
          where: { id: wishlistId },
          data: { thumbnailUrl }
        });
      }
      async importThumbnailToTripMedia(tripId, uploaderId, thumbnailUrl) {
        const existing = await this.prisma.tripDocument.findFirst({
          where: { tripId, storageUrl: thumbnailUrl }
        });
        let documentId;
        if (existing) {
          documentId = existing.id;
        } else {
          const res = await fetch(thumbnailUrl);
          if (!res.ok)
            return;
          const buffer = Buffer.from(await res.arrayBuffer());
          const contentType = res.headers.get("content-type") ?? "image/jpeg";
          const { storageKey, storageUrl } = await this.r2.putObject(tripId, contentType, buffer);
          const document = await this.prisma.tripDocument.create({
            data: {
              tripId,
              uploadedBy: uploaderId,
              mediaType: "photo",
              storageKey,
              storageUrl,
              fromChat: false
            }
          });
          documentId = document.id;
        }
        await this.prisma.trip.update({
          where: { id: tripId },
          data: { coverDocumentId: documentId }
        });
        await this.prisma.tripActivity.updateMany({
          where: { tripId, dayNumber: 1 },
          data: {
            coverDocumentId: documentId,
            coverSource: "trip_media",
            thumbnailUrl: null
          }
        });
      }
    };
    exports2.WishlistService = WishlistService;
    exports2.WishlistService = WishlistService = WishlistService_1 = __decorate([
      (0, common_1.Injectable)(),
      __metadata("design:paramtypes", [
        prisma_service_1.PrismaService,
        trips_service_1.TripsService,
        google_maps_service_1.GoogleMapsService,
        r2_service_1.R2Service
      ])
    ], WishlistService);
  }
});

// dist/wishlist/wishlist.controller.js
var require_wishlist_controller = __commonJS({
  "dist/wishlist/wishlist.controller.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = exports2 && exports2.__metadata || function(k, v) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var __param = exports2 && exports2.__param || function(paramIndex, decorator) {
      return function(target, key) {
        decorator(target, key, paramIndex);
      };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.WishlistController = void 0;
    var common_1 = require("@nestjs/common");
    var swagger_1 = require("@nestjs/swagger");
    var jwt_auth_guard_1 = require_jwt_auth_guard();
    var current_user_decorator_1 = require_current_user_decorator();
    var wishlist_service_1 = require_wishlist_service();
    var shared_validation_1 = require("@atur-perjalanan/shared-validation");
    var zod_validation_pipe_1 = require_zod_validation_pipe();
    var WishlistController = class WishlistController {
      constructor(wishlistService) {
        this.wishlistService = wishlistService;
      }
      createWishlist(user, dto) {
        return this.wishlistService.createWishlist(user.userId, dto);
      }
      listWishlists(user, priority, tag, cursor, limit) {
        return this.wishlistService.listWishlists(user.userId, {
          priority,
          tag,
          cursor,
          limit: limit ? parseInt(limit, 10) : 20
        });
      }
      getWishlistTags(user) {
        return this.wishlistService.getWishlistTags(user.userId);
      }
      updateWishlist(user, id, dto) {
        return this.wishlistService.updateWishlist(id, user.userId, dto);
      }
      deleteWishlist(user, id) {
        return this.wishlistService.deleteWishlist(id, user.userId);
      }
      convertToTrip(user, id, dto) {
        return this.wishlistService.convertToTrip(id, user.userId, dto);
      }
    };
    exports2.WishlistController = WishlistController;
    __decorate([
      (0, common_1.Post)(),
      __param(0, (0, current_user_decorator_1.CurrentUser)()),
      __param(1, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(shared_validation_1.CreateWishlistSchema))),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object, Object]),
      __metadata("design:returntype", void 0)
    ], WishlistController.prototype, "createWishlist", null);
    __decorate([
      (0, common_1.Get)(),
      __param(0, (0, current_user_decorator_1.CurrentUser)()),
      __param(1, (0, common_1.Query)("priority")),
      __param(2, (0, common_1.Query)("tag")),
      __param(3, (0, common_1.Query)("cursor")),
      __param(4, (0, common_1.Query)("limit")),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object, String, String, String, String]),
      __metadata("design:returntype", void 0)
    ], WishlistController.prototype, "listWishlists", null);
    __decorate([
      (0, common_1.Get)("tags"),
      __param(0, (0, current_user_decorator_1.CurrentUser)()),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object]),
      __metadata("design:returntype", void 0)
    ], WishlistController.prototype, "getWishlistTags", null);
    __decorate([
      (0, common_1.Put)(":id"),
      __param(0, (0, current_user_decorator_1.CurrentUser)()),
      __param(1, (0, common_1.Param)("id")),
      __param(2, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(shared_validation_1.UpdateWishlistSchema))),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object, String, Object]),
      __metadata("design:returntype", void 0)
    ], WishlistController.prototype, "updateWishlist", null);
    __decorate([
      (0, common_1.Delete)(":id"),
      (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
      __param(0, (0, current_user_decorator_1.CurrentUser)()),
      __param(1, (0, common_1.Param)("id")),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object, String]),
      __metadata("design:returntype", void 0)
    ], WishlistController.prototype, "deleteWishlist", null);
    __decorate([
      (0, common_1.Post)(":id/convert-to-trip"),
      __param(0, (0, current_user_decorator_1.CurrentUser)()),
      __param(1, (0, common_1.Param)("id")),
      __param(2, (0, common_1.Body)(new zod_validation_pipe_1.ZodValidationPipe(shared_validation_1.ConvertToTripSchema))),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object, String, Object]),
      __metadata("design:returntype", void 0)
    ], WishlistController.prototype, "convertToTrip", null);
    exports2.WishlistController = WishlistController = __decorate([
      (0, swagger_1.ApiTags)("wishlists"),
      (0, swagger_1.ApiBearerAuth)(),
      (0, common_1.Controller)("wishlists"),
      (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
      __metadata("design:paramtypes", [wishlist_service_1.WishlistService])
    ], WishlistController);
  }
});

// dist/wishlist/wishlist.module.js
var require_wishlist_module = __commonJS({
  "dist/wishlist/wishlist.module.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.WishlistModule = void 0;
    var common_1 = require("@nestjs/common");
    var wishlist_controller_1 = require_wishlist_controller();
    var wishlist_service_1 = require_wishlist_service();
    var prisma_module_1 = require_prisma_module();
    var trips_module_1 = require_trips_module();
    var google_maps_module_1 = require_google_maps_module();
    var r2_module_1 = require_r2_module();
    var WishlistModule = class WishlistModule {
    };
    exports2.WishlistModule = WishlistModule;
    exports2.WishlistModule = WishlistModule = __decorate([
      (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, trips_module_1.TripsModule, google_maps_module_1.GoogleMapsModule, r2_module_1.R2Module],
        controllers: [wishlist_controller_1.WishlistController],
        providers: [wishlist_service_1.WishlistService],
        exports: [wishlist_service_1.WishlistService]
      })
    ], WishlistModule);
  }
});

// dist/mail/mail.module.js
var require_mail_module = __commonJS({
  "dist/mail/mail.module.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.MailModule = void 0;
    var common_1 = require("@nestjs/common");
    var mail_service_1 = require_mail_service();
    var MailModule = class MailModule {
    };
    exports2.MailModule = MailModule;
    exports2.MailModule = MailModule = __decorate([
      (0, common_1.Global)(),
      (0, common_1.Module)({
        providers: [mail_service_1.MailService],
        exports: [mail_service_1.MailService]
      })
    ], MailModule);
  }
});

// dist/integrations/google/google-calendar.service.js
var require_google_calendar_service = __commonJS({
  "dist/integrations/google/google-calendar.service.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = exports2 && exports2.__metadata || function(k, v) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var GoogleCalendarService_1;
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.GoogleCalendarService = void 0;
    var common_1 = require("@nestjs/common");
    var config_1 = require("@nestjs/config");
    var google_auth_library_1 = require("google-auth-library");
    var prisma_service_1 = require_prisma_service();
    var CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar.events";
    var CALENDAR_API_BASE = "https://www.googleapis.com/calendar/v3";
    var CALLBACK_PATH = "/v1/integrations/google-calendar/callback";
    var GoogleCalendarService = GoogleCalendarService_1 = class GoogleCalendarService {
      constructor(prisma, config) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(GoogleCalendarService_1.name);
        this.clientId = config.get("google.calendarClientId") ?? "";
        this.clientSecret = config.get("google.calendarClientSecret") ?? "";
        this.appWebUrl = config.get("app.webUrl") ?? "http://localhost:8081";
        this.oauth = new google_auth_library_1.OAuth2Client({
          clientId: this.clientId,
          clientSecret: this.clientSecret,
          redirectUri: this.redirectUri()
        });
      }
      redirectUri() {
        const backendUrl = process.env.BACKEND_URL;
        if (backendUrl) {
          return `${backendUrl.replace(/\/+$/, "")}${CALLBACK_PATH}`;
        }
        const port = process.env.PORT ?? "8080";
        return `http://localhost:${port}${CALLBACK_PATH}`;
      }
      get configured() {
        return !!this.clientId && !!this.clientSecret;
      }
      async buildAuthUrl(userId, redirect = "/") {
        if (!this.configured) {
          throw new common_1.BadRequestException({
            code: "CALENDAR_NOT_CONFIGURED",
            message: "Google Calendar integration is not configured on the server"
          });
        }
        const user = await this.prisma.user.findUnique({
          where: { id: userId },
          select: { email: true }
        });
        const state = Buffer.from(JSON.stringify({ userId, redirect })).toString("base64url");
        return this.oauth.generateAuthUrl({
          access_type: "offline",
          prompt: "consent",
          scope: CALENDAR_SCOPE,
          state,
          ...user?.email ? { login_hint: user.email } : {}
        });
      }
      async handleCallback(code, state) {
        let userId;
        let redirect = "/";
        try {
          const parsed = JSON.parse(Buffer.from(state, "base64url").toString());
          userId = parsed.userId;
          redirect = parsed.redirect || "/";
        } catch {
          throw new common_1.BadRequestException({ code: "INVALID_OAUTH_STATE", message: "Invalid OAuth state" });
        }
        const { tokens } = await this.oauth.getToken(code);
        if (!tokens.access_token) {
          throw new common_1.BadRequestException({
            code: "OAUTH_NO_ACCESS_TOKEN",
            message: "Google did not return an access token"
          });
        }
        await this.prisma.user.update({
          where: { id: userId },
          data: {
            googleAccessToken: tokens.access_token,
            googleRefreshToken: tokens.refresh_token ?? null,
            googleTokenExpiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null
          }
        });
        const redirectUrl = redirect.startsWith("http://") || redirect.startsWith("https://") || redirect.startsWith("aturperjalanan://") ? redirect : `${this.appWebUrl}${redirect}`;
        return { redirectUrl };
      }
      async isConnected(userId) {
        const user = await this.prisma.user.findFirst({
          where: { id: userId },
          select: { googleAccessToken: true, googleRefreshToken: true }
        });
        return !!user?.googleAccessToken;
      }
      async getAccessToken(userId) {
        const user = await this.prisma.user.findFirst({
          where: { id: userId },
          select: {
            googleAccessToken: true,
            googleRefreshToken: true,
            googleTokenExpiresAt: true
          }
        });
        if (!user?.googleAccessToken) {
          throw new common_1.UnauthorizedException({
            code: "CALENDAR_NOT_CONNECTED",
            message: "Google Calendar belum dihubungkan. Silakan hubungkan dulu."
          });
        }
        const tokens = {
          accessToken: user.googleAccessToken,
          refreshToken: user.googleRefreshToken,
          expiresAt: user.googleTokenExpiresAt
        };
        const expired = !tokens.expiresAt || tokens.expiresAt.getTime() <= Date.now() + 6e4;
        if (expired) {
          if (!tokens.refreshToken) {
            throw new common_1.UnauthorizedException({
              code: "CALENDAR_TOKEN_EXPIRED",
              message: "Sesi Google Calendar sudah berakhir. Hubungkan ulang."
            });
          }
          this.oauth.setCredentials({ refresh_token: tokens.refreshToken });
          const { credentials } = await this.oauth.refreshAccessToken();
          if (!credentials.access_token) {
            throw new common_1.UnauthorizedException({
              code: "CALENDAR_REFRESH_FAILED",
              message: "Gagal memperbarui sesi Google Calendar. Hubungkan ulang."
            });
          }
          await this.prisma.user.update({
            where: { id: userId },
            data: {
              googleAccessToken: credentials.access_token,
              googleTokenExpiresAt: credentials.expiry_date ? new Date(credentials.expiry_date) : null
            }
          });
          return credentials.access_token;
        }
        return tokens.accessToken;
      }
      async createEvent(userId, trip) {
        if (!trip.startDate) {
          throw new common_1.BadRequestException({
            code: "TRIP_NO_DATE",
            message: "Perjalanan belum memiliki tanggal"
          });
        }
        const accessToken = await this.getAccessToken(userId);
        const endDate = trip.endDate ?? trip.startDate;
        let event;
        if (trip.isAllDay) {
          event = {
            summary: trip.name,
            start: { date: trip.startDate },
            end: { date: this.addDays(endDate, 1) }
          };
        } else {
          const startDateTime = this.combineDateTime(trip.startDate, trip.startTime ?? "09:00");
          const endDateTime = this.combineDateTime(endDate, trip.endTime ?? "10:00");
          event = {
            summary: trip.name,
            start: { dateTime: startDateTime, timeZone: "Asia/Jakarta" },
            end: { dateTime: endDateTime, timeZone: "Asia/Jakarta" }
          };
        }
        if (trip.tags?.length) {
          event.summary = `${trip.name} \xB7 ${trip.tags.slice(0, 3).join(" ")}`;
        }
        const descriptionParts = [];
        if (trip.description)
          descriptionParts.push(trip.description);
        if (trip.itinerary)
          descriptionParts.push(trip.itinerary);
        if (descriptionParts.length) {
          event.description = descriptionParts.join("\n\n");
        }
        if (trip.location) {
          event.location = trip.location;
        }
        if (trip.attendees?.length) {
          event.attendees = trip.attendees.map((email) => ({ email }));
          event.guestsCanModify = true;
          event.guestsCanSeeGuests = true;
        }
        const res = await fetch(`${CALENDAR_API_BASE}/calendars/primary/events`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(event)
        });
        if (!res.ok) {
          const body = await res.text();
          this.logger.error(`Google Calendar API error ${res.status}: ${body}`);
          throw new common_1.BadRequestException({
            code: "GOOGLE_CALENDAR_ERROR",
            message: "Gagal menambahkan event ke Google Calendar"
          });
        }
        const data = await res.json();
        return { id: data.id, html_link: data.htmlLink ?? null };
      }
      addDays(dateStr, days) {
        const [y, m, d] = dateStr.split("-").map(Number);
        const dt = new Date(y, m - 1, d + days);
        const yy = dt.getFullYear();
        const mm = String(dt.getMonth() + 1).padStart(2, "0");
        const dd = String(dt.getDate()).padStart(2, "0");
        return `${yy}-${mm}-${dd}`;
      }
      combineDateTime(dateStr, timeStr) {
        return `${dateStr}T${timeStr}:00`;
      }
    };
    exports2.GoogleCalendarService = GoogleCalendarService;
    exports2.GoogleCalendarService = GoogleCalendarService = GoogleCalendarService_1 = __decorate([
      (0, common_1.Injectable)(),
      __metadata("design:paramtypes", [
        prisma_service_1.PrismaService,
        config_1.ConfigService
      ])
    ], GoogleCalendarService);
  }
});

// dist/integrations/google/google-calendar.controller.js
var require_google_calendar_controller = __commonJS({
  "dist/integrations/google/google-calendar.controller.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = exports2 && exports2.__metadata || function(k, v) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var __param = exports2 && exports2.__param || function(paramIndex, decorator) {
      return function(target, key) {
        decorator(target, key, paramIndex);
      };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.GoogleCalendarController = void 0;
    var common_1 = require("@nestjs/common");
    var swagger_1 = require("@nestjs/swagger");
    var jwt_auth_guard_1 = require_jwt_auth_guard();
    var current_user_decorator_1 = require_current_user_decorator();
    var google_calendar_service_1 = require_google_calendar_service();
    var prisma_service_1 = require_prisma_service();
    var GoogleCalendarController = class GoogleCalendarController {
      constructor(googleCalendar, prisma) {
        this.googleCalendar = googleCalendar;
        this.prisma = prisma;
      }
      async getStatus(user) {
        const connected = await this.googleCalendar.isConnected(user.userId);
        return { connected };
      }
      async getAuthUrl(user, redirect) {
        const authUrl = await this.googleCalendar.buildAuthUrl(user.userId, redirect || "/");
        return { auth_url: authUrl };
      }
      async callback(code, state, res) {
        if (!code || !state) {
          throw new common_1.BadRequestException({ code: "MISSING_OAUTH_PARAMS", message: "Missing code/state" });
        }
        const { redirectUrl } = await this.googleCalendar.handleCallback(code, state);
        res.redirect(redirectUrl);
        return;
      }
      async createEvent(user, body) {
        if (!body.trip_id) {
          throw new common_1.BadRequestException({ code: "TRIP_ID_REQUIRED", message: "trip_id wajib diisi" });
        }
        const trip = await this.prisma.trip.findFirst({
          where: { id: body.trip_id, deletedAt: null },
          select: {
            id: true,
            name: true,
            status: true,
            startDate: true,
            endDate: true,
            isAllDay: true,
            startTime: true,
            endTime: true,
            tags: true,
            creator: { select: { name: true, email: true } },
            participants: {
              include: { user: { select: { name: true, email: true } } }
            },
            activities: {
              orderBy: [{ dayNumber: "asc" }, { startTime: "asc" }],
              select: {
                placeName: true,
                locationLabel: true,
                mapsLink: true,
                dayNumber: true,
                startTime: true,
                endTime: true
              }
            }
          }
        });
        if (!trip) {
          throw new common_1.BadRequestException({ code: "TRIP_NOT_FOUND", message: "Perjalanan tidak ditemukan" });
        }
        if (trip.status !== "fixed") {
          throw new common_1.BadRequestException({
            code: "TRIP_DATE_NOT_FIXED",
            message: "Tanggal perjalanan belum dikunci. Tambahkan ke kalender setelah tanggal diputuskan."
          });
        }
        const tags = trip.tags ?? [];
        const participantNames = trip.participants.map((p) => p.user.name).filter((n) => Boolean(n));
        const creatorName = trip.creator?.name;
        const dateLabel = trip.startDate ? `${this.toDateOnly(trip.startDate)}${trip.endDate && this.toDateOnly(trip.endDate) !== this.toDateOnly(trip.startDate) ? ` s/d ${this.toDateOnly(trip.endDate)}` : ""}` : "";
        const who = [creatorName ? `Dibuat oleh: ${creatorName}` : null, participantNames.length ? `Peserta: ${participantNames.join(", ")}` : null].filter(Boolean).join("\n");
        const description = [who, dateLabel ? `Tanggal: ${dateLabel}` : null, tags.length ? `Tag: ${tags.join(" ")}` : null].filter(Boolean).join("\n");
        const locationActivity = trip.activities.find((a) => a.locationLabel || a.mapsLink);
        const location = locationActivity ? locationActivity.locationLabel ?? locationActivity.mapsLink ?? null : null;
        const byDay = /* @__PURE__ */ new Map();
        for (const a of trip.activities) {
          const d = a.dayNumber ?? 1;
          if (!byDay.has(d))
            byDay.set(d, []);
          byDay.get(d).push(a);
        }
        const itineraryLines = [];
        for (const [day, acts] of [...byDay.entries()].sort((a, b) => a[0] - b[0])) {
          const time = (a) => a.startTime ? this.toTime(a.startTime) : "";
          const actsStr = acts.map((a) => `${time(a)} ${a.placeName}${a.locationLabel ? ` (${a.locationLabel})` : ""}`).join("\n");
          itineraryLines.push(`Hari ${day}:
${actsStr}`);
        }
        return this.googleCalendar.createEvent(user.userId, {
          name: trip.name,
          startDate: trip.startDate ? this.toDateOnly(trip.startDate) : null,
          endDate: trip.endDate ? this.toDateOnly(trip.endDate) : null,
          isAllDay: trip.isAllDay,
          startTime: trip.startTime ? this.toTime(trip.startTime) : null,
          endTime: trip.endTime ? this.toTime(trip.endTime) : null,
          tags,
          description,
          location,
          attendees: trip.participants.map((p) => p.user.email).filter((e) => Boolean(e)),
          itinerary: itineraryLines.length ? itineraryLines.join("\n\n") : void 0
        });
      }
      toDateOnly(d) {
        return d.toISOString().slice(0, 10);
      }
      toTime(d) {
        const h = String(d.getUTCHours()).padStart(2, "0");
        const m = String(d.getUTCMinutes()).padStart(2, "0");
        return `${h}:${m}`;
      }
    };
    exports2.GoogleCalendarController = GoogleCalendarController;
    __decorate([
      (0, common_1.Get)("status"),
      (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
      (0, swagger_1.ApiBearerAuth)(),
      __param(0, (0, current_user_decorator_1.CurrentUser)()),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object]),
      __metadata("design:returntype", Promise)
    ], GoogleCalendarController.prototype, "getStatus", null);
    __decorate([
      (0, common_1.Get)("auth-url"),
      (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
      (0, swagger_1.ApiBearerAuth)(),
      __param(0, (0, current_user_decorator_1.CurrentUser)()),
      __param(1, (0, common_1.Query)("redirect")),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object, String]),
      __metadata("design:returntype", Promise)
    ], GoogleCalendarController.prototype, "getAuthUrl", null);
    __decorate([
      (0, common_1.Get)("callback"),
      __param(0, (0, common_1.Query)("code")),
      __param(1, (0, common_1.Query)("state")),
      __param(2, (0, common_1.Res)()),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object, Object, Object]),
      __metadata("design:returntype", Promise)
    ], GoogleCalendarController.prototype, "callback", null);
    __decorate([
      (0, common_1.Post)("events"),
      (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
      (0, swagger_1.ApiBearerAuth)(),
      __param(0, (0, current_user_decorator_1.CurrentUser)()),
      __param(1, (0, common_1.Body)()),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", [Object, Object]),
      __metadata("design:returntype", Promise)
    ], GoogleCalendarController.prototype, "createEvent", null);
    exports2.GoogleCalendarController = GoogleCalendarController = __decorate([
      (0, swagger_1.ApiTags)("integrations/google-calendar"),
      (0, common_1.Controller)("integrations/google-calendar"),
      __metadata("design:paramtypes", [
        google_calendar_service_1.GoogleCalendarService,
        prisma_service_1.PrismaService
      ])
    ], GoogleCalendarController);
  }
});

// dist/integrations/google/google.module.js
var require_google_module = __commonJS({
  "dist/integrations/google/google.module.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.GoogleCalendarModule = void 0;
    var common_1 = require("@nestjs/common");
    var prisma_module_1 = require_prisma_module();
    var google_calendar_service_1 = require_google_calendar_service();
    var google_calendar_controller_1 = require_google_calendar_controller();
    var GoogleCalendarModule = class GoogleCalendarModule {
    };
    exports2.GoogleCalendarModule = GoogleCalendarModule;
    exports2.GoogleCalendarModule = GoogleCalendarModule = __decorate([
      (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [google_calendar_controller_1.GoogleCalendarController],
        providers: [google_calendar_service_1.GoogleCalendarService],
        exports: [google_calendar_service_1.GoogleCalendarService]
      })
    ], GoogleCalendarModule);
  }
});

// dist/health.controller.js
var require_health_controller = __commonJS({
  "dist/health.controller.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = exports2 && exports2.__metadata || function(k, v) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.HealthController = void 0;
    var common_1 = require("@nestjs/common");
    var throttler_1 = require("@nestjs/throttler");
    var HealthController = class HealthController {
      check() {
        return { status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() };
      }
    };
    exports2.HealthController = HealthController;
    __decorate([
      (0, common_1.Get)(),
      (0, throttler_1.SkipThrottle)(),
      __metadata("design:type", Function),
      __metadata("design:paramtypes", []),
      __metadata("design:returntype", void 0)
    ], HealthController.prototype, "check", null);
    exports2.HealthController = HealthController = __decorate([
      (0, common_1.Controller)("health")
    ], HealthController);
  }
});

// dist/app.module.js
var require_app_module = __commonJS({
  "dist/app.module.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __importDefault2 = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.AppModule = void 0;
    var common_1 = require("@nestjs/common");
    var config_1 = require("@nestjs/config");
    var throttler_1 = require("@nestjs/throttler");
    var configuration_1 = __importDefault2(require_configuration());
    var prisma_module_1 = require_prisma_module();
    var auth_module_1 = require_auth_module();
    var users_module_1 = require_users_module();
    var trips_module_1 = require_trips_module();
    var wishlist_module_1 = require_wishlist_module();
    var notifications_module_1 = require_notifications_module();
    var mail_module_1 = require_mail_module();
    var google_module_1 = require_google_module();
    var health_controller_1 = require_health_controller();
    var AppModule = class AppModule {
    };
    exports2.AppModule = AppModule;
    exports2.AppModule = AppModule = __decorate([
      (0, common_1.Module)({
        imports: [
          config_1.ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration_1.default]
          }),
          throttler_1.ThrottlerModule.forRoot([
            {
              ttl: 6e4,
              limit: 120
            }
          ]),
          mail_module_1.MailModule,
          prisma_module_1.PrismaModule,
          auth_module_1.AuthModule,
          users_module_1.UsersModule,
          trips_module_1.TripsModule,
          wishlist_module_1.WishlistModule,
          notifications_module_1.NotificationsModule,
          google_module_1.GoogleCalendarModule
        ],
        controllers: [health_controller_1.HealthController]
      })
    ], AppModule);
  }
});

// dist/common/filters/http-exception.filter.js
var require_http_exception_filter = __commonJS({
  "dist/common/filters/http-exception.filter.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var HttpExceptionFilter_1;
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.HttpExceptionFilter = void 0;
    var common_1 = require("@nestjs/common");
    function isPrismaKnownRequestError(error) {
      return typeof error === "object" && error !== null && "code" in error && error.name === "PrismaClientKnownRequestError";
    }
    var HttpExceptionFilter = HttpExceptionFilter_1 = class HttpExceptionFilter {
      constructor() {
        this.logger = new common_1.Logger(HttpExceptionFilter_1.name);
      }
      catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let code = "INTERNAL_SERVER_ERROR";
        let message = "An unexpected error occurred";
        if (exception instanceof common_1.HttpException) {
          status = exception.getStatus();
          const exceptionResponse = exception.getResponse();
          if (typeof exceptionResponse === "object" && exceptionResponse !== null) {
            const resp = exceptionResponse;
            message = Array.isArray(resp["message"]) ? resp["message"].join("; ") : resp["message"] ?? message;
            code = resp["code"] ?? this.statusToCode(status);
          } else if (typeof exceptionResponse === "string") {
            message = exceptionResponse;
            code = this.statusToCode(status);
          }
        } else if (isPrismaKnownRequestError(exception) && exception.code === "P2025") {
          status = common_1.HttpStatus.NOT_FOUND;
          code = "NOT_FOUND";
          message = "Resource not found";
        } else {
          this.logger.error(`Unhandled exception on ${request.method} ${request.url}`, exception instanceof Error ? exception.stack : String(exception));
        }
        response.status(status).json({
          error: {
            code,
            message
          },
          requestId: request.requestId
        });
      }
      statusToCode(status) {
        const map = {
          400: "BAD_REQUEST",
          401: "UNAUTHORIZED",
          403: "FORBIDDEN",
          404: "NOT_FOUND",
          409: "CONFLICT",
          422: "UNPROCESSABLE_ENTITY",
          429: "TOO_MANY_REQUESTS",
          500: "INTERNAL_SERVER_ERROR"
        };
        return map[status] ?? "UNKNOWN_ERROR";
      }
    };
    exports2.HttpExceptionFilter = HttpExceptionFilter;
    exports2.HttpExceptionFilter = HttpExceptionFilter = HttpExceptionFilter_1 = __decorate([
      (0, common_1.Catch)()
    ], HttpExceptionFilter);
  }
});

// dist/common/interceptors/request-id.interceptor.js
var require_request_id_interceptor = __commonJS({
  "dist/common/interceptors/request-id.interceptor.js"(exports2) {
    "use strict";
    var __decorate = exports2 && exports2.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.RequestIdInterceptor = void 0;
    var common_1 = require("@nestjs/common");
    var crypto_1 = require("crypto");
    var RequestIdInterceptor = class RequestIdInterceptor {
      intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        request.requestId = request.headers["x-request-id"] ?? (0, crypto_1.randomUUID)();
        return next.handle();
      }
    };
    exports2.RequestIdInterceptor = RequestIdInterceptor;
    exports2.RequestIdInterceptor = RequestIdInterceptor = __decorate([
      (0, common_1.Injectable)()
    ], RequestIdInterceptor);
  }
});

// dist/main.js
var require_main = __commonJS({
  "dist/main.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createApp = createApp;
    var core_1 = require("@nestjs/core");
    var common_1 = require("@nestjs/common");
    var swagger_1 = require("@nestjs/swagger");
    var app_module_1 = require_app_module();
    var http_exception_filter_1 = require_http_exception_filter();
    var request_id_interceptor_1 = require_request_id_interceptor();
    async function createApp(adapter) {
      const app2 = adapter ? await core_1.NestFactory.create(app_module_1.AppModule, adapter) : await core_1.NestFactory.create(app_module_1.AppModule);
      app2.setGlobalPrefix("v1");
      app2.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
      }));
      app2.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
      app2.useGlobalInterceptors(new request_id_interceptor_1.RequestIdInterceptor());
      const appWebUrl = process.env.APP_WEB_URL ?? "http://localhost:8081";
      app2.enableCors({
        origin: process.env.APP_ENV === "production" ? [appWebUrl] : true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "x-request-id"]
      });
      if (process.env.APP_ENV !== "production") {
        const config = new swagger_1.DocumentBuilder().setTitle("Atur Perjalanan API").setVersion("1.0").addBearerAuth().build();
        const document = swagger_1.SwaggerModule.createDocument(app2, config);
        swagger_1.SwaggerModule.setup("docs", app2, document);
      }
      return app2;
    }
    async function bootstrap() {
      const app2 = await createApp();
      const port = process.env.PORT ?? 8080;
      await app2.listen(port);
      console.log(`\u{1F680} Server running on http://localhost:${port}/v1`);
    }
    if (process.env.VERCEL !== "1") {
      bootstrap();
    }
  }
});

// dist/vercel-handler.js
var __importDefault = exports && exports.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
process.env.VERCEL = "1";
var express_1 = __importDefault(require("express"));
var main_1 = require_main();
var platform_express_1 = require("@nestjs/platform-express");
var expressApp = (0, express_1.default)();
var app = null;
async function getApp() {
  if (app)
    return app;
  const instance = await (0, main_1.createApp)(new platform_express_1.ExpressAdapter(expressApp));
  await instance.init();
  app = instance;
  return app;
}
async function handler(req, res) {
  const bodyReq = req;
  if (bodyReq.body !== void 0 && typeof bodyReq.body === "object") {
    bodyReq._body = true;
  }
  await getApp();
  expressApp(req, res);
}
