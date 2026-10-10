
import './App.css'

const doctors = [
  {
    id: 1,
    name: 'Dr. Nino Beridze',
    specialty: 'Cardiologist',
    experience: '10 years of experience',
    initials: 'NB',
  },
  {
    id: 2,
    name: 'Dr. Giorgi Maisuradze',
    specialty: 'Dermatologist',
    experience: '8 years of experience',
    initials: 'GM',
  },
  {
    id: 3,
    name: 'Dr. Ana Kapanadze',
    specialty: 'Pediatrician',
    experience: '6 years of experience',
    initials: 'AK',
  },
]

function App() {
  return (
    <div className="app">
      <header className="site-header">
        <a className="brand" href="#" aria-label="MediBook home">
          <span className="brand-icon">+</span>
          MediBook
        </a>

        <nav className="navigation" aria-label="Main navigation">
          <a href="#home">Home</a>
          <a href="#doctors">Doctors</a>
          <a href="#how-it-works">How it works</a>
        </nav>

        <a className="button button-outline" href="#doctors">
          Find a doctor
        </a>
      </header>

      <main>
        <section className="hero-section" id="home">
          <div className="hero-content">
            <span className="eyebrow">YOUR HEALTH, OUR PRIORITY</span>
            <h1>Healthcare made simple.</h1>
            <p>
              Find trusted doctors and make your next appointment in just a
              few simple steps.
            </p>
            <a className="button" href="#doctors">
              Explore doctors <span aria-hidden="true">→</span>
            </a>

            <div className="hero-note">
              <span className="status-dot" />
              A simpler way to manage your health
            </div>
          </div>

          <div className="hero-card" aria-label="Appointment illustration">
            <div className="medical-symbol">+</div>
            <p className="hero-card-label">YOUR HEALTH JOURNEY</p>
            <h2>Care that fits your life.</h2>
            <div className="appointment-preview">
              <span className="calendar-icon" aria-hidden="true">▦</span>
              <div>
                <strong>Book an appointment</strong>
                <p>Choose a doctor and a time</p>
              </div>
              <span className="preview-check" aria-hidden="true">✓</span>
            </div>
          </div>
        </section>

        <section className="doctors-section" id="doctors">
          <div className="section-heading">
            <div>
              <span className="eyebrow">MEET OUR SPECIALISTS</span>
              <h2>Find the right doctor for you</h2>
              <p>Explore our sample list of medical specialists.</p>
            </div>
            <span className="doctor-count">3 specialists</span>
          </div>

          <div className="doctor-grid">
            {doctors.map((doctor) => (
              <article className="doctor-card" key={doctor.id}>
                <div className="doctor-avatar" aria-hidden="true">
                  {doctor.initials}
                </div>
                <h3>{doctor.name}</h3>
                <p className="doctor-specialty">{doctor.specialty}</p>
                <p className="doctor-experience">{doctor.experience}</p>
                <a
                  className="button doctor-button"
                  href="#how-it-works"
                  aria-label={`Learn how to book an appointment with ${doctor.name}`}
                >
                  View appointment options
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="how-section" id="how-it-works">
          <span className="eyebrow">SIMPLE AND CONVENIENT</span>
          <h2>How MediBook works</h2>
          <div className="steps-grid">
            <article className="step-card">
              <span className="step-number">01</span>
              <h3>Find a specialist</h3>
              <p>Explore doctors by their medical specialty.</p>
            </article>
            <article className="step-card">
              <span className="step-number">02</span>
              <h3>Choose a time</h3>
              <p>Review appointment options that suit your schedule.</p>
            </article>
            <article className="step-card">
              <span className="step-number">03</span>
              <h3>Plan your visit</h3>
              <p>Keep your healthcare appointments organised.</p>
            </article>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand" href="#home">
          <span className="brand-icon">+</span>
          MediBook
        </a>
        <p>Making healthcare appointments simpler.</p>
        <span>© 2026 MediBook</span>
      </footer>
    </div>
  )
}

export default App
