"use client";

import { useState, useCallback } from "react";
import { Lightbulb } from "lucide-react";
import SlotMachineReels from "./slot-machine-reels";
import ProjectScopeSelector from "./project-scope-slider";
import CombinationResults from "./combination-results";
import { playSound } from "@/lib/sounds";

// Re-export types from lib for consistency
export type {
  Market,
  UserType,
  ProblemType,
  TechStack,
  ProjectScope,
  Combination,
} from "@/lib/types";

import type { Combination, ProjectScope } from "@/lib/types";
import type { DimensionSettings } from "@/lib/utils";

interface SlotMachineProps {
  onResult?: (combination: Combination) => void;
  onGenerateIdeas?: (combination: Combination) => void;
  dimensionSettings: DimensionSettings;
}

export default function SlotMachine({
  onResult,
  onGenerateIdeas,
  dimensionSettings,
}: SlotMachineProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<Combination | null>(null);
  const [columnPositions, setColumnPositions] = useState<number[]>([0, 0, 0, 0]);
  const [columnDurations, setColumnDurations] = useState<number[]>([0, 0, 0, 0]);
  const [projectScope, setProjectScope] = useState<ProjectScope>("Weekend Project");

  const generateRandomResult = useCallback((): Combination => {
    return {
      market: dimensionSettings.markets[Math.floor(Math.random() * dimensionSettings.markets.length)]!,
      userType: dimensionSettings.userTypes[Math.floor(Math.random() * dimensionSettings.userTypes.length)]!,
      problemType: dimensionSettings.problemTypes[Math.floor(Math.random() * dimensionSettings.problemTypes.length)]!,
      techStack: dimensionSettings.techStacks[Math.floor(Math.random() * dimensionSettings.techStacks.length)]!,
      projectScope,
    };
  }, [projectScope, dimensionSettings]);

  const spin = useCallback(() => {
    if (isSpinning) return;

    setIsSpinning(true);
    setResult(null);
    playSound.spinStart();

    // Generate result first
    const newResult = generateRandomResult();
    console.log("🎯 Target results:", newResult);

    const columns = [
      dimensionSettings.markets,
      dimensionSettings.userTypes,
      dimensionSettings.problemTypes,
      dimensionSettings.techStacks
    ];
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

    // Play individual reel stop sounds
    durations.forEach((duration) => {
      setTimeout(() => {
        playSound.reelStop();
      }, duration);
    });

    // Show result after longest animation completes
    const longestDuration = Math.max(...durations);
    setTimeout(() => {
      setResult(newResult);
      setIsSpinning(false);
      playSound.allReelsStopped();
      onResult?.(newResult);
    }, longestDuration + 500);
  }, [isSpinning, generateRandomResult, onResult, dimensionSettings]);


  return (
    <div className="flex flex-col items-center space-y-8">
      {/* Slot Machine Reels */}
      <SlotMachineReels
        columnPositions={columnPositions}
        columnDurations={columnDurations}
        isSpinning={isSpinning}
        dimensionSettings={dimensionSettings}
      />

      {/* Spin Button - only show when no results */}
      {!result && !isSpinning && (
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
          Spin
        </button>
      )}

      {/* Results */}
      {result && !isSpinning && (
        <CombinationResults
          combination={result}
          onSpinAgain={spin}
        />
      )}

      {/* Project Scope Selector - shown after results */}
      {result && !isSpinning && (
        <ProjectScopeSelector
          value={projectScope}
          onChange={setProjectScope}
        />
      )}

      {/* Generate Ideas Button */}
      {result && !isSpinning && (
        <div className="max-w-lg w-full mx-auto">
          <button
            onClick={() => {
              playSound.generateIdeas();
              onGenerateIdeas?.({ ...result, projectScope });
            }}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-800 text-white font-bold text-lg rounded-xl transition-all duration-300 shadow-xl hover:shadow-emerald-500/30 hover:scale-105 border border-emerald-400/20"
          >
            <Lightbulb size={22} className="animate-pulse" />
            Generate Ideas with AI
            <span className="text-emerald-200 text-sm">✨</span>
          </button>
        </div>
      )}

      {/* Loading State */}
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
