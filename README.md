# Michelin Next Gen

Hackathon MVP for a mobile-first Michelin Guide redesign:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- Docker Compose
- PWA manifest and service worker
- Lightweight React Three Fiber hero scene

## Quick start

```bash
docker compose up --build
```

Open:

- App: http://localhost:3000
- Adminer: http://localhost:8080
- PostgreSQL: localhost:5432

Adminer connection:

```txt
System: PostgreSQL
Server: db
Username: michelin
Password: michelin
Database: michelin_hackathon
```

The app container runs:

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
npm run dev
```

So the first Docker launch creates the schema and loads demo data.

## Useful commands

```bash
docker compose exec app npx prisma studio
docker compose exec app npx prisma db seed
docker compose exec app npm run build
```

## MVP routes

```txt
GET  /api/restaurants
GET  /api/restaurants/:id
POST /api/recommendations
GET  /api/collections
POST /api/collections
POST /api/collections/:id/items
GET  /api/users/:id/friends-liked
```

## Data strategy

Current seed data lives in:

```txt
data/seed-restaurants.ts
data/seed-users.ts
data/seed-collections.ts
data/michelin/raw/michelin-restaurants-cleaned.csv
data/michelin/raw/michelin-my-maps.csv
```

The Michelin dataset import is now wired into:

```txt
data/michelin/import-michelin.ts
data/michelin/import-michelin-map.ts
prisma/seed.ts
```

It imports the cleaned CSV from the joseanmarsol dataset as local seed data,
creates restaurant records, maps Michelin stars to app awards, and generates
cuisine/narrative tags for recommendations. The map import uses a second
geolocated Michelin dataset for major demo cities so `/map` can render real
pins. Keep this as a seed/import step, not a live dependency during the demo.
