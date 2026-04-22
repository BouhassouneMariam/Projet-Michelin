import { cookies } from "next/headers";

export function getCurrentUserId() {
    return cookies().get("michelin_user_id")?.value ?? null;
}

export function isAuthenticated() {
    return Boolean(getCurrentUserId());
}