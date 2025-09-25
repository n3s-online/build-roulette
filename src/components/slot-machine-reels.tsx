"use client";

import { Briefcase, Users, Target, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { Market, UserType, ProblemType, TechStack } from "@/lib/types";
import type { DimensionSettings } from "@/lib/utils";

// These constants are now only used internally by this component
// The actual data comes from dimensionSettings prop
const MARKETS: Market[] = [
  "SaaS", "E-commerce", "FinTech", "HealthTech", "EdTech", "Gaming",
  "Creator Economy", "Real Estate", "Travel", "Food & Beverage", "Fitness", "Productivity",
];

const USER_TYPES: UserType[] = [
  "Small Businesses", "Freelancers", "Students", "Remote Workers", "Content Creators",
  "Parents", "Seniors", "Developers", "Designers", "Consultants",
];

const PROBLEM_TYPES: ProblemType[] = [
  "Automation", "Organization", "Communication", "Analytics", "Monetization",
  "Learning", "Health Tracking", "Time Management", "Collaboration", "Security",
];

const TECH_STACKS: TechStack[] = [
  "Web App", "Mobile App", "Browser Extension", "API/MCP", "Slack/Discord Bot",
];

interface SlotMachineReelsProps {
  columnPositions: number[];
  columnDurations: number[];
  isSpinning: boolean;
  dimensionSettings: DimensionSettings;
}

export default function SlotMachineReels({
  columnPositions,
  columnDurations,
  isSpinning,
  dimensionSettings,
}: SlotMachineReelsProps) {
  const renderColumn = (
    data: readonly string[],
    columnIndex: number,
    color: string,
    label: string,
    icon: React.ReactNode
  ) => {
    // Create extended array for continuous scrolling effect
    const extendedData = Array(25).fill(data).flat();

    return (
      <div key={label} className="flex flex-col items-center">
        {/* Enhanced Column Header */}
        <div className="mb-8 text-center">
          <div className="mb-3 flex justify-center">
            <div className="p-3 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-600 shadow-lg">
              <div className="text-gray-300">{icon}</div>
            </div>
          </div>
          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider drop-shadow-sm">
            {label}
          </h3>
        </div>

        {/* Enhanced Slot Column */}
        <div className="relative">
          <div className="w-44 h-80 bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl border-2 border-gray-600 overflow-hidden shadow-xl">
            {/* Left Arrow - pointing toward column */}
            <div className="absolute top-1/2 -left-4 transform -translate-y-1/2 z-20">
              <ChevronRight
                size={20}
                className={`transition-all duration-300 ${
                  isSpinning
                    ? "text-yellow-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]"
                    : "text-gray-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.3)]"
                }`}
              />
            </div>

            {/* Right Arrow - pointing toward column */}
            <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
              <ChevronLeft
                size={20}
                className={`transition-all duration-300 ${
                  isSpinning
                    ? "text-yellow-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]"
                    : "text-gray-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.3)]"
                }`}
              />
            </div>

            {/* Scrolling items */}
            <div
              className={`relative ${
                isSpinning ? "transition-transform ease-out" : ""
              }`}
              style={{
                transform: `translateY(-${columnPositions[columnIndex]}px)`,
                transitionDuration: isSpinning
                  ? `${columnDurations[columnIndex]}ms`
                  : "0ms",
              }}
            >
              {extendedData.map((item, index) => {
                // Dynamic text sizing based on length
                const getTextSize = (text: string) => {
                  if (text.length <= 8) return "text-sm";
                  if (text.length <= 12) return "text-xs";
                  if (text.length <= 16) return "text-xs";
                  return "text-xs";
                };

                const getLineHeight = (text: string) => {
                  if (text.length <= 8) return "leading-tight";
                  if (text.length <= 12) return "leading-tight";
                  return "leading-tight";
                };

                return (
                  <div
                    key={`${item}-${index}`}
                    className="h-20 flex items-center justify-center px-3 text-center border-b border-gray-700/30 relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${color}f0 0%, ${color}dd 50%, ${color}cc 100%)`,
                    }}
                  >
                    {/* Subtle shine overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />

                    {/* Inner card effect */}
                    <div className="absolute inset-1 bg-gradient-to-br from-white/10 to-transparent rounded-sm" />

                    <span
                      className={`text-white font-bold ${getTextSize(
                        item
                      )} ${getLineHeight(item)} relative z-10 drop-shadow-lg`}
                      style={{
                        wordBreak: "break-word",
                        hyphens: "auto",
                        lineHeight: item.length > 12 ? "1.2" : "1.3",
                        textShadow: '0 2px 4px rgba(0,0,0,0.8), 0 0 2px rgba(0,0,0,0.5)',
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

  return (
    <div
      className={`bg-gradient-to-br from-gray-900/90 to-gray-950/90 backdrop-blur-sm rounded-3xl p-10 border transition-all duration-500 ${
        isSpinning
          ? "shadow-[0_0_40px_rgba(59,130,246,0.4)] border-blue-400/50 scale-[1.02]"
          : "shadow-[0_0_25px_rgba(0,0,0,0.6)] border-gray-700/50"
      }`}
    >
      <div className="flex gap-12 items-start justify-center">
        {renderColumn(
          dimensionSettings.markets,
          0,
          "rgb(59 130 246)",
          "Market",
          <Briefcase size={20} />
        )}
        {renderColumn(
          dimensionSettings.userTypes,
          1,
          "rgb(16 185 129)",
          "User Type",
          <Users size={20} />
        )}
        {renderColumn(
          dimensionSettings.problemTypes,
          2,
          "rgb(245 158 11)",
          "Problem",
          <Target size={20} />
        )}
        {renderColumn(
          dimensionSettings.techStacks,
          3,
          "rgb(139 92 246)",
          "Tech Stack",
          <Zap size={20} />
        )}
      </div>
    </div>
  );

  // Export the arrays for use by the parent component
}

export { MARKETS, USER_TYPES, PROBLEM_TYPES, TECH_STACKS };