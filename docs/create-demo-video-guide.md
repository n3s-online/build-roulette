# Guide: Creating SaaS Demo Videos with Remotion

This guide provides step-by-step instructions for an AI agent to create professional demo videos for SaaS applications using Remotion.

## Phase 1: Discovery & Questions

Before starting any implementation, gather context by asking these questions:

### Required Questions

1. **What is this demo video for?**
   - Get the app name and core purpose
   - Example: "This is for BuildRoulette, an AI-powered tool that generates product ideas"

2. **What are the key features to highlight?**
   - Ask user to list 2-4 main features or screens
   - Example: "The slot machine interface, web research, AI generation, and the results display"

3. **Are there specific components we should use?**
   - Ask if there are existing UI components to feature
   - Example: "Yes, use the actual slot machine component from the app"

4. **What's the target video length?**
   - Recommend 20-30 seconds for social media
   - Recommend 30-60 seconds for landing pages
   - Default: ~25 seconds if not specified

5. **Do you have a logo/brand assets?**
   - Check for logo location (usually `/public/icon.png` or `/public/logo.png`)
   - Check for brand colors in the app

6. **What's the primary URL or CTA?**
   - Get the production URL for the final scene
   - Example: "build.willness.dev"

### Optional Questions

- Are there any existing brand guidelines or design preferences?
- Do you want narration/text overlays or purely visual?
- Any specific animations you'd like to highlight?

## Phase 2: Research & Planning

### Research Steps

1. **Read the project documentation**
   - Look for `docs/prd.md`, `README.md`, or similar files
   - Understand the app's core value proposition

2. **Explore the codebase structure**
   - Locate main components (usually in `/src/components/`)
   - Find the main page (`/src/app/page.tsx` or similar)
   - Identify key features and data structures

3. **Examine existing styling**
   - Check for background colors/gradients
   - Note the font family being used
   - Identify brand colors

### Create a Scene Plan

Based on your research, create a 5-7 scene structure:

**Recommended Structure:**
1. **Hook Scene (3-4s)** - Problem statement or attention grabber
2. **Intro Scene (2s)** - App name and tagline
3. **Main Feature Scene (8-10s)** - The star of the show, usually the most unique/interesting feature
4. **Process Scene 1 (2-3s)** - Show what happens (e.g., "Searching the web")
5. **Process Scene 2 (2-3s)** - Next step (e.g., "Generating with AI")
6. **Results Scene (6-8s)** - Show the output/value delivered
7. **CTA Scene (2s)** - Call to action with URL

**Present the plan to the user** with:
- Scene-by-scene breakdown
- Estimated timing for each scene
- What will be shown in each scene
- Total estimated video length

**Example:**
```
Proposed video structure (~25 seconds):

1. Hook (3s): "Struggling with your next project idea?"
2. Intro (2s): BuildRoulette logo + tagline
3. Slot Machine (9s): Show the 4-column slot machine with spin button animation
4. Web Research (3s): Animated search visualization
5. AI Generation (2s): AI thinking animation with sparkles
6. Results (7s): Display 3 generated ideas in cards
7. CTA (2s): "Try it now" + build.willness.dev

Total: ~25 seconds

Does this structure work for you?
```

## Phase 3: Technical Setup

### Git Workflow

1. Create a new branch for demo video work:
```bash
git checkout -b demo-video
```

2. All changes should be committed to this branch
3. Commit frequently with descriptive messages

### Install Dependencies

```bash
pnpm add remotion @remotion/cli @remotion/player @remotion/transitions
```

### File Structure

Create the following structure:

```
src/remotion/
├── Root.tsx              # Remotion root configuration
├── Composition.tsx       # Main video composition with transitions
├── index.ts             # Export for Remotion Studio
├── styles.ts            # Shared styles and constants
├── data.ts              # Mock/demo data
└── scenes/
    ├── Scene1Hook.tsx
    ├── Scene2Intro.tsx
    ├── Scene3[MainFeature].tsx
    ├── Scene4[Process1].tsx
    ├── Scene5[Process2].tsx
    ├── Scene6Results.tsx
    └── Scene7CTA.tsx
```

