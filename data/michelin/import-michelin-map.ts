import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  BudgetLevel,
  MichelinAward,
  Prisma,
  PrismaClient,
  TagType
} from "@prisma/client";

const CSV_PATH = path.join(
  process.cwd(),
  "data",
  "michelin",
  "raw",
  "michelin-my-maps.csv"
);

const MAP_CITIES = new Set([
  "Bangkok",
  "Barcelona",
  "Beijing",
  "Chicago",
  "Dubai",
  "Hong Kong",
  "Kyoto",
  "London",
  "Madrid",
  "Milan",
  "New York",
  "Osaka",
  "Paris",
  "Rome",
  "San Francisco",
  "Seoul",
  "Shanghai",
  "Singapore",
  "Tokyo",
  "Washington"
]);

type MichelinMapRow = {
  name: string;
  address: string | null;
  city: string;
  country: string;
  price: string | null;
  cuisine: string | null;
  longitude: number;
  latitude: number;
  phone: string | null;
  url: string | null;
  websiteUrl: string | null;
  award: string;
  greenStar: boolean;
  description: string | null;
};

type ImportTag = {
  name: string;
  slug: string;
  type: TagType;
};

function parseCsvLine(line: string) {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      fields.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  fields.push(current.trim());

  return fields;
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function parseLocation(location: string) {
  const parts = location.split(",").map((part) => part.trim()).filter(Boolean);

  return {
    city: parts[0] || "Unknown",
    country: parts[parts.length - 1] || "Unknown"
  };
}

function awardFromValue(value: string, greenStar: boolean) {
  if (greenStar) {
    return MichelinAward.GREEN_STAR;
  }

  if (value.includes("3")) {
    return MichelinAward.THREE_STARS;
  }

  if (value.includes("2")) {
    return MichelinAward.TWO_STARS;
  }

  if (value.includes("1")) {
    return MichelinAward.ONE_STAR;
  }

  if (value.toLowerCase().includes("bib")) {
    return MichelinAward.BIB_GOURMAND;
  }

  return MichelinAward.SELECTED;
}

function budgetFromPrice(price: string | null) {
  const length = price?.trim().length ?? 0;

  if (length <= 1) {
    return BudgetLevel.LOW;
  }

  if (length === 2) {
    return BudgetLevel.MEDIUM;
  }

  if (length === 3) {
    return BudgetLevel.HIGH;
  }

  return BudgetLevel.LUXURY;
}

function addTag(tags: Map<string, ImportTag>, tag: ImportTag) {
  if (!tags.has(tag.slug)) {
    tags.set(tag.slug, tag);
  }
}

function tagsFor(row: MichelinMapRow) {
  const tags: ImportTag[] = [];
  const award = awardFromValue(row.award, row.greenStar);

  tags.push({
    name: row.city,
    slug: `city-${slugify(row.city)}`,
    type: TagType.FEATURE
  });

  tags.push({
    name: award.replaceAll("_", " "),
    slug: `award-${slugify(award)}`,
    type: TagType.FEATURE
  });

  if (row.cuisine) {
    for (const cuisine of row.cuisine.split(",").map((item) => item.trim())) {
      if (!cuisine) {
        continue;
      }

      tags.push({
        name: cuisine,
        slug: `cuisine-${slugify(cuisine)}`,
        type: TagType.CUISINE
      });
    }
  }

  if (
    award === MichelinAward.TWO_STARS ||
    award === MichelinAward.THREE_STARS
  ) {
    tags.push({ name: "Luxury", slug: "luxe", type: TagType.MOOD });
    tags.push({ name: "Experience", slug: "experience", type: TagType.VIBE });
    tags.push({ name: "Date", slug: "date", type: TagType.OCCASION });
  }

  if (row.price && row.price.length <= 2) {
    tags.push({ name: "Chill", slug: "chill", type: TagType.MOOD });
    tags.push({ name: "Friends", slug: "friends", type: TagType.OCCASION });
  }

  return tags;
}

function readMichelinMapCsv() {
  if (!existsSync(CSV_PATH)) {
    return [];
  }

  const lines = readFileSync(CSV_PATH, "utf8")
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0);
  const rows = lines.slice(1);

  return rows
    .map((line) => {
      const [
        name,
        address,
        location,
        price,
        cuisine,
        longitudeRaw,
        latitudeRaw,
        phone,
        url,
        websiteUrl,
        award,
        greenStarRaw,
        _facilities,
        description
      ] = parseCsvLine(line);
      const longitude = Number.parseFloat(longitudeRaw);
      const latitude = Number.parseFloat(latitudeRaw);
      const parsedLocation = parseLocation(location);

      if (
        !name ||
        !parsedLocation.city ||
        !MAP_CITIES.has(parsedLocation.city) ||
        Number.isNaN(longitude) ||
        Number.isNaN(latitude)
      ) {
        return null;
      }

      return {
        name,
        address: address || null,
        city: parsedLocation.city,
        country: parsedLocation.country,
        price: price || null,
        cuisine: cuisine || null,
        longitude,
        latitude,
        phone: phone || null,
        url: url || null,
        websiteUrl: websiteUrl || null,
        award: award || "Selected",
        greenStar: greenStarRaw === "1",
        description: description || null
      };
    })
    .filter((row): row is MichelinMapRow => row !== null);
}

