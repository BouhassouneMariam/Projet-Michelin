import { z } from "zod";

export const createCollectionSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  isPublic: z.boolean().optional()
});

export const updateCollectionSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").optional(),
  description: z.string().optional(),
  isPublic: z.boolean().optional()
});

export const addRestaurantToCollectionSchema = z.object({
  restaurantId: z.string().min(1, "Restaurant ID is required"),
  note: z.string().optional()
});

export type CreateCollectionInput = z.infer<typeof createCollectionSchema>;
export type UpdateCollectionInput = z.infer<typeof updateCollectionSchema>;
export type AddRestaurantToCollectionInput = z.infer<typeof addRestaurantToCollectionSchema>;
