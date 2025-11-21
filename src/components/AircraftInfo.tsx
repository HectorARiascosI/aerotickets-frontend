import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FaPlane, FaRuler, FaClock, FaUsers, FaGasPump, FaChevronDown, FaChevronUp, FaInfoCircle } from "react-icons/fa";
import { getAircraftInfo, getAirlineInfo } from "@/data/airlines";

interface AircraftInfoProps {
  aircraftType: string;
  airline: string;
}

export default function AircraftInfo({ aircraftType, airline }: AircraftInfoProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const aircraftInfo = getAircraftInfo(aircraftType);
  const airlineInfo = getAirlineInfo(airline);

  if (!aircraftInfo) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6"
    >
      <div className="glass-effect rounded-2xl shadow-soft overflow-hidden">
        {/* Header con imagen */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary-500 to-accent-500">
          <img
            src={aircraftInfo.imageUrl}
            alt={aircraftInfo.model}
            className="w-full h-full object-cover opacity-80"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          {/* Info superpuesta */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-3 mb-2">
              {airlineInfo && (
                <div 
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ 
                    backgroundColor: airlineInfo.colors.primary,
                    color: airlineInfo.colors.secondary 
                  }}
                >
                  {airlineInfo.name}
                </div>
              )}
              <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
                {aircraftInfo.manufacturer}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <FaPlane />
              {aircraftInfo.model}
            </h3>
          </div>
        </div>

        {/* Especificaciones rápidas */}
        <div className="p-4 bg-white">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <FaUsers className="text-2xl text-primary-500 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Capacidad</p>
              <p className="font-bold text-gray-800">{aircraftInfo.capacity} pax</p>
            </div>
            
            <div className="text-center">
              <FaRuler className="text-2xl text-success mx-auto mb-1" />
              <p className="text-xs text-gray-600">Alcance</p>
              <p className="font-bold text-gray-800">{aircraftInfo.range.toLocaleString()} km</p>
            </div>
            
            <div className="text-center">
              <FaClock className="text-2xl text-warning mx-auto mb-1" />
              <p className="text-xs text-gray-600">Velocidad</p>
              <p className="font-bold text-gray-800">{aircraftInfo.cruiseSpeed} km/h</p>
            </div>
            
            <div className="text-center">
              <FaGasPump className="text-2xl text-accent-500 mx-auto mb-1" />
              <p className="text-xs text-gray-600">Primer vuelo</p>
              <p className="font-bold text-gray-800">{aircraftInfo.firstFlight}</p>
            </div>
          </div>

          {/* Botón expandir */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-center gap-2 py-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            <FaInfoCircle />
            {isExpanded ? 'Ocultar detalles' : 'Ver más información'}
            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>

        {/* Información expandida */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-6 bg-gray-50 border-t space-y-6">
                {/* Historia */}
                <div>
                  <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                    📖 Historia
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {aircraftInfo.history}
                  </p>
                </div>

                {/* Especificaciones técnicas */}
                <div>
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    🔧 Especificaciones Técnicas
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-gray-600">Motores</p>
                      <p className="font-semibold text-gray-800">{aircraftInfo.engines}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-gray-600">Envergadura</p>
                      <p className="font-semibold text-gray-800">{aircraftInfo.wingspan}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-gray-600">Longitud</p>
                      <p className="font-semibold text-gray-800">{aircraftInfo.length}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-gray-600">Velocidad de crucero</p>
                      <p className="font-semibold text-gray-800">{aircraftInfo.cruiseSpeed} km/h</p>
                    </div>
                  </div>
                </div>

                {/* Datos curiosos */}
                <div>
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    ✨ Datos Curiosos
                  </h4>
                  <ul className="space-y-2">
                    {aircraftInfo.interestingFacts.map((fact, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-2 text-sm text-gray-700"
                      >
                        <span className="text-primary-500 mt-1">•</span>
                        <span>{fact}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Información de la aerolínea */}
                {airlineInfo && (
                  <div className="border-t pt-4">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      ✈️ Sobre {airlineInfo.name}
                    </h4>
                    <div className="bg-white rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                        <div>
                          <p className="text-xs text-gray-600">Fundada</p>
                          <p className="font-semibold text-gray-800">{airlineInfo.founded}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Sede</p>
                          <p className="font-semibold text-gray-800">{airlineInfo.headquarters}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {airlineInfo.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
