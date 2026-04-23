"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Crosshair,
  LocateFixed,
  Navigation,
  Search,
  Star
} from "lucide-react";
import type { RestaurantDto } from "@/types/api";
import { cn } from "@/lib/cn";

type LatLng = {
  lat: number;
  lng: number;
};

type LeafletModule = typeof import("leaflet");

type RestaurantWithDistance = RestaurantDto & {
  distanceKm?: number;
};

type RestaurantCluster = {
  key: string;
  lat: number;
  lng: number;
  items: RestaurantWithDistance[];
};

const awardLabels: Record<string, string> = {
  SELECTED: "Selected",
  BIB_GOURMAND: "Bib",
  ONE_STAR: "1 star",
  TWO_STARS: "2 stars",
  THREE_STARS: "3 stars",
  GREEN_STAR: "Green"
};

const awardTone: Record<string, string> = {
  THREE_STARS: "#b22d2d",
  TWO_STARS: "#7a1d1d",
  ONE_STAR: "#d6b25e",
  GREEN_STAR: "#425a46",
  BIB_GOURMAND: "#c9702b",
  SELECTED: "#8f6b46"
};

function distanceInKm(from: LatLng, to: LatLng) {
  const earthRadius = 6371;
  const dLat = ((to.lat - from.lat) * Math.PI) / 180;
  const dLng = ((to.lng - from.lng) * Math.PI) / 180;
  const lat1 = (from.lat * Math.PI) / 180;
  const lat2 = (to.lat * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) *
      Math.sin(dLng / 2) *
      Math.cos(lat1) *
      Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
}

function getCoordinates(restaurant: RestaurantDto): LatLng {
  return {
    lat: restaurant.latitude as number,
    lng: restaurant.longitude as number
  };
}

function formatAward(award: string) {
  return awardLabels[award] || award.replaceAll("_", " ");
}

function getClusterStep(zoom: number) {
  if (zoom >= 11) return 0;
  if (zoom >= 9) return 0.18;
  if (zoom >= 7) return 0.42;
  if (zoom >= 5) return 0.9;
  return 1.6;
}

function clusterRestaurants(
  restaurants: RestaurantWithDistance[],
  zoom: number
): RestaurantCluster[] {
  const step = getClusterStep(zoom);

  if (step === 0) {
    return restaurants.map((restaurant) => ({
      key: restaurant.id,
      lat: restaurant.latitude as number,
      lng: restaurant.longitude as number,
      items: [restaurant],
    }));
  }

  const buckets = new Map<string, RestaurantCluster>();

  for (const restaurant of restaurants) {
    const lat = restaurant.latitude as number;
    const lng = restaurant.longitude as number;
    const latBucket = Math.round(lat / step);
    const lngBucket = Math.round(lng / step);
    const key = `${latBucket}:${lngBucket}`;
    const current = buckets.get(key);

    if (current) {
      current.items.push(restaurant);
      current.lat =
        current.items.reduce((sum, item) => sum + (item.latitude as number), 0) /
        current.items.length;
      current.lng =
        current.items.reduce((sum, item) => sum + (item.longitude as number), 0) /
        current.items.length;
      continue;
    }

    buckets.set(key, {
      key,
      lat,
      lng,
      items: [restaurant],
    });
  }

  return Array.from(buckets.values());
}

