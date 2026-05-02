const express = require('express');
const router = express.Router();
const multer = require('multer');
const fetch = require('node-fetch');
const sharp = require('sharp');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/upload-logo', upload.single('logo'), async (req, res, next) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    const { data, info } = await sharp(req.file.buffer)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const processed = Buffer.from(data);
    const { width, height, channels } = info;

    // Remove near-white background
    for (let i = 0; i < processed.length; i += channels) {
      const r = processed[i], g = processed[i + 1], b = processed[i + 2];
      if (r > 230 && g > 230 && b > 230) processed[i + 3] = 0;
    }

    const pngBuffer = await sharp(processed, { raw: { width, height, channels } })
      .png()
      .toBuffer();

    res.json({ dataUrl: `data:image/png;base64,${pngBuffer.toString('base64')}` });
  } catch (err) {
    next(err);
  }
});

router.post('/scrape', async (req, res, next) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL required' });

  try {
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PricelineGPMDemo/1.0)' },
      timeout: 8000,
    });
    const html = await resp.text();

    const colorRegex = /#([0-9A-Fa-f]{6})\b/g;
    const freq = {};
    let m;
    while ((m = colorRegex.exec(html)) !== null) {
      const hex = '#' + m[1].toUpperCase();
      // Skip near-white and near-black
      const r = parseInt(m[1].slice(0,2), 16), g = parseInt(m[1].slice(2,4), 16), b = parseInt(m[1].slice(4,6), 16);
      if ((r > 240 && g > 240 && b > 240) || (r < 15 && g < 15 && b < 15)) continue;
      freq[hex] = (freq[hex] || 0) + 1;
    }

    const colors = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([hex]) => hex);

    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const descMatch = html.match(/meta[^>]*name=["']description["'][^>]*content=["']([^"']+)/i);

    res.json({ colors, title: titleMatch?.[1] || '', description: descMatch?.[1] || '' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
