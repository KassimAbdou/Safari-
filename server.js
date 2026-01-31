require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const chatRoutes = require('./routes/chat');
const driverRoutes = require('./routes/driver');
const geoRoutes = require('./routes/geo');
const rideRoutes = require('./routes/ride');
const transportRoutes = require('./routes/transport');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/geo', geoRoutes);
app.use('/api/ride', rideRoutes);
app.use('/api/transport', transportRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
