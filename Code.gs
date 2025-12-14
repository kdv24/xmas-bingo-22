// Google Apps Script Web App for theme management
// Paste this into a new Apps Script project and set SPREADSHEET_ID

const SPREADSHEET_ID = '11VY5MoevyaeZNcvBoP7f7QP1F23mhgoI7O4SARh71vs'; // <-- Google Sheets DB id from URL
const THEMES_SHEET_NAME = 'themes'; // sheet name containing theme rows
const DELETE_SECRET = ''; // optional: set to a shared secret to require for mutating actions

/**
 * doGet handles simple list requests e.g. ?action=list
 */
function doGet(e) {
  try {
    const params = e.parameter || {};
    const action = (params.action || 'list').toString();
    if (action === 'list') {
      return jsonResponse({ themes: listThemes() });
    }
    return jsonResponse({ success: false, message: 'Unknown action' }, 400);
  } catch (err) {
    return jsonResponse({ success: false, message: String(err) }, 500);
  }
}

/**
 * doPost handles form-data or JSON POSTs with actions: delete, add, update, list
 */
function doPost(e) {
  try {
    const body = parsePostData(e) || {};
    const action = (body.action || '').toString();

    // lightweight request logging (avoid printing secrets/large arrays)
    try { appLog('info', 'doPost', { action: action, body: summarizeBody(body) }); } catch (e) { /* ignore logging errors */ }

    // Protect mutating actions if DELETE_SECRET is set
    if (DELETE_SECRET && ['delete', 'add', 'update'].indexOf(action) !== -1) {
      if (!body.secret || body.secret.toString() !== DELETE_SECRET) {
        try { appLog('warn', 'invalid secret for mutating action', { action: action, body: summarizeBody(body) }); } catch (e) {}
        return jsonResponse({ success: false, message: 'invalid secret' }, 403);
      }
    }

    switch (action) {
      case 'test': {
        // non-mutating test endpoint to verify POSTs reach the script
        return jsonResponse({ success: true, message: 'post-received', body: summarizeBody(body) });
      }
      case 'delete': {
        // accept id or themeName (or identifier) from the client; trim and null-safe
        const identifier = (body.id || body.identifier || body.themeName || '').toString().trim() || null;
        return jsonResponse(deleteTheme(identifier));
      }
      case 'add': {
        // theme may be sent as JSON string in 'theme' or as object in body.themeObj
        // also accept flat form fields: themeName + wordArrays
        const maybe = tryParseMaybe(body.theme) || body.themeObj || (body.themeName ? { themeName: body.themeName, wordArrays: tryParseMaybe(body.wordArrays) || {} } : null);
        if (!maybe || !maybe.themeName) return jsonResponse({ success: false, message: 'missing theme payload or themeName' }, 400);
        return jsonResponse(addTheme(maybe));
      }
      case 'update': {
        const maybe = tryParseMaybe(body.theme) || body.themeObj || (body.themeName ? { id: body.id, themeName: body.themeName, wordArrays: tryParseMaybe(body.wordArrays) || {}, originalName: body.originalName } : null);
        if (!maybe || !maybe.themeName) return jsonResponse({ success: false, message: 'missing theme payload or themeName' }, 400);
        return jsonResponse(updateTheme(maybe));
      }
      case 'list': {
        return jsonResponse({ themes: listThemes() });
      }
      default:
        return jsonResponse({ success: false, message: 'Unknown action' }, 400);
    }
  } catch (err) {
    return jsonResponse({ success: false, message: String(err) }, 500);
  }
}

// ---- helpers
function parsePostData(e) {
  // Prefer parsed JSON when available
  try {
    if (e.postData && e.postData.type && e.postData.type.indexOf('application/json') !== -1) {
      return JSON.parse(e.postData.contents || '{}');
    }
  } catch (err) {
    // fall through
  }

  // If parameters (form-data) are present, use them
  if (e.parameter && Object.keys(e.parameter).length) {
    return e.parameter;
  }

  // If postData.contents exists, try to parse it
  try {
    if (e.postData && e.postData.contents) {
      return JSON.parse(e.postData.contents);
    }
  } catch (err) {
    // not JSON, parse as URL-encoded form? return parameter-less object
  }

  return {};
}

