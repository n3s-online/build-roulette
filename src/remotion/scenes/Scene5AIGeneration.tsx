import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { FONT_FAMILY, BACKGROUND_STYLE, BACKGROUND_GRADIENT_OVERLAY } from "../styles";

const LightbulbIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 18h6"></path>
    <path d="M10 22h4"></path>
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"></path>
  </svg>
);

export const Scene5AIGeneration: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Icon animation
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

  // Pulsing glow effect
  const glowScale = interpolate(frame % 30, [0, 15, 30], [1, 1.2, 1]);
  const glowOpacity = interpolate(frame % 30, [0, 15, 30], [0.3, 0.6, 0.3]);

  // Sparkles
  const sparkle1Opacity = interpolate((frame + 0) % 45, [0, 10, 20], [0, 1, 0], {
    extrapolateRight: "clamp",
  });
  const sparkle2Opacity = interpolate((frame + 15) % 45, [0, 10, 20], [0, 1, 0], {
    extrapolateRight: "clamp",
  });
  const sparkle3Opacity = interpolate((frame + 30) % 45, [0, 10, 20], [0, 1, 0], {
    extrapolateRight: "clamp",
  });

  // Text animation
  const textOpacity = spring({
    frame: frame - 10,
    fps,
    config: {
      damping: 100,
    },
  });

  return (
    <AbsoluteFill style={{ ...BACKGROUND_STYLE, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={BACKGROUND_GRADIENT_OVERLAY} />

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
        {/* Lightbulb icon with glow and sparkles */}
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
          {/* Pulsing glow */}
          <div
            style={{
              position: "absolute",
              width: 180,
              height: 180,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(16, 185, 129, 0.4), transparent)",
              transform: `scale(${glowScale})`,
              opacity: glowOpacity,
            }}
          />

          {/* Sparkles */}
          <div
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              fontSize: 32,
              opacity: sparkle1Opacity,
            }}
          >
            ✨
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 20,
              left: 20,
              fontSize: 32,
              opacity: sparkle2Opacity,
            }}
          >
            ✨
          </div>
          <div
            style={{
              position: "absolute",
              top: 40,
              left: 40,
              fontSize: 32,
              opacity: sparkle3Opacity,
            }}
          >
            ✨
          </div>

          {/* Lightbulb icon */}
          <div
            style={{
              background: "linear-gradient(135deg, #10b981, #059669)",
              borderRadius: "50%",
              width: 140,
              height: 140,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              opacity: iconOpacity,
              transform: `scale(${iconScale})`,
              boxShadow: "0 0 60px rgba(16, 185, 129, 0.6)",
            }}
          >
            <LightbulbIcon />
          </div>
        </div>

        {/* Text */}
        <h2
          style={{
            fontSize: 48,
            fontWeight: "bold",
            color: "white",
            margin: 0,
            opacity: textOpacity,
            fontFamily: FONT_FAMILY,
          }}
        >
          Generating Ideas with AI...
        </h2>

        {/* Spinner */}
        <div
          style={{
            marginTop: 40,
            width: 48,
            height: 48,
            border: "4px solid #1f2937",
            borderTop: "4px solid #10b981",
            borderRadius: "50%",
            transform: `rotate(${frame * 12}deg)`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