## Phase 4: Implementation

### Step 1: Create Root Configuration

**src/remotion/Root.tsx:**
```tsx
import React from 'react';
import { Composition } from 'remotion';
import { DemoVideo } from './Composition';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DemoVideo"
        component={DemoVideo}
        durationInFrames={750} // Adjust based on total scene durations
        fps={30}
        width={1080}
        height={960}
      />
    </>
  );
};
```

**src/remotion/index.ts:**
```tsx
import { registerRoot } from 'remotion';
import { RemotionRoot } from './Root';

registerRoot(RemotionRoot);
```

### Step 2: Create Shared Styles

**src/remotion/styles.ts:**
```tsx
// IMPORTANT: Match these to the actual app's styling
export const FONT_FAMILY = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

export const BACKGROUND_STYLE = {
  backgroundColor: "#030712", // Match app's background
  position: "relative" as const,
};

export const BACKGROUND_GRADIENT_OVERLAY = {
  position: "absolute" as const,
  inset: 0,
  background: "linear-gradient(to bottom right, rgba(17, 24, 39, 0.5), transparent, rgba(30, 58, 138, 0.2))",
  pointerEvents: "none" as const,
};
```

### Step 3: Create Main Composition with Static Background

**CRITICAL: Use static background to prevent gradient panning issues**

**src/remotion/Composition.tsx:**
```tsx
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { springTiming, TransitionSeries } from '@remotion/transitions';
import { slide } from '@remotion/transitions/slide';
import { fade } from '@remotion/transitions/fade';
import { Scene1Hook } from './scenes/Scene1Hook';
import { Scene2Intro } from './scenes/Scene2Intro';
// ... import other scenes
import { BACKGROUND_STYLE, BACKGROUND_GRADIENT_OVERLAY } from './styles';

export const DemoVideo: React.FC = () => {
  // Scene timings (in frames at 30fps)
  const scene1Duration = 90;
  const scene2Duration = 60;
  const scene3Duration = 270;
  // ... other scene durations

  const transitionDuration = 20; // 20 frames = smooth spring transitions

  return (
    <AbsoluteFill>
      {/* Static background - CRITICAL: doesn't transition */}
      <AbsoluteFill style={BACKGROUND_STYLE}>
        <div style={BACKGROUND_GRADIENT_OVERLAY} />
      </AbsoluteFill>

      {/* Content layer - transitions over static background */}
      <TransitionSeries>
        {/* Scene 1 */}
        <TransitionSeries.Sequence durationInFrames={scene1Duration}>
          <Scene1Hook />
        </TransitionSeries.Sequence>

        {/* Transition 1->2: Use fade for text-to-visual transitions */}
        <TransitionSeries.Transition
          presentation={fade({ shouldFadeOutExitingScene: true })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: transitionDuration })}
        />

        {/* Scene 2 */}
        <TransitionSeries.Sequence durationInFrames={scene2Duration}>
          <Scene2Intro />
        </TransitionSeries.Sequence>

        {/* Transition 2->3: Use slide for dynamic transitions */}
        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-right' })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: transitionDuration })}
        />

        {/* Continue pattern... */}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
```

### Step 4: Scene Implementation Guidelines

#### General Scene Structure

**Individual scenes should NOT include background styles** (background is static in Composition):

```tsx
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { FONT_FAMILY } from "../styles";

export const SceneExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Simple entrance animations for internal elements
  const elementOpacity = spring({
    frame: frame - 5,
    fps,
    config: { damping: 100 },
  });

  return (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Content here - NO background/gradient overlays */}
      <div style={{ opacity: elementOpacity }}>
        {/* Scene content */}
      </div>
    </AbsoluteFill>
  );
};
```

#### Scene-Specific Tips

**Hook Scene (Scene 1):**
- Large, bold text with a question or problem statement
- Simple fade-in animation
- Keep it punchy (3-4 seconds)

