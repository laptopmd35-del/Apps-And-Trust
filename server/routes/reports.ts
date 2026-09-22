import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { requireAdminAuth, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/reports (Admin only)
router.get('/', requireAdminAuth, (_req: AuthenticatedRequest, res: Response) => {
  try {
    const reports = db.getReports();
    res.json(reports);
  } catch (err) {
    console.error('[Reports API Error] Failed to get reports:', err);
    res.status(500).json([]);
  }
});

// POST /api/reports (Public: submit issue report)
router.post('/', (req: Request, res: Response) => {
  try {
    const { appId, appName, reason, details, contactEmail } = req.body;
    if (!details || !reason) {
      return res.status(400).json({ error: 'Reason and details are required' });
    }

    const validReasons = ['broken_link', 'wrong_information', 'copyright_concern', 'security_concern', 'other'];
    if (!validReasons.includes(reason)) {
      return res.status(400).json({ error: 'Invalid report reason' });
    }

    let resolvedAppName = appName || 'General Application';
    if (appId) {
      const app = db.getAppById(appId);
      if (app) resolvedAppName = app.name;
    }

    const report = db.createReport({
      appId: appId || 'general',
      appName: resolvedAppName,
      reason,
      details: details.trim(),
      contactEmail: contactEmail ? contactEmail.trim() : undefined,
    });

    res.status(201).json(report);
  } catch (err) {
    console.error('[Reports API Error] Failed to create report:', err);
    res.status(500).json({ error: 'Failed to submit report' });
  }
});

// PATCH /api/reports/:id/status (Admin)
router.patch('/:id/status', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['open', 'investigating', 'resolved', 'dismissed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid report status' });
    }

    const updated = db.updateReportStatus(id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Report not found' });
    }

    db.logActivity('Report Status Updated', `Report on '${updated.appName}' marked as ${status}.`, req.user!.email);
    res.json(updated);
  } catch (err) {
    console.error('[Reports API Error] Failed to update report status:', err);
    res.status(500).json({ error: 'Failed to update report status' });
  }
});

export default router;
