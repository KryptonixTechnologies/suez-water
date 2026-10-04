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
  // Use the newly supplied product-family images for every available pack size.
  [normalize('CHLORINE 65 5KG')]: normalize('chlorine 65'),
  [normalize('CHLORINE 65 1KG')]: normalize('chlorine 65'),
  [normalize('CHLORINE 65 500G')]: normalize('chlorine 65'),
  [normalize('CAUSTIC SODA 1KG')]: normalize('Caustic Soda'),
  [normalize('CITRIC ACID 1KG')]: normalize('citric acid'),
  [normalize('FLOCCULANT 5KG')]: normalize('floculant'),
  [normalize('FLOCCULANT 1KG')]: normalize('floculant'),
  [normalize('FLOCCULANT 500 G')]: normalize('floculant'),
  [normalize('GLYCO 5L RED')]: normalize('solar hot Water Heater Fluid'),
  // Preserve supplied images after correcting spelling in the public catalog.
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
  [normalize('MAGNESIUM ROD 3/4')]: normalize('Magnisiun Rod'),
  [normalize('MAGNESIUM ROD 1”')]: normalize('MAGNISIUM ROD 1”'),
  [normalize('MAGNESIUM ROD 1 1/4')]: normalize('Magnisium Rod 1 1'),
  [normalize('SENSOR POCKET')]: normalize('Sensor Pocket'),
  [normalize('HEATING ELEMENT ¾')]: normalize('Heating Elemnt ¾'),
  [normalize('GLYCOL 20L RED')]: normalize('Glyco 20l Red'),
  [normalize('GLYCOL 5L RED')]: normalize('GLYCO 20L RED'),
  [normalize('MAGNICIUM ROD ½ BRASS')]: normalize('Brass Round bar solid brass rod in diamaters 1_8_, 5mm, 6mm, 8mm, 10mm, 12mm, 16mm, 18mm, 20mm, 25mm, 30mm, 38mm, 50mm and all lengths cz121 brass rod'),
  [normalize('SENSOR PORCKET')]: normalize('Sensor Pocket'),
  [normalize('LOW PRESSURE SWITCH 1/4')]: normalize('Low Pressure Switch 14'),
  [normalize('PP SEDIMENT WOUND 20” 20 MC')]: normalize('PP Sediment Wound 20” 10 Mic'),
  [normalize('ACTIVATED CARBON INBUILT')]: normalize('Activated carbon'),
  [normalize('SAND MEDIA CLASS B')]: normalize('Sand media grade B'),
  [normalize('SAND MEDIA CLASS C')]: normalize('Sand media grade c'),
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
  [normalize('RUBBERS/WASHER 47MM')]: normalize('Rubbersr 47mm'),
  [normalize('RUBBERS / WASHER BLACK 58 MM')]: normalize('Rubbers Black 58 Mm'),
  [normalize('SOLAR TUBE TANK 300L L/P')]: normalize('Solar Tube Tank 300l'),
}

