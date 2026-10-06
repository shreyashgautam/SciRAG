import React from 'react';
import { Menu, Search, Layers, Upload } from 'lucide-react';
import { useResearch } from '../../context/ResearchContext';
import { ThemeToggle } from '../common/ThemeToggle';

interface AppHeaderProps {
  onToggleSidebar: () => void;
  title?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onToggleSidebar, title }) => {
  const { setCommandPaletteOpen, selectedScopePaperIds, setUploadModalOpen } = useResearch();

  return (
    <header className="sticky top-0 z-30 h-14 bg-white/85 dark:bg-neutral-900/85 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-4 md:px-6 flex items-center justify-between gap-4">
      {/* Zone 1: Mobile toggle & Breadcrumb/Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-1.5 -ml-1 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {title ? (
          <h1 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
            {title}
          </h1>
        ) : (
          <div className="text-xs text-neutral-500 font-mono hidden sm:flex items-center gap-1.5">
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">SciRAG</span>
            <span aria-hidden="true">/</span>
            <span className="text-neutral-600 dark:text-neutral-400">Workspace</span>
          </div>
        )}
      </div>

      {/* Zone 2: Command Search Bar */}
      <div className="flex-1 max-w-md hidden md:block">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/60 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5" />
            <span>Search research literature or run command...</span>
          </div>
          <kbd className="px-1.5 py-0.5 rounded-sm bg-neutral-200 dark:bg-neutral-800 font-mono text-[10px] text-neutral-600 dark:text-neutral-400">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Zone 3: Scope Indicator & Primary Actions */}
      <div className="flex items-center gap-2">
        {/* Mobile search trigger */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="md:hidden p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
          aria-label="Search literature"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Scope Pill/Counter */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-neutral-600 dark:text-neutral-400 font-mono"
          title="Active research scope"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{selectedScopePaperIds.length} in scope</span>
        </button>

        <ThemeToggle compact={true} />

        <button
          onClick={() => setUploadModalOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Ingest</span>
        </button>
      </div>
    </header>
  );
};
