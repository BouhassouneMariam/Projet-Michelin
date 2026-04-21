import { z } from "zod";

export const recommendationInputSchema = z.object({
  occasion: z.string().optional(),
  vibes: z.array(z.string()).default([]),
  budget: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional()
});

export type RecommendationInput = z.infer<typeof recommendationInputSchema>;
