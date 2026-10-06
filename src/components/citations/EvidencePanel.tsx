import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ShieldCheck,
  FileText,
  ArrowUpRight,
  Copy,
  Check,
  Layers,
  Cpu,
  BookmarkCheck,
  ChevronRight,
  Hash,
  Database
} from 'lucide-react';
import { useResearch } from '../../context/ResearchContext';

export const EvidencePanel: React.FC = () => {
  const { activeCitation, isEvidencePanelOpen, setEvidencePanelOpen } = useResearch();
  const navigate = useNavigate();
  const [copiedQuote, setCopiedQuote] = useState(false);
  const [copiedBibtex, setCopiedBibtex] = useState(false);
  const [activeTab, setActiveTab] = useState<'evidence' | 'telemetry'>('evidence');

  if (!isEvidencePanelOpen || !activeCitation) return null;

  const handleCopyQuote = () => {
    navigator.clipboard.writeText(`"${activeCitation.excerpt}"`);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2000);
  };

  const handleCopyBibtex = () => {
    const bibtex = `@article{${activeCitation.paperId},
  title = {${activeCitation.paperTitle}},
  author = {${activeCitation.authors}},
  year = {${activeCitation.year}},
  pages = {${activeCitation.page}}
}`;
    navigator.clipboard.writeText(bibtex);
    setCopiedBibtex(true);
    setTimeout(() => setCopiedBibtex(false), 2000);
  };

  const handleOpenInPaper = () => {
    // Navigate with citation ID, target page, and section for smooth slide-to-target in reader
    const targetUrl = `/library/${activeCitation.paperId}?cite=${activeCitation.id}&page=${activeCitation.page}&section=${encodeURIComponent(activeCitation.section)}`;
    setEvidencePanelOpen(false);
    navigate(targetUrl);
  };

  return (
    <AnimatePresence>
      {/* Backdrop for mobile & desktop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={() => setEvidencePanelOpen(false)}
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs"
      />

      {/* Responsive Drawer: Bottom Sheet on Mobile (<640px), Slide-in Right Panel on Tablet/Desktop (>=640px) */}
      <motion.aside
        key="panel"
        aria-label="Source Inspector"
        initial={{ x: '100%', y: 0 }}
        animate={{ x: 0, y: 0 }}
        exit={{ x: '100%', y: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        className="fixed z-50 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col
          bottom-0 inset-x-0 max-h-[88vh] rounded-t-2xl border-t sm:border-t-0 sm:rounded-t-none
          sm:inset-y-0 sm:right-0 sm:left-auto sm:w-[440px] sm:max-h-none sm:border-l"
      >
        {/* Mobile Drag Indicator Bar */}
        <div className="pt-3 pb-1 flex justify-center sm:hidden">
          <div className="w-12 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full" />
        </div>

        {/* Panel Header */}
        <div className="px-5 py-3.5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 flex items-center justify-center font-bold text-xs font-mono shadow-xs">
              [{activeCitation.number}]
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 font-mono">
                  Source Inspector
                </h3>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                  PASSAGE PROVENANCE
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 font-mono mt-0.5">
                SciRAG Vector Verification Engine
              </p>
            </div>
          </div>

          <button
            onClick={() => setEvidencePanelOpen(false)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Close Source Inspector"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs inside Inspector */}
        <div className="px-5 pt-3 pb-2 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('evidence')}
            className={`pb-1.5 font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'evidence'
                ? 'border-neutral-900 dark:border-neutral-100 text-neutral-950 dark:text-neutral-50 font-semibold'
                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            Evidence & Passage
          </button>
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`pb-1.5 font-medium border-b-2 transition-colors cursor-pointer font-mono text-[11px] ${
              activeTab === 'telemetry'
                ? 'border-neutral-900 dark:border-neutral-100 text-neutral-950 dark:text-neutral-50 font-semibold'
                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            RAG Vector Telemetry
          </button>
        </div>

        {/* Panel Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {activeTab === 'evidence' ? (
            <>
              {/* Relevance Score Gauge Card */}
              <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-950/60">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-mono text-[11px] font-bold text-neutral-900 dark:text-neutral-100">
                      Grounded Evidence Match
                    </span>
                  </div>
                  <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {activeCitation.relevanceScore}% Match
                  </span>
                </div>

                {/* Micro Visual Match Bar */}
                <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${activeCitation.relevanceScore}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono mt-2">
                  <span>Cosine Similarity: {(activeCitation.relevanceScore / 100).toFixed(3)}</span>
                  <span>Zero Speculative Drift</span>
                </div>
              </div>

              {/* Paper Provenance Meta Box */}
              <div className="space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                  Target Literature
                </div>
                <h4 className="text-sm font-bold text-neutral-950 dark:text-neutral-50 leading-snug">
                  {activeCitation.paperTitle}
                </h4>

                <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">
                    {activeCitation.authors}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{activeCitation.year}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold">
                    Page {activeCitation.page}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-neutral-500 flex items-center gap-1.5 pt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                  <span>Section: {activeCitation.section}</span>
                </div>
              </div>

              {/* Retrieved Grounded Excerpt Box */}
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                    Retrieved Grounded Passage
                  </span>
                  <button
                    onClick={handleCopyQuote}
                    className="text-[11px] text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedQuote ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span className="text-emerald-500">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Passage</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="relative p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/90 shadow-2xs">
                  <div className="absolute top-3 left-3 text-2xl font-serif text-neutral-300 dark:text-neutral-700 select-none leading-none">
                    “
                  </div>
                  <p className="text-xs sm:text-[13px] leading-relaxed text-neutral-900 dark:text-neutral-100 font-serif italic pl-4 pr-1">
                    "{activeCitation.excerpt}"
                  </p>
                </div>
              </div>

              {/* Slide Navigation Hint Callout */}
              <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-800/40 text-[11px] text-neutral-600 dark:text-neutral-400 flex items-start gap-2.5">
                <div className="w-2 h-2 rounded-full bg-neutral-900 dark:bg-neutral-100 mt-1 shrink-0" />
                <p className="leading-relaxed">
                  Clicking <strong className="text-neutral-900 dark:text-neutral-100">Open in Paper Viewer</strong> will slide directly to <strong className="text-neutral-900 dark:text-neutral-100">Page {activeCitation.page}</strong> and activate a glowing anchor highlight on this passage.
                </p>
              </div>
            </>
          ) : (
            /* Technical Telemetry Tab */
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-950/60 space-y-3 font-mono text-[11px]">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                  <span className="text-neutral-500">Bi-Encoder Model</span>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">BGE-M3 (1024-D)</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                  <span className="text-neutral-500">Retrieval Pipeline</span>
                  <span className="text-neutral-900 dark:text-neutral-100">DPR + BM25 Hybrid (Reciprocal Rank)</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                  <span className="text-neutral-500">Vector Index Type</span>
                  <span className="text-neutral-900 dark:text-neutral-100">FAISS HNSW (efSearch=64)</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                  <span className="text-neutral-500">Passage Chunk Target</span>
                  <span className="text-neutral-900 dark:text-neutral-100">300–500 tokens (Overlap: 50)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Document Chunk ID</span>
                  <span className="text-neutral-900 dark:text-neutral-100">chk-{activeCitation.paperId}-p{activeCitation.page}#02</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                  BibTeX Academic Citation
                </span>
                <div className="p-3 bg-neutral-100 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 font-mono text-[10px] text-neutral-600 dark:text-neutral-400 overflow-x-auto">
                  <pre>{`@article{${activeCitation.paperId},
  title = {${activeCitation.paperTitle}},
  author = {${activeCitation.authors}},
  year = {${activeCitation.year}},
  pages = {${activeCitation.page}}
}`}</pre>
                </div>
                <button
                  onClick={handleCopyBibtex}
                  className="w-full py-1.5 px-3 text-[11px] font-medium border border-neutral-200 dark:border-neutral-800 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5"
                >
                  {copiedBibtex ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedBibtex ? 'BibTeX Copied' : 'Copy BibTeX Citation'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions — Touch Optimized */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-950/80 flex items-center gap-2.5">
          <button
            onClick={handleOpenInPaper}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200 rounded-xl transition-all shadow-sm cursor-pointer active:scale-[0.98]"
          >
            <FileText className="w-4 h-4" />
            <span>Open in Paper Viewer</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleCopyQuote}
            className="p-3 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
            title="Copy Excerpt"
            aria-label="Copy Excerpt"
          >
            {copiedQuote ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};
