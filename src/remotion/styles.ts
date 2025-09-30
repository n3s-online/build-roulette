// Shared styles for the video

export const FONT_FAMILY = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

// Background matching the actual site
export const BACKGROUND_STYLE = {
  backgroundColor: "#030712", // gray-950
  position: "relative" as const,
};

export const BACKGROUND_GRADIENT_OVERLAY = {
  position: "absolute" as const,
  inset: 0,
  background: "linear-gradient(to bottom right, rgba(17, 24, 39, 0.5), transparent, rgba(30, 58, 138, 0.2))",
  pointerEvents: "none" as const,
};
