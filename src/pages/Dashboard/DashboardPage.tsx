import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Upload,
  Sparkles,
  GitCompare,
  FolderPlus,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Layers,
  Clock,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useResearch } from '../../context/ResearchContext';
import { getPapers } from '../../services/paperService';
import { MOCK_COLLECTIONS } from '../../data/mockCollections';
import { Paper } from '../../types';
import { PaperCard } from '../../components/papers/PaperCard';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { setUploadModalOpen } = useResearch();
  const navigate = useNavigate();
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPapers = () => {
      getPapers().then((data) => {
        setPapers(data);
        setLoading(false);
      });
    };
    fetchPapers();
    window.addEventListener('scirag:paper-uploaded', fetchPapers);
    return () => window.removeEventListener('scirag:paper-uploaded', fetchPapers);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const recentPapers = papers.slice(0, 4);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner / Greeting */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-1">
            <span>RESEARCH WORKSPACE</span>
            <span aria-hidden="true">·</span>
            <span>{user.affiliation}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50">
            {getGreeting()}, {user.name.split(' ')[0] || 'Researcher'}.
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Continue exploring your literature. What are you investigating today?
          </p>
        </div>

        {/* Quick Actions Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Paper</span>
          </button>

          <Link
            to="/chat"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-lg transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask Copilot</span>
          </Link>

          <Link
            to="/compare"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-lg transition-colors"
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Compare Papers</span>
          </Link>

          <Link
            to="/collections"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-lg transition-colors"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>New Collection</span>
          </Link>
        </div>
      </div>

      {/* Research Activity Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900">
          <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
            Total Indexed Papers
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100 mt-1">
            {papers.length}
          </div>
          <div className="text-[11px] text-neutral-500 mt-0.5">Across 4 collections</div>
        </div>

        <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900">
          <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
            Total Citations Tracked
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100 mt-1">
            126,886
          </div>
          <div className="text-[11px] text-neutral-500 mt-0.5">Peer-reviewed corpora</div>
        </div>

        <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900">
          <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
            Grounded QA Sessions
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100 mt-1">
            48
          </div>
          <div className="text-[11px] text-neutral-500 mt-0.5">94% average relevance</div>
        </div>

        <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900">
          <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
            Vector Chunks Indexed
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100 mt-1">
            3,420
          </div>
          <div className="text-[11px] text-neutral-500 mt-0.5">Semantic boundary parsing</div>
        </div>
      </div>

      {/* Research Collections Overview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider font-mono">
              Research Collections
            </h2>
            <p className="text-xs text-neutral-500">Curated bibliographies and literature reviews</p>
          </div>
          <Link
            to="/collections"
            className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-100 flex items-center gap-1 font-medium"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_COLLECTIONS.map((col) => (
            <Link
              key={col.id}
              to={`/collections`}
              className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-700 transition-colors block group"
            >
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                <span className="font-mono">{col.paperCount} papers</span>
                <span className="text-[10px]">Updated {col.lastUpdated}</span>
              </div>
              <h3 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 group-hover:underline line-clamp-1 mb-1">
                {col.name}
              </h3>
              <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed">
                {col.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Papers */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider font-mono">
              Recently Investigated Papers
            </h2>
            <p className="text-xs text-neutral-500">Pick up reading or query active copilot scope</p>
          </div>
          <Link
            to="/library"
            className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-100 flex items-center gap-1 font-medium"
          >
            <span>Open Library ({papers.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-44 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentPapers.map((paper) => (
              <PaperCard key={paper.id} paper={paper} />
            ))}
          </div>
        )}
      </div>

      {/* Subtle Research Activity Timeline / Ingestion Status */}
      <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 bg-white dark:bg-neutral-900">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-200 dark:border-neutral-800 text-xs">
          <div className="flex items-center gap-2 font-mono uppercase tracking-wider text-neutral-500">
            <Clock className="w-3.5 h-3.5" />
            <span>Recent Research Activity</span>
          </div>
          <span className="font-mono text-[11px] text-neutral-400">Continuous Logging</span>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-medium text-neutral-800 dark:text-neutral-200">
                Copilot grounded query on "Hallucination & Noise Robustness"
              </span>
            </div>
            <span className="text-[11px] font-mono text-neutral-400">10:23 AM</span>
          </div>

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-neutral-400" />
              <span className="font-medium text-neutral-800 dark:text-neutral-200">
                Extracted citations for "From Local to Global: A Graph RAG Approach"
              </span>
            </div>
            <span className="text-[11px] font-mono text-neutral-400">Yesterday, 4:10 PM</span>
          </div>

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              <span className="font-medium text-neutral-800 dark:text-neutral-200">
                Created research scope with 3 foundational RAG papers
              </span>
            </div>
            <span className="text-[11px] font-mono text-neutral-400">2 days ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};
