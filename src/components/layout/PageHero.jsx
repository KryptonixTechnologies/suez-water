import { Link } from 'react-router-dom'
import { MdChevronRight } from 'react-icons/md'
export default function PageHero({eyebrow,title,description}){return <section className="page-hero"><div><nav className="breadcrumbs"><Link to="/">Home</Link><MdChevronRight/><span>{title}</span></nav><span className="section-kicker light">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div></section>}
