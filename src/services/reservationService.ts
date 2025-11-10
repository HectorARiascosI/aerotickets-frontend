import { api } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";

const BASE = ENDPOINTS.RESERVATIONS.ROOT;

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface ReservationPayload {
  flightId: number;
  seatNumber?: number;
  seats?: number;
}

export type ReservationResponse = {
  id: number;
  status?: "ACTIVE" | "CANCELLED" | string;
  createdAt?: string;
  flightId?: number;
  airline?: string;
  origin?: string;
  destination?: string;
  departureAt?: string;
  arrivalAt?: string; // preferido
  arriveAt?: string;  // compat
  price?: number | null;
  seatNumber?: number;
};

export async function createReservation(payload: ReservationPayload) {
  const body = {
    flightId: payload.flightId,
    seatNumber: payload.seatNumber ?? undefined,
    seats: payload.seats ?? 1, // asegura seats >= 1
  };

  const { data } = await api.post<ReservationResponse>(BASE, body, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
    withCredentials: true,
  });
  return data;
}

export async function listMyReservations() {
  const { data } = await api.get<ReservationResponse[]>(ENDPOINTS.RESERVATIONS.MY, {
    headers: { ...authHeaders() },
    withCredentials: true,
  });
  return Array.isArray(data) ? data : [];
}

export async function cancelReservation(id: number) {
  await api.delete(`${BASE}/${id}`, {
    headers: { ...authHeaders() },
    withCredentials: true,
  });
}