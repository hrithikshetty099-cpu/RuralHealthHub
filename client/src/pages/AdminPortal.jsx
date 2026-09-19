import { useEffect, useState } from 'react';
import { Building2, CalendarDays, Stethoscope, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { apiRequest } from '../lib/api';

export const AdminPortal = () => {
  const { authUser, logout } = useApp();
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiRequest('/admin/dashboard').then((response) => setDashboard(response.dashboard)).catch((requestError) => setError(requestError.message));
  }, []);

  const cards = [
    ['Users', dashboard?.users, Users],
    ['Doctors', dashboard?.doctors, Stethoscope],
    ['Hospitals', dashboard?.hospitals, Building2],
    ['Appointments', dashboard?.appointments, CalendarDays],
  ];

  return <div className="container" style={{ padding: '2.5rem 1.25rem 3.5rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}><div><p style={{ margin: 0, color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>Admin Portal</p><h1 style={{ margin: '0.35rem 0 0', fontSize: '2rem', fontWeight: 800 }}>Platform overview</h1></div><button className="btn btn-secondary" onClick={logout}>Logout</button></div>
    {error && <div className="card" style={{ color: '#b91c1c', backgroundColor: '#fef2f2' }}>{error}</div>}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>{cards.map(([label, value, Icon]) => <div key={label} className="card" style={{ backgroundColor: '#ffffff' }}><Icon size={18} color="var(--primary)" /><div style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>{label}</div><strong style={{ fontSize: '1.8rem' }}>{value ?? '—'}</strong></div>)}</div>
    <p style={{ color: 'var(--text-muted)', marginTop: '1.5rem' }}>Authenticated as {authUser?.email}. Use protected admin APIs to manage verified healthcare data.</p>
  </div>;
};
