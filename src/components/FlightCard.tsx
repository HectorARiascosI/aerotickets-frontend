import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flight, upsertFlightForReservation } from "@/services/flightService";
import { createReservation, getOccupiedSeats, hasUserReservedFlight } from "@/services/reservationService";
import { createCheckoutSession } from "@/services/paymentService";
import { statusColors, statusLabel } from "@/utils/flightColors";
import Modal from "@/components/ui/Modal";
import SeatSelector from "@/components/SeatSelector";
import AircraftInfo from "@/components/AircraftInfo";
import toast from "react-hot-toast";
import { FaPlane, FaClock, FaMapMarkerAlt, FaCalendarAlt, FaDoorOpen, FaSuitcase, FaChair } from "react-icons/fa";

type Props = { flight: Flight };

function FlightCard({ flight }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [occupiedSeats, setOccupiedSeats] = useState<string[]>([]);
  const [loadingSeats, setLoadingSeats] = useState(false);

  useEffect(() => {
    if (open && (flight as any).id) {
      setLoadingSeats(true);
      getOccupiedSeats((flight as any).id)
        .then(setOccupiedSeats)
        .catch((e) => {
          console.error("Error loading occupied seats:", e);
          toast.error("No se pudieron cargar los asientos ocupados");
        })
        .finally(() => setLoadingSeats(false));
    }
  }, [open, flight]);

  const airline = flight.airline || "Desconocida";
  const flightNumber = flight.flightNumber || "—";
  const origin = flight.origin || "—";
  const destination = flight.destination || "—";
  const terminal = flight.terminal || "—";
  const gate = flight.gate || "—";
  const belt = flight.baggageBelt || "—";
  const aircraftType = flight.aircraftType || "—";

  const depTime = flight.departureAt
    ? new Date(flight.departureAt).toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";
  const arrTime = flight.arrivalAt
    ? new Date(flight.arrivalAt).toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  const color = statusColors[flight.status || "SCHEDULED"] || "bg-gray-400";

  async function confirmReservation() {
    if (loading) return;

    if (!selectedSeat) {
      toast.error("Por favor selecciona un asiento");
      return;
    }

    setLoading(true);
    try {
      let flightId = (flight as any).id as number | undefined;
      if (!flightId) {
        flightId = await upsertFlightForReservation(flight);
      }

      const resp = await createReservation({
        flightId,
        seatNumber: selectedSeat,
        seats: 1,
      });

      const seatShown = resp?.seatNumber ?? selectedSeat;

      toast.success(
        `Reserva creada: ${airline} ${flightNumber} – Asiento ${seatShown}`
      );

      setOpen(false);
      setSelectedSeat(null);

      const session = await createCheckoutSession(flightId);
      if (session.url) {
        window.location.href = session.url;
      } else {
        toast.error("Stripe no devolvió una URL de pago.");
      }
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Error inesperado en el servidor";
      toast.error(msg);
      console.error("createReservation or payment error:", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <motion.div
        layout
        className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all p-6 flex flex-col justify-between min-h-[260px]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {airline}{" "}
              <span className="text-gray-500 text-sm">{flightNumber}</span>
            </h2>
            <p className="text-xs text-gray-500">{aircraftType}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${color}`}
          >
            {statusLabel(flight.status || "SCHEDULED")}
          </span>
        </div>

        <div className="flex justify-between text-sm border-y py-3 mb-3">
          <div className="text-left">
            <p className="text-gray-500">Origen</p>
            <p className="font-semibold text-gray-800">{origin}</p>
            <p className="text-gray-500 text-xs">{depTime}</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-xs text-gray-500 mb-1">Ruta</p>
            <p
              className={`text-xs ${
                flight.delayMinutes && flight.delayMinutes > 0
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {flight.delayMinutes && flight.delayMinutes > 0
                ? `Retraso ${flight.delayMinutes} min`
                : "A tiempo"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-500">Destino</p>
            <p className="font-semibold text-gray-800">{destination}</p>
            <p className="text-gray-500 text-xs">{arrTime}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 text-xs text-gray-500 gap-1 mb-2">
          <p>Terminal: {terminal}</p>
          <p>Puerta: {gate}</p>
          <p>Cinta: {belt}</p>
        </div>

        <div className="flex justify-between items-center mt-2">
          {typeof flight.price === "number" ? (
            <p className="text-base font-semibold text-emerald-700">
              ${flight.price.toLocaleString("es-CO")}
            </p>
          ) : (
            <span className="text-gray-400 text-sm">Sin precio</span>
          )}

          <button
            onClick={async () => {
              // Verificar si el usuario ya tiene este vuelo reservado
              if ((flight as any).id) {
                const alreadyReserved = await hasUserReservedFlight((flight as any).id);
                if (alreadyReserved) {
                  toast.error("Ya has reservado este vuelo anteriormente. No puedes volver a comprarlo.");
                  return;
                }
              }
              setOpen(true);
            }}
            className="px-5 py-2 rounded-md bg-emerald-600 text-white text-sm hover:bg-emerald-700 transition"
          >
            Reservar
          </button>
        </div>
      </motion.div>

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedSeat(null);
        }}
        title={`Reserva tu vuelo ${airline} ${flightNumber}`}
      >
        <div className="space-y-6">
          {/* Info del vuelo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-4 border-2 border-primary-200"
          >
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-primary-500" />
                <div>
                  <p className="text-xs text-gray-600">Ruta</p>
                  <p className="font-semibold text-gray-800">{origin} → {destination}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FaClock className="text-accent-500" />
                <div>
                  <p className="text-xs text-gray-600">Horario</p>
                  <p className="font-semibold text-gray-800">{depTime} - {arrTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FaPlane className="text-success" />
                <div>
                  <p className="text-xs text-gray-600">Aeronave</p>
                  <p className="font-semibold text-gray-800">{aircraftType}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FaDoorOpen className="text-warning" />
                <div>
                  <p className="text-xs text-gray-600">Puerta</p>
                  <p className="font-semibold text-gray-800">{gate}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Selector de asientos */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <FaChair className="text-primary-500" />
              Selecciona tu asiento
            </h3>
            {loadingSeats ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Cargando asientos disponibles...</p>
              </div>
            ) : (
              <SeatSelector
                selectedSeat={selectedSeat}
                onSelectSeat={setSelectedSeat}
                occupiedSeats={occupiedSeats}
              />
            )}
          </div>

          {/* Información de la aeronave */}
          <AircraftInfo aircraftType={aircraftType} airline={airline} />

          {/* Precio y botones */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Total a pagar:</span>
              <span className="text-2xl font-bold gradient-text">
                {typeof flight.price === "number"
                  ? `$${flight.price.toLocaleString("es-CO")}`
                  : "Sin precio"}
              </span>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setOpen(false);
                  setSelectedSeat(null);
                }}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all"
                disabled={loading}
              >
                Cancelar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={confirmReservation}
                disabled={loading || !selectedSeat}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-hero text-white font-semibold hover:shadow-glow disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                {loading ? "Procesando..." : "Confirmar y pagar"}
              </motion.button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default FlightCard;