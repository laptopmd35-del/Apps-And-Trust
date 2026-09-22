import { Router, Response } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { requireAdminAuth, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

try {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
} catch (e) {
  console.warn('Could not initialize upload dir:', e);
}

// Helper to parse base64 image data
function processBase64Image(rawPayload: string, originalName?: string): { url: string; buffer: Buffer; mimeType: string } {
  let mimeType = 'image/png';
  let base64Content = rawPayload;

  if (rawPayload.includes(';base64,')) {
    const parts = rawPayload.split(';base64,');
    const header = parts[0];
    base64Content = parts[1];
    const mimeMatch = header.match(/data:([^;]+)/);
    if (mimeMatch && mimeMatch[1]) {
      mimeType = mimeMatch[1].trim().toLowerCase();
    }
  }

  const buffer = Buffer.from(base64Content, 'base64');

  // Determine file extension
  let ext = '.png';
  if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = '.jpg';
  else if (mimeType.includes('webp')) ext = '.webp';
  else if (mimeType.includes('svg')) ext = '.svg';
  else if (mimeType.includes('gif')) ext = '.gif';
  else if (mimeType.includes('avif')) ext = '.avif';
  else if (originalName && originalName.includes('.')) {
    ext = path.extname(originalName).toLowerCase();
  }

  const safeHash = crypto.randomBytes(8).toString('hex');
  const filename = `img-${Date.now()}-${safeHash}${ext}`;
  const filePath = path.join(UPLOAD_DIR, filename);

  try {
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
    fs.writeFileSync(filePath, buffer);
    return {
      url: `/uploads/${filename}`,
      buffer,
      mimeType
    };
  } catch (fsErr) {
    console.error('File write failed, falling back to dataUrl:', fsErr);
    // Safe fallback: return raw dataUrl if disk write fails
    return {
      url: rawPayload.startsWith('data:') ? rawPayload : `data:${mimeType};base64,${base64Content}`,
      buffer,
      mimeType
    };
  }
}

// POST /api/upload (Admin: upload image via base64 or JSON payload)
router.post('/', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const payload = req.body.dataUrl || req.body.image || req.body.file || req.body.base64;
    const filename = req.body.filename;

    // Handle batch upload if 'images' array is provided
    if (Array.isArray(req.body.images) && req.body.images.length > 0) {
      const results = req.body.images.map((item: any) => {
        const raw = typeof item === 'string' ? item : (item.dataUrl || item.image || item.file);
        const name = typeof item === 'object' ? item.filename : undefined;
        return processBase64Image(raw, name);
      });

      return res.json({
        success: true,
        urls: results.map((r: { url: string }) => r.url),
        count: results.length
      });
    }

    if (!payload || typeof payload !== 'string') {
      return res.status(400).json({ error: 'Image data is required (dataUrl, image, or file payload).' });
    }

    const result = processBase64Image(payload, filename);

    return res.json({
      success: true,
      url: result.url,
      size: result.buffer.length,
      mimeType: result.mimeType
    });
  } catch (error: any) {
    console.error('Upload handling error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to process image upload.' });
  }
});

export default router;
