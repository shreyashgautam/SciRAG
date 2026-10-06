/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ResearchProvider } from './context/ResearchContext';

// Layout & Route Guards
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Pages
import { LandingPage } from './pages/Landing/LandingPage';
import { LoginPage } from './pages/Auth/LoginPage';
import { RegisterPage } from './pages/Auth/RegisterPage';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { LibraryPage } from './pages/Library/LibraryPage';
import { PaperDetailPage } from './pages/Paper/PaperDetailPage';
import { WorkspacePage } from './pages/Workspace/WorkspacePage';
import { ChatPage } from './pages/Chat/ChatPage';
import { ComparePage } from './pages/Compare/ComparePage';
import { CollectionsPage } from './pages/Collections/CollectionsPage';
import { KnowledgeGraphPage } from './pages/KnowledgeGraph/KnowledgeGraphPage';
import { InsightsPage } from './pages/Insights/InsightsPage';
import { SettingsPage } from './pages/Settings/SettingsPage';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ResearchProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Authenticated Workspace Application Shell */}
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/library" element={<LibraryPage />} />
                <Route path="/library/:paperId" element={<PaperDetailPage />} />
                <Route path="/workspace/:workspaceId" element={<WorkspacePage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/compare" element={<ComparePage />} />
                <Route path="/collections" element={<CollectionsPage />} />
                <Route path="/knowledge-graph" element={<KnowledgeGraphPage />} />
                <Route path="/insights" element={<InsightsPage />} />
                <Route path="/settings/*" element={<SettingsPage />} />
              </Route>

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ResearchProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
