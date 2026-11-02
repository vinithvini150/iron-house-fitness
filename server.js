
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('node:path');
const enquiryRoutes = require('./server/routes/enquiries');

const app = express();
const publicPath = path.join(__dirname, 'public');

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

// API health check
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Iron House Fitness API is running.'
  });
});

// MongoDB connection for enquiries
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

// Serve homepage
app.get('/', (_req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Serve CSS, JavaScript and all other HTML pages
app.use(express.static(publicPath));

module.exports = app;
