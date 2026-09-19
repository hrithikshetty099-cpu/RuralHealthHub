import { useState } from 'react';
import { useApp } from '../context/AppContext';

export const Login = () => {
  const { navigateTo, setPatientProfile, patientProfile, t } = useApp();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError('Please enter both email and password.');
      return;
    }

    if (mode === 'register' && !form.name) {
      setError('Please enter your full name to create an account.');
      return;
    }

    const displayName = mode === 'register'
      ? form.name.trim()
      : (form.email.split('@')[0].replace(/[._-]/g, ' ').trim() || 'Patient');

    setPatientProfile({
      ...patientProfile,
      name: displayName,
      email: form.email,
      phone: patientProfile?.phone || '+91 00000 00000',
    });

    setError('');
    navigateTo('dashboard');
  };

  return (
    <div className="container" style={{ padding: '3rem 1.25rem', minHeight: '60vh' }}>
      <div className="card" style={{ maxWidth: '520px', margin: '0 auto', backgroundColor: '#ffffff' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ margin: 0, color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: '0.75rem' }}>
            {mode === 'login' ? t.nav.login : 'Register'}
          </p>
          <h1 style={{ margin: '0.35rem 0 0', fontSize: '2rem', fontWeight: 800 }}>
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button
            type="button"
            onClick={() => setMode('login')}
            className={mode === 'login' ? 'btn btn-primary' : 'btn btn-secondary'}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={mode === 'register' ? 'btn btn-primary' : 'btn btn-secondary'}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
          {mode === 'register' && (
            <div>
              <label htmlFor="name" style={{ display: 'block', marginBottom: '0.45rem', fontWeight: 600 }}>Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                style={{ width: '100%', padding: '0.8rem 0.9rem', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '0.96rem', boxSizing: 'border-box' }}
              />
            </div>
          )}

          <div>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.45rem', fontWeight: 600 }}>Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              style={{ width: '100%', padding: '0.8rem 0.9rem', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '0.96rem', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.45rem', fontWeight: 600 }}>Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              style={{ width: '100%', padding: '0.8rem 0.9rem', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '0.96rem', boxSizing: 'border-box' }}
            />
          </div>

          {error && (
            <div style={{ color: '#b91c1c', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.7rem 0.8rem', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            {mode === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};
