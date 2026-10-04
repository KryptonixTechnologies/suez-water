export const SEO_PAGES = {
  '/': {
    label: 'Home',
    title: 'Water Treatment & Solar Solutions Kenya | Suez Water',
    description: 'Suez Water supplies water treatment systems, filters, pumps, chemicals, borehole services and solar water heaters across Kenya. Get expert guidance and a quote.',
  },
  '/products': {
    label: 'Products',
    title: 'Water Treatment & Solar Products Kenya | Suez Water',
    description: 'Browse water filters, reverse-osmosis systems, pumps, treatment chemicals, membranes, solar water heaters and spares available from Suez Water in Kenya.',
  },
  '/about': {
    label: 'About Us',
    title: 'About Suez Water & Energy Technologies Kenya',
    description: 'Meet Suez Water & Energy Technologies, a Nairobi provider of sustainable water treatment, borehole and solar water-heating solutions for clients across Kenya.',
  },
  '/projects': {
    label: 'Projects and Services',
    title: 'Water Treatment, Borehole & Solar Projects Kenya',
    description: 'Explore Suez Water services and completed projects in water treatment, borehole systems, bulk water supply and solar water heating across Kenya.',
  },
  '/contact': {
    label: 'Contact Us',
    title: 'Contact Suez Water Kenya | Quotes & Technical Support',
    description: 'Contact Suez Water in Nairobi for water treatment and solar product quotations, system design, installation and technical support. Call +254 742 433 815.',
  },
  '/cart': {
    label: 'Enquiry Cart',
    title: 'Product Enquiry Cart | Suez Water',
    description: 'Review your selected water treatment and solar products before requesting a quotation from Suez Water & Energy Technologies.',
    noindex: true,
  },
}

export const DEFAULT_SEO = {
  title: 'Suez Water & Energy Technologies Kenya',
  description: 'Water treatment, borehole, bulk water and renewable-energy solutions from Suez Water & Energy Technologies in Nairobi, Kenya.',
}

export const organisationSchema = (site) => ({
  '@type': ['Organization', 'LocalBusiness'],
  '@id': `${site.url}/#organization`,
  name: site.name,
  alternateName: site.shortName,
  url: site.url,
  logo: { '@type': 'ImageObject', url: `${site.url}${site.logo}` },
  image: `${site.url}${site.logo}`,
  description: SEO_PAGES['/'].description,
  telephone: '+254742433815',
  email: site.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.address,
    postOfficeBoxNumber: '345-00100',
    addressLocality: 'Nairobi',
    addressCountry: 'KE',
  },
  areaServed: { '@type': 'Country', name: 'Kenya' },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+254742433815',
    email: site.email,
    contactType: 'sales and technical support',
    areaServed: 'KE',
    availableLanguage: 'English',
  },
  knowsAbout: ['Water treatment', 'Reverse osmosis', 'Water filtration', 'Borehole services', 'Bulk water systems', 'Solar water heating', 'Water quality monitoring'],
})

export const breadcrumbSchema = (items, siteUrl) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name,
    item: `${siteUrl}${path}`,
  })),
})
