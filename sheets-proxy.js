// Google Sheets API proxy for your app
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4000;
const SHEET_ID = process.env.SHEET_ID || 'YOUR_SHEET_ID_HERE';
const PROXY_SECRET = process.env.PROXY_SECRET || 'YOUR_SHARED_SECRET';
const SERVICE_ACCOUNT_FILE = process.env.SERVICE_ACCOUNT_FILE || './service-account.json';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth setup
const auth = new google.auth.GoogleAuth({
  keyFile: SERVICE_ACCOUNT_FILE,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const sheets = google.sheets({ version: 'v4', auth });

// Middleware to check for the shared secret
app.use((req, res, next) => {
  const clientSecret = req.headers['x-proxy-secret'] || req.query.proxy_secret;
  if (clientSecret !== PROXY_SECRET) {
    return res.status(403).json({ success: false, message: 'Invalid proxy secret' });
  }
  next();
});

// List themes
app.get('/themes', async (req, res) => {
  try {
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'themes',
    });
    const [header, ...rows] = result.data.values;
    const themes = rows.map(row => {
      const obj = {};
      header.forEach((col, i) => { obj[col] = row[i] || ''; });
      if (obj.themeName) obj.wordArrays = JSON.parse(obj.wordArrays || '{}');
      return obj;
    });
    res.json({ themes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// Add a new theme
app.post('/themes', async (req, res) => {
  try {
    const theme = req.body.theme || req.body;
    if (!theme || !theme.themeName) return res.status(400).json({ success: false, message: 'Missing themeName' });
    // Prepare row: id, createdAt, themeName, wordArrays, backgroundColor
    const now = new Date().toISOString();
    const uuid = theme.id || require('crypto').randomUUID();
    const row = [
      uuid,
      now,
      theme.themeName,
      JSON.stringify(theme.wordArrays || {}),
      theme.backgroundColor || ''
    ];
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'themes',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [row] }
    });
    res.json({ success: true, message: 'added', id: uuid });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update a theme by id
app.patch('/themes', async (req, res) => {
  try {
    const theme = req.body.theme || req.body;
    if (!theme || !theme.id) return res.status(400).json({ success: false, message: 'Missing id' });
    // Get all rows
    const result = await sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: 'themes' });
    const [header, ...rows] = result.data.values;
    const idIdx = header.indexOf('id');
    if (idIdx === -1) return res.status(500).json({ success: false, message: 'No id column' });
    let found = false;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i][idIdx] === theme.id) {
        // Update row
        const rowIdx = i + 2; // 1-based, plus header
        const updates = [
          theme.id,
          rows[i][1], // keep createdAt
          theme.themeName || rows[i][2],
          JSON.stringify(theme.wordArrays || {}),
          theme.backgroundColor || rows[i][4] || ''
        ];
        await sheets.spreadsheets.values.update({
          spreadsheetId: SHEET_ID,
          range: `themes!A${rowIdx}:E${rowIdx}`,
          valueInputOption: 'RAW',
          requestBody: { values: [updates] }
        });
        found = true;
        break;
      }
    }
    if (!found) return res.status(404).json({ success: false, message: 'Theme not found' });
    res.json({ success: true, message: 'updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete a theme by id
app.delete('/themes', async (req, res) => {
  try {
    const id = req.body.id || req.query.id;
    if (!id) return res.status(400).json({ success: false, message: 'Missing id' });
    // Get all rows
    const result = await sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: 'themes' });
    const [header, ...rows] = result.data.values;
    const idIdx = header.indexOf('id');
    if (idIdx === -1) return res.status(500).json({ success: false, message: 'No id column' });
    let deleted = 0;
    for (let i = rows.length - 1; i >= 0; i--) {
      if (rows[i][idIdx] === id) {
        const rowIdx = i + 2; // 1-based, plus header
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: SHEET_ID,
          requestBody: {
            requests: [{ deleteDimension: { range: { sheetId: 0, dimension: 'ROWS', startIndex: rowIdx - 1, endIndex: rowIdx } } }]
          }
        });
        deleted++;
      }
    }
    res.json({ success: true, message: 'deleted', deletedCount: deleted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Sheets proxy running on port ${PORT}`);
});
