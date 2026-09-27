import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { MdCall, MdClose, MdEmail, MdLocationOn, MdMenu, MdShoppingCart } from 'react-icons/md'
import { useCart } from '../../context/cart-store'
import { SITE } from '../../config/site'
import ProductSearch from '../search/ProductSearch'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [callbackOpen, setCallbackOpen] = useState(false)
  const { count } = useCart()
  const closeMenu = () => setOpen(false)

  return <div className="site-header-stack">
    <div className="header-contact-bar" aria-label="Company contact information">
      <div>
        <a href={`tel:+${SITE.whatsappNumber}`}><MdCall aria-hidden="true"/><span>+254 742 433 815</span></a>
        <a href={`mailto:${SITE.email}`}><MdEmail aria-hidden="true"/><span>{SITE.email}</span></a>
        <span className="header-location"><MdLocationOn aria-hidden="true"/><span>{SITE.address}</span></span>
        <button className="callback-trigger" type="button" onClick={() => setCallbackOpen(true)}><MdCall aria-hidden="true"/> Call me back</button>
      </div>
    </div>

    <header className="site-header">
      <NavLink className="brand" to="/" onClick={closeMenu}>
        <img className="brand-logo" src={SITE.logo} alt={SITE.name}/>
      </NavLink>
      <ProductSearch/>
      <nav className={open ? 'nav open' : 'nav'}>
        <ProductSearch mobile onNavigate={closeMenu}/>
        {[
          ['/', 'Home'],
          ['/products', 'Products'],
          ['/about', 'About'],
          ['/projects', 'Projects'],
          ['/contact', 'Contact'],
        ].map(([to, label]) => <NavLink key={to} to={to} end={to === '/'} onClick={closeMenu}>{label}</NavLink>)}
      </nav>
      <div className="header-actions">
        <button className="icon-button menu-button" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>{open ? <MdClose/> : <MdMenu/>}</button>
        <NavLink className="cart-button" to="/cart"><MdShoppingCart/><span>Cart</span>{count > 0 && <b>{count}</b>}</NavLink>
      </div>
    </header>
    {callbackOpen && <CallbackForm onClose={() => setCallbackOpen(false)}/>}
  </div>
}

function CallbackForm({ onClose }) {
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const submit = async (event) => {
    event.preventDefault()
    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY

    if (!accessKey) {
      setStatus('error')
      setMessage('Callback requests are being configured. Please call or WhatsApp us for now.')
      return
    }

    setStatus('sending')
    setMessage('')
    const formData = new FormData(event.currentTarget)
    formData.append('access_key', accessKey)
    formData.append('subject', 'New callback request — Suez Water website')
    formData.append('from_name', 'Suez Water website')

    try {
      const response = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData })
      const result = await response.json()
      if (!response.ok || !result.success) throw new Error(result.message || 'Unable to send your request.')
      event.currentTarget.reset()
      setStatus('success')
      setMessage('Thank you. Your callback request has been sent.')
    } catch (error) {
      setStatus('error')
      setMessage(error.message || 'Unable to send your request. Please try again.')
    }
  }

  return <div className="callback-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className="callback-dialog" role="dialog" aria-modal="true" aria-labelledby="callback-title">
      <button className="callback-close" type="button" onClick={onClose} aria-label="Close callback form"><MdClose/></button>
      <span className="callback-icon"><MdCall aria-hidden="true"/></span>
      <small>Speak with our team</small>
      <h2 id="callback-title">Request a call back</h2>
      <p>Enter your phone number and our team will contact you during normal business hours.</p>
      <form onSubmit={submit}>
        <label htmlFor="callback-phone">Phone number</label>
        <input id="callback-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="e.g. 0742 433 815" minLength="9" required autoFocus/>
        <input type="checkbox" name="botcheck" className="callback-botcheck" tabIndex="-1" autoComplete="off"/>
        <button type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send request'} <MdCall/></button>
        {message && <div className={`callback-status ${status}`} role="status">{message}</div>}
      </form>
      <small className="callback-privacy">Your number is used only to respond to this callback request.</small>
    </section>
  </div>
}
