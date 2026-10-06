import React from 'react';
import { ProcessingStatus } from '../../types';

interface PaperStatusProps {
  status: ProcessingStatus;
  progress?: number;
}

export const PaperStatus: React.FC<PaperStatusProps> = ({ status, progress }) => {
  switch (status) {
    case 'ready':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
          <span>Indexed</span>
        </span>
      );
    case 'chunking':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse ring-2 ring-amber-500/20" />
          <span>Chunking {progress ? `${progress}%` : ''}</span>
        </span>
      );
    case 'embedding':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse ring-2 ring-sky-500/20" />
          <span>Embedding</span>
        </span>
      );
    case 'extracting':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          <span>Extracting</span>
        </span>
      );
    case 'uploading':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-pulse" />
          <span>Uploading</span>
        </span>
      );
    case 'failed':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 ring-2 ring-rose-500/20" />
          <span>Failed</span>
        </span>
      );
    default:
      return null;
  }
};
