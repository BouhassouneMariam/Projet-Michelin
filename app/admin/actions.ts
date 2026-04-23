"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function deleteRestaurant(id: string) {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("Unauthorized");
  
  await prisma.restaurant.delete({ where: { id } });
  revalidatePath("/admin");
}

export async function deleteUser(id: string) {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("Unauthorized");
  
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin");
}

export async function createRestaurant(data: any) {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("Unauthorized");

  await prisma.restaurant.create({
    data: {
      name: data.name,
      city: data.city,
      description: data.description,
      budget: data.budget,
      award: data.award,
      cuisine: data.cuisine,
      chefName: data.chefName,
      imageUrl: data.imageUrl || "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=1934",
    }
  });
  
  revalidatePath("/admin");
}

export async function updateRestaurant(id: string, data: any) {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("Unauthorized");

  await prisma.restaurant.update({
    where: { id },
    data: {
      name: data.name,
      city: data.city,
      description: data.description,
      budget: data.budget,
      award: data.award,
      cuisine: data.cuisine,
      chefName: data.chefName,
      imageUrl: data.imageUrl || "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=1934",
    }
  });
  
  revalidatePath("/admin");
}

export async function updateUser(id: string, data: any) {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("Unauthorized");

  await prisma.user.update({
    where: { id },
    data: {
      name: data.name,
      username: data.username,
    }
  });
  
  revalidatePath("/admin");
}

export async function getQuestions() {
  return await prisma.question.findMany({
    include: { options: true },
    orderBy: { order: "asc" }
  });
}

export async function createQuestion(data: any) {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("Unauthorized");

  await prisma.question.create({
    data: {
      key: data.key,
      label: data.label,
      question: data.question,
      intro: data.intro,
      order: data.order || 0
    }
  });
  revalidatePath("/admin");
}

export async function updateQuestion(id: string, data: any) {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("Unauthorized");

  await prisma.question.update({
    where: { id },
    data: {
      key: data.key,
      label: data.label,
      question: data.question,
      intro: data.intro,
      order: data.order
    }
  });
  revalidatePath("/admin");
}

export async function deleteQuestion(id: string) {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("Unauthorized");

  await prisma.question.delete({ where: { id } });
  revalidatePath("/admin");
}

export async function createOption(questionId: string, data: any) {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("Unauthorized");

  await prisma.questionOption.create({
    data: {
      questionId,
      label: data.label,
      value: data.value,
      description: data.description,
      iconName: data.iconName || "Sparkles"
    }
  });
  revalidatePath("/admin");
}

export async function updateOption(id: string, data: any) {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("Unauthorized");

  await prisma.questionOption.update({
    where: { id },
    data: {
      label: data.label,
      value: data.value,
      description: data.description,
      iconName: data.iconName
    }
  });
  revalidatePath("/admin");
}

export async function deleteOption(id: string) {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("Unauthorized");

  await prisma.questionOption.delete({ where: { id } });
  revalidatePath("/admin");
}
