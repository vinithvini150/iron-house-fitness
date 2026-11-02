const express = require('express');
const Enquiry = require('../models/Enquiry');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, phone, email, goal, plan, message } = req.body || {};

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name and phone number are required.'
      });
    }

    const enquiry = await Enquiry.create({
      name,
      phone,
      email,
      goal,
      plan,
      message
    });

    return res.status(201).json({
      success: true,
      message: 'Thanks! Your enquiry has been received. Our team will contact you soon.',
      id: enquiry._id
    });
  } catch (error) {
    console.error('Enquiry error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Unable to submit your enquiry right now.'
    });
  }
});

module.exports = router;
