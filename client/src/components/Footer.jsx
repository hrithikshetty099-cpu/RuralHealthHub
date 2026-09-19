import { useApp } from '../context/AppContext';
import { HeartPulse, PhoneCall, ShieldAlert, Globe } from 'lucide-react';

export const Footer = () => {
  const { t, navigateTo } = useApp();

  return (
    <footer style={{
      backgroundColor: '#0f172a',
      color: '#cbd5e1',
      padding: '3rem 0 1.5rem 0',
      marginTop: 'auto',
      borderTop: '1px solid #1e293b'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem'
        }}>
          {/* Col 1: Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}>
                <HeartPulse size={20} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                Rural<span style={{ color: '#2dd4bf' }}>Health</span>Hub
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: '1.6', color: '#94a3b8', marginBottom: '1.2rem' }}>
              Empowering rural communities with accessible digital healthcare, low-data teleconsultations, and seamless primary hospital connectivity.
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 0.8rem',
              backgroundColor: '#1e293b',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8rem',
              color: '#38bdf8'
            }}>
              <Globe size={14} /> National Rural Health Digital Initiative
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
              Quick Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li>
                <button 
                  onClick={() => navigateTo('home')} 
                  style={{ background: 'none', color: '#94a3b8', hover: { color: '#ffffff' }, cursor: 'pointer' }}
                >
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('doctors')} 
                  style={{ background: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  {t.nav.findDoctors}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('hospitals')} 
                  style={{ background: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  {t.nav.hospitals}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('appointments')} 
                  style={{ background: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  {t.nav.appointments}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo('consultation')} 
                  style={{ background: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  {t.nav.consultOnline}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Emergency & Toll Free */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
              Rural Emergency Helplines
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{
                backgroundColor: '#1e293b',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <div style={{ padding: '0.4rem', borderRadius: '50%', backgroundColor: 'rgba(220, 38, 38, 0.2)', color: '#f87171' }}>
                  <ShieldAlert size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Emergency Ambulance</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f87171' }}>Dial 108 (Toll Free)</div>
                </div>
              </div>

              <div style={{
                backgroundColor: '#1e293b',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <div style={{ padding: '0.4rem', borderRadius: '50%', backgroundColor: 'rgba(13, 148, 136, 0.2)', color: '#2dd4bf' }}>
                  <PhoneCall size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Tele-MANAS Mental Health</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#2dd4bf' }}>14416 / 1800 891 4416</div>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Village Tech & Connectivity */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
              Low-Bandwidth Guarantee
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.5', marginBottom: '0.8rem' }}>
              Our platform uses adaptive data transfer, compressed JSON payloads, and audio-first fallback protocols to guarantee operation even on 56kbps rural lines.
            </p>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Built for Community Health Centers, Gram Panchayats, and ASHA health workers.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid #1e293b',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.82rem',
          color: '#64748b'
        }}>
          <div>
            © 2026 Rural Health Hub. Educational Capstone / Prototype for Rural Healthcare Delivery.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Compliant with Ayushman Bharat Digital Mission (ABDM) guidelines</span>
            <span>Zero Tracking Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
