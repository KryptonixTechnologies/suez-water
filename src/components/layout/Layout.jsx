import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import ScrollToTop from './ScrollToTop'
import { FaWhatsapp } from 'react-icons/fa'
import { whatsappUrl } from '../../config/site'

export default function Layout(){return <div className="site-shell"><ScrollToTop/><Header/><main><Outlet/></main><Footer/><a className="general-whatsapp" href={whatsappUrl('Hi Suez Water, I would like to make a general enquiry. Please assist me.')} target="_blank" rel="noreferrer" aria-label="Make a general enquiry on WhatsApp"><FaWhatsapp/><span><small>Need help?</small>Chat on WhatsApp</span></a></div>}
