import { useApp } from '../context/AppContext';
import { MapPin, Clock, AlertTriangle } from 'lucide-react';

export const HospitalCard = ({ hospital }) => {
  const { t, navigateTo, lowDataMode } = useApp();

  return (
    <div className="card" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative'
    }}>
      <div>
        {/* Top Badges */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
          <span className="badge badge-blue" style={{ fontSize: '0.78rem' }}>
            {hospital.type}
          </span>
          {hospital.isEmergency ? (
            <span className="badge badge-red" style={{ fontSize: '0.75rem' }}>
              <AlertTriangle size={12} /> 24/7 {t.common.emergency}
            </span>
          ) : (
            <span className="badge badge-teal" style={{ fontSize: '0.75rem' }}>
              <Clock size={12} /> {hospital.openingHours}
            </span>
          )}
        </div>

        {/* Hospital Photo (hidden or reduced in low data mode) */}
        {!lowDataMode && hospital.image && (
          <div style={{
            height: '140px',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            marginBottom: '1rem'
          }}>
            <img
              src={hospital.image}
              alt={hospital.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        )}

        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
          {hospital.name}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.6rem' }}>
          <MapPin size={14} color="var(--primary)" />
          <span>{hospital.location} <strong>({hospital.distance})</strong></span>
        </div>

        {/* Quick facility metrics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.5rem',
          backgroundColor: 'var(--bg-subtle)',
          padding: '0.65rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '0.9rem',
          textAlign: 'center',
          fontSize: '0.78rem'
        }}>
          <div>
            <div style={{ color: 'var(--text-muted)' }}>Beds Avail</div>
            <div style={{ fontWeight: 700, color: 'var(--primary-dark)', fontSize: '0.95rem' }}>{hospital.bedsAvailable}</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)' }}>Doctors</div>
            <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>{hospital.doctorsCount}</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)' }}>Rating</div>
            <div style={{ fontWeight: 700, color: '#d97706', fontSize: '0.95rem' }}>★ {hospital.rating}</div>
          </div>
        </div>

        {/* Key Services Preview */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
            Available Services:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {hospital.availableServices.slice(0, 3).map((service, idx) => (
              <span key={idx} style={{
                fontSize: '0.75rem',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-main)',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px'
              }}>
                ✓ {service}
              </span>
            ))}
            {hospital.availableServices.length > 3 && (
              <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
                +{hospital.availableServices.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
        <button
          onClick={() => navigateTo('hospital-details', { hospitalId: hospital.id })}
          className="btn btn-secondary btn-sm"
          style={{ flex: 1 }}
        >
          View Facility Details
        </button>
        <button
          onClick={() => navigateTo('doctors')}
          className="btn btn-primary btn-sm"
          style={{ flex: 1 }}
        >
          View Available Doctors
        </button>
      </div>
    </div>
  );
};
