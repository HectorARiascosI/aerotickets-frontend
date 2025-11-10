import { normalizeFlight } from "@/utils/normalizeFlight";
import { API_BASE, ENDPOINTS } from "@/api/endpoints";

export type Flight = ReturnType<typeof normalizeFlight>;
export type OnFlightUpdate = (flight: Flight) => void;

function withApiPrefix(path: string) {
  if (!path.startsWith("/")) return "/api/" + path;
  return path.startsWith("/api/") ? path : "/api" + path;
}

export class FlightStream {
  private source?: EventSource;
  private reconnectTimer?: number;

  connect(onUpdate: OnFlightUpdate) {
    if (this.source) return;
    const raw = (ENDPOINTS as any)?.LIVE?.STREAM ?? "/live/stream";
    const path = withApiPrefix(raw);
    const url = `${API_BASE}${path}`;
    this.source = new EventSource(url);

    this.source.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (Array.isArray(data)) {
          data.forEach((f) => onUpdate(normalizeFlight(f)));
        } else {
          onUpdate(normalizeFlight(data));
        }
      } catch {}
    };

    this.source.onerror = () => {
      this.disconnect();
      const backoff = 3000 + Math.floor(Math.random() * 6000);
      this.reconnectTimer = window.setTimeout(() => this.connect(onUpdate), backoff);
    };
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = undefined;
    }
    if (this.source) {
      this.source.close();
      this.source = undefined;
    }
  }
}