
import { Link } from "react-router-dom";

function Doctors() {
  const doctors = [
    {
      id: 1,
      name: "ნინო ბერიძე",
      specialty: "კარდიოლოგი",
      experience: "10 წლის გამოცდილება",
      initials: "ნბ",
    },
    {
      id: 2,
      name: "გიორგი მაისურაძე",
      specialty: "დერმატოლოგი",
      experience: "8 წლის გამოცდილება",
      initials: "გმ",
    },
    {
      id: 3,
      name: "ანა ლომიძე",
      specialty: "ნევროლოგი",
      experience: "7 წლის გამოცდილება",
      initials: "ალ",
    },
    {
      id: 4,
      name: "დავით კაპანაძე",
      specialty: "ოჯახის ექიმი",
      experience: "12 წლის გამოცდილება",
      initials: "დკ",
    },
    {
      id: 5,
      name: "მარიამ ჯაფარიძე",
      specialty: "პედიატრი",
      experience: "9 წლის გამოცდილება",
      initials: "მჯ",
    },
    {
      id: 6,
      name: "ლევან გელაშვილი",
      specialty: "ორთოპედი",
      experience: "11 წლის გამოცდილება",
      initials: "ლგ",
    },
  ];

  return (
    <div className="app">
      <header className="site-header">
        <Link className="brand" to="/" aria-label="MediBook მთავარი გვერდი">
          <span className="brand-icon" aria-hidden="true">+</span>
          MediBook
        </Link>

        <nav className="navigation" aria-label="მთავარი ნავიგაცია">
          <Link to="/">მთავარი</Link>
          <Link to="/doctors" aria-current="page">ექიმები</Link>
          <Link to="/about">ჩვენ შესახებ</Link>
        </nav>

        <Link className="button" to="/">მთავარ გვერდზე დაბრუნება</Link>
      </header>

      <main>
        <section className="hero-section" aria-labelledby="doctors-page-title">
          <div className="hero-content">
            <span className="eyebrow">ჩვენი სპეციალისტები</span>
            <h1 id="doctors-page-title">იპოვე შენთვის სასურველი ექიმი</h1>
            <p>
              გაეცანი სპეციალისტებს, შეარჩიე საჭირო მიმართულება
              და დაგეგმე ვიზიტი.
            </p>
          </div>

          <aside className="hero-card">
            <div className="medical-symbol" aria-hidden="true">+</div>
            <p className="hero-card-label">MEDIBOOK</p>
            <h2>სწორი არჩევანი ჯანმრთელობისთვის</h2>
            <p>აირჩიე სპეციალისტი შენი საჭიროებების მიხედვით.</p>
          </aside>
        </section>

        <section className="doctors-section" aria-labelledby="doctors-list-title">
          <div className="section-heading">
            <div>
              <h2 id="doctors-list-title">ექიმების სია</h2>
              <p>აირჩიე სპეციალისტი და გააგრძელე ვიზიტის დაგეგმვა.</p>
            </div>
            <span className="doctor-count">{doctors.length} სპეციალისტი</span>
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
                <Link
                  className="button button-outline doctor-button"
                  to={`/appointment?doctor=${doctor.id}`}
                >
                  ვიზიტის დაგეგმვა
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>© 2026 MediBook. ყველა უფლება დაცულია.</p>
        <a href="mailto:info@medibook.ge">დაგვიკავშირდით</a>
      </footer>
    </div>
  );
}

export default Doctors;
