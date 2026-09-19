import express from 'express';
import { pool } from '../db.js';
import auth, { requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT p.*, d.name AS doctor_name
       FROM prescriptions p JOIN doctors d ON d.id = p.doctor_id
       WHERE p.patient_id = $1 OR $2 = 'doctor'
       ORDER BY p.created_at DESC`,
      [req.user.id, req.user.role]
    );
    res.json({ success: true, prescriptions: result.rows });
  } catch (error) {
    next(error);
  }
});

router.post('/', auth, requireRole('doctor', 'admin'), async (req, res, next) => {
  try {
    const { consultation_id, patient_id, doctor_id, medicines, instructions, follow_up_date } = req.body;
    if (!patient_id || !doctor_id || !medicines?.trim()) {
      return res.status(400).json({ success: false, message: 'Patient, doctor, and medicines are required' });
    }
    const result = await pool.query(
      `INSERT INTO prescriptions (consultation_id, patient_id, doctor_id, medicines, instructions, follow_up_date)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [consultation_id || null, patient_id, doctor_id, medicines.trim(), instructions || '', follow_up_date || null]
    );
    res.status(201).json({ success: true, prescription: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

export default router;