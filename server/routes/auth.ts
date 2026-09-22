import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db.js';
import { generateToken, requireAdminAuth, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// POST /api/auth/login
router.post('/login', (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const trimmedUsername = username.trim();
    const user = db.getUserByUsername(trimmedUsername);
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });

    db.logActivity('Admin Login', `User '${user.username}' signed into admin portal.`, user.email);

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      }
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('Server configuration error')) {
      return res.status(500).json({
        error: 'Server configuration error',
        message: 'AUTH_SECRET environment variable is missing on this production server.'
      });
    }
    console.error('[Auth API Error] Login error:', err);
    res.status(500).json({ error: 'An unexpected server error occurred during login. Please try again.' });
  }
});

// POST /api/auth/logout
router.post('/logout', (_req: Request, res: Response) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// GET /api/auth/me
router.get('/me', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve session info' });
  }
});

// POST /api/auth/change-password
router.post('/change-password', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Both current and new password are required' });
    }

    if (typeof newPassword !== 'string' || newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    const user = db.getUserByUsername(req.user!.username);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = bcrypt.compareSync(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    db.updateUserPassword(user.id, newPassword);
    db.logActivity('Password Changed', `User '${user.username}' changed their password.`, user.email);

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error('[Auth API Error] Change password failed:', err);
    res.status(500).json({ error: 'Failed to update password' });
  }
});

// GET /api/auth/users
router.get('/users', requireAdminAuth, (_req: AuthenticatedRequest, res: Response) => {
  try {
    const users = db.getUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
});

// POST /api/auth/users
router.post('/users', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { username, email, role, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    const existing = db.getUserByUsername(username.trim());
    if (existing) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const newUser = db.createUser({
      username: username.trim(),
      email: email.trim(),
      role: role || 'admin',
      password
    });

    db.logActivity('Created Admin User', `Created admin account '${username}'.`, req.user!.email);
    res.status(201).json(newUser);
  } catch (err) {
    console.error('[Auth API Error] Create user failed:', err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// DELETE /api/auth/users/:id
router.delete('/users/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (id === req.user!.id) {
      return res.status(400).json({ error: 'You cannot delete your own account' });
    }

    const success = db.deleteUser(id);
    if (!success) {
      return res.status(400).json({ error: 'Failed to delete user or cannot delete the sole administrator' });
    }

    db.logActivity('Deleted Admin User', `Deleted user ID ${id}.`, req.user!.email);
    res.json({ success: true });
  } catch (err) {
    console.error('[Auth API Error] Delete user failed:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
