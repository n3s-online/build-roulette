"use client";

import { useState } from "react";
import RouletteWheel from "@/components/roulette-wheel";
import SettingsDialog from "@/components/settings-dialog";
import IdeasDisplay from "@/components/ideas-display";
import { Combination, GeneratedIdea, IdeaGenerationError } from "@/lib/types";
import { createAIService } from "@/lib/ai-service";
import { getStoredApiKey } from "@/lib/utils";

export default function Home() {
  const [currentCombination, setCurrentCombination] =
    useState<Combination | null>(null);
  const [generatedIdeas, setGeneratedIdeas] = useState<GeneratedIdea[] | null>(
    null
  );
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);

  const handleSpinResult = (combination: Combination) => {
    setCurrentCombination(combination);
    setGeneratedIdeas(null); // Clear previous ideas
    setGenerationError(null);
  };

  const handleGenerateIdeas = async (combination: Combination) => {
    const apiKey = getStoredApiKey();

    if (!apiKey) {
      setShowSettingsDialog(true);
      return;
    }

    setIsGeneratingIdeas(true);
    setGenerationError(null);

    try {
      const aiService = createAIService(apiKey);
      const response = await aiService.generateIdeas(combination);
      setGeneratedIdeas(response.ideas);
    } catch (error) {
      const aiError = error as IdeaGenerationError;
      setGenerationError(aiError.message);

      // If it's an API key error, show settings dialog
      if (aiError.code === "INVALID_API_KEY") {
        setShowSettingsDialog(true);
      }
    } finally {
      setIsGeneratingIdeas(false);
    }
  };

  const handleApiKeyChange = (hasKey: boolean) => {
    setHasApiKey(hasKey);
    if (hasKey) {
      setShowSettingsDialog(false);
    }
  };

  const handleSpinAgain = () => {
    setCurrentCombination(null);
    setGeneratedIdeas(null);
    setGenerationError(null);
  };

  return (
    <main className="min-h-screen bg-gray-950">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-transparent to-blue-900/20"></div>

      <div className="container mx-auto px-4 py-16 relative">
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
              <SettingsDialog onApiKeyChange={handleApiKeyChange} />
            </div>
          </div>

          {/* Slot Machine */}
          <div>
            <RouletteWheel
              onResult={handleSpinResult}
              onGenerateIdeas={handleGenerateIdeas}
            />
          </div>

          {/* Loading State for AI Generation */}
          {isGeneratingIdeas && (
            <div className="max-w-lg w-full mx-auto mt-8">
              <div className="bg-gray-900 rounded-lg p-8 border border-emerald-500/20">
                <div className="text-center">
                  <div className="w-12 h-12 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-white font-semibold mb-2">
                    Generating Ideas...
                  </p>
                  <p className="text-gray-400 text-sm">
                    AI is crafting unique product ideas for your combination
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {generationError && !isGeneratingIdeas && (
            <div className="max-w-lg w-full mx-auto mt-8">
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
                <div className="text-center">
                  <p className="text-red-400 font-medium mb-2">
                    Generation Failed
                  </p>
                  <p className="text-red-300 text-sm mb-4">{generationError}</p>
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
          {generatedIdeas && currentCombination && !isGeneratingIdeas && (
            <div className="mt-12">
              <IdeasDisplay
                ideas={generatedIdeas}
                combination={currentCombination}
                onGenerateNew={() => handleGenerateIdeas(currentCombination)}
                onSpinAgain={handleSpinAgain}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
