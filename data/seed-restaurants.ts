import { BudgetLevel, MichelinAward, TagType } from "@prisma/client";

export type SeedTag = {
  name: string;
  slug: string;
  type: TagType;
};

export type SeedRestaurant = {
  id: string;
  name: string;
  description: string;
  city: string;
  district: string;
  country: string;
  address: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  cuisine: string;
  chefName?: string;
  priceLabel: string;
  budget: BudgetLevel;
  award: MichelinAward;
  source: string;
  sourceUrl?: string;
  externalId: string;
  tags: SeedTag[];
};

const tag = (name: string, slug: string, type: TagType): SeedTag => ({
  name,
  slug,
  type
});

export const seedRestaurants: SeedRestaurant[] = [
  {
    id: "rest-paris-septime",
    name: "Septime",
    description:
      "A precise, relaxed Paris table with creative cooking and a younger energy.",
    city: "Paris",
    district: "11e",
    country: "France",
    address: "80 Rue de Charonne, 75011 Paris",
    latitude: 48.8537,
    longitude: 2.3822,
    imageUrl:
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Modern French",
    chefName: "Bertrand Grebaut",
    priceLabel: "$$$",
    budget: BudgetLevel.HIGH,
    award: MichelinAward.ONE_STAR,
    source: "demo-seed",
    sourceUrl: "https://guide.michelin.com/",
    externalId: "demo-septime",
    tags: [
      tag("Date", "date", TagType.OCCASION),
      tag("Trendy", "trendy", TagType.MOOD),
      tag("Creative", "creative", TagType.VIBE),
      tag("Modern French", "modern-french", TagType.CUISINE)
    ]
  },
  {
    id: "rest-paris-arpege",
    name: "Arpege",
    description:
      "A landmark vegetable-forward fine dining experience for a high-end moment.",
    city: "Paris",
    district: "7e",
    country: "France",
    address: "84 Rue de Varenne, 75007 Paris",
    latitude: 48.8558,
    longitude: 2.3167,
    imageUrl:
      "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Vegetable cuisine",
    chefName: "Alain Passard",
    priceLabel: "$$$$",
    budget: BudgetLevel.LUXURY,
    award: MichelinAward.THREE_STARS,
    source: "demo-seed",
    sourceUrl: "https://guide.michelin.com/",
    externalId: "demo-arpege",
    tags: [
      tag("Luxury", "luxe", TagType.MOOD),
      tag("Green", "green", TagType.FEATURE),
      tag("Date", "date", TagType.OCCASION),
      tag("Vegetable", "vegetable", TagType.CUISINE)
    ]
  },
  {
    id: "rest-paris-kei",
    name: "Kei",
    description:
      "French technique and Japanese sensibility in a polished, intimate setting.",
    city: "Paris",
    district: "1er",
    country: "France",
    address: "5 Rue Coq Heron, 75001 Paris",
    latitude: 48.8641,
    longitude: 2.3421,
    imageUrl:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80",
    cuisine: "French Japanese",
    chefName: "Kei Kobayashi",
    priceLabel: "$$$$",
    budget: BudgetLevel.LUXURY,
    award: MichelinAward.THREE_STARS,
    source: "demo-seed",
    sourceUrl: "https://guide.michelin.com/",
    externalId: "demo-kei",
    tags: [
      tag("Luxury", "luxe", TagType.MOOD),
      tag("Cosy", "cosy", TagType.MOOD),
      tag("Solo", "solo", TagType.OCCASION),
      tag("Japanese", "japanese", TagType.CUISINE)
    ]
  },
  {
    id: "rest-paris-frenchie",
    name: "Frenchie",
    description:
      "Compact, social and polished, with a food-lover atmosphere near Sentier.",
    city: "Paris",
    district: "2e",
    country: "France",
    address: "5 Rue du Nil, 75002 Paris",
    latitude: 48.8676,
    longitude: 2.3475,
    imageUrl:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Modern cuisine",
    chefName: "Gregory Marchand",
    priceLabel: "$$$",
    budget: BudgetLevel.HIGH,
    award: MichelinAward.ONE_STAR,
    source: "demo-seed",
    sourceUrl: "https://guide.michelin.com/",
    externalId: "demo-frenchie",
    tags: [
      tag("Friends", "friends", TagType.OCCASION),
      tag("Trendy", "trendy", TagType.MOOD),
      tag("Chill", "chill", TagType.MOOD),
      tag("Modern", "modern", TagType.CUISINE)
    ]
  },
  {
    id: "rest-paris-shabour",
    name: "Shabour",
    description:
      "A counter-led, lively restaurant built around sharing, rhythm and texture.",
    city: "Paris",
    district: "2e",
    country: "France",
    address: "19 Rue Saint-Sauveur, 75002 Paris",
    latitude: 48.8658,
    longitude: 2.3493,
    imageUrl:
      "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Middle Eastern",
    chefName: "Assaf Granit",
    priceLabel: "$$$",
    budget: BudgetLevel.HIGH,
    award: MichelinAward.ONE_STAR,
    source: "demo-seed",
    sourceUrl: "https://guide.michelin.com/",
    externalId: "demo-shabour",
    tags: [
      tag("Counter", "counter", TagType.FEATURE),
      tag("Friends", "friends", TagType.OCCASION),
      tag("Trendy", "trendy", TagType.MOOD),
      tag("Middle Eastern", "middle-eastern", TagType.CUISINE)
    ]
  },
  {
    id: "rest-paris-chocho",
    name: "Chocho",
    description:
      "A relaxed, sharp address with playful plates and an easy group energy.",
    city: "Paris",
    district: "10e",
    country: "France",
    address: "54 Rue de Paradis, 75010 Paris",
    latitude: 48.8754,
    longitude: 2.3519,
    imageUrl:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Creative",
    priceLabel: "$$",
    budget: BudgetLevel.MEDIUM,
    award: MichelinAward.SELECTED,
    source: "demo-seed",
    sourceUrl: "https://guide.michelin.com/",
    externalId: "demo-chocho",
    tags: [
      tag("Friends", "friends", TagType.OCCASION),
      tag("Chill", "chill", TagType.MOOD),
      tag("Smart budget", "smart-budget", TagType.VIBE),
      tag("Creative", "creative", TagType.CUISINE)
    ]
  },
  {
    id: "rest-tokyo-den",
    name: "Den",
    description:
      "Playful Japanese fine dining that feels personal, generous and memorable.",
    city: "Tokyo",
    district: "Jingumae",
    country: "Japan",
    address: "2 Chome-3-18 Jingumae, Shibuya City, Tokyo",
    latitude: 35.6719,
    longitude: 139.7084,
    imageUrl:
      "https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Japanese",
    chefName: "Zaiyu Hasegawa",
    priceLabel: "$$$$",
    budget: BudgetLevel.LUXURY,
    award: MichelinAward.TWO_STARS,
    source: "demo-seed",
    sourceUrl: "https://guide.michelin.com/",
    externalId: "demo-den",
    tags: [
      tag("Experience", "experience", TagType.VIBE),
      tag("Date", "date", TagType.OCCASION),
      tag("Japanese", "japanese", TagType.CUISINE),
      tag("Trendy", "trendy", TagType.MOOD)
    ]
  },
  {
    id: "rest-tokyo-narisawa",
    name: "Narisawa",
    description:
      "A nature-driven Tokyo institution with elegant pacing and strong identity.",
    city: "Tokyo",
    district: "Aoyama",
    country: "Japan",
    address: "2 Chome-6-15 Minamiaoyama, Minato City, Tokyo",
    latitude: 35.6712,
    longitude: 139.7202,
    imageUrl:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Innovative",
    chefName: "Yoshihiro Narisawa",
    priceLabel: "$$$$",
    budget: BudgetLevel.LUXURY,
    award: MichelinAward.GREEN_STAR,
    source: "demo-seed",
    sourceUrl: "https://guide.michelin.com/",
    externalId: "demo-narisawa",
    tags: [
      tag("Green", "green", TagType.FEATURE),
      tag("Luxury", "luxe", TagType.MOOD),
      tag("Experience", "experience", TagType.VIBE),
      tag("Innovative", "innovative", TagType.CUISINE)
    ]
  },
  {
    id: "rest-london-core",
    name: "Core by Clare Smyth",
    description:
      "Precise, warm and premium British fine dining for a special night out.",
    city: "London",
    district: "Notting Hill",
    country: "United Kingdom",
    address: "92 Kensington Park Rd, London",
    latitude: 51.5149,
    longitude: -0.2045,
    imageUrl:
      "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Modern British",
    chefName: "Clare Smyth",
    priceLabel: "$$$$",
    budget: BudgetLevel.LUXURY,
    award: MichelinAward.THREE_STARS,
    source: "demo-seed",
    sourceUrl: "https://guide.michelin.com/",
    externalId: "demo-core",
    tags: [
      tag("Date", "date", TagType.OCCASION),
      tag("Luxury", "luxe", TagType.MOOD),
      tag("Cosy", "cosy", TagType.MOOD),
      tag("British", "british", TagType.CUISINE)
    ]
  },
  {
    id: "rest-london-brat",
    name: "Brat",
    description:
      "Open-fire cooking with a lively room, made for friends and shared plates.",
    city: "London",
    district: "Shoreditch",
    country: "United Kingdom",
    address: "4 Redchurch St, London",
    latitude: 51.5245,
    longitude: -0.0757,
    imageUrl:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Wood fire",
    priceLabel: "$$$",
    budget: BudgetLevel.HIGH,
    award: MichelinAward.ONE_STAR,
    source: "demo-seed",
    sourceUrl: "https://guide.michelin.com/",
    externalId: "demo-brat",
    tags: [
      tag("Friends", "friends", TagType.OCCASION),
      tag("Trendy", "trendy", TagType.MOOD),
      tag("Fire cooking", "fire-cooking", TagType.FEATURE),
      tag("British", "british", TagType.CUISINE)
    ]
  },
  {
    id: "rest-newyork-atomix",
    name: "Atomix",
    description:
      "A polished Korean tasting counter with detail, design and narrative impact.",
    city: "New York",
    district: "NoMad",
    country: "United States",
    address: "104 E 30th St, New York",
    latitude: 40.7441,
    longitude: -73.9825,
    imageUrl:
      "https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Korean",
    chefName: "Junghyun Park",
    priceLabel: "$$$$",
    budget: BudgetLevel.LUXURY,
    award: MichelinAward.TWO_STARS,
    source: "demo-seed",
    sourceUrl: "https://guide.michelin.com/",
    externalId: "demo-atomix",
    tags: [
      tag("Counter", "counter", TagType.FEATURE),
      tag("Experience", "experience", TagType.VIBE),
      tag("Date", "date", TagType.OCCASION),
      tag("Korean", "korean", TagType.CUISINE)
    ]
  },
  {
    id: "rest-newyork-estela",
    name: "Estela",
    description:
      "An energetic downtown address with a casual-premium feel and sharp plates.",
    city: "New York",
    district: "Nolita",
    country: "United States",
    address: "47 E Houston St, New York",
    latitude: 40.7247,
    longitude: -73.9947,
    imageUrl:
      "https://images.unsplash.com/photo-1481833761820-0509d3217039?auto=format&fit=crop&w=1200&q=80",
    cuisine: "Contemporary",
    priceLabel: "$$$",
    budget: BudgetLevel.HIGH,
    award: MichelinAward.SELECTED,
    source: "demo-seed",
    sourceUrl: "https://guide.michelin.com/",
    externalId: "demo-estela",
    tags: [
      tag("Friends", "friends", TagType.OCCASION),
      tag("Trendy", "trendy", TagType.MOOD),
      tag("Chill", "chill", TagType.MOOD),
      tag("Contemporary", "contemporary", TagType.CUISINE)
    ]
  }
];
