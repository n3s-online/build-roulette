import React from 'react';
import { Composition } from 'remotion';
import { DemoVideo } from './Composition';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DemoVideo"
        component={DemoVideo}
        durationInFrames={720} // 24 seconds at 30fps (with 6 transitions of 15 frames each)
        fps={30}
        width={1080}
        height={960}
      />
    </>
  );
};
