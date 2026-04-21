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
  "michelin-restaurants-cleaned.csv"
);

type MichelinCsvRestaurant = {
  name: string;
  country: string;
  city: string;
  stars: number;
  cuisine: string;
  rowIndex: number;
};

type ImportTag = {
  name: string;
  slug: string;
  type: TagType;
};

function parseSemicolonLine(line: string) {
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

    if (char === ";" && !inQuotes) {
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
    .slice(0, 80);
}

function normalizeCountry(country: string) {
  if (country === "South Corea") {
    return "South Korea";
  }

  return country;
}

function awardFromStars(stars: number) {
  if (stars === 3) {
    return MichelinAward.THREE_STARS;
  }

  if (stars === 2) {
    return MichelinAward.TWO_STARS;
  }

  return MichelinAward.ONE_STAR;
}

function budgetFromStars(stars: number) {
  return stars >= 2 ? BudgetLevel.LUXURY : BudgetLevel.HIGH;
}

function priceFromStars(stars: number) {
  return stars >= 2 ? "$$$$" : "$$$";
}

function starLabel(stars: number) {
  return stars === 1 ? "1 Michelin star" : `${stars} Michelin stars`;
}

function addTag(tags: Map<string, ImportTag>, tag: ImportTag) {
  if (!tags.has(tag.slug)) {
    tags.set(tag.slug, tag);
  }
}

function narrativeTagsFor(row: MichelinCsvRestaurant) {
  const tags: ImportTag[] = [];
  const cuisineSlug = slugify(row.cuisine);
  const cuisineLower = row.cuisine.toLowerCase();

  tags.push({
    name: row.cuisine,
    slug: `cuisine-${cuisineSlug}`,
    type: TagType.CUISINE
  });

  tags.push({
    name: starLabel(row.stars),
    slug: `${row.stars}-michelin-star`,
    type: TagType.FEATURE
  });

  if (row.stars >= 2) {
    tags.push({ name: "Luxury", slug: "luxe", type: TagType.MOOD });
    tags.push({ name: "Experience", slug: "experience", type: TagType.VIBE });
    tags.push({ name: "Date", slug: "date", type: TagType.OCCASION });
  } else {
    tags.push({ name: "Premium", slug: "premium", type: TagType.VIBE });
  }

  if (
    cuisineLower.includes("japanese") ||
    cuisineLower.includes("sushi") ||
    cuisineLower.includes("korean")
  ) {
    tags.push({ name: "Trendy", slug: "trendy", type: TagType.MOOD });
    tags.push({ name: "Solo", slug: "solo", type: TagType.OCCASION });
    tags.push({ name: "Experience", slug: "experience", type: TagType.VIBE });
  }

  if (
    cuisineLower.includes("french") ||
    cuisineLower.includes("modern") ||
    cuisineLower.includes("creative")
  ) {
    tags.push({ name: "Cosy", slug: "cosy", type: TagType.MOOD });
    tags.push({ name: "Date", slug: "date", type: TagType.OCCASION });
  }

  if (
    cuisineLower.includes("italian") ||
    cuisineLower.includes("spanish") ||
    cuisineLower.includes("tapas") ||
    cuisineLower.includes("bbq")
  ) {
    tags.push({ name: "Friends", slug: "friends", type: TagType.OCCASION });
    tags.push({ name: "Chill", slug: "chill", type: TagType.MOOD });
  }

  return tags;
}

function readMichelinCsv() {
  if (!existsSync(CSV_PATH)) {
    return [];
  }

  const content = readFileSync(CSV_PATH, "utf8");

  return content
    .split(/\r?\n/)
    .map((line, index) => ({ line: line.trim(), index }))
    .filter(({ line }) => line.length > 0)
    .map(({ line, index }) => {
      const [name, country, city, starsRaw, cuisine] = parseSemicolonLine(line);
      const stars = Number.parseInt(starsRaw, 10);

      if (!name || !country || !city || !cuisine || Number.isNaN(stars)) {
        return null;
      }

      return {
        name,
        country: normalizeCountry(country),
        city,
        stars,
        cuisine,
        rowIndex: index + 1
      };
    })
    .filter((row): row is MichelinCsvRestaurant => row !== null);
}

export async function seedMichelinRestaurants(prisma: PrismaClient) {
  const rows = readMichelinCsv();

  if (rows.length === 0) {
    console.warn("Michelin CSV not found or empty. Skipping Michelin import.");
    return;
  }

  const restaurants: Prisma.RestaurantCreateManyInput[] = [];
  const tagBySlug = new Map<string, ImportTag>();
  const tagSlugsByExternalId = new Map<string, string[]>();

  for (const row of rows) {
    const externalId = `michelin-dataset-${row.rowIndex}-${slugify(
      `${row.name}-${row.country}-${row.city}`
    )}`;
    const tags = narrativeTagsFor(row);

    restaurants.push({
      id: externalId,
      name: row.name,
      description: `A ${starLabel(row.stars)} ${row.cuisine} restaurant in ${row.city}, ${row.country}.`,
      city: row.city,
      country: row.country,
      address: null,
      latitude: null,
      longitude: null,
      imageUrl: null,
      cuisine: row.cuisine,
      priceLabel: priceFromStars(row.stars),
      budget: budgetFromStars(row.stars),
      award: awardFromStars(row.stars),
      source: "joseanmarsol/Michelin-Star-restaurants",
      sourceUrl: "https://github.com/joseanmarsol/Michelin-Star-restaurants",
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
    `Michelin import completed: ${restaurants.length} restaurants, ${tagBySlug.size} tags.`
  );
}
