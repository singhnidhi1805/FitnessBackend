const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['yoga', 'gym', 'dance'],
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  bookedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  waitlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
});

module.exports = mongoose.model('Class', ClassSchema);