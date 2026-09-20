import { Link } from 'react-router-dom'
import { MdArrowForward, MdEco, MdHandshake } from 'react-icons/md'
import PageHero from '../components/layout/PageHero'
import { SITE } from '../config/site'

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
        <Link className="text-link" to="/contact">Talk to our team <MdArrowForward/></Link>
      </div>
      <img src={SITE.productImage} alt="Suez Water and Energy Technologies solutions"/>
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
