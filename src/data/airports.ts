// Coordenadas de los principales aeropuertos de Colombia
export const COLOMBIA_AIRPORTS: Record<string, { lat: number; lng: number; city: string; name: string }> = {
  BOG: { lat: 4.7016, lng: -74.1469, city: "Bogotá", name: "El Dorado" },
  MDE: { lat: 6.1645, lng: -75.4233, city: "Medellín", name: "José María Córdova" },
  CLO: { lat: 3.5432, lng: -76.3816, city: "Cali", name: "Alfonso Bonilla Aragón" },
  CTG: { lat: 10.4424, lng: -75.5130, city: "Cartagena", name: "Rafael Núñez" },
  BAQ: { lat: 10.8896, lng: -74.7808, city: "Barranquilla", name: "Ernesto Cortissoz" },
  SMR: { lat: 11.1196, lng: -74.2306, city: "Santa Marta", name: "Simón Bolívar" },
  BGA: { lat: 7.1265, lng: -73.1848, city: "Bucaramanga", name: "Palonegro" },
  PEI: { lat: 4.8126, lng: -75.7395, city: "Pereira", name: "Matecaña" },
  ADZ: { lat: 12.5836, lng: -81.7111, city: "San Andrés", name: "Gustavo Rojas Pinilla" },
  CUC: { lat: 7.9279, lng: -72.5115, city: "Cúcuta", name: "Camilo Daza" },
  EOH: { lat: 5.9336, lng: -75.2764, city: "Medellín", name: "Olaya Herrera" },
  AXM: { lat: 4.4528, lng: -75.7664, city: "Armenia", name: "El Edén" },
  MTR: { lat: 8.8244, lng: -75.8258, city: "Montería", name: "Los Garzones" },
  VVC: { lat: 4.1678, lng: -73.6138, city: "Villavicencio", name: "Vanguardia" },
  IBE: { lat: 4.4221, lng: -75.1333, city: "Ibagué", name: "Perales" },
  PPN: { lat: 2.4544, lng: -76.6093, city: "Popayán", name: "Guillermo León Valencia" },
  NVA: { lat: 2.9502, lng: -75.2940, city: "Neiva", name: "Benito Salas" },
  PSO: { lat: 1.3966, lng: -77.2915, city: "Pasto", name: "Antonio Nariño" },
  RCH: { lat: 5.8269, lng: -67.4936, city: "Riohacha", name: "Almirante Padilla" },
  VUP: { lat: 5.0344, lng: -75.4680, city: "Valledupar", name: "Alfonso López Pumarejo" }
};

// Centro de Colombia para el mapa
export const COLOMBIA_CENTER = { lat: 4.5709, lng: -74.2973 };
