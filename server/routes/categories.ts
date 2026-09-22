import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { requireAdminAuth, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/categories
router.get('/', (_req: Request, res: Response) => {
  const categories = db.getCategories();
  res.json(categories);
});

// POST /api/categories (Admin)
router.post('/', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const { name, slug, description, iconName, isGame } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  const generatedSlug = (slug || name).toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
  const newCat = db.createCategory({
    name,
    slug: generatedSlug,
    description: description || '',
    iconName: iconName || 'Folder',
    isGame: Boolean(isGame)
  });

  db.logActivity('Category Created', `Created category '${newCat.name}'.`, req.user!.email);
  res.status(201).json(newCat);
});

// PUT /api/categories/:id (Admin)
router.put('/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const updated = db.updateCategory(id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Category not found' });
  }

  db.logActivity('Category Updated', `Updated category '${updated.name}'.`, req.user!.email);
  res.json(updated);
});

// DELETE /api/categories/:id (Admin)
router.delete('/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const success = db.deleteCategory(id);
  if (!success) {
    return res.status(404).json({ error: 'Category not found' });
  }

  db.logActivity('Category Deleted', `Deleted category ID ${id}.`, req.user!.email);
  res.json({ success: true });
});

export default router;
