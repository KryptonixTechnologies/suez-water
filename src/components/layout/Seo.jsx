import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { products } from '../../data/products'
import { SITE } from '../../config/site'
import { breadcrumbSchema, DEFAULT_SEO, organisationSchema, SEO_PAGES } from '../../config/seo'
import { familyDescriptions, niceName, productSlug } from '../../utils/products'
import { getProductImage } from '../../utils/productImages'

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
    const cleanPath = pathname === '/' ? '/' : pathname.replace(/\/$/, '')
    const routeSlug = cleanPath.startsWith('/products/') ? decodeURIComponent(cleanPath.split('/').pop()) : null
    const product = routeSlug ? products.find((item) => productSlug(item.name) === routeSlug) : null
    const page = SEO_PAGES[cleanPath]
    const productName = product ? niceName(product.name) : null
    const title = product ? `${productName} in Kenya | Suez Water` : (page?.title || DEFAULT_SEO.title)
    const description = product
      ? `${productName} from Suez Water Kenya. ${familyDescriptions[product.family]} Ask about specifications, availability and a quote.`
      : (page?.description || DEFAULT_SEO.description)
    const canonical = `${SITE.url}${cleanPath}`
    const imagePath = product ? getProductImage(product) : SITE.logo
    const image = new URL(imagePath, SITE.url).href
    const noindex = page?.noindex || (!page && !product)

    document.title = title
    setMeta('meta[name="description"]', { name: 'description', content: description })
    setMeta('meta[name="robots"]', { name: 'robots', content: noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1' })
    setMeta('meta[name="geo.region"]', { name: 'geo.region', content: 'KE-30' })
    setMeta('meta[name="geo.placename"]', { name: 'geo.placename', content: 'Nairobi, Kenya' })
    setMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: SITE.name })
    setMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'en_KE' })
    setMeta('meta[property="og:title"]', { property: 'og:title', content: title })
    setMeta('meta[property="og:description"]', { property: 'og:description', content: description })
    setMeta('meta[property="og:url"]', { property: 'og:url', content: canonical })
    setMeta('meta[property="og:type"]', { property: 'og:type', content: product ? 'product' : 'website' })
    setMeta('meta[property="og:image"]', { property: 'og:image', content: image })
    setMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
    setMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title })
    setMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description })
    setMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: image })

    let canonicalLink = document.head.querySelector('link[rel="canonical"]')
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.rel = 'canonical'
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.href = canonical

    const graph = [{
      '@type': product ? 'WebPage' : (cleanPath === '/products' || cleanPath === '/projects' ? 'CollectionPage' : cleanPath === '/about' ? 'AboutPage' : cleanPath === '/contact' ? 'ContactPage' : 'WebPage'),
      '@id': `${canonical}#webpage`,
      url: canonical,
      name: title,
      description,
      inLanguage: 'en-KE',
      isPartOf: { '@id': `${SITE.url}/#website` },
      about: { '@id': `${SITE.url}/#organization` },
    }]

    if (cleanPath === '/' || cleanPath === '/about' || cleanPath === '/contact') graph.push(organisationSchema(SITE))
    if (cleanPath === '/') {
      graph.push({
        '@type': 'WebSite',
        '@id': `${SITE.url}/#website`,
        url: SITE.url,
        name: SITE.name,
        alternateName: SITE.shortName,
        inLanguage: 'en-KE',
        publisher: { '@id': `${SITE.url}/#organization` },
      })
    }
    if (product) {
      graph.push({
        '@type': 'Product',
        '@id': `${canonical}#product`,
        name: productName,
        sku: product.id,
        category: product.family,
        description,
        image,
        url: canonical,
        brand: { '@type': 'Brand', name: SITE.name },
      })
      graph.push(breadcrumbSchema([['Home', '/'], ['Products', '/products'], [productName, cleanPath]], SITE.url))
    } else if (cleanPath !== '/') {
      graph.push(breadcrumbSchema([['Home', '/'], [page?.label || title.split('|')[0].trim(), cleanPath]], SITE.url))
    }

    let script = document.head.querySelector('#structured-data')
    if (!script) {
      script = document.createElement('script')
      script.id = 'structured-data'
      script.type = 'application/ld+json'
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })
  }, [pathname])

  return null
}
