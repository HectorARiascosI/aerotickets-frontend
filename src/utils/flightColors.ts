export const statusColors: Record<string, string> = {
  SCHEDULED: "bg-blue-500 text-white",
  BOARDING: "bg-indigo-500 text-white",
  "EN-ROUTE": "bg-green-500 text-white",
  LANDED: "bg-gray-500 text-white",
  DELAYED: "bg-yellow-500 text-black",
  DIVERTED: "bg-orange-600 text-white",
  EMERGENCY: "bg-red-700 text-white",
};

export const statusLabel = (status: string): string => {
  switch (status) {
    case "SCHEDULED": return "Programado";
    case "BOARDING":  return "Embarcando";
    case "EN-ROUTE":  return "En Ruta";
    case "LANDED":    return "Aterrizado";
    case "DELAYED":   return "Retrasado";
    case "DIVERTED":  return "Desviado";
    case "EMERGENCY": return "Emergencia";
    default:          return status;
  }
};

// Si delayMinutes === 0 queremos mostrar “A tiempo” en verde
export function onTimeBadge(delayMinutes?: number) {
  if ((delayMinutes ?? 0) <= 0) {
    return { text: "A tiempo", className: "bg-green-500 text-white" };
  }
  return { text: `Retraso ${delayMinutes} min`, className: "bg-yellow-500 text-black" };
}