function makeRestaurantIcon(leaflet: LeafletModule, restaurant: RestaurantDto) {
  const color = awardTone[restaurant.award] || "#12100d";
  const label =
    restaurant.award === "THREE_STARS"
      ? "3"
      : restaurant.award === "TWO_STARS"
        ? "2"
        : restaurant.award === "ONE_STAR"
          ? "1"
          : "";

  return leaflet.divIcon({
    className: "michelin-map-marker",
    html: `<span class="michelin-map-marker-dot ${label ? "has-label" : "is-selected"}" style="background:${color}"><span>${label}</span></span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -18]
  });
}

function makeClusterIcon(leaflet: LeafletModule, count: number) {
  const size =
    count >= 20 ? "large" : count >= 8 ? "medium" : "small";

  return leaflet.divIcon({
    className: "michelin-cluster-container",
    html: `<span class="michelin-cluster-icon ${size}"><span>${count}</span></span>`,
    iconSize: [52, 52],
    iconAnchor: [26, 26],
  });
}

function makeUserIcon(leaflet: LeafletModule) {
  return leaflet.divIcon({
    className: "michelin-user-marker",
    html: `<span class="michelin-user-marker-dot"></span>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
}

export function MapView({ restaurants }: { restaurants: RestaurantDto[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const leafletRef = useRef<LeafletModule | null>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markerLayerRef = useRef<import("leaflet").LayerGroup | null>(null);
  const userLayerRef = useRef<import("leaflet").LayerGroup | null>(null);

  const [query, setQuery] = useState("");
  const [city, setCity] = useState("all");
  const [award, setAward] = useState("all");
  const [budget, setBudget] = useState("all");
  const [radiusKm, setRadiusKm] = useState(10);
  const [nearbyOnly, setNearbyOnly] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [mapZoom, setMapZoom] = useState(6);
  const [activeRestaurantId, setActiveRestaurantId] = useState<string | null>(
    null
  );

  const mapReadyRestaurants = useMemo(
    () =>
      restaurants.filter(
        (restaurant) =>
          restaurant.latitude !== null && restaurant.longitude !== null
      ),
    [restaurants]
  );

  const cities = useMemo(
    () =>
      Array.from(
        new Set(mapReadyRestaurants.map((restaurant) => restaurant.city))
      ).sort((a, b) => a.localeCompare(b)),
    [mapReadyRestaurants]
  );

  const awards = useMemo(
    () => Array.from(new Set(mapReadyRestaurants.map((item) => item.award))),
    [mapReadyRestaurants]
  );

  const budgets = useMemo(
    () => Array.from(new Set(mapReadyRestaurants.map((item) => item.budget))),
    [mapReadyRestaurants]
  );

  const center = useMemo(() => {
    // Default to center of France
    return { lat: 46.2276, lng: 2.2137 };
  }, []);

  const visible = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return mapReadyRestaurants
      .map((restaurant): RestaurantWithDistance => {
        if (!userLocation) {
          return restaurant;
        }

        return {
          ...restaurant,
          distanceKm: distanceInKm(userLocation, getCoordinates(restaurant))
        };
      })
      .filter((restaurant) => city === "all" || restaurant.city === city)
      .filter((restaurant) => award === "all" || restaurant.award === award)
      .filter((restaurant) => budget === "all" || restaurant.budget === budget)
      .filter((restaurant) => {
        if (!normalizedQuery) {
          return true;
        }

        return [
          restaurant.name,
          restaurant.city,
          restaurant.country,
          restaurant.cuisine,
          restaurant.award,
          restaurant.chefName,
          restaurant.description
        ]
          .filter(Boolean)
          .some((value) => value?.toLowerCase().includes(normalizedQuery));
      })
      .filter((restaurant) => {
        if (!nearbyOnly || !userLocation) {
          return true;
        }

        return (restaurant.distanceKm ?? Number.POSITIVE_INFINITY) <= radiusKm;
      })
      .sort((a, b) => {
        if (userLocation) {
          return (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999);
        }

        return a.name.localeCompare(b.name);
      });
  }, [
    award,
    budget,
    city,
    mapReadyRestaurants,
    nearbyOnly,
    query,
    radiusKm,
    userLocation
  ]);

  useEffect(() => {
    let disposed = false;

    async function bootMap() {
      if (!containerRef.current || mapRef.current) {
        return;
      }

      const leaflet = await import("leaflet");

      if (disposed || !containerRef.current) {
        return;
      }

      leafletRef.current = leaflet;

      const map = leaflet.map(containerRef.current, {
        zoomControl: false,
        scrollWheelZoom: true
      });

      leaflet
        .tileLayer(
          "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
            maxZoom: 20,
            subdomains: "abcd"
          }
        )
        .addTo(map);

      leaflet.control.zoom({ position: "bottomright" }).addTo(map);

      markerLayerRef.current = leaflet.layerGroup().addTo(map);
      userLayerRef.current = leaflet.layerGroup().addTo(map);
      map.setView([center.lat, center.lng], 6);
      setMapZoom(map.getZoom());
      map.on("zoomend", () => {
        setMapZoom(map.getZoom());
      });
      mapRef.current = map;

      window.setTimeout(() => map.invalidateSize(), 120);
    }

    bootMap();

    return () => {
      disposed = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markerLayerRef.current = null;
      userLayerRef.current = null;
    };
  }, [center.lat, center.lng]);

  useEffect(() => {
    // Auto-locate on mount
    const timer = setTimeout(() => {
      locateUser();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const leaflet = leafletRef.current;
    const map = mapRef.current;
    const markerLayer = markerLayerRef.current;

    if (!leaflet || !map || !markerLayer) {
      return;
    }

    markerLayer.clearLayers();
    const clustered = clusterRestaurants(visible, mapZoom);

    for (const cluster of clustered) {
      if (cluster.items.length === 1) {
        const restaurant = cluster.items[0];
        const coordinates = getCoordinates(restaurant);
        const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`;

        leaflet
          .marker([coordinates.lat, coordinates.lng], {
            icon: makeRestaurantIcon(leaflet, restaurant)
          })
          .bindPopup(
            `<div class="michelin-popup">
              <strong>${restaurant.name}</strong><br/>
              <span>${formatAward(restaurant.award)} - ${restaurant.cuisine || restaurant.city}</span>
              <div class="michelin-popup-actions">
                <a href="/restaurants/${restaurant.id}" class="michelin-popup-link">Voir détails</a>
                <a href="${gmapsUrl}" target="_blank" rel="noopener noreferrer" class="michelin-popup-gmaps">
                  Google Maps
                </a>
              </div>
            </div>`
          )
          .on("click", () => {
            setActiveRestaurantId(restaurant.id);
          })
          .addTo(markerLayer);
        continue;
      }

      leaflet
        .marker([cluster.lat, cluster.lng], {
          icon: makeClusterIcon(leaflet, cluster.items.length)
        })
        .on("click", () => {
          map.flyTo([cluster.lat, cluster.lng], Math.min(mapZoom + 2, 13), {
            duration: 0.45,
          });
        })
        .addTo(markerLayer);
    }
  }, [mapZoom, visible]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map || visible.length === 0) {
      return;
    }

    const markerBounds = visible.map((restaurant) => [
      restaurant.latitude as number,
      restaurant.longitude as number,
    ]) as Array<[number, number]>;

    if (markerBounds.length > 0) {
      map.fitBounds(markerBounds, {
        padding: [48, 48],
        maxZoom: markerBounds.length === 1 ? 14 : 13
      });
    }
  }, [visible]);

  useEffect(() => {
    const leaflet = leafletRef.current;
    const userLayer = userLayerRef.current;

    if (!leaflet || !userLayer) {
      return;
    }

    userLayer.clearLayers();

    if (!userLocation) {
      return;
    }

    leaflet
      .circle([userLocation.lat, userLocation.lng], {
        radius: radiusKm * 1000,
        color: "#b22d2d",
        fillColor: "#b22d2d",
        fillOpacity: 0.08,
        weight: 1
      })
      .addTo(userLayer);

    leaflet
      .marker([userLocation.lat, userLocation.lng], {
        icon: makeUserIcon(leaflet)
      })
      .addTo(userLayer);
  }, [radiusKm, userLocation]);

  function locateUser() {
    if (!("geolocation" in navigator)) {
      setLocationError("Location is unavailable on this device.");
      return;
    }

    setLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        setUserLocation(nextLocation);
        setNearbyOnly(true);
        setCity("all");
        mapRef.current?.flyTo([nextLocation.lat, nextLocation.lng], 13, {
          duration: 0.8
        });
        setLocating(false);
      },
      () => {
        setLocationError("Location permission was refused.");
        setLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 9000
      }
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
      <section className="overflow-hidden rounded-lg border border-ink/10 bg-white/75 shadow-sm">
        <div className="grid gap-3 border-b border-ink/10 p-4 lg:grid-cols-[1.1fr_0.9fr]">
          <label className="relative block">
            <Search
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search restaurant, city, cuisine"
              className="h-11 w-full rounded-lg border border-ink/10 bg-porcelain pl-10 pr-3 text-sm font-medium text-ink outline-none transition focus:border-ink"
            />
          </label>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <select
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className="h-11 rounded-lg border border-ink/10 bg-porcelain px-3 text-sm font-semibold text-ink/70 outline-none"
            >
              <option value="all">All cities</option>
              {cities.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={award}
              onChange={(event) => setAward(event.target.value)}
              className="h-11 rounded-lg border border-ink/10 bg-porcelain px-3 text-sm font-semibold text-ink/70 outline-none"
            >
              <option value="all">All awards</option>
              {awards.map((item) => (
                <option key={item} value={item}>
                  {formatAward(item)}
                </option>
              ))}
            </select>

            <select
              value={budget}
              onChange={(event) => setBudget(event.target.value)}
              className="h-11 rounded-lg border border-ink/10 bg-porcelain px-3 text-sm font-semibold text-ink/70 outline-none"
            >
              <option value="all">All budgets</option>
              {budgets.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={radiusKm}
              onChange={(event) => setRadiusKm(Number(event.target.value))}
              className="h-11 rounded-lg border border-ink/10 bg-porcelain px-3 text-sm font-semibold text-ink/70 outline-none"
            >
              {[2, 5, 10, 25, 50].map((item) => (
                <option key={item} value={item}>
                  {item} km
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:col-span-2">
            <button
              onClick={locateUser}
              disabled={locating}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-ink px-4 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-60"
            >
              <LocateFixed size={17} />
              {locating ? "Locating" : "Near me"}
            </button>

            <button
              onClick={() => setNearbyOnly((current) => !current)}
              disabled={!userLocation}
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-lg border border-ink/10 px-4 text-sm font-semibold transition disabled:opacity-50",
                nearbyOnly
                  ? "bg-rouge text-white"
                  : "bg-porcelain text-ink/70 hover:bg-white"
              )}
            >
              <Crosshair size={17} />
              Radius only
            </button>

            <span className="text-sm font-semibold text-ink/50">
              {visible.length} located restaurants
            </span>

            {locationError ? (
              <span className="text-sm font-semibold text-rouge">
                {locationError}
              </span>
            ) : null}
          </div>
        </div>

        <div className="relative h-[68vh] min-h-[520px]">
          <div ref={containerRef} className="h-full w-full" />
          {visible.length === 0 ? (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
              <div className="rounded-lg border border-ink/10 bg-porcelain/95 p-5 text-center shadow-premium">
                <p className="text-sm font-semibold text-ink">
                  No restaurant matches these filters.
                </p>
                <p className="mt-1 text-sm text-ink/60">
                  Try another city, award, budget or radius.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <aside className="space-y-3">
        <div className="rounded-lg border border-ink/10 bg-white/70 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rouge">
            Nearby list
          </p>
          <h2 className="mt-1 text-xl font-semibold text-ink">
            {userLocation ? "Closest picks" : "Visible picks"}
          </h2>
        </div>

        <div className="max-h-[72vh] space-y-3 overflow-y-auto pr-1">
          {visible.map((restaurant) => (
            <Link
              key={restaurant.id}
              href={`/restaurants/${restaurant.id}`}
              onMouseEnter={() => {
                setActiveRestaurantId(restaurant.id);
                const coordinates = getCoordinates(restaurant);
                mapRef.current?.flyTo([coordinates.lat, coordinates.lng], 14, {
                  duration: 0.45
                });
              }}
              className={cn(
                "block rounded-lg border border-ink/10 bg-white/70 p-4 shadow-sm transition hover:bg-white",
                activeRestaurantId === restaurant.id &&
                  "border-rouge bg-white shadow-premium"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">
                    {restaurant.name}
                  </p>
                  <p className="mt-1 text-xs font-medium text-ink/50">
                    {[restaurant.district, restaurant.city]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-ink px-2 py-1 text-xs font-semibold text-champagne">
                  <Star size={12} fill="currentColor" />
                  {formatAward(restaurant.award)}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between gap-2 text-xs font-semibold text-ink/50">
                <span>{restaurant.cuisine || restaurant.budget}</span>
                {restaurant.distanceKm !== undefined ? (
                  <span className="inline-flex items-center gap-1">
                    <Navigation size={13} />
                    {restaurant.distanceKm.toFixed(1)} km
                  </span>
                ) : null}
              </div>
            </Link>
          ))}

          {visible.length === 0 ? (
            <div className="rounded-lg border border-dashed border-ink/20 bg-white/50 p-5 text-sm leading-6 text-ink/60">
              No pins for this filter set.
            </div>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
