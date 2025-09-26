"use client";

import { useState, useEffect } from "react";
import { Settings, Eye, EyeOff, Briefcase, Users, Target, Zap, Volume2, VolumeX } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  getStoredApiKey,
  storeApiKey,
  removeStoredApiKey,
  getStoredDimensionSettings,
  storeDimensionSettings,
  DEFAULT_DIMENSION_SETTINGS,
  getStoredModel,
  storeModel,
  type DimensionSettings,
  type PerplexityModel
} from "@/lib/utils";
import { soundManager, playSound } from "@/lib/sounds";

interface SettingsDialogProps {
  onApiKeyChange?: (hasKey: boolean) => void;
  onDimensionSettingsChange?: (settings: DimensionSettings) => void;
  onModelChange?: (model: PerplexityModel) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function SettingsDialog({
  onApiKeyChange,
  onDimensionSettingsChange,
  onModelChange,
  open,
  onOpenChange,
}: SettingsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [hasStoredKey, setHasStoredKey] = useState(false);
  const [dimensionSettings, setDimensionSettings] = useState<DimensionSettings>(DEFAULT_DIMENSION_SETTINGS);
  const [selectedModel, setSelectedModel] = useState<PerplexityModel>("sonar-reasoning-pro");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundVolume, setSoundVolume] = useState(30);

