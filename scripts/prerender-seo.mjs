import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { products } from '../src/data/products.js'
import { SITE } from '../src/config/site.js'
import { breadcrumbSchema, DEFAULT_SEO, organisationSchema, SEO_PAGES } from '../src/config/seo.js'
import { familyDescriptions, niceName, productSlug } from '../src/utils/products.js'

const baseHtml = await readFile('dist/index.html', 'utf8')
const publicRoutes = Object.keys(SEO_PAGES).filter((path) => !SEO_PAGES[path].noindex)
const entries = [
  ...publicRoutes.map((path) => ({ path, ...SEO_PAGES[path] })),
  ...products.map((product) => {
    const name = niceName(product.name)
    return {
      path: `/products/${productSlug(product.name)}`,
      title: `${name} in Kenya | Suez Water`,
      description: `${name} from Suez Water Kenya. ${familyDescriptions[product.family]} Ask about specifications, availability and a quote.`,
      product,
    }
  }),
]

const escapeAttribute = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')

const stripDynamicHead = (html) => html
  .replace(/\s*<title>[\s\S]*?<\/title>/i, '')
  .replace(/\s*<link rel="canonical"[^>]*>/i, '')
  .replace(/\s*<meta (?:name|property)="(?:description|robots|geo\.region|geo\.placename|og:title|og:description|og:url|og:type|og:image|og:locale|twitter:card|twitter:title|twitter:description|twitter:image)"[^>]*>/gi, '')
  .replace(/\s*<script id="structured-data"[\s\S]*?<\/script>/i, '')

const schemaFor = ({ path, title, description, product }) => {
  const canonical = `${SITE.url}${path}`
  const graph = [{
    '@type': product ? 'WebPage' : (path === '/products' || path === '/projects' ? 'CollectionPage' : path === '/about' ? 'AboutPage' : path === '/contact' ? 'ContactPage' : 'WebPage'),
    '@id': `${canonical}#webpage`,
    url: canonical,
    name: title,
    description,
    inLanguage: 'en-KE',
    isPartOf: { '@id': `${SITE.url}/#website` },
    about: { '@id': `${SITE.url}/#organization` },
  }]

  if (path === '/' || path === '/about' || path === '/contact') graph.push(organisationSchema(SITE))
  if (path === '/') {
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
    const name = niceName(product.name)
    graph.push({
      '@type': 'Product',
      '@id': `${canonical}#product`,
      name,
      sku: product.id,
      category: product.family,
      description,
      url: canonical,
      brand: { '@type': 'Brand', name: SITE.name },
    })
    graph.push(breadcrumbSchema([['Home', '/'], ['Products', '/products'], [name, path]], SITE.url))
  } else if (path !== '/') {
    graph.push(breadcrumbSchema([['Home', '/'], [SEO_PAGES[path]?.label || title.split('|')[0].trim(), path]], SITE.url))
  }

  return { '@context': 'https://schema.org', '@graph': graph }
}

const renderHead = (entry) => {
  const canonical = `${SITE.url}${entry.path}`
  const image = `${SITE.url}${SITE.logo}`
  const structuredData = JSON.stringify(schemaFor(entry)).replaceAll('<', '\\u003c')
  return `
    <title>${escapeAttribute(entry.title)}</title>
    <link rel="canonical" href="${escapeAttribute(canonical)}" />
    <meta name="description" content="${escapeAttribute(entry.description)}" />
    <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
    <meta name="geo.region" content="KE-30" />
    <meta name="geo.placename" content="Nairobi, Kenya" />
    <meta property="og:locale" content="en_KE" />
    <meta property="og:title" content="${escapeAttribute(entry.title)}" />
    <meta property="og:description" content="${escapeAttribute(entry.description)}" />
    <meta property="og:url" content="${escapeAttribute(canonical)}" />
    <meta property="og:type" content="${entry.product ? 'product' : 'website'}" />
    <meta property="og:image" content="${escapeAttribute(image)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeAttribute(entry.title)}" />
    <meta name="twitter:description" content="${escapeAttribute(entry.description)}" />
    <meta name="twitter:image" content="${escapeAttribute(image)}" />
    <script id="structured-data" type="application/ld+json">${structuredData}</script>`
}

const strippedHtml = stripDynamicHead(baseHtml)
for (const entry of entries) {
  const metadata = { title: DEFAULT_SEO.title, description: DEFAULT_SEO.description, ...entry }
  const html = strippedHtml.replace('</head>', `${renderHead(metadata)}\n  </head>`)
  const destination = entry.path === '/' ? 'dist/index.html' : join('dist', entry.path.slice(1), 'index.html')
  await mkdir(dirname(destination), { recursive: true })
  await writeFile(destination, html)
}

const cart = SEO_PAGES['/cart']
const cartHtml = strippedHtml.replace('</head>', `${renderHead({ path: '/cart', ...cart }).replace('index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1', 'noindex,follow')}\n  </head>`)
await mkdir('dist/cart', { recursive: true })
await writeFile('dist/cart/index.html', cartHtml)

console.log(`Generated crawl-ready HTML for ${entries.length} indexable URLs plus the noindex cart.`)
