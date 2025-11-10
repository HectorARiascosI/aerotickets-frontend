// Base limpia: sin slash final y sin /api
const RAW_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";
export const API_BASE = RAW_BASE.replace(/\/+$/, "");

// Todas las rutas con /api al inicio
export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
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
    AIRPORTS: "/api/live/airports/search",
    FLIGHTS: "/api/live/flights/search",
    STREAM: "/api/live/stream",
  },
  FLIGHTS: {
    ROOT: "/api/flights",
    SEARCH: "/api/flights/search",
  },
  RESERVATIONS: {
    ROOT: "/api/reservations",
    MY: "/api/reservations/my",
  },
  MISC: {
    HEALTH: "/actuator/health", // si usas Spring Actuator; si no, deja "/health"
    HOLA: "/hola",
  },
} as const;