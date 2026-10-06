import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Sparkles,
  GitCompare,
  Star,
  FolderPlus,
  Bookmark,
  Share2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  FileText,
  CheckCircle2,
  Layers,
  ShieldCheck,
  Menu,
  X,
  Compass,
  ArrowUpRight,
  Database,
  ArrowRight,
  CornerDownRight,
  Copy,
  Check,
  MessageSquare
} from 'lucide-react';
import { getPaperById, toggleFavorite } from '../../services/paperService';
import { Paper, PaperSection, Citation } from '../../types';
import { PaperStatus } from '../../components/papers/PaperStatus';
import { formatSourceLabel } from '../../components/papers/PaperCard';
import { useResearch } from '../../context/ResearchContext';
import { MOCK_CITATIONS } from '../../data/mockSources';

export const PaperDetailPage: React.FC = () => {
  const { paperId } = useParams<{ paperId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    setScopePapers,
    togglePaperInScope,
    selectedScopePaperIds,
    activeCitation,
    setActiveCitation,
    setEvidencePanelOpen
  } = useResearch();

  const citeQuery = searchParams.get('cite');
  const pageQuery = searchParams.get('page');
  const sectionQuery = searchParams.get('section');

  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'reader' | 'summary'>('reader');
  const [selectedSectionId, setSelectedSectionId] = useState<string>('sec-abstract');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');
  const [isTocMobileOpen, setIsTocMobileOpen] = useState<boolean>(false);
  const [highlightPulse, setHighlightPulse] = useState<boolean>(false);
  const [copiedExcerpt, setCopiedExcerpt] = useState<boolean>(false);

  const evidenceAnchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (paperId) {
      setLoading(true);
      getPaperById(paperId).then((p) => {
        setPaper(p);
        setLoading(false);
      });
    }
  }, [paperId]);

  // Handle URL query parameters for direct citation sliding & navigation
  useEffect(() => {
    if (!paper) return;

    if (citeQuery && MOCK_CITATIONS[citeQuery]) {
      const citeObj = MOCK_CITATIONS[citeQuery];
      setActiveCitation(citeObj);
      if (citeObj.page) {
        setCurrentPage(citeObj.page);
      }
    } else if (pageQuery) {
      const p = parseInt(pageQuery, 10);
      if (!isNaN(p) && p >= 1) {
        setCurrentPage(p);
      }
    }

    if (sectionQuery) {
      const decoded = decodeURIComponent(sectionQuery).toLowerCase();
      const sec = (paper.sections || []).find(
        (s) =>
          s.id.toLowerCase() === decoded ||
          s.title.toLowerCase().includes(decoded) ||
          (pageQuery && s.page === parseInt(pageQuery, 10))
      );
      if (sec) {
        setSelectedSectionId(sec.id);
      }
    } else if (citeQuery && MOCK_CITATIONS[citeQuery]) {
      const cite = MOCK_CITATIONS[citeQuery];
      const sec = (paper.sections || []).find((s) => s.page === cite.page);
      if (sec) {
        setSelectedSectionId(sec.id);
      }
    }

    // Slide/Scroll smoothly to the cited evidence passage
    if (citeQuery || pageQuery) {
      setHighlightPulse(true);
      const timer = setTimeout(() => {
        evidenceAnchorRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [paper, citeQuery, pageQuery, sectionQuery]);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 w-32 bg-neutral-200 dark:bg-neutral-800 rounded-sm" />
        <div className="h-28 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
        <div className="h-96 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="p-12 text-center border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900">
        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
          Document not found
        </h2>
        <p className="text-xs text-neutral-500 mb-4">
          The requested paper may have been removed or does not exist in the index.
        </p>
        <Link
          to="/library"
          className="text-xs font-medium text-neutral-900 dark:text-neutral-100 underline"
        >
          ← Return to Library
        </Link>
      </div>
    );
  }

  const standardSections: PaperSection[] =
    paper.sections && paper.sections.length > 5
      ? paper.sections
      : [
          { id: 'sec-abstract', title: 'Abstract', page: 1, content: paper.abstract },
          {
            id: 'sec-intro',
            title: '1. Introduction',
            page: 1,
            content:
              'Pre-trained neural language models demonstrate surprising memorization abilities. Nevertheless, parametric-only models suffer from inherent limitations: they cannot easily expand or revise their factual memory, struggle to state precise provenance for their decisions, and can hallucinate fictitious content.'
          },
          {
            id: 'sec-related',
            title: '2. Related Work & Model Architecture',
            page: 2,
            content:
              'Retrieval-Augmented Generation reduces reliance on information stored only within model parameters by introducing external evidence during generation. We formulate RAG-Token and RAG-Sequence where passage retrieval conditions token distribution directly across non-parametric memory. Early open-domain QA frameworks utilized BM25 lexical ranking to retrieve candidate passages into extractors; RAG unifies modern dense passage retrieval (DPR) with sequence-to-sequence neural generators in an end-to-end differentiable graph.'
          },
          {
            id: 'sec-method',
            title: '3. Methodology & Formulation',
            page: 3,
            content:
              'We formulate RAG architectures combining a pre-trained sequence-to-sequence model (BART) with a non-parametric dense vector index of Wikipedia passages queried via a Dense Passage Retriever (DPR).'
          },
          {
            id: 'sec-experiments',
            title: '4. Experiments and Benchmarks',
            page: 6,
            content:
              'We evaluate RAG on open-domain question answering datasets (Natural Questions, WebQuestions, CuratedTREC) and knowledge-intensive generation tasks including MS-MARCO and Jeopardy! generation.'
          },
          {
            id: 'sec-results',
            title: '5. Empirical Results',
            page: 8,
            content:
              'RAG models establish state-of-the-art results on Natural Questions (44.5 Exact Match) and CuratedTREC. Generated outputs are significantly more factual and specific than pure parametric baselines.'
          },
          {
            id: 'sec-discussion',
            title: '6. Discussion',
            page: 10,
            content:
              'Retrieved passage diversity provides explicit auditability. Inspecting token-level marginalization reveals that the model grounds numeric entities and factual attributes strictly upon top retrieved vectors.'
          },
          {
            id: 'sec-conclusion',
            title: '7. Conclusion',
            page: 11,
            content:
              'Combining parametric and non-parametric memory represents a promising architectural paradigm for grounded neural generation.'
          },
          {
            id: 'sec-references',
            title: '8. References',
            page: 12,
            content:
              'Selected foundational references spanning dense bi-encoders, FAISS indexing, transformer sequence models, and reference-free evaluation metrics.'
          }
        ];

  const currentSection =
    standardSections.find((s) => s.id === selectedSectionId) ||
    standardSections.find((s) => s.page === currentPage) ||
    standardSections[0];

  const handleAskPaper = () => {
    setScopePapers([paper.id]);
    navigate('/chat');
  };

  const handleToggleFav = async () => {
    await toggleFavorite(paper.id);
    setPaper((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
  };

  const goToPage = (newPage: number) => {
    const clamped = Math.max(1, Math.min(paper.pageCount, newPage));
    if (clamped !== currentPage) {
      setSlideDirection(clamped > currentPage ? 'next' : 'prev');
      setCurrentPage(clamped);
      const matchSec = standardSections.find((s) => s.page === clamped);
      if (matchSec) setSelectedSectionId(matchSec.id);
    }
  };

  const isPaperInScope = selectedScopePaperIds.includes(paper.id);
  const matchingCitation =
    (activeCitation && activeCitation.paperId === paper.id)
      ? activeCitation
      : (citeQuery && MOCK_CITATIONS[citeQuery])
        ? MOCK_CITATIONS[citeQuery]
        : null;

  const handleCopyExcerptText = () => {
    if (matchingCitation) {
      navigator.clipboard.writeText(`"${matchingCitation.excerpt}"`);
      setCopiedExcerpt(true);
      setTimeout(() => setCopiedExcerpt(false), 2000);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            to="/library"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Library</span>
          </Link>
          <span className="text-neutral-300 dark:text-neutral-700">/</span>
          <span className="text-xs font-mono text-neutral-400 truncate max-w-[200px]">
            {paper.id}
          </span>
        </div>

        {/* Action Buttons: Read, Ask, Summarize, Compare, Scope */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('reader')}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
              activeTab === 'reader'
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 border-neutral-900 dark:border-neutral-100'
                : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
            }`}
          >
            Read Paper
          </button>

          <button
            onClick={handleAskPaper}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 transition-colors cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask Paper</span>
          </button>

          <button
            onClick={() => setActiveTab('summary')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
              activeTab === 'summary'
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 border-neutral-900 dark:border-neutral-100'
                : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
            }`}
          >
            <span>Synthesis</span>
          </button>

          <Link
            to="/compare"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Compare</span>
          </Link>

          <button
            onClick={() => togglePaperInScope(paper.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono rounded-lg border transition-colors cursor-pointer ${
              isPaperInScope
                ? 'border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 font-semibold'
                : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isPaperInScope ? 'In Scope' : '+ Scope'}</span>
          </button>

          <button
            onClick={handleToggleFav}
            className={`p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 transition-colors cursor-pointer ${
              paper.isFavorite
                ? 'text-amber-500'
                : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
            aria-label="Favorite paper"
          >
            <Star className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>

      {/* Grounded Slide Navigation Banner when navigated from citation */}
      {matchingCitation && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="p-3.5 sm:p-4 rounded-xl border border-neutral-900 dark:border-neutral-100 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-md"
        >
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-white/20 dark:bg-black/10 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 font-mono font-bold">
              [{matchingCitation.number}]
            </div>
            <div>
              <div className="flex items-center gap-2 font-bold tracking-tight">
                <span>Grounded Evidence Slide Anchor</span>
                <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-emerald-500 text-white font-bold">
                  {matchingCitation.relevanceScore}% Match
                </span>
              </div>
              <p className="text-neutral-300 dark:text-neutral-700 text-[11px] mt-0.5">
                Slid to Page {matchingCitation.page} · {matchingCitation.section} · Verified Grounded Passage
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                evidenceAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setHighlightPulse(true);
              }}
              className="px-2.5 py-1.5 rounded-lg bg-white/15 dark:bg-black/10 hover:bg-white/25 dark:hover:bg-black/20 text-xs font-medium transition-colors cursor-pointer"
            >
              Center Anchor
            </button>
            <Link
              to="/chat"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-neutral-950 dark:bg-neutral-900 dark:text-white text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Back to Copilot</span>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Paper Metadata Header Box */}
      <div className="p-4 sm:p-5 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900">
        <div className="flex flex-wrap items-center gap-2 mb-2 text-xs">
          <PaperStatus status={paper.status} progress={paper.progress} />
          <span className="text-neutral-300 dark:text-neutral-700">·</span>
          <span className="font-mono text-neutral-500">
            Source: <strong className="font-semibold text-neutral-800 dark:text-neutral-200">{formatSourceLabel(paper.source)}</strong>
          </span>
          <span className="text-neutral-300 dark:text-neutral-700">·</span>
          <span className="font-mono text-neutral-400">{paper.venue} ({paper.year})</span>
          {paper.doi && (
            <>
              <span className="text-neutral-300 dark:text-neutral-700">·</span>
              <span className="font-mono text-neutral-400 truncate max-w-[180px]">DOI: {paper.doi}</span>
            </>
          )}
        </div>

        <h1 className="text-base sm:text-xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50 mb-1.5 leading-snug">
          {paper.title}
        </h1>

        {/* Authors */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-300 mb-3">
          {paper.authors.map((author, idx) => (
            <React.Fragment key={author.name}>
              {idx > 0 && <span className="text-neutral-400">·</span>}
              <span title={author.affiliation} className="font-medium">
                {author.name}
              </span>
            </React.Fragment>
          ))}
        </div>

        {/* Technical Metadata Bar: Pages, Sections, Chunk Target */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-[11px] font-mono text-neutral-500">
          <span>{paper.pageCount} Pages</span>
          <span aria-hidden="true">·</span>
          <span>{standardSections.length} Sections</span>
          <span aria-hidden="true">·</span>
          <span>{paper.chunkCount || 38} Vector Chunks</span>
          <span aria-hidden="true">·</span>
          <span className="text-neutral-700 dark:text-neutral-300 font-semibold">
            SciRAG Chunk Target: 300–500 tokens
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'summary' ? (
        /* AI Paper Synthesis View */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 p-6 space-y-6"
        >
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />
              <h2 className="text-sm font-semibold uppercase tracking-wider font-mono text-neutral-900 dark:text-neutral-100">
                Grounded Literature Synthesis
              </h2>
            </div>
            <span className="text-[11px] font-mono text-neutral-400">
              Confidence: 96% · Grounded via 18 chunks
            </span>
          </div>

          {paper.summary ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="md:col-span-2 p-4 bg-neutral-50 dark:bg-neutral-950/60 rounded-xl border border-neutral-200 dark:border-neutral-800">
                <span className="font-mono text-[10px] uppercase text-neutral-400">TL;DR</span>
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mt-1 leading-relaxed">
                  {paper.summary.tldr}
                </p>
              </div>

              <div className="p-4 border border-neutral-100 dark:border-neutral-800 rounded-xl">
                <span className="font-mono text-[10px] uppercase text-neutral-400">Research Problem</span>
                <p className="text-neutral-700 dark:text-neutral-300 mt-1 leading-relaxed">
                  {paper.summary.researchProblem}
                </p>
              </div>

              <div className="p-4 border border-neutral-100 dark:border-neutral-800 rounded-xl">
                <span className="font-mono text-[10px] uppercase text-neutral-400">Key Contribution</span>
                <p className="text-neutral-700 dark:text-neutral-300 mt-1 leading-relaxed">
                  {paper.summary.keyContribution}
                </p>
              </div>

              <div className="p-4 border border-neutral-100 dark:border-neutral-800 rounded-xl">
                <span className="font-mono text-[10px] uppercase text-neutral-400">Methodology</span>
                <p className="text-neutral-700 dark:text-neutral-300 mt-1 leading-relaxed">
                  {paper.summary.methodology}
                </p>
              </div>

              <div className="p-4 border border-neutral-100 dark:border-neutral-800 rounded-xl">
                <span className="font-mono text-[10px] uppercase text-neutral-400">Datasets & Benchmarks</span>
                <p className="text-neutral-700 dark:text-neutral-300 mt-1 leading-relaxed">
                  {paper.summary.dataset}
                </p>
              </div>

              <div className="p-4 border border-neutral-100 dark:border-neutral-800 rounded-xl">
                <span className="font-mono text-[10px] uppercase text-neutral-400">Empirical Results</span>
                <p className="text-neutral-700 dark:text-neutral-300 mt-1 leading-relaxed">
                  {paper.summary.results}
                </p>
              </div>

              <div className="p-4 border border-neutral-100 dark:border-neutral-800 rounded-xl">
                <span className="font-mono text-[10px] uppercase text-neutral-400">Limitations</span>
                <p className="text-neutral-700 dark:text-neutral-300 mt-1 leading-relaxed">
                  {paper.summary.limitations}
                </p>
              </div>

              <div className="md:col-span-2 p-4 border border-neutral-100 dark:border-neutral-800 rounded-xl">
                <span className="font-mono text-[10px] uppercase text-neutral-400">Future Research Avenues</span>
                <p className="text-neutral-700 dark:text-neutral-300 mt-1 leading-relaxed">
                  {paper.summary.futureWork}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-neutral-500">Summary extraction pending for this document.</p>
          )}
        </motion.div>
      ) : (
        /* 3-Column Paper Workspace: TOC | Viewer | Provenance */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Mobile TOC Drawer Trigger */}
          <div className="lg:hidden flex items-center justify-between p-3 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 text-xs">
            <span className="font-medium text-neutral-800 dark:text-neutral-200 truncate pr-2">
              Current: {currentSection.title} (Page {currentPage})
            </span>
            <button
              onClick={() => setIsTocMobileOpen(!isTocMobileOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-950 shrink-0 cursor-pointer"
            >
              <Menu className="w-3.5 h-3.5" />
              <span>{isTocMobileOpen ? 'Close Outline' : 'Outline'}</span>
            </button>
          </div>

          {/* LEFT: Table of Contents (3 cols on lg) */}
          <div
            className={`lg:col-span-3 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 p-4 space-y-3 h-fit ${
              isTocMobileOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <span className="text-xs font-semibold uppercase tracking-wider font-mono text-neutral-500">
                Table of Contents
              </span>
              <span className="text-[11px] font-mono text-neutral-400">{standardSections.length} Sections</span>
            </div>

            <nav className="space-y-1">
              {standardSections.map((sec) => {
                const isSelected = sec.id === selectedSectionId || sec.page === currentPage;
                return (
                  <button
                    key={sec.id}
                    onClick={() => {
                      setSelectedSectionId(sec.id);
                      goToPage(sec.page);
                      setIsTocMobileOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-neutral-50 font-semibold'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                    }`}
                  >
                    <span className="truncate pr-1.5">{sec.title}</span>
                    <span className="text-[10px] font-mono text-neutral-400 shrink-0">
                      p.{sec.page}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* CENTER: Paper Viewer (6 cols on lg) */}
          <div className="lg:col-span-6 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 overflow-hidden flex flex-col shadow-xs">
            {/* Viewer HUD Controls: Slide navigation & Zoom */}
            <div className="px-4 py-2.5 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-950/70 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-mono text-neutral-700 dark:text-neutral-300">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 disabled:opacity-30 cursor-pointer transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-semibold text-xs min-w-[90px] text-center">
                  Page {currentPage} of {paper.pageCount}
                </span>
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage >= paper.pageCount}
                  className="p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 disabled:opacity-30 cursor-pointer transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(80, z - 10))}
                  className="p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="w-3.5 h-3.5 text-neutral-500" />
                </button>
                <span className="font-mono text-[11px] text-neutral-500 min-w-[35px] text-center">
                  {zoomLevel}%
                </span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(140, z + 10))}
                  className="p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="w-3.5 h-3.5 text-neutral-500" />
                </button>
              </div>
            </div>

            {/* Document Content Sheet with Smooth Slide Transitions */}
            <div className="p-3 sm:p-5 overflow-y-auto max-h-[680px] bg-neutral-100/40 dark:bg-neutral-950/40 flex justify-center">
              <div
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 sm:p-7 shadow-xs space-y-5 transition-transform"
              >
                {/* Document Header on Page 1 */}
                {currentPage === 1 && (
                  <div className="text-center pb-4 border-b border-neutral-100 dark:border-neutral-800">
                    <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100 leading-snug">
                      {paper.title}
                    </h2>
                    <p className="text-xs text-neutral-500 mt-1">
                      {paper.authors.map((a) => a.name).join(', ')}
                    </p>
                    <p className="text-[10px] font-mono text-neutral-400 mt-0.5">
                      {paper.venue} · Source: {formatSourceLabel(paper.source)}
                    </p>
                  </div>
                )}

                {/* Animated Page Slide Content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`page-content-${currentPage}-${selectedSectionId}`}
                    initial={{ opacity: 0, x: slideDirection === 'next' ? 18 : -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: slideDirection === 'next' ? -18 : 18 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between pb-1 border-b border-neutral-100 dark:border-neutral-800/60">
                      <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-neutral-900 dark:text-neutral-100">
                        {currentSection.title}
                      </h3>
                      <span className="text-[10px] font-mono text-neutral-400">
                        Page {currentPage}
                      </span>
                    </div>

                    <div className="text-xs leading-relaxed text-neutral-700 dark:text-neutral-300 font-serif space-y-4">
                      {/* Active Grounded Evidence Highlight Box (when on matching citation page) */}
                      {matchingCitation && matchingCitation.page === currentPage && (
                        <div
                          ref={evidenceAnchorRef}
                          id="active-evidence-anchor"
                          className={`relative p-4 rounded-xl border-2 transition-all duration-500 ${
                            highlightPulse
                              ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-100/90 dark:bg-neutral-800/90 shadow-md ring-2 ring-emerald-500/30'
                              : 'border-neutral-400 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800/50'
                          }`}
                        >
                          {/* Anchor Badge Header */}
                          <div className="flex items-center justify-between font-sans text-xs mb-2">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                              <span className="font-mono text-[10px] font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
                                ★ Grounded Evidence Passage [{matchingCitation.number}]
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-500 text-white font-bold">
                                {matchingCitation.relevanceScore}% Match
                              </span>
                              <button
                                onClick={handleCopyExcerptText}
                                className="text-[10px] font-mono text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer flex items-center gap-1"
                              >
                                {copiedExcerpt ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                <span>{copiedExcerpt ? 'Copied' : 'Copy'}</span>
                              </button>
                            </div>
                          </div>

                          {/* The Quoted Passage */}
                          <p className="font-serif italic font-medium text-neutral-950 dark:text-neutral-50 text-xs sm:text-[13px] leading-relaxed">
                            "{matchingCitation.excerpt}"
                          </p>

                          <div className="mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-700/60 font-sans text-[10px] text-neutral-500 font-mono flex items-center justify-between">
                            <span>Target Provenance Anchor: Page {matchingCitation.page}</span>
                            <span>Direct Copilot Evidence</span>
                          </div>
                        </div>
                      )}

                      <p>{currentSection.content}</p>

                      <p>
                        In modern scientific retrieval architectures, indexing is conducted offline across partitioned document chunks (target: 300–500 tokens). During query execution, bi-encoders embed the natural language prompt and execute maximum inner product search (MIPS) across millions of passage vectors, conditioning generative decoder decodings on non-parametric literature evidence.
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Footer in Reader */}
                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                  <span>SciRAG Literature Viewer</span>
                  <span>Page {currentPage} of {paper.pageCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Provenance & Technical Telemetry (3 cols on lg) */}
          <div className="lg:col-span-3 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 p-4 space-y-4 h-fit">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <span className="text-xs font-semibold uppercase tracking-wider font-mono text-neutral-500">
                Evidence Provenance
              </span>
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
            </div>

            <div className="space-y-3 text-xs">
              {matchingCitation ? (
                <div className="p-3.5 rounded-xl border border-neutral-900 dark:border-neutral-100 bg-neutral-50 dark:bg-neutral-950/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase font-bold text-neutral-900 dark:text-neutral-100">
                      Citation [{matchingCitation.number}]
                    </span>
                    <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-emerald-500 text-white font-bold">
                      {matchingCitation.relevanceScore}% rel
                    </span>
                  </div>

                  <p className="font-bold text-neutral-950 dark:text-neutral-50 text-xs">
                    {matchingCitation.paperTitle}
                  </p>

                  <div className="text-[11px] text-neutral-500 font-mono">
                    {matchingCitation.authors} · Page {matchingCitation.page}
                  </div>

                  <div className="text-[10px] text-neutral-400 font-mono pt-1 border-t border-neutral-200 dark:border-neutral-800">
                    {matchingCitation.section}
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-950/50 space-y-1.5">
                  <div className="flex items-center justify-between font-mono text-[10px] text-neutral-400">
                    <span>Chunk Index</span>
                    <span className="text-neutral-700 dark:text-neutral-300 font-bold">#14 / 42</span>
                  </div>
                  <div className="text-[11px] font-medium text-neutral-800 dark:text-neutral-200">
                    Target Size: ~300–500 tokens
                  </div>
                  <div className="text-[11px] text-neutral-500 leading-relaxed font-serif italic line-clamp-2">
                    "{paper.abstract.slice(0, 110)}..."
                  </div>
                </div>
              )}

              <div className="space-y-1.5 font-mono text-[11px] text-neutral-500">
                <div className="flex items-center justify-between">
                  <span>Dense Vector Model</span>
                  <span className="text-neutral-800 dark:text-neutral-200">BGE-M3 (1024-D)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Lexical Inverted Index</span>
                  <span className="text-neutral-800 dark:text-neutral-200">BM25 (k1=1.5, b=0.75)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Reranker Checkpoint</span>
                  <span className="text-neutral-800 dark:text-neutral-200">bge-reranker-large</span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  onClick={handleAskPaper}
                  className="w-full py-2.5 px-3 text-xs font-semibold rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask in Research Copilot</span>
                </button>

                {matchingCitation && (
                  <button
                    onClick={() => setEvidencePanelOpen(true)}
                    className="w-full py-2 px-3 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Open Full Source Inspector</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
