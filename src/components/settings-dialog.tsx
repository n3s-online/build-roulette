"use client";

import { useState, useEffect } from "react";
import { Settings, Eye, EyeOff } from "lucide-react";
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
import { getStoredApiKey, storeApiKey, removeStoredApiKey } from "@/lib/utils";

interface SettingsDialogProps {
  onApiKeyChange?: (hasKey: boolean) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function SettingsDialog({
  onApiKeyChange,
  open,
  onOpenChange,
}: SettingsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [hasStoredKey, setHasStoredKey] = useState(false);

  useEffect(() => {
    const storedKey = getStoredApiKey();
    if (storedKey) {
      setApiKey(storedKey);
      setHasStoredKey(true);
      onApiKeyChange?.(true);
    }
  }, [onApiKeyChange]);

  const handleSave = () => {
    if (apiKey.trim()) {
      storeApiKey(apiKey.trim());
      setHasStoredKey(true);
      onApiKeyChange?.(true);
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
    if (onOpenChange) {
      onOpenChange(false);
    } else {
      setIsOpen(false);
    }
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
        >
          <Settings size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">API Settings</DialogTitle>
          <DialogDescription className="text-gray-400">
            Enter your Anthropic API key to generate AI-powered product ideas.
            Your key is stored locally in your browser.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key" className="text-gray-300">
              Anthropic API Key
            </Label>
            <div className="relative">
              <Input
                id="api-key"
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-..."
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
              href="https://console.anthropic.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              console.anthropic.com
            </a>
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
              className="bg-gray-800 border-gray-600 hover:bg-gray-700 text-gray-300"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
