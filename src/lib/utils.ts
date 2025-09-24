import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// API Key management utilities
const API_KEY_STORAGE_KEY = "anthropic-api-key";

export function getStoredApiKey(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(API_KEY_STORAGE_KEY);
}

export function storeApiKey(apiKey: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
}

export function removeStoredApiKey(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(API_KEY_STORAGE_KEY);
}
