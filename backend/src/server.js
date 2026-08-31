require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const pool = require('./db/pool');

const checkRoute = require('./routes/check');
const reportsRoute = require('./routes/reports');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json({ limit: '1mb' }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'scamshield-backend' });
});

app.use('/api/check', checkRoute);
app.use('/api/reports', reportsRoute);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

async function ensureDatabaseReady() {
  try {
    const schema = fs.readFileSync(path.join(__dirname, 'db', 'schema.sql'), 'utf8');
    await pool.query(schema);
    console.log('✅ Database tables ready.');
  } catch (err) {
    console.error('⚠️  Could not verify/create database tables:', err.message);
  }
}

ensureDatabaseReady().then(() => {
  app.listen(PORT, () => {
    console.log(`🛡️  ScamShield backend running on port ${PORT}`);
  });
});
