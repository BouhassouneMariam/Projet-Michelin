const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const restaurants = await prisma.restaurant.findMany({
    select: { id: true, name: true, imageUrl: true },
    take: 10
  });
  console.log(JSON.stringify(restaurants, null, 2));
  await prisma.$disconnect();
}

check();
