import Swal from 'sweetalert2'
import { MdEmail, MdLocationOn, MdLocalPostOffice, MdChat, MdPhone } from 'react-icons/md'
import PageHero from '../components/layout/PageHero'
import { SITE, whatsappUrl } from '../config/site'

export default function ContactPage() {
  const submit = (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    window.open(whatsappUrl(`Hi Suez Water, my name is ${data.get('name')}. ${data.get('message')} You can reach me on ${data.get('phone')}.`), '_blank')
    event.currentTarget.reset()
    Swal.fire({ icon: 'success', title: 'Enquiry prepared', text: 'Review your message in WhatsApp, then tap send.', confirmButtonColor: '#0d4035' })
  }

  return <>
    <PageHero eyebrow="Start a conversation" title="Contact Us" description="Ask a product question, request a quotation or tell us about your project. Our team will help you find the next step."/>
    <section className="contact-page">
      <div className="contact-details">
        <span className="section-kicker">We’re here to help</span>
        <h2>Good advice starts with a conversation.</h2>
        <p>Share as much detail as you have—your water source, expected usage, existing equipment or project goals. We’ll help clarify the rest.</p>
        <div className="contact-cards">
          <Contact icon={<MdChat/>} label="WhatsApp sales" value="+254 742 433 815" href={whatsappUrl('Hi Suez Water, I would like to make an enquiry.')}/>
          <Contact icon={<MdPhone/>} label="Phone" value="+254 742 433 815" href={`tel:+${SITE.whatsappNumber}`}/>
          <Contact icon={<MdEmail/>} label="Email" value={SITE.email} href={`mailto:${SITE.email}`}/>
          <Contact icon={<MdLocationOn/>} label="Office" value={SITE.address}/>
          <Contact icon={<MdLocalPostOffice/>} label="Postal address" value={SITE.postalAddress}/>
        </div>
      </div>

      <form className="contact-form contact-page-form" onSubmit={submit}>
        <h3>Send a quick enquiry</h3>
        <div className="form-row">
          <label>Your name<input required name="name" placeholder="e.g. James Mwangi"/></label>
          <label>Phone number<input required name="phone" type="tel" placeholder="e.g. 0712 345 678"/></label>
        </div>
        <label>Email address<input name="email" type="email" placeholder="you@company.com"/></label>
        <label>What are you interested in?<select name="interest"><option>Water treatment</option><option>Solar water heating</option><option>Replacement parts</option><option>Project consultation</option></select></label>
        <label>How can we help?<textarea required name="message" rows="6" placeholder="Tell us what you're looking for..."/></label>
        <button className="primary">Prepare WhatsApp enquiry</button>
        <small>Your message opens in WhatsApp for review. Nothing is sent automatically.</small>
      </form>
    </section>

    <section className="faq-section">
      <span className="section-kicker">Common questions</span>
      <h2>Before you enquire</h2>
      <div>{[
        ['Do you show prices online?', 'Pricing is confirmed after we understand the quantity, availability and project requirements.'],
        ['Can you help me choose a product?', 'Yes. Tell us the application and any system details you have; our team will guide you.'],
        ['Can I enquire about several items together?', 'Yes. Add each item to your enquiry cart and send one complete list on WhatsApp.'],
        ['Do you support installations?', 'Installation and delivery options can be discussed with the sales team for your location and project.'],
      ].map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
    </section>
  </>
}

function Contact({ icon, label, value, href }) {
  const content = <><small>{label}</small><strong>{value}</strong></>
  return <div><i aria-hidden="true">{icon}</i><span>{href ? <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined}>{content}</a> : content}</span></div>
}
