import api from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";

const BASE = ENDPOINTS.RESERVATIONS.ROOT;

export interface CreateReservationPayload {
  flightId: number;
  seatNumber?: number;
  seats?: number; // cantidad de sillas (>=1)
}

export type Reservation = {
  id: number;
  status?: "ACTIVE" | "CANCELLED" | string;
  createdAt?: string;

  // Datos útiles del vuelo (si el backend los incluye en la respuesta)
  flightId?: number;
  airline?: string;
  origin?: string;
  destination?: string;
  departureAt?: string;
  arrivalAt?: string; // preferido
  arriveAt?: string;  // compatibilidad
  price?: number | null;

  seatNumber?: number;
};

export async function createReservation(payload: CreateReservationPayload): Promise<Reservation> {
  const body = {
    flightId: payload.flightId,
    seatNumber: typeof payload.seatNumber === "number" ? payload.seatNumber : undefined,
    seats: Math.max(1, payload.seats ?? 1),
  };

  const { data } = await api.post<Reservation>(BASE, body, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
  return data;
}

export async function listMyReservations(): Promise<Reservation[]> {
  const { data } = await api.get<Reservation[]>(ENDPOINTS.RESERVATIONS.MY, {
    withCredentials: true,
  });
  return Array.isArray(data) ? data : [];
}

export async function cancelReservation(id: number): Promise<void> {
  await api.delete(`${BASE}/${id}`, {
    withCredentials: true,
  });
} 