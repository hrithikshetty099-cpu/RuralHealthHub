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
    case 'my-health':
      return (
        <div className="container" style={{ padding: '3rem 1.25rem', minHeight: '60vh' }}>
          <div className="card" style={{ maxWidth: '720px', margin: '0 auto', backgroundColor: '#ffffff' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>My Health</h1>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Your health records, appointment history, and follow-up reminders will appear here.
            </p>
          </div>
        </div>
      );
    case 'voice-assistant':
      return (
        <div className="container" style={{ padding: '3rem 1.25rem', minHeight: '60vh' }}>
          <div className="card" style={{ maxWidth: '720px', margin: '0 auto', backgroundColor: '#ffffff' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>Voice Assistant</h1>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
              This is a placeholder for voice-driven healthcare guidance and quick access to services.
            </p>
          </div>
        </div>
      );
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