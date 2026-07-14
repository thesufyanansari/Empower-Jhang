import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import path from 'path';
import fs from 'fs';

// Logger & Cleanups
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { startCleanupScheduler } from './cron/cleanup.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Route imports
import authRoutes from './routes/authRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import skillsRoutes from './routes/skillsRoutes.js';
import learningRoutes from './routes/learningRoutes.js';
import rolesRoutes from './routes/rolesRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Hide Express signature for security
app.disable('x-powered-by');

// Force HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
  });
}

// Compression for optimized bundle transfer speed
app.use(compression());

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: false // Allow dynamic member photos/avatars loading
}));

// CORS Configuration
app.use(cors({
  origin: process.env.APP_URL || 'http://localhost:5173',
  credentials: true
}));

// Payload parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate Limiting Configs
const standardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests. Please try again later.' }
});

const otpRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: { success: false, message: 'Too many verification code requests. Please wait 15 minutes.' }
});

const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many verification attempts. Please wait 15 minutes.' }
});

const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many login attempts. Please wait 15 minutes.' }
});

app.use('/api/v1', standardLimiter);
app.use('/api/v1/auth/send-otp', otpRequestLimiter);
app.use('/api/v1/auth/resend-otp', otpRequestLimiter);
app.use('/api/v1/auth/verify-otp', otpVerifyLimiter);
app.use('/api/v1/auth/admin-login', adminLoginLimiter);

// Robots.txt crawler directives
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Sitemap: https://empowerjhang.org/sitemap.xml`);
});

// Dynamic XML Sitemap generator
app.get('/sitemap.xml', async (req, res, next) => {
  try {
    const domain = process.env.APP_URL || 'https://empowerjhang.org';
    const lastmod = new Date().toISOString().split('T')[0];

    const members = await prisma.communityMember.findMany({
      where: { status: 'Active', email_verified: true },
      select: { member_id: true }
    });

    const announcements = await prisma.announcement.findMany({
      where: { status: 'Published' },
      select: { id: true }
    });

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    const staticPages = [
      { path: '', priority: '1.0' },
      { path: '/about', priority: '0.8' },
      { path: '/contact', priority: '0.8' },
      { path: '/privacy', priority: '0.5' },
      { path: '/terms', priority: '0.5' },
      { path: '/volunteer', priority: '0.8' },
      { path: '/mentor', priority: '0.8' },
      { path: '/members', priority: '0.8' },
      { path: '/volunteers', priority: '0.8' },
      { path: '/mentors', priority: '0.8' },
      { path: '/courses', priority: '0.8' },
      { path: '/resources', priority: '0.8' },
      { path: '/sitemap', priority: '0.5' }
    ];

    staticPages.forEach(p => {
      xml += `  <url>
    <loc>${domain}${p.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>${p.priority}</priority>
  </url>\n`;
    });

    members.forEach(m => {
      xml += `  <url>
    <loc>${domain}/member/${m.member_id}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>0.7</priority>
  </url>\n`;
    });

    announcements.forEach(a => {
      xml += `  <url>
    <loc>${domain}/announcements?id=${a.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>0.6</priority>
  </url>\n`;
    });

    xml += '</urlset>';
    res.type('application/xml');
    return res.send(xml);
  } catch (err) {
    next(err);
  }
});

// Serve static profile uploads from configured directory
const uploadPath = process.env.UPLOAD_PATH || 
  (fs.existsSync(path.join(process.cwd(), 'uploads')) 
    ? path.join(process.cwd(), 'uploads') 
    : path.join(process.cwd(), '../uploads'));
app.use('/uploads', express.static(uploadPath));

// OpenAPI specification file
app.get('/api/v1/openapi.json', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'src/openapi.json'));
});

// Interactive Swagger UI documentation page via CDN
app.get('/api/v1/docs', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Empower Jhang REST API Specification Docs</title>
      <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
    </head>
    <body style="margin: 0; background: #fafafa;">
      <div id="swagger-ui"></div>
      <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js" charset="UTF-8"></script>
      <script>
        window.onload = () => {
          window.ui = SwaggerUIBundle({
            url: '/api/v1/openapi.json',
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [SwaggerUIBundle.presets.apis],
            layout: "BaseLayout"
          });
        };
      </script>
    </body>
    </html>
  `);
});

// Routes mapping
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/member', memberRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/skills', skillsRoutes);
app.use('/api/v1/learning', learningRoutes);
app.use('/api/v1/roles', rolesRoutes);

// Serve static React frontend files in production
const publicPath = fs.existsSync(path.join(process.cwd(), 'frontend/dist'))
  ? path.join(process.cwd(), 'frontend/dist')
  : path.join(process.cwd(), '../frontend/dist');

if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      return next();
    }
    res.sendFile(path.join(publicPath, 'index.html'));
  });
}

// 404 Standardized Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Resource not found',
    errors: []
  });
});

// Centralized error boundary
app.use(errorHandler);

// Start clean cleanup chronologies
startCleanupScheduler();

// Start Server listening
app.listen(PORT, () => {
  logger.info(`[Empower Jhang Server] running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
});
