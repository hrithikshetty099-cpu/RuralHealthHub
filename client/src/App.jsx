function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          🏥 Rural<span>Health</span>
        </div>

        <nav>
          <a href="#home">Home</a>
          <a href="#doctors">Find Doctors</a>
          <a href="#hospitals">Hospitals</a>
          <a href="#appointments">Appointments</a>
          <a href="#consult">Consult Online</a>
        </nav>

        <button className="login">Login</button>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-text">
            <p className="tag">🌿 Healthcare closer to you</p>

            <h1>
              Quality Healthcare
              <br />
              <span>Anywhere, Anytime.</span>
            </h1>

            <p className="description">
              Find nearby doctors, hospitals and healthcare services.
              Book appointments and consult doctors online — even on
              slow 3G networks.
            </p>

            <div className="search-box">
              <input
                type="text"
                placeholder="Search doctor, speciality or service"
              />

              <input
                type="text"
                placeholder="📍 Village / District"
              />

              <button>🔍 Search</button>
            </div>
          </div>

          <div className="hero-card">
            <div className="doctor-icon">👨‍⚕️</div>
            <h2>Healthcare at your fingertips</h2>
            <p>Connect with trusted healthcare providers near you.</p>
          </div>
        </section>

        <section className="services">
          <h2>How can we help you?</h2>
          <p className="section-text">
            Access essential healthcare services from one place.
          </p>

          <div className="service-grid">
            <div className="service-card">
              <div>👨‍⚕️</div>
              <h3>Find a Doctor</h3>
              <p>Search doctors by speciality and location.</p>
              <button>Find Doctors →</button>
            </div>

            <div className="service-card">
              <div>🏥</div>
              <h3>Nearby Hospitals</h3>
              <p>Discover hospitals and clinics near your village.</p>
              <button>View Hospitals →</button>
            </div>

            <div className="service-card">
              <div>📅</div>
              <h3>Book Appointment</h3>
              <p>Choose a doctor and book a convenient time.</p>
              <button>Book Now →</button>
            </div>

            <div className="service-card">
              <div>💻</div>
              <h3>Consult Online</h3>
              <p>Talk to a doctor remotely using low data mode.</p>
              <button>Consult Now →</button>
            </div>
          </div>
        </section>

        <section className="features">
          <div>
            <span>📶</span>
            <h3>Works on 3G</h3>
            <p>Low-data design for rural and unstable networks.</p>
          </div>

          <div>
            <span>🌐</span>
            <h3>Multiple Languages</h3>
            <p>Access healthcare information in your language.</p>
          </div>

          <div>
            <span>📋</span>
            <h3>My Health</h3>
            <p>Keep track of appointments and previous visits.</p>
          </div>

          <div>
            <span>🎤</span>
            <h3>Voice Assistance</h3>
            <p>Find healthcare services using voice commands.</p>
          </div>
        </section>
      </main>

      <footer>
        <div className="logo">
          🏥 Rural<span>Health</span>
        </div>
        <p>Healthcare access, closer to you.</p>
      </footer>
    </div>
  );
}

export default App;