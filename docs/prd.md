# BuildRoulette - Product Requirements Document

## Executive Summary

**Product Name:** BuildRoulette  
**Target Launch:** Weekend Project (2-3 days)  
**Primary Goal:** Build audience through viral content creation while providing value to indie hackers  

A web application that generates random product combinations using a 4-column slot machine interface (Market, User Type, Problem Type, Tech Stack), then uses AI to transform these combinations into actionable product ideas for solo entrepreneurs and indie hackers.

## Problem Statement

Solo entrepreneurs and indie hackers frequently face "blank page syndrome" when brainstorming their next project. While there's no shortage of generic business ideas online, there's a gap for:
- **Structured ideation tools** that combine multiple product dimensions
- **AI-powered elaboration** that turns random combinations into detailed, actionable concepts  
- **Viral, shareable content** that makes ideation fun and engaging
- **Technical implementation guidance** included in generated ideas

## Target Users & Personas

### Primary Persona: The Solo Entrepreneur
- **Demographics:** 25-40 years old, technical background
- **Goals:** Find profitable side project ideas, build sustainable income streams
- **Pain Points:** Analysis paralysis, too many ideas vs. too few ideas, unclear market validation
- **Tech Comfort:** High - comfortable with modern web technologies

### Secondary Persona: The Content Consumer  
- **Demographics:** Developers, makers, YouTube/Twitter audience
- **Goals:** Entertainment, inspiration, following creator journey
- **Behavior:** Shares interesting tools, engages with viral content
- **Value:** Amplifies reach through social sharing

## Product Goals & Success Metrics

### Primary Goals
1. **Audience Building:** Drive traffic and followers through video content
2. **Value Creation:** Provide genuine utility to indie hacker community
3. **Skill Demonstration:** Showcase development capabilities and creativity

### Success Metrics
- **Immediate (Week 1):** 
  - 500+ unique visitors from video launch
  - 100+ ideas generated
  - 50+ social shares
- **Short-term (Month 1):**
  - 2,000+ total visitors
  - 10+ community mentions/discussions
  - Video: 10k+ views, 500+ likes

### Key Performance Indicators
- Ideas generated per session
- Social sharing rate
- Time spent on site
- Return visitor rate
- Video engagement metrics

## Feature Requirements (MVP Only)

### 1. Slot Machine System 🎰
- **4-column slot machine interface** with vertical scrolling animations
- **Staggered stopping mechanism** - columns stop sequentially (1s, 2s, 3s, 4s)
- **Progressive rotation counts** per column (5, 10, 15, 20 rotations)
- **Visual selection indicators** showing winning position in each column
- **"SPIN" button** with satisfying animation feedback
- **Accurate targeting** - lands precisely on selected values
- **Continuous scrolling effect** with seamless looping animation

### 2. Product Dimension Categories (Hardcoded)
- **Market Section:** SaaS, E-commerce, FinTech, HealthTech, EdTech, Gaming, Creator Economy, Real Estate, Travel, Food & Beverage, Fitness, Productivity
- **User Type Section:** Small Businesses, Freelancers, Students, Remote Workers, Content Creators, Parents, Seniors, Developers, Designers, Consultants
- **Problem Type Section:** Automation, Organization, Communication, Analytics, Monetization, Learning, Health Tracking, Time Management, Collaboration, Security
- **Tech Stack Section:** Web App, Mobile App, Chrome Extension, API/Tool, Desktop App, Slack Bot, WordPress Plugin, Shopify App

### 3. AI Idea Generation 🤖
- **Integration with Vercel AI Gateway**
- **Generate 3 unique ideas** per combination
- **Structured output format:**
  ```typescript
  {
    name: string;
    description: string; // 1-2 sentences
    coreFeatures: string[]; // 3-5 concise features
    suggestedTechStack: string[]; // 3-5 technologies
    leadGenerationIdeas: string[]; // 3-4 marketing strategies
  }
  ```
- **Loading states** with progress indicators
- **Error handling** with retry capability

### 4. Results Display & Sharing 📱
- **Clean, mobile-responsive layout** for generated ideas
- **Social sharing functionality:**
  - Twitter card with combination + selected idea
  - Copy link functionality
- **"Generate New Ideas" button** for same combination
- **"Spin Again" button** to get new combination

## User Stories

### Core User Journey
1. **As an indie hacker**, I want to quickly generate product ideas so that I can overcome creative blocks
2. **As a content consumer**, I want to share interesting combinations so that I can engage with my network
3. **As a solo entrepreneur**, I want detailed implementation guidance so that I can evaluate feasibility

### Detailed User Stories

#### Discovery & Initial Use
- **As a visitor**, I want to immediately understand what the tool does so that I can decide to engage
- **As a user**, I want satisfying animations when spinning the wheel so that the experience feels premium and shareable

