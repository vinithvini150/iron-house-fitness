const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  phone: { type: String, required: true, trim: true, maxlength: 20 },
  email: { type: String, trim: true, lowercase: true, maxlength: 150 },
  goal: { type: String, trim: true, maxlength: 100 },
  plan: { type: String, trim: true, maxlength: 100 },
  message: { type: String, trim: true, maxlength: 1500 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Enquiry || mongoose.model('Enquiry', enquirySchema);
