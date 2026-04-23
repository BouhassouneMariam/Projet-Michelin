import { prisma } from "./lib/prisma";

async function promote(username: string) {
  try {
    const user = await prisma.user.update({
      where: { username },
      data: { role: "ADMIN" }
    });
    console.log(`Success: User ${username} is now an ADMIN.`);
  } catch (e) {
    console.error(`Error: User ${username} not found or update failed.`);
  } finally {
    await prisma.$disconnect();
  }
}

const username = process.argv[2];
if (!username) {
  console.log("Usage: npx tsx promote-admin.ts <username>");
  process.exit(1);
}

promote(username);
