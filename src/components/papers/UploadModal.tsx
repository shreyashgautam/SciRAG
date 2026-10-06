import React, { useState, useRef } from 'react';
import {
  Upload,
  X,
  Check,
  Loader2,
  FileText,
  AlertCircle,
  Search,
  Globe,
  BookOpen,
  Hash,
  Database
} from 'lucide-react';
import { useResearch } from '../../context/ResearchContext';
import { uploadPaper, importFromSource, INGESTION_PIPELINE_STAGES } from '../../services/paperService';
import { PaperSource } from '../../types';

export const UploadModal: React.FC<{ onPaperUploaded?: () => void }> = ({ onPaperUploaded }) => {
  const { isUploadModalOpen, setUploadModalOpen } = useResearch();
  const [selectedSource, setSelectedSource] = useState<PaperSource>('pdf');

  // Input states for remote sources
  const [arxivQuery, setArxivQuery] = useState('2403.08210');
  const [semanticQuery, setSemanticQuery] = useState('PaperQA scientific question answering');
  const [pubmedQuery, setPubmedQuery] = useState('PMC10842911');
  const [doiQuery, setDoiQuery] = useState('10.1145/3616855.3635745');

  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [processingItemName, setProcessingItemName] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isUploadModalOpen) return null;

  const handleProcessFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMessage('Only PDF documents are supported for scientific literature ingestion.');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 50 MB limit.');
      return;
    }

    setErrorMessage(null);
    setProcessingItemName(file.name);
    setIsProcessing(true);
    setCurrentStepIndex(0);

    try {
      await uploadPaper(file, (_stage, stepIndex) => {
        setCurrentStepIndex(stepIndex);
      });
      setCurrentStepIndex(INGESTION_PIPELINE_STAGES.length);
      setTimeout(() => {
        setIsProcessing(false);
        setUploadModalOpen(false);
        window.dispatchEvent(new CustomEvent('scirag:paper-uploaded'));
        if (onPaperUploaded) onPaperUploaded();
      }, 700);
    } catch {
      setErrorMessage('Ingestion pipeline failed. Please retry.');
      setIsProcessing(false);
    }
  };

  const handleImportRemote = async (source: PaperSource, identifier: string) => {
    if (!identifier.trim()) {
      setErrorMessage('Please enter a valid identifier or title query.');
      return;
    }

    setErrorMessage(null);
    setProcessingItemName(`${source.toUpperCase()}: ${identifier}`);
    setIsProcessing(true);
    setCurrentStepIndex(0);

    try {
      await importFromSource(source, identifier, (_stage, stepIndex) => {
        setCurrentStepIndex(stepIndex);
      });
      setCurrentStepIndex(INGESTION_PIPELINE_STAGES.length);
      setTimeout(() => {
        setIsProcessing(false);
        setUploadModalOpen(false);
        window.dispatchEvent(new CustomEvent('scirag:paper-uploaded'));
        if (onPaperUploaded) onPaperUploaded();
      }, 700);
    } catch {
      setErrorMessage('Failed to ingest paper from repository.');
      setIsProcessing(false);
    }
  };

  const sourceTabs: { id: PaperSource; label: string; icon: typeof Upload }[] = [
    { id: 'pdf', label: 'Upload PDF', icon: Upload },
    { id: 'arxiv', label: 'arXiv', icon: BookOpen },
    { id: 'semantic_scholar', label: 'Semantic Scholar', icon: Database },
    { id: 'pubmed', label: 'PubMed', icon: Globe },
    { id: 'doi', label: 'DOI / URL', icon: Hash }
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs"
      onClick={() => {
        if (!isProcessing) setUploadModalOpen(false);
      }}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl p-5 sm:p-6 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-neutral-900 dark:bg-neutral-100 flex items-center justify-center text-[10px] font-bold text-white dark:text-neutral-900">
              S
            </div>
            <div>
              <h2 id="upload-modal-title" className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Add Research Literature
              </h2>
              <p className="text-[11px] text-neutral-400">
                Ingest scientific papers into SciRAG semantic vector index
              </p>
            </div>
          </div>
          {!isProcessing && (
            <button
              onClick={() => setUploadModalOpen(false)}
              className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-md transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {errorMessage && (
          <div className="mb-4 p-2.5 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {!isProcessing ? (
          <div>
            {/* Source Selector Segmented Tabs */}
            <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs mb-5 overflow-x-auto">
              {sourceTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = selectedSource === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedSource(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-neutral-50 shadow-xs'
                        : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab 1: Upload PDF */}
            {selectedSource === 'pdf' && (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleProcessFile(e.dataTransfer.files[0]);
                  }
                }}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors flex flex-col items-center justify-center ${
                  isDragging
                    ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-50 dark:bg-neutral-800/40'
                    : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 bg-neutral-50/50 dark:bg-neutral-950/40'
                }`}
              >
                <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-full mb-3 text-neutral-700 dark:text-neutral-300">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-1">
                  Drop research papers here
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4 font-mono text-[11px]">
                  PDF files only · Maximum size: 50 MB
                </p>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleProcessFile(e.target.files[0]);
                    }
                  }}
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Browse Files
                </button>
              </div>
            )}

            {/* Tab 2: arXiv Search */}
            {selectedSource === 'arxiv' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    arXiv ID or Article Title
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={arxivQuery}
                      onChange={(e) => setArxivQuery(e.target.value)}
                      placeholder="e.g. 2403.08210 or RAG survey"
                      className="flex-1 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-neutral-100 focus:outline-hidden font-mono"
                    />
                    <button
                      onClick={() => handleImportRemote('arxiv', arxivQuery)}
                      className="px-4 py-2 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 font-semibold cursor-pointer"
                    >
                      Fetch & Ingest
                    </button>
                  </div>
                </div>
                <div className="p-3 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-500">
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">Supported Formats:</span> arXiv IDs (e.g. 2005.11401, 2312.10997) or title query for open-access preprint ingestion.
                </div>
              </div>
            )}

            {/* Tab 3: Semantic Scholar */}
            {selectedSource === 'semantic_scholar' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Semantic Scholar Query or Paper ID
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={semanticQuery}
                      onChange={(e) => setSemanticQuery(e.target.value)}
                      placeholder="e.g. PaperQA retrieval-augmented generation"
                      className="flex-1 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-neutral-100 focus:outline-hidden"
                    />
                    <button
                      onClick={() => handleImportRemote('semantic_scholar', semanticQuery)}
                      className="px-4 py-2 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 font-semibold cursor-pointer"
                    >
                      Import
                    </button>
                  </div>
                </div>
                <div className="p-3 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-500">
                  Extracts full paper metadata, citation count, venue details, and open-access PDF links directly from the Semantic Scholar academic graph.
                </div>
              </div>
            )}

            {/* Tab 4: PubMed */}
            {selectedSource === 'pubmed' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    PubMed Central ID (PMCID) or PMID
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={pubmedQuery}
                      onChange={(e) => setPubmedQuery(e.target.value)}
                      placeholder="e.g. PMC10842911 or clinical RAG query"
                      className="flex-1 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-neutral-100 focus:outline-hidden font-mono"
                    />
                    <button
                      onClick={() => handleImportRemote('pubmed', pubmedQuery)}
                      className="px-4 py-2 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 font-semibold cursor-pointer"
                    >
                      Ingest PubMed
                    </button>
                  </div>
                </div>
                <div className="p-3 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-500">
                  Fetches open-access biomedical literature from NCBI PubMed Central, extracting structured clinical trial methodologies and result sections.
                </div>
              </div>
            )}

            {/* Tab 5: DOI / URL */}
            {selectedSource === 'doi' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Digital Object Identifier (DOI) or Direct Article URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={doiQuery}
                      onChange={(e) => setDoiQuery(e.target.value)}
                      placeholder="e.g. 10.1145/3616855.3635745 or https://..."
                      className="flex-1 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-neutral-100 focus:outline-hidden font-mono"
                    />
                    <button
                      onClick={() => handleImportRemote('doi', doiQuery)}
                      className="px-4 py-2 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 font-semibold cursor-pointer"
                    >
                      Resolve & Parse
                    </button>
                  </div>
                </div>
                <div className="p-3 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-500">
                  Resolves CrossRef metadata records, gathers author affiliations, and retrieves open-access manuscript preprints via Unpaywall.
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Visual Paper Ingestion Pipeline (7 Stages) */
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-3 p-3 bg-neutral-100 dark:bg-neutral-800/60 rounded-lg">
              <FileText className="w-5 h-5 text-neutral-500 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold truncate text-neutral-900 dark:text-neutral-100">
                  {processingItemName}
                </p>
                <p className="text-[11px] text-neutral-400 font-mono">
                  SciRAG Ingestion Pipeline · Target: 300–500 tokens/chunk
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              {INGESTION_PIPELINE_STAGES.map((stageName, idx) => {
                const isDone = currentStepIndex > idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div
                    key={stageName}
                    className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors ${
                      isCurrent
                        ? 'bg-neutral-100 dark:bg-neutral-800 font-semibold text-neutral-900 dark:text-neutral-100'
                        : isDone
                        ? 'text-neutral-700 dark:text-neutral-300'
                        : 'text-neutral-400 dark:text-neutral-600'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {isDone ? (
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : isCurrent ? (
                        <span className="w-4 h-4 flex items-center justify-center font-bold text-neutral-900 dark:text-neutral-100 shrink-0">
                          ◉
                        </span>
                      ) : (
                        <span className="w-4 h-4 flex items-center justify-center text-neutral-400 dark:text-neutral-600 shrink-0">
                          ○
                        </span>
                      )}
                      <span>{stageName}</span>
                    </div>

                    <span className="text-[10px] font-mono uppercase tracking-wider">
                      {isDone ? '✓ Done' : isCurrent ? 'Running...' : 'Queued'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-5 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
          <span>Private research sandbox</span>
          <span>Chunk Target: 300–500 tokens</span>
        </div>
      </div>
    </div>
  );
};
