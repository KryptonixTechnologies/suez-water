import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MdArrowBack, MdArrowForward } from 'react-icons/md'
import solarProductsImage from '../../assets/Solar Products/Solar System products.png'
import waterProductsImage from '../../assets/Water treatment Products/Domestic Water treatment products Catalogue.png'

const solutions = [
  { id: 'water', title: 'Water Treatment', count: 226, image: waterProductsImage, category: 'Water Treatment', text: 'Filtration, purification, testing and every component needed to keep clean water flowing for homes, businesses and institutions.' },
  { id: 'solar', title: 'Solar Water Heaters', count: 64, image: solarProductsImage, category: 'Solar Water Heaters', text: 'Complete systems, tanks and service parts that turn abundant sunshine into dependable hot water and everyday savings.' },
]

export default function SolutionsSlider() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => setActive((current) => (current + 1) % solutions.length), 5500)
    return () => window.clearInterval(timer)
  }, [])

  const change = (direction) => setActive((current) => (current + direction + solutions.length) % solutions.length)
  const solution = solutions[active]

  return <div className="solutions-slider">
    <article className={`solution-slide ${solution.id}`} key={solution.id}>
      <div className="solution-slide-image"><img src={solution.image} alt={`${solution.title} solutions`}/></div>
      <div className="solution-slide-copy">
        <span className="solution-index">0{active + 1}</span>
        <small>{solution.count} products</small>
        <h3>{solution.title}</h3>
        <p>{solution.text}</p>
        <Link to={`/products?category=${encodeURIComponent(solution.category)}`}>Explore {solution.title} <MdArrowForward/></Link>
      </div>
    </article>
    <div className="solutions-controls">
      <div>{solutions.map((item, index) => <button key={item.id} className={active === index ? 'active' : ''} onClick={() => setActive(index)}><span>{item.title}</span></button>)}</div>
      <aside><button onClick={() => change(-1)} aria-label="Previous solution"><MdArrowBack/></button><button onClick={() => change(1)} aria-label="Next solution"><MdArrowForward/></button></aside>
    </div>
  </div>
}
