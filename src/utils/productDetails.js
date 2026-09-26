const match = (name, pattern, fallback = null) => name.match(pattern)?.[1] || fallback
const spec = (label, value) => ({ label, value })
const listedRatings = (name) => [...name.matchAll(/(?:0\.5|\d+(?:\.\d+)?)\s*(?:L\s*\/\s*H|GPD|KG|L|W|KW|MIC|MM|CC)|(?:¼|½|¾|1\/4|1\/2|3\/8|1 1\/4)/g)].map(({ 0: value }) => value.replace(/\s+/g, ' '))

const familyPurpose = {
  'Filter Housings': ['serviceable housing for a compatible replacement cartridge', 'Water filtration'],
  'Filter Cartridges': ['replaceable cartridge for a staged filtration system', 'Water filtration'],
  Membranes: ['membrane component for fine water purification', 'Membrane purification'],
  'Taps & Testing': ['dispensing or water-quality checking component', 'Point-of-use treatment'],
  'Pumps & Controls': ['pressure or control component for a purification system', 'Water purification'],
  'Filter Media': ['bulk treatment media for a correctly designed filter vessel', 'Media filtration'],
  'Treatment Chemicals': ['professional water-treatment chemical', 'Professional treatment'],
  'Water Treatment Accessories': ['installation or replacement component', 'Water treatment'],
  'Tanks & Valves': ['vessel or flow-control component', 'Filtration or softening'],
  'UV Sterilization': ['replacement component for a UV-C disinfection system', 'UV disinfection'],
  'Fittings & Accessories': ['fitting or accessory for secure, serviceable pipework', 'Water treatment'],
  'Solar Spares': ['replacement component for a solar water-heating system', 'Solar hot water'],
  'Controllers & Sensors': ['monitoring or control component for solar hot water', 'Solar hot-water control'],
  'Solar Accessories': ['installation or replacement solar accessory', 'Solar hot water'],
  'Heating Elements': ['electric backup-heating component', 'Hot-water storage'],
  'Fittings & Seals': ['replacement fitting or seal', 'Solar hot water'],
  'Complete Systems & Tanks': ['solar water-heating product', 'Domestic or institutional hot water'],
}

