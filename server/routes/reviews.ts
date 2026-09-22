import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { requireAdminAuth, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/reviews (Public or admin)
router.get('/', (req: Request, res: Response) => {
  try {
    const { appId, status } = req.query;
    const reviews = db.getReviews(
      appId ? String(appId) : undefined,
      status ? (String(status) as 'pending' | 'approved' | 'hidden') : undefined
    );
    res.json(reviews);
  } catch (err) {
    console.error('[Reviews API Error] Failed to get reviews:', err);
    res.status(500).json([]);
  }
});

// POST /api/reviews (Public: submit review)
router.post('/', (req: Request, res: Response) => {
  try {
    const { appId, userName, userEmail, rating, comment } = req.body;
    if (!appId || !userName || !comment) {
      return res.status(400).json({ error: 'App, name, and comment are required' });
    }

    const app = db.getAppById(appId);
    if (!app) {
      return res.status(404).json({ error: 'App not found' });
    }

    const parsedRating = Math.max(1, Math.min(5, Number(rating) || 5));

    const review = db.createReview({
      appId: app.id,
      appName: app.name,
      userName: userName.trim(),
      userEmail: userEmail ? userEmail.trim() : undefined,
      rating: parsedRating,
      comment: comment.trim(),
      status: 'approved'
    });

    res.status(201).json(review);
  } catch (err) {
    console.error('[Reviews API Error] Failed to submit review:', err);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

// PATCH /api/reviews/:id/status (Admin)
router.patch('/:id/status', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['pending', 'approved', 'hidden'].includes(status)) {
      return res.status(400).json({ error: 'Invalid review status' });
    }

    const updated = db.updateReviewStatus(id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Review not found' });
    }

    db.logActivity('Review Moderated', `Set review status to '${status}' for app '${updated.appName}'.`, req.user!.email);
    res.json(updated);
  } catch (err) {
    console.error('[Reviews API Error] Failed to update review status:', err);
    res.status(500).json({ error: 'Failed to update review status' });
  }
});

// DELETE /api/reviews/:id (Admin)
router.delete('/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const success = db.deleteReview(id);
    if (!success) {
      return res.status(404).json({ error: 'Review not found' });
    }

    db.logActivity('Review Deleted', `Deleted review ID ${id}.`, req.user!.email);
    res.json({ success: true });
  } catch (err) {
    console.error('[Reviews API Error] Failed to delete review:', err);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

export default router;