#### Idea Generation
- **As an indie hacker**, I want to see my combination clearly displayed so that I understand what was selected
- **As an entrepreneur**, I want diverse, actionable ideas so that I can find opportunities I hadn't considered
- **As a developer**, I want technical implementation details so that I can assess development effort

#### Sharing & Virality
- **As a content creator**, I want to easily share results so that I can engage my audience
- **As a user**, I want shareable links that preserve my combination so that I can reference them later

## Technical Requirements

### Frontend Architecture
- **Framework:** Next.js 14+ with App Router
- **Language:** TypeScript for type safety
- **Styling:** Tailwind CSS + shadcn/ui components
- **Animations:** CSS transforms + JavaScript for slot machine mechanics
- **State Management:** React useState (no external state management needed)

### Backend Requirements
- **API Routes:** Next.js API routes for LLM integration
- **AI Integration:** Vercel AI Gateway for LLM calls
- **Model:** GPT-4 or Claude for idea generation
- **Rate Limiting:** Basic IP-based limiting on API routes

### Performance Requirements
- **First Contentful Paint:** < 1.5 seconds
- **Largest Contentful Paint:** < 2.5 seconds
- **Time to Interactive:** < 3 seconds
- **Mobile Performance Score:** 90+ on Lighthouse

### Data Structure
```typescript
// Core types
type Market = "SaaS" | "E-commerce" | "FinTech" | /* ... */;
type UserType = "Small Businesses" | "Freelancers" | /* ... */;
type ProblemType = "Automation" | "Organization" | /* ... */;
type TechStack = "Web App" | "Mobile App" | /* ... */;

type Combination = {
  market: Market;
  userType: UserType;
  problemType: ProblemType;
  techStack: TechStack;
};

type GeneratedIdea = {
  name: string;
  description: string;
  coreFeatures: string[];
  suggestedTechStack: string[];
  leadGenerationIdeas: string[];
};
```

### Deployment & Hosting
- **Platform:** Vercel for seamless Next.js deployment
- **Domain:** Custom domain for professional branding
- **Environment Variables:** Secure API key management

## Implementation Timeline

### Day 1: Foundation & Roulette Wheel
- **Morning (4 hours):**
  - Next.js project setup with TypeScript, Tailwind, shadcn
  - Basic page layout and responsive design
  - Roulette wheel component creation with 4 sections
- **Afternoon (4 hours):**
  - Slot machine animation implementation with staggered stopping
  - Column selection logic and accurate targeting
  - Basic combination display with visual indicators

### Day 2: AI Integration & Results
- **Morning (4 hours):**
  - API route creation for LLM integration
  - Vercel AI Gateway setup and testing
  - Prompt engineering for consistent output format
- **Afternoon (4 hours):**
  - Results display components
  - Loading states and error handling
  - Social sharing implementation

### Day 3: Testing & Deployment
- **Morning (2 hours):**
  - Cross-browser testing and mobile optimization
  - Performance optimization
- **Afternoon (2 hours):**
  - Vercel deployment and domain setup
  - Final testing and bug fixes
  - Content creation preparation

## Risk Assessment

### Technical Risks
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| LLM API rate limits/costs | Medium | Medium | Implement rate limiting, fallback responses |
| Slot machine animation performance on mobile | Low | Medium | Use CSS transforms, test on devices, optimize animations |
| Social sharing not working | Low | High | Test across platforms, implement fallbacks |

### Business Risks
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Low video engagement | Medium | High | Strong thumbnail, clear value prop, community seeding |
| Technical complexity too high | Low | High | Focus on core MVP only |

### Contingency Plans
- **LLM Issues:** Pre-generated example responses for demo purposes
- **Time Constraints:** Simplify animations, focus on core experience
- **Performance Problems:** Optimize bundle size, reduce animation complexity

## Success Metrics & KPIs

### Engagement Metrics
- **Session Duration:** Target 3+ minutes average
- **Ideas Generated per Session:** Target 2-3 spins
- **Return Visitors:** Target 15% return rate within 30 days

### Viral Metrics
- **Social Shares:** Track Twitter, direct link shares
- **Referral Traffic:** Monitor traffic sources and viral coefficient
- **Community Mentions:** Track Reddit, HackerNews, Discord discussions

### Technical Metrics
- **Core Web Vitals:** Maintain 90+ scores across all metrics
- **API Response Times:** < 3 seconds for idea generation
- **Error Rates:** < 1% API failures

### Content Performance
- **Video Metrics:** Views, engagement rate, subscriber conversion
- **SEO Performance:** Organic traffic growth, keyword rankings
- **Brand Awareness:** Mentions, backlinks, community recognition

---

**Document Version:** 2.0  
**Last Updated:** September 22, 2025  
**Next Review:** Post-launch retrospective  

Ready to spin the slots and discover your next big idea? 🎰✨