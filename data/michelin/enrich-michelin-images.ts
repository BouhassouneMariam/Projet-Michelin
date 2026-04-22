import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_LIMIT = 80;
const DEFAULT_DELAY_MS = 250;

function parsePositiveInt(value: string | undefined, fallback: number) {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);

  return Number.isNaN(parsed) || parsed <= 0 ? fallback : parsed;
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function extractImageUrl(html: string) {
  const ogImage = html.match(
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/i
  );

  if (ogImage?.[1]) {
    return decodeHtmlEntities(ogImage[1]);
  }

  const schemaImage = html.match(/"image"\s*:\s*"([^"]+)"/i);

  if (schemaImage?.[1]) {
    return decodeHtmlEntities(schemaImage[1].replace(/\\\//g, "/"));
  }

  return null;
}

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function fetchMichelinImage(sourceUrl: string) {
  const response = await fetch(sourceUrl, {
    headers: {
      "accept": "text/html,application/xhtml+xml",
      "user-agent":
        "Mozilla/5.0 Michelin Hackathon Data Enrichment Bot; contact=local-dev"
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return extractImageUrl(await response.text());
}

async function main() {
  const limit = parsePositiveInt(process.env.MICHELIN_IMAGE_LIMIT, DEFAULT_LIMIT);
  const delayMs = parsePositiveInt(
    process.env.MICHELIN_IMAGE_DELAY_MS,
    DEFAULT_DELAY_MS
  );
  const city = process.env.MICHELIN_IMAGE_CITY?.trim();

  const restaurants = await prisma.restaurant.findMany({
    where: {
      imageUrl: null,
      sourceUrl: {
        startsWith: "https://guide.michelin.com/"
      },
      ...(city ? { city: { equals: city, mode: "insensitive" } } : {})
    },
    select: {
      id: true,
      name: true,
      city: true,
      sourceUrl: true
    },
    orderBy: [{ award: "desc" }, { city: "asc" }, { name: "asc" }],
    take: limit
  });

  let enriched = 0;
  let failed = 0;

  for (const restaurant of restaurants) {
    if (!restaurant.sourceUrl) {
      continue;
    }

    try {
      const imageUrl = await fetchMichelinImage(restaurant.sourceUrl);

      if (imageUrl) {
        await prisma.restaurant.update({
          where: { id: restaurant.id },
          data: { imageUrl }
        });
        enriched += 1;
        console.log(`Image enriched: ${restaurant.name} (${restaurant.city})`);
      } else {
        failed += 1;
        console.warn(`No image found: ${restaurant.name} (${restaurant.city})`);
      }
    } catch (error) {
      failed += 1;
      console.warn(
        `Image failed: ${restaurant.name} (${restaurant.city}) - ${
          error instanceof Error ? error.message : "unknown error"
        }`
      );
    }

    await wait(delayMs);
  }

  console.log(
    `Michelin image enrichment completed: ${enriched} enriched, ${failed} skipped/failed.`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
