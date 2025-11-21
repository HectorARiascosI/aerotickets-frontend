import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import AIChatBot from "@/components/AIChatBot";
import ProtectedRoute from "@/auth/ProtectedRoute";
import { Suspense, lazy } from "react";
import { useAuth } from "@/auth/useAuth";

const LandingPage = lazy(() => import("@/pages/LandingPage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/RegisterPage"));
const FlightsPage = lazy(() => import("@/pages/FlightsPage"));
const MyReservationsPage = lazy(() => import("@/pages/MyReservationsPage"));
const ForgotPasswordPage = lazy(() => import("@/pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("@/pages/ResetPasswordPage"));
const PaymentSuccessPage = lazy(() => import("@/pages/PaymentSuccessPage"));
const PaymentCancelPage = lazy(() => import("@/pages/PaymentCancelPage"));

export default function AppRoutes() {
  const { user } = useAuth();
  
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="p-6">Cargando…</div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route
            path="/flights"
            element={
              <ProtectedRoute>
                <FlightsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservations"
            element={
              <ProtectedRoute>
                <MyReservationsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/pagos/success" element={<PaymentSuccessPage />} />
          <Route path="/pagos/cancel" element={<PaymentCancelPage />} />
          <Route path="*" element={<div className="p-6">404 — Página no encontrada</div>} />
        </Routes>
      </Suspense>
      {/* Solo mostrar chatbot si el usuario está autenticado */}
      {user && <AIChatBot />}
    </>
  );
}