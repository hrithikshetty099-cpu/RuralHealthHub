import { useApp } from '../context/AppContext';
import { Activity, CalendarDays, Hospital, Stethoscope, HeartPulse, ArrowRight, PackageCheck } from 'lucide-react';

export const Dashboard = () => {
  const { patientProfile, appointments, doctors, hospitals, navigateTo } = useApp();

  const stats = [
    { label: 'Doctors', value: doctors.length, icon: Stethoscope },
    { label: 'Appointments', value: appointments.length, icon: CalendarDays },
    { label: 'Hospitals', value: hospitals.length, icon: Hospital },
    { label: 'Health Status', value: 'Stable', icon: HeartPulse },
  ];

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 3.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ margin: 0, color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: '0.75rem' }}>
          User Dashboard
        </p>
        <h1 style={{ margin: '0.35rem 0 0', fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Welcome back, {patientProfile?.name || 'Patient'}
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="card" style={{ backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>{label}</span>
              <Icon size={18} color="var(--primary)" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Quick Actions</h3>
          </div>

          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <button onClick={() => navigateTo('doctors')} className="btn btn-primary" style={{ justifyContent: 'center' }}>
              <Stethoscope size={16} /> Find Doctor
            </button>
            <button onClick={() => navigateTo('hospitals')} className="btn btn-secondary" style={{ justifyContent: 'center' }}>
              <Hospital size={16} /> Nearby Hospital
            </button>
            <button onClick={() => navigateTo('appointments')} className="btn btn-secondary" style={{ justifyContent: 'center' }}>
              <CalendarDays size={16} /> View Appointments
            </button>
            <button onClick={() => navigateTo('medicine-delivery')} className="btn btn-secondary" style={{ justifyContent: 'center' }}>
              <PackageCheck size={16} /> Request Medicine Delivery
            </button>
          </div>
        </div>

        <div className="card" style={{ backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Recent Health Snapshot</h3>
            <Activity size={18} color="var(--primary)" />
          </div>

          <div style={{ display: 'grid', gap: '0.8rem', color: 'var(--text-muted)' }}>
            <div><strong style={{ color: 'var(--text-main)' }}>Blood Pressure:</strong> 118/76 mmHg</div>
            <div><strong style={{ color: 'var(--text-main)' }}>Last Visit:</strong> 2 weeks ago</div>
            <div><strong style={{ color: 'var(--text-main)' }}>Follow-up:</strong> Review on Friday</div>
            <div><strong style={{ color: 'var(--text-main)' }}>Vaccination:</strong> Up to date</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <button onClick={() => navigateTo('my-health')} className="btn btn-secondary" style={{ justifyContent: 'center' }}>
          Open Health Record <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
