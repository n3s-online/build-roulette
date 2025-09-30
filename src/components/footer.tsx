import { Github, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-400 text-sm">
          {/* Built with love */}
          <div className="flex items-center gap-2">
            <span>built with</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span>by</span>
            <a
              href="https://willness.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors underline decoration-dotted underline-offset-2"
            >
              willness.dev
            </a>
          </div>

          {/* Separator */}
          <span className="hidden sm:inline text-gray-600">•</span>

          {/* GitHub link */}
          <a
            href="https://github.com/n3s-online/build-roulette"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors"
            aria-label="View source on GitHub"
          >
            <Github className="w-4 h-4" />
            <span>View on GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

