/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { translations, sampleDoctors, sampleHospitals, sampleInitialAppointments, samplePatientProfile } from '../data/sampleData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('rhh_lang') || 'en');
  const [lowDataMode, setLowDataMode] = useState(() => {
    return localStorage.getItem('rhh_lowdata') === 'true';
  });
  const [networkSpeed, setNetworkSpeed] = useState('good'); // 'excellent' | 'good' | 'poor' | 'offline'
  
  // Doctors & Hospitals state
  const [doctors, setDoctors] = useState(() => {
    const saved = localStorage.getItem('rhh_doctors');
    return saved ? JSON.parse(saved) : sampleDoctors;
  });

  const [hospitals, setHospitals] = useState(() => {
    const saved = localStorage.getItem('rhh_hospitals');
    return saved ? JSON.parse(saved) : sampleHospitals;
  });

  // Appointments state
  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem('rhh_appointments');
    return saved ? JSON.parse(saved) : sampleInitialAppointments;
  });

  // Patient Profile state
  const [patientProfile, setPatientProfile] = useState(() => {
    const saved = localStorage.getItem('rhh_patient');
    return saved ? JSON.parse(saved) : samplePatientProfile;
  });

  // Navigation state: 'home' | 'doctors' | 'doctor-profile' | 'hospitals' | 'hospital-details' | 'book-appointment' | 'appointments' | 'consultation' | 'my-health' | 'voice-assistant' | 'admin' | 'login'
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [selectedHospitalId, setSelectedHospitalId] = useState(null);
  const [prefilledBookingDoctor, setPrefilledBookingDoctor] = useState(null);
  const [activeConsultationDoctor, setActiveConsultationDoctor] = useState(null);

  // Search parameters for navigation from Home
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [globalLocationTerm, setGlobalLocationTerm] = useState('');

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('rhh_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('rhh_lowdata', lowDataMode);
    if (lowDataMode) {
      document.body.classList.add('low-data-mode');
    } else {
      document.body.classList.remove('low-data-mode');
    }
  }, [lowDataMode]);

  useEffect(() => {
    localStorage.setItem('rhh_doctors', JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem('rhh_hospitals', JSON.stringify(hospitals));
  }, [hospitals]);

  useEffect(() => {
    localStorage.setItem('rhh_appointments', JSON.stringify(appointments));
  }, [appointments]);

  // Real-time network detection simulation & online/offline listeners
  useEffect(() => {
    const handleOnline = () => setNetworkSpeed('good');
    const handleOffline = () => {
      setNetworkSpeed('offline');
      setLowDataMode(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Auto-detect navigator connection if available
    if (navigator.connection) {
      const updateConn = () => {
        const effectiveType = navigator.connection.effectiveType;
        if (effectiveType === '2g' || effectiveType === 'slow-2g') {
          setNetworkSpeed('poor');
          setLowDataMode(true);
        } else if (effectiveType === '3g') {
          setNetworkSpeed('poor');
        } else if (effectiveType === '4g') {
          setNetworkSpeed('good');
        }
      };
      navigator.connection.addEventListener('change', updateConn);
      updateConn();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const t = translations[lang] || translations.en;

  const navigateTo = (page, params = {}) => {
    if (params.doctorId) setSelectedDoctorId(params.doctorId);
    if (params.hospitalId) setSelectedHospitalId(params.hospitalId);
    if (params.bookingDoctor) setPrefilledBookingDoctor(params.bookingDoctor);
    if (params.consultDoctor) setActiveConsultationDoctor(params.consultDoctor);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: lowDataMode ? 'auto' : 'smooth' });
  };

  const addAppointment = (newAppt) => {
    const updated = [newAppt, ...appointments];
    setAppointments(updated);
    return newAppt;
  };

  const addDoctor = (newDoc) => {
    const updated = [newDoc, ...doctors];
    setDoctors(updated);
  };

  const addHospital = (newHosp) => {
    const updated = [newHosp, ...hospitals];
    setHospitals(updated);
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        t,
        lowDataMode,
        setLowDataMode,
        networkSpeed,
        setNetworkSpeed,
        doctors,
        hospitals,
        appointments,
        patientProfile,
        setPatientProfile,
        currentPage,
        navigateTo,
        selectedDoctorId,
        setSelectedDoctorId,
        selectedHospitalId,
        setSelectedHospitalId,
        prefilledBookingDoctor,
        setPrefilledBookingDoctor,
        activeConsultationDoctor,
        setActiveConsultationDoctor,
        globalSearchTerm,
        setGlobalSearchTerm,
        globalLocationTerm,
        setGlobalLocationTerm,
        addAppointment,
        addDoctor,
        addHospital
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
