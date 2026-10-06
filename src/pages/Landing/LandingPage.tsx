import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  BookOpen,
  Sparkles,
  GitCompare,
  Network,
  ShieldCheck,
  Search,
  ExternalLink,
  CheckCircle2,
  Lock,
  Layers,
  ChevronRight,
  ChevronLeft,
  FileText,
  Sliders,
  Check,
  ArrowUpRight
} from 'lucide-react';
import { ThemeToggle } from '../../components/common/ThemeToggle';

interface SampleCitation {
  id: string;
  number: number;
  authors: string;
  year: number;
  venue: string;
  page: number;
  relevance: number;
  paperId: string;
  paperTitle: string;
  excerpt: string;
  sentenceIndex: number;
}

interface PreviewTopic {
  id: string;
  query: string;
  scopeCount: number;
  sentences: { text: string; citationNums?: number[] }[];
  citations: SampleCitation[];
}

const PREVIEW_TOPICS: PreviewTopic[] = [
  {
    id: 'hallucination',
    query: 'How does retrieval augmentation reduce hallucination in neural models?',
    scopeCount: 3,
    sentences: [
      {
        text: 'Retrieval-Augmented Generation constrains speculative parameter drift by grounding answers on explicit external evidence retrieved during token generation',
        citationNums: [1]
      },
      {
        text: 'Rather than relying strictly on memorized weights, dense non-parametric vector stores condition the decoder hypothesis space, ensuring factual assertions are anchored to verified text passages',
        citationNums: [2]
      }
    ],
    citations: [
      {
        id: 'cite-1',
        number: 1,
        authors: 'Lewis et al.',
        year: 2020,
        venue: 'NeurIPS 2020',
        page: 2,
        relevance: 94,
        paperId: 'rag-lewis-2020',
        paperTitle: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks',
        excerpt: 'Retrieval-Augmented Generation reduces reliance on information stored only within model parameters by introducing external evidence during generation. We formulate RAG-Token and RAG-Sequence where passage retrieval conditions token distribution directly.',
        sentenceIndex: 0
      },
      {
        id: 'cite-2',
        number: 2,
        authors: 'Gao et al.',
        year: 2023,
        venue: 'IEEE TKDE Survey',
        page: 5,
        relevance: 91,
        paperId: 'rag-survey-gao-2023',
        paperTitle: 'Retrieval-Augmented Generation for Large Language Models: A Survey',
        excerpt: 'Hallucination mitigation via RAG operates by constraining the decoder hypothesis space to information supported by retrieved passages. Advanced RAG incorporates cross-encoder re-ranking to filter out irrelevant candidates before prompt insertion.',
        sentenceIndex: 1
      }
    ]
  },
  {
    id: 'noise-robustness',
    query: 'What mechanisms mitigate irrelevant or adversarial retrieval noise?',
    scopeCount: 2,
    sentences: [
      {
        text: 'When retrieved documents contain irrelevant distractors, self-reflective critique tokens autonomously filter ungrounded propositions before final emission',
        citationNums: [3]
      },
      {
        text: 'Lightweight retrieval evaluators assess document confidence in real-time, executing corrective web fallbacks when internal knowledge indices return ambiguous matches',
        citationNums: [4]
      }
    ],
    citations: [
      {
        id: 'cite-3',
        number: 3,
        authors: 'Asai et al.',
        year: 2024,
        venue: 'ICLR 2024 (Oral)',
        page: 4,
        relevance: 88,
        paperId: 'self-rag-asai-2023',
        paperTitle: 'Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection',
        excerpt: 'Indiscriminate retrieval in standard RAG may introduce noisy passages that distract the generator. Self-RAG enforces selective retrieval and evaluates generated claim supportedness via [IsSUP] critique tokens.',
        sentenceIndex: 0
      },
      {
        id: 'cite-4',
        number: 4,
        authors: 'Yan et al.',
        year: 2024,
        venue: 'arXiv 2024',
        page: 3,
        relevance: 86,
        paperId: 'crag-yan-2024',
        paperTitle: 'Corrective Retrieval Augmented Generation (CRAG)',
        excerpt: 'The retrieval evaluator classifies retrieved documents into Correct, Ambiguous, and Incorrect. When confidence is below threshold, CRAG filters misleading passages and issues corrective search queries.',
        sentenceIndex: 1
      }
    ]
  },
  {
    id: 'graph-synthesis',
    query: 'Why is dense vector similarity insufficient for global multi-document summarization?',
    scopeCount: 2,
    sentences: [
      {
        text: 'Dense vector retrieval targets local passage centroids, which fundamentally fails on broad thematic synthesis spanning entire document libraries',
        citationNums: [5]
      },
      {
        text: 'Constructing hierarchical knowledge graph communities enables map-reduce style holistic summarization across multi-document corpora',
        citationNums: [5]
      }
    ],
    citations: [
      {
        id: 'cite-5',
        number: 5,
        authors: 'Edge et al.',
        year: 2024,
        venue: 'Microsoft Research',
        page: 7,
        relevance: 89,
        paperId: 'graphrag-edge-2024',
        paperTitle: 'From Local to Global: A Graph RAG Approach to Query-Focused Summarization',
        excerpt: 'Standard vector similarity retrieves passages that match local semantic centroids, but fails on thematic synthesis. Graph RAG performs hierarchical community detection over entity graphs to generate corpus-level answers.',
        sentenceIndex: 0
      }
    ]
  }
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  // Active topic & active citation in the preview
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(0);
  const currentTopic = PREVIEW_TOPICS[selectedTopicIndex];

  const [activeCitationIndex, setActiveCitationIndex] = useState(0);
  const activeCitation = currentTopic.citations[activeCitationIndex] || currentTopic.citations[0];

  // Mobile segmented view state: 'chat' | 'inspector'
  const [mobileTab, setMobileTab] = useState<'chat' | 'inspector'>('chat');

  const handleSelectCitation = (index: number) => {
    setActiveCitationIndex(index);
    // On mobile, automatically show the inspector tab when clicking a citation
    if (window.innerWidth < 768) {
      setMobileTab('inspector');
    }
  };

  const handleTopicChange = (newIdx: number) => {
    setSelectedTopicIndex(newIdx);
    setActiveCitationIndex(0);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col selection:bg-neutral-200 dark:selection:bg-neutral-800">
      {/* Top Bar following 3-zone contract */}
      <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Zone 1: Brand mark */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-neutral-900 dark:bg-neutral-100 flex items-center justify-center text-white dark:text-neutral-950 font-bold text-xs">
              SR
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-base tracking-tight leading-none">SciRAG</span>
              <span className="text-[9px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mt-0.5">Scientific RAG Engine</span>
            </div>
          </Link>

          {/* Zone 2: Navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-neutral-600 dark:text-neutral-400">
            <a href="#features" className="hover:text-neutral-950 dark:hover:text-neutral-100 transition-colors">
              Platform
            </a>
            <a href="#evidence" className="hover:text-neutral-950 dark:hover:text-neutral-100 transition-colors">
              Grounded Answers
            </a>
            <a href="#security" className="hover:text-neutral-950 dark:hover:text-neutral-100 transition-colors">
              Privacy & Security
            </a>
            <Link to="/knowledge-graph" className="hover:text-neutral-950 dark:hover:text-neutral-100 transition-colors">
              Research Map
            </Link>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2.5">
            <ThemeToggle compact={true} />
            <Link
              to="/login"
              className="text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-neutral-100 px-2.5 py-1.5"
            >
              Sign In
            </Link>
            <Link
              to="/dashboard"
              className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors shadow-xs"
            >
              Open Workspace
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-14 md:pt-24 md:pb-20 border-b border-neutral-200 dark:border-neutral-800/80 academic-grid relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-100/70 dark:bg-neutral-900/70 text-xs font-mono text-neutral-600 dark:text-neutral-400 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Academic Literature Intelligence & RAG Architecture</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50 mb-5 max-w-4xl mx-auto text-balance"
          >
            Your Research.
            <br />
            One Intelligent Workspace.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed font-normal"
          >
            Explore research papers, ask evidence-grounded questions, compare methodologies, discover connections, and turn fragmented literature into structured knowledge.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12 md:mb-16"
          >
            <Link
              to="/register"
              className="w-full sm:w-auto px-6 py-2.5 text-xs sm:text-sm font-semibold rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <span>Start Researching</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-6 py-2.5 text-xs sm:text-sm font-medium rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition-colors"
            >
              Explore Demo
            </Link>
          </motion.div>

          {/* Interactive Workspace Preview Component */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="relative max-w-4xl mx-auto rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl overflow-hidden text-left"
          >
            {/* Top Workspace Header Bar */}
            <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/80 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                <span className="ml-2 font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                  Research Copilot — Active Scope ({currentTopic.scopeCount} Papers)
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono">
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Grounded Mode</span>
                </span>
              </div>
            </div>

            {/* Topic Switcher Pills (Allows clicking through sample questions) */}
            <div className="px-4 py-2 border-b border-neutral-200 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-950/40 flex items-center gap-1.5 overflow-x-auto text-xs">
              <span className="text-[10px] font-mono uppercase text-neutral-400 shrink-0 mr-1">
                Sample Inquiries:
              </span>
              {PREVIEW_TOPICS.map((topic, idx) => (
                <button
                  key={topic.id}
                  onClick={() => handleTopicChange(idx)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all shrink-0 cursor-pointer ${
                    selectedTopicIndex === idx
                      ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/60 dark:hover:bg-neutral-800'
                  }`}
                >
                  {topic.id === 'hallucination'
                    ? 'Hallucination Mitigation'
                    : topic.id === 'noise-robustness'
                    ? 'Noise Robustness'
                    : 'Graph Synthesis'}
                </button>
              ))}
            </div>

            {/* Mobile View Toggle Switcher (Synthesis vs Source Inspector) */}
            <div className="md:hidden flex border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 p-1 text-xs">
              <button
                onClick={() => setMobileTab('chat')}
                className={`flex-1 py-1.5 rounded-md text-center font-medium transition-colors ${
                  mobileTab === 'chat'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-xs'
                    : 'text-neutral-500'
                }`}
              >
                ✦ Synthesis & Citations
              </button>
              <button
                onClick={() => setMobileTab('inspector')}
                className={`flex-1 py-1.5 rounded-md text-center font-medium transition-colors flex items-center justify-center gap-1.5 ${
                  mobileTab === 'inspector'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-xs'
                    : 'text-neutral-500'
                }`}
              >
                <span>⌕ Source Inspector</span>
                <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  ({activeCitation.relevance}%)
                </span>
              </button>
            </div>

            {/* Split Grid: Left Column (Chat + Citations) | Right Column (Sliding Source Inspector) */}
            <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-neutral-200 dark:divide-neutral-800 min-h-[380px]">
              {/* Chat Column (7 cols on desktop) */}
              <div
                className={`md:col-span-7 p-4 sm:p-5 space-y-4 flex flex-col justify-between ${
                  mobileTab === 'inspector' ? 'hidden md:flex' : 'flex'
                }`}
              >
                <div className="space-y-4">
                  {/* Researcher Query Box */}
                  <div className="p-3 bg-neutral-100 dark:bg-neutral-800/60 rounded-lg text-xs transition-all">
                    <div className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                      <span>Researcher Inquired</span>
                      <span className="font-mono text-[10px] text-neutral-400">10:14 AM</span>
                    </div>
                    <p className="text-neutral-900 dark:text-neutral-100 font-medium">
                      {currentTopic.query}
                    </p>
                  </div>

                  {/* AI Response Synthesis with Interactive Citation Chips */}
                  <div className="space-y-2 text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
                    <div className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
                      <span>Evidence-Grounded Synthesis</span>
                    </div>

                    {currentTopic.sentences.map((sent, sIdx) => {
                      const isHighlighted = activeCitation.sentenceIndex === sIdx;
                      return (
                        <p
                          key={sIdx}
                          className={`p-1.5 rounded-md transition-all duration-200 ${
                            isHighlighted
                              ? 'bg-neutral-100 dark:bg-neutral-800/80 text-neutral-950 dark:text-neutral-50 border-l-2 border-neutral-900 dark:border-neutral-100 pl-2.5'
                              : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/40'
                          }`}
                        >
                          {sent.text}{' '}
                          {sent.citationNums?.map((cNum) => {
                            const citeIndex = currentTopic.citations.findIndex(
                              (c) => c.number === cNum
                            );
                            const isActiveChip = activeCitation.number === cNum;
                            return (
                              <button
                                key={cNum}
                                onClick={() => handleSelectCitation(citeIndex >= 0 ? citeIndex : 0)}
                                className={`inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded font-mono text-[10px] font-bold transition-all cursor-pointer ${
                                  isActiveChip
                                    ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 scale-105 shadow-xs'
                                    : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-300 dark:hover:bg-neutral-700'
                                }`}
                                title={`Click to slide & inspect Source [${cNum}]`}
                              >
                                [{cNum}]
                              </button>
                            );
                          })}
                          .
                        </p>
                      );
                    })}
                  </div>
                </div>

                {/* Verified Citations Selector Cards */}
                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/80">
                  <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
                    <span>Verified Citations (Click to Slide & Inspect)</span>
                    <span className="text-[10px] lowercase text-neutral-400">
                      {activeCitationIndex + 1}/{currentTopic.citations.length} active
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentTopic.citations.map((cite, cIdx) => {
                      const isSelected = activeCitation.id === cite.id;
                      return (
                        <button
                          key={cite.id}
                          onClick={() => handleSelectCitation(cIdx)}
                          className={`text-left p-2.5 rounded-lg border transition-all cursor-pointer relative overflow-hidden ${
                            isSelected
                              ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-100/70 dark:bg-neutral-800/80 shadow-xs'
                              : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/60 hover:border-neutral-400 dark:hover:border-neutral-600'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-1">
                            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                              [{cite.number}] {cite.authors}
                            </span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                              {cite.relevance}% rel
                            </span>
                          </div>
                          <p className="font-medium text-neutral-800 dark:text-neutral-200 text-xs line-clamp-1">
                            {cite.paperTitle}
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono mt-1">
                            <span>Page {cite.page}</span>
                            <span className="text-[10px] text-neutral-400 group-hover:underline flex items-center gap-0.5">
                              <span>Inspect</span>
                              <ChevronRight className="w-3 h-3" />
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Source Inspector Column (5 cols on desktop, sliding animated transition) */}
              <div
                className={`md:col-span-5 p-4 sm:p-5 bg-neutral-50/70 dark:bg-neutral-950/60 text-xs flex flex-col justify-between ${
                  mobileTab === 'chat' ? 'hidden md:flex' : 'flex'
                }`}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCitation.id}
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -18 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-neutral-400">
                        <ShieldCheck className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-300" />
                        <span>Source Inspector</span>
                      </div>
                      <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                        {activeCitation.relevance}% Match
                      </span>
                    </div>

                    <div>
                      <div className="text-[10px] font-mono text-neutral-400 uppercase mb-0.5">
                        Source #{activeCitation.number}
                      </div>
                      <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 leading-snug">
                        {activeCitation.paperTitle}
                      </h4>
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-neutral-500 mt-1.5">
                        <span>{activeCitation.authors}</span>
                        <span aria-hidden="true">·</span>
                        <span>{activeCitation.venue}</span>
                        <span aria-hidden="true">·</span>
                        <span>{activeCitation.year}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">Page {activeCitation.page}</span>
                      </div>
                    </div>

                    {/* Retrieved Passage Excerpt */}
                    <div className="border-t border-neutral-200 dark:border-neutral-800/80 pt-3">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                        Retrieved Passage Chunk
                      </div>
                      <div className="p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900 font-serif italic text-neutral-700 dark:text-neutral-300 text-xs leading-relaxed selection:bg-neutral-200 dark:selection:bg-neutral-800">
                        "{activeCitation.excerpt}"
                      </div>
                    </div>

                    <div className="space-y-1.5 text-[11px] text-neutral-500 font-mono">
                      <div className="flex items-center justify-between">
                        <span>Vector Embedding</span>
                        <span className="text-neutral-700 dark:text-neutral-300">FAISS Cosine 0.942</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Index Namespace</span>
                        <span className="text-neutral-700 dark:text-neutral-300">arXiv:ai_v2</span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Footer Action: Smooth Slide into Paper Detail */}
                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 mt-4 flex items-center justify-between gap-2">
                  <button
                    onClick={() => navigate(`/library/${activeCitation.paperId}`)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 transition-colors cursor-pointer shadow-xs"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Open in Paper Viewer</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature 1: Intelligent Research */}
      <section id="features" className="py-20 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-14">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
              01. Literature Exploration
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50 mt-2 mb-3">
              Intelligent Research Without The Blind Spots
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Standard search matches keywords. SciRAG understands methodological nuances, identifying foundational paradigms, experimental baselines, and mathematical hypotheses across your library.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/50">
              <BookOpen className="w-5 h-5 text-neutral-800 dark:text-neutral-200 mb-4" />
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Hierarchical Document Parsing
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Extracts outlines, tables, formulas, and section semantics so questions can target specific methodology or experiment sections.
              </p>
            </div>

            <div className="p-6 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/50">
              <Layers className="w-5 h-5 text-neutral-800 dark:text-neutral-200 mb-4" />
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Flexible Research Scopes
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Scope conversations to a single paper, a customized literature collection, or across hundreds of papers in your bibliography.
              </p>
            </div>

            <div className="p-6 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/50">
              <Search className="w-5 h-5 text-neutral-800 dark:text-neutral-200 mb-4" />
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Semantic & Hybrid Search
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Blends dense vector embeddings with sparse BM25 signals so rare acronyms and author names are retrieved with high precision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 2: Evidence-Grounded Answers & Multi-Paper Reasoning */}
      <section id="evidence" className="py-20 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-950/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                02. Verifiable Provenance
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50 mt-2 mb-4">
                Evidence-Grounded Answers You Can Verify
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                Never second-guess whether an AI answer was hallucinated. Every assertion in SciRAG is anchored with interactive citation markers linking directly to the original passage and page in the paper.
              </p>

              <div className="space-y-3.5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-neutral-800 dark:text-neutral-200 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">Clickable Inline Citations</h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Inspect exact paragraphs and relevance scores in an instant side inspector.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-neutral-800 dark:text-neutral-200 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">Multi-Paper Cross-Examination</h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Synthesize methodologies and compare benchmark metrics across 2 to 4 papers side-by-side.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-neutral-800 dark:text-neutral-200 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">Automated Literature Summaries</h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Extract TL;DR, research problem, key contribution, datasets, and limitations in seconds.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  to="/compare"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 dark:text-neutral-100 hover:underline"
                >
                  <span>Explore Paper Comparison Tool</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Comparison preview card */}
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800 text-xs">
                <span className="font-mono text-neutral-400 uppercase tracking-wider">Multi-Paper Synthesis</span>
                <span className="font-mono text-neutral-500">2 Papers Selected</span>
              </div>

              <div className="mt-4 space-y-4 text-xs">
                <div>
                  <div className="font-mono text-[10px] text-neutral-400 uppercase">Core Methodology</div>
                  <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                      <p className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">RAG (Lewis 2020)</p>
                      <p className="text-neutral-500 text-[11px]">DPR bi-encoder retrieval + BART seq2seq generator fine-tuned end-to-end.</p>
                    </div>
                    <div className="p-3 bg-neutral-50 dark:bg-neutral-950 rounded-lg">
                      <p className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Self-RAG (Asai 2024)</p>
                      <p className="text-neutral-500 text-[11px]">On-demand retrieval using reflection tokens ([IsREL], [IsSUP]) to self-critique.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="font-mono text-[10px] text-neutral-400 uppercase">Key Benchmark Results</div>
                  <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                    <div className="p-2 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                      <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">44.5 EM</span> on Natural Questions
                    </div>
                    <div className="p-2 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                      <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">+12.8%</span> citation precision vs ChatGPT
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 3: Research Intelligence & Knowledge Graph */}
      <section className="py-20 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
            03. Graph Topology & Discovery
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50 mt-2 mb-4">
            Map The Scientific Landscape
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Move beyond isolated PDFs. Discover how papers cite, extend, critique, and evaluate one another in an interactive knowledge graph.
          </p>

          <div className="p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/50 max-w-3xl mx-auto text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                Explore The Research Graph
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md">
                Trace relationships across authors, methods, datasets, models, and emerging topics. Identify unaddressed research gaps before writing your next paper.
              </p>
            </div>
            <Link
              to="/knowledge-graph"
              className="px-4 py-2 text-xs font-medium rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <Network className="w-3.5 h-3.5" />
              <span>Launch Graph</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Security & Privacy Section */}
      <section id="security" className="py-20 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/20 dark:bg-neutral-950/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
              04. Academic Integrity & Protection
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50 mt-2 mb-3">
              Your Research Stays Your Research
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Academic preprints, patent applications, and laboratory findings require absolute confidentiality. We treat all ingested literature as private sovereign research assets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="p-5 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900">
              <Lock className="w-4 h-4 text-neutral-800 dark:text-neutral-200 mb-3" />
              <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Zero Training Policy</h4>
              <p className="text-neutral-500 leading-relaxed">
                Your private papers, embeddings, and chat dialogues are never used to train foundation models or public checkpoints.
              </p>
            </div>

            <div className="p-5 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900">
              <ShieldCheck className="w-4 h-4 text-neutral-800 dark:text-neutral-200 mb-3" />
              <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Isolated Vector Indices</h4>
              <p className="text-neutral-500 leading-relaxed">
                Embeddings are isolated in dedicated workspace namespaces with cryptographic tenant boundaries.
              </p>
            </div>

            <div className="p-5 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900">
              <FileText className="w-4 h-4 text-neutral-800 dark:text-neutral-200 mb-3" />
              <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Audited Security Docs</h4>
              <p className="text-neutral-500 leading-relaxed">
                Review our comprehensive threat models, data protection policies, and incident response frameworks in /security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Strong Final CTA */}
      <section className="py-20 border-b border-neutral-200 dark:border-neutral-800 text-center academic-grid">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50 mb-4 text-balance">
            Elevate Your Scientific Workflow Today
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-8 max-w-lg mx-auto leading-relaxed">
            Join researchers, engineers, and doctoral candidates accelerating literature reviews and empirical discovery.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-6 py-2.5 text-xs sm:text-sm font-semibold rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors shadow-xs"
            >
              Start Researching Now
            </Link>
            <Link
              to="/library"
              className="w-full sm:w-auto px-6 py-2.5 text-xs sm:text-sm font-medium rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition-colors"
            >
              Browse Public Library
            </Link>
          </div>
        </div>
      </section>

      {/* Editorial Footer */}
      <footer className="py-12 bg-white dark:bg-neutral-950 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-md bg-neutral-900 dark:bg-neutral-100 flex items-center justify-center text-white dark:text-neutral-950 font-bold text-[10px]">
              SR
            </div>
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">SciRAG</span>
            <span className="text-neutral-400">·</span>
            <span>Intelligent Literature Workspace</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
              Workspace
            </Link>
            <Link to="/library" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
              Library
            </Link>
            <Link to="/settings/security" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
              Security
            </Link>
            <Link to="/settings/privacy" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
              Privacy
            </Link>
          </div>

          <div className="font-mono text-[11px] text-neutral-400">
            Phase 1 Frontend Architecture
          </div>
        </div>
      </footer>
    </div>
  );
};
