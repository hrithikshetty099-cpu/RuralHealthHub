import express from 'express';
import { pool } from '../db.js';
import auth, { requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const [users, doctors, hospitals, appointments] = await Promise.all([
      pool.query('SELECT COUNT(*) AS total FROM users'),
      pool.query('SELECT COUNT(*) AS total FROM doctors'),
      pool.query('SELECT COUNT(*) AS total FROM hospitals'),
      pool.query('SELECT COUNT(*) AS total FROM appointments'),
    ]);

    res.json({
      success: true,
      dashboard: {
        users: Number(users.rows[0].total),
        doctors: Number(doctors.rows[0].total),
        hospitals: Number(hospitals.rows[0].total),
        appointments: Number(appointments.rows[0].total),
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
