console.log('🚀 Server starting...'); // ✅ Only once, at the top

const express = require('express');
const fetch = require('node-fetch'); // must be v2

const app = express();

// CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Test route
app.get('/', (req, res) => {
  res.send('🎨 Proxy is running!');
});

// Proxy route
app.use('/proxy/', async (req, res) => {
  const targetPath = req.originalUrl.replace(/^\/proxy\//, '');
  const url = `https://collectionapi.metmuseum.org/public/collection/v1/${targetPath}`;

  console.log(`🔁 Proxying to: ${url}`);

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('❌ Proxy error:', err.message);
    res.status(500).json({ error: 'Failed to fetch from Met API' });
  }
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Proxy running on port ${PORT}`);
});