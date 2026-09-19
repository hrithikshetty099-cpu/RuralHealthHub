import { useApp } from '../context/AppContext';
import { FileText, CalendarClock, Pill, HeartPulse } from 'lucide-react';
import { BackToDashboardButton } from '../components/BackToDashboardButton';

export const HealthRecords = () => {
  const { patientProfile } = useApp();
  const records = patientProfile?.previousVisits || [];

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 3.5rem', minHeight: '70vh' }}>
      <BackToDashboardButton />
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ margin: 0, color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: '0.75rem' }}>
          My Health Records
        </p>
        <h1 style={{ margin: '0.35rem 0 0', fontSize: '2rem', fontWeight: 800 }}>Health History</h1>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {records.length > 0 ? (
          records.map((record) => (
            <div key={record.id} className="card" style={{ backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)' }}>{record.doctor}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{record.hospital}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{record.date}</div>
                  <div className="badge badge-green" style={{ marginTop: '0.35rem' }}>{record.status}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                    <FileText size={16} color="var(--primary)" /> Why visit
                  </div>
                  <div style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{record.reason}</div>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                    <HeartPulse size={16} color="var(--primary)" /> Notes
                  </div>
                  <div style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{record.notes}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                    <Pill size={16} color="var(--primary)" /> Prescription
                  </div>
                  <div style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{record.prescription}</div>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                    <CalendarClock size={16} color="var(--primary)" /> Follow-up
                  </div>
                  <div style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{record.followUp}</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card" style={{ backgroundColor: '#ffffff', padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No health records yet.
          </div>
        )}
      </div>
    </div>
  );
};
