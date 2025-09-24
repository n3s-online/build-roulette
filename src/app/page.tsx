import RouletteWheel from '@/components/roulette-wheel';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100 dark:from-purple-900 dark:via-blue-900 dark:to-pink-900">
      <div className="container mx-auto px-4 py-8 sm:py-16">
        <div className="text-center max-w-6xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent mb-4">
            BuildRoulette
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Spin the wheel of fortune and discover your next big idea! Generate random product combinations and turn them into actionable concepts for indie hackers.
          </p>

          <div className="mb-8">
            <RouletteWheel />
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
              Each spin combines a <span className="text-purple-600 font-semibold">Market</span>,
              <span className="text-blue-600 font-semibold"> User Type</span>,
              <span className="text-green-600 font-semibold"> Problem</span>, and
              <span className="text-orange-600 font-semibold"> Tech Stack</span> to inspire your next project!
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
