import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { FONT_FAMILY, BACKGROUND_STYLE, BACKGROUND_GRADIENT_OVERLAY } from "../styles";

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Text fade in and scale animation
  const textOpacity = spring({
    frame: frame - 5,
    fps,
    config: {
      damping: 100,
    },
  });

  const textScale = spring({
    frame: frame - 5,
    fps,
    config: {
      damping: 100,
    },
  });

  return (
    <AbsoluteFill style={BACKGROUND_STYLE}>
      <div style={BACKGROUND_GRADIENT_OVERLAY} />

      {/* Centered text */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${textScale})`,
          opacity: textOpacity,
          textAlign: "center",
          maxWidth: "90%",
        }}
      >
        <h1
          style={{
            fontSize: 64,
            fontWeight: "bold",
            color: "white",
            margin: 0,
            marginBottom: 20,
            lineHeight: 1.2,
            fontFamily: FONT_FAMILY,
          }}
        >
          Struggling with your
        </h1>
        <h1
          style={{
            fontSize: 64,
            fontWeight: "bold",
            color: "white",
            margin: 0,
            lineHeight: 1.2,
            fontFamily: FONT_FAMILY,
          }}
        >
          next project idea?
        </h1>
      </div>
    </AbsoluteFill>
  );
};
