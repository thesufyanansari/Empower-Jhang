import { logger } from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  logger.error(`${req.method} ${req.originalUrl} - Error: ${err.message}\nStack: ${err.stack}`);

  // Zod validation errors
  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }))
    });
  }

  // Prisma unique key violation or database errors
  if (err.code && err.code.startsWith('P20')) {
    logger.error(`Prisma DB Error: Code ${err.code} - Metadata: ${JSON.stringify(err.meta)}`);
    return res.status(400).json({
      success: false,
      message: 'Database operation failed. Potential constraint violation.',
      errors: []
    });
  }

  // Multer upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File size limit exceeded. Max limit is 5MB.',
      errors: []
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return res.status(statusCode).json({
    success: false,
    message,
    errors: []
  });
};
