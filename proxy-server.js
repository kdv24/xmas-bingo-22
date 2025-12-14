// Simple secure proxy for Google Apps Script web app
// Requires: npm install express axios cors dotenv
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;
const SCRIPT_URL = process.env.SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbxj_b04UhyMFBrkAxHcy7PeRCgGE4upjf15oZDLHUJKS2QfYgXVr2NomZBxOXUmnNld/exec';
const PROXY_SECRET = process.env.PROXY_SECRET || 'YOUR_SHARED_SECRET';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to check for the shared secret in header or query
app.use((req, res, next) => {
  const clientSecret = req.headers['x-proxy-secret'] || req.query.proxy_secret;
  if (clientSecret !== PROXY_SECRET) {
    return res.status(403).json({ success: false, message: 'Invalid proxy secret' });
  }
  next();
});

// Proxy all POST requests
app.post('/', async (req, res) => {
  try {
    const response = await axios.post(SCRIPT_URL, req.body, {
      headers: { 'Content-Type': 'application/json' },
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Proxy all GET requests
app.get('/', async (req, res) => {
  try {
    const response = await axios.get(SCRIPT_URL, { params: req.query });
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
