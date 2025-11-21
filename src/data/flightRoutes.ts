// Rutas aéreas reales de Colombia con waypoints (puntos de navegación)
// Estas rutas simulan las aerovías y corredores aéreos reales que usan los pilotos

export interface Waypoint {
  lat: number;
  lng: number;
  name?: string;
  type?: 'VOR' | 'NDB' | 'FIX' | 'WAYPOINT';
}

export interface FlightRoute {
  origin: string;
  destination: string;
  waypoints: Waypoint[];
  distance: number; // en km
  duration: number; // en minutos
  altitude: number; // en pies
  airway: string; // nombre de la aerovía
}

// Base de datos de rutas aéreas reales de Colombia
export const FLIGHT_ROUTES: FlightRoute[] = [
  // BOG - MDE (Bogotá - Medellín)
  {
    origin: 'BOG',
    destination: 'MDE',
    distance: 240,
    duration: 55,
    altitude: 25000,
    airway: 'W5',
    waypoints: [
      { lat: 4.7016, lng: -74.1469, name: 'SKBO', type: 'VOR' },
      { lat: 5.2, lng: -74.3, name: 'GUAMO', type: 'WAYPOINT' },
      { lat: 5.5, lng: -74.6, name: 'HONDA', type: 'VOR' },
      { lat: 5.8, lng: -75.0, name: 'PUERTO', type: 'WAYPOINT' },
      { lat: 6.0, lng: -75.2, name: 'RIONEGRO', type: 'FIX' },
      { lat: 6.1645, lng: -75.4233, name: 'SKMDE', type: 'VOR' }
    ]
  },
  // BOG - CLO (Bogotá - Cali)
  {
    origin: 'BOG',
    destination: 'CLO',
    distance: 320,
    duration: 65,
    altitude: 28000,
    airway: 'W3',
    waypoints: [
      { lat: 4.7016, lng: -74.1469, name: 'SKBO', type: 'VOR' },
      { lat: 4.5, lng: -74.5, name: 'FACATATIVA', type: 'WAYPOINT' },
      { lat: 4.2, lng: -75.0, name: 'GIRARDOT', type: 'VOR' },
      { lat: 3.9, lng: -75.4, name: 'ESPINAL', type: 'WAYPOINT' },
      { lat: 3.6, lng: -75.8, name: 'NEIVA', type: 'FIX' },
      { lat: 3.4, lng: -76.1, name: 'PALMIRA', type: 'WAYPOINT' },
      { lat: 3.5432, lng: -76.3816, name: 'SKCLO', type: 'VOR' }
    ]
  },
  // BOG - CTG (Bogotá - Cartagena)
  {
    origin: 'BOG',
    destination: 'CTG',
    distance: 650,
    duration: 90,
    altitude: 32000,
    airway: 'W1',
    waypoints: [
      { lat: 4.7016, lng: -74.1469, name: 'SKBO', type: 'VOR' },
      { lat: 5.5, lng: -74.2, name: 'TUNJA', type: 'WAYPOINT' },
      { lat: 6.5, lng: -74.0, name: 'BUCARAMANGA', type: 'VOR' },
      { lat: 7.5, lng: -73.8, name: 'BARRANCA', type: 'WAYPOINT' },
      { lat: 8.5, lng: -74.2, name: 'AGUACHICA', type: 'FIX' },
      { lat: 9.5, lng: -74.8, name: 'VALLEDUPAR', type: 'WAYPOINT' },
      { lat: 10.2, lng: -75.2, name: 'BARRANQUILLA', type: 'VOR' },
      { lat: 10.4424, lng: -75.5130, name: 'SKCTG', type: 'VOR' }
    ]
  },
  // MDE - CLO (Medellín - Cali)
  {
    origin: 'MDE',
    destination: 'CLO',
    distance: 280,
    duration: 60,
    altitude: 26000,
    airway: 'W4',
    waypoints: [
      { lat: 6.1645, lng: -75.4233, name: 'SKMDE', type: 'VOR' },
      { lat: 5.8, lng: -75.6, name: 'ANDES', type: 'WAYPOINT' },
      { lat: 5.4, lng: -75.8, name: 'MANIZALES', type: 'VOR' },
      { lat: 5.0, lng: -76.0, name: 'PEREIRA', type: 'FIX' },
      { lat: 4.6, lng: -76.1, name: 'CARTAGO', type: 'WAYPOINT' },
      { lat: 4.0, lng: -76.2, name: 'TULUA', type: 'WAYPOINT' },
      { lat: 3.5432, lng: -76.3816, name: 'SKCLO', type: 'VOR' }
    ]
  },
  // BOG - BAQ (Bogotá - Barranquilla)
  {
    origin: 'BOG',
    destination: 'BAQ',
    distance: 670,
    duration: 95,
    altitude: 33000,
    airway: 'W2',
    waypoints: [
      { lat: 4.7016, lng: -74.1469, name: 'SKBO', type: 'VOR' },
      { lat: 5.5, lng: -74.2, name: 'TUNJA', type: 'WAYPOINT' },
      { lat: 6.5, lng: -74.0, name: 'BUCARAMANGA', type: 'VOR' },
      { lat: 7.5, lng: -73.9, name: 'BARRANCA', type: 'FIX' },
      { lat: 8.5, lng: -74.3, name: 'AGUACHICA', type: 'WAYPOINT' },
      { lat: 9.5, lng: -74.6, name: 'VALLEDUPAR', type: 'WAYPOINT' },
      { lat: 10.5, lng: -74.8, name: 'SABANA', type: 'FIX' },
      { lat: 10.8896, lng: -74.7808, name: 'SKBAQ', type: 'VOR' }
    ]
  },
  // BOG - SMR (Bogotá - Santa Marta)
  {
    origin: 'BOG',
    destination: 'SMR',
    distance: 700,
    duration: 100,
    altitude: 34000,
    airway: 'W1',
    waypoints: [
      { lat: 4.7016, lng: -74.1469, name: 'SKBO', type: 'VOR' },
      { lat: 5.5, lng: -74.2, name: 'TUNJA', type: 'WAYPOINT' },
      { lat: 6.5, lng: -74.0, name: 'BUCARAMANGA', type: 'VOR' },
      { lat: 7.5, lng: -73.8, name: 'BARRANCA', type: 'FIX' },
      { lat: 8.5, lng: -74.0, name: 'AGUACHICA', type: 'WAYPOINT' },
      { lat: 9.5, lng: -74.3, name: 'VALLEDUPAR', type: 'VOR' },
      { lat: 10.5, lng: -74.4, name: 'ARACATACA', type: 'WAYPOINT' },
      { lat: 11.1196, lng: -74.2306, name: 'SKSMR', type: 'VOR' }
    ]
  },
  // MDE - CTG (Medellín - Cartagena)
  {
    origin: 'MDE',
    destination: 'CTG',
    distance: 450,
    duration: 75,
    altitude: 30000,
    airway: 'W6',
    waypoints: [
      { lat: 6.1645, lng: -75.4233, name: 'SKMDE', type: 'VOR' },
      { lat: 6.8, lng: -75.2, name: 'CAUCASIA', type: 'WAYPOINT' },
      { lat: 7.5, lng: -75.0, name: 'MONTERIA', type: 'VOR' },
      { lat: 8.2, lng: -75.1, name: 'CERETE', type: 'FIX' },
      { lat: 9.0, lng: -75.3, name: 'SINCELEJO', type: 'WAYPOINT' },
      { lat: 9.8, lng: -75.4, name: 'TURBACO', type: 'WAYPOINT' },
      { lat: 10.4424, lng: -75.5130, name: 'SKCTG', type: 'VOR' }
    ]
  },
  // CLO - CTG (Cali - Cartagena)
  {
    origin: 'CLO',
    destination: 'CTG',
    distance: 680,
    duration: 95,
    altitude: 33000,
    airway: 'W7',
    waypoints: [
      { lat: 3.5432, lng: -76.3816, name: 'SKCLO', type: 'VOR' },
      { lat: 4.5, lng: -76.0, name: 'CARTAGO', type: 'WAYPOINT' },
      { lat: 5.5, lng: -75.7, name: 'MANIZALES', type: 'VOR' },
      { lat: 6.5, lng: -75.5, name: 'MEDELLIN', type: 'FIX' },
      { lat: 7.5, lng: -75.3, name: 'MONTERIA', type: 'VOR' },
      { lat: 8.5, lng: -75.4, name: 'CERETE', type: 'WAYPOINT' },
      { lat: 9.5, lng: -75.5, name: 'SINCELEJO', type: 'WAYPOINT' },
      { lat: 10.4424, lng: -75.5130, name: 'SKCTG', type: 'VOR' }
    ]
  },
  // BOG - BGA (Bogotá - Bucaramanga)
  {
    origin: 'BOG',
    destination: 'BGA',
    distance: 280,
    duration: 55,
    altitude: 24000,
    airway: 'W8',
    waypoints: [
      { lat: 4.7016, lng: -74.1469, name: 'SKBO', type: 'VOR' },
      { lat: 5.0, lng: -74.0, name: 'ZIPAQUIRA', type: 'WAYPOINT' },
      { lat: 5.5, lng: -73.8, name: 'TUNJA', type: 'VOR' },
      { lat: 6.0, lng: -73.5, name: 'SOCORRO', type: 'FIX' },
      { lat: 6.5, lng: -73.3, name: 'GIRON', type: 'WAYPOINT' },
      { lat: 7.1265, lng: -73.1848, name: 'SKBGA', type: 'VOR' }
    ]
  },
  // BOG - PEI (Bogotá - Pereira)
  {
    origin: 'BOG',
    destination: 'PEI',
    distance: 230,
    duration: 50,
    altitude: 23000,
    airway: 'W9',
    waypoints: [
      { lat: 4.7016, lng: -74.1469, name: 'SKBO', type: 'VOR' },
      { lat: 4.6, lng: -74.5, name: 'FACATATIVA', type: 'WAYPOINT' },
      { lat: 4.5, lng: -75.0, name: 'GIRARDOT', type: 'VOR' },
      { lat: 4.6, lng: -75.4, name: 'IBAGUE', type: 'FIX' },
      { lat: 4.7, lng: -75.6, name: 'ARMENIA', type: 'WAYPOINT' },
      { lat: 4.8126, lng: -75.7395, name: 'SKPEI', type: 'VOR' }
    ]
  }
];

