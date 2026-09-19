import express from 'express';
import { pool } from '../db.js';
import auth, { requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/users', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const result = await pool.query('SELECT id, name, email, role, phone, village, district, created_at FROM users ORDER BY created_at DESC');
    res.json({ success: true, users: result.rows });
  } catch (error) { next(error); }
});

router.get('/doctors', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM doctors ORDER BY created_at DESC');
    res.json({ success: true, doctors: result.rows });
  } catch (error) { next(error); }
});

router.get('/hospitals', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM hospitals ORDER BY created_at DESC');
    res.json({ success: true, hospitals: result.rows });
  } catch (error) { next(error); }
});

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

router.patch('/doctors/:id', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const { is_available, consultation_fee, available_time, hospital_id } = req.body;
    const result = await pool.query(`UPDATE doctors SET is_available = COALESCE($1, is_available),
      consultation_fee = COALESCE($2, consultation_fee), available_time = COALESCE($3, available_time),
      hospital_id = COALESCE($4, hospital_id) WHERE id = $5 RETURNING *`,
    [is_available, consultation_fee, available_time, hospital_id, req.params.id]);
    if (!result.rows.length) return res.status(404).json({ success: false, message: 'Doctor not found' });
    res.json({ success: true, doctor: result.rows[0] });
  } catch (error) { next(error); }
});

router.delete('/doctors/:id', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const result = await pool.query('DELETE FROM doctors WHERE id = $1 RETURNING id', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ success: false, message: 'Doctor not found' });
    res.json({ success: true, message: 'Doctor removed' });
  } catch (error) { next(error); }
});

router.patch('/hospitals/:id', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const { phone, services, opening_hours, distance } = req.body;
    const result = await pool.query(`UPDATE hospitals SET phone = COALESCE($1, phone), services = COALESCE($2, services),
      opening_hours = COALESCE($3, opening_hours), distance = COALESCE($4, distance) WHERE id = $5 RETURNING *`,
    [phone, services, opening_hours, distance, req.params.id]);
    if (!result.rows.length) return res.status(404).json({ success: false, message: 'Hospital not found' });
    res.json({ success: true, hospital: result.rows[0] });
  } catch (error) { next(error); }
});

router.delete('/hospitals/:id', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const result = await pool.query('DELETE FROM hospitals WHERE id = $1 RETURNING id', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ success: false, message: 'Hospital not found' });
    res.json({ success: true, message: 'Hospital removed' });
  } catch (error) { next(error); }
});

export default router;
