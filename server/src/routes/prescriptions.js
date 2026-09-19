import express from 'express';
import { pool } from '../db.js';
import auth, { requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/my', auth, async (req, res, next) => {
  req.url = '/';
  return router.handle(req, res, next);
});

router.get('/', auth, async (req, res, next) => {
  try {
    const result = await pool.query(
        `SELECT p.*, d.name AS doctor_name
       FROM prescriptions p JOIN doctors d ON d.id = p.doctor_id
         WHERE p.patient_id = $1
          OR ( $2 = 'doctor' AND d.user_id = $1 )
          OR $2 = 'admin'
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
    const { consultation_id, patient_id, doctor_id, medicines, medicine_name, dosage, frequency, duration, instructions, follow_up_date } = req.body;
    if (!patient_id || !doctor_id || !medicines?.trim()) {
      return res.status(400).json({ success: false, message: 'Patient, doctor, and medicines are required' });
    }
    if (req.user.role === 'doctor') {
      const doctor = await pool.query('SELECT id FROM doctors WHERE id = $1 AND user_id = $2', [doctor_id, req.user.id]);
      if (doctor.rows.length === 0) return res.status(403).json({ success: false, message: 'You cannot prescribe for this doctor record' });
    }
    const result = await pool.query(`INSERT INTO prescriptions
      (consultation_id, patient_id, doctor_id, medicines, medicine_name, dosage, frequency, duration, instructions, follow_up_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
    [consultation_id || null, patient_id, doctor_id, medicines.trim(), medicine_name || null, dosage || null, frequency || null, duration || null, instructions || '', follow_up_date || null]);
    res.status(201).json({ success: true, prescription: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

export default router;