export async function seedMichelinMapRestaurants(prisma: PrismaClient) {
  const rows = readMichelinMapCsv();

  if (rows.length === 0) {
    console.warn("Michelin map CSV not found or empty. Skipping map import.");
    return;
  }

  const restaurants: Prisma.RestaurantCreateManyInput[] = [];
  const tagBySlug = new Map<string, ImportTag>();
  const tagSlugsByExternalId = new Map<string, string[]>();

  for (const row of rows) {
    const externalId = `michelin-map-${slugify(
      row.url || `${row.name}-${row.address}-${row.city}`
    )}`;
    const award = awardFromValue(row.award, row.greenStar);
    const tags = tagsFor(row);

    restaurants.push({
      id: externalId,
      name: row.name,
      description:
        row.description ||
        `A Michelin ${row.award.toLowerCase()} restaurant in ${row.city}, ${row.country}.`,
      city: row.city,
      country: row.country,
      address: row.address,
      latitude: row.latitude,
      longitude: row.longitude,
      imageUrl: null,
      cuisine: row.cuisine,
      priceLabel: row.price,
      budget: budgetFromPrice(row.price),
      award,
      source: "ngshiheng/michelin-my-maps",
      sourceUrl: row.url || "https://github.com/ngshiheng/michelin-my-maps",
      externalId
    });

    for (const tag of tags) {
      addTag(tagBySlug, tag);
    }

    tagSlugsByExternalId.set(
      externalId,
      tags.map((tag) => tag.slug)
    );
  }

  await prisma.restaurant.createMany({
    data: restaurants,
    skipDuplicates: true
  });

  await prisma.tag.createMany({
    data: Array.from(tagBySlug.values()),
    skipDuplicates: true
  });

  const [createdRestaurants, createdTags] = await Promise.all([
    prisma.restaurant.findMany({
      where: {
        externalId: {
          in: restaurants.map((restaurant) => restaurant.externalId as string)
        }
      },
      select: {
        id: true,
        externalId: true
      }
    }),
    prisma.tag.findMany({
      where: {
        slug: {
          in: Array.from(tagBySlug.keys())
        }
      },
      select: {
        id: true,
        slug: true
      }
    })
  ]);

  const tagIdBySlug = new Map(createdTags.map((tag) => [tag.slug, tag.id]));
  const restaurantTags: Prisma.RestaurantTagCreateManyInput[] = [];

  for (const restaurant of createdRestaurants) {
    if (!restaurant.externalId) {
      continue;
    }

    const slugs = tagSlugsByExternalId.get(restaurant.externalId) ?? [];

    for (const slug of slugs) {
      const tagId = tagIdBySlug.get(slug);

      if (!tagId) {
        continue;
      }

      restaurantTags.push({
        restaurantId: restaurant.id,
        tagId
      });
    }
  }

  if (restaurantTags.length > 0) {
    await prisma.restaurantTag.createMany({
      data: restaurantTags,
      skipDuplicates: true
    });
  }

  console.log(
    `Michelin map import completed: ${restaurants.length} geolocated restaurants, ${tagBySlug.size} tags.`
  );
}
