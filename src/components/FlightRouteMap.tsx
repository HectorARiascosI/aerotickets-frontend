import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { COLOMBIA_AIRPORTS, COLOMBIA_CENTER } from "@/data/airports";
import { FaPlane, FaMapMarkerAlt } from "react-icons/fa";

// Fix para los iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface FlightRouteMapProps {
  origin: string;
  destination: string;
  className?: string;
}

// Componente para ajustar el zoom automáticamente
function FitBounds({ origin, destination }: { origin: string; destination: string }) {
  const map = useMap();

  useEffect(() => {
    const originCoords = COLOMBIA_AIRPORTS[origin];
    const destCoords = COLOMBIA_AIRPORTS[destination];

    if (originCoords && destCoords) {
      const bounds = L.latLngBounds(
        [originCoords.lat, originCoords.lng],
        [destCoords.lat, destCoords.lng]
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [origin, destination, map]);

  return null;
}

export default function FlightRouteMap({ origin, destination, className = "" }: FlightRouteMapProps) {
  const originAirport = COLOMBIA_AIRPORTS[origin];
  const destAirport = COLOMBIA_AIRPORTS[destination];

  // Si no se encuentran los aeropuertos, no mostrar el mapa
  if (!originAirport || !destAirport) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-xl p-8 ${className}`}>
        <div className="text-center text-gray-500">
          <FaMapMarkerAlt className="text-4xl mx-auto mb-2" />
          <p>Selecciona origen y destino para ver la ruta</p>
        </div>
      </div>
    );
  }

  // Crear iconos personalizados
  const originIcon = L.divIcon({
    html: `<div style="background: #10b981; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); font-size: 16px;">✈</div>`,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  const destIcon = L.divIcon({
    html: `<div style="background: #ef4444; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); font-size: 16px;">📍</div>`,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  // Coordenadas de la ruta
  const routeCoordinates: [number, number][] = [
    [originAirport.lat, originAirport.lng],
    [destAirport.lat, destAirport.lng],
  ];

  return (
    <div className={`relative ${className}`}>
      <MapContainer
        center={[COLOMBIA_CENTER.lat, COLOMBIA_CENTER.lng]}
        zoom={6}
        className="w-full h-full rounded-xl shadow-lg z-0"
        style={{ minHeight: "400px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marcador de origen */}
        <Marker position={[originAirport.lat, originAirport.lng]} icon={originIcon}>
          <Popup>
            <div className="text-center">
              <p className="font-bold text-green-600">Origen</p>
              <p className="font-semibold">{originAirport.city}</p>
              <p className="text-xs text-gray-600">{originAirport.name}</p>
              <p className="text-xs font-mono">{origin}</p>
            </div>
          </Popup>
        </Marker>

        {/* Marcador de destino */}
        <Marker position={[destAirport.lat, destAirport.lng]} icon={destIcon}>
          <Popup>
            <div className="text-center">
              <p className="font-bold text-red-600">Destino</p>
              <p className="font-semibold">{destAirport.city}</p>
              <p className="text-xs text-gray-600">{destAirport.name}</p>
              <p className="text-xs font-mono">{destination}</p>
            </div>
          </Popup>
        </Marker>

        {/* Línea de ruta */}
        <Polyline
          positions={routeCoordinates}
          color="#0ea5e9"
          weight={3}
          opacity={0.8}
          dashArray="10, 10"
        />

        {/* Ajustar zoom automáticamente */}
        <FitBounds origin={origin} destination={destination} />
      </MapContainer>

      {/* Leyenda */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          <span className="text-xs font-medium">Origen: {originAirport.city}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
          <span className="text-xs font-medium">Destino: {destAirport.city}</span>
        </div>
      </div>
    </div>
  );
}
