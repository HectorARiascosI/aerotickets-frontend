import type { Flight } from "@/services/flightService";
import { getDeterministicPrice } from "@/utils/pricing";

export function normalizeFlight(raw: any): Flight {
  if (!raw) {
    return {
      airline: "—",
      flightNumber: "—",
      origin: "—",
      destination: "—",
      departureAt: "",
      arrivalAt: "",
      status: "SCHEDULED",
      aircraftType: "—",
      terminal: "—",
      gate: "—",
      baggageBelt: "—",
      delayMinutes: 0,
      diverted: false,
      emergency: false,
      totalSeats: 0,
      occupiedSeats: 0,
      cargoKg: 0,
      boardingStartAt: "",
      boardingEndAt: "",
      price: getDeterministicPrice({
        airline: "—",
        flightNumber: "—",
        origin: "—",
        destination: "—",
        departureAt: "",
      } as any),
    } as Flight;
  }

  const flightObj: any = {
    airline: raw.airline ?? "Desconocida",
    flightNumber: raw.flightNumber ?? raw.code ?? "—",
    origin: raw.origin ?? raw.originIata ?? raw.originCity ?? "—",
    destination: raw.destination ?? raw.destinationIata ?? raw.destinationCity ?? "—",
    departureAt: raw.departureAt ?? raw.departureTime ?? raw.departAt ?? "",
    arrivalAt: raw.arrivalAt ?? raw.arriveAt ?? raw.arriveTime ?? "",
    status: raw.status ?? "SCHEDULED",
    aircraftType: raw.aircraftType ?? raw.model ?? "—",
    terminal: raw.terminal ?? "—",
    gate: raw.gate ?? raw.door ?? "—",
    baggageBelt: raw.baggageBelt ?? raw.belt ?? "—",
    delayMinutes: raw.delayMinutes ?? raw.delay ?? 0,
    diverted: raw.diverted ?? false,
    emergency: raw.emergency ?? false,
    totalSeats: raw.totalSeats ?? 0,
    occupiedSeats: raw.occupiedSeats ?? 0,
    cargoKg: raw.cargoKg ?? 0,
    boardingStartAt: raw.boardingStartAt ?? "",
    boardingEndAt: raw.boardingEndAt ?? "",
    price: typeof raw.price === "number" ? raw.price : null,
  };

  if (typeof flightObj.price !== "number" || flightObj.price <= 0) {
    flightObj.price = getDeterministicPrice(flightObj);
  }

  return flightObj as Flight;
}