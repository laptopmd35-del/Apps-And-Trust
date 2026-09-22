import { Router, Response } from 'express';
import { db } from '../db.js';
import { requireAdminAuth, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/analytics (Admin only: real statistics)
router.get('/', requireAdminAuth, (_req: AuthenticatedRequest, res: Response) => {
  const stats = db.getAnalytics();
  res.json(stats);
});

export default router;
