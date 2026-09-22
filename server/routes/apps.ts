import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { requireAdminAuth, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Helper to validate download URL
export function isValidDownloadUrl(urlStr: string): boolean {
  if (!urlStr || typeof urlStr !== 'string') return false;
  const trimmed = urlStr.trim();
  const lower = trimmed.toLowerCase();

  // Reject dangerous protocols
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('file:') ||
    lower.startsWith('blob:') ||
    lower.startsWith('vbscript:')
  ) {
    return false;
  }

  // Must start with http:// or https://
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (err) {
    return false;
  }
}

// GET /api/apps (Public listing with filtering, sorting, pagination)
router.get('/', (req: Request, res: Response) => {
  const {
    search,
    categoryId,
    isGame,
    featured,
    sort,
    limit = '100',
    page = '1',
    all // admin can pass all=true to see unpublished apps
  } = req.query;

  const onlyPublished = all !== 'true';

  let isGameBool: boolean | undefined = undefined;
  if (isGame === 'true') isGameBool = true;
  if (isGame === 'false') isGameBool = false;

  let featuredBool: boolean | undefined = undefined;
  if (featured === 'true') featuredBool = true;

  const apps = db.getApps({
    search: search ? String(search) : undefined,
    categoryId: categoryId ? String(categoryId) : undefined,
    isGame: isGameBool,
    featured: featuredBool,
    sort: (sort as 'downloads' | 'rating' | 'latest' | 'name') || 'latest',
    onlyPublished
  });

  const parsedPage = Math.max(1, parseInt(String(page), 10) || 1);
  const parsedLimit = Math.max(1, Math.min(100, parseInt(String(limit), 10) || 20));
  const total = apps.length;
  const totalPages = Math.ceil(total / parsedLimit);
  const paginated = apps.slice((parsedPage - 1) * parsedLimit, parsedPage * parsedLimit);

  res.json({
    data: paginated,
    meta: {
      total,
      page: parsedPage,
      limit: parsedLimit,
      totalPages
    }
  });
});

// GET /api/apps/slug/:slug (Public details)
router.get('/slug/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  const app = db.getAppBySlug(slug);
  if (!app) {
    return res.status(404).json({ error: 'App not found' });
  }

  // Also include 4 related apps in same category
  const related = db.getApps({ categoryId: app.categoryId, onlyPublished: true })
    .filter(a => a.id !== app.id)
    .slice(0, 4);

  // Also get approved reviews
  const reviews = db.getReviews(app.id, 'approved');

  res.json({
    app,
    related,
    reviews
  });
});

// GET /api/apps/:id (By ID)
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const app = db.getAppById(id);
  if (!app) {
    return res.status(404).json({ error: 'App not found' });
  }
  res.json(app);
});

// POST /api/apps/:id/click (Record download click & return external URL)
router.post('/:id/click', (req: Request, res: Response) => {
  const { id } = req.params;
  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0] || req.socket.remoteAddress || '127.0.0.1';
  const userAgent = req.headers['user-agent'] || 'Unknown';

  const result = db.recordClick(id, ip, userAgent);
  if (!result.success || !result.downloadUrl) {
    return res.status(404).json({ error: 'App not found or missing download URL' });
  }

  // Safety confirmation payload
  res.json({
    success: true,
    downloadUrl: result.downloadUrl
  });
});

// POST /api/apps (Admin: create new app)
router.post('/', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const {
    name,
    slug,
    developer,
    categoryId,
    isGame,
    icon,
    description,
    features,
    screenshots,
    version,
    fileSize,
    androidRequirement,
    packageName,
    downloadUrl,
    rating,
    featured,
    published,
    whatsNew,
    previousVersions
  } = req.body;

  if (!name || !developer || !categoryId || !downloadUrl) {
    return res.status(400).json({ error: 'Name, developer, category, and download URL are required' });
  }

  if (!isValidDownloadUrl(downloadUrl)) {
    return res.status(400).json({ error: 'Invalid download URL. Must be a valid HTTP or HTTPS address.' });
  }

  // Create clean slug if not given
  const generatedSlug = (slug || name)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  // Verify slug uniqueness
  const existingWithSlug = db.getAppBySlug(generatedSlug);
  const finalSlug = existingWithSlug ? `${generatedSlug}-${Date.now().toString(36)}` : generatedSlug;

  const newApp = db.createApp({
    name,
    slug: finalSlug,
    developer,
    categoryId,
    isGame: Boolean(isGame),
    icon: icon || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=160&auto=format&fit=crop&q=80',
    description: description || '',
    features: Array.isArray(features) ? features : (typeof features === 'string' ? features.split('\n').filter(Boolean) : []),
    screenshots: Array.isArray(screenshots) ? screenshots : [],
    version: version || '1.0.0',
    fileSize: fileSize || '25 MB',
    androidRequirement: androidRequirement || 'Android 7.0 and up',
    packageName: packageName || `com.${generatedSlug.replace(/-/g, '.')}`,
    downloadUrl: downloadUrl.trim(),
    rating: Number(rating) || 4.5,
    featured: Boolean(featured),
    published: published !== false,
    whatsNew: whatsNew || 'Initial release on HushAPK.',
    previousVersions: Array.isArray(previousVersions) ? previousVersions : []
  });

  db.logActivity('App Created', `Created application '${newApp.name}'.`, req.user!.email);
  res.status(201).json(newApp);
});

// PUT /api/apps/:id (Admin: update app)
router.put('/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const updates = { ...req.body };

  if (updates.downloadUrl) {
    if (!isValidDownloadUrl(updates.downloadUrl)) {
      return res.status(400).json({ error: 'Invalid download URL. Must be a valid HTTP or HTTPS address.' });
    }
  }

  if (typeof updates.features === 'string') {
    updates.features = updates.features.split('\n').map((f: string) => f.trim()).filter(Boolean);
  }

  const updated = db.updateApp(id, updates);
  if (!updated) {
    return res.status(404).json({ error: 'App not found' });
  }

  db.logActivity('App Updated', `Updated application '${updated.name}'.`, req.user!.email);
  res.json(updated);
});

// DELETE /api/apps/:id (Admin: delete app)
router.delete('/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const app = db.getAppById(id);
  const success = db.deleteApp(id);
  if (!success) {
    return res.status(404).json({ error: 'App not found or already deleted' });
  }

  db.logActivity('App Deleted', `Deleted application '${app ? app.name : id}'.`, req.user!.email);
  res.json({ success: true });
});

// PATCH /api/apps/:id/publish
router.patch('/:id/publish', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { published } = req.body;
  const updated = db.updateApp(id, { published: Boolean(published) });
  if (!updated) return res.status(404).json({ error: 'App not found' });
  db.logActivity('Status Toggled', `Changed published status of '${updated.name}' to ${Boolean(published)}.`, req.user!.email);
  res.json(updated);
});

// PATCH /api/apps/:id/feature
router.patch('/:id/feature', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { featured } = req.body;
  const updated = db.updateApp(id, { featured: Boolean(featured) });
  if (!updated) return res.status(404).json({ error: 'App not found' });
  db.logActivity('Featured Toggled', `Changed featured status of '${updated.name}' to ${Boolean(featured)}.`, req.user!.email);
  res.json(updated);
});

export default router;
