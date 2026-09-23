import { writeFile } from 'node:fs/promises'
import { products } from '../src/data/products.js'
import { productSlug } from '../src/utils/products.js'

const site = 'https://suezwaterenergy.com'
const today = new Date().toISOString().slice(0, 10)
const routes = ['/', '/products', '/about', '/projects', '/contact']
const urls = [...new Set([...routes, ...products.map((product) => `/products/${productSlug(product.name)}`)])]
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((path) => `  <url><loc>${site}${path}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`
const robots = `User-agent: *\nAllow: /\nDisallow: /cart\n\nSitemap: ${site}/sitemap.xml\n`
const llms = `# Suez Water & Energy Technologies\n\nSuez Water & Energy Technologies supplies water treatment, purification and solar water heating systems, components, consumables and spares in Kenya.\n\n## Main sections\n- [Products](${site}/products): Complete water treatment and solar product catalogue.\n- [About](${site}/about): Mission, vision and core values.\n- [Projects](${site}/projects): Residential, commercial and institutional solutions.\n- [Contact](${site}/contact): Product guidance and quotation enquiries.\n\nProducts are grouped into water treatment and solar water heater categories. Availability and pricing are confirmed through a tailored enquiry.\n`

await Promise.all([
  writeFile('public/sitemap.xml', sitemap),
  writeFile('public/robots.txt', robots),
  writeFile('public/llms.txt', llms),
])
console.log(`Generated SEO files for ${urls.length} URLs.`)