// Prefer current supplier photographs over superseded legacy assets. Family
// photographs are reused when catalogue products differ only by measurement.
const supplierReplacement = (key) => {
  if (key === normalize('REVERSE OSMOSIS SYSTEM 100 GPD')) return normalize('100GPD under sink water purifier')
  if (key === normalize('REVERSE OSMOSIS SYSTEM 125 L /H')) return normalize('125l per h Reverse osmosis machine')
  if (/^reverseosmosissystem(250|500|750|1000)lh$/.test(key)) return normalize('1000lh Reverse osmosis machine')
  if (/^membrane(100gpd2012|inbult100gpd)$/.test(key)) return normalize('100GPD Ro membrane')
  if (/^membrane(300gpd|400gpd3013)$/.test(key)) return normalize('300-600 RO GPD')
  if (/^(frotec|aquavista)membrane4040$/.test(key) || key === normalize('MEMBRANE 4040 FIBRE BODY')) return normalize('Ro 4040 membrane')
  if (key === normalize('RO PUMP MINI 100 GPD')) return normalize('100GPD Diaphragm booster pump')
  if (/^ropump(400|800)gpd$/.test(key)) return normalize('400G booster pump')
  if (key === normalize('PUMP ADAPTORS 100GPD')) return normalize('100GPD pump adapter')
  if (/^pumpadaptor(s400|800)gpd$/.test(key)) return normalize('Pump adapter')

  const housings = {
    [normalize('FILTER BODY JUMBO 20”')]: 'Jumbo filter housing 20 inch',
    [normalize('FILTER BODY 10” CLEAR')]: 'Filter body 10 inch',
    [normalize('FILTER BODY 10” CLEAR DOUBLE')]: 'Double filter 10 inch',
    [normalize('FILTER BODY 10” CLEAR TRIPLE')]: 'Triple filter 10 inch',
    [normalize('FILTER BODY 10” CLEAR RO')]: 'Reverse osmosis system housing',
  }
  if (housings[key]) return normalize(housings[key])
  if (key === normalize('BLOCK CARBON 20”')) return normalize('Block carbon 20 inch')
  if (/^ppsedimentspun(10|20)/.test(key) && key.endsWith('jumbo')) return normalize('10 and 20 inch Jumbo pp sediment filter')
  if (/^ppsedimentspun10/.test(key)) return normalize('10 inch pp sediment filter')
  if (/^ppsedimentspun20/.test(key)) return normalize('Pp sediment 20 inch')
  if (/^ppsedimentwound10/.test(key)) return normalize('Wound pp filter 10 inch')

  const exact = {
    [normalize('SALT TABLET 10KG')]: 'Water softener salt tablets',
    [normalize('CARBON MEDIA 25KG')]: 'Carbon media',
    [normalize('FRP TANK 1054')]: '1054 FRP tank',
    [normalize('CHLORINE 65 1KG')]: '1kg chlorine 65',
    [normalize('CAUSTIC SODA 1KG')]: '1kg caustic soda',
    [normalize('CITRIC ACID 1KG')]: '1kg citric acid',
    [normalize('ANTISCALANT 20L')]: '20ltrs antiscalant',
    [normalize('FAUCET TAP GOLD')]: 'Gold star Ro faucet taps',
    [normalize('FAUCET TAP STANDARD')]: 'Standard faucet taps',
    [normalize('FAUCET TAP STAR')]: 'Star Ro faucet',
    [normalize('FAUCET MIXER TAP')]: 'Standard Ro mixer taps',
    [normalize('SR609 CONTROLLER')]: 'Sr6o9c controller',
  }
  if (exact[key]) return normalize(exact[key])
  if (key === normalize('AUTOMATIC MPV SOFTERNER')) return normalize('Automatic water softening valve')
  if (key === normalize('MANUAL MPV SOFTENER')) return normalize('Softener mpv valve')
  if (/^magnesiumrod/.test(key)) return normalize('Threads magnesium rods 12"&34"')
  if (/^assistanttank/.test(key)) return normalize('Solar water heater assistant tank')
  if (key === 'flatplate' || key.startsWith('flatplatetank') || key.startsWith('solarwaterheaterflatplate')) return normalize('Flat plate solar water heater 200l and 300l')
  if ([
    normalize('HEATING ELEMNT ¾'), normalize('HEATING ELEMENT 1”'),
    normalize('HEATING ELEMENT 1 1/4'), normalize('HEATING ELEMENT ¾ STICK'),
  ].includes(key)) return normalize('Heating elements 3-4 inch, 1 inch and 1-1-4 inch')
  if ([normalize('HEATING ELEMENT 7SS 2KW'), normalize('HEATING ELEMENT 7SS 1.5 KW')].includes(key)) {
    return normalize('Heating elements 1.5kw and 2kw')
  }
  if (/^flextube/.test(key)) return normalize('Stainless steel solar flex tubes')
  return null
}

export function getProductImage(product) {
  const key = normalize(product.name)
  const exactImage = imagesByName.get(supplierReplacement(key))
    || imagesByName.get(aliases[key])
    || imagesByName.get(key)
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
