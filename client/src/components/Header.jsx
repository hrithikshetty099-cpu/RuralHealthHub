import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  HeartPulse, 
  Menu, 
  X, 
  Globe, 
  Mic, 
  ShieldCheck, 
  User, 
  Zap 
} from 'lucide-react';

export const Header = () => {
  const { 
    t, 
    lang, 
    setLang, 
    lowDataMode, 
    setLowDataMode, 
    networkSpeed, 
    currentPage, 
    navigateTo,
    authUser,
    logout
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: t.nav.home },
    { id: 'doctors', label: t.nav.findDoctors },
    { id: 'hospitals', label: t.nav.hospitals },
    { id: 'appointments', label: t.nav.appointments },
    { id: 'consultation', label: t.nav.consultOnline },
    { id: 'my-health', label: t.nav.myHealth },
    { id: 'voice-assistant', label: t.nav.voiceAssistant, icon: true },
  ];

  const handleNav = (pageId) => {
    navigateTo(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: lowDataMode ? 'none' : 'var(--shadow-sm)'
    }}>
      {/* Network & 3G Low Data Bar */}
      <div style={{
        backgroundColor: lowDataMode ? '#fef3c7' : '#f8fafc',
        borderBottom: '1px solid var(--border-color)',
        padding: '0.35rem 1rem',
        fontSize: '0.8rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span 
              className={`pulse-dot ${
                networkSpeed === 'excellent' || networkSpeed === 'good' ? 'pulse-green' : 
                networkSpeed === 'poor' ? 'pulse-amber' : 'pulse-red'
              }`}
            />
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
              {t.common.connectionLabel}: {networkSpeed.toUpperCase()}
            </span>
          </div>

          <span style={{ color: 'var(--text-light)' }}>|</span>

          {lowDataMode ? (
            <span style={{ color: '#b45309', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Zap size={14} /> 3G Lightweight Mode Active (Low Bandwidth)
            </span>
          ) : (
            <span style={{ color: 'var(--text-muted)' }}>
              Standard Mode
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Low Data Toggle */}
          <button 
            onClick={() => setLowDataMode(!lowDataMode)}
            style={{
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 600,
              backgroundColor: lowDataMode ? '#d97706' : '#e2e8f0',
              color: lowDataMode ? '#ffffff' : 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
            title="Toggle between full rich media and ultra-lightweight 3G mode"
          >
            <Zap size={12} />
            {lowDataMode ? '3G Mode (ON)' : 'Enable 3G Mode'}
          </button>

          {/* Language Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Globe size={14} color="var(--primary)" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              style={{
                fontSize: '0.78rem',
                fontWeight: 600,
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                padding: '0.15rem 0.35rem',
                backgroundColor: '#ffffff',
                color: 'var(--text-main)',
                cursor: 'pointer'
              }}
            >
              <option value="en">English (ENG)</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="te">తెలుగు (Telugu)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1.25rem',
        minHeight: '68px'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => handleNav('home')} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.65rem', 
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 10px rgba(13, 148, 136, 0.3)'
          }}>
            <HeartPulse size={24} />
          </div>
          <div>
            <span style={{ 
              fontSize: '1.25rem', 
              fontWeight: 800, 
              color: 'var(--text-main)',
              letterSpacing: '-0.02em',
              display: 'block',
              lineHeight: 1.1
            }}>
              Rural<span style={{ color: 'var(--primary)' }}>Health</span>Hub
            </span>
            <span style={{ 
              fontSize: '0.72rem', 
              color: 'var(--text-muted)', 
              fontWeight: 600,
              display: 'block' 
            }}>
              {t.tagline.split(',')[0]}
            </span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem'
        }} className="desktop-nav">
          {navLinks.map(link => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                style={{
                  padding: '0.45rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 700 : 500,
                  backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                  color: isActive ? 'var(--primary-dark)' : 'var(--text-main)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'background-color 0.15s'
                }}
              >
                {link.icon && <Mic size={14} color="var(--primary)" />}
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button
            onClick={() => handleNav('admin')}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.82rem', padding: '0.45rem 0.8rem' }}
            title="Admin Management Panel"
          >
            <ShieldCheck size={15} />
            <span className="desktop-label">{t.nav.admin}</span>
          </button>

          <button
            onClick={() => {
              if (authUser) {
                logout();
                return;
              }
              handleNav('login');
            }}
            className="btn btn-primary btn-sm"
            style={{ fontSize: '0.82rem', padding: '0.45rem 0.95rem' }}
          >
            <User size={15} />
            <span>{authUser ? 'Logout' : t.nav.login}</span>
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-hamburger-btn"
            style={{
              padding: '0.45rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-subtle)',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#ffffff',
          borderTop: '1px solid var(--border-color)',
          padding: '1rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => handleNav(link.id)}
              style={{
                textAlign: 'left',
                padding: '0.65rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: currentPage === link.id ? 'var(--primary-light)' : 'transparent',
                color: currentPage === link.id ? 'var(--primary-dark)' : 'var(--text-main)',
                fontWeight: 600,
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {link.icon && <Mic size={16} color="var(--primary)" />}
              {link.label}
            </button>
          ))}
          <div style={{ borderTop: '1px solid var(--border-color)', margin: '0.5rem 0' }} />
          <button
            onClick={() => handleNav('admin')}
            style={{
              textAlign: 'left',
              padding: '0.65rem 0.75rem',
              color: 'var(--text-main)',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <ShieldCheck size={16} />
            {t.nav.admin}
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 1040px) {
          .desktop-nav { display: none !important; }
          .desktop-label { display: none; }
          .mobile-hamburger-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
};
