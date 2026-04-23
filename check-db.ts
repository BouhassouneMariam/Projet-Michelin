import { prisma } from "./lib/prisma";

async function check() {
  const questions = await prisma.question.findMany({ include: { options: true } });
  console.log("Count:", questions.length);
  console.log(JSON.stringify(questions, null, 2));
  process.exit(0);
}

check();
