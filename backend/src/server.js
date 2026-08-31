require('dotenv').config();
const express = require('express');
const cors = require('cors');

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

app.listen(PORT, () => {
  console.log(`🛡️  ScamShield backend running on port ${PORT}`);
});
