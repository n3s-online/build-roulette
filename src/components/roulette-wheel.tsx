'use client';

import { useState, useCallback } from 'react';

export type Market = 'SaaS' | 'E-commerce' | 'FinTech' | 'HealthTech' | 'EdTech' | 'Gaming' | 'Creator Economy' | 'Real Estate' | 'Travel' | 'Food & Beverage' | 'Fitness' | 'Productivity';

export type UserType = 'Small Businesses' | 'Freelancers' | 'Students' | 'Remote Workers' | 'Content Creators' | 'Parents' | 'Seniors' | 'Developers' | 'Designers' | 'Consultants';

export type ProblemType = 'Automation' | 'Organization' | 'Communication' | 'Analytics' | 'Monetization' | 'Learning' | 'Health Tracking' | 'Time Management' | 'Collaboration' | 'Security';

export type TechStack = 'Web App' | 'Mobile App' | 'Chrome Extension' | 'API/Tool' | 'Desktop App' | 'Slack Bot' | 'WordPress Plugin' | 'Shopify App';

export type Combination = {
  market: Market;
  userType: UserType;
  problemType: ProblemType;
  techStack: TechStack;
};

const MARKETS: Market[] = ['SaaS', 'E-commerce', 'FinTech', 'HealthTech', 'EdTech', 'Gaming', 'Creator Economy', 'Real Estate', 'Travel', 'Food & Beverage', 'Fitness', 'Productivity'];

const USER_TYPES: UserType[] = ['Small Businesses', 'Freelancers', 'Students', 'Remote Workers', 'Content Creators', 'Parents', 'Seniors', 'Developers', 'Designers', 'Consultants'];

const PROBLEM_TYPES: ProblemType[] = ['Automation', 'Organization', 'Communication', 'Analytics', 'Monetization', 'Learning', 'Health Tracking', 'Time Management', 'Collaboration', 'Security'];

const TECH_STACKS: TechStack[] = ['Web App', 'Mobile App', 'Chrome Extension', 'API/Tool', 'Desktop App', 'Slack Bot', 'WordPress Plugin', 'Shopify App'];

interface RouletteWheelProps {
  onResult?: (combination: Combination) => void;
}

