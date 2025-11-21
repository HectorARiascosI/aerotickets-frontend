// Base de datos de aerolíneas colombianas y sus flotas

export interface AircraftInfo {
  model: string;
  manufacturer: string;
  capacity: number;
  range: number; // en km
  cruiseSpeed: number; // en km/h
  imageUrl: string;
  history: string;
  interestingFacts: string[];
  firstFlight: string;
  engines: string;
  wingspan: string;
  length: string;
}

export interface AirlineInfo {
  name: string;
  code: string;
  founded: string;
  headquarters: string;
  fleet: AircraftInfo[];
  logoUrl: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
  };
}

// Base de datos de aeronaves por modelo
export const AIRCRAFT_DATABASE: Record<string, AircraftInfo> = {
  'A320': {
    model: 'Airbus A320',
    manufacturer: 'Airbus',
    capacity: 180,
    range: 6150,
    cruiseSpeed: 840,
    imageUrl: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800',
    firstFlight: '1987',
    engines: '2x CFM56 o IAE V2500',
    wingspan: '35.8 m',
    length: '37.57 m',
    history: 'El Airbus A320 revolucionó la aviación comercial al ser el primer avión de pasajeros con controles fly-by-wire digitales. Es uno de los aviones más exitosos de la historia.',
    interestingFacts: [
      'Primer avión comercial con sidestick en lugar de yoke tradicional',
      'Más de 10,000 unidades entregadas desde su introducción',
      'Puede aterrizar de forma completamente automática en condiciones de baja visibilidad',
      'Su diseño de cabina es compartido con toda la familia A320',
      'Consume 30% menos combustible que aviones de generación anterior'
    ]
  },
  'A319': {
    model: 'Airbus A319',
    manufacturer: 'Airbus',
    capacity: 156,
    range: 6850,
    cruiseSpeed: 840,
    imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800',
    firstFlight: '1995',
    engines: '2x CFM56 o IAE V2500',
    wingspan: '34.1 m',
    length: '33.84 m',
    history: 'Versión acortada del A320, diseñado para rutas de menor demanda pero con mayor alcance. Popular en aerolíneas latinoamericanas.',
    interestingFacts: [
      'Versión más pequeña de la familia A320',
      'Ideal para aeropuertos con pistas cortas',
      'Puede volar más lejos que el A320 estándar',
      'Muy popular en rutas regionales de alta frecuencia',
      'Comparte el 95% de componentes con el A320'
    ]
  },
  'A321': {
    model: 'Airbus A321',
    manufacturer: 'Airbus',
    capacity: 220,
    range: 5950,
    cruiseSpeed: 840,
    imageUrl: 'https://images.unsplash.com/photo-1583792928584-5e9d36f9db06?w=800',
    firstFlight: '1993',
    engines: '2x CFM56 o IAE V2500',
    wingspan: '35.8 m',
    length: '44.51 m',
    history: 'La versión alargada del A320, diseñada para maximizar capacidad en rutas de alta demanda. Es el miembro más grande de la familia A320.',
    interestingFacts: [
      'Versión más larga de la familia A320',
      'Puede transportar hasta 244 pasajeros en configuración de alta densidad',
      'El A321neo puede volar rutas transatlánticas',
      'Muy eficiente en rutas de alta demanda',
      'Popular para reemplazar Boeing 757'
    ]
  },
  'B737-700': {
    model: 'Boeing 737-700',
    manufacturer: 'Boeing',
    capacity: 149,
    range: 6230,
    cruiseSpeed: 842,
    imageUrl: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800',
    firstFlight: '1997',
    engines: '2x CFM56-7B',
    wingspan: '35.8 m',
    length: '33.6 m',
    history: 'Parte de la familia Next Generation del 737, diseñado para competir con el A319. Es conocido por su fiabilidad y eficiencia.',
    interestingFacts: [
      'Parte de la familia 737 Next Generation',
      'Uno de los aviones más confiables del mundo',
      'Puede operar en aeropuertos de gran altitud',
      'Excelente rendimiento en pistas cortas',
      'Más de 1,100 unidades entregadas'
    ]
  },
  'B737-800': {
    model: 'Boeing 737-800',
    manufacturer: 'Boeing',
    capacity: 189,
    range: 5765,
    cruiseSpeed: 842,
    imageUrl: 'https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=800',
    firstFlight: '1997',
    engines: '2x CFM56-7B',
    wingspan: '35.8 m',
    length: '39.5 m',
    history: 'El 737-800 es el modelo más vendido de la familia 737. Es el caballo de batalla de muchas aerolíneas alrededor del mundo.',
    interestingFacts: [
      'El 737 más vendido de todos los tiempos',
      'Más de 5,000 unidades entregadas',
      'Puede volar hasta 5,765 km sin repostar',
      'Excelente economía de combustible',
      'Utilizado por aerolíneas de bajo costo y tradicionales'
    ]
  },
  'ATR-72': {
    model: 'ATR 72',
    manufacturer: 'ATR',
    capacity: 78,
    range: 1528,
    cruiseSpeed: 510,
    imageUrl: 'https://images.unsplash.com/photo-1583792928584-5e9d36f9db06?w=800',
    firstFlight: '1988',
    engines: '2x Pratt & Whitney PW127',
    wingspan: '27.05 m',
    length: '27.17 m',
    history: 'Turbohélice regional diseñado para rutas cortas. Es el avión regional más vendido del mundo, ideal para conectar ciudades pequeñas.',
    interestingFacts: [
      'Avión turbohélice más vendido del mundo',
      'Perfecto para pistas cortas y no pavimentadas',
      'Consume 40% menos combustible que jets regionales',
      'Puede aterrizar en aeropuertos remotos',
      'Muy popular en regiones montañosas como Colombia'
    ]
  },
  'ATR-42': {
    model: 'ATR 42',
    manufacturer: 'ATR',
    capacity: 50,
    range: 1326,
    cruiseSpeed: 510,
    imageUrl: 'https://images.unsplash.com/photo-1583792928584-5e9d36f9db06?w=800',
    firstFlight: '1984',
    engines: '2x Pratt & Whitney PW127',
    wingspan: '24.57 m',
    length: '22.67 m',
    history: 'Versión más pequeña del ATR 72, diseñado para rutas regionales de baja demanda. Excelente para conectar comunidades remotas.',
    interestingFacts: [
      'Versión más pequeña del ATR 72',
      'Ideal para rutas de baja demanda',
      'Puede operar en pistas muy cortas',
      'Muy económico de operar',
      'Popular en regiones amazónicas de Colombia'
    ]
  },
  'ERJ-145': {
    model: 'Embraer ERJ-145',
    manufacturer: 'Embraer',
    capacity: 50,
    range: 3706,
    cruiseSpeed: 833,
    imageUrl: 'https://images.unsplash.com/photo-1583792928584-5e9d36f9db06?w=800',
    firstFlight: '1995',
    engines: '2x Rolls-Royce AE 3007',
    wingspan: '20.04 m',
    length: '29.87 m',
    history: 'Jet regional brasileño que revolucionó la aviación regional. Combina velocidad de jet con economía de operación.',
    interestingFacts: [
      'Primer jet regional de Embraer',
      'Puede volar a la misma velocidad que jets grandes',
      'Excelente para rutas regionales de media distancia',
      'Muy confiable y económico',
      'Más de 1,000 unidades entregadas'
    ]
  },
  'B787': {
    model: 'Boeing 787 Dreamliner',
    manufacturer: 'Boeing',
    capacity: 242,
    range: 14140,
    cruiseSpeed: 913,
    imageUrl: 'https://images.unsplash.com/photo-1583792928584-5e9d36f9db06?w=800',
    firstFlight: '2009',
    engines: '2x GE GEnx o Rolls-Royce Trent 1000',
    wingspan: '60.1 m',
    length: '56.7 m',
    history: 'Avión de última generación con fuselaje de fibra de carbono. Revolucionó los vuelos de largo alcance con mayor eficiencia y comodidad.',
    interestingFacts: [
      'Primer avión comercial con fuselaje de fibra de carbono',
      'Ventanas 65% más grandes que aviones tradicionales',
      'Cabina presurizada a menor altitud para mayor comodidad',
      'Consume 20% menos combustible que aviones similares',
      'Sistema de iluminación LED que simula el ciclo día-noche'
    ]
  }
};

