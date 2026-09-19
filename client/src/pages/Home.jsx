import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, MapPin, Stethoscope, Video, Building2, Calendar, Mic, ArrowRight, ShieldCheck, Heart, Users, Activity, Sparkles } from 'lucide-react';
import { DoctorCard } from '../components/DoctorCard';
import { HospitalCard } from '../components/HospitalCard';

export const Home = () => {
  const { 
    t, 
    navigateTo, 
    doctors, 
    hospitals, 
    globalSearchTerm, 
    setGlobalSearchTerm, 
    globalLocationTerm, 
    setGlobalLocationTerm,
    lowDataMode 
  } = useApp();

  const [query, setQuery] = useState(globalSearchTerm);
  const [loc, setLoc] = useState(globalLocationTerm);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setGlobalSearchTerm(query);
    setGlobalLocationTerm(loc);
    navigateTo('doctors');
  };

  const quickSpecialties = [
    { label: "General Physician", query: "General Physician" },
    { label: "Cardiologist", query: "Cardiologist" },
    { label: "Pediatrician (Child)", query: "Pediatrician" },
    { label: "Gynecologist (Women)", query: "Gynecologist" },
    { label: "Dermatologist (Skin)", query: "Dermatologist" },
    { label: "Orthopedic (Bone & Joint)", query: "Orthopedic" }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        backgroundColor: '#f0fdfa',
        background: lowDataMode 
          ? '#f8fafc' 
          : 'radial-gradient(circle at 10% 20%, rgba(204, 251, 241, 0.6) 0%, rgba(240, 253, 250, 0.4) 90%)',
        borderBottom: '1px solid var(--border-color)',
        padding: '3.5rem 0 3rem 0'
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '880px' }}>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.9rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: '#ccfbf1',
            color: 'var(--primary-dark)',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '1.25rem'
          }}>
            <Sparkles size={16} color="var(--primary)" /> Dedicated Rural Tele-Health & Primary Care Network
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            color: '#0f172a',
            marginBottom: '1rem'
          }}>
            {t.tagline}
          </h1>

          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-muted)',
            lineHeight: '1.6',
            marginBottom: '2rem',
            maxWidth: '680px',
            margin: '0 auto 2.2rem auto'
          }}>
            {t.subTagline}
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} style={{
            backgroundColor: '#ffffff',
            padding: '0.75rem',
            borderRadius: 'var(--radius-lg)',
            boxShadow: lowDataMode ? 'none' : '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
            border: '1.5px solid var(--border-color)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            textAlign: 'left'
          }}>
            {/* Doctor/Speciality input */}
            <div style={{ flex: '1 1 260px', display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.5rem 0.75rem' }}>
              <Search size={20} color="var(--primary)" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.hero.searchPlaceholder}
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ width: '1px', backgroundColor: 'var(--border-color)', display: 'none' }} className="search-divider" />

            {/* Location input */}
            <div style={{ flex: '1 1 220px', display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.5rem 0.75rem' }}>
              <MapPin size={20} color="var(--primary)" />
              <input
                type="text"
                value={loc}
                onChange={(e) => setLoc(e.target.value)}
                placeholder={t.hero.locationPlaceholder}
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: '0 0 auto', padding: '0.8rem 1.6rem', fontSize: '1rem' }}
            >
              {t.hero.searchBtn}
            </button>
          </form>

          {/* Quick Specialties */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Quick Specialties:</span>
            {quickSpecialties.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  setGlobalSearchTerm(item.query);
                  navigateTo('doctors');
                }}
                style={{
                  fontSize: '0.78rem',
                  padding: '0.3rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* 4 Primary Action Buttons */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.85rem',
            marginTop: '2.5rem'
          }}>
            <button 
              onClick={() => navigateTo('doctors')}
              className="btn btn-primary btn-lg" 
              style={{ justifyContent: 'center' }}
            >
              <Stethoscope size={20} />
              {t.hero.searchBtn}
            </button>

            <button 
              onClick={() => navigateTo('hospitals')}
              className="btn btn-secondary btn-lg" 
              style={{ justifyContent: 'center' }}
            >
              <Building2 size={20} color="var(--primary)" />
              {t.hero.nearbyHospitalsBtn}
            </button>

            <button 
              onClick={() => navigateTo('appointments')}
              className="btn btn-secondary btn-lg" 
              style={{ justifyContent: 'center' }}
            >
              <Calendar size={20} color="#0284c7" />
              {t.hero.bookAppointmentBtn}
            </button>

            <button 
              onClick={() => navigateTo('consultation')}
              className="btn btn-success btn-lg" 
              style={{ justifyContent: 'center' }}
            >
              <Video size={20} />
              {t.hero.consultOnlineBtn}
            </button>
          </div>

        </div>
      </section>

      {/* Pillars Section: Works on 3G, 5 Languages, Voice, Health Records */}
      <section style={{ padding: '3.5rem 0', backgroundColor: '#ffffff', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="badge badge-teal" style={{ marginBottom: '0.5rem' }}>Engineered For The Field</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Built for Grassroot Communities & Remote Villages
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Solving healthcare accessibility without relying on high-speed 5G or heavy apps.
            </p>
          </div>

          <div className="grid-4">
            {/* Feature 1 */}
            <div className="card" style={{ borderTop: '4px solid var(--primary)' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '10px',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <Activity size={24} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                {t.features.f1Title}
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                {t.features.f1Desc} Runs seamlessly even on slow edge networks with our instant 3G toggle.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card" style={{ borderTop: '4px solid #0284c7' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '10px',
                backgroundColor: '#e0f2fe',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <Users size={24} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                {t.features.f2Title}
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                {t.features.f2Desc} Seamless switcher for Kannada, Hindi, Tamil, Telugu, and English.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card" style={{ borderTop: '4px solid #16a34a' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '10px',
                backgroundColor: '#dcfce7',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <Mic size={24} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                {t.features.f3Title}
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                {t.features.f3Desc} Speak naturally in your native language to locate nearby doctors and hospitals.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card" style={{ borderTop: '4px solid #d97706' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '10px',
                backgroundColor: '#fef3c7',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <Heart size={24} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                {t.features.f4Title}
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                {t.features.f4Desc} Instant offline-cached medical card for prescriptions, visit history, and emergency notes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section style={{ padding: '3.5rem 0', backgroundColor: 'var(--bg-main)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.8rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-teal" style={{ marginBottom: '0.4rem' }}>Verified Practitioners</span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Doctors Available Today
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Qualified medical officers and specialists serving rural taluks & telemedicine portals.
              </p>
            </div>

            <button
              onClick={() => navigateTo('doctors')}
              className="btn btn-outline"
              style={{ fontSize: '0.9rem' }}
            >
              View All Doctors <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid-3">
            {doctors.slice(0, 3).map(doctor => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Hospitals & Clinics */}
      <section style={{ padding: '3.5rem 0', backgroundColor: '#ffffff', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.8rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-blue" style={{ marginBottom: '0.4rem' }}>Nearby Facilities</span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Hospitals, Clinics & PHC Centers
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Government referral hospitals and community health clinics with active emergency units.
              </p>
            </div>

            <button
              onClick={() => navigateTo('hospitals')}
              className="btn btn-outline"
              style={{ fontSize: '0.9rem' }}
            >
              Explore All Facilities <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid-2">
            {hospitals.slice(0, 2).map(hospital => (
              <HospitalCard key={hospital.id} hospital={hospital} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works for Rural Citizens */}
      <section style={{ padding: '3.5rem 0', backgroundColor: 'var(--bg-main)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.8rem' }}>
            How Rural Health Hub Works In 3 Simple Steps
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2.5rem auto', fontSize: '0.95rem' }}>
            No complicated apps or heavy registration required. Easy to operate directly from any mobile browser or Grama Panchayat kiosk.
          </p>

          <div className="grid-3" style={{ textAlign: 'left' }}>
            <div className="card" style={{ backgroundColor: '#ffffff' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>01</div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Search or Speak</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Type your health concern or use the <strong>Voice Assistant</strong> in Kannada, Hindi, Tamil, Telugu, or English.
              </p>
            </div>

            <div className="card" style={{ backgroundColor: '#ffffff' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '0.5rem' }}>02</div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Select Doctor or Clinic</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Choose between an <strong>In-Person visit</strong> or immediate <strong>Online Tele-Consultation</strong> matching your village distance.
              </p>
            </div>

            <div className="card" style={{ backgroundColor: '#ffffff' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)', marginBottom: '0.5rem' }}>03</div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Receive Digital Care</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Connect via low-data audio/video room and get SMS prescriptions instantly stored in your offline-ready <strong>My Health</strong> dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
