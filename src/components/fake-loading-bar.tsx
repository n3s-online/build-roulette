"use client";

import { useState, useEffect, useMemo } from "react";

interface FakeLoadingBarProps {
  isLoading: boolean;
  onComplete?: () => void;
}

export default function FakeLoadingBar({ isLoading, onComplete }: FakeLoadingBarProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const loadingMessages = useMemo(() => [
    "Researching market trends...",
    "Analyzing competitor landscape...",
    "Identifying pain points...",
    "Generating creative solutions...",
    "Validating product concepts...",
    "Crafting marketing strategies...",
    "Optimizing tech stack selections...",
    "Finalizing recommendations...",
  ], []);

  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);

  useEffect(() => {
    if (!isLoading) {
      if (progress > 0) {
        // Start fade out after showing 100%
        setIsVisible(false);
        const resetTimeout = setTimeout(() => {
          setProgress(0);
          setLoadingMessage(loadingMessages[0]);
        }, 1000); // Wait for fade out
        return () => clearTimeout(resetTimeout);
      }
      return;
    }

    // Show the component when loading starts
    setIsVisible(true);

    const startTime = Date.now();
    const maxDuration = 60000; // 60 seconds

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const timeRatio = elapsed / maxDuration;

      // Generate random jumps with exponential slowdown
      let targetProgress;
      if (timeRatio >= 1) {
        // Cap at 95% after 40 seconds
        targetProgress = 95;
      } else {
        // Exponential curve that slows down as it approaches 95%
        const exponentialProgress = (1 - Math.exp(-timeRatio * 3)) * 95;
        // Add some randomness (0-3%) - only positive
        const randomOffset = Math.random() * 3;
        targetProgress = Math.min(95, exponentialProgress + randomOffset);
      }

      setProgress(prev => {
        // Only allow upward movement
        return Math.max(prev, targetProgress);
      });

      // Update loading message based on current progress
      setProgress(currentProgress => {
        const messageIndex = Math.min(
          Math.floor((currentProgress / 95) * loadingMessages.length),
          loadingMessages.length - 1
        );
        setLoadingMessage(loadingMessages[messageIndex]);
        return currentProgress;
      });
    };

    const interval = setInterval(updateProgress, 300 + Math.random() * 700); // Random intervals 300-1000ms

    return () => clearInterval(interval);
  }, [isLoading, loadingMessages]);

  // Complete loading when actual API call finishes
  useEffect(() => {
    if (!isLoading && progress > 0) {
      setProgress(100);
      const completeTimeout = setTimeout(() => {
        setIsVisible(false);
        if (onComplete) onComplete();
      }, 800); // Show 100% briefly before fading
      return () => clearTimeout(completeTimeout);
    }
    return undefined;
  }, [isLoading, progress, onComplete]);

  if (progress === 0 && !isLoading) return null;

  return (
    <div
      className={`max-w-lg w-full mx-auto mt-8 transition-all duration-1000 ${
        isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
      }`}
    >
      <div className="bg-gray-900 rounded-lg p-8 border border-emerald-500/20">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>

          <p className="text-white font-semibold mb-2">Generating Ideas...</p>
          <p className="text-gray-400 text-sm mb-6">{loadingMessage}</p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-800 rounded-full h-3 mb-4">
            <div
              className="bg-gradient-to-r from-emerald-500 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              {/* Animated shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse"></div>
            </div>
          </div>

          <p className="text-emerald-400 text-sm font-medium">
            {Math.round(progress)}% complete
          </p>
        </div>
      </div>
    </div>
  );
}