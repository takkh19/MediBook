
import { Link } from "react-router-dom";
function About() {
  return (
    <div className="app">
      <header className="site-header">
        <Link className="brand" to="/" aria-label="MediBook მთავარი გვერდი">
          <span className="brand-icon" aria-hidden="true">+</span>
          MediBook
        </Link>

        <nav className="navigation" aria-label="მთავარი ნავიგაცია">
          <Link to="/">მთავარი</Link>
          <Link to="/about">ჩვენ შესახებ</Link>
        </nav>

        <Link className="button" to="/">
          მთავარ გვერდზე დაბრუნება
        </Link>
      </header>

      <main>
        <section className="hero-section" aria-labelledby="about-title">
          <div className="hero-content">
            <span className="eyebrow">ჩვენ შესახებ</span>
            <h1 id="about-title">ჯანმრთელობაზე ზრუნვა მარტივად</h1>
            <p>
              MediBook არის სამედიცინო პლატფორმა, რომელიც პაციენტებს
              ექიმის მოძიებასა და ვიზიტის დაჯავშნაში ეხმარება.
            </p>
            <Link className="button" to="/">
              მთავარი გვერდი →
            </Link>
          </div>

          <aside className="hero-card" aria-label="MediBook-ის მიზანი">
            <div className="medical-symbol" aria-hidden="true">+</div>
            <p className="hero-card-label">ჩვენი მიზანი</p>
            <h2>სამედიცინო მომსახურება უფრო ხელმისაწვდომი გავხადოთ</h2>
            <p>
              მარტივი ძიება, მოსახერხებელი დაჯავშნა და საჭირო ინფორმაცია
              ერთ სივრცეში.
            </p>
          </aside>
        </section>

        <section className="doctors-section" aria-labelledby="mission-title">
          <div className="section-heading">
            <div>
              <h2 id="mission-title">როგორ მუშაობს MediBook?</h2>
              <p>რამდენიმე მარტივი ნაბიჯი ექიმთან ვიზიტის დასაგეგმად.</p>
            </div>
          </div>

          <div className="steps-grid">
            <article className="step-card">
              <span className="step-number">01</span>
              <h3>ექიმის მოძიება</h3>
              <p>პაციენტი ეცნობა ექიმებსა და მათ სპეციალობებს.</p>
            </article>

            <article className="step-card">
              <span className="step-number">02</span>
              <h3>დროის შერჩევა</h3>
              <p>პაციენტი ირჩევს მისთვის მოსახერხებელ ვიზიტის დროს.</p>
            </article>

            <article className="step-card">
              <span className="step-number">03</span>
              <h3>ვიზიტის დაგეგმვა</h3>
              <p>პაციენტი გეგმავს სამედიცინო ვიზიტს ონლაინ.</p>
            </article>
          </div>
        </section>

        <section
          className="doctors-section"
          aria-labelledby="illustration-title"
        >
          <div className="section-heading">
            <div>
              <h2 id="illustration-title">MediBook-ის პლატფორმა</h2>
              <p>სამედიცინო ვიზიტების ონლაინ დაჯავშნა ერთ სივრცეში.</p>
            </div>
          </div>

          <figure>
            <img
              src="https://placehold.co/800x400?text=MediBook"
              alt="MediBook-ის სამედიცინო პლატფორმის საილუსტრაციო სურათი"
              style={{
                display: "block",
                width: "100%",
                maxWidth: "800px",
                height: "auto",
                margin: "0 auto",
                borderRadius: "16px",
              }}
            />
            <figcaption>
              MediBook ეხმარება პაციენტებს ექიმის მოძიებასა და ვიზიტის დაგეგმვაში.
            </figcaption>
          </figure>
        </section>

        <section className="how-section" aria-labelledby="updated-title">
          <h2 id="updated-title">პროექტის ინფორმაცია</h2>
          <p>
            MediBook-ის შესახებ ინფორმაცია განახლდა{" "}
            <time dateTime="2026-10-14">2026 წლის 14 ოქტომბერს</time>.
          </p>
        </section>
      </main>

      <footer className="site-footer">
        <p>© 2026 MediBook. ყველა უფლება დაცულია.</p>
        <a href="mailto:info@medibook.ge">დაგვიკავშირდით</a>
      </footer>
    </div>
  );
}

export default About;
