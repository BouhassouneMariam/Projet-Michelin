import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminClient } from "./AdminClient";

export default async function AdminPage() {
  const userId = getCurrentUserId();
  if (!userId) redirect("/login");

  const [restaurants, users, initialQuestions] = await Promise.all([
    prisma.restaurant.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.user.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.question.findMany({
      include: { options: true },
      orderBy: { order: "asc" }
    })
  ]);

  return (
    <main className="michelin-paper min-h-[calc(100dvh-68px)] px-5 pb-16 pt-10 md:px-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-4xl font-medium leading-tight text-ink sm:text-5xl">
          Administration
        </h1>
        <AdminClient restaurants={restaurants} users={users} initialQuestions={initialQuestions} />
      </div>
    </main>
  );
}
