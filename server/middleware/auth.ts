import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET || process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Server configuration error: AUTH_SECRET or ADMIN_JWT_SECRET environment variable is missing.');
    }
    return 'hushapk-dev-secret-key-2026';
  }
  return secret;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

export function requireAdminAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing or invalid authentication token' });
    }

    const token = authHeader.split(' ')[1];
    const secret = getAuthSecret();
    const decoded = jwt.verify(token, secret) as {
      id: string;
      username: string;
      email: string;
      role: string;
    };
    req.user = decoded;
    next();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('Server configuration error')) {
      return res.status(500).json({ error: 'Server configuration error: Authentication secret is missing in production.' });
    }
    return res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
  }
}

export function generateToken(user: { id: string; username: string; email: string; role: string }): string {
  const secret = getAuthSecret();
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email, role: user.role },
    secret,
    { expiresIn: '7d' }
  );
}
