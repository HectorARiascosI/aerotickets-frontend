import api from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { normalizeFlight } from "@/utils/normalizeFlight";

type LiveEndpoints = { AIRPORTS: string; FLIGHTS: string };

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

/** Normaliza texto para autocomplete */
function normalizeText(text: string) {
  return (text || "").normalize("NFD").replace(/\p{Diacritic}/gu, "").trim();
}

/** Formato que acepta tu backend: yyyy-MM-ddTHH:mm:ss (sin Z) */
function toIsoLocal(x?: string) {
  if (!x) return undefined;
  const d = new Date(x);
  if (isNaN(d.getTime())) return undefined;
  const tzo = d.getTimezoneOffset() * 60000;
  const local = new Date(d.getTime() - tzo);
  return local.toISOString().slice(0, 19); // sin 'Z'
}

/** Buscar SIEMPRE en /live/... (mock remota) */
export async function searchFlights(origin: string, destination: string, date: string) {
  const payload = {
    origin: origin.trim(),
    destination: destination.trim(),
    date: date || new Date().toISOString().split("T")[0],
  };
  try {
    const { data } = await api.post(live().FLIGHTS, payload);
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
  try {
    const { data } = await api.get(live().AIRPORTS, { params: { query: q } });
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

/**
 * Upsert de vuelo compatible con el backend actual (sin flightNumber).
 * - Enviamos SOLO los campos que tu backend entiende.
 * - Fechas en ISO local (sin Z).
 * - Fallback: si crear falla, busca por (origin, destination, departureAt).
 */
export async function upsertFlightForReservation(f: Flight): Promise<number> {
  const payload = {
    airline: f.airline ?? "Desconocida",
    origin: f.origin ?? "",
    destination: f.destination ?? "",
    departureAt: toIsoLocal(f.departureAt),
    arriveAt: toIsoLocal(f.arrivalAt),
    totalSeats: typeof f.totalSeats === "number" ? f.totalSeats : 0,
    price: typeof f.price === "number" ? f.price : 0,
  };

  const create = async () => {
    const { data } = await api.post(ENDPOINTS.FLIGHTS.ROOT, payload, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    const id = Number(data?.id);
    if (!id) throw new Error("Flight creation failed");
    return id;
  };

  try {
    return await create();
  } catch (err) {
    // Fallback: reutilizar
    try {
      const { data } = await api.get(ENDPOINTS.FLIGHTS.ROOT, { withCredentials: true });
      const all: any[] = Array.isArray(data) ? data : [];
      const dep = toIsoLocal(f.departureAt);

      const match = all.find((x) => {
        const sameDep = !!dep && !!x.departureAt && x.departureAt.startsWith(dep);
        const sameRoute = (x.origin || "") === (f.origin || "") &&
                          (x.destination || "") === (f.destination || "");
        return sameDep && sameRoute;
      });

      const id = match ? Number(match.id) : NaN;
      if (!isNaN(id) && id > 0) return id;

      // último intento: crear otra vez (por si el 1er fallo fue transitorio)
      return await create();
    } catch {
      throw err;
    }
  }
}