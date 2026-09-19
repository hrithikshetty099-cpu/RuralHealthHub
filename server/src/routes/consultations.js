import express from 'express';
import { pool } from '../db.js';
import auth, { requireRole } from '../middleware/auth.js';

const router = express.Router();

const accessCondition = (user, values) => {
  if (user.role === 'patient') {
    values.push(user.id);
    return `c.patient_id = $${values.length}`;
  }
  if (user.role === 'doctor') {
    values.push(user.id);
    return `d.user_id = $${values.length}`;
  }
  return 'TRUE';
};

router.get('/', auth, async (req, res, next) => {
  try {
    const values = [];
    const result = await pool.query(`SELECT c.*, d.name AS doctor_name, u.name AS patient_name
      FROM consultations c JOIN doctors d ON d.id = c.doctor_id JOIN users u ON u.id = c.patient_id
      WHERE ${accessCondition(req.user, values)} ORDER BY c.created_at DESC`, values);
    res.json({ success: true, count: result.rows.length, consultations: result.rows });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', auth, async (req, res, next) => {
  try {
    const values = [req.params.id];
    const result = await pool.query(`SELECT c.*, d.name AS doctor_name, u.name AS patient_name
      FROM consultations c JOIN doctors d ON d.id = c.doctor_id JOIN users u ON u.id = c.patient_id
      WHERE c.id = $1 AND ${accessCondition(req.user, values)}`, values);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Consultation not found' });
    res.json({ success: true, consultation: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

router.post('/', auth, async (req, res, next) => {
  try {
    const { appointment_id, room_id } = req.body;
    if (!appointment_id) return res.status(400).json({ success: false, message: 'Appointment is required' });
    const appointment = await pool.query(`SELECT a.*, d.user_id AS doctor_user_id FROM appointments a
      JOIN doctors d ON d.id = a.doctor_id WHERE a.id = $1`, [appointment_id]);
    if (appointment.rows.length === 0) return res.status(404).json({ success: false, message: 'Appointment not found' });
    const record = appointment.rows[0];
    const allowed = req.user.role === 'admin' || (req.user.role === 'patient' && record.patient_id === req.user.id)
      || (req.user.role === 'doctor' && record.doctor_user_id === req.user.id);
    if (!allowed) return res.status(403).json({ success: false, message: 'You cannot join this consultation' });
    const existing = await pool.query('SELECT * FROM consultations WHERE appointment_id = $1', [appointment_id]);
    if (existing.rows.length > 0) return res.json({ success: true, consultation: existing.rows[0] });
    const result = await pool.query(`INSERT INTO consultations (appointment_id, patient_id, doctor_id, room_id, status)
      VALUES ($1, $2, $3, $4, 'scheduled') RETURNING *`,
    [appointment_id, record.patient_id, record.doctor_id, room_id || `consultation-${appointment_id}`]);
    res.status(201).json({ success: true, consultation: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/join', auth, async (req, res, next) => {
  try {
    const values = [req.params.id];
    const access = accessCondition(req.user, values);
    const result = await pool.query(`UPDATE consultations c SET status = 'active', started_at = COALESCE(started_at, NOW())
      FROM doctors d WHERE c.doctor_id = d.id AND c.id = $1 AND ${access} RETURNING c.*`, values);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Consultation not found or access denied' });
    res.json({ success: true, consultation: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/end', auth, requireRole('doctor', 'admin'), async (req, res, next) => {
  try {
    const result = await pool.query(`UPDATE consultations SET status = 'completed', ended_at = NOW()
      WHERE id = $1 RETURNING *`, [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Consultation not found' });
    res.json({ success: true, consultation: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', auth, requireRole('doctor', 'admin'), async (req, res, next) => {
  try {
    const { status, doctor_notes, diagnosis, follow_up_instructions, follow_up_date } = req.body;
    if (!['scheduled', 'active', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid consultation status' });
    }
    const values = [status, doctor_notes || '', diagnosis || '', follow_up_instructions || '', follow_up_date || null, req.params.id];
    let query = `UPDATE consultations SET status = $1, doctor_notes = $2, diagnosis = $3,
      follow_up_instructions = $4, follow_up_date = $5,
      started_at = CASE WHEN $1 = 'active' AND started_at IS NULL THEN NOW() ELSE started_at END,
      ended_at = CASE WHEN $1 IN ('completed', 'cancelled') THEN NOW() ELSE ended_at END WHERE id = $6`;
    if (req.user.role === 'doctor') {
      query += ' AND doctor_id IN (SELECT id FROM doctors WHERE user_id = $7)';
      values.push(req.user.id);
    }
    const result = await pool.query(`${query} RETURNING *`, values);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Consultation not found' });
    if (status === 'completed') {
      const completed = result.rows[0];
      await pool.query(`INSERT INTO health_records
        (consultation_id, patient_id, doctor_name, visit_date, reason, notes, follow_up_date)
        SELECT $1, c.patient_id, d.name, CURRENT_DATE, c.diagnosis, c.doctor_notes || E'\n' || c.follow_up_instructions, c.follow_up_date
        FROM consultations c JOIN doctors d ON d.id = c.doctor_id WHERE c.id = $1`, [completed.id]);
    }
    res.json({ success: true, consultation: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

export default router;
