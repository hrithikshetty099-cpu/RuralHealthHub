import express from 'express';
import { pool } from '../db.js';
import auth, { requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { location, name } = req.query;

    let query = 'SELECT * FROM hospitals';
    const values = [];
    const conditions = [];

    if (name) {
      conditions.push(`name ILIKE $${values.length + 1}`);
      values.push(`%${name}%`);
    }

    if (location) {
      conditions.push(`location ILIKE $${values.length + 1}`);
      values.push(`%${location}%`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, values);

    res.json({
      success: true,
      count: result.rows.length,
      hospitals: result.rows,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM hospitals WHERE id = $1', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found',
      });
    }

    res.json({
      success: true,
      hospital: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const { name, location, phone, distance, services, opening_hours } = req.body;

    if (!name || !location) {
      return res.status(400).json({
        success: false,
        message: 'Name and location are required',
      });
    }

    const result = await pool.query(
      `
        INSERT INTO hospitals (name, location, phone, distance, services, opening_hours)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `,
      [name, location, phone || '', distance || '', services || '', opening_hours || '']
    );

    res.status(201).json({
      success: true,
      hospital: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

export default router;
