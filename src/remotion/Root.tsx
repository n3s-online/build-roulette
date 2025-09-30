import React from 'react';
import { Composition } from 'remotion';
import { DemoVideo } from './Composition';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DemoVideo"
        component={DemoVideo}
        durationInFrames={750} // 25 seconds at 30fps
        fps={30}
        width={1080}
        height={960}
      />
    </>
  );
};
