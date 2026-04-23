"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

type MapPickerProps = {
  lat?: number | null;
  lng?: number | null;
  onChange: (lat: number, lng: number) => void;
};

export function MapPicker({ lat, lng, onChange }: MapPickerProps) {
  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mapInstance: any = null;

    async function init() {
      if (!containerRef.current || mapRef.current) return;
      
      // Check if Leaflet already initialized this container (avoids "Map container is already initialized")
      // @ts-ignore
      if (containerRef.current._leaflet_id) return;

      const L = (await import("leaflet")).default;
      
      // Fix for default icons
      // @ts-ignore
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      });

      const initialLat = lat || 46.2276;
      const initialLng = lng || 2.2137;
      const initialZoom = lat ? 15 : 6;

      try {
        mapInstance = L.map(containerRef.current).setView([initialLat, initialLng], initialZoom);
        
        L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
          attribution: '&copy; OpenStreetMap'
        }).addTo(mapInstance);

        const marker = L.marker([initialLat, initialLng], { draggable: true }).addTo(mapInstance);
        markerRef.current = marker;

        marker.on("dragend", () => {
          const pos = marker.getLatLng();
          onChange(pos.lat, pos.lng);
        });

        mapInstance.on("click", (e: any) => {
          marker.setLatLng(e.latlng);
          onChange(e.latlng.lat, e.latlng.lng);
        });

        mapRef.current = mapInstance;
        setIsReady(true);
        
        setTimeout(() => {
          if (mapInstance) mapInstance.invalidateSize();
        }, 200);
      } catch (e) {
        console.error("Leaflet init error:", e);
      }
    }

    init();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); // Only on mount

  useEffect(() => {
    if (isReady && mapRef.current && markerRef.current && lat && lng) {
      const current = markerRef.current.getLatLng();
      if (Math.abs(current.lat - lat) > 0.0001 || Math.abs(current.lng - lng) > 0.0001) {
        markerRef.current.setLatLng([lat, lng]);
        mapRef.current.panTo([lat, lng]);
      }
    }
  }, [lat, lng, isReady]);

  return (
    <div className="space-y-2">
      <div 
        ref={containerRef} 
        className="h-64 w-full rounded-xl border border-ink/10 bg-porcelain shadow-inner overflow-hidden" 
        style={{ minHeight: "256px", zIndex: 0 }}
      />
      <p className="text-[10px] font-medium text-ink/40 uppercase tracking-wider">
        Positionnez le marqueur sur la carte
      </p>
    </div>
  );
}
