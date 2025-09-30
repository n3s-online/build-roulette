import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { dimensionOptions, demoCombination } from "../data";
import { FONT_FAMILY, BACKGROUND_STYLE, BACKGROUND_GRADIENT_OVERLAY } from "../styles";

// Icons (simplified SVG versions)
const BriefcaseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const TargetIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="6"></circle>
    <circle cx="12" cy="12" r="2"></circle>
  </svg>
);

const ZapIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

const ChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

interface ColumnProps {
  data: string[];
  targetValue: string;
  color: string;
  label: string;
  icon: React.ReactNode;
  columnIndex: number;
  frame: number;
  fps: number;
}

const SlotColumn: React.FC<ColumnProps> = ({
  data,
  targetValue,
  color,
  label,
  icon,
  columnIndex,
  frame,
  fps,
}) => {
  // Create extended array for continuous scrolling
  const extendedData = Array(25).fill(data).flat();

  // Animation timing - staggered stops
  const startSpinFrame = 10;
  const spinDuration = [120, 150, 180, 210]; // Different durations for each column, all finish before scene ends
  const stopFrame = startSpinFrame + spinDuration[columnIndex]!;

  // Calculate target position
  const targetIndex = data.indexOf(targetValue);
  const itemHeight = 80;
  const extraRotations = [5, 10, 15, 20][columnIndex]!;
  const positionToCenter = targetIndex * itemHeight - 120;
  const extraSpins = extraRotations * data.length * itemHeight;
  const targetPosition = positionToCenter + extraSpins;

  // Animate the position
  const position =
    frame < startSpinFrame
      ? 0
      : frame >= stopFrame
      ? targetPosition
      : interpolate(frame, [startSpinFrame, stopFrame], [0, targetPosition], {
          easing: (t) => {
            // Ease out cubic
            return 1 - Math.pow(1 - t, 3);
          },
        });

  // Spinning indicator
  const isSpinning = frame >= startSpinFrame && frame < stopFrame;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Column Header */}
      <div
        style={{
          marginBottom: 30,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            padding: 12,
            borderRadius: "50%",
            background: "linear-gradient(to bottom right, #374151, #1f2937)",
            border: "1px solid #4b5563",
            marginBottom: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#d1d5db",
          }}
        >
          {icon}
        </div>
        <h3
          style={{
            fontSize: 12,
            fontWeight: "bold",
            color: "#d1d5db",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            margin: 0,
            fontFamily: FONT_FAMILY,
          }}
        >
          {label}
        </h3>
      </div>

      {/* Slot Column */}
      <div style={{ position: "relative" }}>
        <div
          style={{
            width: 176,
            height: 320,
            background: "linear-gradient(to bottom, #1f2937, #111827)",
            borderRadius: 12,
            border: "2px solid #4b5563",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Chevrons */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: -16,
              transform: "translateY(-50%)",
              zIndex: 20,
              color: isSpinning ? "#fbbf24" : "#9ca3af",
              filter: isSpinning
                ? "drop-shadow(0 0 12px rgba(251, 191, 54, 0.8))"
                : "drop-shadow(0 0 6px rgba(251, 191, 54, 0.3))",
            }}
          >
            <ChevronRight />
          </div>

          <div
            style={{
              position: "absolute",
              top: "50%",
              right: -16,
              transform: "translateY(-50%)",
              zIndex: 20,
              color: isSpinning ? "#fbbf24" : "#9ca3af",
              filter: isSpinning
                ? "drop-shadow(0 0 12px rgba(251, 191, 54, 0.8))"
                : "drop-shadow(0 0 6px rgba(251, 191, 54, 0.3))",
            }}
          >
            <ChevronLeft />
          </div>

          {/* Scrolling items */}
          <div
            style={{
              position: "relative",
              transform: `translateY(-${position}px)`,
            }}
          >
            {extendedData.map((item, index) => {
              // Check if this is the selected item and column has stopped
              const isStopped = frame >= stopFrame;
              const isSelected = isStopped && item === targetValue && index === Math.floor((position + 120) / itemHeight);

              return (
                <div
                  key={`${item}-${index}`}
                  style={{
                    height: itemHeight,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 12px",
                    textAlign: "center",
                    borderBottom: "1px solid rgba(75, 85, 99, 0.3)",
                    position: "relative",
                    overflow: "hidden",
                    background: `linear-gradient(135deg, ${color}f0 0%, ${color}dd 50%, ${color}cc 100%)`,
                    boxShadow: isSelected ? "0 0 20px rgba(251, 191, 54, 0.8), inset 0 0 20px rgba(251, 191, 54, 0.3)" : "none",
                  }}
                >
                  {/* Subtle shine overlay */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: isSelected
                        ? "linear-gradient(to right, transparent, rgba(251, 191, 54, 0.2), transparent)"
                        : "linear-gradient(to right, transparent, rgba(255, 255, 255, 0.05), transparent)",
                    }}
                  />

                  {/* Inner card effect */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 4,
                      background:
                        "linear-gradient(to bottom right, rgba(255, 255, 255, 0.1), transparent)",
                      borderRadius: 2,
                    }}
                  />

                  <span
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: item.length <= 8 ? 14 : item.length <= 12 ? 12 : 12,
                      lineHeight: item.length > 12 ? 1.2 : 1.3,
                      position: "relative",
                      zIndex: 10,
                      textShadow: isSelected
                        ? "0 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(251, 191, 54, 0.6)"
                        : "0 2px 4px rgba(0,0,0,0.8), 0 0 2px rgba(0,0,0,0.5)",
                      wordBreak: "break-word",
                      fontFamily: FONT_FAMILY,
                    }}
                  >
                    {item}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Scene3SlotMachine: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Container scale animation
  const containerScale = spring({
    frame: frame - 5,
    fps,
    config: {
      damping: 100,
    },
  });

  const containerOpacity = spring({
    frame: frame - 5,
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
          background:
            "linear-gradient(to bottom right, rgba(17, 24, 39, 0.9), rgba(3, 7, 18, 0.9))",
          backdropFilter: "blur(8px)",
          borderRadius: 24,
          padding: 40,
          border: "1px solid rgba(75, 85, 99, 0.5)",
          boxShadow: "0 0 40px rgba(0, 0, 0, 0.6)",
          opacity: containerOpacity,
          transform: `scale(${containerScale})`,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 48,
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <SlotColumn
            data={dimensionOptions.markets}
            targetValue={demoCombination.market}
            color="rgb(59 130 246)"
            label="Market"
            icon={<BriefcaseIcon />}
            columnIndex={0}
            frame={frame}
            fps={fps}
          />
          <SlotColumn
            data={dimensionOptions.userTypes}
            targetValue={demoCombination.userType}
            color="rgb(16 185 129)"
            label="User Type"
            icon={<UsersIcon />}
            columnIndex={1}
            frame={frame}
            fps={fps}
          />
          <SlotColumn
            data={dimensionOptions.problemTypes}
            targetValue={demoCombination.problemType}
            color="rgb(245 158 11)"
            label="Problem"
            icon={<TargetIcon />}
            columnIndex={2}
            frame={frame}
            fps={fps}
          />
          <SlotColumn
            data={dimensionOptions.techStacks}
            targetValue={demoCombination.techStack}
            color="rgb(139 92 246)"
            label="Tech Stack"
            icon={<ZapIcon />}
            columnIndex={3}
            frame={frame}
            fps={fps}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
