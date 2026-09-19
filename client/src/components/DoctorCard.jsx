import React from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Video, MapPin, Award, Clock, Star, IndianRupee } from 'lucide-react';

export const DoctorCard = ({ doctor }) => {
  const { t, navigateTo, lowDataMode } = useApp();

  return (
    <div className="card" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Top Banner Tag */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
        <span className="badge badge-teal">
          {doctor.specialization}
        </span>
        {doctor.isOnlineNow && (
          <span className="badge badge-green" style={{ fontSize: '0.72rem' }}>
            ● Online Consultation Available
          </span>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
        {/* Doctor Photo or Placeholder */}
        {!lowDataMode ? (
          <img
            src={doctor.image}
            alt={doctor.name}
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '12px',
              objectFit: 'cover',
              border: '1px solid var(--border-color)',
              flexShrink: 0
            }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '8px',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary-dark)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.2rem',
            flexShrink: 0
          }}>
            {doctor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
        )}

        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
            {doctor.name}
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            {doctor.qualification} • {doctor.experience} {t.common.experience}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#d97706', fontWeight: 600 }}>
              <Star size={14} fill="#d97706" color="#d97706" /> {doctor.rating} ({doctor.reviewsCount})
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.15rem', fontWeight: 700, color: 'var(--primary-dark)' }}>
              ₹{doctor.consultationFee} {t.common.fees}
            </span>
          </div>
        </div>
      </div>

      {/* Hospital & Location */}
      <div style={{
        backgroundColor: 'var(--bg-subtle)',
        padding: '0.65rem 0.85rem',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.82rem',
        marginBottom: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.35rem'
      }}>
        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
          🏥 {doctor.hospitalName}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)' }}>
          <MapPin size={13} /> {doctor.location}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)' }}>
          <Clock size={13} /> Next Available: <strong style={{ color: 'var(--text-main)' }}>{doctor.timeSlots[0]}</strong>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
        gap: '0.5rem',
        marginTop: 'auto'
      }}>
        <button
          onClick={() => navigateTo('doctor-profile', { doctorId: doctor.id })}
          className="btn btn-secondary btn-sm"
          style={{ width: '100%' }}
        >
          {t.common.viewProfile}
        </button>

        <button
          onClick={() => navigateTo('book-appointment', { bookingDoctor: doctor })}
          className="btn btn-primary btn-sm"
          style={{ width: '100%' }}
        >
          <Calendar size={14} />
          {t.common.bookAppointment}
        </button>

        {doctor.isOnlineNow && (
          <button
            onClick={() => navigateTo('consultation', { consultDoctor: doctor })}
            className="btn btn-outline btn-sm"
            style={{ width: '100%' }}
          >
            <Video size={14} />
            {t.common.consultOnline}
          </button>
        )}
      </div>
    </div>
  );
};
