import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// API Key management utilities
const API_KEY_STORAGE_KEY = "vercel-ai-gateway-api-key";

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

// Model selection utilities
const MODEL_SELECTION_KEY = "perplexity-model-selection";
export type PerplexityModel = "sonar-reasoning" | "sonar-reasoning-pro";
const DEFAULT_MODEL: PerplexityModel = "sonar-reasoning-pro";

export function getStoredModel(): PerplexityModel {
  if (typeof window === "undefined") return DEFAULT_MODEL;
  const stored = localStorage.getItem(MODEL_SELECTION_KEY);
  if (stored === "sonar-reasoning" || stored === "sonar-reasoning-pro") {
    return stored;
  }
  return DEFAULT_MODEL;
}

export function storeModel(model: PerplexityModel): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(MODEL_SELECTION_KEY, model);
}

// Dimension Settings management
const DIMENSION_SETTINGS_KEY = "dimension-settings";

import type { Market, UserType, ProblemType, TechStack } from "./types";

export interface DimensionSettings {
  markets: Market[];
  userTypes: UserType[];
  problemTypes: ProblemType[];
  techStacks: TechStack[];
}

export const DEFAULT_DIMENSION_SETTINGS: DimensionSettings = {
  markets: [
    "SaaS", "E-commerce", "FinTech", "HealthTech", "EdTech", "Gaming",
    "Creator Economy", "Real Estate", "Travel", "Food & Beverage", "Fitness", "Productivity",
  ],
  userTypes: [
    "Small Businesses", "Freelancers", "Students", "Remote Workers", "Content Creators",
    "Parents", "Seniors", "Developers", "Designers", "Consultants",
  ],
  problemTypes: [
    "Automation", "Organization", "Communication", "Analytics", "Monetization",
    "Learning", "Health Tracking", "Time Management", "Collaboration", "Security",
  ],
  techStacks: [
    "Web App", "Mobile App", "Browser Extension", "API/MCP", "Slack/Discord Bot",
  ],
};

export function getStoredDimensionSettings(): DimensionSettings {
  if (typeof window === "undefined") return DEFAULT_DIMENSION_SETTINGS;

  try {
    const stored = localStorage.getItem(DIMENSION_SETTINGS_KEY);
    if (!stored) return DEFAULT_DIMENSION_SETTINGS;

    const parsed = JSON.parse(stored);
    // Validate that all arrays have at least one item
    const validated: DimensionSettings = {
      markets: parsed.markets?.length > 0 ? parsed.markets : DEFAULT_DIMENSION_SETTINGS.markets,
      userTypes: parsed.userTypes?.length > 0 ? parsed.userTypes : DEFAULT_DIMENSION_SETTINGS.userTypes,
      problemTypes: parsed.problemTypes?.length > 0 ? parsed.problemTypes : DEFAULT_DIMENSION_SETTINGS.problemTypes,
      techStacks: parsed.techStacks?.length > 0 ? parsed.techStacks : DEFAULT_DIMENSION_SETTINGS.techStacks,
    };
    return validated;
  } catch {
    return DEFAULT_DIMENSION_SETTINGS;
  }
}

export function storeDimensionSettings(settings: DimensionSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(DIMENSION_SETTINGS_KEY, JSON.stringify(settings));
}