function tryParseMaybe(v) {
  if (!v) return null;
  if (typeof v === 'object') return v;
  try { return JSON.parse(v); } catch (e) { return null; }
}

function jsonResponse(obj, code) {
  // attach statusCode to the response body when provided so clients can inspect it
  if (typeof code !== 'undefined' && obj && typeof obj === 'object') {
    try { obj.statusCode = code; } catch (e) { /* ignore */ }
  }
  const output = ContentService.createTextOutput(JSON.stringify(obj));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

/**
 * Lightweight application logger.
 * - Writes to Apps Script Logger (visible in Execution logs)
 * - Optionally appends to a sheet named 'logs' for persistent records (if present)
 * level: 'debug'|'info'|'warn'|'error'
 */
function appLog(level, message, meta) {
  try {
    const ts = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'UTC', "yyyy-MM-dd'T'HH:mm:ss'Z'");
    const entry = { ts: ts, level: level, message: message, meta: meta || {} };
    // Prefer concise single-line JSON in the execution log
    try { Logger.log(JSON.stringify(entry)); } catch (e) { Logger.log(String(entry)); }

    // If a 'logs' sheet exists, append a row: ts, level, message, meta-json
    try {
      const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      const logSheet = ss.getSheetByName('logs');
      if (logSheet) {
        const metaJson = JSON.stringify(meta || {});
        logSheet.appendRow([ts, level, message, metaJson]);
      }
    } catch (e) {
      // ignore sheet logging errors (may not have permission or sheet)
    }
  } catch (err) {
    // swallow logging errors to avoid affecting main flow
  }
}

/**
 * Summarize the parsed POST body safely for logging. Masks secrets and
 * avoids including large arrays (only returns sizes or keys).
 */
function summarizeBody(body) {
  if (!body || typeof body !== 'object') return body;
  const out = {};
  // Copy top-level known fields safely
  if (body.action) out.action = body.action;
  if (body.id) out.id = ('' + body.id).slice(0, 64);
  if (body.identifier) out.identifier = ('' + body.identifier).slice(0, 64);
  if (body.theme) {
    // theme may be a JSON string or object — extract themeName only
    const themeObj = tryParseMaybe(body.theme) || body.theme;
    if (themeObj && typeof themeObj === 'object') {
      out.themeName = themeObj.themeName || null;
      // indicate presence/size of wordArrays without serializing them
      if (themeObj.wordArrays && typeof themeObj.wordArrays === 'object') {
        out.wordArraysKeys = Object.keys(themeObj.wordArrays);
      }
    } else if (typeof body.theme === 'string') {
      // don't include full string (might be large); show prefix
      out.theme = body.theme.slice(0, 200);
    }
  }
  // Always mask secret-like fields
  if (body.secret) out.secret = '***';
  if (body.DELETE_SECRET) out.DELETE_SECRET = '***';
  return out;
}

function openSheet_() {
  if (!SPREADSHEET_ID || SPREADSHEET_ID.indexOf('PUT_YOUR') === 0) throw new Error('SPREADSHEET_ID not set in Code.gs');
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(THEMES_SHEET_NAME);
  if (!sheet) {
    // create sheet if missing
    sheet = ss.insertSheet(THEMES_SHEET_NAME);
    // header row - add an id column as the first column for stable identity
    sheet.getRange(1,1,1,5).setValues([['id','createdAt','themeName','wordArrays','backgroundColor']]);
  } else {
    // ensure header contains id column (migrate if necessary)
    const header = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
    if (header.indexOf('id') === -1) {
      // insert a new first column and add ids for existing rows
      sheet.insertColumnBefore(1);
      sheet.getRange(1,1).setValue('id');
      const lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        const idRange = sheet.getRange(2,1,lastRow-1,1);
        const ids = [];
        for (let r = 0; r < lastRow-1; r++) {
          ids.push([Utilities.getUuid()]);
        }
        idRange.setValues(ids);
      }
    }
  }
  return sheet;
}

