import express from 'express';
import { pool } from '../db.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res, next) => {
  try {
    let query = 'SELECT * FROM health_records';
    const values = [];

    if (req.user.role !== 'admin') {
      query += ' WHERE patient_id = $1';
      values.push(req.user.id);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, values);

    res.json({
      success: true,
      count: result.rows.length,
      records: result.rows,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', auth, async (req, res, next) => {
  try {
    const {
      doctor_name,
      hospital_name,
      visit_date,
      reason,
      notes,
      prescription,
      follow_up_date,
      patient_id,
    } = req.body;

    const patientId = req.user.role === 'patient' ? req.user.id : patient_id;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: 'Patient is required',
      });
    }

    const result = await pool.query(
      `
        INSERT INTO health_records (patient_id, doctor_name, hospital_name, visit_date, reason, notes, prescription, follow_up_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `,
      [patientId, doctor_name || '', hospital_name || '', visit_date || null, reason || '', notes || '', prescription || '', follow_up_date || null]
    );

    res.status(201).json({
      success: true,
      record: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

export default router;
