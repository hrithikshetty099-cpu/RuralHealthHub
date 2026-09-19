import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Search, MapPin, RotateCcw, Stethoscope } from 'lucide-react';
import { DoctorCard } from '../components/DoctorCard';
import { BackToDashboardButton } from '../components/BackToDashboardButton';

export const Doctors = () => {
  const { 
    doctors, 
    globalSearchTerm, 
    setGlobalSearchTerm, 
    globalLocationTerm, 
    setGlobalLocationTerm 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState(globalSearchTerm);
  const [locationQuery, setLocationQuery] = useState(globalLocationTerm);
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedType, setSelectedType] = useState('All'); // 'All' | 'Online' | 'In-Person' | 'Both'
  const [availabilityFilter, setAvailabilityFilter] = useState('All'); // 'All' | 'Today'

  const specialtiesList = [
    'All',
    'General Physician',
    'Cardiologist',
    'Pediatrician',
    'Gynecologist & Obstetrician',
    'Dermatologist',
    'Orthopedic Specialist'
  ];

  const filteredDoctors = useMemo(() => {
    return doctors.filter(doc => {
      const matchSearch = !searchQuery.trim() || 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchLocation = !locationQuery.trim() ||
        doc.location.toLowerCase().includes(locationQuery.toLowerCase()) ||
        doc.hospitalName.toLowerCase().includes(locationQuery.toLowerCase());

      const matchSpecialty = selectedSpecialty === 'All' || doc.specialization.toLowerCase() === selectedSpecialty.toLowerCase();

      const matchType = selectedType === 'All' || 
        (selectedType === 'Online' && (doc.consultationType === 'Online' || doc.consultationType === 'Both')) ||
        (selectedType === 'In-Person' && (doc.consultationType === 'In-Person' || doc.consultationType === 'Both'));

      const matchAvailability = availabilityFilter === 'All' || (availabilityFilter === 'Today' && doc.isAvailableToday);

      return matchSearch && matchLocation && matchSpecialty && matchType && matchAvailability;
    });
  }, [doctors, searchQuery, locationQuery, selectedSpecialty, selectedType, availabilityFilter]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setLocationQuery('');
    setSelectedSpecialty('All');
    setSelectedType('All');
    setAvailabilityFilter('All');
    setGlobalSearchTerm('');
    setGlobalLocationTerm('');
  };

  return (
    <div style={{ padding: '2.5rem 0', backgroundColor: 'var(--bg-main)', minHeight: '80vh' }}>
      <div className="container">
        <BackToDashboardButton />
        
        {/* Page Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.3rem' }}>
            <Stethoscope size={18} /> Rural Healthcare Providers
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
            Find Doctors & Medical Specialists
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Browse verified medical practitioners serving village taluks, primary health centres, and remote tele-clinics.
          </p>
        </div>

        {/* Filter Bar Controls */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem', backgroundColor: '#ffffff' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            {/* Search doctor */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Doctor Name / Specialization
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="input-control"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Dr. Ananya, Heart, Fever..."
                  style={{ paddingLeft: '2.4rem' }}
                />
                <Search size={16} color="var(--text-light)" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            {/* Location filter */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Location / District
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="input-control"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="e.g. Mandya, Tumakuru..."
                  style={{ paddingLeft: '2.4rem' }}
                />
                <MapPin size={16} color="var(--text-light)" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            {/* Specialty filter */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Specialization
              </label>
              <select
                className="input-control"
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
              >
                {specialtiesList.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            {/* Consultation Type filter */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Consultation Type
              </label>
              <select
                className="input-control"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="All">All Types</option>
                <option value="Online">Online Video / Tele-consult</option>
                <option value="In-Person">In-Person Hospital Visit</option>
              </select>
            </div>
          </div>

          {/* Quick toggle chips and reset */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
            paddingTop: '0.85rem',
            borderTop: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>Filter by Availability:</span>
              <button
                onClick={() => setAvailabilityFilter('All')}
                className={`btn btn-sm ${availabilityFilter === 'All' ? 'btn-primary' : 'btn-secondary'}`}
              >
                All Days
              </button>
              <button
                onClick={() => setAvailabilityFilter('Today')}
                className={`btn btn-sm ${availabilityFilter === 'Today' ? 'btn-primary' : 'btn-secondary'}`}
              >
                ✓ Available Today
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Showing <strong>{filteredDoctors.length}</strong> of {doctors.length} doctors
              </span>
              <button
                onClick={handleResetFilters}
                className="btn btn-secondary btn-sm"
                title="Reset all filters"
              >
                <RotateCcw size={13} /> Reset
              </button>
            </div>
          </div>
        </div>

        {/* Doctor Cards Grid */}
        {filteredDoctors.length > 0 ? (
          <div className="grid-3">
            {filteredDoctors.map(doctor => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem', backgroundColor: '#ffffff' }}>
            <Stethoscope size={48} color="var(--text-light)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              No Doctors Matched Your Search
            </h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 1.5rem auto', fontSize: '0.92rem' }}>
              Try broadening your location, removing specialty filters, or clearing the doctor search keyword.
            </p>
            <button onClick={handleResetFilters} className="btn btn-primary">
              View All Doctors
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
