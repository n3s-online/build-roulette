import React from 'react';
import { Composition } from 'remotion';
import { DemoVideo } from './Composition';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DemoVideo"
        component={DemoVideo}
        durationInFrames={690} // 23 seconds at 30fps (with 6 transitions of 20 frames each)
        fps={30}
        width={1080}
        height={960}
      />
    </>
  );
};
