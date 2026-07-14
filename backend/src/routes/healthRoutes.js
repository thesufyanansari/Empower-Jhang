import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  let dbStatus = 'healthy';
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (err) {
    dbStatus = 'unhealthy';
  }

  return res.status(200).json({
    success: true,
    message: 'System health report.',
    data: {
      status: 'UP',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      database: dbStatus,
      timestamp: new Date()
    }
  });
});

export default router;