// Base de datos de aerolíneas colombianas
export const COLOMBIAN_AIRLINES: Record<string, AirlineInfo> = {
  'Avianca': {
    name: 'Avianca',
    code: 'AV',
    founded: '1919',
    headquarters: 'Bogotá, Colombia',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Avianca_Logo.svg/200px-Avianca_Logo.svg.png',
    description: 'La segunda aerolínea más antigua del mundo en operación continua. Líder en Colombia y una de las más importantes de América Latina.',
    colors: {
      primary: '#DC0032',
      secondary: '#FFFFFF'
    },
    fleet: [
      AIRCRAFT_DATABASE['A320'],
      AIRCRAFT_DATABASE['A319'],
      AIRCRAFT_DATABASE['A321'],
      AIRCRAFT_DATABASE['B787']
    ]
  },
  'LATAM': {
    name: 'LATAM Airlines',
    code: 'LA',
    founded: '2012',
    headquarters: 'Santiago, Chile',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/LATAM-Logo.svg/200px-LATAM-Logo.svg.png',
    description: 'Resultado de la fusión entre LAN y TAM. Una de las aerolíneas más grandes de América Latina con presencia en Colombia.',
    colors: {
      primary: '#E6007E',
      secondary: '#FFFFFF'
    },
    fleet: [
      AIRCRAFT_DATABASE['A320'],
      AIRCRAFT_DATABASE['A321'],
      AIRCRAFT_DATABASE['B787']
    ]
  },
  'Wingo': {
    name: 'Wingo',
    code: 'P5',
    founded: '2016',
    headquarters: 'Bogotá, Colombia',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Wingo_logo.svg/200px-Wingo_logo.svg.png',
    description: 'Aerolínea de bajo costo subsidiaria de Copa Airlines. Ofrece vuelos económicos en Colombia y la región.',
    colors: {
      primary: '#00B5E2',
      secondary: '#FFD100'
    },
    fleet: [
      AIRCRAFT_DATABASE['B737-700'],
      AIRCRAFT_DATABASE['B737-800']
    ]
  },
  'Satena': {
    name: 'Satena',
    code: 'SA',
    founded: '1962',
    headquarters: 'Bogotá, Colombia',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Satena_Logo.svg/200px-Satena_Logo.svg.png',
    description: 'Aerolínea estatal colombiana que conecta regiones remotas del país. Especializada en rutas a zonas de difícil acceso.',
    colors: {
      primary: '#003087',
      secondary: '#FFD100'
    },
    fleet: [
      AIRCRAFT_DATABASE['ATR-42'],
      AIRCRAFT_DATABASE['ATR-72'],
      AIRCRAFT_DATABASE['ERJ-145']
    ]
  },
  'Aerotickets': {
    name: 'Aerotickets',
    code: 'AT',
    founded: '2024',
    headquarters: 'Bogotá, Colombia',
    logoUrl: '/logo.png',
    description: 'Aerolínea moderna enfocada en conectar Colombia con tecnología de punta y servicio excepcional.',
    colors: {
      primary: '#0ea5e9',
      secondary: '#7c3aed'
    },
    fleet: [
      AIRCRAFT_DATABASE['A320'],
      AIRCRAFT_DATABASE['B737-800']
    ]
  }
};

// Función para obtener información de aeronave por tipo
export function getAircraftInfo(aircraftType: string): AircraftInfo | null {
  // Normalizar el tipo de aeronave
  const normalized = aircraftType.toUpperCase().replace(/\s+/g, '-');
  
  // Buscar coincidencias
  for (const [key, aircraft] of Object.entries(AIRCRAFT_DATABASE)) {
    if (normalized.includes(key.replace('-', '')) || key.includes(normalized)) {
      return aircraft;
    }
  }
  
  return null;
}

// Función para obtener información de aerolínea
export function getAirlineInfo(airlineName: string): AirlineInfo | null {
  const normalized = airlineName.toLowerCase();
  
  for (const [key, airline] of Object.entries(COLOMBIAN_AIRLINES)) {
    if (normalized.includes(key.toLowerCase()) || key.toLowerCase().includes(normalized)) {
      return airline;
    }
  }
  
  return null;
}
