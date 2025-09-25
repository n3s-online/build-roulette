"use client";

import { useState, useCallback } from "react";
import { Shuffle, Search, Lightbulb } from "lucide-react";
import Image from "next/image";
import SlotMachine from "@/components/slot-machine";
import SettingsDialog from "@/components/settings-dialog";
import IdeasDisplay from "@/components/ideas-display";
import FakeLoadingBar from "@/components/fake-loading-bar";
import { Combination } from "@/lib/types";
import { useGenerateIdeas } from "@/hooks/use-generate-ideas";
import { getStoredApiKey } from "@/lib/utils";

export default function Home() {
  const [currentCombination, setCurrentCombination] = useState<Combination | null>(null);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);

  const generateIdeasMutation = useGenerateIdeas();

  const handleSpinResult = (combination: Combination) => {
    setCurrentCombination(combination);
    generateIdeasMutation.reset(); // Clear previous ideas/errors
  };

  const handleGenerateIdeas = async (combination: Combination) => {
    const apiKey = getStoredApiKey();

    if (!apiKey) {
      setShowSettingsDialog(true);
      return;
    }

    generateIdeasMutation.mutate(
      { combination, apiKey },
      {
        onError: (error) => {
          // If it's an API key error, show settings dialog
          if (error?.code === "INVALID_API_KEY") {
            setShowSettingsDialog(true);
          }
        },
      }
    );
  };

  const handleApiKeyChange = useCallback((hasKey: boolean) => {
    if (hasKey) {
      setShowSettingsDialog(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900/50 via-transparent to-blue-900/20 pointer-events-none"></div>

      <main className="container mx-auto px-4 py-16 relative">
        <div className="max-w-4xl mx-auto">
          {/* Header with Settings */}
          <div className="flex justify-between items-start mb-16">
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                <Image
                  src="/icon.png"
                  alt="BuildRoulette Logo"
                  width={64}
                  height={64}
                  className="rounded-lg"
                />
                <h1 className="text-4xl sm:text-5xl font-bold text-white">
                  BuildRoulette
                </h1>
              </div>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Generate AI-powered product ideas based on real market research.
                We search the web for current problems, then create solutions.
              </p>
            </div>
            <div className="flex-shrink-0 ml-4">
              <SettingsDialog
                onApiKeyChange={handleApiKeyChange}
                open={showSettingsDialog}
                onOpenChange={setShowSettingsDialog}
              />
            </div>
          </div>

          {/* Slot Machine */}
          <div>
            <SlotMachine
              onResult={handleSpinResult}
              onGenerateIdeas={handleGenerateIdeas}
            />
          </div>

          {/* Loading State for AI Generation */}
          <FakeLoadingBar isLoading={generateIdeasMutation.isPending} />

          {/* Error State */}
          {generateIdeasMutation.error && !generateIdeasMutation.isPending && (
            <div className="max-w-lg w-full mx-auto mt-8">
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
                <div className="text-center">
                  <p className="text-red-400 font-medium mb-2">
                    Generation Failed
                  </p>
                  <p className="text-red-300 text-sm mb-4">{generateIdeasMutation.error.message}</p>
                  <button
                    onClick={() =>
                      currentCombination &&
                      handleGenerateIdeas(currentCombination)
                    }
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Generated Ideas Display */}
          {generateIdeasMutation.data && currentCombination && !generateIdeasMutation.isPending && (
            <div className="mt-12">
              <IdeasDisplay
                ideas={generateIdeasMutation.data.ideas}
                combination={currentCombination}
              />
            </div>
          )}
        </div>

        {/* How it Works Section */}
        <div className="max-w-2xl mx-auto mt-20 mb-8 px-4">
          <div className="bg-gray-900/50 rounded-xl p-8 border border-gray-700/50">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              How it Works
            </h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-center">
              <div className="flex-1">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shuffle className="text-white" size={24} />
                </div>
                <h4 className="font-semibold text-white mb-2">Spin</h4>
                <p className="text-gray-400 text-sm">
                  Generate random combinations of markets, users, and tech stacks
                </p>
              </div>

              <div className="hidden md:block text-gray-600 text-2xl">→</div>

              <div className="flex-1">
                <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="text-white" size={24} />
                </div>
                <h4 className="font-semibold text-white mb-2">Research</h4>
                <p className="text-gray-400 text-sm">
                  We search the web for real problems affecting your target market
                </p>
              </div>

              <div className="hidden md:block text-gray-600 text-2xl">→</div>

              <div className="flex-1">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lightbulb className="text-white" size={24} />
                </div>
                <h4 className="font-semibold text-white mb-2">Generate Ideas</h4>
                <p className="text-gray-400 text-sm">
                  AI creates solutions perfectly scoped for your timeline
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
