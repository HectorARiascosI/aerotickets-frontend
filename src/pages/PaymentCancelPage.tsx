// src/pages/PaymentCancelPage.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";

export default function PaymentCancelPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/reservas", { replace: true });
    }, 4000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  const goNow = () => {
    navigate("/reservas", { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl font-semibold mb-2">Pago cancelado</h1>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        El pago fue cancelado. Puedes intentarlo de nuevo desde Mis reservas.
      </p>
      <Button variant="secondary" onClick={goNow}>
        Volver a Mis reservas
      </Button>
    </div>
  );
}