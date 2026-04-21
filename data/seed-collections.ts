import { DEMO_USER_ID } from "./seed-users";

export const seedCollections = [
  {
    id: "collection-demo-date",
    title: "Mes restos date",
    description: "Tables cosy, precise and a little cinematic.",
    ownerId: DEMO_USER_ID,
    restaurantIds: ["rest-paris-septime", "rest-paris-kei", "rest-london-core"]
  },
  {
    id: "collection-demo-a-tester",
    title: "A tester",
    description: "Shortlist for the next trip with friends.",
    ownerId: DEMO_USER_ID,
    restaurantIds: ["rest-paris-shabour", "rest-paris-chocho", "rest-newyork-estela"]
  },
  {
    id: "collection-ines-paris",
    title: "Paris after work",
    description: "Premium but not stiff, good rooms, good stories.",
    ownerId: "user-ines",
    restaurantIds: ["rest-paris-frenchie", "rest-paris-shabour", "rest-paris-septime"]
  },
  {
    id: "collection-nora-tokyo",
    title: "Food trip Tokyo",
    description: "High-impact places for a Tokyo week.",
    ownerId: "user-nora",
    restaurantIds: ["rest-tokyo-den", "rest-tokyo-narisawa"]
  }
];
