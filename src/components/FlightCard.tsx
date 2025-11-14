import React, { useState } from "react";
import { motion } from "framer-motion";
import { Flight, upsertFlightForReservation } from "@/services/flightService";
import { createReservation } from "@/services/reservationService";
import { statusColors, statusLabel } from "@/utils/flightColors";
import Modal from "@/components/ui/Modal";
import toast from "react-hot-toast";

type Props = { flight: Flight };

function FlightCard({ flight }: Props) {
  const [open, setOpen] = useState(false);
  const [seat, setSeat] = useState("");
  const [loading, setLoading] = useState(false);

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

    let seatNum: number | undefined = undefined;
    if (seat.trim().length > 0) {
      const parsed = Number(seat.trim());
      if (!Number.isFinite(parsed) || parsed <= 0) {
        toast.error("Número de asiento inválido.");
        return;
      }
      seatNum = parsed;
    }

    setLoading(true);
    try {
      let flightId = (flight as any).id as number | undefined;
      if (!flightId) {
        flightId = await upsertFlightForReservation(flight);
      }

      const resp = await createReservation({
        flightId,
        seatNumber: seatNum,
        seats: 1,
      });

      const seatShown = resp?.seatNumber ?? seatNum ?? "automático";

      toast.success(
        `Reserva creada: ${airline} ${flightNumber} – Asiento ${seatShown}`
      );

      setOpen(false);
      setSeat("");
    } catch (e: any) {
      const msg =
        e?.response?.data?.message || e?.message || "Error inesperado en el servidor";
      toast.error(msg);
      console.error("createReservation error:", e);
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
            <p className="text-lg text-gray-400 mb-1">✈️</p>
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
            onClick={() => setOpen(true)}
            className="px-5 py-2 rounded-md bg-emerald-600 text-white text-sm hover:bg-emerald-700 transition"
          >
            Reservar
          </button>
        </div>
      </motion.div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`Reserva en ${airline} ${flightNumber}`}
      >
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-700">
            ✈️ {origin} → {destination}
            <br />
            🕒 {depTime} - {arrTime}
            <br />
            Modelo: {aircraftType}
          </div>

          <label className="block text-sm text-gray-700">
            Número de asiento (opcional):
            <input
              type="number"
              value={seat}
              onChange={(e) => setSeat(e.target.value)}
              placeholder="Ej: 14"
              min={1}
              className="mt-1 border rounded-md p-2 w-full focus:ring-2 focus:ring-emerald-500"
            />
          </label>

          <div className="flex justify-end gap-3 pt-3 border-t">
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 rounded-md border text-sm hover:bg-gray-50 transition"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              onClick={confirmReservation}
              disabled={loading}
              className="px-4 py-2 rounded-md bg-emerald-600 text-white text-sm hover:bg-emerald-700 disabled:opacity-60 transition"
            >
              {loading ? "Procesando..." : "Confirmar"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default FlightCard;