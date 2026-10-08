const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const db = require('../db');
const { JWT_SECRET, authenticateToken } = require('../middleware/auth');

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['farmer', 'vet', 'authority']),
  phone: z.string().optional(),
  village: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional().default('Punjab')
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const validated = registerSchema.parse(req.body);

    const existing = await db('users').where('email', validated.email).first();
    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const password_hash = await bcrypt.hash(validated.password, 10);
    const [userId] = await db('users').insert({
      name: validated.name,
      email: validated.email,
      password_hash,
      role: validated.role,
      phone: validated.phone || null,
      village: validated.village || null,
      district: validated.district || 'Ludhiana',
      state: validated.state || 'Punjab'
    }).returning('id');

    const id = typeof userId === 'object' ? userId.id : userId;
    const user = await db('users').where('id', id).first();
    delete user.password_hash;

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ user, token });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0]?.message || 'Validation failed' });
    }
    console.error('[Auth Register Error]:', err);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const validated = loginSchema.parse(req.body);

    const user = await db('users').where('email', validated.email).first();
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(validated.password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    delete user.password_hash;

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ user, token });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0]?.message || 'Validation failed' });
    }
    console.error('[Auth Login Error]:', err);
    res.status(500).json({ error: 'Failed to log in' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await db('users').where('id', req.user.id).first();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    delete user.password_hash;
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve profile' });
  }
});

module.exports = router;
