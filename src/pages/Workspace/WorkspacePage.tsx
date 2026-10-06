import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sparkles, BookOpen, Layers, ArrowLeft, ArrowUpRight } from 'lucide-react';
import { MOCK_PAPERS } from '../../data/mockPapers';
import { PaperCard } from '../../components/papers/PaperCard';

export const WorkspacePage: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 capitalize">
            Workspace: {workspaceId?.replace(/-/g, ' ')}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Dedicated research session combining papers, annotations, and focused RAG inquiries.
          </p>
        </div>

        <Link
          to="/chat"
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Launch Workspace Copilot</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_PAPERS.slice(0, 4).map((paper) => (
          <PaperCard key={paper.id} paper={paper} />
        ))}
      </div>
    </div>
  );
};
