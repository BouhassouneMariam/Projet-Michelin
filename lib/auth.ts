import { cookies } from "next/headers";
import { prisma } from "./prisma";

export function getCurrentUserId() {
    return cookies().get("michelin_user_id")?.value ?? null;
}

export function isAuthenticated() {
    return Boolean(getCurrentUserId());
}

export async function isAdmin() {
    const userId = getCurrentUserId();
    if (!userId) return false;
    
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
    });
    
    return user?.role === "ADMIN";
}