```tsx
<h1 style={{
  fontSize: 64,
  fontWeight: "bold",
  color: "white",
  fontFamily: FONT_FAMILY,
}}>
  Struggling with your next project idea?
</h1>
```

**Intro Scene (Scene 2):**
- Show logo using `staticFile()`
- App name in large text
- Tagline below
- Staggered animations (logo → title → tagline)

```tsx
import { Img, staticFile } from "remotion";

<Img
  src={staticFile("icon.png")}
  style={{ width: 120, height: 120, borderRadius: 16 }}
/>
```

**Main Feature Scene (Scene 3):**
- This is the star - give it 8-10 seconds
- Use actual components from the app when possible
- Add interactive elements (buttons, animations)
- Example: Animated button press before slot machine spins

**Process Scenes (Scene 4-5):**
- Show what's happening behind the scenes
- Use loading indicators, progress bars, search animations
- Keep these short (2-3 seconds each)
- Interpolate for continuous animations:

```tsx
const rotation = interpolate(frame % 60, [0, 60], [0, 360]);

<div style={{ transform: `rotate(${rotation}deg)` }}>
  {/* Spinner icon */}
</div>
```

**Results Scene (Scene 6):**
- Display the value/output
- Use staggered card animations
- Give enough time to appreciate results (6-8 seconds)

```tsx
const cardOpacity = spring({
  frame: frame - (20 + index * 15), // Stagger by index
  fps,
  config: { damping: 100 },
});
```

**CTA Scene (Scene 7):**
- Call to action button or text
- Production URL
- Keep it simple and clear

## Phase 5: Remotion Best Practices

### Transitions

**Preferred transition pattern:**
- Fade for text ↔ visual transitions
- Slide for visual ↔ visual transitions
- Vary slide directions for interest
- Always use `springTiming` with `damping: 200` for smoothness
- Use `shouldFadeOutExitingScene: true` for fade transitions to prevent overlap

```tsx
// Fade transition
<TransitionSeries.Transition
  presentation={fade({ shouldFadeOutExitingScene: true })}
  timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })}
/>

// Slide transition
<TransitionSeries.Transition
  presentation={slide({ direction: 'from-bottom' })}
  timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })}
/>
```

**Slide directions to mix:**
- `from-left`, `from-right`, `from-top`, `from-bottom`

### Animations

**Use spring for entrance animations:**
```tsx
const opacity = spring({
  frame: frame - 5, // Start at frame 5
  fps,
  config: { damping: 100 },
});
```

**Use interpolate for continuous/cyclical animations:**
```tsx
// Pulsing effect
const scale = interpolate(frame % 30, [0, 15, 30], [1, 1.2, 1]);

// Rotating spinner
const rotation = interpolate(frame, [0, 60], [0, 360]);
```

**Stagger animations by index:**
```tsx
items.map((item, index) => {
  const itemOpacity = spring({
    frame: frame - (20 + index * 15), // 15 frame delay between items
    fps,
    config: { damping: 100 },
  });
  // ...
});
```

### Typography

- Use the app's actual font (usually Inter, system fonts, or custom)
- Font sizes: 64-96px for titles, 24-48px for headings, 14-20px for body
- Always set `fontFamily: FONT_FAMILY`
- Use bold weights for impact

### Colors

- Match the app's color scheme
- Use gradient backgrounds for cards/buttons
- Add glows and shadows for depth:
  ```tsx
  boxShadow: "0 0 20px rgba(251, 191, 36, 0.6)"
  textShadow: "0 2px 4px rgba(0,0,0,0.8)"
  ```

### Performance

- Limit animations to what's necessary
- Use `extrapolateRight: "clamp"` to stop animations at endpoints
- Avoid complex calculations in every frame

## Phase 6: Common Pitfalls

### ❌ Don't Do This

1. **Don't add backgrounds to individual scenes**
   ```tsx
   // ❌ WRONG - causes gradient panning
   <AbsoluteFill style={{ ...BACKGROUND_STYLE }}>
     <div style={BACKGROUND_GRADIENT_OVERLAY} />
   ```

