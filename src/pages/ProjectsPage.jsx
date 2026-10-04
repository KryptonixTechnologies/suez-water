import { Link } from "react-router-dom"
import {
  MdArrowForward,
  MdCheckCircle,
  MdConstruction,
  MdLocalShipping,
  MdWaterDrop,
  MdWbSunny,
} from "react-icons/md"
import PageHero from "../components/layout/PageHero"

const services = [
  {
    title: "Water Treatment",
    image: "/services images/Water treatment.png",
    icon: MdWaterDrop,
    description: "Safe, clean and reliable water for communities and industries. We use advanced purification methods to remove contaminants, balance minerals and meet strict quality standards for every intended use.",
  },
  {
    title: "Water Heating",
    image: "/services images/Water heating.png",
    icon: MdWbSunny,
    description: "High-performance water-heating equipment for residential, commercial and industrial use—engineered for dependable hot water, lower energy consumption and lasting cost savings.",
  },
  {
    title: "Borehole Services",
    image: "/services images/Borehole Services.png",
    icon: MdConstruction,
    description: "End-to-end borehole expertise, from site surveys and drilling to installation and maintenance, delivering an efficient and long-lasting groundwater source with responsible environmental practices.",
  },
  {
    title: "Bulk Water Design & Supply",
    image: "/services images/Bulk water Design & Supply.png",
    icon: MdLocalShipping,
    description: "Planning, infrastructure design and efficient delivery for safe, reliable, large-scale water access serving communities, industries and municipalities.",
  },
]

const advantages = [
  ["Integrated solutions", "Advanced water treatment and renewable-energy technologies from one accountable partner."],
  ["Tailor-made systems", "Solutions designed around your water source, site conditions, demand and budget."],
  ["Eco-driven innovation", "Efficient technologies that conserve resources, lower energy use and reduce environmental impact."],
  ["End-to-end service", "Consultation, design, supply, installation, training and maintenance throughout the project lifecycle."],
  ["Proven reliability", "Durable systems, experienced technical support and long-term service after installation."],
]

const projectPhotos = [
  ["/projects images/Nakuru Solar heater installation .jpeg", "Solar water-heater installation", "Nakuru", 960, 1280, "tall"],
  ["/projects images/frp tank installation.png", "FRP treatment-tank installation", "Water treatment", 381, 273, "wide"],
  ["/projects images/thika borehole installation.jpeg", "Borehole system installation", "Thika", 963, 1280, "tall"],
  ["/projects images/project pipes.png", "Process pipework installation", "System integration", 690, 303, "wide"],
  ["/projects images/equipement installation .png", "Water-treatment equipment installation", "Equipment setup", 371, 473, "tall"],
  ["/projects images/intrument installation.png", "Control instrument installation", "Instrumentation", 292, 278, ""],
  ["/projects images/intrument installation1.png", "On-site instrument commissioning", "Commissioning", 375, 502, "tall"],
  ["/projects images/intrument servicing .png", "Instrument inspection and servicing", "Maintenance", 290, 370, "tall"],
  ["/projects images/project products.png", "Project equipment prepared for installation", "Project supply", 290, 370, "tall"],
  ["/projects images/WhatsApp Image 2026-09-28 at 08.43.15.jpeg", "On-site project installation", "Field work", 963, 1280, "tall"],
  ["/projects images/WhatsApp Image 2026-09-28 at 08.43.16.jpeg", "Installation progress on site", "Field work", 963, 1280, "tall"],
  ["/projects images/WhatsApp Image 2026-09-28 at 08.43.17.jpeg", "Completed project workmanship", "Installation", 963, 1280, "tall"],
  ["/projects images/WhatsApp Image 2026-09-28 at 08.43.17 (1).jpeg", "Technical installation detail", "Installation", 963, 1280, "tall"],
  ["/projects images/WhatsApp Image 2026-09-28 at 08.43.17 (2).jpeg", "Project system components", "System delivery", 963, 1280, "tall"],
  ["/projects images/Screenshot from 2026-09-28 14-47-08.png", "Installed water and energy solution", "Completed work", 380, 513, "tall"],
]

export default function ProjectsPage() {
  return <>
    <PageHero
      eyebrow="Services & completed work"
      title="Solutions designed to perform."
      description="We deliver practical water and energy projects from first assessment to installation, commissioning and long-term support."
    />

    <section className="services-showcase">
      <div className="services-heading">
        <div>
          <span className="section-kicker">Our services</span>
          <h2>Everything your project needs, under one roof.</h2>
        </div>
        <p>We deliver innovative and sustainable solutions that power communities, protect water resources and create lasting value for every client.</p>
      </div>
      <div className="services-grid">
        {services.map(({ title, image, icon: Icon, description }, index) => <article className="service-card" key={title}>
          <div className="service-card-image">
            <img src={image} alt={`${title} service by Suez Water & Energy Technologies`} width="840" height="573" loading={index > 1 ? "lazy" : "eager"}/>
            <span>0{index + 1}</span>
          </div>
          <div className="service-card-copy">
            <i><Icon aria-hidden="true"/></i>
            <h3>{title}</h3>
            <p>{description}</p>
            <Link to="/contact">Request a consultation <MdArrowForward aria-hidden="true"/></Link>
          </div>
        </article>)}
      </div>
    </section>

    <section className="project-advantages">
      <div className="advantages-intro">
        <span className="section-kicker light">Why Suez Water & Energy</span>
        <h2>One team. Complete project confidence.</h2>
        <p>Our integrated approach reduces complexity and gives you one experienced partner responsible for performance from design through after-sales support.</p>
        <Link className="primary" to="/contact">Plan your solution <MdArrowForward aria-hidden="true"/></Link>
      </div>
      <div className="advantages-list">
        {advantages.map(([title, description], index) => <article key={title}>
          <span>0{index + 1}</span>
          <div><h3>{title}</h3><p>{description}</p></div>
          <MdCheckCircle aria-hidden="true"/>
        </article>)}
      </div>
    </section>

    <section className="project-gallery-section">
      <div className="gallery-heading">
        <div><span className="section-kicker">Project gallery</span><h2>Real work. Built for real-world demands.</h2></div>
        <p>Explore selected installations, commissioning work and service visits completed by our technical team.</p>
      </div>
      <div className="project-gallery">
        {projectPhotos.map(([src, title, label, width, height, shape]) => <figure className={shape} key={src}>
          <img src={src} alt={title} width={width} height={height} loading="lazy"/>
          <figcaption><small>{label}</small><strong>{title}</strong></figcaption>
        </figure>)}
      </div>
    </section>

    <section className="projects-cta">
      <div><span className="section-kicker">Start your project</span><h2>Let’s build a solution around your needs.</h2></div>
      <p>Tell us about your water source, capacity requirements, site and goals. Our team will help define the right next step.</p>
      <Link className="primary" to="/contact">Discuss your project <MdArrowForward aria-hidden="true"/></Link>
    </section>
  </>
}
