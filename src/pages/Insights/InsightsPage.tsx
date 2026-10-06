import React, { useState } from 'react';
import { TrendingUp, AlertCircle, Compass, Sparkles, BarChart2, Layers } from 'lucide-react';
import { MOCK_INSIGHTS, MOCK_CITATION_TRENDS } from '../../data/mockInsights';
import { ResearchInsight } from '../../types';

export const InsightsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredInsights = activeCategory === 'all'
    ? MOCK_INSIGHTS
    : MOCK_INSIGHTS.filter((i) => i.category === activeCategory);

  // SVG Chart sizing math
  const maxCitation = Math.max(...MOCK_CITATION_TRENDS.map((t) => t.citations));
  const chartHeight = 180;
  const chartWidth = 500;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>META-LITERATURE DISCOVERY</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Research Insights & Scientific Gaps
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Automated trend synthesis identifying unaddressed research questions, methodological shifts, and citations.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeCategory === 'all'
                ? 'bg-neutral-100 dark:bg-neutral-800 font-semibold text-neutral-900 dark:text-neutral-100'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            All Insights
          </button>
          <button
            onClick={() => setActiveCategory('emerging_topic')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeCategory === 'emerging_topic'
                ? 'bg-neutral-100 dark:bg-neutral-800 font-semibold text-neutral-900 dark:text-neutral-100'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            Emerging Topics
          </button>
          <button
            onClick={() => setActiveCategory('research_gap')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeCategory === 'research_gap'
                ? 'bg-neutral-100 dark:bg-neutral-800 font-semibold text-neutral-900 dark:text-neutral-100'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            Research Gaps
          </button>
          <button
            onClick={() => setActiveCategory('method_trend')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeCategory === 'method_trend'
                ? 'bg-neutral-100 dark:bg-neutral-800 font-semibold text-neutral-900 dark:text-neutral-100'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            Method Trends
          </button>
        </div>
      </div>

      {/* Citation Growth & Literature Velocity Chart */}
      <div className="p-6 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider font-mono">
              Literature Velocity & Citation Trajectory (2020–2025)
            </h2>
            <p className="text-xs text-neutral-500">
              Annual volume of RAG publications and empirical benchmark citations in indexed corpora.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-neutral-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-neutral-900 dark:bg-neutral-100" />
              <span>Citations</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-indigo-500" />
              <span>RAG Papers</span>
            </span>
          </div>
        </div>

        {/* SVG Curve Chart */}
        <div className="w-full overflow-x-auto py-2">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full max-h-56">
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
              const y = chartHeight - ratio * (chartHeight - 30) - 20;
              return (
                <line
                  key={idx}
                  x1="40"
                  y1={y}
                  x2={chartWidth - 20}
                  y2={y}
                  stroke="currentColor"
                  className="text-neutral-100 dark:text-neutral-800"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Citations Line */}
            <polyline
              fill="none"
              stroke="currentColor"
              className="text-neutral-900 dark:text-neutral-100"
              strokeWidth="2.5"
              points={MOCK_CITATION_TRENDS.map((t, idx) => {
                const x = 50 + (idx / (MOCK_CITATION_TRENDS.length - 1)) * (chartWidth - 80);
                const y = chartHeight - (t.citations / maxCitation) * (chartHeight - 40) - 20;
                return `${x},${y}`;
              }).join(' ')}
            />

            {/* Data points */}
            {MOCK_CITATION_TRENDS.map((t, idx) => {
              const x = 50 + (idx / (MOCK_CITATION_TRENDS.length - 1)) * (chartWidth - 80);
              const y = chartHeight - (t.citations / maxCitation) * (chartHeight - 40) - 20;
              return (
                <g key={t.year}>
                  <circle
                    cx={x}
                    cy={y}
                    r="4"
                    className="fill-white dark:fill-neutral-900 stroke-neutral-900 dark:stroke-neutral-100 stroke-2"
                  />
                  <text
                    x={x}
                    y={chartHeight - 4}
                    textAnchor="middle"
                    className="text-[10px] font-mono fill-neutral-400"
                  >
                    {t.year}
                  </text>
                  <text
                    x={x}
                    y={y - 8}
                    textAnchor="middle"
                    className="text-[9px] font-mono fill-neutral-500 font-semibold"
                  >
                    {t.citations.toLocaleString()}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Insights Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredInsights.map((insight) => {
          const isGap = insight.category === 'research_gap';
          const isTopic = insight.category === 'emerging_topic';

          return (
            <div
              key={insight.id}
              className="p-5 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 space-y-3"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
                  {isGap ? 'Research Gap' : isTopic ? 'Emerging Paradigm' : 'Method Trend'}
                </span>
                <span className="font-mono text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
                  {insight.impactScore}
                </span>
              </div>

              <h3 className="text-sm font-bold text-neutral-950 dark:text-neutral-50 leading-snug">
                {insight.title}
              </h3>

              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
                {insight.description}
              </p>

              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 text-[11px]">
                <div className="text-[10px] font-mono text-neutral-400 uppercase mb-1">
                  Corroborating Literature
                </div>
                <div className="space-y-1">
                  {insight.associatedPapers.map((paper) => (
                    <div key={paper.id} className="text-neutral-700 dark:text-neutral-300 truncate">
                      <span className="font-medium">{paper.title}</span> ({paper.year})
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
