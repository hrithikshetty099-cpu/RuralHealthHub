import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiRequest } from '../lib/api';

export const Login = () => {
  const { navigateTo, setPatientProfile, patientProfile, t, login } = useApp();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', village: '', district: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
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

    const updatedProfile = {
      ...patientProfile,
      name: displayName,
      email: form.email,
      phone: patientProfile?.phone || '+91 00000 00000',
    };

    try {
      const response = await apiRequest(`/auth/${mode === 'register' ? 'register' : 'login'}`, {
        method: 'POST',
        body: JSON.stringify({ name: displayName, email: form.email, password: form.password, phone: form.phone || updatedProfile.phone, village: form.village, district: form.district }),
      });
      setPatientProfile({ ...updatedProfile, ...response.user });
      login(response.user, response.token);
    } catch (requestError) {
      const isRegistering = mode === 'register';
      let userMessage;

      if (requestError.code === 'NETWORK_ERROR') {
        userMessage = isRegistering
          ? 'We could not reach the registration service. Please start the backend and try again.'
          : 'We could not reach the sign-in service. Please try again shortly.';
      } else if (requestError.status === 409) {
        userMessage = 'An account with this email already exists. Please sign in instead.';
      } else if (requestError.status === 400) {
        userMessage = requestError.message;
      } else if (requestError.status >= 500 || requestError.status === 503) {
        userMessage = isRegistering
          ? 'Unable to create your account right now. Please try again later.'
          : 'Unable to sign in right now. Please try again later.';
      } else {
        userMessage = requestError.message;
      }

      setError(userMessage || (isRegistering
        ? 'We could not create your account. Please try again.'
        : 'We could not sign you in. Please try again.'));
      return;
    }

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

          {mode === 'register' && (
            <>
              <div>
                <label htmlFor="phone" style={{ display: 'block', marginBottom: '0.45rem', fontWeight: 600 }}>Phone</label>
                <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="Phone number" style={{ width: '100%', padding: '0.8rem 0.9rem', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '0.96rem', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label htmlFor="village" style={{ display: 'block', marginBottom: '0.45rem', fontWeight: 600 }}>Village</label>
                  <input id="village" name="village" type="text" value={form.village} onChange={handleChange} placeholder="Village" style={{ width: '100%', padding: '0.8rem 0.9rem', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '0.96rem', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label htmlFor="district" style={{ display: 'block', marginBottom: '0.45rem', fontWeight: 600 }}>District</label>
                  <input id="district" name="district" type="text" value={form.district} onChange={handleChange} placeholder="District" style={{ width: '100%', padding: '0.8rem 0.9rem', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '0.96rem', boxSizing: 'border-box' }} />
                </div>
              </div>
            </>
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
