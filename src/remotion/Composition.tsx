import React from 'react';
import { AbsoluteFill } from 'remotion';
import { linearTiming, TransitionSeries } from '@remotion/transitions';
import { slide } from '@remotion/transitions/slide';
import { Scene1Hook } from './scenes/Scene1Hook';
import { Scene2Intro } from './scenes/Scene2Intro';
import { Scene3SlotMachine } from './scenes/Scene3SlotMachine';
import { Scene4WebResearch } from './scenes/Scene4WebResearch';
import { Scene5AIGeneration } from './scenes/Scene5AIGeneration';
import { Scene6Results } from './scenes/Scene6Results';
import { Scene7CTA } from './scenes/Scene7CTA';

export const DemoVideo: React.FC = () => {
  // Scene timings (in frames at 30fps)
  const scene1Duration = 90; // 3 seconds - Hook
  const scene2Duration = 60; // 2 seconds - Intro
  const scene3Duration = 240; // 8 seconds - Slot Machine (the star)
  const scene4Duration = 90; // 3 seconds - Web Research
  const scene5Duration = 60; // 2 seconds - AI Generation
  const scene6Duration = 210; // 7 seconds - Results
  const scene7Duration = 60; // 2 seconds - CTA

  const transitionDuration = 15; // frames for each transition

  return (
    <AbsoluteFill>
      <TransitionSeries>
        {/* Scene 1: Hook */}
        <TransitionSeries.Sequence durationInFrames={scene1Duration}>
          <Scene1Hook />
        </TransitionSeries.Sequence>

        {/* Transition 1 -> 2: Slide from bottom */}
        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-bottom' })}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* Scene 2: Intro */}
        <TransitionSeries.Sequence durationInFrames={scene2Duration}>
          <Scene2Intro />
        </TransitionSeries.Sequence>

        {/* Transition 2 -> 3: Slide from right */}
        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-right' })}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* Scene 3: Slot Machine */}
        <TransitionSeries.Sequence durationInFrames={scene3Duration}>
          <Scene3SlotMachine />
        </TransitionSeries.Sequence>

        {/* Transition 3 -> 4: Slide from left */}
        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-left' })}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* Scene 4: Web Research */}
        <TransitionSeries.Sequence durationInFrames={scene4Duration}>
          <Scene4WebResearch />
        </TransitionSeries.Sequence>

        {/* Transition 4 -> 5: Slide from top */}
        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-top' })}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* Scene 5: AI Generation */}
        <TransitionSeries.Sequence durationInFrames={scene5Duration}>
          <Scene5AIGeneration />
        </TransitionSeries.Sequence>

        {/* Transition 5 -> 6: Slide from bottom */}
        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-bottom' })}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* Scene 6: Results */}
        <TransitionSeries.Sequence durationInFrames={scene6Duration}>
          <Scene6Results />
        </TransitionSeries.Sequence>

        {/* Transition 6 -> 7: Slide from right */}
        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-right' })}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* Scene 7: CTA */}
        <TransitionSeries.Sequence durationInFrames={scene7Duration}>
          <Scene7CTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
