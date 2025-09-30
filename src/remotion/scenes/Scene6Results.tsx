import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { demoIdeas } from "../data";
import { FONT_FAMILY, BACKGROUND_STYLE, BACKGROUND_GRADIENT_OVERLAY } from "../styles";

const LightbulbIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"></path>
  </svg>
);

interface IdeaCardProps {
  idea: typeof demoIdeas[0];
  index: number;
  frame: number;
  fps: number;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, index, frame, fps }) => {
  // Staggered entrance animation
  const startFrame = 20 + index * 15;

  const cardScale = spring({
    frame: frame - startFrame,
    fps,
    config: {
      damping: 100,
    },
  });

  const cardOpacity = spring({
    frame: frame - startFrame,
    fps,
    config: {
      damping: 100,
    },
  });

  // Subtle float animation
  const floatY = interpolate(
    (frame + index * 20) % 90,
    [0, 45, 90],
    [0, -5, 0]
  );

  return (
    <div
      style={{
        background: "linear-gradient(to bottom right, #111827, #1f2937)",
        borderRadius: 12,
        border: "1px solid #374151",
        padding: 20,
        opacity: cardOpacity,
        transform: `scale(${cardScale}) translateY(${floatY}px)`,
        minHeight: 200,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            background: "linear-gradient(to bottom right, #10b981, #059669)",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          <LightbulbIcon />
        </div>
        <h3
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "white",
            margin: 0,
            fontFamily: FONT_FAMILY,
          }}
        >
          {idea.name}
        </h3>
      </div>

      {/* Description */}
      <p
        style={{
          fontSize: 14,
          fontFamily: FONT_FAMILY,
          color: "#d1d5db",
          lineHeight: 1.5,
          margin: 0,
          marginBottom: 16,
        }}
      >
        {idea.description}
      </p>

      {/* Features */}
      <div style={{ marginBottom: 12 }}>
        <h4
          style={{
            fontSize: 12,
            fontWeight: "bold",
            color: "#fbbf24",
            marginBottom: 8,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            fontFamily: FONT_FAMILY,
          }}
        >
          ⚡ Core Features
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {idea.coreFeatures.slice(0, 3).map((feature, i) => (
            <div
              key={i}
              style={{
                fontSize: 11,
                color: "#d1d5db",
                display: "flex",
                alignItems: "flex-start",
                gap: 6,
                fontFamily: FONT_FAMILY,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  background: "#fbbf24",
                  borderRadius: "50%",
                  marginTop: 4,
                  flexShrink: 0,
                }}
              />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div>
        <h4
          style={{
            fontSize: 12,
            fontWeight: "bold",
            color: "#3b82f6",
            marginBottom: 8,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            fontFamily: FONT_FAMILY,
          }}
        >
          💻 Tech Stack
        </h4>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {idea.suggestedTechStack.map((tech, i) => (
            <span
              key={i}
              style={{
                fontSize: 10,
                padding: "4px 8px",
                background: "rgba(59, 130, 246, 0.2)",
                color: "#93c5fd",
                borderRadius: 4,
                border: "1px solid rgba(59, 130, 246, 0.3)",
                fontFamily: FONT_FAMILY,
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Scene6Results: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Header animation
  const headerOpacity = spring({
    frame: frame - 5,
    fps,
    config: {
      damping: 100,
    },
  });

  return (
    <AbsoluteFill style={{ ...BACKGROUND_STYLE, padding: 40, overflow: "auto" }}>
      <div style={BACKGROUND_GRADIENT_OVERLAY} />

      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          width: "100%",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 30,
            opacity: headerOpacity,
          }}
        >
          <h2
            style={{
              fontSize: 40,
              fontWeight: "bold",
              color: "white",
              margin: 0,
              marginBottom: 12,
              fontFamily: FONT_FAMILY,
            }}
          >
            Your AI-Generated Ideas
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "#9ca3af",
              margin: 0,
              fontFamily: FONT_FAMILY,
            }}
          >
            <span style={{ color: "#3b82f6" }}>Creator Economy</span> ×{" "}
            <span style={{ color: "#10b981" }}>Content Creators</span> ×{" "}
            <span style={{ color: "#fbbf24" }}>Monetization</span> ×{" "}
            <span style={{ color: "#8b5cf6" }}>Web App</span>
          </p>
        </div>

        {/* Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}
        >
          {demoIdeas.map((idea, index) => (
            <IdeaCard
              key={index}
              idea={idea}
              index={index}
              frame={frame}
              fps={fps}
            />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
