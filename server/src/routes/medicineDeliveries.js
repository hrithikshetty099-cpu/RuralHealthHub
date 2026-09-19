import express from 'express';
import { pool } from '../db.js';
import auth, { requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT md.*, p.medicines, p.instructions, p.follow_up_date, d.name AS doctor_name
       FROM medicine_deliveries md
       JOIN prescriptions p ON p.id = md.prescription_id
       JOIN doctors d ON d.id = p.doctor_id
       WHERE md.patient_id = $1 ORDER BY md.created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, deliveries: result.rows });
  } catch (error) {
    next(error);
  }
});

router.post('/', auth, async (req, res, next) => {
  try {
    const { prescription_id, delivery_address, latitude, longitude } = req.body;
    if (!prescription_id || !delivery_address?.trim()) {
      return res.status(400).json({ success: false, message: 'Prescription and delivery address are required' });
    }
    const prescription = await pool.query('SELECT id FROM prescriptions WHERE id = $1 AND patient_id = $2', [prescription_id, req.user.id]);
    if (prescription.rows.length === 0) return res.status(404).json({ success: false, message: 'Prescription not found' });
    const result = await pool.query(
      `INSERT INTO medicine_deliveries (prescription_id, patient_id, delivery_address, latitude, longitude)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [prescription_id, req.user.id, delivery_address.trim(), latitude || null, longitude || null]
    );
    res.status(201).json({ success: true, delivery: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/status', auth, requireRole('doctor', 'admin'), async (req, res, next) => {
  try {
    const { status } = req.body;
    const result = await pool.query(
      'UPDATE medicine_deliveries SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Delivery not found' });
    res.json({ success: true, delivery: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

export default router;