import { useEffect } from "react";
import AppRoutes from "@/router";
import Layout from "@/components/Layout";
import { startKeepAlive } from "@/services/keepAliveService";

export default function App() {
  useEffect(() => {
    // Iniciar servicio keep-alive para mantener Render despierto
    startKeepAlive();
  }, []);

  return (
    <Layout>
      <AppRoutes />
    </Layout>
  );
}