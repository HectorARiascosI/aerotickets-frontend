import { useState } from "react";
import { motion } from "framer-motion";
import { FaChair, FaTimes } from "react-icons/fa";

type SeatStatus = "available" | "occupied" | "selected";

interface Seat {
  id: string;
  row: number;
  column: string;
  status: SeatStatus;
}

interface SeatSelectorProps {
  onSelectSeat: (seatNumber: number | null) => void;
  selectedSeat: number | null;
}

export default function SeatSelector({ onSelectSeat, selectedSeat }: SeatSelectorProps) {
  const rows = 20; // 20 filas
  const columns = ["A", "B", "C", "", "D", "E", "F"]; // Pasillo en el medio
  
  // Generar asientos (algunos ocupados aleatoriamente)
  const [seats] = useState<Seat[]>(() => {
    const allSeats: Seat[] = [];
    for (let row = 1; row <= rows; row++) {
      columns.forEach((col, colIndex) => {
        if (col === "") return; // Pasillo
        
        const seatNumber = row * 10 + colIndex;
        // Simular algunos asientos ocupados (20% de probabilidad)
        const isOccupied = Math.random() < 0.2;
        
        allSeats.push({
          id: `${row}${col}`,
          row,
          column: col,
          status: isOccupied ? "occupied" : "available",
        });
      });
    }
    return allSeats;
  });

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === "occupied") return;
    
    const seatNumber = parseInt(seat.id.replace(/[A-Z]/g, ""));
    
    if (selectedSeat === seatNumber) {
      onSelectSeat(null);
    } else {
      onSelectSeat(seatNumber);
    }
  };

  const getSeatColor = (seat: Seat) => {
    const seatNumber = parseInt(seat.id.replace(/[A-Z]/g, ""));
    
    if (seat.status === "occupied") {
      return "bg-gray-300 cursor-not-allowed";
    }
    if (selectedSeat === seatNumber) {
      return "bg-gradient-hero text-white shadow-glow";
    }
    return "bg-green-100 hover:bg-green-200 cursor-pointer border-2 border-green-300";
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Leyenda */}
      <div className="flex justify-center gap-6 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-100 border-2 border-green-300 rounded"></div>
          <span>Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-hero rounded"></div>
          <span>Seleccionado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-300 rounded"></div>
          <span>Ocupado</span>
        </div>
      </div>

      {/* Cabina del avión */}
      <div className="bg-gradient-to-b from-gray-100 to-white rounded-3xl p-6 shadow-xl border-4 border-gray-200">
        {/* Frente del avión */}
        <div className="text-center mb-4">
          <div className="inline-block bg-gradient-hero text-white px-6 py-2 rounded-full text-sm font-semibold">
            ✈️ Frente del avión
          </div>
        </div>

        {/* Etiquetas de columnas */}
        <div className="flex justify-center gap-2 mb-3 text-xs font-semibold text-gray-600">
          {columns.map((col, idx) => (
            <div key={idx} className="w-8 text-center">
              {col}
            </div>
          ))}
        </div>

        {/* Asientos */}
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
          {Array.from({ length: rows }, (_, rowIndex) => {
            const rowNumber = rowIndex + 1;
            const rowSeats = seats.filter((s) => s.row === rowNumber);

            return (
              <div key={rowNumber} className="flex items-center justify-center gap-2">
                {/* Número de fila */}
                <div className="w-6 text-xs font-semibold text-gray-500 text-right">
                  {rowNumber}
                </div>

                {/* Asientos de la fila */}
                {columns.map((col, colIndex) => {
                  if (col === "") {
                    return <div key={`aisle-${colIndex}`} className="w-4"></div>;
                  }

                  const seat = rowSeats.find((s) => s.column === col);
                  if (!seat) return null;

                  return (
                    <motion.button
                      key={seat.id}
                      whileHover={seat.status !== "occupied" ? { scale: 1.1 } : {}}
                      whileTap={seat.status !== "occupied" ? { scale: 0.95 } : {}}
                      onClick={() => handleSeatClick(seat)}
                      disabled={seat.status === "occupied"}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold transition-all ${getSeatColor(
                        seat
                      )}`}
                      title={`Asiento ${seat.id}`}
                    >
                      {seat.status === "occupied" ? (
                        <FaTimes className="text-gray-500 text-xs" />
                      ) : (
                        <FaChair className="text-xs" />
                      )}
                    </motion.button>
                  );
                })}

                {/* Número de fila (derecha) */}
                <div className="w-6 text-xs font-semibold text-gray-500">
                  {rowNumber}
                </div>
              </div>
            );
          })}
        </div>

        {/* Parte trasera */}
        <div className="text-center mt-4 text-xs text-gray-500">
          Parte trasera
        </div>
      </div>

      {/* Asiento seleccionado */}
      {selectedSeat && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center"
        >
          <div className="inline-block bg-primary-50 border-2 border-primary-300 rounded-lg px-6 py-3">
            <p className="text-sm text-gray-600 mb-1">Asiento seleccionado:</p>
            <p className="text-2xl font-bold gradient-text">
              {seats.find((s) => parseInt(s.id.replace(/[A-Z]/g, "")) === selectedSeat)?.id || selectedSeat}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
