import { useEffect, useState } from 'react';
import { CalendarDays, ClipboardCheck, LogOut, Video } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { apiRequest } from '../lib/api';

export const DoctorDashboard = () => {
  const { authUser, logout, navigateTo } = useApp();
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState('Loading appointments...');

  useEffect(() => {
    apiRequest('/appointments').then((response) => {
      setAppointments(response.appointments || []);
      setMessage('');
    }).catch((error) => setMessage(error.message));
  }, []);

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 3.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <div>
          <p style={{ margin: 0, color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>Doctor Dashboard</p>
          <h1 style={{ margin: '0.35rem 0 0', fontSize: '2rem', fontWeight: 800 }}>Welcome, {authUser?.name || 'Doctor'}</h1>
        </div>
        <button className="btn btn-secondary" onClick={logout}><LogOut size={16} /> Logout</button>
      </div>
      <div className="card" style={{ backgroundColor: '#ffffff' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}><CalendarDays size={18} /> Assigned appointments</h2>
        {message && <p style={{ color: 'var(--text-muted)' }}>{message}</p>}
        {!message && appointments.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No appointments assigned yet.</p>}
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {appointments.map((appointment) => (
            <div key={appointment.id} style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div><strong>{appointment.patient_name || appointment.patientName || 'Patient'}</strong><div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{appointment.appointment_date || appointment.date} at {appointment.appointment_time || appointment.time} · {appointment.consultation_type || appointment.consultationType}</div></div>
              {String(appointment.consultation_type || appointment.consultationType).toLowerCase().includes('online') && <button className="btn btn-primary btn-sm" onClick={() => navigateTo('consultation', { consultationAppointment: appointment })}><Video size={15} /> Open consultation</button>}
              {!String(appointment.consultation_type || appointment.consultationType).toLowerCase().includes('online') && <ClipboardCheck size={18} color="var(--primary)" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
