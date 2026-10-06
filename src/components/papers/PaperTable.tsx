import React from 'react';
import { Link } from 'react-router-dom';
import { Star, CheckSquare, Square, ArrowUpRight } from 'lucide-react';
import { Paper } from '../../types';
import { PaperStatus } from './PaperStatus';
import { formatSourceLabel } from './PaperCard';
import { useResearch } from '../../context/ResearchContext';

interface PaperTableProps {
  papers: Paper[];
  onToggleFavorite?: (id: string) => void;
}

export const PaperTable: React.FC<PaperTableProps> = ({ papers, onToggleFavorite }) => {
  const { selectedScopePaperIds, togglePaperInScope } = useResearch();

  return (
    <div className="w-full overflow-x-auto border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40 text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
            <th className="py-3 px-4 w-10">Scope</th>
            <th className="py-3 px-4">Title & Authors</th>
            <th className="py-3 px-4 w-32">Source</th>
            <th className="py-3 px-4">Venue</th>
            <th className="py-3 px-4 w-20">Year</th>
            <th className="py-3 px-4 w-28">Status</th>
            <th className="py-3 px-4 w-24 text-right">Citations</th>
            <th className="py-3 px-4 w-16 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {papers.map((paper) => {
            const isSelected = selectedScopePaperIds.includes(paper.id);
            const authors = paper.authors.length > 2
              ? `${paper.authors[0].name} et al.`
              : paper.authors.map((a) => a.name).join(', ');

            return (
              <tr
                key={paper.id}
                className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors group"
              >
                <td className="py-3 px-4">
                  <button
                    type="button"
                    onClick={() => togglePaperInScope(paper.id)}
                    className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer"
                    title={isSelected ? 'Remove from scope' : 'Add to scope'}
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-neutral-900 dark:text-neutral-100" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </td>
                <td className="py-3 px-4 min-w-[280px]">
                  <Link
                    to={`/library/${paper.id}`}
                    className="font-medium text-neutral-900 dark:text-neutral-100 hover:underline block leading-snug"
                  >
                    {paper.title}
                  </Link>
                  <div className="text-neutral-500 text-[11px] mt-0.5">{authors}</div>
                </td>
                <td className="py-3 px-4 font-mono text-neutral-600 dark:text-neutral-400 text-[11px]">
                  {formatSourceLabel(paper.source)}
                </td>
                <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400 truncate max-w-[140px]">
                  {paper.venue}
                </td>
                <td className="py-3 px-4 font-mono text-neutral-600 dark:text-neutral-400">
                  {paper.year}
                </td>
                <td className="py-3 px-4">
                  <PaperStatus status={paper.status} progress={paper.progress} />
                </td>
                <td className="py-3 px-4 text-right font-mono tabular-nums text-neutral-700 dark:text-neutral-300">
                  {paper.citationCount.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onToggleFavorite && onToggleFavorite(paper.id)}
                      className={`p-1 rounded-sm cursor-pointer ${
                        paper.isFavorite
                          ? 'text-amber-500'
                          : 'text-neutral-300 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-400'
                      }`}
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </button>
                    <Link
                      to={`/library/${paper.id}`}
                      className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
