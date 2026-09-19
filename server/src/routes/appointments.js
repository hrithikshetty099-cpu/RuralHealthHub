import express from 'express';
import { pool } from '../db.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res, next) => {
  try {
    const { patientId, doctorId } = req.query;
    let query = `SELECT a.*, d.name AS doctor_name, d.specialization AS doctor_specialization,
      d.hospital AS hospital_name, d.location AS hospital_location
      FROM appointments a JOIN doctors d ON d.id = a.doctor_id`;
    const values = [];
    const conditions = [];

    if (req.user.role === 'patient' && !patientId) {
      conditions.push('a.patient_id = $' + (values.length + 1));
      values.push(req.user.id);
    }

    if (patientId) {
      conditions.push('a.patient_id = $' + (values.length + 1));
      values.push(patientId);
    }

    if (doctorId) {
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
    } = req.body;

    const patientId = req.user.role === 'patient' ? req.user.id : patient_id;

    if (!doctor_id || !appointment_date || !appointment_time || !consultation_type) {
      return res.status(400).json({
        success: false,
        message: 'Doctor, date, time, and consultation type are required',
      });
    }

    const result = await pool.query(
      `
        INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, consultation_type, notes, status)
        VALUES ($1, $2, $3, $4, $5, $6, 'pending')
        RETURNING *
      `,
      [patientId, doctor_id, appointment_date, appointment_time, consultation_type, notes || '']
    );

    res.status(201).json({
      success: true,
      appointment: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/status', auth, async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required',
      });
    }

    const result = await pool.query(
      'UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );

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
