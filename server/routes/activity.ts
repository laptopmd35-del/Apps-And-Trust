import { Router, Response } from 'express';
import { db } from '../db.js';
import { requireAdminAuth, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/activity (Admin only: audit log)
router.get('/', requireAdminAuth, (_req: AuthenticatedRequest, res: Response) => {
  try {
    const activities = db.getActivities();
    res.json(activities);
  } catch (err) {
    console.error('[Activity API Error] Failed to get activities:', err);
    res.status(500).json([]);
  }
});

export default router;
