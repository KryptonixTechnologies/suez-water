import { Link } from 'react-router-dom'
import { MdArrowForward, MdBuild, MdDesignServices, MdDownload, MdEco, MdHandshake, MdHub, MdLightbulb, MdSettingsSuggest, MdVerified } from 'react-icons/md'
import PageHero from '../components/layout/PageHero'
import aboutTeamImage from '../assets/about-water-solar-team.png'

const sellingPoints = [
  ['Integrated Water & Energy Solutions', 'Offering both advanced water treatment and renewable energy technologies under one roof for maximum efficiency and convenience.', MdHub],
  ['Tailor-Made Systems', 'Designing solutions customized to each client’s specific needs, site conditions and budget.', MdDesignServices],
  ['Eco-Driven Innovation', 'Using cutting-edge, environmentally friendly technologies that reduce carbon footprint and conserve resources.', MdEco],
  ['End-to-End Service', 'From consultation and design to installation, training and maintenance, we provide complete project lifecycle support.', MdBuild],
  ['Proven Reliability', 'Delivering durable, high-performance systems backed by expert technical support and a track record of client satisfaction.', MdVerified],
]

export default function AboutPage() {
  return <>
    <PageHero
      eyebrow="Who we are"
      title="About Us"
      description="Smart, sustainable water treatment and renewable energy solutions for homes, businesses and industries."
    />

    <section className="story-section">
      <div>
        <span className="section-kicker">Suez Water & Energy Technologies</span>
        <h2>Powering success while building a greener future.</h2>
        <p>Suez Water & Energy Technologies delivers smart, sustainable solutions in water treatment and renewable energy.</p>
        <p>We help businesses, homes, and industries save costs, improve efficiency, and protect the environment through advanced water purification systems and innovative solar energy solutions.</p>
        <p>From design to installation and maintenance, we power your success while building a greener future.</p>
        <div className="story-actions">
          <Link className="text-link" to="/contact">Talk to our team <MdArrowForward/></Link>
          <a className="profile-download" href="/Company profile.pdf" download>Download company profile <MdDownload/></a>
        </div>
      </div>
      <img src={aboutTeamImage} alt="Water-treatment engineers inspecting a sustainable solar-powered installation"/>
    </section>

    <section className="about-usp">
      <div className="about-usp-heading">
        <div className="about-usp-icon"><MdSettingsSuggest aria-hidden="true"/></div>
        <div><span className="section-kicker">Why choose us</span><h2>Unique Selling Proposition</h2></div>
      </div>
      <div className="about-usp-grid">
        {sellingPoints.map(([title, text, Icon]) => <article key={title}>
          <i className="usp-card-icon"><Icon aria-hidden="true"/></i>
          <h3>{title}</h3>
          <p>{text}</p>
          <span className="usp-arrow"><MdArrowForward aria-hidden="true"/></span>
        </article>)}
      </div>
    </section>

    <section className="mission-section about-purpose">
      <article>
        <small>Our mission</small>
        <h2>To provide sustainable, innovative, and affordable water and renewable energy solutions.</h2>
        <p>Solutions that improve lives, protect the environment, and empower communities to thrive in a cleaner, greener future.</p>
      </article>
      <article>
        <small>Our vision</small>
        <h2>To be a leading provider of integrated water and energy technologies in Africa.</h2>
        <p>Recognized for excellence, innovation, and a lasting positive impact on people and the planet.</p>
      </article>
    </section>

    <section className="value-section">
      <span className="section-kicker">Core values</span>
      <h2>What guides our work.</h2>
      <div className="value-cards about-value-cards">
        <Value
          icon={<MdEco/>}
          title="Sustainability"
          text="Committing to eco-friendly solutions that conserve resources and protect the environment for future generations."
        />
        <Value
          icon={<MdLightbulb/>}
          title="Innovation"
          text="Leveraging cutting-edge technology to deliver efficient, reliable, and future-ready water and energy solutions."
        />
        <Value
          icon={<MdHandshake/>}
          title="Integrity"
          text="Building trust through transparency, quality service, and long-term partnerships with our clients."
        />
      </div>
    </section>

    <section className="cta-band">
      <div><span className="section-kicker">Build a greener future</span><h2>Let’s create a sustainable solution.</h2></div>
      <Link className="primary" to="/contact">Start a conversation <MdArrowForward/></Link>
    </section>
  </>
}

function Value({ icon, title, text }) {
  return <article><i>{icon}</i><h3>{title}</h3><p>{text}</p></article>
}
