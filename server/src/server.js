import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import doctorRoutes from './routes/doctors.js';
import hospitalRoutes from './routes/hospitals.js';
import appointmentRoutes from './routes/appointments.js';
import healthRoutes from './routes/health.js';
import adminRoutes from './routes/admin.js';
import consultationRoutes from './routes/consultations.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

const allowedOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Rural Health Hub API is running',
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Rural Health Hub backend is running',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/health-records', healthRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/consultations', consultationRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
  });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
