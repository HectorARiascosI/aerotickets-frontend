import { useEffect, useMemo, useState } from "react";
import { listMyReservations, cancelReservation } from "@/services/reservationService";
import { createCheckoutSession } from "@/services/paymentService";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/Table";
import Loader from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { formatCurrency, formatDateTime } from "@/utils/format";
import toast from "react-hot-toast";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

type Row = Awaited<ReturnType<typeof listMyReservations>> extends (infer U)[]
  ? U
  : never;

export default function MyReservationsPage() {
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState<number | null>(null);
  const [payingId, setPayingId] = useState<number | null>(null);
  const [rows, setRows] = useState<Row[]>([]);

  const ordered = useMemo(
    () =>
      [...rows].sort(
        (a, b) =>
          new Date(b?.createdAt || 0).getTime() -
          new Date(a?.createdAt || 0).getTime()
      ),
    [rows]
  );

  const load = async () => {
    setLoading(true);
    try {
      const data = await listMyReservations();
      setRows(data);
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "No fue posible cargar reservas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onCancel = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas cancelar esta reserva?")) return;
    setCancelingId(id);
    try {
      await cancelReservation(id);
      toast.success("Reserva cancelada correctamente");
      await load();
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
    const dep = new Date(r.departureAt as any);
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
  if (ordered.length === 0) return <EmptyState title="Aún no tienes reservas" />;

  const getArrival = (r: Row) => (r as any).arrivalAt || (r as any).arriveAt || "";

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <div className="mb-6 text-2xl font-semibold text-gray-800 flex items-center gap-2">
        Mis reservas
      </div>

      <Table>
        <THead>
          <TR>
            <TH className="text-left">Vuelo</TH>
            <TH className="text-left">Fechas</TH>
            <TH className="text-right">Precio</TH>
            <TH className="text-center">Estado</TH>
            <TH className="text-right"></TH>
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
                {r.seatNumber && (
                  <div className="text-xs text-gray-500">
                    Asiento: {r.seatNumber}
                  </div>
                )}
              </TD>

              <TD>
                <div className="text-sm text-gray-700">
                  {formatDateTime((r as any).departureAt || "")}
                </div>
                <div className="text-xs text-gray-500">
                  {formatDateTime(getArrival(r))}
                </div>
              </TD>

              <TD className="text-right font-medium text-gray-800">
                {formatCurrency(((r as any).price as number) ?? 0)}
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
                      onClick={() => onCancel(r.id)}
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
    </div>
  );
}