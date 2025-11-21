// Servicio para mantener el backend de Render despierto
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'https://aerotickets-api.onrender.com'
const HEALTH_ENDPOINT = `${BACKEND_URL}/api/health`

// Intervalo aleatorio entre 50 segundos y 4 minutos (en milisegundos)
const MIN_INTERVAL = 50 * 1000  // 50 segundos
const MAX_INTERVAL = 4 * 60 * 1000  // 4 minutos

let keepAliveInterval: NodeJS.Timeout | null = null

function getRandomInterval(): number {
  return Math.floor(Math.random() * (MAX_INTERVAL - MIN_INTERVAL + 1)) + MIN_INTERVAL
}

async function pingBackend(): Promise<void> {
  try {
    const response = await fetch(HEALTH_ENDPOINT, {
      method: 'GET',
      cache: 'no-cache',
    })
    
    if (response.ok) {
      console.log('✅ Backend keep-alive ping exitoso')
    }
  } catch (error) {
    console.warn('⚠️ Keep-alive ping falló (normal si el backend está iniciando)')
  }
}

function scheduleNextPing(): void {
  const interval = getRandomInterval()
  const minutes = Math.floor(interval / 60000)
  const seconds = Math.floor((interval % 60000) / 1000)
  
  console.log(`⏰ Próximo ping al backend en ${minutes}m ${seconds}s`)
  
  keepAliveInterval = setTimeout(() => {
    pingBackend()
    scheduleNextPing() // Programar el siguiente ping
  }, interval)
}

export function startKeepAlive(): void {
  if (keepAliveInterval) {
    console.log('ℹ️ Keep-alive ya está activo')
    return
  }
  
  console.log('🚀 Iniciando servicio keep-alive para Render')
  
  // Hacer ping inmediato
  pingBackend()
  
  // Programar siguientes pings
  scheduleNextPing()
}

export function stopKeepAlive(): void {
  if (keepAliveInterval) {
    clearTimeout(keepAliveInterval)
    keepAliveInterval = null
    console.log('🛑 Servicio keep-alive detenido')
  }
}
