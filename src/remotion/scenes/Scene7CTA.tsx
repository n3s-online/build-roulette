import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Img,
  staticFile,
} from "remotion";
import { FONT_FAMILY, BACKGROUND_STYLE, BACKGROUND_GRADIENT_OVERLAY } from "../styles";

export const Scene7CTA: React.FC = () => {
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
  const titleOpacity = spring({
    frame: frame - 10,
    fps,
    config: {
      damping: 100,
    },
  });

  // CTA animation (more delayed)
  const ctaOpacity = spring({
    frame: frame - 20,
    fps,
    config: {
      damping: 100,
    },
  });

  const ctaScale = spring({
    frame: frame - 20,
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
        {/* Logo */}
        <Img
          src={staticFile("icon.png")}
          style={{
            width: 100,
            height: 100,
            borderRadius: 16,
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
            marginBottom: 30,
          }}
        />

        {/* Title */}
        <h1
          style={{
            fontSize: 80,
            fontWeight: "bold",
            color: "white",
            margin: 0,
            marginBottom: 40,
            opacity: titleOpacity,
            fontFamily: FONT_FAMILY,
          }}
        >
          BuildRoulette
        </h1>

        {/* CTA Button */}
        <div
          style={{
            background: "linear-gradient(to right, #10b981, #3b82f6)",
            padding: "20px 60px",
            borderRadius: 12,
            opacity: ctaOpacity,
            transform: `scale(${ctaScale})`,
            boxShadow: "0 10px 40px rgba(16, 185, 129, 0.4)",
          }}
        >
          <h2
            style={{
              fontSize: 36,
              fontWeight: "bold",
              color: "white",
              margin: 0,
              fontFamily: FONT_FAMILY,
            }}
          >
            Try it now
          </h2>
        </div>

        {/* URL */}
        <p
          style={{
            fontSize: 28,
            color: "#9ca3af",
            marginTop: 30,
            opacity: ctaOpacity,
            fontFamily: FONT_FAMILY,
          }}
        >
          build.willness.dev
        </p>
      </div>
    </AbsoluteFill>
  );
};
