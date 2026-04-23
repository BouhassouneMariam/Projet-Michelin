import { HomeBookExperience } from "@/features/home/HomeBookExperience";
import { MobileHome } from "@/features/home/MobileHome";
import { prisma } from "@/lib/prisma";
import { listRestaurants } from "@/features/restaurants/restaurant.queries";

export default async function HomePage() {
  const questions = await prisma.question.findMany({
    include: { options: true },
    orderBy: { order: "asc" }
  });

  const restaurants = await listRestaurants({ limit: 12 });

  return (
    <>
      <div className="hidden md:block">
        <HomeBookExperience initialQuestions={questions} />
      </div>
      <div className="block md:hidden">
        <MobileHome restaurants={restaurants} />
      </div>
    </>
  );
}
