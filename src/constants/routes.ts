export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token',
  FLIGHTS: '/flights',
  RESERVATIONS: '/reservations',
  PAYMENT_SUCCESS: '/pagos/success',
  PAYMENT_CANCEL: '/pagos/cancel',
} as const;
