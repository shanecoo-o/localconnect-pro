import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Worker } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const createWorkerIcon = (online: boolean) =>
  L.divIcon({
    className: "custom-marker",
    html: `<div style="width:32px;height:32px;border-radius:50%;background:${online ? "hsl(24,100%,50%)" : "hsl(0,0%,30%)"};border:3px solid ${online ? "hsl(24,100%,65%)" : "hsl(0,0%,45%)"};display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.4);">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

function MapBounds({ workers }: { workers: Worker[] }) {
  const map = useMap();
  useEffect(() => {
    if (workers.length > 0) {
      const bounds = L.latLngBounds(workers.map((w) => [w.location.lat, w.location.lng]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [workers, map]);
  return null;
}

export default function WorkerMap({ workers }: { workers: Worker[] }) {
  const navigate = useNavigate();

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden border border-border">
      <MapContainer
        center={[-8.830, 13.238]}
        zoom={13}
        className="h-full w-full"
        style={{ background: "hsl(0,0%,7%)" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <MapBounds workers={workers} />
        {workers.map((worker) => (
          <Marker
            key={worker.id}
            position={[worker.location.lat, worker.location.lng]}
            icon={createWorkerIcon(worker.online)}
            eventHandlers={{ click: () => navigate(`/worker/${worker.id}`) }}
          >
            <Popup className="worker-popup">
              <div style={{ fontFamily: "Inter, sans-serif", minWidth: 180 }}>
                <strong style={{ fontSize: 14 }}>{worker.name}</strong>
                <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
                  {worker.categories.join(", ")} • ⭐ {worker.rating}
                </div>
                <div style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>{worker.priceRange}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
