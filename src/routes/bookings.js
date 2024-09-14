const express = require('express');
const router = express.Router();
const Class = require('../models/Class');
const auth = require('../middleware/auth');
const { isWithin30Minutes } = require('../utils/helpers');

// Book a class
router.post('/book', auth, async (req, res) => {
  try {
    const classId = req.body.classId;
    const userId = req.user._id;

    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    if (classData.bookedUsers.includes(userId)) {
      return res.status(400).json({ message: 'You have already booked this class' });
    }

    if (classData.bookedUsers.length < classData.capacity) {
      classData.bookedUsers.push(userId);
      await classData.save();
      res.json({ message: 'Class booked successfully' });
    } else {
      classData.waitlist.push(userId);
      await classData.save();
      res.json({ message: 'Added to waitlist' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cancel a booking
router.post('/cancel', auth, async (req, res) => {
  try {
    const classId = req.body.classId;
    const userId = req.user._id;

    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    if (!isWithin30Minutes(classData.date, classData.time)) {
      return res.status(400).json({ message: 'Cannot cancel within 30 minutes of class start' });
    }

    const userIndex = classData.bookedUsers.indexOf(userId);
    if (userIndex > -1) {
      classData.bookedUsers.splice(userIndex, 1);
      
      // Allocate to first person in waitlist
      if (classData.waitlist.length > 0) {
        const nextUser = classData.waitlist.shift();
        classData.bookedUsers.push(nextUser);
      }

      await classData.save();
      res.json({ message: 'Booking cancelled successfully' });
    } else {
      res.status(400).json({ message: 'You are not booked for this class' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user's bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const bookings = await Class.find({ bookedUsers: userId })
      .select('type date time');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;