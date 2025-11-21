import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { COLOMBIA_AIRPORTS, COLOMBIA_CENTER } from "@/data/airports";
import { getFlightRoute, WAYPOINT_INFO } from "@/data/flightRoutes";
import { FaPlane, FaMapMarkerAlt, FaRoute, FaClock, FaRuler, FaMountain } from "react-icons/fa";

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
  const flightRoute = getFlightRoute(origin, destination);

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

  // Coordenadas de la ruta (usar waypoints si existen, sino línea directa)
  const routeCoordinates: [number, number][] = flightRoute
    ? flightRoute.waypoints.map(wp => [wp.lat, wp.lng])
    : [
        [originAirport.lat, originAirport.lng],
        [destAirport.lat, destAirport.lng],
      ];

  return (
    <div className={`relative ${className}`}>
      <MapContainer
        center={[COLOMBIA_CENTER.lat, COLOMBIA_CENTER.lng]}
        zoom={6}
        className="w-full h-full rounded-xl shadow-lg z-0"
        style={{ minHeight: "500px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marcador de origen */}
        <Marker position={[originAirport.lat, originAirport.lng]} icon={originIcon}>
          <Popup>
            <div className="min-w-[200px]">
              <p className="font-bold text-green-600 text-lg mb-2">✈️ ORIGEN</p>
              <p className="font-semibold text-base">{originAirport.city}</p>
              <p className="text-sm text-gray-600 mb-1">{originAirport.name}</p>
              <p className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">{origin}</p>
              <p className="text-xs text-gray-500 mt-2">
                📍 {originAirport.lat.toFixed(4)}°, {originAirport.lng.toFixed(4)}°
              </p>
            </div>
          </Popup>
        </Marker>

        {/* Marcador de destino */}
        <Marker position={[destAirport.lat, destAirport.lng]} icon={destIcon}>
          <Popup>
            <div className="min-w-[200px]">
              <p className="font-bold text-red-600 text-lg mb-2">📍 DESTINO</p>
              <p className="font-semibold text-base">{destAirport.city}</p>
              <p className="text-sm text-gray-600 mb-1">{destAirport.name}</p>
              <p className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">{destination}</p>
              <p className="text-xs text-gray-500 mt-2">
                📍 {destAirport.lat.toFixed(4)}°, {destAirport.lng.toFixed(4)}°
              </p>
            </div>
          </Popup>
        </Marker>

        {/* Waypoints (puntos de navegación) */}
        {flightRoute && flightRoute.waypoints.slice(1, -1).map((waypoint, index) => {
          const waypointInfo = waypoint.type ? WAYPOINT_INFO[waypoint.type] : null;
          return (
            <CircleMarker
              key={index}
              center={[waypoint.lat, waypoint.lng]}
              radius={6}
              fillColor={waypointInfo?.color || '#6b7280'}
              color="white"
              weight={2}
              opacity={1}
              fillOpacity={0.8}
            >
              <Popup>
                <div className="min-w-[180px]">
                  <p className="font-bold text-primary-600 mb-1">
                    {waypointInfo?.name || 'WAYPOINT'}
                  </p>
                  <p className="font-semibold">{waypoint.name}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {waypointInfo?.description || 'Punto de navegación'}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    📍 {waypoint.lat.toFixed(4)}°, {waypoint.lng.toFixed(4)}°
                  </p>
                  <p className="text-xs text-gray-500">
                    Punto #{index + 1} de {flightRoute.waypoints.length - 2}
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

        {/* Línea de ruta aerovía real */}
        <Polyline
          positions={routeCoordinates}
          color="#0ea5e9"
          weight={4}
          opacity={0.9}
          dashArray={flightRoute ? undefined : "10, 10"}
        />

        {/* Línea de referencia directa (punteada) */}
        {flightRoute && (
          <Polyline
            positions={[
              [originAirport.lat, originAirport.lng],
              [destAirport.lat, destAirport.lng],
            ]}
            color="#94a3b8"
            weight={2}
            opacity={0.4}
            dashArray="5, 10"
          />
        )}

        {/* Ajustar zoom automáticamente */}
        <FitBounds origin={origin} destination={destination} />
      </MapContainer>

      {/* Panel de información detallada */}
      <div className="absolute top-4 right-4 bg-white rounded-xl shadow-xl p-4 z-10 max-w-xs">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <FaRoute className="text-primary-500" />
          Información de Vuelo
        </h3>
        
        {flightRoute ? (
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <FaPlane className="text-primary-500" />
              <span className="font-semibold">Aerovía:</span>
              <span className="font-mono bg-primary-50 px-2 py-0.5 rounded">{flightRoute.airway}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <FaRuler className="text-success" />
              <span className="font-semibold">Distancia:</span>
              <span>{flightRoute.distance} km</span>
            </div>
            
            <div className="flex items-center gap-2">
              <FaClock className="text-warning" />
              <span className="font-semibold">Duración:</span>
              <span>{flightRoute.duration} min</span>
            </div>
            
            <div className="flex items-center gap-2">
              <FaMountain className="text-accent-500" />
              <span className="font-semibold">Altitud:</span>
              <span>{flightRoute.altitude.toLocaleString()} ft</span>
            </div>
            
            <div className="border-t pt-2 mt-2">
              <p className="text-xs text-gray-600 mb-1">Waypoints en ruta:</p>
              <p className="font-semibold text-primary-600">{flightRoute.waypoints.length} puntos</p>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-600">
            <p className="mb-2">Ruta directa estimada</p>
            <p className="text-xs">No hay aerovía específica registrada para esta ruta</p>
          </div>
        )}
      </div>

      {/* Leyenda mejorada */}
      <div className="absolute bottom-4 left-4 bg-white rounded-xl shadow-xl p-4 z-10">
        <h4 className="font-bold text-gray-800 mb-3 text-sm">Leyenda</h4>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow"></div>
            <span className="text-xs font-medium">Aeropuerto Origen</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-red-500 rounded-full border-2 border-white shadow"></div>
            <span className="text-xs font-medium">Aeropuerto Destino</span>
          </div>
          
          {flightRoute && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary-500 rounded-full border border-white"></div>
                <span className="text-xs">VOR (Radioayuda)</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-success rounded-full border border-white"></div>
                <span className="text-xs">Waypoint</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-warning rounded-full border border-white"></div>
                <span className="text-xs">FIX (Punto fijo)</span>
              </div>
              
              <div className="border-t pt-2 mt-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-0.5 bg-primary-500"></div>
                  <span className="text-xs">Ruta aérea real</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-gray-400" style={{ borderTop: '2px dashed' }}></div>
                  <span className="text-xs">Distancia directa</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
