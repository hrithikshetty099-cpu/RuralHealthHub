import dotenv from 'dotenv';
import { pool } from './src/db.js';

dotenv.config();

const seed = async () => {
  const hospital = await pool.query(`
    INSERT INTO hospitals (name, location, village, district, phone, distance, services, opening_hours, latitude, longitude)
    VALUES ('Demo Rural Health Centre', 'Mangaluru', 'Demo Village', 'Dakshina Kannada', 'Public directory contact', 'Demo', 'General medicine, teleconsultation', '08:00-18:00', 12.9141, 74.8560)
    ON CONFLICT DO NOTHING RETURNING id
  `);
  const hospitalId = hospital.rows[0]?.id || (await pool.query("SELECT id FROM hospitals WHERE name = 'Demo Rural Health Centre' LIMIT 1")).rows[0].id;

  await pool.query(`
    INSERT INTO doctors (hospital_id, name, specialization, qualification, experience, hospital, location, phone, consultation_fee, available_time, is_available)
    VALUES ($1, 'Demo General Physician', 'General Physician', 'MBBS (demo record)', 'Demo profile', 'Demo Rural Health Centre', 'Mangaluru', 'Public directory contact', 0, '09:00-13:00', true)
    ON CONFLICT DO NOTHING
  `, [hospitalId]);
  console.log('Demo directory data seeded. These are clearly marked demo records, not verified providers.');
};

seed().catch((error) => {
  console.error('Seed failed:', error.message);
  process.exitCode = 1;
}).finally(() => pool.end());
