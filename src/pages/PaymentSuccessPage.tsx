import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTicketAlt } from "react-icons/fa";

export default function PaymentSuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/reservations", { replace: true });
    }, 5000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  const goNow = () => {
    navigate("/reservations", { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-green-50 via-white to-blue-50">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <FaCheckCircle className="text-8xl text-green-500 mx-auto mb-6" />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4"
        >
          ¡Pago exitoso!
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-600 mb-8 text-lg max-w-md mx-auto"
        >
          Tu reserva ha sido confirmada. Recibirás un correo con los detalles de tu vuelo.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goNow}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-hero text-white rounded-xl font-semibold hover:shadow-glow transition-all"
          >
            <FaTicketAlt />
            Ver mis reservas
          </motion.button>
          
          <p className="text-sm text-gray-500">
            Serás redirigido automáticamente en unos segundos...
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}