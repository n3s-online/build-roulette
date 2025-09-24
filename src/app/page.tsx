import RouletteWheel from '@/components/roulette-wheel';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-transparent to-blue-900/20"></div>

      <div className="container mx-auto px-4 py-16 relative">
        <div className="max-w-4xl mx-auto">
          {/* Clean Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              BuildRoulette
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Generate random product combinations to spark your next indie project.
              Spin to discover new market opportunities.
            </p>
          </div>

          {/* Slot Machine */}
          <div>
            <RouletteWheel />
          </div>
        </div>
      </div>
    </main>
  );
}
