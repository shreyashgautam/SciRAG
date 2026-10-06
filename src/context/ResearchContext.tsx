import React, { createContext, useContext, useEffect, useState } from 'react';
import { Citation } from '../types';

interface ResearchContextType {
  selectedScopePaperIds: string[];
  togglePaperInScope: (paperId: string) => void;
  setScopePapers: (paperIds: string[]) => void;
  clearScope: () => void;
  activeCitation: Citation | null;
  setActiveCitation: (citation: Citation | null) => void;
  isEvidencePanelOpen: boolean;
  setEvidencePanelOpen: (open: boolean) => void;
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  isUploadModalOpen: boolean;
  setUploadModalOpen: (open: boolean) => void;
}

const ResearchContext = createContext<ResearchContextType | undefined>(undefined);

export const ResearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedScopePaperIds, setSelectedScopePaperIds] = useState<string[]>([]);
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);
  const [isEvidencePanelOpen, setEvidencePanelOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setUploadModalOpen] = useState<boolean>(false);

  // Global keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
        setEvidencePanelOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const togglePaperInScope = (paperId: string) => {
    setSelectedScopePaperIds((prev) =>
      prev.includes(paperId) ? prev.filter((id) => id !== paperId) : [...prev, paperId]
    );
  };

  const setScopePapers = (paperIds: string[]) => {
    setSelectedScopePaperIds(paperIds);
  };

  const clearScope = () => {
    setSelectedScopePaperIds([]);
  };

  return (
    <ResearchContext.Provider
      value={{
        selectedScopePaperIds,
        togglePaperInScope,
        setScopePapers,
        clearScope,
        activeCitation,
        setActiveCitation: (citation) => {
          setActiveCitation(citation);
          if (citation) setEvidencePanelOpen(true);
        },
        isEvidencePanelOpen,
        setEvidencePanelOpen,
        isCommandPaletteOpen,
        setCommandPaletteOpen,
        isUploadModalOpen,
        setUploadModalOpen
      }}
    >
      {children}
    </ResearchContext.Provider>
  );
};

export const useResearch = () => {
  const context = useContext(ResearchContext);
  if (!context) {
    throw new Error('useResearch must be used within a ResearchProvider');
  }
  return context;
};
