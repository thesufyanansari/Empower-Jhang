import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';

const prisma = new PrismaClient();

export const startCleanupScheduler = () => {
  logger.info('Initializing background cleanup scheduler...');

  // Run cleanup immediately on server startup
  runCleanup();

  // Run every 2 hours
  const interval = 2 * 60 * 60 * 1000;
  setInterval(runCleanup, interval);
};

const runCleanup = async () => {
  try {
    logger.info('[Cleanup Task] Running database maintenance...');

    // 1. Delete expired OTPs
    const deleteCount = await prisma.emailOtp.deleteMany({
      where: {
        expires_at: { lt: new Date() }
      }
    });

    if (deleteCount.count > 0) {
      logger.info(`[Cleanup Task] Deleted ${deleteCount.count} expired OTP records.`);
    }

    logger.info('[Cleanup Task] Maintenance completed successfully.');
  } catch (err) {
    logger.error(`[Cleanup Task] Error executing database maintenance: ${err.message}`);
  }
};
