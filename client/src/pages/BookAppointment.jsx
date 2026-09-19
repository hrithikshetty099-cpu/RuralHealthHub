import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  User, 
  Phone, 
  MapPin, 
  FileText, 
  Video, 
  Check, 
  AlertCircle 
} from 'lucide-react';

export const BookAppointment = () => {
  const { doctors, prefilledBookingDoctor, navigateTo, addAppointment } = useApp();

  const [selectedDoctor, setSelectedDoctor] = useState(
    prefilledBookingDoctor || doctors[0]
  );
  const [selectedDate, setSelectedDate] = useState('2026-09-23');
  const [selectedTime, setSelectedTime] = useState(
    (selectedDoctor && selectedDoctor.timeSlots && selectedDoctor.timeSlots[0]) || '10:30 AM'
  );
  const [consultType, setConsultType] = useState('In-Person'); // 'In-Person' | 'Online Video'
  
  // Patient Details
  const [patientName, setPatientName] = useState('Ramesh Gowda');
  const [patientPhone, setPatientPhone] = useState('+91 98450 12345');
  const [patientAge, setPatientAge] = useState('48');
  const [symptoms, setSymptoms] = useState('General checkup & seasonal cough');

  // Step state: 1 = Form, 2 = Confirmation Success
  const [step, setStep] = useState(1);
  const [createdAppointment, setCreatedAppointment] = useState(null);

  const handleDoctorChange = (docId) => {
    const doc = doctors.find(d => d.id === docId);
    if (doc) {
      setSelectedDoctor(doc);
      if (doc.timeSlots && doc.timeSlots.length > 0) {
        setSelectedTime(doc.timeSlots[0]);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!patientName.trim() || !patientPhone.trim()) {
      alert('Please provide patient name and contact phone number');
      return;
    }

    const appointmentId = `APT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newAppt = {
      id: appointmentId,
      doctorName: selectedDoctor.name,
      doctorSpecialty: selectedDoctor.specialization,
      hospitalName: selectedDoctor.hospitalName,
      date: selectedDate,
      time: selectedTime,
      patientName,
      patientPhone,
      patientAge: parseInt(patientAge) || 45,
      consultationType: consultType,
      status: 'Confirmed',
      symptoms
    };

    addAppointment(newAppt);
    setCreatedAppointment(newAppt);
    setStep(2);
  };

  return (
    <div style={{ padding: '2.5rem 0', backgroundColor: 'var(--bg-main)', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '820px' }}>
        
        {step === 1 ? (
          <div>
            {/* Top Navigation */}
            <button
              onClick={() => navigateTo('doctors')}
              className="btn btn-secondary btn-sm"
              style={{ marginBottom: '1.5rem' }}
            >
              <ArrowLeft size={16} /> Back to Doctors
            </button>

            <div style={{ marginBottom: '1.8rem' }}>
              <span className="badge badge-teal" style={{ marginBottom: '0.35rem' }}>Direct OPD & Tele-Booking</span>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Book Doctor Appointment
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                Follow the simple steps to confirm your slot with rural health officers or remote medical specialists.
              </p>
            </div>

            {/* Stepper Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '2rem',
              backgroundColor: '#ffffff',
              padding: '1rem 1.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              fontSize: '0.88rem',
              fontWeight: 600,
              gap: '0.5rem',
              overflowX: 'auto'
            }}>
              <span style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                ① Doctor & Time
              </span>
              <span style={{ color: 'var(--text-light)' }}>→</span>
              <span style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                ② Patient Details
              </span>
              <span style={{ color: 'var(--text-light)' }}>→</span>
              <span style={{ color: 'var(--text-muted)' }}>
                ③ Instant Confirmation
              </span>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="card" style={{ backgroundColor: '#ffffff', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={18} color="var(--primary)" /> Step 1: Select Doctor & Timing
                </h3>

                {/* Doctor Selection */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                    Choose Doctor:
                  </label>
                  <select
                    className="input-control"
                    value={selectedDoctor.id}
                    onChange={(e) => handleDoctorChange(e.target.value)}
                  >
                    {doctors.map(doc => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} — {doc.specialization} ({doc.hospitalName})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Consultation Mode */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                    Consultation Method:
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={() => setConsultType('In-Person')}
                      className={`btn ${consultType === 'In-Person' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ justifyContent: 'center' }}
                    >
                      🏥 In-Person Clinic Visit
                    </button>
                    <button
                      type="button"
                      onClick={() => setConsultType('Online Video')}
                      className={`btn ${consultType === 'Online Video' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ justifyContent: 'center' }}
                    >
                      <Video size={16} /> Online Tele-Consultation
                    </button>
                  </div>
                </div>

                {/* Date & Time Slot */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                      Select Date:
                    </label>
                    <input
                      type="date"
                      className="input-control"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min="2026-09-19"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                      Select Available Time Slot:
                    </label>
                    <select
                      className="input-control"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                    >
                      {selectedDoctor.timeSlots.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Summary Info */}
                <div style={{
                  backgroundColor: 'var(--primary-light)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  color: 'var(--primary-dark)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>Consultation Fee: <strong>₹{selectedDoctor.consultationFee}</strong> (Pay at clinic or digital)</span>
                  <span>Hospital: <strong>{selectedDoctor.hospitalName}</strong></span>
                </div>
              </div>

              {/* Patient Details Card */}
              <div className="card" style={{ backgroundColor: '#ffffff', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={18} color="var(--primary)" /> Step 2: Patient Information
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                      Patient Full Name *
                    </label>
                    <input
                      type="text"
                      className="input-control"
                      required
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="e.g. Ramesh Gowda"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                      Mobile Phone Number *
                    </label>
                    <input
                      type="tel"
                      className="input-control"
                      required
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      placeholder="+91 98450 12345"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                      Patient Age
                    </label>
                    <input
                      type="number"
                      className="input-control"
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      placeholder="Age"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                    Reason for Visit / Symptoms
                  </label>
                  <textarea
                    className="input-control"
                    rows="3"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Briefly describe the health issue, pain or fever..."
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => navigateTo('doctors')}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                >
                  Confirm Appointment & Generate Token
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation Success Screen */
          <div className="card" style={{ backgroundColor: '#ffffff', padding: '2.5rem 2rem', textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#dcfce7',
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto'
            }}>
              <CheckCircle2 size={38} />
            </div>

            <span className="badge badge-green" style={{ fontSize: '0.85rem', padding: '0.35rem 0.8rem', marginBottom: '0.8rem' }}>
              Booking Confirmed Successfully
            </span>

            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Appointment Token: {createdAppointment.id}
            </h1>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '520px', margin: '0 auto 2rem auto' }}>
              An SMS confirmation with appointment instructions has been dispatched to <strong>{createdAppointment.patientPhone}</strong>.
            </p>

            {/* Receipt Table */}
            <div style={{
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              maxWidth: '560px',
              margin: '0 auto 2rem auto',
              textAlign: 'left'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', fontSize: '0.9rem' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Patient Name</div>
                  <div style={{ fontWeight: 700 }}>{createdAppointment.patientName} ({createdAppointment.patientAge} yrs)</div>
                </div>

                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Consulting Doctor</div>
                  <div style={{ fontWeight: 700 }}>{createdAppointment.doctorName}</div>
                </div>

                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Hospital / Location</div>
                  <div style={{ fontWeight: 700 }}>{createdAppointment.hospitalName}</div>
                </div>

                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Date & Time</div>
                  <div style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>{createdAppointment.date} at {createdAppointment.time}</div>
                </div>

                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Consultation Type</div>
                  <div style={{ fontWeight: 700 }}>{createdAppointment.consultationType}</div>
                </div>

                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Current Status</div>
                  <div><span className="badge badge-green">Confirmed</span></div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigateTo('appointments')}
                className="btn btn-primary"
              >
                View in My Appointments
              </button>
              {createdAppointment.consultationType.includes('Online') && (
                <button
                  onClick={() => navigateTo('consultation')}
                  className="btn btn-success"
                >
                  <Video size={16} /> Open Tele-Consultation Room
                </button>
              )}
              <button
                onClick={() => navigateTo('home')}
                className="btn btn-secondary"
              >
                Return to Home
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
