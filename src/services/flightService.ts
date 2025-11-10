import api from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { normalizeFlight } from "@/utils/normalizeFlight";

type LiveEndpoints = {
  AIRPORTS: string;
  FLIGHTS: string;
};

function withApiPrefix(path: string) {
  if (!path.startsWith("/")) return "/api/" + path;
  return path.startsWith("/api/") ? path : "/api" + path;
}

function live(): LiveEndpoints {
  const a = (ENDPOINTS as any)?.LIVE?.AIRPORTS ?? "/live/airports/search";
  const f = (ENDPOINTS as any)?.LIVE?.FLIGHTS ?? "/live/flights/search";
  return { AIRPORTS: withApiPrefix(a), FLIGHTS: withApiPrefix(f) };
}

export type Flight = ReturnType<typeof normalizeFlight>;

function normalizeText(text: string) {
  return (text || "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

function toIso(x?: string) {
  if (!x) return undefined;
  const d = new Date(x);
  return isNaN(d.getTime()) ? undefined : d.toISOString();
}

export async function searchFlights(origin: string, destination: string, date: string) {
  const payload = {
    origin: origin.trim(),
    destination: destination.trim(),
    date: date || new Date().toISOString().split("T")[0],
  };
  const url = live().FLIGHTS;
  try {
    const { data } = await api.post(url, payload);
    const list = Array.isArray(data) ? data.map((f: any) => normalizeFlight(f)) : [];
    return list.sort(
      (a, b) => new Date(a.departureAt).getTime() - new Date(b.departureAt).getTime()
    );
  } catch {
    return [];
  }
}

export async function autocompleteAirports(query: string) {
  const q = normalizeText(query);
  if (!q || q.length < 2) return [];
  const url = live().AIRPORTS;
  try {
    const { data } = await api.get(url, { params: { query: q } });
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

export async function upsertFlightForReservation(f: Flight): Promise<number> {
  const payload = {
    airline: f.airline ?? null,
    flightNumber: f.flightNumber ?? null,
    origin: f.origin ?? null,
    destination: f.destination ?? null,
    departureAt: toIso(f.departureAt),
    arriveAt: toIso(f.arrivalAt),
    status: f.status ?? "SCHEDULED",
    aircraftType: f.aircraftType ?? null,
    terminal: f.terminal ?? null,
    gate: f.gate ?? null,
    baggageBelt: f.baggageBelt ?? null,
    price: typeof f.price === "number" ? f.price : 0,
  };

  try {
    const { data } = await api.post(ENDPOINTS.FLIGHTS.ROOT, payload, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    const id = Number(data?.id);
    if (!id) throw new Error("Flight creation failed");
    return id;
  } catch (err: any) {
    try {
      const { data } = await api.get(ENDPOINTS.FLIGHTS.ROOT, { withCredentials: true });
      const all: any[] = Array.isArray(data) ? data : [];

      const dep = toIso(f.departureAt);
      const num = (f.flightNumber || "").toUpperCase().trim();

      const match = all.find((x) => {
        const sameNum =
          (x.flightNumber || "").toUpperCase().trim() === num && num.length > 0;
        const sameDep =
          !!dep && !!x.departureAt && new Date(x.departureAt).toISOString() === dep;
        const sameRoute =
          (x.origin || "") === (f.origin || "") &&
          (x.destination || "") === (f.destination || "");
        return sameNum && sameDep && sameRoute;
      });

      const id = match ? Number(match.id) : NaN;
      if (!isNaN(id) && id > 0) return id;
      throw err;
    } catch {
      throw err;
    }
  }
}