// Función para obtener la ruta entre dos aeropuertos
export function getFlightRoute(origin: string, destination: string): FlightRoute | null {
  // Buscar ruta directa
  let route = FLIGHT_ROUTES.find(
    r => r.origin === origin && r.destination === destination
  );
  
  // Si no existe, buscar ruta inversa
  if (!route) {
    const reverseRoute = FLIGHT_ROUTES.find(
      r => r.origin === destination && r.destination === origin
    );
    
    if (reverseRoute) {
      // Invertir la ruta
      route = {
        ...reverseRoute,
        origin: destination,
        destination: origin,
        waypoints: [...reverseRoute.waypoints].reverse()
      };
    }
  }
  
  return route || null;
}

// Información adicional sobre tipos de waypoints
export const WAYPOINT_INFO = {
  VOR: {
    name: 'VOR',
    description: 'VHF Omnidirectional Range - Radioayuda de navegación',
    color: '#0ea5e9'
  },
  NDB: {
    name: 'NDB',
    description: 'Non-Directional Beacon - Radiofaro no direccional',
    color: '#8b5cf6'
  },
  FIX: {
    name: 'FIX',
    description: 'Punto de referencia fijo en el espacio',
    color: '#f59e0b'
  },
  WAYPOINT: {
    name: 'WAYPOINT',
    description: 'Punto de navegación en la ruta',
    color: '#10b981'
  }
};
