import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Send,
  Layers,
  ChevronDown,
  ShieldCheck,
  FileText,
  RotateCcw,
  BookOpen,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  ArrowUpRight,
  CheckCircle2,
  Cpu,
  Info,
  Maximize2
} from 'lucide-react';
import { useResearch } from '../../context/ResearchContext';
import { getChatSessions, askResearchQuestion } from '../../services/chatService';
import { getPapers } from '../../services/paperService';
import { ChatMessage, Paper, Citation } from '../../types';

export const ChatPage: React.FC = () => {
  const {
    selectedScopePaperIds,
    togglePaperInScope,
    clearScope,
    activeCitation,
    setActiveCitation,
    setEvidencePanelOpen
  } = useResearch();

  const navigate = useNavigate();
  const [papers, setPapers] = useState<Paper[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [isScopeMenuOpen, setIsScopeMenuOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getPapers().then(setPapers);
    getChatSessions().then((sessions) => {
      if (sessions.length > 0) {
        setMessages(sessions[0].messages);
      }
    });
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAsking]);

  const handleSend = async (questionText?: string) => {
    const q = (questionText || inputQuestion).trim();
    if (!q || isAsking) return;

    setInputQuestion('');
    setIsAsking(true);

    const optimisticUserMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: q,
      scopePapers: selectedScopePaperIds
    };
    setMessages((prev) => [...prev, optimisticUserMsg]);

    try {
      const { assistantMessage } = await askResearchQuestion(
        'session-rag-mechanisms',
        q,
        selectedScopePaperIds
      );
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      // error handling
    } finally {
      setIsAsking(false);
    }
  };

  const handleCitationClick = (citation: Citation) => {
    setActiveCitation(citation);
    setEvidencePanelOpen(true);
  };

  const handleSlideToPaper = (citation: Citation) => {
    navigate(
      `/library/${citation.paperId}?cite=${citation.id}&page=${citation.page}&section=${encodeURIComponent(citation.section)}`
    );
  };

  const suggestedQuestions = [
    'How does retrieval augmentation reduce hallucination in neural models?',
    'What happens when retrieved documents contain conflicting noise?',
    'Why is dense vector similarity insufficient for global corpus summarization?'
  ];

  // Helper to render citation chips in text
  const renderMessageContent = (msg: ChatMessage) => {
    if (msg.sender === 'user') {
      return (
        <p className="font-medium text-xs sm:text-sm leading-relaxed text-neutral-900 dark:text-neutral-100">
          {msg.content}
        </p>
      );
    }

    // Split by citation markers like [1], [2], [3]
    const parts = msg.content.split(/(\[\d+\])/g);

    return (
      <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
        <p className="text-neutral-800 dark:text-neutral-200">
          {parts.map((part, i) => {
            const match = part.match(/\[(\d+)\]/);
            if (match && msg.citations) {
              const citeNum = parseInt(match[1], 10);
              const foundCite = msg.citations.find((c) => c.number === citeNum);
              if (foundCite) {
                const isActive = activeCitation?.id === foundCite.id;
                return (
                  <button
                    key={i}
                    onClick={() => handleCitationClick(foundCite)}
                    className={`inline-flex items-center px-1.5 py-0.5 mx-0.5 text-[11px] font-mono font-bold rounded transition-all cursor-pointer border ${
                      isActive
                        ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 border-neutral-900 dark:border-neutral-100 scale-105 shadow-xs'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    }`}
                    title={`Source #${citeNum}: ${foundCite.paperTitle} (Page ${foundCite.page})`}
                  >
                    [{citeNum}]
                  </button>
                );
              }
            }
            return <span key={i}>{part}</span>;
          })}
        </p>

        {/* Verified Citations Section attached under assistant answer */}
        {msg.citations && msg.citations.length > 0 && (
          <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-neutral-500">
              <span className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Verified Citations</span>
              </span>
              <span className="text-neutral-400">Click to inspect or slide to page</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {msg.citations.map((cite) => {
                const isActive = activeCitation?.id === cite.id;
                return (
                  <div
                    key={cite.id}
                    className={`p-3 rounded-xl border transition-all text-left flex flex-col justify-between ${
                      isActive
                        ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-100 dark:bg-neutral-800 shadow-xs'
                        : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-600'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                        <span className="font-bold text-neutral-900 dark:text-neutral-100">
                          [{cite.number}] {cite.authors}
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold px-1.5 py-0.2 rounded bg-emerald-500/10">
                          {cite.relevanceScore}% rel
                        </span>
                      </div>

                      <p className="text-[11px] font-semibold text-neutral-800 dark:text-neutral-200 line-clamp-1 mb-1">
                        {cite.paperTitle}
                      </p>

                      <div className="text-[10px] text-neutral-500 font-mono flex items-center justify-between">
                        <span>Page {cite.page}</span>
                        <span className="truncate max-w-[120px] text-neutral-400">
                          {cite.section.split(':')[0]}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center gap-1.5">
                      <button
                        onClick={() => handleCitationClick(cite)}
                        className="flex-1 py-1 px-2 text-[10px] font-medium rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors text-center cursor-pointer"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => handleSlideToPaper(cite)}
                        className="flex-1 py-1 px-2 text-[10px] font-semibold rounded-md bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:opacity-90 transition-opacity flex items-center justify-center gap-1 cursor-pointer"
                        title="Slide directly to verified passage in Paper Viewer"
                      >
                        <span>Open Viewer</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const scopeCount = selectedScopePaperIds.length;

  return (
    <div className="flex flex-col h-[calc(100vh-6.2rem)] max-w-5xl mx-auto space-y-3">
      {/* Scope Selector Header & Grounded Mode Badge */}
      <div className="p-3 sm:p-3.5 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 text-xs flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
              Research Copilot — Active Scope ({scopeCount} Papers)
            </h1>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-mono text-[10px] font-bold">
            <ShieldCheck className="w-3 h-3" />
            <span>Grounded Mode</span>
          </div>
        </div>

        <div className="relative flex items-center gap-2">
          <button
            onClick={() => setIsScopeMenuOpen(!isScopeMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-xs cursor-pointer font-medium"
          >
            <Layers className="w-3.5 h-3.5 text-neutral-500" />
            <span>Modify Papers</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>

          {selectedScopePaperIds.length > 0 && (
            <button
              onClick={clearScope}
              className="text-[11px] text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 underline cursor-pointer"
            >
              Reset
            </button>
          )}

          {/* Scope Dropdown Menu */}
          {isScopeMenuOpen && (
            <div className="absolute right-0 top-9 z-30 w-72 max-h-72 overflow-y-auto bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-2 space-y-1">
              <div className="text-[10px] font-mono uppercase text-neutral-400 px-2 py-1">
                Toggle Papers in Active Scope
              </div>
              {papers.map((p) => {
                const inScope = selectedScopePaperIds.includes(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => togglePaperInScope(p.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      inScope
                        ? 'bg-neutral-100 dark:bg-neutral-800 font-medium text-neutral-950 dark:text-neutral-50'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                    }`}
                  >
                    <span className="truncate pr-2">{p.title}</span>
                    <span className="text-[10px] font-mono">{inScope ? '✓' : '+'}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Messages Timeline */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-5 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 space-y-5">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            {/* Message Sender & Timestamp Header */}
            <div className="flex items-center gap-2 mb-1 px-1">
              {msg.sender === 'user' ? (
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-neutral-500">
                  Researcher Inquired
                </span>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-neutral-900 dark:text-neutral-100">
                    Evidence-Grounded Synthesis
                  </span>
                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-400">
                    RAG-Token
                  </span>
                </div>
              )}
              <span className="text-[10px] text-neutral-400 font-mono">{msg.timestamp}</span>
            </div>

            {/* Message Bubble Card */}
            <div
              className={`w-full max-w-3xl rounded-xl p-4 sm:p-5 transition-all ${
                msg.sender === 'user'
                  ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 ml-auto'
                  : 'bg-neutral-50/70 dark:bg-neutral-950/70 border border-neutral-200 dark:border-neutral-800/90 text-neutral-900 dark:text-neutral-100 shadow-2xs'
              }`}
            >
              {renderMessageContent(msg)}
            </div>
          </motion.div>
        ))}

        {isAsking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-start"
          >
            <span className="text-[10px] font-mono uppercase text-neutral-400 mb-1">
              Synthesizing Evidence...
            </span>
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Retrieving passage chunks from FAISS vector index & re-ranking...</span>
            </div>
          </motion.div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Inquiries (Horizontally scrollable for mobile) */}
      {messages.length < 5 && (
        <div className="flex items-center gap-1.5 text-xs overflow-x-auto pb-1 no-scrollbar">
          <span className="text-[10px] font-mono text-neutral-400 uppercase mr-1 shrink-0">
            Suggested:
          </span>
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-600 text-neutral-700 dark:text-neutral-300 text-[11px] truncate max-w-sm transition-colors shrink-0 cursor-pointer shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input Composer (Mobile touch friendly) */}
      <div className="relative">
        <textarea
          rows={2}
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask your papers an evidence-grounded question (Press Enter to query)..."
          className="w-full px-4 py-3 pr-12 text-xs sm:text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-neutral-900 dark:focus:border-neutral-100 resize-none shadow-xs"
        />

        <button
          onClick={() => handleSend()}
          disabled={!inputQuestion.trim() || isAsking}
          className="absolute right-2.5 bottom-2.5 p-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200 disabled:opacity-40 transition-colors cursor-pointer"
          aria-label="Send inquiry"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
