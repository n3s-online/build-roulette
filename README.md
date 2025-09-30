# BuildRoulette 🎰

> Generate AI-powered product ideas based on real market research. We search the web for current problems, then create solutions.

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel)](https://vercel.com/)

## 🎯 What is BuildRoulette?

BuildRoulette is a web application that helps solo entrepreneurs and indie hackers overcome "blank page syndrome" when brainstorming their next project. Using a 4-column slot machine interface, it generates random product combinations across four key dimensions:

- **🏢 Market** - SaaS, E-commerce, FinTech, HealthTech, EdTech, Gaming, etc.
- **👥 User Type** - Small Businesses, Freelancers, Students, Remote Workers, etc.
- **🎯 Problem Type** - Automation, Organization, Communication, Analytics, etc.
- **⚡ Tech Stack** - Web App, Mobile App, Browser Extension, API/MCP, etc.

The magic happens when AI transforms these random combinations into detailed, actionable product ideas with implementation guidance and marketing strategies.

## ✨ Features

### 🎰 Interactive Slot Machine
- **4-column slot machine** with smooth vertical scrolling animations
- **Staggered stopping mechanism** - columns stop sequentially for dramatic effect
- **Satisfying sound effects** and visual feedback
- **Customizable dimensions** - modify the available options in each category

### 🤖 AI-Powered Idea Generation
- **Real-time market research** using Perplexity AI
- **3 unique ideas** generated per combination
- **Structured output** with names, descriptions, features, tech stacks, and marketing strategies
- **Multiple AI models** supported (Sonar Reasoning, Sonar Reasoning Pro)

### 📱 Modern User Experience
- **Fully responsive** design optimized for all devices
- **Dark theme** with beautiful gradients and animations
- **Social sharing** functionality for viral content
- **Progressive Web App** capabilities

### ⚙️ Customization Options
- **Custom API keys** for AI providers
- **Dimension customization** - add/remove options from each category
- **Model selection** - choose between different AI models
- **Sound controls** - enable/disable audio feedback

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- A Perplexity AI API key (get one at [perplexity.ai](https://perplexity.ai))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/build-roulette.git
   cd build-roulette
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your Perplexity AI API key:
   ```env
   PERPLEXITY_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety and better DX
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful, accessible UI components
- **[Lucide React](https://lucide.dev/)** - Beautiful icons
- **[React Query](https://tanstack.com/query)** - Data fetching and caching

### Backend & AI
- **[Vercel AI SDK](https://sdk.vercel.ai/)** - AI integration framework
- **[Perplexity AI](https://perplexity.ai/)** - Real-time web search and reasoning
- **Next.js API Routes** - Serverless backend functions

### Deployment
- **[Vercel](https://vercel.com/)** - Seamless deployment and hosting
- **[Plausible Analytics](https://plausible.io/)** - Privacy-friendly analytics

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── generate-ideas/ # AI idea generation endpoint
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── providers.tsx      # React Query provider
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── slot-machine.tsx  # Main slot machine component
│   ├── slot-machine-reels.tsx # Slot machine animation
│   ├── ideas-display.tsx # AI-generated ideas display
│   └── ...               # Other components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and types
│   ├── types.ts         # TypeScript type definitions
│   ├── utils.ts         # Utility functions
│   └── sounds.ts        # Sound management
└── docs/                 # Documentation
    └── prd.md           # Product Requirements Document
```

## 🎮 How to Use

1. **Spin the Slot Machine** - Click the "Spin" button to generate a random combination
2. **Watch the Animation** - Enjoy the satisfying slot machine animation as columns stop sequentially
3. **View Your Combination** - See your randomly selected Market, User Type, Problem, and Tech Stack
4. **Generate Ideas** - Click "Generate Ideas" to get AI-powered product suggestions
5. **Explore Solutions** - Review 3 unique product ideas with detailed implementation guidance
6. **Share or Spin Again** - Share your favorite ideas or spin for new combinations

## 🔧 Configuration

### Custom Dimensions
You can customize the available options in each category through the settings dialog:

- Add or remove markets, user types, problems, or tech stacks
- Settings are saved locally and persist across sessions
- Reset to defaults anytime

### API Configuration
- Use your own Perplexity AI API key for unlimited generations
- Choose between different AI models for varied output styles
- Fallback to demo mode if no API key is provided

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** and add tests if applicable
4. **Commit your changes** (`git commit -m 'Add amazing feature'`)
5. **Push to the branch** (`git push origin feature/amazing-feature`)
6. **Open a Pull Request**

### Development Guidelines

- Use TypeScript for all new code
- Follow the existing code style and conventions
- Add JSDoc comments for complex functions
- Test your changes thoroughly across different devices
- Update documentation as needed

## 📊 Performance

BuildRoulette is optimized for performance:

- **First Contentful Paint**: < 1.5 seconds
- **Largest Contentful Paint**: < 2.5 seconds  
- **Time to Interactive**: < 3 seconds
- **Mobile Performance Score**: 90+ on Lighthouse

## 🔒 Privacy

- **No user data collection** - All settings stored locally
- **Privacy-friendly analytics** via Plausible (no cookies, no tracking)
- **API keys stored securely** in browser localStorage only
- **No server-side data persistence**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/) and [Vercel](https://vercel.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- AI powered by [Perplexity](https://perplexity.ai/)

---

**Ready to spin the slots and discover your next big idea?** 🎰✨

[Try BuildRoulette Live](https://build.willness.dev) | [View Documentation](docs/prd.md) | [Report Issues](https://github.com/yourusername/build-roulette/issues)
