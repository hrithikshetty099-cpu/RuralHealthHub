import { useApp } from '../context/AppContext';
import { Calendar, Video, Plus } from 'lucide-react';
import { BackToDashboardButton } from '../components/BackToDashboardButton';

export const Appointments = () => {
  const { appointments, navigateTo } = useApp();

  return (
    <div style={{ padding: '2.5rem 0', backgroundColor: 'var(--bg-main)', minHeight: '80vh' }}>
      <div className="container">
        <BackToDashboardButton />
        
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.3rem' }}>
              <Calendar size={18} /> Patient Booking Register
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>
              My Appointments
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Keep track of confirmed village doctor appointments and upcoming tele-consultation sessions.
            </p>
          </div>

          <button
            onClick={() => navigateTo('book-appointment')}
            className="btn btn-primary"
          >
            <Plus size={18} /> Book New Appointment
          </button>
        </div>

        {/* Appointments List */}
        {appointments.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {appointments.map(appt => (
              <div key={appt.id} className="card" style={{ backgroundColor: '#ffffff', padding: '1.25rem' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                      <span className="badge badge-teal">Token: {appt.id}</span>
                      <span className="badge badge-green">● {appt.status}</span>
                      <span className="badge badge-blue">{appt.consultationType}</span>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                      {appt.doctorName}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {appt.doctorSpecialty} • {appt.hospitalName}
                    </p>
                  </div>

                  {/* Scheduled Slot Highlight */}
                  <div style={{
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary-dark)',
                    padding: '0.6rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'right'
                  }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>Scheduled For</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Calendar size={14} /> {appt.date} ({appt.time})
                    </div>
                  </div>
                </div>

                {/* Patient & Reason info */}
                <div style={{
                  backgroundColor: 'var(--bg-subtle)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '0.5rem',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Patient: </span>
                    <strong>{appt.patientName}</strong> ({appt.patientAge || 48} yrs)
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Contact: </span>
                    <strong>{appt.patientPhone}</strong>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Reported Concern: </span>
                    <span>{appt.symptoms || "General follow up"}</span>
                  </div>
                </div>

                {/* CTA buttons */}
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                  {appt.consultationType.includes('Online') && (
                    <button
                      onClick={() => navigateTo('consultation', { consultationAppointment: appt })}
                      className="btn btn-success btn-sm"
                    >
                      <Video size={15} /> Enter Tele-Consultation Room
                    </button>
                  )}
                  <button
                    onClick={() => navigateTo('my-health')}
                    className="btn btn-secondary btn-sm"
                  >
                    View in Health Card
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem', backgroundColor: '#ffffff' }}>
            <Calendar size={42} color="var(--text-light)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              No Appointments Booked Yet
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              You have no active appointments scheduled. Find a doctor or choose an online consultation.
            </p>
            <button
              onClick={() => navigateTo('book-appointment')}
              className="btn btn-primary"
            >
              Book an Appointment
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
