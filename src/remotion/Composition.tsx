import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { Scene1Hook } from './scenes/Scene1Hook';
import { Scene2Intro } from './scenes/Scene2Intro';
import { Scene3SlotMachine } from './scenes/Scene3SlotMachine';
import { Scene4WebResearch } from './scenes/Scene4WebResearch';
import { Scene5AIGeneration } from './scenes/Scene5AIGeneration';
import { Scene6Results } from './scenes/Scene6Results';
import { Scene7CTA } from './scenes/Scene7CTA';

export const DemoVideo: React.FC = () => {
  // Scene timings (in frames at 30fps)
  // Total: ~25 seconds = 750 frames
  const scene1Duration = 90; // 3 seconds - Hook
  const scene2Duration = 60; // 2 seconds - Intro
  const scene3Duration = 240; // 8 seconds - Slot Machine (the star)
  const scene4Duration = 90; // 3 seconds - Web Research
  const scene5Duration = 60; // 2 seconds - AI Generation
  const scene6Duration = 210; // 7 seconds - Results
  const scene7Duration = 60; // 2 seconds - CTA

  let currentFrame = 0;

  return (
    <AbsoluteFill>
      {/* Scene 1: Hook */}
      <Sequence from={currentFrame} durationInFrames={scene1Duration}>
        <Scene1Hook />
      </Sequence>

      {/* Scene 2: Intro */}
      <Sequence from={(currentFrame += scene1Duration)} durationInFrames={scene2Duration}>
        <Scene2Intro />
      </Sequence>

      {/* Scene 3: Slot Machine */}
      <Sequence from={(currentFrame += scene2Duration)} durationInFrames={scene3Duration}>
        <Scene3SlotMachine />
      </Sequence>

      {/* Scene 4: Web Research */}
      <Sequence from={(currentFrame += scene3Duration)} durationInFrames={scene4Duration}>
        <Scene4WebResearch />
      </Sequence>

      {/* Scene 5: AI Generation */}
      <Sequence from={(currentFrame += scene4Duration)} durationInFrames={scene5Duration}>
        <Scene5AIGeneration />
      </Sequence>

      {/* Scene 6: Results */}
      <Sequence from={(currentFrame += scene5Duration)} durationInFrames={scene6Duration}>
        <Scene6Results />
      </Sequence>

      {/* Scene 7: CTA */}
      <Sequence from={(currentFrame += scene6Duration)} durationInFrames={scene7Duration}>
        <Scene7CTA />
      </Sequence>
    </AbsoluteFill>
  );
};
