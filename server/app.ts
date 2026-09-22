import express from 'express';
import path from 'path';

import authRouter from './routes/auth.js';
import appsRouter from './routes/apps.js';
import categoriesRouter from './routes/categories.js';
import reviewsRouter from './routes/reviews.js';
import reportsRouter from './routes/reports.js';
import analyticsRouter from './routes/analytics.js';
import settingsRouter from './routes/settings.js';
import activityRouter from './routes/activity.js';
import uploadRouter from './routes/upload.js';

export function createExpressApp() {
  const app = express();

  // JSON and URL parsing middleware with generous size limit for screenshot uploads
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Static uploads folder
  const uploadsPath = path.join(process.cwd(), 'public', 'uploads');
  app.use('/uploads', express.static(uploadsPath));

  // Mount API endpoints
  app.use('/api/auth', authRouter);
  app.use('/api/apps', appsRouter);
  app.use('/api/categories', categoriesRouter);
  app.use('/api/reviews', reviewsRouter);
  app.use('/api/reports', reportsRouter);
  app.use('/api/analytics', analyticsRouter);
  app.use('/api/settings', settingsRouter);
  app.use('/api/activity', activityRouter);
  app.use('/api/upload', uploadRouter);

  // Healthcheck endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'HushAPK Directory Service',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    });
  });

  return app;
}

export const app = createExpressApp();
export default app;
