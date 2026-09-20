import express from 'express';
import { pool } from '../db.js';
import auth, { requireRole } from '../middleware/auth.js';

const router = express.Router();

const normalizeTime = (value) => {
  const match = String(value || '').trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return value;
  let hour = Number(match[1]);
  const minute = match[2];
  const meridiem = match[3]?.toUpperCase();
  if (meridiem === 'PM' && hour < 12) hour += 12;
  if (meridiem === 'AM' && hour === 12) hour = 0;
  return `${String(hour).padStart(2, '0')}:${minute}`;
};

router.get('/my', auth, (req, res, next) => {
  req.query.patientId = req.user.id;
  return router.handle(req, res, next);
});

router.get('/', auth, async (req, res, next) => {
  try {
    const { patientId, doctorId } = req.query;
    let query = `SELECT a.*, d.name AS doctor_name, d.specialization AS doctor_specialization,
      d.hospital AS hospital_name, d.location AS hospital_location, p.name AS patient_name,
      h.name AS linked_hospital_name
      FROM appointments a JOIN doctors d ON d.id = a.doctor_id
      JOIN users p ON p.id = a.patient_id LEFT JOIN hospitals h ON h.id = a.hospital_id`;
    const values = [];
    const conditions = [];

    if (req.user.role === 'patient') {
      conditions.push('a.patient_id = $' + (values.length + 1));
      values.push(req.user.id);
    }

    if (req.user.role === 'doctor') {
      conditions.push('d.user_id = $' + (values.length + 1));
      values.push(req.user.id);
    } else if (patientId) {
      conditions.push('a.patient_id = $' + (values.length + 1));
      values.push(patientId);
    }

    if (req.user.role === 'admin' && doctorId) {
      conditions.push('a.doctor_id = $' + (values.length + 1));
      values.push(doctorId);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY a.created_at DESC';

    const result = await pool.query(query, values);

    res.json({
      success: true,
      count: result.rows.length,
      appointments: result.rows,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', auth, async (req, res, next) => {
  try {
    const {
      doctor_id,
      appointment_date,
      appointment_time,
      consultation_type,
      notes,
      patient_id,
      hospital_id,
    } = req.body;

    const patientId = req.user.role === 'patient' ? req.user.id : patient_id;

    if (!doctor_id || !appointment_date || !appointment_time || !consultation_type) {
      return res.status(400).json({
        success: false,
        message: 'Doctor, date, time, and consultation type are required',
      });
    }

    if (!patientId && req.user.role !== 'patient') {
      return res.status(400).json({ success: false, message: 'Patient is required' });
    }

    const result = await pool.query(
      `
        INSERT INTO appointments (patient_id, doctor_id, hospital_id, appointment_date, appointment_time, consultation_type, notes, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
        RETURNING *
      `,
      [patientId, doctor_id, hospital_id || null, appointment_date, normalizeTime(appointment_time), consultation_type, notes || '']
    );

    res.status(201).json({
      success: true,
      appointment: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/status', auth, requireRole('admin', 'doctor'), async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required',
      });
    }

    const values = [status, req.params.id];
    let query = 'UPDATE appointments SET status = $1 WHERE id = $2';
    if (req.user.role === 'doctor') {
      query += ' AND doctor_id IN (SELECT id FROM doctors WHERE user_id = $3)';
      values.push(req.user.id);
    }
    query += ' RETURNING *';
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    res.json({
      success: true,
      appointment: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

export default router;
