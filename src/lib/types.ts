// Re-export types from roulette-wheel for consistency
export type Market =
  | "SaaS"
  | "E-commerce"
  | "FinTech"
  | "HealthTech"
  | "EdTech"
  | "Gaming"
  | "Creator Economy"
  | "Real Estate"
  | "Travel"
  | "Food & Beverage"
  | "Fitness"
  | "Productivity";

export type UserType =
  | "Small Businesses"
  | "Freelancers"
  | "Students"
  | "Remote Workers"
  | "Content Creators"
  | "Parents"
  | "Seniors"
  | "Developers"
  | "Designers"
  | "Consultants";

export type ProblemType =
  | "Automation"
  | "Organization"
  | "Communication"
  | "Analytics"
  | "Monetization"
  | "Learning"
  | "Health Tracking"
  | "Time Management"
  | "Collaboration"
  | "Security";

export type TechStack =
  | "Web App"
  | "Mobile App"
  | "Browser Extension"
  | "API/MCP"
  | "Slack/Discord Bot";

export type Combination = {
  market: Market;
  userType: UserType;
  problemType: ProblemType;
  techStack: TechStack;
};

// AI Generated Idea structure based on PRD
export type GeneratedIdea = {
  name: string;
  description: string; // 1-2 sentences
  coreFeatures: string[]; // 3-5 concise features
  suggestedTechStack: string[]; // 3-5 technologies
  leadGenerationIdeas: string[]; // 3-4 marketing strategies
};

export type IdeaGenerationResponse = {
  ideas: GeneratedIdea[];
  combination: Combination;
};

export type IdeaGenerationError = {
  message: string;
  code?: string;
};
