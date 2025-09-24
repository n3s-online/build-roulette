"use client";

import { Briefcase, Users, Target, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { Market, UserType, ProblemType, TechStack } from "@/lib/types";

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
}

export default function SlotMachineReels({
  columnPositions,
  columnDurations,
  isSpinning,
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
        {/* Column Header */}
        <div className="mb-6 text-center">
          <div className="mb-2 flex justify-center text-gray-400">{icon}</div>
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
            {label}
          </h3>
        </div>

        {/* Clean Slot Column */}
        <div className="relative">
          <div className="w-40 h-80 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
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
                    className="h-20 flex items-center justify-center px-2 text-center border-b border-gray-700/50"
                    style={{ backgroundColor: color }}
                  >
                    <span
                      className={`text-white font-medium ${getTextSize(
                        item
                      )} ${getLineHeight(item)}`}
                      style={{
                        wordBreak: "break-word",
                        hyphens: "auto",
                        lineHeight: item.length > 12 ? "1.2" : "1.3",
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
      className={`bg-gray-900/50 rounded-2xl p-8 border border-gray-800 transition-all duration-300 ${
        isSpinning
          ? "shadow-[0_0_30px_rgba(59,130,246,0.3)] border-blue-500/30"
          : "shadow-[0_0_20px_rgba(0,0,0,0.5)]"
      }`}
    >
      <div className="flex gap-20 items-start justify-center">
        {renderColumn(
          MARKETS,
          0,
          "rgb(59 130 246)",
          "Market",
          <Briefcase size={20} />
        )}
        {renderColumn(
          USER_TYPES,
          1,
          "rgb(16 185 129)",
          "User Type",
          <Users size={20} />
        )}
        {renderColumn(
          PROBLEM_TYPES,
          2,
          "rgb(245 158 11)",
          "Problem",
          <Target size={20} />
        )}
        {renderColumn(
          TECH_STACKS,
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