const express = require('express');
const router = express.Router();
const db = require('../db');
const { updateHotspots } = require('../ai/clusters');

// GET /api/hotspots
router.get('/', async (req, res) => {
  try {
    if (req.query.refresh === 'true') {
      await updateHotspots(db);
    }

    const hotspots = await db('hotspots')
      .orderBy('high_risk_reports', 'desc');

    res.json({ hotspots });
  } catch (err) {
    console.error('[Hotspots GET Error]:', err);
    res.status(500).json({ error: 'Failed to retrieve outbreak hotspots' });
  }
});

module.exports = router;
