"use client";
import axios from "axios";
import L from "leaflet";
import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
} from "react-leaflet";
import { Loader2, MapPin, Navigation2 } from "lucide-react";

type props = {
  pickUp: string;
  drop: string;
  pickUpLat: number;
  pickUpLon: number;
  dropLat: number;
  dropLon: number;
  onChange: (p: string, d: string) => void;
  onDistance: (d: number, duration: number) => void;
};

function FitBounds({ p1, p2 }: { p1: [number, number]; p2: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    setTimeout(() => {
      map.invalidateSize();
      map.fitBounds([p1, p2], {
        padding: [50, 50],
        maxZoom: 14,
        animate: true,
        duration: 1,
      });
    }, 100);
  }, [p1, p2, map]);
  return null;
}

// Custom pick up icon - Light theme
const pickUpIcon = new L.DivIcon({
  html: `<div class="flex flex-col items-center">
    <div class="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-t-lg shadow-lg" style="font-family: system-ui; white-space: nowrap;">
      📍 PICKUP
    </div>
    <div class="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-green-500"></div>
  </div>`,
  className: "",
  iconSize: [80, 48],
  iconAnchor: [40, 48],
});

// Custom drop off icon - Light theme
const dropIcon = new L.DivIcon({
  html: `<div class="flex flex-col items-center">
    <div class="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-t-lg shadow-lg" style="font-family: system-ui; white-space: nowrap;">
      🏁 DROP
    </div>
    <div class="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-red-500"></div>
  </div>`,
  className: "",
  iconSize: [80, 48],
  iconAnchor: [40, 48],
});

function SearchMap({ pickUp, drop, pickUpLat, pickUpLon, dropLat, dropLon, onChange, onDistance }: props) {
  const [p1, setP1] = useState<[number, number] | null>(null);
  const [p2, setP2] = useState<[number, number] | null>(null);
  const [route, setRoute] = useState<[number, number][]>([]);
  const [km, setKm] = useState<number | null>(0);
  const [duration, setDuration] = useState<number>(0);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const geoCoding = async (q: string): Promise<[number, number] | null> => {
    try {
      const { data } = await axios.get(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=1`
      );
      if (!data.features.length) return null;
      const [lon, lat] = data.features[0].geometry.coordinates;
      return [lat, lon];
    } catch (error) {
      return null;
    }
  };

  const reverseGeoCoding = async (lat: number, lon: number) => {
    try {
      const { data } = await axios.get(
        `https://photon.komoot.io/reverse?lon=${lon}&lat=${lat}`
      );
      if (!data.features.length) return null;
      const p = data.features[0].properties;
      return [p.name, p.street, p.city, p.state, p.country]
        .filter(Boolean)
        .join(", ");
    } catch (error) {
      return null;
    }
  };

  const loadRoute = async (start: [number, number], end: [number, number]) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`
      );
      if (!data.routes.length) return;
      
      setRoute(
        data.routes[0].geometry.coordinates.map(([lon, lat]: number[]) => [
          lat,
          lon,
        ])
      );
      
      const distKm = +(data.routes[0].distance / 1000).toFixed(2);
      const durationMin = Math.round(data.routes[0].duration / 60);
      
      setKm(distKm);
      setDuration(durationMin);
      onDistance(distKm, durationMin);
    } catch (error) {
      console.error("Error loading route:", error);
    } finally {
      setLoading(false);
    }
  };

  const dragPickUp = async (lat: number, lon: number) => {
    const addr = await reverseGeoCoding(lat, lon);
    setP1([lat, lon]);
    if (p2) {
      await loadRoute([lat, lon], p2);
    }
    if (addr) onChange?.(addr, drop);
  };

  const dragDropOff = async (lat: number, lon: number) => {
    const addr = await reverseGeoCoding(lat, lon);
    setP2([lat, lon]);
    if (p1) {
      await loadRoute(p1, [lat, lon]);
    }
    if (addr) onChange?.(pickUp, addr);
  };

  // Initialize from coordinates or geocode
useEffect(() => {
  if (initialized) return; // ✅ PREVENT RESET AFTER DRAG

  const initializeRoute = async () => {
    setReady(false);

    let start: [number, number] | null = null;
    let end: [number, number] | null = null;

    if (pickUpLat && pickUpLon && !isNaN(pickUpLat)) {
      start = [pickUpLat, pickUpLon];
      setP1(start);
    } else if (pickUp) {
      start = await geoCoding(pickUp);
      if (start) setP1(start);
    }

    if (dropLat && dropLon && !isNaN(dropLat)) {
      end = [dropLat, dropLon];
      setP2(end);
    } else if (drop) {
      end = await geoCoding(drop);
      if (end) setP2(end);
    }

    if (start && end) {
      await loadRoute(start, end);
    }

    setReady(true);
    setInitialized(true); // ✅ lock it
  };

  initializeRoute();
}, [pickUpLat, pickUpLon, dropLat, dropLon]);

  return (
    <div className="relative h-full w-full">
      <MapContainer
        style={{ width: "100%", height: "100%" }}
        center={p1 ?? [20.5937, 78.9629]}
        zoom={13}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {p1 && p2 && <FitBounds p1={p1} p2={p2} />}
        {p1 && (
          <Marker
            position={p1}
            icon={pickUpIcon}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const m = e.target.getLatLng();
                dragPickUp(m.lat, m.lng);
              },
            }}
          />
        )}
        {p2 && (
          <Marker
            position={p2}
            icon={dropIcon}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const m = e.target.getLatLng();
                dragDropOff(m.lat, m.lng);
              },
            }}
          />
        )}
        {route.length > 0 && (
          <Polyline
            positions={route}
            pathOptions={{
              color: "#3b82f6",
              weight: 5,
              lineCap: "round",
              lineJoin: "round",
              opacity: 0.9,
            }}
          />
        )}
      </MapContainer>

      {/* Loading Overlay - Clean white version */}
      <AnimatePresence>
        {(!ready || loading) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-10"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <MapPin size={16} className="text-gray-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="text-center">
                <p className="text-gray-900 font-medium">Loading map</p>
                <p className="text-gray-500 text-sm">Plotting your route...</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Distance Badge - Clean white version */}
      <AnimatePresence>
        {ready && km !== null && !loading && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-white shadow-lg rounded-full border border-gray-200 px-4 py-2"
          >
            <div className="flex items-center gap-3">
              <Navigation2 className="w-4 h-4 text-blue-600" />
              <span className="text-gray-900 font-semibold">{km} km</span>
              <span className="w-px h-4 bg-gray-300" />
              <span className="text-gray-600 text-sm">~{duration} min</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SearchMap;