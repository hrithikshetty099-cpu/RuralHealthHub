import express from 'express';
import { pool } from '../db.js';
import auth, { requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { specialization, location, available } = req.query;

    let query = 'SELECT * FROM doctors';
    const values = [];
    const conditions = [];

    if (specialization) {
      conditions.push(`specialization ILIKE $${values.length + 1}`);
      values.push(`%${specialization}%`);
    }

    if (location) {
      conditions.push(`location ILIKE $${values.length + 1}`);
      values.push(`%${location}%`);
    }

    if (available !== undefined) {
      conditions.push(`is_available = $${values.length + 1}`);
      values.push(available === 'true');
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, values);

    res.json({
      success: true,
      count: result.rows.length,
      doctors: result.rows,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM doctors WHERE id = $1', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    res.json({
      success: true,
      doctor: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', auth, requireRole('admin', 'doctor'), async (req, res, next) => {
  try {
    const {
      name,
      specialization,
      experience,
      hospital,
      location,
      phone,
      consultation_fee,
      available_time,
      is_available,
    } = req.body;

    if (!name || !specialization || !location) {
      return res.status(400).json({
        success: false,
        message: 'Name, specialization, and location are required',
      });
    }

    const result = await pool.query(
      `
        INSERT INTO doctors (name, specialization, experience, hospital, location, phone, consultation_fee, available_time, is_available)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `,
      [
        name,
        specialization,
        experience || '',
        hospital || '',
        location,
        phone || '',
        Number(consultation_fee) || 0,
        available_time || '',
        is_available !== undefined ? Boolean(is_available) : true,
      ]
    );

    res.status(201).json({
      success: true,
      doctor: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

export default router;
