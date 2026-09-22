import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { requireAdminAuth, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/settings (Public)
router.get('/', (_req: Request, res: Response) => {
  const settings = db.getSettings();
  res.json(settings);
});

// PUT /api/settings (Admin)
router.put('/', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const updated = db.updateSettings(req.body);
  db.logActivity('Settings Updated', 'Website general configuration and branding modified.', req.user!.email);
  res.json(updated);
});

export default router;