export default function RouletteWheel({ onResult }: RouletteWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<Combination | null>(null);
  const [columnPositions, setColumnPositions] = useState<number[]>([0, 0, 0, 0]);
  const [columnDurations, setColumnDurations] = useState<number[]>([0, 0, 0, 0]);

  const generateRandomResult = useCallback((): Combination => {
    return {
      market: MARKETS[Math.floor(Math.random() * MARKETS.length)]!,
      userType: USER_TYPES[Math.floor(Math.random() * USER_TYPES.length)]!,
      problemType: PROBLEM_TYPES[Math.floor(Math.random() * PROBLEM_TYPES.length)]!,
      techStack: TECH_STACKS[Math.floor(Math.random() * TECH_STACKS.length)]!,
    };
  }, []);

  const spin = useCallback(() => {
    if (isSpinning) return;

    setIsSpinning(true);
    setResult(null);

    // Generate result first
    const newResult = generateRandomResult();
    console.log('🎯 Target results:', newResult);

    const columns = [MARKETS, USER_TYPES, PROBLEM_TYPES, TECH_STACKS];
    const targetValues = [newResult.market, newResult.userType, newResult.problemType, newResult.techStack];
    const extraRotations = [5, 10, 15, 20]; // Each column gets different amounts of spinning

    // Calculate target positions with staggered extra rotations
    const targetPositions = columns.map((columnData, index) => {
      const targetIndex = (columnData as readonly string[]).indexOf(targetValues[index]!);
      const itemHeight = 80;
      const columnLength = columnData.length;
      const positionToCenter = (targetIndex * itemHeight) - 120;
      const extraSpins = extraRotations[index]! * columnLength * itemHeight;
      return positionToCenter + extraSpins;
    });

    // Calculate animation durations based on rotation count (200ms per rotation)
    const baseDuration = 200;
    const durations = extraRotations.map(rotations => rotations * baseDuration);

    setColumnPositions(targetPositions);
    setColumnDurations(durations);

    // Show result after longest animation completes
    const longestDuration = Math.max(...durations);
    setTimeout(() => {
      setResult(newResult);
      setIsSpinning(false);
      onResult?.(newResult);
    }, longestDuration + 500);
  }, [isSpinning, generateRandomResult, onResult]);

  const renderColumn = (data: readonly string[], columnIndex: number, color: string, label: string) => {
    // Create extended array for continuous scrolling effect - need enough for 20+ rotations
    const extendedData = Array(25).fill(data).flat();

    return (
      <div key={label} className="flex flex-col items-center">
        <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">{label}</h3>
        <div className="relative w-40 h-80 border-4 border-white rounded-lg shadow-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
          {/* Selection indicator */}
          <div className="absolute top-[160px] left-0 right-0 transform -translate-y-1/2 h-20 border-t-2 border-b-2 border-yellow-400 bg-yellow-100/50 dark:bg-yellow-900/30 z-10 pointer-events-none"></div>

          {/* Scrolling items */}
          <div
            className={`relative ${isSpinning ? 'transition-transform ease-out' : ''}`}
            style={{
              transform: `translateY(-${columnPositions[columnIndex]}px)`,
              transitionDuration: isSpinning ? `${columnDurations[columnIndex]}ms` : '0ms',
            }}
          >
            {extendedData.map((item, index) => (
              <div
                key={`${item}-${index}`}
                className={`h-20 flex items-center justify-center text-white font-semibold px-2 text-center border-b border-gray-300 dark:border-gray-600`}
                style={{ backgroundColor: color }}
              >
                <span className="text-sm leading-tight">
                  {item.length > 12 ? item.substring(0, 12) + '...' : item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      {/* Slot Machine */}
      <div className="flex gap-6 items-start">
        {renderColumn(MARKETS, 0, '#8b5cf6', 'Market')}
        {renderColumn(USER_TYPES, 1, '#3b82f6', 'User Type')}
        {renderColumn(PROBLEM_TYPES, 2, '#10b981', 'Problem')}
        {renderColumn(TECH_STACKS, 3, '#f97316', 'Tech Stack')}
      </div>

      {/* Spin Button */}
      <button
        onClick={spin}
        disabled={isSpinning}
        className={`
          px-8 py-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500
          text-white font-bold text-lg shadow-lg transition-all duration-200
          hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed
          disabled:scale-100 disabled:shadow-lg border-4 border-white
        `}
      >
        {isSpinning ? 'SPINNING!' : 'SPIN'}
      </button>

      {/* Result Display */}
      {result && !isSpinning && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl max-w-md w-full">
          <h3 className="text-xl font-bold text-center mb-4 text-gray-800 dark:text-white">
            Your Combination!
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-purple-100 dark:bg-purple-900/30 rounded">
              <span className="font-semibold text-purple-800 dark:text-purple-200">Market:</span>
              <span className="text-purple-900 dark:text-purple-100">{result.market}</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-blue-100 dark:bg-blue-900/30 rounded">
              <span className="font-semibold text-blue-800 dark:text-blue-200">User Type:</span>
              <span className="text-blue-900 dark:text-blue-100">{result.userType}</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-green-100 dark:bg-green-900/30 rounded">
              <span className="font-semibold text-green-800 dark:text-green-200">Problem:</span>
              <span className="text-green-900 dark:text-green-100">{result.problemType}</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-orange-100 dark:bg-orange-900/30 rounded">
              <span className="font-semibold text-orange-800 dark:text-orange-200">Tech Stack:</span>
              <span className="text-orange-900 dark:text-orange-100">{result.techStack}</span>
            </div>
          </div>
        </div>
      )}

      {isSpinning && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl max-w-md w-full">
          <div className="text-center">
            <div className="animate-pulse text-gray-600 dark:text-gray-400">
              🎰 Rolling the slots...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}