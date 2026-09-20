import { Link } from 'react-router-dom'
import { SITE } from '../../config/site'
export default function Footer(){return <footer><Link className="brand footer-brand" to="/"><img className="brand-logo footer-logo" src={SITE.darkLogo} alt={SITE.name}/></Link><p>Clean water and efficient energy solutions for better living.</p><div>{[['/products','Products'],['/about','About'],['/projects','Projects'],['/contact','Contact']].map(([to,label])=><Link key={to} to={to}>{label}</Link>)}</div><small>© 2026 Suez Water & Energy Technologies. All rights reserved.</small></footer>}
