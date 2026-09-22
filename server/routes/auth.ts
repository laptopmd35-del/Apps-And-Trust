import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db.js';
import { generateToken, requireAdminAuth, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// POST /api/auth/login
router.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const user = db.getUserByUsername(username);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const isMatch = bcrypt.compareSync(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid credentials' });
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
});

// GET /api/auth/me
router.get('/me', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({ user: req.user });
});

// POST /api/auth/change-password
router.post('/change-password', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Both current and new password are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
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
});

// GET /api/auth/users
router.get('/users', requireAdminAuth, (_req: AuthenticatedRequest, res: Response) => {
  const users = db.getUsers();
  res.json(users);
});

// POST /api/auth/users
router.post('/users', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const { username, email, role, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required' });
  }

  const existing = db.getUserByUsername(username);
  if (existing) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  const newUser = db.createUser({
    username,
    email,
    role: role || 'admin',
    password
  });

  db.logActivity('Created Admin User', `Created admin account '${username}'.`, req.user!.email);
  res.status(201).json(newUser);
});

// DELETE /api/auth/users/:id
router.delete('/users/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
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
});

export default router;