2. **Don't forget to fade out exiting scenes**
   ```tsx
   // ❌ WRONG - causes overlap
   presentation={fade()}

   // ✅ CORRECT
   presentation={fade({ shouldFadeOutExitingScene: true })}
   ```

3. **Don't use generic placeholder data**
   - Use real data from the app
   - Create realistic mock data based on actual prompts/features

4. **Don't skip the planning phase**
   - Always run your scene plan by the user first

5. **Don't use linearTiming**
   ```tsx
   // ❌ WRONG - too harsh
   timing={linearTiming({ durationInFrames: 20 })}

   // ✅ CORRECT - smooth and natural
   timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })}
   ```

### ✅ Do This

1. **Static background in Composition.tsx**
2. **Use springTiming for all transitions**
3. **Mix fade and slide transitions**
4. **Use real components and data**
5. **Give the main feature 8-10 seconds**
6. **Add staggered animations for multiple items**
7. **Use the app's actual font and colors**
8. **Commit changes frequently**

## Phase 7: Testing & Iteration

### Run Remotion Studio

```bash
npx remotion studio src/remotion/index.ts
```

### What to Check

1. **Timing** - Does each scene have enough time to be appreciated?
2. **Transitions** - Are they smooth? No weird gradient effects?
3. **Overlaps** - Do fade transitions properly fade out the exiting scene?
4. **Typography** - Is text readable? Proper font?
5. **Colors** - Do they match the app?
6. **Animations** - Are they smooth and not jarring?
7. **Content** - Does it accurately represent the app's features?

### Iterate Based on Feedback

User will likely request:
- Timing adjustments (add/remove frames)
- Different transition types
- Font changes
- Color adjustments
- Additional/different animations

Make changes incrementally and commit after each logical update.

## Phase 8: Package Scripts (Optional)

Add to package.json:
```json
{
  "scripts": {
    "remotion:studio": "remotion studio src/remotion/index.ts",
    "remotion:render": "remotion render src/remotion/index.ts DemoVideo out/demo.mp4"
  }
}
```

## Summary Checklist

Before considering the video complete:

- [ ] All scenes implemented with real/realistic data
- [ ] Static background in Composition.tsx (not individual scenes)
- [ ] Mix of fade and slide transitions
- [ ] All transitions use springTiming with damping: 200
- [ ] Fade transitions use shouldFadeOutExitingScene: true
- [ ] Proper font (matches app)
- [ ] Proper colors (matches app)
- [ ] Logo loads correctly with staticFile()
- [ ] Main feature gets 8-10 seconds
- [ ] Total duration is 20-30 seconds
- [ ] No overlap issues between scenes
- [ ] Smooth, professional transitions
- [ ] All changes committed to demo-video branch
- [ ] Remotion Studio runs without errors
- [ ] User has reviewed and approved

## Example Session Flow

1. **Ask discovery questions** → Get context about BuildRoulette
2. **Research codebase** → Read PRD, explore components, check styling
3. **Create scene plan** → 7 scenes, ~25 seconds total
4. **Get user approval** → User confirms plan
5. **Setup** → Create branch, install deps, create file structure
6. **Implement** → Build all 7 scenes with transitions
7. **Iterate** → User requests timing adjustments, transition improvements
8. **Polish** → Add spin button, adjust durations
9. **Complete** → All scenes working smoothly

---

## Key Takeaways

The most important lessons from successful demo video creation:

1. **Static background is critical** - Prevents gradient panning artifacts
2. **Plan first, code second** - Get user buy-in on structure
3. **Use real data** - Demo videos should accurately represent the app
4. **Smooth transitions matter** - springTiming with damping: 200
5. **Mix transition types** - Fade for context switches, slide for flow
6. **Give main features time** - 8-10 seconds for the hero scene
7. **Stagger animations** - Creates professional polish
8. **Match app styling** - Font, colors, overall aesthetic
9. **Iterate based on feedback** - Timing is subjective, adjust as needed
10. **Commit frequently** - Track progress with good commit messages
