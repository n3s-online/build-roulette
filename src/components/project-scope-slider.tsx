"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { ProjectScope } from "@/lib/types";

const PROJECT_SCOPES: ProjectScope[] = [
  "Weekend Project",
  "1 Week Sprint",
  "1 Month Build",
  "3 Month Project",
  "6 Month Journey",
];

interface ProjectScopeSelectorProps {
  value: ProjectScope;
  onChange: (scope: ProjectScope) => void;
}

export default function ProjectScopeSelector({ value, onChange }: ProjectScopeSelectorProps) {
  const [projectScopeIndex, setProjectScopeIndex] = useState(0);

  // Update index when value prop changes
  useEffect(() => {
    const index = PROJECT_SCOPES.indexOf(value);
    if (index !== -1) {
      setProjectScopeIndex(index);
    }
  }, [value]);

  // Load project scope from localStorage on mount
  useEffect(() => {
    const savedScope = localStorage.getItem('buildRouletteProjectScope');
    if (savedScope) {
      const index = PROJECT_SCOPES.indexOf(savedScope as ProjectScope);
      if (index !== -1) {
        setProjectScopeIndex(index);
        onChange(PROJECT_SCOPES[index]!);
      }
    }
  }, [onChange]);

  // Save project scope to localStorage when changed
  const handleProjectScopeChange = (index: number) => {
    setProjectScopeIndex(index);
    const scope = PROJECT_SCOPES[index]!;
    localStorage.setItem('buildRouletteProjectScope', scope);
    onChange(scope);
  };

  return (
    <div className="max-w-lg w-full mx-auto">
      <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <Clock size={18} className="text-rose-400" />
          <h3 className="text-white font-semibold">Project Scope</h3>
        </div>

        <div className="space-y-4">
          {/* Slider */}
          <div className="relative">
            <input
              type="range"
              min="0"
              max={PROJECT_SCOPES.length - 1}
              value={projectScopeIndex}
              onChange={(e) => handleProjectScopeChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, rgb(244 63 94) 0%, rgb(244 63 94) ${(projectScopeIndex / (PROJECT_SCOPES.length - 1)) * 100}%, rgb(55 65 81) ${(projectScopeIndex / (PROJECT_SCOPES.length - 1)) * 100}%, rgb(55 65 81) 100%)`
              }}
            />
          </div>

          {/* Current Selection */}
          <div className="text-center">
            <span className="text-rose-400 font-semibold text-lg">
              {PROJECT_SCOPES[projectScopeIndex]}
            </span>
          </div>

          {/* Labels */}
          <div className="flex justify-between text-xs text-gray-400">
            <span>Weekend</span>
            <span>1 Week</span>
            <span>1 Month</span>
            <span>3 Months</span>
            <span>6 Months</span>
          </div>
        </div>
      </div>
    </div>
  );
}