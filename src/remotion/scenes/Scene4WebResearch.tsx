import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { FONT_FAMILY } from "../styles";

const SearchIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

export const Scene4WebResearch: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Search icon animation
  const iconScale = spring({
    frame: frame - 5,
    fps,
    config: {
      damping: 100,
    },
  });

  const iconOpacity = spring({
    frame: frame - 5,
    fps,
    config: {
      damping: 100,
    },
  });

  // Radiating rings
  const ring1Scale = interpolate(frame, [10, 40], [0.8, 2], {
    extrapolateRight: "clamp",
  });
  const ring1Opacity = interpolate(frame, [10, 40], [0.8, 0], {
    extrapolateRight: "clamp",
  });

  const ring2Scale = interpolate(frame, [20, 50], [0.8, 2], {
    extrapolateRight: "clamp",
  });
  const ring2Opacity = interpolate(frame, [20, 50], [0.8, 0], {
    extrapolateRight: "clamp",
  });

  const ring3Scale = interpolate(frame, [30, 60], [0.8, 2], {
    extrapolateRight: "clamp",
  });
  const ring3Opacity = interpolate(frame, [30, 60], [0.8, 0], {
    extrapolateRight: "clamp",
  });

  // Text animations
  const searchTexts = [
    "Creator economy monetization trends...",
    "Content creator payment platforms...",
    "Subscription platform alternatives...",
  ];

  const text1Opacity = spring({
    frame: frame - 20,
    fps,
    config: { damping: 100 },
  });

  const text2Opacity = spring({
    frame: frame - 35,
    fps,
    config: { damping: 100 },
  });

  const text3Opacity = spring({
    frame: frame - 50,
    fps,
    config: { damping: 100 },
  });

  const textOpacities = [text1Opacity, text2Opacity, text3Opacity];

  // Progress bar
  const progressWidth = interpolate(frame, [10, 80], [0, 100], {
    extrapolateRight: "clamp",
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
        {/* Search icon with radiating rings */}
        <div
          style={{
            position: "relative",
            marginBottom: 40,
            width: 200,
            height: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Radiating rings */}
          <div
            style={{
              position: "absolute",
              width: 120,
              height: 120,
              borderRadius: "50%",
              border: "3px solid #10b981",
              transform: `scale(${ring1Scale})`,
              opacity: ring1Opacity,
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 120,
              height: 120,
              borderRadius: "50%",
              border: "3px solid #10b981",
              transform: `scale(${ring2Scale})`,
              opacity: ring2Opacity,
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 120,
              height: 120,
              borderRadius: "50%",
              border: "3px solid #10b981",
              transform: `scale(${ring3Scale})`,
              opacity: ring3Opacity,
            }}
          />

          {/* Search icon */}
          <div
            style={{
              background: "linear-gradient(135deg, #10b981, #059669)",
              borderRadius: "50%",
              width: 120,
              height: 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              opacity: iconOpacity,
              transform: `scale(${iconScale})`,
              boxShadow: "0 0 40px rgba(16, 185, 129, 0.5)",
            }}
          >
            <SearchIcon />
          </div>
        </div>

        {/* Main text */}
        <h2
          style={{
            fontSize: 48,
            fontWeight: "bold",
            color: "white",
            marginBottom: 40,
            margin: 0,
            fontFamily: FONT_FAMILY,
          }}
        >
          Searching the web...
        </h2>

        {/* Search queries */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            marginBottom: 40,
            maxWidth: 700,
          }}
        >
          {searchTexts.map((text, index) => (
            <div
              key={index}
              style={{
                fontSize: 20,
                color: "#10b981",
                fontFamily: "monospace",
                opacity: textOpacities[index],
                textAlign: "left",
              }}
            >
              &gt; {text}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div
          style={{
            width: 600,
            height: 12,
            background: "#1f2937",
            borderRadius: 6,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progressWidth}%`,
              height: "100%",
              background: "linear-gradient(to right, #10b981, #3b82f6)",
              borderRadius: 6,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Animated shine effect */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to right, transparent, rgba(255, 255, 255, 0.2), transparent)",
                transform: "skewX(-12deg)",
              }}
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
