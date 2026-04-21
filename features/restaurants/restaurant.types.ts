import type { RestaurantDto } from "@/types/api";

export type RestaurantFilters = {
  city?: string;
  budget?: string;
  tag?: string;
};

export type RestaurantSummary = RestaurantDto;
