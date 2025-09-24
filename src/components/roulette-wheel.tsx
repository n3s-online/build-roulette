'use client';

import { useState, useRef, useCallback } from 'react';

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
  const wheelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [wheelRotations, setWheelRotations] = useState<number[]>([0, 0, 0, 0]);
  const [hasSpun, setHasSpun] = useState(false);

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
    setHasSpun(false);

    // Generate result first
    const newResult = generateRandomResult();

    const rings = [
      { data: MARKETS, startColor: '#8b5cf6', endColor: '#7c3aed', label: 'Market' },
      { data: USER_TYPES, startColor: '#3b82f6', endColor: '#2563eb', label: 'User Type' },
      { data: PROBLEM_TYPES, startColor: '#10b981', endColor: '#059669', label: 'Problem Type' },
      { data: TECH_STACKS, startColor: '#f97316', endColor: '#ea580c', label: 'Tech Stack' },
    ];

    // Calculate target positions for each wheel to land on the selected values
    const targetRotations = rings.map((ring, index) => {
      const direction = index % 2 === 0 ? 1 : -1; // Alternating directions
      const segmentAngle = 360 / ring.data.length;
      let targetValue;

      switch(index) {
        case 0: targetValue = newResult.market; break;
        case 1: targetValue = newResult.userType; break;
        case 2: targetValue = newResult.problemType; break;
        case 3: targetValue = newResult.techStack; break;
        default: targetValue = ring.data[0];
      }

      const targetIndex = ring.data.indexOf(targetValue);
      const targetAngle = targetIndex * segmentAngle;

      // Add current rotation to maintain position, then add multiple rotations plus target
      const currentRotation = wheelRotations[index] || 0;
      const fullRotations = (3 + Math.random() * 2) * 360;
      return currentRotation + direction * (fullRotations + (360 - targetAngle));
    });

    setWheelRotations(targetRotations);
    setHasSpun(true);

    // Simulate spinning duration with easing
    const spinDuration = 3000 + Math.random() * 2000; // 3-5 seconds

    setTimeout(() => {
      setResult(newResult);
      setIsSpinning(false);
      onResult?.(newResult);
    }, spinDuration);
  }, [isSpinning, generateRandomResult, onResult, wheelRotations]);

  const renderWheel = () => {
    const wheelSize = 400;

    // Ring sizes from outer to inner
    const rings = [
      { data: MARKETS, startColor: '#8b5cf6', endColor: '#7c3aed', label: 'Market' },
      { data: USER_TYPES, startColor: '#3b82f6', endColor: '#2563eb', label: 'User Type' },
      { data: PROBLEM_TYPES, startColor: '#10b981', endColor: '#059669', label: 'Problem Type' },
      { data: TECH_STACKS, startColor: '#f97316', endColor: '#ea580c', label: 'Tech Stack' },
    ];

    return (
      <div className="relative flex items-center justify-center">
        <div className="relative w-[400px] h-[400px] rounded-full">
          {rings.map((ring, ringIndex) => {
            const outerRadius = wheelSize / 2 - (ringIndex * 45);
            const innerRadius = wheelSize / 2 - ((ringIndex + 1) * 45) + (ringIndex === 3 ? 15 : 0);
            const segmentAngle = 360 / ring.data.length;

            return (
              <div
                key={ring.label}
                className={`absolute inset-0 ${hasSpun ? 'transition-transform duration-[4000ms] ease-out' : ''}`}
                ref={el => wheelRefs.current[ringIndex] = el}
                style={{
                  transform: `rotate(${wheelRotations[ringIndex]}deg)`,
                }}
              >
                {ring.data.map((item, index) => {
                  const angle = index * segmentAngle;
                  const x1 = Math.cos((angle - 90) * Math.PI / 180);
                  const y1 = Math.sin((angle - 90) * Math.PI / 180);
                  const x2 = Math.cos((angle + segmentAngle - 90) * Math.PI / 180);
                  const y2 = Math.sin((angle + segmentAngle - 90) * Math.PI / 180);

                  const largeArcFlag = segmentAngle > 180 ? 1 : 0;

                  const outerX1 = wheelSize / 2 + x1 * outerRadius;
                  const outerY1 = wheelSize / 2 + y1 * outerRadius;
                  const outerX2 = wheelSize / 2 + x2 * outerRadius;
                  const outerY2 = wheelSize / 2 + y2 * outerRadius;

                  const innerX1 = wheelSize / 2 + x1 * innerRadius;
                  const innerY1 = wheelSize / 2 + y1 * innerRadius;
                  const innerX2 = wheelSize / 2 + x2 * innerRadius;
                  const innerY2 = wheelSize / 2 + y2 * innerRadius;

                  const pathData = [
                    `M ${outerX1} ${outerY1}`,
                    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerX2} ${outerY2}`,
                    `L ${innerX2} ${innerY2}`,
                    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerX1} ${innerY1}`,
                    'Z'
                  ].join(' ');

                  // Text position - middle of the segment
                  const textAngle = angle + segmentAngle / 2;
                  const textRadius = (outerRadius + innerRadius) / 2;
                  const textX = wheelSize / 2 + Math.cos((textAngle - 90) * Math.PI / 180) * textRadius;
                  const textY = wheelSize / 2 + Math.sin((textAngle - 90) * Math.PI / 180) * textRadius;

                  return (
                    <svg
                      key={item}
                      className="absolute inset-0 w-full h-full"
                      viewBox={`0 0 ${wheelSize} ${wheelSize}`}
                    >
                      <defs>
                        <linearGradient id={`gradient-${ringIndex}-${index}`} gradientUnits="objectBoundingBox">
                          <stop offset="0%" stopColor={ring.startColor} />
                          <stop offset="100%" stopColor={ring.endColor} />
                        </linearGradient>
                      </defs>
                      <path
                        d={pathData}
                        fill={`url(#gradient-${ringIndex}-${index})`}
                        stroke="#ffffff"
                        strokeWidth="2"
                        opacity={0.9}
                      />
                      <text
                        x={textX}
                        y={textY}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className={`fill-white font-semibold ${ringIndex === 0 ? 'text-xs' : ringIndex === 1 ? 'text-xs' : ringIndex === 2 ? 'text-[10px]' : 'text-[8px]'}`}
                        transform={`rotate(${textAngle > 90 && textAngle < 270 ? textAngle + 180 : textAngle}, ${textX}, ${textY})`}
                      >
                        {ringIndex === 3
                          ? item.length > 6 ? item.substring(0, 6) + '...' : item
                          : ringIndex === 2
                          ? item.length > 8 ? item.substring(0, 8) + '...' : item
                          : item.length > 10 ? item.substring(0, 10) + '...' : item}
                      </text>
                    </svg>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Center circle with spin button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={spin}
            disabled={isSpinning}
            className={`
              w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500
              text-white font-bold text-sm shadow-lg transition-all duration-200
              hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed
              disabled:scale-100 disabled:shadow-lg border-4 border-white
            `}
          >
            {isSpinning ? (
              <div className="text-xs">SPINNING!</div>
            ) : (
              <div className="text-xs">SPIN</div>
            )}
          </button>
        </div>

        {/* Pointer */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-b-[30px] border-l-transparent border-r-transparent border-b-red-500"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      {renderWheel()}

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
              🎯 Spinning the wheel of destiny...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}