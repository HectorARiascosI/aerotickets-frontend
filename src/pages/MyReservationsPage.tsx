import { useEffect, useMemo, useState } from "react";
import {
  listMyReservations,
  cancelReservation,
  Reservation,
} from "@/services/reservationService";
import { createCheckoutSession } from "@/services/paymentService";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/Table";
import Loader from "@/components/ui/Loader";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { formatCurrency, formatDateTime } from "@/utils/format";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle, FaTicketAlt, FaPlane } from "react-icons/fa";

type Row = Reservation;

export default function MyReservationsPage() {
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState<number | null>(null);
  const [payingId, setPayingId] = useState<number | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState<number | null>(null);

  const ordered = useMemo(
    () =>
      [...rows].sort((a, b) => {
        const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bDate - aDate;
      }),
    [rows]
  );

  const load = async () => {
    setLoading(true);
    try {
      const data = await listMyReservations();
      setRows(data);
    } catch (e: any) {
      toast.error(
        e?.response?.data?.message ?? "No fue posible cargar reservas"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onCancelClick = (id: number) => {
    setReservationToCancel(id);
    setConfirmDialogOpen(true);
  };

  const onCancelConfirm = async () => {
    if (!reservationToCancel) return;
    
    setCancelingId(reservationToCancel);
    try {
      await cancelReservation(reservationToCancel);
      toast.success("Reserva cancelada correctamente");
      await load();
      setConfirmDialogOpen(false);
      setReservationToCancel(null);
    } catch (e: any) {
      toast.error(
        e?.response?.data?.message ?? "No fue posible cancelar la reserva"
      );
    } finally {
      setCancelingId(null);
    }
  };

  const canPay = (r: Row) => {
    if (r.status !== "ACTIVE") return false;
    if (!r.departureAt) return false;
    const dep = new Date(r.departureAt);
    return dep.getTime() > Date.now();
  };

  const onPay = async (r: Row) => {
    if (!r.flightId) {
      toast.error("No se encontró el vuelo asociado a la reserva");
      return;
    }

    setPayingId(r.id);
    try {
      const session = await createCheckoutSession(r.flightId as number);
      if (session.url) {
        window.location.href = session.url;
      } else {
        toast.error("Stripe no devolvió una URL de pago");
      }
    } catch (e: any) {
      toast.error(
        e?.response?.data?.message ?? "No fue posible iniciar el pago con Stripe"
      );
    } finally {
      setPayingId(null);
    }
  };

  if (loading) return <Loader label="Cargando tus reservas..." />;
  
  const getArrival = (r: Row) => r.arrivalAt || r.arriveAt || "";

  if (ordered.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <FaTicketAlt className="text-8xl text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">No tienes reservas aún</h2>
          <p className="text-gray-600 mb-8">¡Comienza a explorar vuelos y reserva tu próxima aventura!</p>
          <motion.a
            href="/flights"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-hero text-white rounded-xl font-semibold hover:shadow-glow transition-all"
          >
            <FaPlane />
            Buscar vuelos
          </motion.a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-2 flex items-center gap-3">
            <FaTicketAlt />
            Mis reservas
          </h1>
          <p className="text-gray-600">Gestiona tus vuelos reservados</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-effect rounded-2xl shadow-soft overflow-hidden"
        >
          <Table>
        <THead>
          <TR>
            <TH className="text-left">Vuelo</TH>
            <TH className="text-left">Fechas</TH>
            <TH className="text-right">Precio</TH>
            <TH className="text-center">Estado</TH>
            <TH className="text-right">Acciones</TH>
          </TR>
        </THead>
        <TBody>
          {ordered.map((r) => (
            <TR
              key={r.id}
              className={`transition-colors hover:bg-gray-50 ${
                r.status === "CANCELLED" ? "opacity-70" : ""
              }`}
            >
              <TD>
                <div className="font-semibold text-gray-800">
                  {r.origin} → {r.destination}
                </div>
                <div className="text-xs text-gray-500">{r.airline}</div>
                {typeof r.seatNumber === "number" && (
                  <div className="text-xs text-gray-500">
                    Asiento: {r.seatNumber}
                  </div>
                )}
              </TD>

              <TD>
                <div className="text-sm text-gray-700">
                  {formatDateTime(r.departureAt || "")}
                </div>
                <div className="text-xs text-gray-500">
                  {formatDateTime(getArrival(r))}
                </div>
              </TD>

              <TD className="text-right font-medium text-gray-800">
                {formatCurrency((r.price as number) ?? 0)}
              </TD>

              <TD className="text-center">
                <Badge color={r.status === "ACTIVE" ? "green" : "red"}>
                  {r.status === "ACTIVE" ? (
                    <>
                      <FaCheckCircle className="inline mr-1" />
                      <span>Activa</span>
                    </>
                  ) : (
                    <>
                      <FaTimesCircle className="inline mr-1" />
                      <span>Cancelada</span>
                    </>
                  )}
                </Badge>
              </TD>

              <TD className="text-right space-x-2">
                {r.status === "ACTIVE" && (
                  <>
                    <Button
                      variant="secondary"
                      disabled={!canPay(r) || payingId === r.id}
                      onClick={() => onPay(r)}
                    >
                      {payingId === r.id ? "Redirigiendo..." : "Pagar"}
                    </Button>

                    <Button
                      variant="danger"
                      disabled={cancelingId === r.id}
                      onClick={() => onCancelClick(r.id)}
                    >
                      {cancelingId === r.id ? "Cancelando..." : "Cancelar"}
                    </Button>
                  </>
                )}
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
        </motion.div>
      </div>

      {/* Dialog de confirmación */}
      <ConfirmDialog
        isOpen={confirmDialogOpen}
        onClose={() => {
          setConfirmDialogOpen(false);
          setReservationToCancel(null);
        }}
        onConfirm={onCancelConfirm}
        title="Cancelar Reserva"
        message="¿Estás seguro que deseas cancelar esta reserva? Esta acción no se puede deshacer."
        confirmText="Sí, cancelar"
        cancelText="No, mantener"
        type="danger"
        isLoading={cancelingId !== null}
      />
    </div>
  );
}