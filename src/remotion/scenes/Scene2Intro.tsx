import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Img,
  staticFile,
} from "remotion";
import { FONT_FAMILY } from "../styles";

export const Scene2Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo animation
  const logoScale = spring({
    frame: frame - 5,
    fps,
    config: {
      damping: 100,
    },
  });

  const logoOpacity = spring({
    frame: frame - 5,
    fps,
    config: {
      damping: 100,
    },
  });

  // Title animation (slightly delayed)
  const titleScale = spring({
    frame: frame - 10,
    fps,
    config: {
      damping: 100,
    },
  });

  const titleOpacity = spring({
    frame: frame - 10,
    fps,
    config: {
      damping: 100,
    },
  });

  // Tagline animation (more delayed)
  const taglineOpacity = spring({
    frame: frame - 20,
    fps,
    config: {
      damping: 100,
    },
  });

  return (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <Img
          src={staticFile("icon.png")}
          style={{
            width: 120,
            height: 120,
            borderRadius: 16,
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
            marginBottom: 30,
          }}
        />

        {/* Title */}
        <h1
          style={{
            fontSize: 96,
            fontWeight: "bold",
            color: "white",
            margin: 0,
            marginBottom: 30,
            opacity: titleOpacity,
            transform: `scale(${titleScale})`,
            fontFamily: FONT_FAMILY,
          }}
        >
          BuildRoulette
        </h1>

        {/* Tagline */}
        <p
          style={{
            fontSize: 28,
            color: "#d1d5db", // gray-300
            maxWidth: 800,
            lineHeight: 1.6,
            opacity: taglineOpacity,
            margin: 0,
            paddingLeft: 40,
            paddingRight: 40,
            fontFamily: FONT_FAMILY,
          }}
        >
          AI-Powered Product Ideas from Real Market Research
        </p>
      </div>
    </AbsoluteFill>
  );
};
