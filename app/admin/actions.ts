"use server";

import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function ensureAdmin() {
  const isUserAdmin = await isAdmin();
  if (!isUserAdmin) throw new Error("Accès refusé : Droits administrateur requis.");
}

export async function deleteRestaurant(id: string) {
  await ensureAdmin();
  await prisma.restaurant.delete({ where: { id } });
  revalidatePath("/admin");
}

export async function deleteUser(id: string) {
  await ensureAdmin();
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin");
}

export async function createRestaurant(data: any) {
  await ensureAdmin();
  await prisma.restaurant.create({
    data: {
      name: data.name,
      city: data.city,
      description: data.description,
      budget: data.budget,
      award: data.award,
      cuisine: data.cuisine,
      chefName: data.chefName,
      imageUrl: data.imageUrl,
    }
  });
  revalidatePath("/admin");
}

export async function updateRestaurant(id: string, data: any) {
  await ensureAdmin();
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
      imageUrl: data.imageUrl,
    }
  });
  revalidatePath("/admin");
}

export async function updateUser(id: string, data: any) {
  await ensureAdmin();
  await prisma.user.update({
    where: { id },
    data: {
      name: data.name,
      username: data.username,
      role: data.role
    }
  });
  revalidatePath("/admin");
}

export async function getQuestions() {
  await ensureAdmin();
  return await prisma.question.findMany({
    include: { options: true },
    orderBy: { order: "asc" }
  });
}

export async function createQuestion(data: any) {
  await ensureAdmin();
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
  await ensureAdmin();
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
  await ensureAdmin();
  await prisma.question.delete({ where: { id } });
  revalidatePath("/admin");
}

export async function createOption(questionId: string, data: any) {
  await ensureAdmin();
  await prisma.questionOption.create({
    data: {
      label: data.label,
      value: data.value,
      description: data.description,
      iconName: data.iconName,
      questionId
    }
  });
  revalidatePath("/admin");
}

export async function updateOption(id: string, data: any) {
  await ensureAdmin();
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
  await ensureAdmin();
  await prisma.questionOption.delete({ where: { id } });
  revalidatePath("/admin");
}
