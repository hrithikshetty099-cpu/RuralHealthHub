import express from 'express';
import { pool } from '../db.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res, next) => {
  try {
    let query = 'SELECT * FROM consultations';
    const values = [];

    if (req.user.role === 'patient') {
      query += ' WHERE patient_id = $1';
      values.push(req.user.id);
    }

    if (req.user.role === 'doctor') {
      query += ' WHERE doctor_id = $1';
      values.push(req.user.id);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, values);

    res.json({
      success: true,
      count: result.rows.length,
      consultations: result.rows,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', auth, async (req, res, next) => {
  try {
    const { appointment_id, patient_id, doctor_id, room_id, status } = req.body;

    if (!room_id || !patient_id || !doctor_id) {
      return res.status(400).json({
        success: false,
        message: 'Room ID, patient ID, and doctor ID are required',
      });
    }

    const result = await pool.query(
      `
        INSERT INTO consultations (appointment_id, patient_id, doctor_id, room_id, status, started_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
        RETURNING *
      `,
      [appointment_id || null, patient_id, doctor_id, room_id, status || 'waiting']
    );

    res.status(201).json({
      success: true,
      consultation: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

export default router;
