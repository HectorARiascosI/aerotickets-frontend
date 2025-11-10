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

export async function searchFlights(origin: string, destination: string, date: string) {
  const payload = {
    origin: origin.trim(),
    destination: destination.trim(),
    date: date || new Date().toISOString().split("T")[0]
  };
  const url = live().FLIGHTS;
  try {
    const { data } = await api.post(url, payload);
    const list = Array.isArray(data) ? data.map((f: any) => normalizeFlight(f)) : [];
    return list.sort((a, b) => new Date(a.departureAt).getTime() - new Date(b.departureAt).getTime());
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
          label: `${a.city} (${a.iata}) - ${a.airport}`
        }))
      : [];
  } catch {
    return [];
  }
}