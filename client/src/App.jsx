import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Doctors } from './pages/Doctors';
import { DoctorProfile } from './pages/DoctorProfile';
import { Hospitals } from './pages/Hospitals';
import { HospitalDetails } from './pages/HospitalDetails';
import { BookAppointment } from './pages/BookAppointment';
import { Appointments } from './pages/Appointments';
import { Consultation } from './pages/Consultation';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { HealthRecords } from './pages/HealthRecords';
import { VoiceAssistant } from './pages/VoiceAssistant';
import { MedicineDelivery } from './pages/MedicineDelivery';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { AdminPortal } from './pages/AdminPortal';

const PageRenderer = () => {
  const { currentPage } = useApp();

  switch (currentPage) {
    case 'home':
      return <Home />;
    case 'doctors':
      return <Doctors />;
    case 'doctor-profile':
      return <DoctorProfile />;
    case 'hospitals':
      return <Hospitals />;
    case 'hospital-details':
      return <HospitalDetails />;
    case 'book-appointment':
      return <BookAppointment />;
    case 'appointments':
      return <Appointments />;
    case 'consultation':
      return <Consultation />;
    case 'login':
      return <Login />;
    case 'dashboard':
      return <Dashboard />;
    case 'doctor-dashboard':
      return <DoctorDashboard />;
    case 'admin-portal':
      return <AdminPortal />;
    case 'my-health':
      return <HealthRecords />;
    case 'voice-assistant':
      return <VoiceAssistant />;
    case 'medicine-delivery':
      return <MedicineDelivery />;
    default:
      return <Home />;
  }
};

function App() {
  return (
    <div className="app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1 }}>
        <PageRenderer />
      </main>
      <Footer />
    </div>
  );
}

export default function AppRoot() {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
}