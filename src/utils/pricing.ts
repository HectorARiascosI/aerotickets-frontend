import type { Flight } from "@/services/flightService";

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function getDeterministicPrice(f: Flight): number {
  const key = `${f.airline}|${f.flightNumber}|${f.origin}|${f.destination}|${f.departureAt?.slice(0, 16)}`;
  const h = hash(key);
  const base = 90000 + (h % 250000);
  const demand = (h % 5) * 10000;
  return base + demand;
}