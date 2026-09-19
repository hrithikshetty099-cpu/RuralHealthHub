import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  Clock, 
  Calendar, 
  Video, 
  Award, 
  GraduationCap, 
  Languages, 
  CheckCircle2, 
  ShieldAlert, 
  PhoneCall,
  IndianRupee,
  Building
} from 'lucide-react';

export const DoctorProfile = () => {
  const { doctors, selectedDoctorId, navigateTo, lowDataMode } = useApp();

  const doctor = doctors.find(d => d.id === selectedDoctorId) || doctors[0];

  return (
    <div style={{ padding: '2.5rem 0', backgroundColor: 'var(--bg-main)', minHeight: '80vh' }}>
      <div className="container">
        {/* Back Navigation */}
        <button
          onClick={() => navigateTo('doctors')}
          className="btn btn-secondary btn-sm"
          style={{ marginBottom: '1.5rem' }}
        >
          <ArrowLeft size={16} /> Back to Doctor Directory
        </button>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem'
        }}>
          {/* Left Column: Doctor Profile Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Main Header Card */}
            <div className="card" style={{ backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                {!lowDataMode ? (
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    style={{
                      width: '120px',
                      height: '120px',
                      borderRadius: '16px',
                      objectFit: 'cover',
                      border: '2px solid var(--border-color)'
                    }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    fontWeight: 800
                  }}>
                    {doctor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                )}

                <div style={{ flex: 1, minWidth: '220px' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                    <span className="badge badge-teal">{doctor.specialization}</span>
                    {doctor.isOnlineNow && <span className="badge badge-green">● Tele-consult Available</span>}
                  </div>

                  <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                    {doctor.name}
                  </h1>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.6rem' }}>
                    <GraduationCap size={16} /> {doctor.qualification}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '0.88rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-main)' }}>
                      <Award size={16} color="var(--primary)" />
                      <strong>{doctor.experience}</strong> Clinical Practice
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#d97706', fontWeight: 700 }}>
                      <Star size={16} fill="#d97706" /> {doctor.rating} ({doctor.reviewsCount} reviews)
                    </div>
                  </div>
                </div>
              </div>

              {/* Hospital Affiliation Row */}
              <div style={{
                marginTop: '1.5rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 700 }}>
                    Primary Center & Location
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {doctor.hospitalName}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={14} color="var(--primary)" /> {doctor.location}
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'var(--bg-subtle)',
                  padding: '0.6rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'right'
                }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Consultation Fee</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
                    ₹{doctor.consultationFee}
                  </div>
                </div>
              </div>
            </div>

            {/* About & Bio */}
            <div className="card" style={{ backgroundColor: '#ffffff' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                Professional Overview
              </h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
                {doctor.about}
              </p>

              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.6rem' }}>
                Offered Healthcare Services
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                {doctor.services.map((service, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.85rem',
                    color: 'var(--text-main)',
                    backgroundColor: 'var(--bg-subtle)',
                    padding: '0.45rem 0.75rem',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    <CheckCircle2 size={14} color="var(--accent)" />
                    {service}
                  </div>
                ))}
              </div>

              {/* Languages spoken */}
              <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem' }}>
                <Languages size={16} color="var(--primary)" />
                <span style={{ fontWeight: 600 }}>Consultation Languages:</span>
                <span style={{ color: 'var(--text-muted)' }}>{doctor.languages.join(', ')}</span>
              </div>
            </div>

          </div>

          {/* Right Column: Booking Widget & Slots */}
          <div>
            <div className="card" style={{
              backgroundColor: '#ffffff',
              position: 'sticky',
              top: '80px',
              boxShadow: 'var(--shadow-md)',
              border: '2px solid var(--primary-light)'
            }}>
              <div style={{
                backgroundColor: 'var(--primary-light)',
                padding: '0.6rem 0.8rem',
                borderRadius: 'var(--radius-md)',
                color: 'var(--primary-dark)',
                fontSize: '0.85rem',
                fontWeight: 700,
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <Calendar size={16} /> Booking & Availability Schedule
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                  Available Clinic Days:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {doctor.availableDays.map(day => (
                    <span key={day} style={{
                      backgroundColor: 'var(--bg-subtle)',
                      padding: '0.3rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: 'var(--text-main)'
                    }}>
                      {day}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                  Daily Consultation Slots:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                  {doctor.timeSlots.map(slot => (
                    <div key={slot} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      backgroundColor: '#f0fdfa',
                      border: '1px solid #ccfbf1',
                      padding: '0.4rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: 'var(--primary-dark)'
                    }}>
                      <Clock size={13} /> {slot}
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Booking CTAs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  onClick={() => navigateTo('book-appointment', { bookingDoctor: doctor })}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <Calendar size={18} /> Book In-Person Appointment
                </button>

                {doctor.isOnlineNow && (
                  <button
                    onClick={() => navigateTo('consultation', { consultDoctor: doctor })}
                    className="btn btn-success btn-lg"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <Video size={18} /> Consult Online Now (₹{doctor.consultationFee})
                  </button>
                )}
              </div>

              <div style={{
                marginTop: '1.25rem',
                padding: '0.75rem',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                lineHeight: '1.4'
              }}>
                💡 <strong>Rural Subsidy:</strong> If you hold a BPL or Ayushman Bharat Health Account (ABHA) card, government consultation subsidies apply at the desk.
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
