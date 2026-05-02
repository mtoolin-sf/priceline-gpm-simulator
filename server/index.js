require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// API routes
app.use('/api/products', require('./routes/products'));
app.use('/api/profiles', require('./routes/profiles'));
app.use('/api/promotions', require('./routes/promotions'));
app.use('/api/loyalty', require('./routes/loyalty'));
app.use('/api/blm', require('./routes/blm'));
app.use('/api/brand', require('./routes/brand'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Serve React build in production
const distPath = path.join(__dirname, '../client/dist');
app.use(express.static(distPath));
app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));

app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Priceline GPM Simulator running on :${PORT}`));
