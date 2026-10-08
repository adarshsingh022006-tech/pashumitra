const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');
const { addSseClient } = require('../services/notificationService');

// GET /api/notifications
router.get('/', authenticateToken, async (req, res) => {
  try {
    const notifications = await db('notifications')
      .where('user_id', req.user.id)
      .orWhere('role_target', req.user.role)
      .orderBy('created_at', 'desc')
      .limit(50);

    const unreadCount = notifications.filter(n => !n.is_read).length;

    res.json({ notifications, unreadCount });
  } catch (err) {
    console.error('[Notifications GET Error]:', err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', authenticateToken, async (req, res) => {
  try {
    await db('notifications')
      .where('id', req.params.id)
      .update({ is_read: true });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// PATCH /api/notifications/read-all
router.patch('/read-all', authenticateToken, async (req, res) => {
  try {
    await db('notifications')
      .where('user_id', req.user.id)
      .orWhere('role_target', req.user.role)
      .update({ is_read: true });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark all as read' });
  }
});

// GET /api/notifications/stream (Server-Sent Events)
router.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Initial connection ping
  res.write('data: {"event":"connected","message":"Live alert stream connected"}\n\n');

  addSseClient(res);
});

module.exports = router;
