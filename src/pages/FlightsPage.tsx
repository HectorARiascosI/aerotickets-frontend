import { useEffect, useState } from "react";
import { searchFlights, Flight } from "../services/flightService";
import { FlightStream } from "../services/flightStream";
import FlightCard from "../components/FlightCard";
import FlightRouteMap from "../components/FlightRouteMap";
import AirportSelector from "../components/AirportSelector";
import DateSelector from "../components/DateSelector";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FaPlane, FaSearch, FaMap } from "react-icons/fa";

// Claves para localStorage
const STORAGE_KEYS = {
  ORIGIN: 'flights_search_origin',
  DESTINATION: 'flights_search_destination',
  DATE: 'flights_search_date',
  FLIGHTS: 'flights_search_results',
};

export default function FlightsPage() {
  // Recuperar estado del localStorage
  const [origin, setOrigin] = useState(() => localStorage.getItem(STORAGE_KEYS.ORIGIN) || "");
  const [destination, setDestination] = useState(() => localStorage.getItem(STORAGE_KEYS.DESTINATION) || "");
  const [date, setDate] = useState(() => {
    const savedDate = localStorage.getItem(STORAGE_KEYS.DATE);
    const today = new Date().toISOString().split("T")[0];
    // Si la fecha guardada es anterior a hoy, usar hoy
    if (savedDate && savedDate >= today) {
      return savedDate;
    }
    return today;
  });
  const [flights, setFlights] = useState<Flight[]>(() => {
    const savedFlights = localStorage.getItem(STORAGE_KEYS.FLIGHTS);
    return savedFlights ? JSON.parse(savedFlights) : [];
  });
  const [loading, setLoading] = useState(false);

  // Guardar en localStorage cuando cambien los valores
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORIGIN, origin);
  }, [origin]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DESTINATION, destination);
  }, [destination]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DATE, date);
  }, [date]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FLIGHTS, JSON.stringify(flights));
  }, [flights]);

  useEffect(() => {
    const stream = new FlightStream();
    stream.connect((updated) => {
      setFlights((prev) => {
        const idx = prev.findIndex(
          (f) =>
            f.flightNumber === updated.flightNumber &&
            f.origin === updated.origin &&
            f.destination === updated.destination
        );
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], ...updated };
          return next;
        }
        return [...prev, updated];
      });
    });
    return () => stream.disconnect();
  }, []);

  async function handleSearch() {
    if (!origin || !destination) {
      toast.error("Selecciona un origen y un destino válidos.");
      return;
    }

    setLoading(true);
    try {
      const list = await searchFlights(origin, destination, date);
      setFlights(list);
      if (list.length === 0) {
        toast("No se encontraron vuelos para esos datos.");
      }
    } catch (e: any) {
      toast.error(e?.message ?? "No fue posible buscar los vuelos");
    } finally {
      setLoading(false);
    }
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header con animación */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <FaPlane className="text-4xl sm:text-5xl text-primary-500" />
            </motion.div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-3">
            Encuentra tu vuelo perfecto
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Busca y reserva vuelos en tiempo real con las mejores aerolíneas
          </p>
        </motion.div>

        {/* Formulario de búsqueda mejorado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-effect rounded-2xl shadow-soft p-4 sm:p-8 mb-8 sm:mb-12"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Origen */}
            <AirportSelector
              value={origin}
              onChange={setOrigin}
              placeholder="Ej: Bogotá o BOG"
              label="Origen"
              icon={<FaPlane className="inline mr-2 text-primary-500" />}
            />

            {/* Destino */}
            <AirportSelector
              value={destination}
              onChange={setDestination}
              placeholder="Ej: Medellín o MDE"
              label="Destino"
              icon={<FaPlane className="inline mr-2 text-accent-500 rotate-90" />}
            />

            {/* Fecha */}
            <DateSelector
              value={date}
              onChange={setDate}
              label="Fecha de viaje"
            />

            {/* Botón de búsqueda */}
            <div className="flex items-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSearch}
                disabled={loading}
                className="w-full bg-gradient-hero text-white font-semibold rounded-xl px-6 py-3 hover:shadow-glow transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <FaSearch />
                    </motion.div>
                    Buscando...
                  </>
                ) : (
                  <>
                    <FaSearch />
                    Buscar vuelos
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Contenedor principal con mapa y resultados */}
        {origin && destination && flights.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Columna de resultados (2/3 del espacio) */}
            <div className="xl:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FaPlane className="text-primary-500" />
                Vuelos disponibles ({flights.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {flights.map((f, index) => (
                  <motion.div
                    key={`${f.flightNumber}-${f.origin}-${f.departureAt}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <FlightCard flight={f} />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Columna del mapa (1/3 del espacio, sticky) */}
            <div className="xl:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="sticky top-24"
              >
                <div className="glass-effect rounded-2xl shadow-soft p-4">
                  <h2 className="text-lg font-bold gradient-text mb-3 flex items-center gap-2">
                    <FaMap />
                    Ruta: {origin} → {destination}
                  </h2>
                  <FlightRouteMap origin={origin} destination={destination} className="h-[600px]" />
                </div>
              </motion.div>
            </div>
          </div>
        ) : origin && destination && !loading ? (
          /* Mapa a pantalla completa cuando no hay resultados */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="glass-effect rounded-2xl shadow-soft p-6">
              <h2 className="text-2xl font-bold gradient-text mb-4 flex items-center gap-2">
                <FaMap />
                Ruta de vuelo: {origin} → {destination}
              </h2>
              <FlightRouteMap origin={origin} destination={destination} className="h-[500px]" />
            </div>
          </motion.div>
        ) : null}

        {/* Estado vacío cuando no hay búsqueda */}
        {!loading && flights.length === 0 && !origin && !destination && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <FaPlane className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500 mb-2">Busca vuelos para comenzar</p>
            <p className="text-gray-400">Selecciona origen, destino y fecha</p>
          </motion.div>
        )}

        {/* Estado vacío cuando hay búsqueda pero sin resultados */}
        {!loading && flights.length === 0 && origin && destination && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <FaPlane className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500 mb-2">No hay vuelos disponibles</p>
            <p className="text-gray-400">Intenta con otros criterios de búsqueda</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}