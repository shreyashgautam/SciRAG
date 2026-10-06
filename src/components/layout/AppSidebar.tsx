import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  FolderKanban,
  Sparkles,
  GitCompare,
  Network,
  TrendingUp,
  Settings,
  Upload,
  Layers,
  LogOut,
  ChevronRight,
  X
} from 'lucide-react';
import { useResearch } from '../../context/ResearchContext';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../common/ThemeToggle';

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ isOpen, onClose }) => {
  const { selectedScopePaperIds, clearScope, setUploadModalOpen } = useResearch();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/library', label: 'Library', icon: BookOpen },
    { to: '/collections', label: 'Collections', icon: FolderKanban },
    { to: '/chat', label: 'Research Copilot', icon: Sparkles },
    { to: '/compare', label: 'Compare', icon: GitCompare },
    { to: '/knowledge-graph', label: 'Knowledge Graph', icon: Network },
    { to: '/insights', label: 'Insights', icon: TrendingUp },
    { to: '/settings', label: 'Settings', icon: Settings }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col justify-between transition-transform duration-200 ease-in-out shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top: Brand & Quick Ingest */}
        <div>
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-800">
            <NavLink to="/dashboard" className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-neutral-900 dark:bg-neutral-100 flex items-center justify-center text-white dark:text-neutral-950 font-bold text-xs tracking-tighter">
                SR
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm tracking-tight text-neutral-900 dark:text-neutral-100 leading-none">
                  SciRAG
                </span>
                <span className="text-[9px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mt-0.5">
                  Evidence Engine
                </span>
              </div>
            </NavLink>
            <button
              onClick={onClose}
              className="md:hidden p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Ingest Button */}
          <div className="p-3">
            <button
              onClick={() => {
                setUploadModalOpen(true);
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors shadow-xs cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Ingest Paper</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-1 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-neutral-50 font-semibold'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-3 h-3 opacity-30" />
                </NavLink>
              );
            })}
          </nav>

          {/* Active Research Scope Card */}
          <div className="px-3 mt-4">
            <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800/80 bg-neutral-50/70 dark:bg-neutral-950/40 text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                  <Layers className="w-3 h-3" />
                  <span>Research Scope</span>
                </div>
                {selectedScopePaperIds.length > 0 && (
                  <button
                    onClick={clearScope}
                    className="text-[10px] text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 underline"
                  >
                    Clear
                  </button>
                )}
              </div>
              <p className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                {selectedScopePaperIds.length === 0
                  ? '0 papers in active scope'
                  : `${selectedScopePaperIds.length} paper${selectedScopePaperIds.length > 1 ? 's' : ''} in active scope`}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <NavLink
                  to="/chat"
                  onClick={onClose}
                  className="text-[11px] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 underline"
                >
                  Query Copilot →
                </NavLink>
                <span className="text-neutral-300 dark:text-neutral-700">·</span>
                <NavLink
                  to="/compare"
                  onClick={onClose}
                  className="text-[11px] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 underline"
                >
                  Compare →
                </NavLink>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: User, Theme & Logout */}
        <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">Theme</span>
            <ThemeToggle compact={false} />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800/60">
            <NavLink
              to="/settings/profile"
              onClick={onClose}
              className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-80 transition-opacity"
            >
              <div className="w-7 h-7 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-xs font-semibold text-neutral-700 dark:text-neutral-300 shrink-0">
                {user.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100 truncate">
                  {user.name}
                </p>
                <p className="text-[10px] text-neutral-400 truncate font-mono">
                  {user.role}
                </p>
              </div>
            </NavLink>
            <button
              onClick={handleLogout}
              className="p-1.5 text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-md transition-colors"
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
