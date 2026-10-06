import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { resolvedTheme, toggleTheme } = useTheme();

  const isDark = resolvedTheme === 'dark';

  if (compact) {
    return (
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
        title={`Click to switch to ${isDark ? 'light' : 'dark'} mode`}
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
        ) : (
          <Moon className="w-4 h-4 text-neutral-700 hover:-rotate-12 transition-transform" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100/80 dark:bg-neutral-900/80 hover:bg-neutral-200/90 dark:hover:bg-neutral-800 transition-all text-xs font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer group"
      title={`Click to switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-label="Toggle theme mode"
    >
      <div className="flex items-center gap-2">
        {isDark ? (
          <>
            <Moon className="w-3.5 h-3.5 text-neutral-300 group-hover:text-amber-400 transition-colors" />
            <span className="text-xs">Dark Theme</span>
          </>
        ) : (
          <>
            <Sun className="w-3.5 h-3.5 text-amber-500 group-hover:rotate-45 transition-transform" />
            <span className="text-xs">Light Theme</span>
          </>
        )}
      </div>

      {/* 1-Click Toggle Switch Pill */}
      <div
        className={`w-7 h-4 flex items-center rounded-full p-0.5 transition-colors ${
          isDark ? 'bg-neutral-700' : 'bg-neutral-300'
        }`}
      >
        <div
          className={`bg-white dark:bg-neutral-100 w-3 h-3 rounded-full shadow-xs transform transition-transform duration-200 ${
            isDark ? 'translate-x-3' : 'translate-x-0'
          }`}
        />
      </div>
    </button>
  );
};
