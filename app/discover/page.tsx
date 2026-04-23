import { HomeBookExperience } from "@/features/home/HomeBookExperience";
import { DiscoverMobileClient } from "@/features/recommendations/components/DiscoverMobileClient";
import { prisma } from "@/lib/prisma";

export default async function DiscoverPage() {
  const questions = await prisma.question.findMany({
    include: { options: true },
    orderBy: { order: "asc" }
  });

  return (
    <>
      <div className="hidden md:block">
        <HomeBookExperience startOpen initialQuestions={questions} />
      </div>
      <div className="block md:hidden">
        <DiscoverMobileClient initialQuestions={questions} />
      </div>
    </>
  );
}
