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
}

export interface ReservationResponse {
  id: number;
  seatNumber?: number;
  status: "ACTIVE" | "CANCELLED";
  createdAt: string;
  flightId: number;
  airline: string;
  origin: string;
  destination: string;
  departureAt: string;
  arriveAt: string;
  price: number;
}

export async function createReservation(payload: ReservationPayload) {
  const { data } = await api.post<ReservationResponse>(BASE, payload, {
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
  return data;
}

export async function cancelReservation(id: number) {
  await api.delete(`${BASE}/${id}`, {
    headers: { ...authHeaders() },
    withCredentials: true,
  });
}