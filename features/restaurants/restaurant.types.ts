import type { RestaurantDto } from "@/types/api";

export type RestaurantFilters = {
  city?: string;
  country?: string;
  budget?: string;
  award?: string;
  tag?: string;
  search?: string;
  limit?: number;
  mapReady?: boolean;
};

export type RestaurantSummary = RestaurantDto;
