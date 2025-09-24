"use client";

import { Briefcase, Users, Target, Zap, Clock, RotateCcw } from "lucide-react";
import { Combination } from "@/lib/types";

interface CombinationResultsProps {
  combination: Combination;
  onSpinAgain: () => void;
}

export default function CombinationResults({
  combination,
  onSpinAgain,
}: CombinationResultsProps) {
  return (
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
              {combination.market}
            </span>
          </div>

          <div className="flex items-center justify-between py-3 px-4 bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Users size={16} className="text-emerald-400" />
              <span className="text-gray-300 font-medium">User Type</span>
            </div>
            <span className="text-emerald-400 font-semibold">
              {combination.userType}
            </span>
          </div>

          <div className="flex items-center justify-between py-3 px-4 bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Target size={16} className="text-amber-400" />
              <span className="text-gray-300 font-medium">Problem</span>
            </div>
            <span className="text-amber-400 font-semibold">
              {combination.problemType}
            </span>
          </div>

          <div className="flex items-center justify-between py-3 px-4 bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Zap size={16} className="text-purple-400" />
              <span className="text-gray-300 font-medium">Tech Stack</span>
            </div>
            <span className="text-purple-400 font-semibold">
              {combination.techStack}
            </span>
          </div>

          <div className="flex items-center justify-between py-3 px-4 bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-rose-400" />
              <span className="text-gray-300 font-medium">Project Scope</span>
            </div>
            <span className="text-rose-400 font-semibold">
              {combination.projectScope}
            </span>
          </div>
        </div>

        {/* Secondary Action */}
        <div className="flex justify-center mt-6">
          <button
            onClick={onSpinAgain}
            className="flex items-center justify-center gap-2 py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <RotateCcw size={16} />
            Spin Again
          </button>
        </div>
      </div>
    </div>
  );
}