import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { products } from '../../data/products'
import { SITE } from '../../config/site'
import { familyDescriptions, niceName, productSlug } from '../../utils/products'

const pages = {
  '/': ['Water Treatment & Solar Energy Solutions in Kenya', 'Dependable water treatment, purification and solar water heating products for homes, businesses and institutions across Kenya.'],
  '/products': ['Water Treatment & Solar Products Kenya', 'Browse water purification systems, filter cartridges, membranes, solar water heaters, spares and accessories from Suez Water.'],
  '/about': ['About Suez Water & Energy Technologies', 'Learn about our sustainable water treatment and renewable energy mission, values and services in Kenya.'],
  '/projects': ['Water & Solar Projects and Solutions', 'Explore practical water treatment and solar energy solutions for residential, commercial and institutional projects.'],
  '/contact': ['Contact Suez Water Kenya', 'Contact our Nairobi team for water treatment products, solar water heating, technical guidance, availability and quotations.'],
  '/cart': ['Your Product Enquiry Cart', 'Review selected water treatment and solar products before requesting a quotation on WhatsApp.'],
}

const setMeta = (selector, attributes) => {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value))
}

export default function Seo() {
  const { pathname } = useLocation()

  useEffect(() => {
    const routeSlug = pathname.startsWith('/products/') ? decodeURIComponent(pathname.split('/').pop()) : null
    const product = routeSlug ? products.find((item) => productSlug(item.name) === routeSlug) : null
    const title = product ? `${niceName(product.name)} | Suez Water Kenya` : (pages[pathname]?.[0] || 'Suez Water & Energy Technologies')
    const description = product
      ? `${niceName(product.name)} — ${familyDescriptions[product.family]} Request availability, product guidance and a quotation from Suez Water Kenya.`
      : (pages[pathname]?.[1] || 'Water treatment and renewable energy solutions from Suez Water & Energy Technologies in Kenya.')
    const canonical = `${SITE.url}${pathname === '/' ? '/' : pathname.replace(/\/$/, '')}`
    const image = `${SITE.url}${SITE.logo}`

    document.title = title
    setMeta('meta[name="description"]', { name: 'description', content: description })
    setMeta('meta[name="robots"]', { name: 'robots', content: pathname === '/cart' ? 'noindex,follow' : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1' })
    setMeta('meta[property="og:title"]', { property: 'og:title', content: title })
    setMeta('meta[property="og:description"]', { property: 'og:description', content: description })
    setMeta('meta[property="og:url"]', { property: 'og:url', content: canonical })
    setMeta('meta[property="og:type"]', { property: 'og:type', content: product ? 'product' : 'website' })
    setMeta('meta[property="og:image"]', { property: 'og:image', content: image })
    setMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })

    let canonicalLink = document.head.querySelector('link[rel="canonical"]')
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.rel = 'canonical'
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.href = canonical

    const structuredData = product ? {
      '@context': 'https://schema.org', '@type': 'Product',
      name: niceName(product.name), sku: product.id, category: product.family,
      description, url: canonical, brand: { '@type': 'Brand', name: SITE.name },
    } : {
      '@context': 'https://schema.org', '@type': 'Organization', name: SITE.name,
      url: SITE.url, logo: image, areaServed: { '@type': 'Country', name: 'Kenya' },
      description: pages['/'][1],
    }
    let script = document.head.querySelector('#structured-data')
    if (!script) {
      script = document.createElement('script')
      script.id = 'structured-data'
      script.type = 'application/ld+json'
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify(structuredData)
  }, [pathname])

  return null
}
