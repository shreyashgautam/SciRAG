import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Upload,
  LayoutGrid,
  List,
  Filter,
  ArrowUpDown,
  Star,
  CheckSquare,
  Square,
  GitCompare,
  Sparkles,
  Layers,
  BookOpen,
  Database,
  Globe,
  Clock
} from 'lucide-react';
import { getPapers, toggleFavorite } from '../../services/paperService';
import { Paper, PaperSource } from '../../types';
import { PaperCard } from '../../components/papers/PaperCard';
import { PaperTable } from '../../components/papers/PaperTable';
import { useResearch } from '../../context/ResearchContext';

type SourceFilterTab = 'all' | 'pdf' | 'arxiv' | 'semantic_scholar' | 'pubmed' | 'favorites' | 'recent';

export const LibraryPage: React.FC = () => {
  const { setUploadModalOpen, selectedScopePaperIds, setScopePapers, clearScope } = useResearch();
  const navigate = useNavigate();

  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [activeSourceTab, setActiveSourceTab] = useState<SourceFilterTab>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'lastOpened' | 'year' | 'citations' | 'title'>('lastOpened');

  const loadPapers = async () => {
    setLoading(true);
    const data = await getPapers();
    setPapers(data);
    setLoading(false);
  };

  useEffect(() => {
    loadPapers();
    const handleReload = () => {
      loadPapers();
    };
    window.addEventListener('scirag:paper-uploaded', handleReload);
    return () => window.removeEventListener('scirag:paper-uploaded', handleReload);
  }, []);

  const handleToggleFav = async (id: string) => {
    await toggleFavorite(id);
    setPapers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    );
  };

  const filteredAndSortedPapers = useMemo(() => {
    let result = [...papers];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.abstract.toLowerCase().includes(q) ||
          p.authors.some((a) => a.name.toLowerCase().includes(q)) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Source filter tab
    if (activeSourceTab === 'favorites') {
      result = result.filter((p) => p.isFavorite);
    } else if (activeSourceTab === 'recent') {
      result = result.filter((p) => p.lastOpened.includes('now') || p.lastOpened.includes('minute') || p.lastOpened.includes('hour'));
    } else if (activeSourceTab !== 'all') {
      result = result.filter((p) => p.source === activeSourceTab);
    }

    // Processing status filter
    if (statusFilter !== 'all') {
      result = result.filter((p) => p.status === statusFilter);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'year') return b.year - a.year;
      if (sortBy === 'citations') return b.citationCount - a.citationCount;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });

    return result;
  }, [papers, searchQuery, activeSourceTab, statusFilter, sortBy]);

  const sourceFilterButtons: { id: SourceFilterTab; label: string; count?: number }[] = [
    { id: 'all', label: 'All Literature', count: papers.length },
    { id: 'pdf', label: 'Uploaded PDF', count: papers.filter((p) => p.source === 'pdf').length },
    { id: 'arxiv', label: 'arXiv', count: papers.filter((p) => p.source === 'arxiv').length },
    { id: 'semantic_scholar', label: 'Semantic Scholar', count: papers.filter((p) => p.source === 'semantic_scholar').length },
    { id: 'pubmed', label: 'PubMed', count: papers.filter((p) => p.source === 'pubmed').length },
    { id: 'favorites', label: 'Favorites', count: papers.filter((p) => p.isFavorite).length },
    { id: 'recent', label: 'Recently Opened' }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-1">
            <span>SCIENTIFIC LITERATURE REPOSITORY</span>
            <span aria-hidden="true">·</span>
            <span>{papers.length} DOCUMENTS INDEXED</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Research Library
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage academic corpora parsed into bounded 300–500 token semantic chunks for RAG synthesis.
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer shadow-xs"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Add Research Document</span>
        </button>
      </div>

      {/* Scientific Source Tabs (All / Uploaded / arXiv / Semantic Scholar / PubMed / Favorites / Recent) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-b border-neutral-200 dark:border-neutral-800">
        {sourceFilterButtons.map((tab) => {
          const isActive = activeSourceTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSourceTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg font-medium transition-all shrink-0 cursor-pointer border-b-2 -mb-[2px] ${
                isActive
                  ? 'border-neutral-900 dark:border-neutral-100 text-neutral-950 dark:text-neutral-50 bg-neutral-100/60 dark:bg-neutral-900 font-semibold'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/40'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="font-mono text-[10px] text-neutral-400 opacity-80">
                  ({tab.count})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search & Control Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search titles, authors, DOI, or abstract content..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-neutral-400"
          />
        </div>

        {/* Sort & View Mode */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 focus:outline-hidden text-xs"
          >
            <option value="all">All Statuses</option>
            <option value="ready">Indexed Only</option>
            <option value="chunking">Processing / Chunking</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 focus:outline-hidden text-xs"
          >
            <option value="lastOpened">Sort: Recently Opened</option>
            <option value="year">Sort: Publication Year</option>
            <option value="citations">Sort: Citations</option>
            <option value="title">Sort: Title (A-Z)</option>
          </select>

          {/* View mode toggle */}
          <div className="flex items-center p-0.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded-md transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1 rounded-md transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
              }`}
              aria-label="Table view"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Scope Batch Bar when papers are selected */}
      {selectedScopePaperIds.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-xs shadow-md animate-in fade-in">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4" />
            <span className="font-semibold font-mono">
              {selectedScopePaperIds.length} paper{selectedScopePaperIds.length > 1 ? 's' : ''} in active scope
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/chat')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/20 hover:bg-white/30 text-white dark:bg-black/10 dark:hover:bg-black/20 dark:text-black font-medium transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask Copilot</span>
            </button>

            {selectedScopePaperIds.length >= 2 && (
              <button
                onClick={() => navigate('/compare')}
                className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/20 hover:bg-white/30 text-white dark:bg-black/10 dark:hover:bg-black/20 dark:text-black font-medium transition-colors cursor-pointer"
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span>Compare</span>
              </button>
            )}

            <button
              onClick={clearScope}
              className="text-[11px] underline opacity-80 hover:opacity-100 px-1 cursor-pointer"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Papers View */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-48 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 animate-pulse"
            />
          ))}
        </div>
      ) : filteredAndSortedPapers.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900">
          <BookOpen className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
            Your research library is empty
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-4">
            {searchQuery
              ? `No documents matched the query "${searchQuery}". Try different keywords.`
              : 'Add scientific papers via PDF upload, arXiv ID, Semantic Scholar, or PubMed.'}
          </p>
          <button
            onClick={() => setUploadModalOpen(true)}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 cursor-pointer"
          >
            Add Research Document
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedPapers.map((paper) => (
            <PaperCard key={paper.id} paper={paper} onToggleFavorite={handleToggleFav} />
          ))}
        </div>
      ) : (
        <PaperTable papers={filteredAndSortedPapers} onToggleFavorite={handleToggleFav} />
      )}
    </div>
  );
};
