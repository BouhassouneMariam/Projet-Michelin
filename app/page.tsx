import { HomeBookExperience } from "@/features/home/HomeBookExperience";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const questions = await prisma.question.findMany({
    include: { options: true },
    orderBy: { order: "asc" }
  });

  return <HomeBookExperience initialQuestions={questions} />;
}
