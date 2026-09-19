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
import prescriptionRoutes from './routes/prescriptions.js';
import medicineDeliveryRoutes from './routes/medicineDeliveries.js';
import pool, { checkDatabaseConnection } from './db.js';
import { WebSocketServer } from 'ws';
import http from 'http';

dotenv.config();

const app = express();
const httpServer = http.createServer(app);
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

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ success: true, message: 'Rural Health Hub backend is running', database: 'connected' });
  } catch (error) {
    console.error('Health check database error:', error);
    res.status(503).json({
      success: false,
      message: 'Rural Health Hub backend is running but database connection failed',
      database: 'disconnected',
      ...(process.env.NODE_ENV !== 'production' ? { error: error.message } : {}),
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/health-records', healthRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/medicine-deliveries', medicineDeliveryRoutes);
app.use('/api/medicines', medicineDeliveryRoutes);
app.use('/api/medicine-delivery', medicineDeliveryRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);

  if (err.code === '28P01' || err.code === '3D000') {
    return res.status(503).json({
      success: false,
      message: err.code === '28P01'
        ? 'PostgreSQL rejected the password in server/.env. Replace YOUR_POSTGRES_PASSWORD with your actual postgres password.'
        : 'The rural_health_hub database does not exist. Create it and run server/database.sql first.',
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
  });
});

const websocketServer = new WebSocketServer({ server: httpServer, path: '/ws' });
const rooms = new Map();

websocketServer.on('connection', (socket) => {
  let roomId;
  socket.on('message', (rawMessage) => {
    try {
      const message = JSON.parse(rawMessage.toString());
      if (message.type === 'join' && message.roomId) {
        roomId = message.roomId;
        const peers = rooms.get(roomId) || new Set();
        peers.forEach((peer) => peer.send(JSON.stringify({ type: 'peer-joined' })));
        peers.add(socket);
        rooms.set(roomId, peers);
        return;
      }

      const peers = rooms.get(roomId) || new Set();
      peers.forEach((peer) => {
        if (peer !== socket && peer.readyState === 1) peer.send(JSON.stringify(message));
      });
    } catch {
      socket.send(JSON.stringify({ type: 'error', message: 'Invalid signaling message' }));
    }
  });

  socket.on('close', () => {
    const peers = rooms.get(roomId);
    if (!peers) return;
    peers.delete(socket);
    peers.forEach((peer) => peer.send(JSON.stringify({ type: 'peer-left' })));
    if (peers.size === 0) rooms.delete(roomId);
  });
});

const startServer = async () => {
  try {
    await checkDatabaseConnection();
    httpServer.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
  } catch (error) {
    const databaseUrl = new URL(process.env.DATABASE_URL);
    console.error('DATABASE CONNECTION ERROR');
    console.error('Error code:', error.code || 'UNKNOWN');
    console.error('Error message:', error.message);
    console.error('Host:', databaseUrl.hostname);
    console.error('Port:', databaseUrl.port || '5432');
    console.error('Database:', databaseUrl.pathname.slice(1));
    if (error.code === '28P01') console.error('PostgreSQL rejected the password. Replace the placeholder in server/.env.');
    if (error.code === '3D000') console.error('The rural_health_hub database does not exist. Run server/create-database.sql.');
    if (error.code === 'ECONNREFUSED') console.error('PostgreSQL is not running or is using a different port.');
    if (error.code === 'ENOTFOUND') console.error('The PostgreSQL hostname could not be resolved.');
    process.exit(1);
  }
};

startServer();
