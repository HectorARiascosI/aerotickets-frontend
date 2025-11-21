import { Link, NavLink } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import { FaPlane, FaTicketAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
      isActive
        ? "bg-primary-100 text-primary-700 font-medium"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;

  return (
    <header className="glass-effect sticky top-0 z-50 shadow-sm">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-hero p-2 rounded-lg shadow-md"
          >
            <FaPlane className="text-white text-xl" />
          </motion.div>
          <span className="font-bold text-xl gradient-text hidden sm:block">
            AEROTICKETS
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <NavLink className={linkClass} to="/flights">
                <FaPlane className="text-sm" />
                <span>Vuelos</span>
              </NavLink>
              <NavLink className={linkClass} to="/reservations">
                <FaTicketAlt className="text-sm" />
                <span>Mis Reservas</span>
              </NavLink>
              
              <div className="h-6 w-px bg-gray-300 mx-2" />
              
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                <FaUser className="text-primary-500 text-sm" />
                <span className="text-sm text-gray-700 max-w-[150px] truncate">
                  {user.fullName ?? user.email}
                </span>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <FaSignOutAlt />
                <span>Salir</span>
              </motion.button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                Ingresar
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-gradient-hero text-white rounded-lg hover:shadow-glow transition-all"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t bg-white px-4 py-3 space-y-2"
        >
          {user ? (
            <>
              <NavLink
                className={linkClass}
                to="/flights"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaPlane className="text-sm" />
                <span>Vuelos</span>
              </NavLink>
              <NavLink
                className={linkClass}
                to="/reservations"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaTicketAlt className="text-sm" />
                <span>Mis Reservas</span>
              </NavLink>
              <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700">
                {user.fullName ?? user.email}
              </div>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg"
              >
                <FaSignOutAlt />
                <span>Salir</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Ingresar
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2 bg-gradient-hero text-white rounded-lg text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Registrarse
              </Link>
            </>
          )}
        </motion.div>
      )}
    </header>
  );
}