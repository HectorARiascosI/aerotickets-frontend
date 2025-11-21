// src/services/reservationService.ts
import api from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";

const BASE = ENDPOINTS.RESERVATIONS.ROOT;

export interface CreateReservationPayload {
  flightId: number;
  seatNumber?: string;
  seats?: number;
}

export type Reservation = {
  id: number;
  status?: "ACTIVE" | "CANCELLED" | string;
  createdAt?: string;

  flightId?: number;
  airline?: string;
  origin?: string;
  destination?: string;
  departureAt?: string;
  arrivalAt?: string;
  arriveAt?: string;
  price?: number | null;

  seatNumber?: string;
};

export async function createReservation(
  payload: CreateReservationPayload
): Promise<Reservation> {
  const body = {
    flightId: payload.flightId,
    seatNumber:
      payload.seatNumber && payload.seatNumber.trim() !== "" ? payload.seatNumber : undefined,
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

export async function getOccupiedSeats(flightId: number): Promise<string[]> {
  const { data } = await api.get<string[]>(
    ENDPOINTS.RESERVATIONS.OCCUPIED_SEATS(flightId),
    {
      withCredentials: true,
    }
  );
  return Array.isArray(data) ? data : [];
}