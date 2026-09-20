import { SITE } from '../config/site'

const imageModules = import.meta.glob('../assets/*', {
  eager: true,
  query: '?url',
  import: 'default',
})

const normalize = (value) => value
  .normalize('NFKD')
  .replace(/\.(jpe?g|png|webp|avif)$/i, '')
  .replace(/[^a-z0-9]/gi, '')
  .toLowerCase()

const measurementWords = new Set([
  'gpd', 'l', 'h', 'lh', 'lph', 'mic', 'micron', 'microns', 'mm', 'cm',
  'inch', 'inches', 'hp', 'lp', 'litre', 'litres', 'liter', 'liters',
])

const getSeries = (value) => value
  .normalize('NFKD')
  .replace(/\.(jpe?g|png|webp|avif)$/i, '')
  .toLowerCase()
  .replace(/\d+(?:[.,]\d+)?/g, ' ')
  .replace(/[^a-z]+/g, ' ')
  .trim()
  .split(/\s+/)
  .filter((word) => word && !measurementWords.has(word))

const getMeasurements = (value) => (
  value.match(/\d+(?:[.,]\d+)?/g)?.map((number) => Number(number.replace(',', '.'))) || []
)

const seriesKey = (value) => getSeries(value).join('')

const measurementDistance = (productMeasurements, imageMeasurements) => {
  const length = Math.max(productMeasurements.length, imageMeasurements.length)
  let distance = 0

  for (let index = 0; index < length; index += 1) {
    const productValue = productMeasurements[index]
    const imageValue = imageMeasurements[index]
    distance += productValue === undefined || imageValue === undefined
      ? 3
      : Math.abs(Math.log1p(productValue) - Math.log1p(imageValue))
  }

  return distance
}

const imagesByName = new Map(
  Object.entries(imageModules).map(([path, url]) => {
    const filename = path.split('/').pop()
    return [normalize(filename), url]
  }),
)

const imagesBySeries = new Map()

Object.entries(imageModules).forEach(([path, url]) => {
  const filename = path.split('/').pop()
  const words = getSeries(filename)

  // Reuse only clearly related names. Descriptive words such as "jumbo" stay
  // in the key, while dimensions and capacities are ignored for matching.
  if (words.length < 2) return

  const key = words.join('')
  const candidates = imagesBySeries.get(key) || []
  candidates.push({ url, measurements: getMeasurements(filename) })
  imagesBySeries.set(key, candidates)
})

// This supplied filename describes the brass magnesium rod product rather than
// using its exact catalog name.
const aliases = {
  [normalize('MAGNICIUM ROD ½ BRASS')]: normalize('Brass Round bar solid brass rod in diamaters 1_8_, 5mm, 6mm, 8mm, 10mm, 12mm, 16mm, 18mm, 20mm, 25mm, 30mm, 38mm, 50mm and all lengths cz121 brass rod'),
}

export function getProductImage(product) {
  const key = normalize(product.name)
  const exactImage = imagesByName.get(key) || imagesByName.get(aliases[key])
  if (exactImage) return exactImage

  const candidates = imagesBySeries.get(seriesKey(product.name))
  if (!candidates?.length) return SITE.productImage

  const productMeasurements = getMeasurements(product.name)
  return candidates.reduce((closest, candidate) => (
    measurementDistance(productMeasurements, candidate.measurements)
      < measurementDistance(productMeasurements, closest.measurements)
      ? candidate
      : closest
  )).url
}
