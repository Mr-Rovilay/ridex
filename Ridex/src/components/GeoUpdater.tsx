"use client";
import { getSocket } from "@/lib/socket";
import { useEffect, useRef } from "react";

const GeoUpdater = ({ userId }: { userId: string }) => {
  const socketRef = useRef<any>(null);

  useEffect(() => {
    if (!userId || !navigator.geolocation) return;

    // Initialize socket
    socketRef.current = getSocket();
    
    // Register identity
    socketRef.current.emit("identity", { data: userId });

    const watcher = navigator.geolocation.watchPosition(
      ({ coords }) => {
        if (socketRef.current) {
          socketRef.current.emit("update-location", {
            userId,
            latitude: coords.latitude,
            longitude: coords.longitude,
          });
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000, // Added timeout for better reliability
      }
    );

    // Cleanup: Clear the geolocation watch
    return () => {
      navigator.geolocation.clearWatch(watcher);
      // Optional: if getSocket() creates a new instance, 
      // you might want to call socketRef.current.disconnect() here
    };
  }, [userId]);

  return null;
};

export default GeoUpdater;