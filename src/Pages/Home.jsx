
import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader/SiteHeader";function Home() {
  return (
    <div className="app">
      <SiteHeader />

      <main>
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-content">
            <span className="eyebrow">ჯანმრთელობაზე ზრუნვა მარტივად</span>
            <h1 id="hero-title">იპოვე შენთვის სასურველი ექიმი</h1>
            <p>
              დაგეგმე სამედიცინო ვიზიტი მარტივად, ონლაინ.
              შეარჩიე სპეციალისტი და იპოვე შენთვის მოსახერხებელი დრო.
            </p>
            <Link className="button" to="/doctors">ექიმების ნახვა →</Link>

            <div className="hero-note">
              <span className="status-dot" aria-hidden="true"></span>
              მარტივი და მოსახერხებელი დაჯავშნა
            </div>
          </div>

          <aside className="hero-card" aria-label="ვიზიტის მაგალითი">
            <div className="medical-symbol" aria-hidden="true">+</div>
            <p className="hero-card-label">MEDIBOOK · ჯანმრთელობა</p>
            <h2>შენი ჯანმრთელობა ჩვენი პრიორიტეტია</h2>

            <article className="appointment-preview">
              <div className="calendar-icon" aria-hidden="true">▦</div>
              <div>
                <strong>სამედიცინო ვიზიტი</strong>
                <p>დაჯავშნე სასურველ დროს</p>
              </div>
              <span className="preview-check" aria-hidden="true">✓</span>
            </article>
          </aside>
        </section>

        <section className="doctors-section" aria-labelledby="doctors-title">
          <div className="section-heading">
            <div>
              <h2 id="doctors-title">ჩვენი ექიმები</h2>
              <p>გაეცანი სპეციალისტებს და შეარჩიე შენთვის სასურველი.</p>
            </div>
            <span className="doctor-count">2 სპეციალისტი</span>
          </div>

          <div className="doctor-grid">
            <article className="doctor-card">
              <div className="doctor-avatar" aria-hidden="true">ნბ</div>
              <h3>ნინო ბერიძე</h3>
              <p className="doctor-specialty">კარდიოლოგი</p>
              <p className="doctor-experience">გამოცდილება: 10 წელი</p>
              <Link className="button button-outline doctor-button" to="/doctors">
                ვიზიტის დაჯავშნა
              </Link>
            </article>

            <article className="doctor-card">
              <div className="doctor-avatar" aria-hidden="true">გმ</div>
              <h3>გიორგი მაისურაძე</h3>
              <p className="doctor-specialty">დერმატოლოგი</p>
              <p className="doctor-experience">გამოცდილება: 8 წელი</p>
              <Link className="button button-outline doctor-button" to="/doctors">
                ვიზიტის დაჯავშნა
              </Link>
            </article>

            <article className="doctor-card">
              <div className="doctor-avatar" aria-hidden="true">+</div>
              <h3>სწრაფი დაჯავშნა</h3>
              <p className="doctor-specialty">მარტივი პროცესი</p>
              <p className="doctor-experience">
                შეარჩიე სპეციალისტი და სასურველი დრო.
              </p>
              <Link className="button button-outline doctor-button" to="/doctors">
                ექიმების ნახვა
              </Link>
            </article>
          </div>
        </section>

        <section className="how-section" aria-labelledby="how-title">
          <h2 id="how-title">როგორ მუშაობს MediBook?</h2>

          <div className="steps-grid">
            <article className="step-card">
              <span className="step-number">01</span>
              <h3>იპოვე ექიმი</h3>
              <p>მოძებნე ექიმი სპეციალობის მიხედვით.</p>
            </article>

            <article className="step-card">
              <span className="step-number">02</span>
              <h3>შეარჩიე დრო</h3>
              <p>აირჩიე შენთვის მოსახერხებელი ვიზიტის დრო.</p>
            </article>

            <article className="step-card">
              <span className="step-number">03</span>
              <h3>დაჯავშნე ვიზიტი</h3>
              <p>დაგეგმე ვიზიტი მარტივად და კომფორტულად.</p>
            </article>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>© 2026 MediBook. ყველა უფლება დაცულია.</p>
        <span>კონტაქტი: info@medibook.ge</span>
      </footer>
    </div>
  );
}

export default Home;
