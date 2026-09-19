-- Run this against the existing rural_health_hub database.
-- Use database.sql instead for a new database.

BEGIN;

ALTER TABLE users ADD COLUMN IF NOT EXISTS village VARCHAR(150);
ALTER TABLE users ADD COLUMN IF NOT EXISTS district VARCHAR(150);
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS hospital_id INTEGER REFERENCES hospitals(id) ON DELETE SET NULL;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS qualification VARCHAR(150);
ALTER TABLE hospitals ADD COLUMN IF NOT EXISTS village VARCHAR(150);
ALTER TABLE hospitals ADD COLUMN IF NOT EXISTS district VARCHAR(150);
ALTER TABLE hospitals ADD COLUMN IF NOT EXISTS latitude NUMERIC(10, 7);
ALTER TABLE hospitals ADD COLUMN IF NOT EXISTS longitude NUMERIC(10, 7);
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS hospital_id INTEGER REFERENCES hospitals(id) ON DELETE SET NULL;
ALTER TABLE health_records ADD COLUMN IF NOT EXISTS consultation_id INTEGER REFERENCES consultations(id) ON DELETE SET NULL;
ALTER TABLE health_records ADD COLUMN IF NOT EXISTS doctor_id INTEGER REFERENCES doctors(id) ON DELETE SET NULL;
ALTER TABLE health_records ADD COLUMN IF NOT EXISTS hospital_id INTEGER REFERENCES hospitals(id) ON DELETE SET NULL;
ALTER TABLE health_records ADD COLUMN IF NOT EXISTS diagnosis TEXT;
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS doctor_notes TEXT;
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS diagnosis TEXT;
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS follow_up_instructions TEXT;
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS follow_up_date DATE;
ALTER TABLE prescriptions ADD COLUMN IF NOT EXISTS medicine_name VARCHAR(200);
ALTER TABLE prescriptions ADD COLUMN IF NOT EXISTS dosage VARCHAR(100);
ALTER TABLE prescriptions ADD COLUMN IF NOT EXISTS frequency VARCHAR(100);
ALTER TABLE prescriptions ADD COLUMN IF NOT EXISTS duration VARCHAR(100);
ALTER TABLE prescriptions ADD COLUMN IF NOT EXISTS prescribed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE medicine_deliveries ADD COLUMN IF NOT EXISTS village VARCHAR(150);
ALTER TABLE medicine_deliveries ADD COLUMN IF NOT EXISTS district VARCHAR(150);
ALTER TABLE medicine_deliveries ADD COLUMN IF NOT EXISTS phone VARCHAR(30);
ALTER TABLE medicine_deliveries ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE medicine_deliveries ADD COLUMN IF NOT EXISTS requested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE medicine_deliveries ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP WITH TIME ZONE;
UPDATE medicine_deliveries SET address = delivery_address WHERE address IS NULL;

UPDATE medicine_deliveries SET status = CASE status
  WHEN 'Preparing' THEN 'preparing'
  WHEN 'Dispatched' THEN 'dispatched'
  WHEN 'Out for Delivery' THEN 'out_for_delivery'
  WHEN 'Delivered' THEN 'delivered'
  ELSE LOWER(status)
END;
ALTER TABLE medicine_deliveries DROP CONSTRAINT IF EXISTS medicine_deliveries_status_check;
ALTER TABLE medicine_deliveries ADD CONSTRAINT medicine_deliveries_status_check
  CHECK (status IN ('requested', 'preparing', 'dispatched', 'out_for_delivery', 'delivered', 'cancelled'));

UPDATE consultations SET status = 'scheduled' WHERE status = 'waiting';
ALTER TABLE consultations DROP CONSTRAINT IF EXISTS consultations_status_check;
ALTER TABLE consultations ADD CONSTRAINT consultations_status_check
  CHECK (status IN ('scheduled', 'active', 'completed', 'cancelled'));

CREATE TABLE IF NOT EXISTS prescriptions (
  id SERIAL PRIMARY KEY,
  consultation_id INTEGER REFERENCES consultations(id) ON DELETE SET NULL,
  patient_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  doctor_id INTEGER NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  medicines TEXT NOT NULL,
  instructions TEXT,
  follow_up_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS medicine_deliveries (
  id SERIAL PRIMARY KEY,
  prescription_id INTEGER NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
  patient_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  delivery_address TEXT NOT NULL,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  status VARCHAR(30) NOT NULL DEFAULT 'Preparing' CHECK (status IN ('Preparing', 'Dispatched', 'Out for Delivery', 'Delivered')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_patient ON medicine_deliveries(patient_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_lower ON users(LOWER(email));
CREATE INDEX IF NOT EXISTS idx_doctors_hospital ON doctors(hospital_id);
CREATE INDEX IF NOT EXISTS idx_consultations_patient ON consultations(patient_id);
CREATE INDEX IF NOT EXISTS idx_consultations_doctor ON consultations(doctor_id);

COMMIT;