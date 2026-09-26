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
  // Preserve supplied images after correcting spelling in the public catalog.
  [normalize('PP SEDIMENT SPUN 10” 10 MIC')]: normalize('PP SEDIMENT SPAN 10” 10 MIC'),
  [normalize('PP SEDIMENT WOUND 20” 20 MIC')]: normalize('PP Sediment Wound 20” 20 Mc'),
  [normalize('WASHABLE CARTRIDGE 10”')]: normalize('Warshable Cartrige 10”'),
  [normalize('WASHABLE CARTRIDGE 20”')]: normalize('Warshable Cartrige 20”'),
  [normalize('BIO DIGESTER 5L')]: normalize('Bio Diester 5l'),
  [normalize('FILTER BODY 10” CLEAR TRIPLE')]: normalize('Filetr Body 10” Clear Tripple'),
  [normalize('FRP TANK 1252')]: normalize('Frt Tank 1252'),
  [normalize('MALE TEE ADAPTER PIPE ¼ MIDDLE THREAD 1/4')]: normalize('Male Tee Adpapter Pipe ¼'),
  [normalize('ELBOW FEMALE 3/8 BY 1/2')]: normalize('Elbow Femail 3 8 By 12'),
  [normalize('INLET VALVE PIPE 3/8 BY ½ BY 1/2 METALLIC')]: normalize('Inlet Valve Pipe 14 By 12 By 12 Metalic'),
  [normalize('INLET VALVE PIPE 1/4 BY ½ BY 1/2 METALLIC')]: normalize('Inlet Valve Pipe 14 By 12 By 12 Metalic'),
  [normalize('BLUE HOUSING HANGING PLATE 10”')]: normalize('vblue house hanging plate'),
  [normalize('CLEAR HOUSING HANGING PLATE 10”')]: normalize('Clear Housing Hungingplate 10”'),
  [normalize('HANGING PLATE 20”')]: normalize('hanging plate 20'),
  [normalize('HANGING PLATE JUMBO 20”')]: normalize('hanging plate 20'),
  [normalize('MAGNESIUM ROD ½ BRASS')]: normalize('Brass Round bar solid brass rod in diamaters 1_8_, 5mm, 6mm, 8mm, 10mm, 12mm, 16mm, 18mm, 20mm, 25mm, 30mm, 38mm, 50mm and all lengths cz121 brass rod'),
  [normalize('MAGNESIUM ROD ½ GREEN')]: normalize('MAGNICIUM ROD ½ GREEN'),
  [normalize('MAGNESIUM ROD ¾ 7SS')]: normalize('MAGNISIUM ROD ¾ 7SS'),
  [normalize('MAGNESIUM ROD 3/4')]: normalize('Magnisiun Rod'),
  [normalize('MAGNESIUM ROD 1”')]: normalize('MAGNISIUM ROD 1”'),
  [normalize('MAGNESIUM ROD 1 1/4')]: normalize('Magnisium Rod 1 1'),
  [normalize('SENSOR POCKET')]: normalize('Sensor Pocket'),
  [normalize('HEATING ELEMENT ¾')]: normalize('Heating Elemnt ¾'),
  [normalize('HEATING ELEMENT WITH THERMOSTAT')]: normalize('Heating Element With Thermostart'),
  [normalize('GLYCOL 20L RED')]: normalize('Glyco 20l Red'),
  [normalize('GLYCOL 5L RED')]: normalize('GLYCO 20L RED'),
  [normalize('FLAT PLATE')]: normalize('FLATE PLATE TANK 300L'),
  [normalize('FLAT PLATE TANK 300L')]: normalize('FLATE PLATE TANK 300L'),
  [normalize('FLAT PLATE TANK 200L')]: normalize('Solar Water Heater Flat Plate 200l'),
  [normalize('MAGNICIUM ROD ½ BRASS')]: normalize('Brass Round bar solid brass rod in diamaters 1_8_, 5mm, 6mm, 8mm, 10mm, 12mm, 16mm, 18mm, 20mm, 25mm, 30mm, 38mm, 50mm and all lengths cz121 brass rod'),
  [normalize('SENSOR PORCKET')]: normalize('Sensor Pocket'),
  [normalize('LOW PRESSURE SWITCH 1/4')]: normalize('Low Pressure Switch 14'),
  [normalize('PP SEDIMENT WOUND 20” 20 MC')]: normalize('PP Sediment Wound 20” 10 Mic'),
  [normalize('ACTIVATED CARBON INBUILT')]: normalize('Activated carbon'),
  [normalize('SAND MEDIA CLASS B')]: normalize('Sand media grade B'),
  [normalize('SAND MEDIA CLASS C')]: normalize('Sand media grade c'),
  [normalize('PUMP ADAPTOR 800 GPD')]: normalize('Pump Adaptors 400 GPD'),
  [normalize('BALL VALVE { TANK VALVE} PIPE ¼ THREAD 1/4')]: normalize('Ball Valve Tank Valve'),
  [normalize('BALL VALVE {TANK VALVE} PIPE 3/8 THREAD 1/4')]: normalize('Ball Valve'),
  [normalize('HAND VALVE PIPE ¼ BY 1/4')]: normalize('Hand Valve Pipe'),
  [normalize('HAND VALVE PIPE 3/8 BY 3/8')]: normalize('Hand Valve Pipe 38'),
  [normalize('UNION TEE ADAPTER ¼ BY ¼ BY1/4')]: normalize('Union Tee Adapter ¼'),
  [normalize('UNION TEE ADAPTER 3/8 BY 3/8 BY 3/8')]: normalize('Union Tee Adapter 3'),
  [normalize('MALE TEE ADAPTER PIPE 3/8 MIDDLE THREAD 3/8')]: normalize('Male Tee Adapter Pipe'),
  [normalize('MALE TEE ADPAPTER PIPE ¼ MIDDLE THREAD 1/4')]: normalize('Male Tee Adpapter Pipe ¼'),
  [normalize('MALE TEE ADAPTER PIPE ¼ ON BOTH SIDES MIDDLE 3/8')]: normalize('Male Tee Adapter Pipe On Both Side'),
  [normalize('MALE TEE ADAPTER PIPE 3/8 ON BOTH SIDE AND ¼ IN THE MIDDLE')]: normalize('Male Tee Adapter Pipe ¼'),
  [normalize('STEM/PLUG IN ELBOW PIPE ¼ HARD INSERTION 1/4')]: normalize('StemPlug In Elbow Pipe 14 Hard'),
  [normalize('INLTET VALVE PIPE 3/8 BY ½ BY 1/2 METALIC')]: normalize('Inlet Valve Pipe 14 By 12 By 12 Metalic'),
  [normalize('BLUE HOUSING HUNGING PLATE 10“')]: normalize('vblue house hanging plate'),
  [normalize('HUNGING PLATE 20”')]: normalize('hanging plate 20'),
  [normalize('HUNGING PLATE JUMBO 20”')]: normalize('hanging plate 20'),
  [normalize('HEATING ELEMENT 48MM(IMMERSION)')]: normalize('immersed hearter'),
  [normalize('RUBBERS/WASHER 47MM')]: normalize('Rubbersr 47mm'),
  [normalize('RUBBERS / WASHER BLACK 58 MM')]: normalize('Rubbers Black 58 Mm'),
  [normalize('FLATE PLATE')]: normalize('FLATE PLATE TANK 300L'),
  [normalize('SOLAR TUBE TANK 300L H/P')]: normalize('Solar Tube Tank 300l'),
  [normalize('SOLAR TUBE TANK 300L L/P')]: normalize('Solar Tube Tank 300l'),
  [normalize('SOLAR TUBE TANK 200L L/P')]: normalize('Solar Tube Tank 200l'),
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
