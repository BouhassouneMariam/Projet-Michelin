import { headers } from "next/headers";

const DEFAULT_SITE_URL = "http://localhost:3000";

export function getSiteUrl() {
  const envUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL;

  if (!envUrl) {
    return DEFAULT_SITE_URL;
  }

  const normalizedUrl = envUrl.startsWith("http")
    ? envUrl
    : `https://${envUrl}`;

  return normalizedUrl.replace(/\/$/, "");
}

export function getRequestOrigin() {
  const headerList = headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const protocol = headerList.get("x-forwarded-proto") ?? "http";

  if (!host) {
    return getSiteUrl();
  }

  return `${protocol}://${host}`;
}

export function getAbsoluteUrl(path: string, origin = getRequestOrigin()) {
  return new URL(path, `${origin.replace(/\/$/, "")}/`).toString();
}
