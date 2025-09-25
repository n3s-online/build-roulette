'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Lightbulb,
  Zap,
  Code,
  TrendingUp,
  Copy,
  ChevronDown,
  ChevronUp,
  Target,
  Check
} from 'lucide-react'
import toast from 'react-hot-toast'
import { GeneratedIdea, Combination } from '@/lib/types'

interface IdeasDisplayProps {
  ideas: GeneratedIdea[]
  combination: Combination
}

export default function IdeasDisplay({
  ideas,
  combination
}: IdeasDisplayProps) {
  const [expandedIdea, setExpandedIdea] = useState<number | null>(0) // First idea expanded by default
  const [copiedIdeaIndex, setCopiedIdeaIndex] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to component when it mounts
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }, [])

  const toggleExpanded = (index: number) => {
    setExpandedIdea(expandedIdea === index ? null : index)
  }

  const copyIdea = (idea: GeneratedIdea, index: number) => {
    const text = `${idea.name}

${idea.description}

Core Features:
${idea.coreFeatures.map(feature => `• ${feature}`).join('\n')}

Tech Stack:
${idea.suggestedTechStack.map(tech => `• ${tech}`).join('\n')}

Marketing Ideas:
${idea.leadGenerationIdeas.map(strategy => `• ${strategy}`).join('\n')}

Dimensions:
• Market: ${combination.market}
• User Type: ${combination.userType}
• Problem Type: ${combination.problemType}
• Tech Stack: ${combination.techStack}
• Project Scope: ${combination.projectScope}

Try BuildRoulette: ${window.location.origin}`

    navigator.clipboard.writeText(text).then(() => {
      setCopiedIdeaIndex(index)
      toast.success('Idea copied to clipboard!', {
        icon: <Check size={16} className="text-emerald-500" />,
        duration: 2000,
      })

      // Reset the button after 2 seconds
      setTimeout(() => {
        setCopiedIdeaIndex(null)
      }, 2000)
    }).catch(err => {
      console.error('Failed to copy:', err)
      toast.error('Failed to copy idea')
    })
  }

  return (
    <div ref={containerRef} className="max-w-4xl w-full mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Target className="text-blue-400" size={28} />
          <h2 className="text-2xl font-bold text-white">
            Your AI-Generated Ideas
          </h2>
        </div>
        <p className="text-gray-400">
          Based on: <span className="text-blue-400">{combination.market}</span> +
          <span className="text-emerald-400"> {combination.userType}</span> +
          <span className="text-amber-400"> {combination.problemType}</span> +
          <span className="text-purple-400"> {combination.techStack}</span> +
          <span className="text-rose-400"> {combination.projectScope}</span>
        </p>
      </div>

      {/* Ideas Grid */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
        {ideas.map((idea, index) => (
          <div
            key={index}
            className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-all duration-200"
          >
            {/* Idea Header */}
            <div 
              className="p-6 cursor-pointer"
              onClick={() => toggleExpanded(index)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <Lightbulb size={16} className="text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      {idea.name}
                    </h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    {idea.description}
                  </p>
                </div>
                <button className="ml-4 p-2 text-gray-400 hover:text-white transition-colors">
                  {expandedIdea === index ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Expanded Content */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
              expandedIdea === index ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="px-6 pb-6 border-t border-gray-800">
                <div className="grid md:grid-cols-3 gap-6 mt-6">
                  {/* Core Features */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Zap size={16} className="text-amber-400" />
                      <h4 className="font-semibold text-white">Core Features</h4>
                    </div>
                    <ul className="space-y-2">
                      {idea.coreFeatures.map((feature, idx) => (
                        <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 flex-shrink-0"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tech Stack */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Code size={16} className="text-blue-400" />
                      <h4 className="font-semibold text-white">Tech Stack</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {idea.suggestedTechStack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-md border border-blue-500/30"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Lead Generation */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp size={16} className="text-emerald-400" />
                      <h4 className="font-semibold text-white">Marketing Ideas</h4>
                    </div>
                    <ul className="space-y-2">
                      {idea.leadGenerationIdeas.map((strategy, idx) => (
                        <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></span>
                          {strategy}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Copy Button for Individual Idea */}
                <div className="mt-6 pt-4 border-t border-gray-800">
                  <button
                    onClick={() => copyIdea(idea, index)}
                    className={`flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg transition-all duration-200 ${
                      copiedIdeaIndex === index
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 hover:bg-emerald-600'
                    }`}
                  >
                    {copiedIdeaIndex === index ? (
                      <Check size={14} className="text-white" />
                    ) : (
                      <Copy size={14} />
                    )}
                    {copiedIdeaIndex === index ? 'Copied!' : 'Copy Full Idea'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
