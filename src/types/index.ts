export type Flight = {
  id: number;
  airline: string;
  origin: string;
  destination: string;
  departureAt: string;
  arriveAt: string;
  totalSeats: number;
  price: number;
};

export type ReservationDTO = {
  id: number;
  seatNumber?: string;
  status: "ACTIVE" | "CANCELLED";
  paid?: boolean;
  paidAt?: string;
  createdAt: string;
  flightId: number;
  airline: string;
  origin: string;
  destination: string;
  departureAt: string;
  arriveAt: string;
  price: number;
};