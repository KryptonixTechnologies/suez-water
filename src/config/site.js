import { productPath } from '../utils/products'

export const SITE = { name: 'Suez Water & Energy Technologies', shortName: 'Suez Water', url: 'https://suezwaterenergy.com', location: 'Nairobi, Kenya', salesPhone: '0742 433 815', whatsappNumber: '254742433815', productImage: '/product pleaceholder.jpeg', logo: '/suez_water-removebg-preview.png', darkLogo: '/dark_suez_logo-removebg-preview.png' }
export const whatsappUrl = (message) => `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`

export const productUrl = (product) => {
  const path = productPath(product)
  return typeof window === 'undefined' ? path : new URL(path, window.location.origin).href
}
