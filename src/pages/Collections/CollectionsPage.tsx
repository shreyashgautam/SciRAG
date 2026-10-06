import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Folder, Plus, ArrowRight, X, Layers, BookOpen } from 'lucide-react';
import { MOCK_COLLECTIONS } from '../../data/mockCollections';
import { getPapers } from '../../services/paperService';
import { Collection, Paper } from '../../types';
import { PaperCard } from '../../components/papers/PaperCard';

export const CollectionsPage: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>(MOCK_COLLECTIONS);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  // New collection form state
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTags, setNewTags] = useState('Research, Synthesis');

  useEffect(() => {
    getPapers().then(setPapers);
  }, []);

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newCol: Collection = {
      id: `col-${Date.now()}`,
      name: newName,
      description: newDesc || 'Custom research literature group.',
      paperCount: 0,
      lastUpdated: 'Just now',
      tags: newTags.split(',').map((t) => t.trim()).filter(Boolean),
      color: 'neutral'
    };

    setCollections([newCol, ...collections]);
    setNewName('');
    setNewDesc('');
    setCreateModalOpen(false);
  };

  const activeCollection = collections.find((c) => c.id === selectedCollectionId);
  const filteredPapers = selectedCollectionId
    ? papers.filter((p) => p.collections.includes(selectedCollectionId))
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-1">
            <Folder className="w-3.5 h-3.5" />
            <span>CORPUS TAXONOMY</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Research Collections
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Curate literature groups for thesis projects, grants, and topic-specific copilot inquiries.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Collection</span>
        </button>
      </div>

      {/* Selected Collection Banner (if clicked) */}
      {activeCollection && (
        <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
              <span>Filtering by Collection:</span>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">{activeCollection.name}</span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">{activeCollection.description}</p>
          </div>
          <button
            onClick={() => setSelectedCollectionId(null)}
            className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 underline"
          >
            Show All Collections
          </button>
        </div>
      )}

      {/* Collection Grid */}
      {!selectedCollectionId ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {collections.map((col) => (
            <div
              key={col.id}
              onClick={() => setSelectedCollectionId(col.id)}
              className="p-5 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-700 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-2 font-mono">
                <span>{col.paperCount} Papers</span>
                <span className="text-[11px]">Updated {col.lastUpdated}</span>
              </div>

              <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 group-hover:underline mb-2">
                {col.name}
              </h3>

              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                {col.description}
              </p>

              {/* Zero-pill tags */}
              <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800/80 text-[11px]">
                <div className="flex items-center gap-1.5 font-mono text-neutral-400">
                  {col.tags.map((tag, idx) => (
                    <React.Fragment key={tag}>
                      {idx > 0 && <span>/</span>}
                      <span>{tag}</span>
                    </React.Fragment>
                  ))}
                </div>

                <span className="font-semibold text-neutral-900 dark:text-neutral-100 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  <span>Browse Papers</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Papers in Collection */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider font-mono text-neutral-500">
              Papers in {activeCollection?.name || 'Collection'} ({filteredPapers.length})
            </h3>
            <Link
              to="/chat"
              className="text-xs text-neutral-900 dark:text-neutral-100 font-semibold underline"
            >
              Query This Collection in Copilot →
            </Link>
          </div>

          {filteredPapers.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900">
              <p className="text-xs text-neutral-400">No papers added to this collection yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPapers.map((paper) => (
                <PaperCard key={paper.id} paper={paper} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create Collection Modal */}
      {isCreateModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setCreateModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800 mb-4">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Create Research Collection
              </h2>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCollection} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Collection Name
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Graph-based RAG 2025"
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-neutral-900 dark:focus:border-neutral-100"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Description & Research Scope
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe the research objective or literature scope..."
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-neutral-900 dark:focus:border-neutral-100 resize-none"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Comma-separated Tags
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="RAG, Evaluation, Graph"
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-neutral-900 dark:focus:border-neutral-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 font-semibold"
                >
                  Create Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
