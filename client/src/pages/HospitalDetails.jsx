import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  Navigation, 
  CheckCircle
} from 'lucide-react';

export const HospitalDetails = () => {
  const { hospitals, selectedHospitalId, navigateTo, lowDataMode } = useApp();
  const hospital = hospitals.find(h => h.id === selectedHospitalId) || hospitals[0];

  return (
    <div style={{ padding: '2.5rem 0', backgroundColor: 'var(--bg-main)', minHeight: '80vh' }}>
      <div className="container">
        
        <button
          onClick={() => navigateTo('hospitals')}
          className="btn btn-secondary btn-sm"
          style={{ marginBottom: '1.5rem' }}
        >
          <ArrowLeft size={16} /> Back to Facilities Directory
        </button>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem'
        }}>
          {/* Main Info Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card" style={{ backgroundColor: '#ffffff' }}>
              
              {!lowDataMode && hospital.image && (
                <div style={{
                  height: '240px',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  marginBottom: '1.25rem'
                }}>
                  <img
                    src={hospital.image}
                    alt={hospital.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                <span className="badge badge-blue">{hospital.type}</span>
                {hospital.isEmergency && <span className="badge badge-red">24/7 Emergency Active</span>}
                <span className="badge badge-teal">Rating: ★ {hospital.rating}</span>
              </div>

              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                {hospital.name}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1rem' }}>
                <MapPin size={16} color="var(--primary)" />
                {hospital.location} ({hospital.distance})
              </div>

              <p style={{ color: 'var(--text-main)', lineHeight: '1.6', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                {hospital.about}
              </p>

              {/* Contact and Emergency Box */}
              <div style={{
                backgroundColor: 'var(--bg-subtle)',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Hospital Reception</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>{hospital.phone}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--danger)', fontWeight: 600 }}>Emergency Ambulance Helpline</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--danger)' }}>{hospital.ambulanceContact}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Oxygen Infrastructure</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--primary-dark)' }}>{hospital.oxygenSupply}</div>
                </div>
              </div>

            </div>

            {/* Services Detailed List */}
            <div className="card" style={{ backgroundColor: '#ffffff' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>
                Comprehensive Services & Departments
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
                {hospital.availableServices.map((service, idx) => (
                  <div key={idx} style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: 'var(--text-main)'
                  }}>
                    <CheckCircle size={15} color="var(--primary)" />
                    {service}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Doctors at Facility & Booking */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div className="card" style={{ backgroundColor: '#ffffff', border: '2px solid var(--primary-light)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Users size={18} color="var(--primary)" /> Attached Doctors ({hospital.doctorsCount})
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Doctors currently registered for OPD rounds and tele-consultation sessions at this facility.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
                {hospital.doctorsList.map((docName, idx) => (
                  <div key={idx} style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{docName}</span>
                    <span className="badge badge-teal" style={{ fontSize: '0.72rem' }}>OPD Scheduled</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigateTo('doctors')}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Book Appointment With Facility Doctors
              </button>
            </div>

            {/* GPS & Travel Directions */}
            <div className="card" style={{ backgroundColor: '#ffffff' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Navigation size={18} color="#0284c7" /> Location Coordinates
              </h3>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                GPS Marker: <strong>{hospital.mapCoords}</strong>
              </div>
              <div style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-subtle)',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                lineHeight: '1.4'
              }}>
                Accessible by KSRTC Taluk bus service & local Grama Auto stands. Direct wheelchair ramp access on main gate.
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
