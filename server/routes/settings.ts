import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { requireAdminAuth, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/settings (Public)
router.get('/', (_req: Request, res: Response) => {
  try {
    const settings = db.getSettings();
    res.json(settings);
  } catch (err) {
    console.error('[Settings API Error] Failed to get settings:', err);
    res.status(500).json({
      siteName: 'HushAPK',
      siteTagline: 'Safe Apps. Simple Downloads.',
      metaDescription: 'Verified Android APK directory offering secure external downloads without unwanted wrappers.',
      contactEmail: 'contact@hushapk.org',
      supportTelegram: 'https://t.me/hushapk',
      maintenanceMode: false,
      bannerNotice: ''
    });
  }
});

// PUT /api/settings (Admin)
router.put('/', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const updated = db.updateSettings(req.body);
    db.logActivity('Settings Updated', 'Website general configuration and branding modified.', req.user!.email);
    res.json(updated);
  } catch (err) {
    console.error('[Settings API Error] Failed to update settings:', err);
    res.status(500).json({ error: 'Failed to update site settings' });
  }
});

export default router;
