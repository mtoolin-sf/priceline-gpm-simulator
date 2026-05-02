const fetch = require('node-fetch');
const { execSync } = require('child_process');

let cachedToken = null;
let tokenExpiry = 0;

async function getSFToken() {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  // Client credentials mode (Heroku/production)
  if (process.env.SF_CLIENT_ID && process.env.SF_CLIENT_SECRET) {
    const params = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.SF_CLIENT_ID,
      client_secret: process.env.SF_CLIENT_SECRET,
    });
    const res = await fetch(`${process.env.SF_INSTANCE_URL}/services/oauth2/token`, {
      method: 'POST',
      body: params,
    });
    if (!res.ok) throw new Error(`SF auth failed: ${await res.text()}`);
    const data = await res.json();
    cachedToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in || 3600) * 1000 - 60000;
    return cachedToken;
  }

  // Direct token mode (local dev — token from .env)
  if (process.env.SF_ACCESS_TOKEN) {
    cachedToken = process.env.SF_ACCESS_TOKEN;
    tokenExpiry = Date.now() + 50 * 60 * 1000;
    return cachedToken;
  }

  throw new Error('No SF auth configured. Set SF_CLIENT_ID/SF_CLIENT_SECRET or SF_ORG_ALIAS.');
}

function clearToken() {
  cachedToken = null;
  tokenExpiry = 0;
}

module.exports = { getSFToken, clearToken };
