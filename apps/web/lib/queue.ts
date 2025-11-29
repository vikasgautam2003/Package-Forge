import { Queue } from 'bullmq';

// 1. Reuse connection to avoid "Max Listeners" error in Next.js hot-reloading
const globalForRedis = global as unknown as { packageQueue?: Queue };

export const packageQueue =
  globalForRedis.packageQueue ||
  new Queue('package-generation', {
    connection: {
      host: 'localhost',
      port: 6379,
    },
  });

if (process.env.NODE_ENV !== 'production') globalForRedis.packageQueue = packageQueue;