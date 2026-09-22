import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { requireAdminAuth, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/categories
router.get('/', (_req: Request, res: Response) => {
  try {
    const categories = db.getCategories();
    res.json(categories);
  } catch (err) {
    console.error('[Categories API Error] Failed to retrieve categories:', err);
    res.status(500).json([]);
  }
});

// GET /api/categories/slug/:slug
router.get('/slug/:slug', (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const cat = db.getCategoryBySlug(slug);
    if (!cat) {
      return res.status(404).json({ error: 'Category not found' });
    }
    const apps = db.getApps({ categoryId: cat.id, onlyPublished: true });
    res.json({ category: cat, apps });
  } catch (err) {
    console.error('[Categories API Error] Failed to retrieve category by slug:', err);
    res.status(500).json({ error: 'Failed to retrieve category' });
  }
});

// POST /api/categories (Admin)
router.post('/', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, slug, description, iconName, isGame } = req.body;
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const generatedSlug = (slug || name).toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
    const newCat = db.createCategory({
      name: name.trim(),
      slug: generatedSlug,
      description: description || '',
      iconName: iconName || 'Folder',
      isGame: Boolean(isGame)
    });

    db.logActivity('Category Created', `Created category '${newCat.name}'.`, req.user!.email);
    res.status(201).json(newCat);
  } catch (err) {
    console.error('[Categories API Error] Failed to create category:', err);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// PUT /api/categories/:id (Admin)
router.put('/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updated = db.updateCategory(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Category not found' });
    }

    db.logActivity('Category Updated', `Updated category '${updated.name}'.`, req.user!.email);
    res.json(updated);
  } catch (err) {
    console.error('[Categories API Error] Failed to update category:', err);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// DELETE /api/categories/:id (Admin)
router.delete('/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const success = db.deleteCategory(id);
    if (!success) {
      return res.status(404).json({ error: 'Category not found' });
    }

    db.logActivity('Category Deleted', `Deleted category ID ${id}.`, req.user!.email);
    res.json({ success: true });
  } catch (err) {
    console.error('[Categories API Error] Failed to delete category:', err);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;
