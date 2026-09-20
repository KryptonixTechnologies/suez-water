import { Link } from 'react-router-dom'
import { MdArrowForward } from 'react-icons/md'
export default function NotFoundPage(){return <section className="not-found"><span>404</span><h1>That page isn’t here.</h1><p>The link may have changed, or the page may no longer exist.</p><Link className="primary" to="/">Return home <MdArrowForward/></Link></section>}
