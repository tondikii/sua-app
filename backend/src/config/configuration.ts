export default () => ({
  port: parseInt(process.env.PORT ?? '8080', 10),
  appEnv: process.env.APP_ENV ?? 'development',
  app: {
    webUrl: process.env.APP_WEB_URL ?? 'http://localhost:8081',
  },

  database: {
    url: process.env.DATABASE_URL,
    directUrl: process.env.DIRECT_URL,
  },

  supabase: {
    url: process.env.SUPABASE_URL,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    jwtSecret: process.env.SUPABASE_JWT_SECRET,
    anonKey: process.env.SUPABASE_ANON_KEY,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '24h',
  },

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    mapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    calendarClientId: process.env.GOOGLE_CALENDAR_CLIENT_ID,
    calendarClientSecret: process.env.GOOGLE_CALENDAR_CLIENT_SECRET,
  },

  r2: {
    accountId: process.env.R2_ACCOUNT_ID,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    bucketName: process.env.R2_BUCKET_NAME,
    publicUrl: process.env.R2_PUBLIC_URL,
  },

  mail: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.MAIL_FROM,
  },

  expo: {
    accessToken: process.env.EXPO_ACCESS_TOKEN,
  },
});
