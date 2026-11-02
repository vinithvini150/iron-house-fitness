require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const enquiryRoutes = require('./server/routes/enquiries');

const app = express();
let connectionPromise;

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

async function connectMongo() {
  if (mongoose.connection.readyState === 1) return;
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is missing.');
  }
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGODB_URI)
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }
  await connectionPromise;
}

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Iron House Fitness API is running.' });
});

app.use('/api/enquiries', async (_req, res, next) => {
  try {
    await connectMongo();
    next();
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    res.status(503).json({
      success: false,
      message: 'Enquiry service is temporarily unavailable. Please try again later.'
    });
  }
});

app.use('/api/enquiries', enquiryRoutes);

// Local fallback for direct Express use. Vercel serves /public assets as static files.
if (process.env.VERCEL !== '1') {
  const path = require('node:path');
  app.use(express.static(path.join(__dirname, 'public')));
  app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));
}

module.exports = app;
