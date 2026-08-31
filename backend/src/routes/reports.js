const express = require('express');
const pool = require('../db/pool');

const router = express.Router();

// Create a new report
router.post('/', async (req, res) => {
  const { scam_type, title, description, raw_content, url, contact_info, reporter_name } = req.body;

  if (!scam_type || !description) {
    return res.status(400).json({ error: 'scam_type and description are required.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO reports (scam_type, title, description, raw_content, url, contact_info, reporter_name)
       VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, 'Anonymous'))
       RETURNING *`,
      [scam_type, title || null, description, raw_content || null, url || null, contact_info || null, reporter_name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Failed to create report:', err.message);
    res.status(500).json({ error: 'Could not save report. Please try again.' });
  }
});

// Search/browse reports
router.get('/', async (req, res) => {
  const { q, scam_type, limit = 20 } = req.query;
  const conditions = [];
  const values = [];

  if (q) {
    values.push(`%${q}%`);
    conditions.push(`(description ILIKE $${values.length} OR contact_info ILIKE $${values.length} OR url ILIKE $${values.length} OR title ILIKE $${values.length})`);
  }
  if (scam_type) {
    values.push(scam_type);
    conditions.push(`scam_type = $${values.length}`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  values.push(Math.min(Number(limit) || 20, 100));

  try {
    const result = await pool.query(
      `SELECT * FROM reports ${whereClause} ORDER BY created_at DESC LIMIT $${values.length}`,
      values
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Failed to fetch reports:', err.message);
    res.status(500).json({ error: 'Could not fetch reports.' });
  }
});

module.exports = router;
