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

app.use(cors({
  origin: ['https://safari-kassim-abdous-projects.vercel.app/', 'http://localhost:3000'],
  credentials: true
}));


app.use(express.json());
app.use(express.static('image'));

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

// Exporter l'app pour Vercel si nécessaire
export default app;



app.get("/api/test-db", async (req, res) => {
  try {
    const result = await (await import("./db.js")).default.query("SELECT NOW()");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
