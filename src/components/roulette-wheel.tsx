"use client";

import { useState, useCallback } from "react";
import {
  Briefcase,
  Users,
  Target,
  Zap,
  Share,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
} from "lucide-react";

export type Market =
  | "SaaS"
  | "E-commerce"
  | "FinTech"
  | "HealthTech"
  | "EdTech"
  | "Gaming"
  | "Creator Economy"
  | "Real Estate"
  | "Travel"
  | "Food & Beverage"
  | "Fitness"
  | "Productivity";

export type UserType =
  | "Small Businesses"
  | "Freelancers"
  | "Students"
  | "Remote Workers"
  | "Content Creators"
  | "Parents"
  | "Seniors"
  | "Developers"
  | "Designers"
  | "Consultants";

export type ProblemType =
  | "Automation"
  | "Organization"
  | "Communication"
  | "Analytics"
  | "Monetization"
  | "Learning"
  | "Health Tracking"
  | "Time Management"
  | "Collaboration"
  | "Security";

export type TechStack =
  | "Web App"
  | "Mobile App"
  | "Browser Extension"
  | "API/MCP"
  | "Slack/Discord Bot";

export type Combination = {
  market: Market;
  userType: UserType;
  problemType: ProblemType;
  techStack: TechStack;
};

const MARKETS: Market[] = [
  "SaaS",
  "E-commerce",
  "FinTech",
  "HealthTech",
  "EdTech",
  "Gaming",
  "Creator Economy",
  "Real Estate",
  "Travel",
  "Food & Beverage",
  "Fitness",
  "Productivity",
];

const USER_TYPES: UserType[] = [
  "Small Businesses",
  "Freelancers",
  "Students",
  "Remote Workers",
  "Content Creators",
  "Parents",
  "Seniors",
  "Developers",
  "Designers",
  "Consultants",
];

const PROBLEM_TYPES: ProblemType[] = [
  "Automation",
  "Organization",
  "Communication",
  "Analytics",
  "Monetization",
  "Learning",
  "Health Tracking",
  "Time Management",
  "Collaboration",
  "Security",
];

const TECH_STACKS: TechStack[] = [
  "Web App",
  "Mobile App",
  "Browser Extension",
  "API/MCP",
  "Slack/Discord Bot",
];

interface RouletteWheelProps {
  onResult?: (combination: Combination) => void;
  onGenerateIdeas?: (combination: Combination) => void;
}

export default function RouletteWheel({
  onResult,
  onGenerateIdeas,
}: RouletteWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<Combination | null>(null);
  const [columnPositions, setColumnPositions] = useState<number[]>([
    0, 0, 0, 0,
  ]);
  const [columnDurations, setColumnDurations] = useState<number[]>([
    0, 0, 0, 0,
  ]);

  const generateRandomResult = useCallback((): Combination => {
    return {
      market: MARKETS[Math.floor(Math.random() * MARKETS.length)]!,
      userType: USER_TYPES[Math.floor(Math.random() * USER_TYPES.length)]!,
      problemType:
        PROBLEM_TYPES[Math.floor(Math.random() * PROBLEM_TYPES.length)]!,
      techStack: TECH_STACKS[Math.floor(Math.random() * TECH_STACKS.length)]!,
    };
  }, []);

  const spin = useCallback(() => {
    if (isSpinning) return;

    setIsSpinning(true);
    setResult(null);

    // Generate result first
    const newResult = generateRandomResult();
    console.log("🎯 Target results:", newResult);

    const columns = [MARKETS, USER_TYPES, PROBLEM_TYPES, TECH_STACKS];
    const targetValues = [
      newResult.market,
      newResult.userType,
      newResult.problemType,
      newResult.techStack,
    ];
    const extraRotations = [5, 10, 15, 20]; // Each column gets different amounts of spinning

    // Calculate target positions with staggered extra rotations
    const targetPositions = columns.map((columnData, index) => {
      const targetIndex = (columnData as readonly string[]).indexOf(
        targetValues[index]!
      );
      const itemHeight = 80;
      const columnLength = columnData.length;
      const positionToCenter = targetIndex * itemHeight - 120;
      const extraSpins = extraRotations[index]! * columnLength * itemHeight;
      return positionToCenter + extraSpins;
    });

    // Calculate animation durations based on rotation count (200ms per rotation)
    const baseDuration = 200;
    const durations = extraRotations.map(
      (rotations) => rotations * baseDuration
    );

    setColumnPositions(targetPositions);
    setColumnDurations(durations);

    // Show result after longest animation completes
    const longestDuration = Math.max(...durations);
    setTimeout(() => {
      setResult(newResult);
      setIsSpinning(false);
      onResult?.(newResult);
    }, longestDuration + 500);
  }, [isSpinning, generateRandomResult, onResult]);

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
    <div className="flex flex-col items-center space-y-8">
      {/* Clean Slot Machine */}
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

      {/* Modern Spin Button */}
      <button
        onClick={spin}
        disabled={isSpinning}
        className={`
          px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700
          text-white font-semibold rounded-lg
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        {isSpinning ? "Spinning..." : "Spin"}
      </button>

      {/* Results Card */}
      {result && !isSpinning && (
        <div className="max-w-lg w-full mx-auto">
          <div className="bg-gray-900 rounded-lg p-6 border border-emerald-500/20 shadow-[0_0_25px_rgba(34,197,94,0.2)]">
            <h3 className="text-lg font-semibold text-white mb-6 text-center">
              Your Combination
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 px-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Briefcase size={16} className="text-blue-400" />
                  <span className="text-gray-300 font-medium">Market</span>
                </div>
                <span className="text-blue-400 font-semibold">
                  {result.market}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 px-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Users size={16} className="text-emerald-400" />
                  <span className="text-gray-300 font-medium">User Type</span>
                </div>
                <span className="text-emerald-400 font-semibold">
                  {result.userType}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 px-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Target size={16} className="text-amber-400" />
                  <span className="text-gray-300 font-medium">Problem</span>
                </div>
                <span className="text-amber-400 font-semibold">
                  {result.problemType}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 px-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Zap size={16} className="text-purple-400" />
                  <span className="text-gray-300 font-medium">Tech Stack</span>
                </div>
                <span className="text-purple-400 font-semibold">
                  {result.techStack}
                </span>
              </div>
            </div>


            {/* Secondary Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() =>
                  navigator.share?.({
                    title: "BuildRoulette Result",
                    text: `My combination: ${result.market} + ${result.userType} + ${result.problemType} + ${result.techStack}`,
                    url: window.location.href,
                  })
                }
                className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
              >
                <Share size={16} />
                Share
              </button>
              <button
                onClick={spin}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                <RotateCcw size={16} />
                Spin Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generate Ideas Button - Prominent placement outside results */}
      {result && !isSpinning && (
        <div className="max-w-lg w-full mx-auto">
          <button
            onClick={() => onGenerateIdeas?.(result)}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-800 text-white font-bold text-lg rounded-xl transition-all duration-300 shadow-xl hover:shadow-emerald-500/30 hover:scale-105 border border-emerald-400/20"
          >
            <Lightbulb size={22} className="animate-pulse" />
            Generate Ideas with AI
            <span className="text-emerald-200 text-sm">✨</span>
          </button>
        </div>
      )}

      {isSpinning && (
        <div className="max-w-lg w-full mx-auto">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white font-medium mb-2">Spinning...</p>
              <p className="text-gray-400 text-sm">
                Generating your combination
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
