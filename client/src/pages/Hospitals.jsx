import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, MapPin, Search, Navigation } from 'lucide-react';
import { HospitalCard } from '../components/HospitalCard';

export const Hospitals = () => {
  const { hospitals } = useApp();
  const [filterDistrict, setFilterDistrict] = useState('All');
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const districts = ['All', 'Mandya', 'Tumakuru', 'Shirur / Bagalkote', 'Kolar'];

  const filtered = hospitals.filter(h => {
    const matchSearch = !searchQuery.trim() || 
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.availableServices.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchDistrict = filterDistrict === 'All' || h.district === filterDistrict;
    const matchEmergency = !emergencyOnly || h.isEmergency;

    return matchSearch && matchDistrict && matchEmergency;
  });

  return (
    <div style={{ padding: '2.5rem 0', backgroundColor: 'var(--bg-main)', minHeight: '80vh' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0284c7', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.3rem' }}>
            <Building2 size={18} /> Community Healthcare Network
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
            Hospitals, Clinics & Primary Health Centres
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Locate nearby district hospitals, taluk referral units, generic medicine depots, and 24/7 trauma care centers.
          </p>
        </div>

        {/* Map Placeholder Banner (Sample Location Map) */}
        <div className="card" style={{
          backgroundColor: '#ffffff',
          padding: '1.25rem',
          marginBottom: '2rem',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.85rem',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Navigation size={18} color="var(--primary)" />
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Regional Healthcare Facilities Map (Simulated GPS)</span>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Targeting rural taluk clusters • 4 major centres registered
            </span>
          </div>

          {/* Interactive Visual Map Blueprint */}
          <div style={{
            height: '180px',
            backgroundColor: '#0f172a',
            borderRadius: 'var(--radius-md)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}>
            <div style={{ position: 'absolute', top: '20px', left: '15%', display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'rgba(15, 118, 110, 0.9)', color: '#ffffff', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
              <MapPin size={12} /> Mandya Care (2.4 km)
            </div>

            <div style={{ position: 'absolute', bottom: '30px', left: '42%', display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'rgba(2, 132, 199, 0.9)', color: '#ffffff', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
              <MapPin size={12} /> Tumakuru DH (7.8 km)
            </div>

            <div style={{ position: 'absolute', top: '35px', right: '25%', display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'rgba(22, 163, 74, 0.9)', color: '#ffffff', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
              <MapPin size={12} /> Shirur PHC (1.1 km)
            </div>

            <div style={{ position: 'absolute', bottom: '25px', right: '12%', display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'rgba(217, 119, 6, 0.9)', color: '#ffffff', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
              <MapPin size={12} /> Kolar First-Aid (3.5 km)
            </div>

            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#0f172a',
              zIndex: 2
            }}>
              <span className="pulse-dot pulse-green" /> You are in: Mandya Rural Hobli • Nearest: Shirur PHC (1.1 km)
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'center' }}>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Search Facility or Service
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="input-control"
                  placeholder="e.g. Oxygen, X-Ray, Delivery..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '2.4rem' }}
                />
                <Search size={16} color="var(--text-light)" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Filter District
              </label>
              <select
                className="input-control"
                value={filterDistrict}
                onChange={(e) => setFilterDistrict(e.target.value)}
              >
                {districts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '1.3rem' }}>
              <input
                type="checkbox"
                id="emergencyCheckbox"
                checked={emergencyOnly}
                onChange={(e) => setEmergencyOnly(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--danger)', cursor: 'pointer' }}
              />
              <label htmlFor="emergencyCheckbox" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', cursor: 'pointer' }}>
                24/7 Emergency Facilities Only
              </label>
            </div>

          </div>
        </div>

        {/* Facilities Grid */}
        <div className="grid-2">
          {filtered.map(hospital => (
            <HospitalCard key={hospital.id} hospital={hospital} />
          ))}
        </div>

      </div>
    </div>
  );
};
