import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function normaliseTagName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function splitTags(value: string) {
  return Array.from(
    new Set(
      value
        .split(",")
        .map(normaliseTagName)
        .filter(Boolean),
    ),
  );
}

export function formatPromptType(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}
