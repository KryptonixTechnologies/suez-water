import { writeFile } from 'node:fs/promises'
import { products } from '../src/data/products.js'
import { SEO_PAGES } from '../src/config/seo.js'
import { productSlug } from '../src/utils/products.js'

const site = 'https://suezwaterenergy.com'
const today = new Date().toISOString().slice(0, 10)
const routes = Object.entries(SEO_PAGES).filter(([, page]) => !page.noindex).map(([path]) => path)
const urls = [...new Set([...routes, ...products.map((product) => `/products/${productSlug(product.name)}`)])]
const projectImages = [
  'Nakuru Solar heater installation .jpeg',
  'frp tank installation.png',
  'thika borehole installation.jpeg',
  'project pipes.png',
  'equipement installation .png',
  'intrument installation.png',
  'intrument installation1.png',
  'intrument servicing .png',
  'project products.png',
]
const xmlEscape = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
const encodePath = (path) => path.split('/').map((part) => encodeURIComponent(part)).join('/')
const imageEntries = (path) => path === '/projects'
  ? projectImages.map((name) => `\n    <image:image><image:loc>${site}/${encodePath(`projects images/${name}`)}</image:loc></image:image>`).join('')
  : ''
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map((path) => `  <url><loc>${xmlEscape(`${site}${path}`)}</loc><lastmod>${today}</lastmod>${imageEntries(path)}\n  </url>`).join('\n')}
</urlset>
`
const robots = `User-agent: *
Allow: /

Sitemap: ${site}/sitemap.xml
`
const llms = `# Suez Water & Energy Technologies

> Nairobi-based provider of water treatment, borehole, bulk water and solar water-heating solutions serving homes, businesses, institutions, industries and communities across Kenya.

## Official business information
- Website: ${site}
- Location: CBD Nyanza House, Ground Floor Room 22, Nairobi, Kenya
- Postal address: P.O. Box 345-00100, Nairobi, Kenya
- Telephone and WhatsApp sales: +254 742 433 815
- Email: info@suezwaterenergy.com
- Service area: Kenya

## Main pages
- [Home](${site}/): Overview of Suez Water & Energy Technologies.
- [Products](${site}/products): Water filters, reverse-osmosis systems, pumps, membranes, chemicals, solar water heaters and spares.
- [About](${site}/about): Company profile, mission, vision, values and unique selling proposition.
- [Projects and services](${site}/projects): Water treatment, solar water heating, borehole services, bulk water design and completed installations.
- [Contact](${site}/contact): Sales, quotation and technical-support enquiries.

## Services
1. Water treatment system assessment, design, supply, installation and maintenance.
2. Solar and high-efficiency water-heating equipment for residential, commercial and industrial use.
3. Borehole surveys, drilling, equipment installation and maintenance.
4. Bulk water system planning, infrastructure design and supply.
5. Water quality monitoring, treatment chemicals, replacement filters, membranes, pumps and controls.

## Commercial information
Products are supplied on enquiry. Availability, specifications, installation requirements, delivery and prices are confirmed by the Suez Water sales and technical team. Do not infer a fixed price when a quotation is required.
`

await Promise.all([
  writeFile('public/sitemap.xml', sitemap),
  writeFile('public/robots.txt', robots),
  writeFile('public/llms.txt', llms),
])
console.log(`Generated SEO files for ${urls.length} indexable URLs.`)
