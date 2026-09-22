import { Router, Response } from 'express';
import { db } from '../db.js';
import { requireAdminAuth, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/analytics (Admin only: real statistics)
router.get('/', requireAdminAuth, (_req: AuthenticatedRequest, res: Response) => {
  try {
    const stats = db.getAnalytics();
    res.json(stats);
  } catch (err) {
    console.error('[Analytics API Error] Failed to retrieve analytics:', err);
    res.status(500).json({
      totalClicks: 0,
      todayClicks: 0,
      totalApps: 0,
      totalCategories: 0,
      clicksOverTime: [],
      topApps: []
    });
  }
});

export default router;
