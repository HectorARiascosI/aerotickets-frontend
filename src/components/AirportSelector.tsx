import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaChevronDown, FaPlane } from "react-icons/fa";
import { COLOMBIA_AIRPORTS } from "@/data/airports";

interface AirportSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  icon: React.ReactNode;
  onSearch?: (query: string) => void;
}

export default function AirportSelector({
  value,
  onChange,
  placeholder,
  label,
  icon,
  onSearch,
}: AirportSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Obtener todas las ciudades
  const allAirports = Object.entries(COLOMBIA_AIRPORTS).map(([code, info]) => ({
    code,
    ...info,
  }));

  // Filtrar aeropuertos según búsqueda
  const filteredAirports = searchTerm
    ? allAirports.filter(
        (airport) =>
          airport.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          airport.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          airport.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allAirports;

  // Obtener el aeropuerto seleccionado
  const selectedAirport = value ? COLOMBIA_AIRPORTS[value] : null;

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (code: string) => {
    onChange(code);
    setSearchTerm("");
    setIsOpen(false);
    if (onSearch) onSearch(code);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setSearchTerm("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setIsOpen(true);
    
    // Si el usuario escribe un código válido directamente
    const upperValue = newValue.toUpperCase();
    if (COLOMBIA_AIRPORTS[upperValue]) {
      onChange(upperValue);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {icon}
        {label}
      </label>

      <div className="relative">
        <input
          type="text"
          value={selectedAirport ? `${selectedAirport.city} (${value})` : searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full border-2 border-gray-200 p-3 pr-20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        />

        {/* Botones de acción */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {(value || searchTerm) && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={handleClear}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              type="button"
            >
              <FaTimes className="text-gray-400 hover:text-gray-600" />
            </motion.button>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            type="button"
          >
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <FaChevronDown className="text-gray-400" />
            </motion.div>
          </button>
        </div>
      </div>

      {/* Dropdown de aeropuertos */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-30 w-full mt-2 bg-white border-2 border-primary-200 rounded-xl shadow-xl max-h-80 overflow-y-auto"
          >
            {filteredAirports.length > 0 ? (
              <div className="p-2">
                {filteredAirports.map((airport) => (
                  <motion.button
                    key={airport.code}
                    whileHover={{ scale: 1.02, x: 4 }}
                    onClick={() => handleSelect(airport.code)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      value === airport.code
                        ? "bg-primary-50 border-2 border-primary-300"
                        : "hover:bg-gray-50 border-2 border-transparent"
                    }`}
                    type="button"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-hero rounded-full flex items-center justify-center">
                          <FaPlane className="text-white text-sm" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-primary-600">{airport.code}</span>
                          <span className="text-gray-400">•</span>
                          <span className="font-semibold text-gray-800 truncate">
                            {airport.city}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">{airport.name}</p>
                      </div>
                      {value === airport.code && (
                        <div className="flex-shrink-0">
                          <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <FaPlane className="text-4xl mx-auto mb-2 opacity-30" />
                <p>No se encontraron aeropuertos</p>
                <p className="text-sm">Intenta con otra búsqueda</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
