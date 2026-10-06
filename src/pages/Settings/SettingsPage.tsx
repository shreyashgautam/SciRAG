import React, { useState, useEffect } from 'react';
import { NavLink, Routes, Route, Navigate, Link } from 'react-router-dom';
import {
  User,
  Shield,
  Lock,
  Moon,
  Laptop,
  CheckCircle,
  Circle,
  LogOut,
  Download,
  Trash2,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { getSecuritySessions, revokeAllOtherSessions } from '../../services/authService';
import { SecuritySession } from '../../types';

export const SettingsProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user.name);
  const [affiliation, setAffiliation] = useState(user.affiliation);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name, affiliation });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          Researcher Profile
        </h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          Manage your academic affiliation and literature research profile.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-4 text-xs">
        <div className="flex items-center gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="w-14 h-14 rounded-full bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 flex items-center justify-center text-lg font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{user.name}</h3>
            <p className="text-neutral-500">{user.email}</p>
            <p className="text-[11px] font-mono text-neutral-400 mt-0.5">{user.role}</p>
          </div>
        </div>

        <div>
          <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-neutral-900 dark:focus:border-neutral-100"
          />
        </div>

        <div>
          <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Academic / Institutional Affiliation
          </label>
          <input
            type="text"
            value={affiliation}
            onChange={(e) => setAffiliation(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-neutral-900 dark:focus:border-neutral-100"
          />
        </div>

        <div>
          <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Research Interests
          </label>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {user.researchInterests.map((interest) => (
              <span
                key={interest}
                className="px-2.5 py-1 text-xs rounded-md border border-neutral-200 dark:border-neutral-800 font-mono text-neutral-600 dark:text-neutral-400"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200 text-xs font-semibold rounded-lg transition-colors"
          >
            {saved ? 'Saved Successfully' : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export const SettingsSecurity: React.FC = () => {
  const [sessions, setSessions] = useState<SecuritySession[]>([]);
  const [revoked, setRevoked] = useState(false);

  useEffect(() => {
    getSecuritySessions().then(setSessions);
  }, []);

  const handleRevokeAll = async () => {
    const updated = await revokeAllOtherSessions();
    setSessions(updated);
    setRevoked(true);
    setTimeout(() => setRevoked(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-2xl text-xs">
      <div>
        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          Account Security & Active Sessions
        </h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          Inspect device sessions, credential safeguards, and enterprise threat governance.
        </p>
      </div>

      {/* Account Security Meter */}
      <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 space-y-3">
        <div className="flex items-center justify-between font-mono">
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">
            Account Security Level
          </span>
          <span className="font-bold text-neutral-900 dark:text-neutral-100">90%</span>
        </div>

        {/* Meter progress bar */}
        <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2 overflow-hidden">
          <div className="bg-neutral-900 dark:bg-neutral-100 h-2 rounded-full w-[90%]" />
        </div>

        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-neutral-700 dark:text-neutral-300">
            <span>Password protection</span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Active</span>
            </span>
          </div>

          <div className="flex items-center justify-between text-neutral-700 dark:text-neutral-300">
            <span>Session isolation</span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Active</span>
            </span>
          </div>

          <div className="flex items-center justify-between text-neutral-700 dark:text-neutral-300">
            <span>Two-factor authentication (TOTP)</span>
            <span className="flex items-center gap-1 text-neutral-400 font-mono">
              <Circle className="w-3.5 h-3.5" />
              <span>Pending Setup</span>
            </span>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
            Active Research Sessions
          </h3>
          <span className="font-mono text-neutral-400 text-[11px]">
            {sessions.length} Authorized Devices
          </span>
        </div>

        <div className="space-y-3">
          {sessions.map((sess) => (
            <div
              key={sess.id}
              className="flex items-center justify-between p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40"
            >
              <div className="flex items-center gap-3">
                <Laptop className="w-4 h-4 text-neutral-500 shrink-0" />
                <div>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">
                    {sess.device}
                  </p>
                  <p className="text-[11px] text-neutral-500 font-mono">
                    {sess.browser} · {sess.location} ({sess.ipAddress})
                  </p>
                </div>
              </div>

              <div className="text-right font-mono text-[11px]">
                {sess.isCurrent ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    Current Device
                  </span>
                ) : (
                  <span className="text-neutral-400">{sess.lastActive}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <button
            onClick={handleRevokeAll}
            className="px-3.5 py-2 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
          >
            {revoked ? 'Revoked all other sessions' : 'Sign out all other sessions'}
          </button>
        </div>
      </div>

      {/* Security Architecture Notice & Docs Link */}
      <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50/60 dark:bg-neutral-950/40 space-y-2">
        <div className="flex items-center gap-2 font-mono uppercase text-neutral-400 text-[11px]">
          <FileText className="w-3.5 h-3.5" />
          <span>Security Governance Documentation</span>
        </div>
        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
          The Phase 1 prototype UI prepares the frontend architecture for production OAuth, JWT rotation, and argon2 password verification. In-depth technical threat models and data protection specifications are maintained in the root <code className="font-mono bg-neutral-200 dark:bg-neutral-800 px-1 py-0.5 rounded">/security</code> directory.
        </p>
      </div>
    </div>
  );
};

export const SettingsPrivacy: React.FC = () => {
  const [anonymizeQueries, setAnonymizeQueries] = useState(true);
  const [isolatedIndices, setIsolatedIndices] = useState(true);

  const handleExportData = () => {
    const exportPayload = {
      exportDate: new Date().toISOString(),
      service: 'SciRAG',
      version: '1.0-phase1',
      libraryCount: 8,
      collectionsCount: 4
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scirag_library_export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-2xl text-xs">
      <div>
        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          Data Protection & Privacy Preferences
        </h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          Configure literature confidentiality, vector index boundaries, and data export.
        </p>
      </div>

      <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
              Zero Model Training Policy
            </h3>
            <p className="text-neutral-500 text-[11px] leading-relaxed mt-0.5">
              Strictly guarantees uploaded documents, notes, and research copilot queries are never ingested into training corpuses.
            </p>
          </div>
          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold shrink-0">
            Enforced
          </span>
        </div>

        <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
              Anonymize Retrieval Traces
            </h3>
            <p className="text-neutral-500 text-[11px] leading-relaxed mt-0.5">
              Strip identifiable researcher user IDs from vector similarity query telemetry.
            </p>
          </div>
          <input
            type="checkbox"
            checked={anonymizeQueries}
            onChange={(e) => setAnonymizeQueries(e.target.checked)}
            className="mt-1 cursor-pointer"
          />
        </div>

        <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
              Isolated Vector Namespaces
            </h3>
            <p className="text-neutral-500 text-[11px] leading-relaxed mt-0.5">
              Retain hard multi-tenant isolation across all chunked FAISS vector indices.
            </p>
          </div>
          <input
            type="checkbox"
            checked={isolatedIndices}
            onChange={(e) => setIsolatedIndices(e.target.checked)}
            className="mt-1 cursor-pointer"
          />
        </div>
      </div>

      {/* Export & Deletion */}
      <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 space-y-3">
        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
          Corpus Portability & Erasure
        </h3>
        <p className="text-neutral-500 leading-relaxed">
          Export your complete library metadata, citation graph relations, and synthesis notes in standard JSON format.
        </p>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleExportData}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 font-medium transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Library JSON</span>
          </button>

          <button
            onClick={() => alert('Account deletion workflow initialized in test mode.')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Research Corpus</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const SettingsPage: React.FC = () => {
  const navTabs = [
    { to: '/settings/profile', label: 'Profile', icon: User },
    { to: '/settings/security', label: 'Security & Sessions', icon: Shield },
    { to: '/settings/privacy', label: 'Privacy & Data', icon: Lock }
  ];

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          Settings & Governance
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Manage identity, authentication guards, security policies, and workspace privacy.
        </p>
      </div>

      {/* Subnav Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2 text-xs">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-neutral-50 font-semibold'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
                }`
              }
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </NavLink>
          );
        })}
      </div>

      <Routes>
        <Route path="/" element={<Navigate to="/settings/profile" replace />} />
        <Route path="profile" element={<SettingsProfile />} />
        <Route path="security" element={<SettingsSecurity />} />
        <Route path="privacy" element={<SettingsPrivacy />} />
      </Routes>
    </div>
  );
};
