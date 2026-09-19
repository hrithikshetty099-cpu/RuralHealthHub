/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { translations, sampleDoctors, sampleHospitals, sampleInitialAppointments, samplePatientProfile } from '../data/sampleData';
import { apiRequest } from '../lib/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('rhh_lang') || 'en');
  const [lowDataMode, setLowDataMode] = useState(() => {
    return localStorage.getItem('rhh_lowdata') === 'true';
  });
  const [networkSpeed, setNetworkSpeed] = useState('good'); // 'excellent' | 'good' | 'poor' | 'offline'
  const [authUser, setAuthUser] = useState(() => {
    try {
      const saved = localStorage.getItem('rhh_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [healthRecords, setHealthRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  
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

  // Navigation state: 'home' | 'doctors' | 'doctor-profile' | 'hospitals' | 'hospital-details' | 'book-appointment' | 'appointments' | 'consultation' | 'my-health' | 'voice-assistant' | 'admin' | 'login' | 'dashboard'
  const [currentPage, setCurrentPage] = useState(() => {
    const savedUser = localStorage.getItem('rhh_auth_user');
    if (!savedUser) return 'home';
    try {
      const role = JSON.parse(savedUser).role;
      return role === 'doctor' ? 'doctor-dashboard' : role === 'admin' ? 'admin-portal' : 'dashboard';
    } catch {
      return 'home';
    }
  });
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [selectedHospitalId, setSelectedHospitalId] = useState(null);
  const [prefilledBookingDoctor, setPrefilledBookingDoctor] = useState(null);
  const [activeConsultationDoctor, setActiveConsultationDoctor] = useState(null);
  const [activeConsultationAppointment, setActiveConsultationAppointment] = useState(null);

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

  useEffect(() => {
    localStorage.setItem('rhh_patient', JSON.stringify(patientProfile));
  }, [patientProfile]);

  useEffect(() => {
    if (authUser) {
      localStorage.setItem('rhh_auth_user', JSON.stringify(authUser));
    } else {
      localStorage.removeItem('rhh_auth_user');
    }
  }, [authUser]);

  useEffect(() => {
    if (!authUser || !localStorage.getItem('rhh_auth_token')) return undefined;
    let cancelled = false;
    Promise.all([
      apiRequest('/appointments'),
      apiRequest('/health-records'),
      apiRequest('/prescriptions'),
      apiRequest('/medicine-deliveries'),
    ]).then(([appointmentData, healthData, prescriptionData, deliveryData]) => {
      if (cancelled) return;
      setAppointments((appointmentData.appointments || []).map((appointment) => ({
        ...appointment,
        doctorName: appointment.doctor_name,
        doctorSpecialty: appointment.doctor_specialization,
        hospitalName: appointment.hospital_name,
        date: appointment.appointment_date,
        time: appointment.appointment_time,
        consultationType: appointment.consultation_type === 'online' ? 'Online Video' : 'In-Person',
        status: appointment.status,
      })));
      setHealthRecords(healthData.records || []);
      setPrescriptions(prescriptionData.prescriptions || []);
      setDeliveries(deliveryData.deliveries || []);
    }).catch(() => {
      // Keep the existing local data visible if the API is temporarily unavailable.
    });
    return () => { cancelled = true; };
  }, [authUser]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([apiRequest('/doctors'), apiRequest('/hospitals')]).then(([doctorData, hospitalData]) => {
      if (cancelled) return;
      if (doctorData.doctors?.length) setDoctors(doctorData.doctors);
      if (hospitalData.hospitals?.length) setHospitals(hospitalData.hospitals);
    }).catch(() => {
      // Preserve the local directory fallback when the API is unavailable.
    });
    return () => { cancelled = true; };
  }, []);

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
    if (params.consultationAppointment) setActiveConsultationAppointment(params.consultationAppointment);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: lowDataMode ? 'auto' : 'smooth' });
  };

  const login = (user, token = null) => {
    const normalizedUser = {
      id: user?.id || null,
      name: user?.name || user?.email?.split('@')[0] || 'Patient',
      email: user?.email || '',
      phone: user?.phone || '',
      village: user?.village || '',
      district: user?.district || '',
      role: user?.role || 'patient',
    };
    setAuthUser(normalizedUser);
    if (token) localStorage.setItem('rhh_auth_token', token);
    setCurrentPage(normalizedUser.role === 'doctor' ? 'doctor-dashboard' : normalizedUser.role === 'admin' ? 'admin-portal' : 'dashboard');
    return normalizedUser;
  };

  const logout = () => {
    setAuthUser(null);
    localStorage.removeItem('rhh_auth_token');
    setCurrentPage('login');
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
        healthRecords,
        prescriptions,
        deliveries,
        patientProfile,
        setPatientProfile,
        currentPage,
        navigateTo,
        isAuthenticated: !!authUser,
        authUser,
        login,
        logout,
        selectedDoctorId,
        setSelectedDoctorId,
        selectedHospitalId,
        setSelectedHospitalId,
        prefilledBookingDoctor,
        setPrefilledBookingDoctor,
        activeConsultationDoctor,
        setActiveConsultationDoctor,
        activeConsultationAppointment,
        setActiveConsultationAppointment,
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
