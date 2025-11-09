import { api } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { normalizeFlight } from "@/utils/normalizeFlight";

export type Flight = {
  id?: number;
  airline: string;
  flightNumber?: string;
  origin: string;
  destination: string;
  departureAt: string;
  arrivalAt: string;
  status?: string;
  aircraftType?: string;
  terminal?: string;
  gate?: string;
  baggageBelt?: string;
  delayMinutes?: number;
  diverted?: boolean;
  emergency?: boolean;
  totalSeats?: number;
  occupiedSeats?: number;
  cargoKg?: number;
  boardingStartAt?: string;
  boardingEndAt?: string;
  price?: number | null;
};

function normalize(text: string) {
  return (text || "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

export async function searchFlights(origin: string, destination: string, date: string) {
  const payload = {
    origin: origin.trim(),
    destination: destination.trim(),
    date: date || new Date().toISOString().split("T")[0],
  };

  try {
    const { data } = await api.post(ENDPOINTS.LIVE.FLIGHTS, payload);
    const flights: Flight[] = Array.isArray(data) ? data.map((f) => normalizeFlight(f)) : [];
    return flights.sort(
      (a, b) => new Date(a.departureAt).getTime() - new Date(b.departureAt).getTime()
    );
  } catch {
    return [];
  }
}

export async function autocompleteAirports(query: string) {
  const q = normalize(query);
  if (!q || q.length < 2) return [];
  try {
    const { data } = await api.get(ENDPOINTS.LIVE.AIRPORTS, { params: { query: q } });
    return Array.isArray(data)
      ? data.map((a: any) => ({
          iata: a.iata,
          city: a.city,
          label: `${a.city} (${a.iata}) - ${a.airport}`,
        }))
      : [];
  } catch {
    return [];
  }
}