// src/services/paymentService.ts
import api from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";

export interface CheckoutSessionResponse {
  id: string;
  url: string;
}

export async function createCheckoutSession(
  flightId: number
): Promise<CheckoutSessionResponse> {
  const response = await api.post<CheckoutSessionResponse>(
    ENDPOINTS.PAYMENTS.CHECKOUT_SESSION,
    { flightId }
  );
  return response.data;
}