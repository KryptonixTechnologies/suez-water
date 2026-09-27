import { Link } from 'react-router-dom'
import { MdEmail, MdLanguage, MdLocationOn, MdLocalPostOffice, MdPhone } from 'react-icons/md'
import { SITE } from '../../config/site'

const contactItems = [
  { icon: <MdLocationOn/>, label: 'Office', content: SITE.address },
  { icon: <MdLocalPostOffice/>, label: 'Postal address', content: SITE.postalAddress },
  { icon: <MdEmail/>, label: 'Email', content: <a href={`mailto:${SITE.email}`}>{SITE.email}</a> },
  { icon: <MdPhone/>, label: 'Phone', content: <a href={`tel:+${SITE.whatsappNumber}`}>+254 742 433 815</a> },
  { icon: <MdLanguage/>, label: 'Website', content: <a href={SITE.url}>www.suezwaterenergy.com</a> },
]

export default function Footer() {
  return <footer className="site-footer">
    <div className="footer-intro">
      <Link className="brand footer-brand" to="/">
        <img className="brand-logo footer-logo" src={SITE.darkLogo} alt={SITE.name}/>
      </Link>
      <p>Clean water and efficient energy solutions for better living.</p>
    </div>

    <div className="footer-contact">
      <h2>Contact us</h2>
      <address>
        {contactItems.map(({ icon, label, content }) =>
          <div className="footer-contact-row" key={label}>
            <i aria-hidden="true">{icon}</i>
            <span><small>{label}</small>{content}</span>
          </div>
        )}
      </address>
    </div>

    <nav className="footer-links" aria-label="Footer navigation">
      <h2>Quick links</h2>
      {['/products', '/about', '/projects', '/contact'].map((to) =>
        <Link key={to} to={to}>{to.slice(1).replace(/^./, (letter) => letter.toUpperCase())}</Link>
      )}
    </nav>

    <small className="footer-copyright">© 2026 Suez Water & Energy Technologies. All rights reserved.</small>
  </footer>
}
