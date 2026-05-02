const fetch = require('node-fetch');
const { getSFToken } = require('../auth');

const BASE = () => `${process.env.SF_INSTANCE_URL}/services/data/${process.env.SF_API_VERSION}`;

async function sfApiRequest(path, method = 'POST', body = null) {
  const token = await getSFToken();
  const opts = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE()}${path}`, opts);
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }

  if (res.status !== 200 && res.status !== 201) {
    throw Object.assign(new Error(`SF API ${res.status}`), { status: res.status, data: json });
  }
  return json;
}

async function sfApiGet(path) {
  return sfApiRequest(path, 'GET');
}

module.exports = { sfApiRequest, sfApiGet };