function listThemes() {
  try {
    const sheet = openSheet_();
    const values = sheet.getDataRange().getValues();
    const rows = [];
    for (let i = 0; i < values.length; i++) {
      const r = values[i];
      // skip header if it looks like a header row
      if (i === 0 && (String(r[0]).toLowerCase().indexOf('created') !== -1 || String(r[1]).toLowerCase().indexOf('theme') !== -1)) continue;
      // With migration, columns are: id, createdAt, themeName, wordArrays, backgroundColor
      const id = r[0] || '';
      const createdAt = r[1] || '';
      let themeName = (r[2] || '').toString().trim();
      let wordArrays = {};
      try { wordArrays = r[3] ? (typeof r[3] === 'object' ? r[3] : JSON.parse(r[3])) : {}; } catch (e) { wordArrays = {}; }
      const backgroundColor = r[4] || '';
      if (!themeName) continue;
      rows.push({ id: id, themeName: themeName, wordArrays: wordArrays, backgroundColor: backgroundColor, createdAt: createdAt });
    }
    return rows;
  } catch (err) {
    return [];
  }
}

function addTheme(themeObj) {
  if (!themeObj || !themeObj.themeName) return { success: false, message: 'invalid theme' };
  const sheet = openSheet_();
  const now = new Date().toISOString();
  try {
    // If sheet has id column (migrated), include a UUID as first column
    const hasId = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0].indexOf('id') !== -1;
    const row = hasId
      ? [Utilities.getUuid(), now, themeObj.themeName, JSON.stringify(themeObj.wordArrays || {}), themeObj.backgroundColor || '']
      : [now, themeObj.themeName, JSON.stringify(themeObj.wordArrays || {}), themeObj.backgroundColor || ''];
    sheet.appendRow(row);
    return { success: true, message: 'added' };
  } catch (err) {
    return { success: false, message: String(err) };
  }
}

function updateTheme(themeObj) {
  if (!themeObj || !themeObj.themeName) return { success: false, message: 'invalid theme' };
  const sheet = openSheet_();
  const values = sheet.getDataRange().getValues();

  const targetId = themeObj.id ? ('' + themeObj.id).toString().trim() : null;
  const targetName = ('' + themeObj.themeName).toString().trim();
  const originalName = themeObj.originalName ? ('' + themeObj.originalName).toString().trim() : null;

  for (let i = 0; i < values.length; i++) {
    const r = values[i];
    // detect header row
    if (i === 0 && (String(r[0]).toLowerCase().indexOf('id') !== -1 || String(r[1]).toLowerCase().indexOf('created') !== -1)) continue;
    // columns: id, createdAt, themeName, wordArrays, backgroundColor
    const existingId = (r[0] || '').toString().trim();
    const existingName = (r[2] || '').toString().trim() || (r[1] || '').toString().trim();

    // match by id first, then originalName (if provided), then themeName
    if (
      (targetId && existingId === targetId) ||
      (originalName && existingName === originalName) ||
      (!targetId && !originalName && existingName === targetName)
    ) {
      try {
        const rowIndex = i + 1;
        // set themeName, wordArrays, backgroundColor in their columns
        sheet.getRange(rowIndex, 3).setValue(themeObj.themeName);
        sheet.getRange(rowIndex, 4).setValue(JSON.stringify(themeObj.wordArrays || {}));
        sheet.getRange(rowIndex, 5).setValue(themeObj.backgroundColor || '');
        return { success: true, message: 'updated' };
      } catch (err) {
        return { success: false, message: String(err) };
      }
    }
  }
  // If not found, append as new
  return addTheme(themeObj);
}

function deleteTheme(identifier) {
  // identifier may be an id or a themeName
  if (!identifier) return { success: false, message: 'missing identifier' };
  const idCandidate = ('' + identifier).toString().trim();
  const sheet = openSheet_();
  const values = sheet.getDataRange().getValues();
  let deleted = 0;
  // iterate bottom-up so deleting rows doesn't shift earlier indices
  for (let i = values.length - 1; i >= 0; i--) {
    const r = values[i];
    // skip header
    if (i === 0 && (String(r[0]).toLowerCase().indexOf('id') !== -1 || String(r[1]).toLowerCase().indexOf('created') !== -1)) continue;
    const existingId = (r[0] || '').toString().trim();
    const existingName = (r[2] || '').toString().trim() || (r[1] || '').toString().trim();
    if (existingId === idCandidate || existingName === idCandidate) {
      sheet.deleteRow(i + 1);
      deleted++;
    }
  }
  return { success: true, message: 'deleted', deletedCount: deleted };
}
