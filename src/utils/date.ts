// Devuelve ISO-8601 en UTC con 'Z', sin milisegundos (compatible con OffsetDateTime)
export function toIsoZ(x?: string | Date) {
  if (!x) return undefined;
  const d = typeof x === "string" ? new Date(x) : x;
  if (isNaN(d.getTime())) return undefined;
  return d.toISOString().replace(/\.\d{3}Z$/, "Z");
}