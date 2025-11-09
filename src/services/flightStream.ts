import { normalizeFlight } from "@/utils/normalizeFlight";
import { API_BASE, ENDPOINTS } from "@/api/endpoints";

export type Flight = ReturnType<typeof normalizeFlight>;
export type OnFlightUpdate = (flight: Flight) => void;

export class FlightStream {
  private source?: EventSource;

  connect(onUpdate: OnFlightUpdate) {
    if (this.source) return;
    const url = `${API_BASE}${ENDPOINTS.LIVE.STREAM}`;
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
      setTimeout(() => this.connect(onUpdate), 5000);
    };
  }

  disconnect() {
    if (this.source) {
      this.source.close();
      this.source = undefined;
    }
  }
}