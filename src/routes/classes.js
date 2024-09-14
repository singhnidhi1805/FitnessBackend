const express = require('express');
const router = express.Router();
const Class = require('../models/Class');
const auth = require('../middleware/auth');

// Get all classes
router.get('/', async (req, res) => {
  try {
    const classes = await Class.find();
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new class (for admin use)
router.post('/', auth, async (req, res) => {
  const classData = new Class({
    type: req.body.type,
    date: req.body.date,
    time: req.body.time,
    capacity: req.body.capacity,
  });

  try {
    const newClass = await classData.save();
    res.status(201).json(newClass);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get available slots for a class
router.get('/:id/available-slots', async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id);
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }
    const availableSlots = classData.capacity - classData.bookedUsers.length;
    res.json({ availableSlots });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