export function getProductDetails(product) {
  const name = product.name.toUpperCase()
  const ratings = listedRatings(name)
  const base = familyPurpose[product.family] || ['professional equipment component', product.category]
  let summary = `A ${base[0]} selected for reliable ${base[1].toLowerCase()} installation or maintenance.`
  let specs = [spec('Product family', product.family), spec('Application', base[1])]
  let benefits = ['Purpose-matched for its listed application', 'Suitable for installation or replacement', 'Technical selection support is available']
  let caution

  if (/PP SEDIMENT (SPUN|WOUND)/.test(name)) {
    const mic = match(name, /(0\.5|1|5|10|20)\s*MI?C/)
    summary = `A ${mic}-micron ${name.includes('WOUND') ? 'string-wound' : 'spun'} polypropylene prefilter that captures sand, silt, rust and other suspended sediment before finer treatment stages.`
    specs = [spec('Nominal length', `${match(name, /(10|20)\s*[“”"]/)} inch`), spec('Micron rating', `${mic} micron`), spec('Format', name.includes('JUMBO') ? 'Jumbo / 4.5-inch class' : 'Standard / slim')]
    benefits = ['Reduces suspended particles', 'Helps protect membranes and carbon filters', 'Replace when loaded or flow declines']
  } else if (/BLOCK CARBON|GRANULAR CARBON/.test(name)) {
    const block = name.includes('BLOCK')
    summary = `A ${block ? 'compressed carbon-block' : 'granular activated-carbon'} cartridge for reducing chlorine and taste- and odour-causing compounds.`
    specs = [spec('Nominal length', `${match(name, /(10|20)\s*[“”"]/)} inch`), spec('Media', block ? 'Activated carbon block' : 'Granular activated carbon'), spec('Format', name.includes('JUMBO') ? 'Jumbo / 4.5-inch class' : 'Standard / slim')]
    benefits = ['Improves taste and odour', 'Useful as a polishing stage', 'Best installed after sediment prefiltration']
  } else if (product.family === 'Reverse Osmosis Systems') {
    const lph = match(name, /(125|250|500|750|1000)\s*L\s*\/\s*H/)
    const output = lph ? `${lph} litres per hour` : `${match(name, /(100)\s*GPD/)} gallons per day`
    summary = `A reverse-osmosis system with a nominal output of ${output}. Pressure drives water through a semipermeable membrane to produce purified permeate and concentrated reject water.`
    specs = [spec('Nominal output', output), spec('Process', 'Reverse osmosis'), spec('Sizing basis', 'Feed-water analysis and daily demand')]
    benefits = ['Reduces dissolved salts and many contaminants', 'Reliable with correct pretreatment', 'Professional sizing support available']
  } else if (product.family === 'Membranes' && !name.includes('KEY')) {
    const rating = name.includes('4040') ? '4040 (4 × 40-inch class)' : `${match(name, /(100|300|400)\s*GPD/, '100')} GPD nominal`
    summary = 'An RO membrane that separates dissolved salts to produce lower-salinity permeate. Actual output and rejection vary with pressure, temperature and feed-water quality.'
    specs = [spec('Element rating', rating), spec('Process', 'Reverse osmosis'), spec('Housing', name.includes('INBUILT') ? 'Encapsulated / inline' : 'Compatible pressure vessel required')]
    benefits = ['Core RO separation stage', 'Reduces total dissolved solids', 'Replace based on water quality and output']
  } else if (product.family === 'UV Sterilization') {
    const sleeve = name.includes('SLEEVE'), watts = match(name, /(4|6|11|12|16|25|55)\s*W/), pins = match(name, /(2|4)\s*PIN/)
    summary = sleeve ? 'A quartz sleeve that isolates the electrical UV lamp from water while transmitting germicidal UV-C into the reactor.' : 'A germicidal UV-C replacement lamp. Correct wattage, length and pin arrangement are essential for safe performance.'
    specs = [spec('Component', sleeve ? 'Quartz lamp sleeve' : 'UV-C lamp'), spec('Power class', `${watts} W`), ...(pins ? [spec('Connector', `${pins}-pin`)] : [])]
    benefits = sleeve ? ['Protects the lamp from water', 'Transmits UV-C into the chamber', 'Replace if cloudy or damaged'] : ['Supports chemical-free disinfection', 'Direct replacement when correctly matched', 'Follow the maker’s service interval']
  } else if (/SALT TABLET/.test(name)) {
    summary = 'Compacted salt tablets used to make regeneration brine for compatible ion-exchange water softeners.'
    specs = [spec('Pack size', '10 kg'), spec('Use', 'Softener regeneration'), spec('Form', 'Compacted tablets')]
    benefits = ['Restores resin capacity', 'Clean format for brine tanks', 'Supports routine maintenance']
  } else if (/RESIN/.test(name)) {
    summary = 'Ion-exchange resin that replaces hardness-forming calcium and magnesium with sodium to reduce scale.'
    specs = [spec('Media', 'Cation-exchange resin'), spec('Application', 'Water softening'), spec('Regeneration', 'Salt brine')]
    benefits = ['Reduces hardness scale', 'Helps protect heaters and plumbing', 'Regenerable for repeated service']
  } else if (product.family === 'Treatment Chemicals') {
    const kind = name.includes('CHLORINE') ? 'Chlorine disinfectant' : name.includes('CAUSTIC') ? 'Caustic soda' : name.includes('CITRIC') ? 'Citric acid cleaner' : name.includes('FLOCCULANT') ? 'Water-treatment flocculant' : name.includes('ANTISCALANT') ? 'RO antiscalant' : name.includes('BIO DIGESTER') ? 'Biological digester treatment' : 'Drain treatment'
    summary = `${kind} for professional treatment use. Dosing must follow water chemistry, the safety data sheet and a qualified treatment plan.`
    specs = [spec('Product type', kind), spec('Pack size', ratings.at(-1) || 'See label'), spec('Use', base[1])]
    benefits = ['Professional treatment product', 'Practical pack size', 'Use with technical dosing guidance']
    caution = 'Read the safety data sheet, wear appropriate PPE, never mix chemicals, and keep away from children.'
  } else if (/TDS METER/.test(name)) {
    summary = 'A handheld meter for quick total-dissolved-solids checks. It supports comparison and monitoring, but is not a complete drinking-water safety test.'
    specs = [spec('Instrument', name.includes('7 IN 1') ? '7-in-1 meter' : '3-in-1 meter'), spec('Primary reading', 'Total dissolved solids'), spec('Use', 'Spot checks and trend monitoring')]
    benefits = ['Fast on-site readings', 'Compares feed and treated water', 'Portable monitoring tool']
  } else if (/FRP TANK/.test(name)) {
    summary = 'A corrosion-resistant FRP pressure vessel for holding softening resin or filtration media.'
    specs = [spec('Material', 'Fibre-reinforced plastic'), spec('Tank code', name.replace('FRP TANK ', '')), spec('Application', 'Filtration or softening')]
    benefits = ['Lightweight and corrosion resistant', 'Accepts a matching control valve', 'Serviceable treatment vessel']
  } else if (/MPV/.test(name)) {
    summary = `A ${name.includes('AUTOMATIC') ? 'automatic' : 'manual'} multi-port valve controlling service, rinse and backwash cycles in a ${name.includes('SOFTENER') ? 'softener' : 'media filter'}.`
    specs = [spec('Control', name.includes('AUTOMATIC') ? 'Automatic' : 'Manual'), spec('Application', name.includes('SOFTENER') ? 'Water softening' : 'Media filtration'), spec('Type', 'Multi-port valve')]
    benefits = ['Directs treatment cycles', 'Supports cleaning or regeneration', 'Matches compatible pressure vessels']
  } else if (product.family === 'Complete Systems & Tanks') {
    const litres = match(name, /(200|300)\s*L/), collector = name.includes('FLAT PLATE') ? 'Flat-plate' : 'Evacuated-tube'
    const pressure = /H[./]P/.test(name) ? 'High pressure' : /L[./]P/.test(name) ? 'Low pressure' : 'Confirm configuration'
    summary = name === 'SOLAR COMPLETE' ? 'A complete, professionally sized solar hot-water package for collecting renewable heat and storing hot water.' : name.includes('TANK') ? `A ${litres}-litre replacement tank for a compatible ${collector.toLowerCase()} system.` : `A ${litres}-litre ${collector.toLowerCase()} solar water-heating system.`
    specs = name === 'SOLAR COMPLETE' ? [spec('System', 'Complete solar hot-water package'), spec('Sizing', 'Project specific')] : [spec('Storage', `${litres} litres`), spec('Collector', collector), spec('Pressure', pressure)]
    benefits = ['Uses renewable solar energy', 'Can reduce heating costs', 'Professional installation available']
  } else if (product.family === 'Heating Elements') {
    summary = 'An electric immersion element used as backup heating in a compatible hot-water storage tank.'
    specs = [spec('Component', 'Immersion element'), ...(match(name, /(1\.5|2)\s*KW/) ? [spec('Power', `${match(name, /(1\.5|2)\s*KW/)} kW`)] : []), spec('Compatibility', 'Confirm voltage, thread, length and thermostat')]
    benefits = ['Provides backup heat', 'Replaceable tank component', 'Supports dependable hot water']
  } else if (/MAGNESIUM ROD/.test(name)) {
    summary = 'A sacrificial magnesium anode that helps protect a compatible steel hot-water tank from internal corrosion.'
    specs = [spec('Component', 'Magnesium anode'), spec('Connection', ratings[0] || 'Check fitting'), spec('Maintenance', 'Replace when depleted')]
    benefits = ['Helps extend tank life', 'Corrodes in place of the tank', 'Preventive-maintenance component']
  } else if (/GLYCOL/.test(name)) {
    summary = 'Red heat-transfer glycol for a compatible closed-loop solar thermal circuit, carrying heat and providing freeze protection at the correct concentration.'
    specs = [spec('Fluid', 'Solar heat-transfer glycol'), spec('Pack size', ratings[0]), spec('System', 'Closed-loop solar thermal')]
    caution = 'Use the concentration specified by the system manufacturer; do not mix incompatible fluids.'
  } else if (/SOLAR TUBES/.test(name)) {
    summary = 'A 58 mm evacuated collector tube that absorbs solar radiation and transfers heat into a compatible manifold.'
    specs = [spec('Diameter', '58 mm'), spec('Type', 'Evacuated tube'), spec('Compatibility', 'Confirm tube length and manifold')]
  } else if (product.family === 'Controllers & Sensors') {
    const model = name.replace(/ CONTROLLER| CABLE.*/g, '')
    summary = name.includes('CABLE') ? `A sensor cable for a compatible ${model} controller.` : name.includes('POCKET') ? 'A thermowell that protects a temperature probe while supporting accurate readings.' : `A ${model} controller for monitoring temperature and coordinating compatible solar equipment.`
    specs = [spec('Component', name.includes('CABLE') ? 'Sensor cable' : name.includes('POCKET') ? 'Sensor pocket' : 'Solar controller'), spec('Model', model)]
    benefits = ['Supports temperature-based operation', 'Provides system monitoring', 'Purpose-matched replacement']
  } else if (ratings.length) {
    specs.push(spec('Listed size / rating', ratings.join(' · ')))
  }

  specs.push(spec('Selection note', 'Confirm dimensions and compatibility before ordering'))
  return { summary, specs, benefits, caution }
}
