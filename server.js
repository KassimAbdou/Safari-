import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import chatRoutes from './routes/chat.js';
import driverRoutes from './routes/driver.js';
import geoRoutes from './routes/geo.js';
import rideRoutes from './routes/ride.js';
import transportRoutes from './routes/transport.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/geo', geoRoutes);
app.use('/api/ride', rideRoutes);
app.use('/api/transport', transportRoutes);

// Exporter l'app pour Vercel
export default app;
