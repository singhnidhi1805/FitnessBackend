const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const classesRouter = require('./routes/classes');
const bookingsRouter = require('./routes/bookings');
const usersRouter = require('./routes/users');

const app = express();

mongoose.connect('mongodb://localhost:27017/fitness-booking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());

app.use('/api/classes', classesRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/users', usersRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;