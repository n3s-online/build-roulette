"use client";

import { useState } from "react";
import SlotMachine from "@/components/slot-machine";
import SettingsDialog from "@/components/settings-dialog";
import IdeasDisplay from "@/components/ideas-display";
import FakeLoadingBar from "@/components/fake-loading-bar";
import { Combination } from "@/lib/types";
import { useGenerateIdeas } from "@/hooks/use-generate-ideas";
import { getStoredApiKey } from "@/lib/utils";

export default function Home() {
  const [currentCombination, setCurrentCombination] = useState<Combination | null>(null);
  const [hasApiKey, setHasApiKey] = useState(false);
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

  const handleApiKeyChange = (hasKey: boolean) => {
    setHasApiKey(hasKey);
    if (hasKey) {
      setShowSettingsDialog(false);
    }
  };

  const handleSpinAgain = () => {
    setCurrentCombination(null);
    generateIdeasMutation.reset();
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900/50 via-transparent to-blue-900/20 pointer-events-none"></div>

      <main className="container mx-auto px-4 py-16 relative">
        <div className="max-w-4xl mx-auto">
          {/* Header with Settings */}
          <div className="flex justify-between items-start mb-16">
            <div className="flex-1 text-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                BuildRoulette
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Generate random product combinations to spark your next indie
                project. Spin to discover new market opportunities.
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
                onSpinAgain={handleSpinAgain}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
