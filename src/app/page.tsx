export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100 dark:from-purple-900 dark:via-blue-900 dark:to-pink-900">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-7xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent mb-6">
            BuildRoulette
          </h1>
          <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Spin the wheel of fortune and discover your next big idea! Generate random product combinations and turn them into actionable concepts for indie hackers.
          </p>
          <div className="inline-flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 px-4 py-2 rounded-full text-yellow-800 dark:text-yellow-200 font-medium">
            <span className="text-2xl">🎯</span>
            <span>Coming Soon - The Ultimate Ideation Tool</span>
          </div>
        </div>
      </div>
    </main>
  );
}
