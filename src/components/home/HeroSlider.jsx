import { useEffect, useState } from 'react'
import { MdArrowBack, MdArrowForward } from 'react-icons/md'
import waterTreatmentPlant from '../../assets/Water Treatment Hero Images/13018286423782747.jpeg'
import waterTreatmentSystem from '../../assets/Water Treatment Hero Images/Clean Water Solutions _ Water-Right Water Treatment Company.jpeg'
import solarEnergySystem from '../../assets/Solar Hero images/204843483047121069.jpeg'

const slides = [
  { id: 'water-treatment-plant', image: waterTreatmentPlant, alt: 'Industrial water treatment installation' },
  { id: 'solar-energy-system', image: solarEnergySystem, alt: 'Solar energy equipment and power system' },
  { id: 'water-treatment-system', image: waterTreatmentSystem, alt: 'Complete water purification equipment' },
]

export default function HeroSlider() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 4500)
    return () => window.clearInterval(timer)
  }, [])

  const changeSlide = (direction) => setActive((current) => (current + direction + slides.length) % slides.length)
  const slide = slides[active]

  return <div className="hero-slider" aria-roledescription="carousel" aria-label="Water treatment and solar solutions">
    <div className="hero-slide" key={slide.id}>
      <img src={slide.image} alt={slide.alt} width="736" height="552" fetchPriority={active === 0 ? 'high' : 'auto'} decoding="async"/>
    </div>
    <div className="hero-slider-controls">
      <div className="hero-slider-dots">{slides.map((item, index) => <button key={item.id} className={index === active ? 'active' : ''} onClick={() => setActive(index)} aria-label={`Show image ${index + 1}`}/>)}</div>
      <div><button onClick={() => changeSlide(-1)} aria-label="Previous image"><MdArrowBack/></button><button onClick={() => changeSlide(1)} aria-label="Next image"><MdArrowForward/></button></div>
    </div>
  </div>
}
