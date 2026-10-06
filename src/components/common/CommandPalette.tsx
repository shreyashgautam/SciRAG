import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  FileText, 
  MessageSquare, 
  GitCompare, 
  Folder, 
  Network, 
  TrendingUp, 
  Settings, 
  Upload, 
  Moon, 
  Sun,
  X,
  ArrowRight
} from 'lucide-react';
import { useResearch } from '../../context/ResearchContext';
import { useTheme } from '../../context/ThemeContext';
import { MOCK_PAPERS } from '../../data/mockPapers';

export const CommandPalette: React.FC = () => {
  const { isCommandPaletteOpen, setCommandPaletteOpen, setUploadModalOpen } = useResearch();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isCommandPaletteOpen]);

  const navigationCommands = useMemo(() => [
    { id: 'nav-dash', label: 'Go to Dashboard', icon: TrendingUp, action: () => navigate('/dashboard') },
    { id: 'nav-lib', label: 'Open Research Library', icon: FileText, action: () => navigate('/library') },
    { id: 'nav-chat', label: 'Ask Research Copilot', icon: MessageSquare, action: () => navigate('/chat') },
    { id: 'nav-compare', label: 'Compare Methodologies', icon: GitCompare, action: () => navigate('/compare') },
    { id: 'nav-collections', label: 'Browse Collections', icon: Folder, action: () => navigate('/collections') },
    { id: 'nav-graph', label: 'Explore Knowledge Graph', icon: Network, action: () => navigate('/knowledge-graph') },
    { id: 'nav-insights', label: 'View Research Insights', icon: TrendingUp, action: () => navigate('/insights') },
    { id: 'nav-settings', label: 'Security & Settings', icon: Settings, action: () => navigate('/settings') },
    { 
      id: 'act-upload', 
      label: 'Upload Research Paper (PDF)', 
      icon: Upload, 
      action: () => { setUploadModalOpen(true); } 
    },
    { 
      id: 'act-theme', 
      label: `Switch Theme (Currently ${theme})`, 
      icon: theme === 'dark' ? Sun : Moon, 
      action: () => setTheme(theme === 'dark' ? 'light' : 'dark') 
    }
  ], [navigate, theme, setTheme, setUploadModalOpen]);

  const filteredPapers = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return MOCK_PAPERS.filter(
      (p) => p.title.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q))
    ).slice(0, 5);
  }, [query]);

  const filteredCommands = useMemo(() => {
    if (!query.trim()) return navigationCommands;
    const q = query.toLowerCase();
    return navigationCommands.filter((cmd) => cmd.label.toLowerCase().includes(q));
  }, [query, navigationCommands]);

  const totalItems = filteredCommands.length + filteredPapers.length;

  const handleSelect = (index: number) => {
    if (index < filteredCommands.length) {
      filteredCommands[index].action();
    } else {
      const paperIndex = index - filteredCommands.length;
      const paper = filteredPapers[paperIndex];
      if (paper) {
        navigate(`/library/${paper.id}`);
      }
    }
    setCommandPaletteOpen(false);
  };

  useEffect(() => {
    if (!isCommandPaletteOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, totalItems));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + Math.max(1, totalItems)) % Math.max(1, totalItems));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (totalItems > 0) {
          handleSelect(selectedIndex);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, totalItems, selectedIndex, filteredCommands, filteredPapers]);

  if (!isCommandPaletteOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-xs"
      onClick={() => setCommandPaletteOpen(false)}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
          <Search className="w-4 h-4 text-neutral-400 mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search literature..."
            className="w-full bg-transparent text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden"
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
            aria-label="Close command palette"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredPapers.length > 0 && (
            <div className="px-2 py-1.5 text-[11px] font-mono uppercase tracking-wider text-neutral-400">
              Matched Literature
            </div>
          )}
          {filteredPapers.map((paper, idx) => {
            const itemIndex = idx + filteredCommands.length;
            const isSelected = selectedIndex === itemIndex;
            return (
              <div
                key={paper.id}
                onClick={() => handleSelect(itemIndex)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-xs transition-colors ${
                  isSelected
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-neutral-50'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <FileText className="w-4 h-4 text-neutral-400 shrink-0" />
                  <span className="truncate font-medium">{paper.title}</span>
                </div>
                <span className="text-[11px] font-mono text-neutral-400 shrink-0">
                  {paper.year}
                </span>
              </div>
            );
          })}

          <div className="px-2 py-1.5 text-[11px] font-mono uppercase tracking-wider text-neutral-400">
            Navigation & Actions
          </div>
          {filteredCommands.map((cmd, idx) => {
            const isSelected = selectedIndex === idx;
            const Icon = cmd.icon;
            return (
              <div
                key={cmd.id}
                onClick={() => handleSelect(idx)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-xs transition-colors ${
                  isSelected
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-neutral-50'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-neutral-400" />
                  <span className="font-medium">{cmd.label}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400 opacity-60" />
              </div>
            );
          })}

          {totalItems === 0 && (
            <div className="py-8 text-center text-xs text-neutral-400">
              No matching commands or papers found.
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-3 py-2 bg-neutral-50 dark:bg-neutral-950/60 border-t border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-400">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
          <span className="font-mono">⌘K</span>
        </div>
      </div>
    </div>
  );
};
