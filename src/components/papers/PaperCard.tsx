import React from 'react';
import { Link } from 'react-router-dom';
import { Star, CheckSquare, Square, FileText, ArrowUpRight, Database } from 'lucide-react';
import { Paper, PaperSource } from '../../types';
import { PaperStatus } from './PaperStatus';
import { useResearch } from '../../context/ResearchContext';

interface PaperCardProps {
  paper: Paper;
  onToggleFavorite?: (id: string) => void;
}

export const formatSourceLabel = (source?: PaperSource): string => {
  switch (source) {
    case 'arxiv':
      return 'arXiv';
    case 'pdf':
      return 'Uploaded PDF';
    case 'pubmed':
      return 'PubMed';
    case 'semantic_scholar':
      return 'Semantic Scholar';
    case 'doi':
      return 'DOI / Journal';
    default:
      return 'Scientific Corpus';
  }
};

export const PaperCard: React.FC<PaperCardProps> = ({ paper, onToggleFavorite }) => {
  const { selectedScopePaperIds, togglePaperInScope } = useResearch();
  const isSelected = selectedScopePaperIds.includes(paper.id);

  const authorDisplay =
    paper.authors.length > 2
      ? `${paper.authors[0].name} et al.`
      : paper.authors.map((a) => a.name).join(', ');

  return (
    <div className="group relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 hover:border-neutral-400 dark:hover:border-neutral-700 transition-all">
      {/* Top row: Status, Source & Scope action */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <PaperStatus status={paper.status} progress={paper.progress} />
          <span className="text-neutral-300 dark:text-neutral-700">·</span>
          <span className="text-[11px] font-mono text-neutral-500">
            Source: <strong className="font-semibold text-neutral-700 dark:text-neutral-300">{formatSourceLabel(paper.source)}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Scope selection toggle */}
          <button
            type="button"
            onClick={() => togglePaperInScope(paper.id)}
            className={`flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
              isSelected
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-medium'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
            title={isSelected ? 'Remove from research scope' : 'Add to research scope'}
          >
            {isSelected ? (
              <CheckSquare className="w-3.5 h-3.5" />
            ) : (
              <Square className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">Scope</span>
          </button>

          {/* Favorite */}
          <button
            type="button"
            onClick={() => onToggleFavorite && onToggleFavorite(paper.id)}
            className={`p-1 rounded-md transition-colors cursor-pointer ${
              paper.isFavorite
                ? 'text-amber-500 hover:text-amber-600'
                : 'text-neutral-300 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-400'
            }`}
            aria-label="Favorite paper"
          >
            <Star className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>

      {/* Title */}
      <Link to={`/library/${paper.id}`} className="block group-hover:text-neutral-600 dark:group-hover:text-neutral-300">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 leading-snug line-clamp-2 mb-2">
          {paper.title}
        </h3>
      </Link>

      {/* Abstract preview */}
      <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-4 leading-relaxed font-normal">
        {paper.abstract}
      </p>

      {/* Unboxed metadata with typographic separators */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 pt-3 border-t border-neutral-100 dark:border-neutral-800/80">
        <span className="font-medium text-neutral-700 dark:text-neutral-300 truncate max-w-[140px]">
          {authorDisplay}
        </span>
        <span aria-hidden="true">·</span>
        <span>{paper.year}</span>
        <span aria-hidden="true">·</span>
        <span className="truncate max-w-[120px]">{paper.venue}</span>
        <span aria-hidden="true">·</span>
        <span className="font-mono text-[11px]">{paper.pageCount} pp</span>
        {paper.chunkCount && (
          <>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[11px] text-neutral-400">{paper.chunkCount} chunks</span>
          </>
        )}
      </div>

      {/* Tags row */}
      {paper.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mt-2.5 text-[11px] text-neutral-400 font-mono">
          {paper.tags.slice(0, 3).map((tag, idx) => (
            <React.Fragment key={tag}>
              {idx > 0 && <span aria-hidden="true">/</span>}
              <span>{tag}</span>
            </React.Fragment>
          ))}
          {paper.tags.length > 3 && (
            <span className="text-neutral-500">+{paper.tags.length - 3}</span>
          )}
        </div>
      )}

      {/* Footer link */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-400">
        <span>Opened {paper.lastOpened}</span>
        <Link
          to={`/library/${paper.id}`}
          className="inline-flex items-center gap-1 font-semibold text-neutral-900 dark:text-neutral-100 hover:underline"
        >
          <span>Inspect Paper</span>
          <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};
