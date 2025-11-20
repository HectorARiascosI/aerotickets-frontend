// src/pages/PaymentSuccessPage.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";

export default function PaymentSuccessPage() {
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
      <h1 className="text-2xl font-semibold mb-2">Pago realizado con éxito</h1>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        Tu compra ha sido confirmada. En unos segundos serás redirigido a la
        sección de Mis reservas para ver el detalle.
      </p>
      <Button onClick={goNow}>Ir a mis reservas ahora</Button>
    </div>
  );
}