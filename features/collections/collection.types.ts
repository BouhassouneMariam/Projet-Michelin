import type { CollectionDto } from "@/types/api";

export type CollectionSummary = CollectionDto;

export type CollectionListItem = {
  id: string;
  title: string;
  description: string | null;
  isPublic: boolean;
  restaurantCount: number;
};
