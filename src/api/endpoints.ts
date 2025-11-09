export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    FORGOT: "/api/auth/forgot-password",
    RESET: "/api/auth/reset-password",
  },
  USERS: {
    REGISTER: "/api/users/register",
  },
  CATALOG: {
    AIRLINES_CO: "/api/catalog/airlines/co",
    AIRPORTS_CO: "/api/catalog/airports/co",
  },
  LIVE: {
    AIRPORTS: "/live/airports/search",
    FLIGHTS: "/live/flights/search",
    STREAM: "/api/live/stream",
  },
  FLIGHTS: {
    ROOT: "/api/flights",
    SEARCH: "/api/flights/search",
  },
  RESERVATIONS: {
    ROOT: "/reservations",
    MY: "/reservations/my",
  },
  MISC: {
    HEALTH: "/health",
    HOLA: "/hola",
  },
} as const;