  useEffect(() => {
    const storedKey = getStoredApiKey();
    if (storedKey) {
      setApiKey(storedKey);
      setHasStoredKey(true);
      onApiKeyChange?.(true);
    }

    // Load dimension settings
    const storedDimensionSettings = getStoredDimensionSettings();
    setDimensionSettings(storedDimensionSettings);
    onDimensionSettingsChange?.(storedDimensionSettings);

    // Load model selection
    const storedModel = getStoredModel();
    setSelectedModel(storedModel);
    onModelChange?.(storedModel);

    // Load sound settings
    setSoundEnabled(soundManager.isEnabled());
    setSoundVolume(Math.round(soundManager.getVolume() * 100));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally exclude callbacks to prevent infinite loops on mount

  // Separate effect to notify parent when the callback function changes
  useEffect(() => {
    if (hasStoredKey) {
      onApiKeyChange?.(true);
    }
  }, [onApiKeyChange, hasStoredKey]);

  // Effect to notify parent when dimension settings change
  useEffect(() => {
    onDimensionSettingsChange?.(dimensionSettings);
  }, [dimensionSettings, onDimensionSettingsChange]);

  const handleSave = () => {
    if (apiKey.trim()) {
      storeApiKey(apiKey.trim());
      setHasStoredKey(true);
      onApiKeyChange?.(true);
      playSound.success();
      if (onOpenChange) {
        onOpenChange(false);
      } else {
        setIsOpen(false);
      }
    }
  };

  const handleRemove = () => {
    removeStoredApiKey();
    setApiKey("");
    setHasStoredKey(false);
    onApiKeyChange?.(false);
  };

  const handleCancel = () => {
    // Reset to stored key if canceling
    const storedKey = getStoredApiKey();
    setApiKey(storedKey || "");

    // Reset dimension settings
    const storedDimensionSettings = getStoredDimensionSettings();
    setDimensionSettings(storedDimensionSettings);

    // Reset model selection
    const storedModel = getStoredModel();
    setSelectedModel(storedModel);

    if (onOpenChange) {
      onOpenChange(false);
    } else {
      setIsOpen(false);
    }
  };

  const handleModelChange = (model: PerplexityModel) => {
    setSelectedModel(model);
    storeModel(model);
    onModelChange?.(model);
  };

  const handleSoundToggle = () => {
    const newEnabled = !soundEnabled;
    setSoundEnabled(newEnabled);
    soundManager.toggle();
    if (newEnabled) {
      playSound.click();
    }
  };

  const handleVolumeChange = (values: number[]) => {
    const volume = values[0];
    if (volume !== undefined) {
      setSoundVolume(volume);
      soundManager.setVolume(volume / 100);
    }
  };

  const handleTestSound = () => {
    soundManager.testSound();
  };

  const handleDimensionToggle = (dimension: keyof DimensionSettings, value: string) => {
    setDimensionSettings(prev => {
      const currentArray = prev[dimension] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];

      // Prevent having zero selections
      if (newArray.length === 0) {
        return prev;
      }

      const updated = { ...prev, [dimension]: newArray } as DimensionSettings;
      storeDimensionSettings(updated);
      // Don't call onDimensionSettingsChange during render - use useEffect instead
      return updated;
    });
  };

  const handleSelectAll = (dimension: keyof DimensionSettings) => {
    const allOptions = DEFAULT_DIMENSION_SETTINGS[dimension] as string[];
    const updated = { ...dimensionSettings, [dimension]: [...allOptions] } as DimensionSettings;
    setDimensionSettings(updated);
    storeDimensionSettings(updated);
    // Don't call onDimensionSettingsChange during render - use useEffect instead
  };

  return (
    <Dialog
      open={open !== undefined ? open : isOpen}
      onOpenChange={onOpenChange || setIsOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-300"
          onClick={() => playSound.settingsOpen()}
        >
          <Settings size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Settings</DialogTitle>
          <DialogDescription className="text-gray-400">
            Configure your Vercel AI Gateway API key and customize which options appear in the slot machine.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="api" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-700 border border-gray-600">
            <TabsTrigger value="api" className="text-gray-300 data-[state=active]:bg-gray-600 data-[state=active]:text-white">API Key</TabsTrigger>
            <TabsTrigger value="dimensions" className="text-gray-300 data-[state=active]:bg-gray-600 data-[state=active]:text-white">Slot Options</TabsTrigger>
            <TabsTrigger value="sounds" className="text-gray-300 data-[state=active]:bg-gray-600 data-[state=active]:text-white">Sounds</TabsTrigger>
          </TabsList>

          <TabsContent value="api" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="api-key" className="text-gray-300">
                Vercel AI Gateway API Key
              </Label>
              <div className="relative">
                <Input
                  id="api-key"
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="your-vercel-ai-gateway-key"
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-500 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-300"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Get your API key from{" "}
              <a
                href="https://vercel.com/ai-gateway"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Vercel AI Gateway
              </a>
            </div>

            {/* Model Selection */}
            <div className="space-y-3 pt-4 border-t border-gray-700">
              <Label className="text-gray-300 text-sm font-medium">AI Model</Label>
              <RadioGroup
                value={selectedModel}
                onValueChange={(value) => handleModelChange(value as PerplexityModel)}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="sonar-reasoning"
                    id="sonar-reasoning"
                    className="border-gray-500 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                  />
                  <Label htmlFor="sonar-reasoning" className="text-sm text-gray-300 cursor-pointer">
                    Sonar Reasoning - Faster, cost-effective
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="sonar-reasoning-pro"
                    id="sonar-reasoning-pro"
                    className="border-gray-500 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                  />
                  <Label htmlFor="sonar-reasoning-pro" className="text-sm text-gray-300 cursor-pointer">
                    Sonar Reasoning Pro - Advanced reasoning, better quality (Default)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleSave}
                disabled={!apiKey.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Save
              </Button>
              {hasStoredKey && (
                <Button
                  onClick={handleRemove}
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700"
                >
                  Remove
                </Button>
              )}
              <Button
                onClick={handleCancel}
                variant="outline"
                className="bg-gray-700 border-gray-500 text-white hover:bg-gray-600 hover:border-gray-400"
              >
                Cancel
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="dimensions" className="space-y-4 mt-4">
            <div className="text-sm text-gray-400 mb-4">
              Toggle which options can appear in the slot machine. At least one option must be selected for each dimension.
            </div>

            <ScrollArea className="h-96">
              <div className="space-y-6 pr-4">
                {/* Markets */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Briefcase size={16} className="text-blue-400" />
                      <Label className="text-gray-300 font-medium">Markets ({dimensionSettings.markets.length})</Label>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleSelectAll('markets')}
                        size="sm"
                        variant="outline"
                        className="text-xs bg-gray-700 border-gray-500 text-white hover:bg-gray-600 hover:border-gray-400"
                      >
                        Select All
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {DEFAULT_DIMENSION_SETTINGS.markets.map((market) => (
                      <div key={market} className="flex items-center space-x-2">
                        <Checkbox
                          id={`market-${market}`}
                          checked={dimensionSettings.markets.includes(market)}
                          onCheckedChange={() => handleDimensionToggle('markets', market)}
                          className="border-gray-500 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 data-[state=checked]:text-white"
                        />
                        <Label
                          htmlFor={`market-${market}`}
                          className="text-sm text-gray-300 cursor-pointer"
                        >
                          {market}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* User Types */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-emerald-400" />
                      <Label className="text-gray-300 font-medium">User Types ({dimensionSettings.userTypes.length})</Label>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleSelectAll('userTypes')}
                        size="sm"
                        variant="outline"
                        className="text-xs bg-gray-700 border-gray-500 text-white hover:bg-gray-600 hover:border-gray-400"
                      >
                        Select All
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {DEFAULT_DIMENSION_SETTINGS.userTypes.map((userType) => (
                      <div key={userType} className="flex items-center space-x-2">
                        <Checkbox
                          id={`userType-${userType}`}
                          checked={dimensionSettings.userTypes.includes(userType)}
                          onCheckedChange={() => handleDimensionToggle('userTypes', userType)}
                          className="border-gray-500 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 data-[state=checked]:text-white"
                        />
                        <Label
                          htmlFor={`userType-${userType}`}
                          className="text-sm text-gray-300 cursor-pointer"
                        >
                          {userType}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Problem Types */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target size={16} className="text-amber-400" />
                      <Label className="text-gray-300 font-medium">Problem Types ({dimensionSettings.problemTypes.length})</Label>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleSelectAll('problemTypes')}
                        size="sm"
                        variant="outline"
                        className="text-xs bg-gray-700 border-gray-500 text-white hover:bg-gray-600 hover:border-gray-400"
                      >
                        Select All
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {DEFAULT_DIMENSION_SETTINGS.problemTypes.map((problemType) => (
                      <div key={problemType} className="flex items-center space-x-2">
                        <Checkbox
                          id={`problemType-${problemType}`}
                          checked={dimensionSettings.problemTypes.includes(problemType)}
                          onCheckedChange={() => handleDimensionToggle('problemTypes', problemType)}
                          className="border-gray-500 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500 data-[state=checked]:text-white"
                        />
                        <Label
                          htmlFor={`problemType-${problemType}`}
                          className="text-sm text-gray-300 cursor-pointer"
                        >
                          {problemType}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stacks */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap size={16} className="text-purple-400" />
                      <Label className="text-gray-300 font-medium">Tech Stacks ({dimensionSettings.techStacks.length})</Label>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleSelectAll('techStacks')}
                        size="sm"
                        variant="outline"
                        className="text-xs bg-gray-700 border-gray-500 text-white hover:bg-gray-600 hover:border-gray-400"
                      >
                        Select All
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {DEFAULT_DIMENSION_SETTINGS.techStacks.map((techStack) => (
                      <div key={techStack} className="flex items-center space-x-2">
                        <Checkbox
                          id={`techStack-${techStack}`}
                          checked={dimensionSettings.techStacks.includes(techStack)}
                          onCheckedChange={() => handleDimensionToggle('techStacks', techStack)}
                          className="border-gray-500 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500 data-[state=checked]:text-white"
                        />
                        <Label
                          htmlFor={`techStack-${techStack}`}
                          className="text-sm text-gray-300 cursor-pointer"
                        >
                          {techStack}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="sounds" className="space-y-6 mt-4">
            <div className="text-sm text-gray-400 mb-4">
              Configure audio feedback for interactions. Sound effects provide subtle feedback to enhance the user experience.
            </div>

            {/* Sound Enable/Disable */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {soundEnabled ? (
                  <Volume2 size={20} className="text-blue-400" />
                ) : (
                  <VolumeX size={20} className="text-gray-500" />
                )}
                <div>
                  <Label className="text-gray-300 font-medium">Sound Effects</Label>
                  <p className="text-sm text-gray-500">Enable audio feedback for interactions</p>
                </div>
              </div>
              <Button
                onClick={handleSoundToggle}
                variant={soundEnabled ? "default" : "outline"}
                size="sm"
                className={soundEnabled
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-700 border-gray-500 text-gray-300 hover:bg-gray-600"
                }
              >
                {soundEnabled ? "Enabled" : "Disabled"}
              </Button>
            </div>

            {/* Volume Control */}
            {soundEnabled && (
              <div className="space-y-3">
                <Label className="text-gray-300 font-medium">Volume</Label>
                <div className="flex items-center gap-4">
                  <VolumeX size={16} className="text-gray-500" />
                  <div className="flex-1">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={5}
                      value={soundVolume}
                      onChange={(e) => handleVolumeChange([parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${soundVolume}%, #374151 ${soundVolume}%, #374151 100%)`
                      }}
                    />
                  </div>
                  <Volume2 size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-400 w-10 text-right">{soundVolume}%</span>
                </div>

                {/* Test Sound Button */}
                <div className="flex justify-center pt-2">
                  <Button
                    onClick={handleTestSound}
                    variant="outline"
                    size="sm"
                    className="bg-gray-700 border-gray-500 text-gray-300 hover:bg-gray-600"
                  >
                    Test Sound
                  </Button>
                </div>
              </div>
            )}

            {/* Sound Effects Preview */}
            <div className="space-y-3 pt-4 border-t border-gray-700">
              <Label className="text-gray-300 font-medium">Sound Effects Include:</Label>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
                <div>🎰 Slot machine spinning</div>
                <div>🔔 Reel stopping clicks</div>
                <div>✨ Generate ideas chime</div>
                <div>🎵 Success notifications</div>
                <div>👆 Button hover sounds</div>
                <div>⚙️ Settings open/close</div>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Sounds respect your system&apos;s reduced motion preferences and can be disabled at any time.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
