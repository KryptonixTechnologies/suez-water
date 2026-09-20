export const SITE = { name: 'Suez Water & Energy Technologies', shortName: 'Suez Water', location: 'Nairobi, Kenya', whatsappNumber: '', productImage: '/product pleaceholder.jpeg', logo: '/suez_water-removebg-preview.png', darkLogo: '/dark_suez_logo-removebg-preview.png' }
export const whatsappUrl = (message) => `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`
