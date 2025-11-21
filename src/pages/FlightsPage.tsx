import React, { useEffect, useMemo, useState } from "react";
import { searchFlights, Flight, autocompleteAirports } from "../services/flightService";
import { FlightStream } from "../services/flightStream";
import FlightCard from "../components/FlightCard";
import FlightRouteMap from "../components/FlightRouteMap";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FaPlane, FaSearch, FaCalendarAlt, FaMap } from "react-icons/fa";

type AirportOption = { iata: string; city: string; label: string };

export default function FlightsPage() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);

  const [origOptions, setOrigOptions] = useState<AirportOption[]>([]);
  const [destOptions, setDestOptions] = useState<AirportOption[]>([]);
  const [showOrig, setShowOrig] = useState(false);
  const [showDest, setShowDest] = useState(false);

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

  const debounce = (fn: (...args: any[]) => void, ms = 250) => {
    let timer: any;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), ms);
    };
  };

  const loadOrig = useMemo(
    () => debounce(async (q: string) => setOrigOptions(await autocompleteAirports(q))),
    []
  );
  const loadDest = useMemo(
    () => debounce(async (q: string) => setDestOptions(await autocompleteAirports(q))),
    []
  );

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
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaPlane className="inline mr-2 text-primary-500" />
                Origen
              </label>
              <input
                type="text"
                placeholder="Ej: Bogotá o BOG"
                value={origin}
                onChange={(e) => {
                  setOrigin(e.target.value);
                  setShowOrig(true);
                  loadOrig(e.target.value);
                }}
                onFocus={() => setShowOrig(true)}
                className="w-full border-2 border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
              {showOrig && origOptions.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bg-white border-2 border-primary-200 rounded-xl w-full mt-2 shadow-lg max-h-52 overflow-auto z-20"
                  onMouseLeave={() => setShowOrig(false)}
                >
                  {origOptions.map((o) => (
                    <li
                      key={o.iata}
                      className="px-4 py-3 text-sm hover:bg-primary-50 cursor-pointer transition-colors border-b last:border-b-0"
                      onClick={() => {
                        setOrigin(o.iata);
                        setShowOrig(false);
                      }}
                    >
                      <span className="font-semibold text-primary-600">{o.iata}</span>
                      <span className="text-gray-600"> - {o.city}</span>
                    </li>
                  ))}
                </motion.ul>
              )}
            </div>

            {/* Destino */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaPlane className="inline mr-2 text-accent-500 rotate-90" />
                Destino
              </label>
              <input
                type="text"
                placeholder="Ej: Medellín o MDE"
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value);
                  setShowDest(true);
                  loadDest(e.target.value);
                }}
                onFocus={() => setShowDest(true)}
                className="w-full border-2 border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
              />
              {showDest && destOptions.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bg-white border-2 border-accent-200 rounded-xl w-full mt-2 shadow-lg max-h-52 overflow-auto z-20"
                  onMouseLeave={() => setShowDest(false)}
                >
                  {destOptions.map((o) => (
                    <li
                      key={o.iata}
                      className="px-4 py-3 text-sm hover:bg-accent-50 cursor-pointer transition-colors border-b last:border-b-0"
                      onClick={() => {
                        setDestination(o.iata);
                        setShowDest(false);
                      }}
                    >
                      <span className="font-semibold text-accent-600">{o.iata}</span>
                      <span className="text-gray-600"> - {o.city}</span>
                    </li>
                  ))}
                </motion.ul>
              )}
            </div>

            {/* Fecha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaCalendarAlt className="inline mr-2 text-success" />
                Fecha de viaje
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border-2 border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-success focus:border-transparent transition-all"
              />
            </div>

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