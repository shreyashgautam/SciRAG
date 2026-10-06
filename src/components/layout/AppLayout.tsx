import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { EvidencePanel } from '../citations/EvidencePanel';
import { CommandPalette } from '../common/CommandPalette';
import { UploadModal } from '../papers/UploadModal';

export const AppLayout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col md:flex-row antialiased">
      {/* Sidebar */}
      <AppSidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <AppHeader onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Overlays */}
      <EvidencePanel />
      <CommandPalette />
      <UploadModal />
    </div>
  );
};
