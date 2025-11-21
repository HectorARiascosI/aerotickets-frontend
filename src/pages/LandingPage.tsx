import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaPlane, FaGlobe, FaShieldAlt, FaClock, FaTicketAlt, FaArrowRight } from "react-icons/fa";
import { useAuth } from "@/auth/AuthContext";
import { useEffect } from "react";

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Si el usuario ya está autenticado, redirigir a flights
  useEffect(() => {
    if (user) {
      navigate("/flights", { replace: true });
    }
  }, [user, navigate]);
  const features = [
    {
      icon: <FaGlobe className="text-4xl text-primary-500" />,
      title: "Vuelos Globales",
      description: "Accede a miles de destinos en todo el mundo con las mejores aerolíneas."
    },
    {
      icon: <FaShieldAlt className="text-4xl text-primary-500" />,
      title: "Pago Seguro",
      description: "Transacciones protegidas con los más altos estándares de seguridad."
    },
    {
      icon: <FaClock className="text-4xl text-primary-500" />,
      title: "Reserva Rápida",
      description: "Encuentra y reserva tu vuelo ideal en minutos, sin complicaciones."
    },
    {
      icon: <FaTicketAlt className="text-4xl text-primary-500" />,
      title: "Mejores Precios",
      description: "Compara y encuentra las mejores ofertas para tu próximo viaje."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Tu próxima aventura comienza aquí
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Descubre los mejores vuelos al mejor precio. Reserva fácil, rápido y seguro.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:shadow-glow transition-all transform hover:scale-105"
                >
                  Comenzar ahora
                  <FaArrowRight />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-all"
                >
                  Iniciar sesión
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10">
                <FaPlane className="text-[200px] md:text-[300px] opacity-20 animate-float" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 gradient-text">
              ¿Por qué elegir AEROTICKETS?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ofrecemos la mejor experiencia en reserva de vuelos con tecnología de punta
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white p-8 rounded-xl shadow-soft hover:shadow-glow transition-all cursor-pointer"
              >
                <motion.div 
                  className="mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-5xl font-bold gradient-text mb-2">500+</div>
              <p className="text-gray-600 text-lg">Destinos disponibles</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="text-5xl font-bold gradient-text mb-2">10K+</div>
              <p className="text-gray-600 text-lg">Clientes satisfechos</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-5xl font-bold gradient-text mb-2">24/7</div>
              <p className="text-gray-600 text-lg">Soporte al cliente</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-hero text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              ¿Listo para despegar?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Únete a miles de viajeros que confían en nosotros para sus aventuras
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:shadow-glow transition-all transform hover:scale-105"
            >
              Crear cuenta gratis
              <FaArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FaPlane className="text-primary-400 text-2xl" />
            <span className="font-bold text-2xl text-white">AEROTICKETS</span>
          </div>
          <p className="text-gray-400">
            © 2024 AEROTICKETS. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}