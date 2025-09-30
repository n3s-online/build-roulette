import { Combination, GeneratedIdea } from "@/lib/types";

// Selected combination for the demo video
export const demoCombination: Combination = {
  market: "Creator Economy",
  userType: "Content Creators",
  problemType: "Monetization",
  techStack: "Web App",
  projectScope: "1 Week Sprint",
};

// Mock generated ideas based on the actual prompt structure
export const demoIdeas: GeneratedIdea[] = [
  {
    name: "CreatorVault",
    description:
      "A micro-subscription platform that lets creators sell exclusive content bundles directly to fans without traditional payment processors. Bypass platform fees and own your revenue stream.",
    coreFeatures: [
      "One-click bundle creation with drag-and-drop file uploads",
      "Stripe Connect integration for direct payments",
      "Automatic delivery via secure download links",
      "Simple analytics dashboard showing sales and subscriber trends",
    ],
    suggestedTechStack: ["Next.js", "Stripe Connect", "Supabase", "Tailwind CSS"],
    leadGenerationIdeas: [
      'Tweet thread showing "I earned $X in the first week"',
      'YouTube tutorial: "How I built my own Gumroad alternative"',
      "Share on indie maker communities (Indie Hackers, Hacker News)",
      "Cold DM creators with 10k-50k followers",
    ],
  },
  {
    name: "SponsorMatch",
    description:
      "Connect newsletter writers and YouTubers with micro-sponsors who want authentic partnerships. Automated matching based on audience overlap and niche alignment.",
    coreFeatures: [
      "Profile creation for creators with audience demographics",
      "AI-powered sponsor matching algorithm",
      "Built-in messaging and rate negotiation",
      "Contract templates and milestone tracking",
    ],
    suggestedTechStack: [
      "Next.js",
      "OpenAI API",
      "PostgreSQL",
      "Resend",
      "Stripe",
    ],
    leadGenerationIdeas: [
      'Launch on Product Hunt with "First 100 creators get free premium"',
      "Partner with creator-focused newsletters for cross-promotion",
      "LinkedIn posts targeting marketing managers at startups",
      "Create comparison chart vs. traditional ad networks",
    ],
  },
  {
    name: "TipJar Pro",
    description:
      "Beautiful, embeddable tip widgets for live streamers and podcasters that support crypto, PayPal, and credit cards. Show real-time tip notifications on screen with custom animations.",
    coreFeatures: [
      "Customizable widget with brand colors and animations",
      "Multi-currency support (crypto + fiat)",
      "OBS/Streamlabs integration for overlays",
      "Automated thank-you emails and tax receipts",
    ],
    suggestedTechStack: [
      "React",
      "Stripe",
      "Web3.js",
      "WebSocket",
      "Framer Motion",
    ],
    leadGenerationIdeas: [
      "Demo video showing widget in action during live stream",
      "Reddit posts in r/Twitch, r/podcasting",
      "Sponsor small streamers to use it live",
      "Create TikTok showing setup process in under 60 seconds",
    ],
  },
];

// All available options for slot machine animation
export const dimensionOptions = {
  markets: [
    "SaaS",
    "E-commerce",
    "FinTech",
    "HealthTech",
    "EdTech",
    "Gaming",
    "Creator Economy",
    "Real Estate",
    "Travel",
    "Food & Beverage",
    "Fitness",
    "Productivity",
  ],
  userTypes: [
    "Small Businesses",
    "Freelancers",
    "Students",
    "Remote Workers",
    "Content Creators",
    "Parents",
    "Seniors",
    "Developers",
    "Designers",
    "Consultants",
  ],
  problemTypes: [
    "Automation",
    "Organization",
    "Communication",
    "Analytics",
    "Monetization",
    "Learning",
    "Health Tracking",
    "Time Management",
    "Collaboration",
    "Security",
  ],
  techStacks: [
    "Web App",
    "Mobile App",
    "Browser Extension",
    "API/MCP",
    "Slack/Discord Bot",
  ],
};
