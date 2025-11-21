import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTimesCircle, FaArrowLeft } from "react-icons/fa";
import { MESSAGES, ROUTES } from "@/constants";

export default function PaymentCancelPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
      navigate(ROUTES.RESERVATIONS, { replace: true });
    };

    window.addEventListener("popstate", handlePopState);

    const timeout = setTimeout(() => {
      navigate(ROUTES.RESERVATIONS, { replace: true });
    }, 5000);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      clearTimeout(timeout);
    };
  }, [navigate]);

  const goNow = () => {
    navigate(ROUTES.RESERVATIONS, { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-red-50 via-white to-orange-50">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <FaTimesCircle className="text-8xl text-red-500 mx-auto mb-6" />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4"
        >
          {MESSAGES.PAYMENT.CANCEL_TITLE}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-600 mb-8 text-lg max-w-md mx-auto"
        >
          {MESSAGES.PAYMENT.CANCEL_MESSAGE}
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
            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-700 transition-all"
          >
            <FaArrowLeft />
            {MESSAGES.PAYMENT.TRY_AGAIN}
          </motion.button>
          
          <p className="text-sm text-gray-500">
            {MESSAGES.PAYMENT.AUTO_REDIRECT}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
