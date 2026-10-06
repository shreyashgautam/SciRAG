import React, { useState, useEffect } from 'react';
import { GitCompare, Download, Plus, X, Layers, Check } from 'lucide-react';
import { getPapers } from '../../services/paperService';
import { Paper } from '../../types';
import { useResearch } from '../../context/ResearchContext';

export const ComparePage: React.FC = () => {
  const { selectedScopePaperIds, togglePaperInScope } = useResearch();
  const [allPapers, setAllPapers] = useState<Paper[]>([]);
  const [comparePaperIds, setComparePaperIds] = useState<string[]>([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  useEffect(() => {
    getPapers().then((papers) => {
      setAllPapers(papers);
      // Initialize with active scope papers or first 2 papers
      if (selectedScopePaperIds.length >= 2) {
        setComparePaperIds(selectedScopePaperIds.slice(0, 4));
      } else {
        setComparePaperIds([papers[0]?.id, papers[1]?.id].filter(Boolean));
      }
    });
  }, [selectedScopePaperIds]);

  const comparedPapers = allPapers.filter((p) => comparePaperIds.includes(p.id));

  const removePaper = (id: string) => {
    setComparePaperIds((prev) => prev.filter((pId) => pId !== id));
  };

  const addPaper = (id: string) => {
    if (comparePaperIds.length < 4 && !comparePaperIds.includes(id)) {
      setComparePaperIds((prev) => [...prev, id]);
    }
    setIsPickerOpen(false);
  };

  const comparisonRows = [
    { key: 'problem', label: 'Research Problem', render: (p: Paper) => p.summary?.researchProblem || 'Problem definition' },
    { key: 'methodology', label: 'Methodology & Architecture', render: (p: Paper) => p.summary?.methodology || 'Methodology' },
    { key: 'dataset', label: 'Datasets & Benchmarks', render: (p: Paper) => p.summary?.dataset || 'Datasets' },
    { key: 'model', label: 'Underlying Generator Model', render: (p: Paper) => p.tags.find((t) => ['BART', 'Transformer', 'LLM', 'Self-RAG', 'CRAG'].includes(t)) || 'Foundation Model' },
    { key: 'results', label: 'Key Empirical Results', render: (p: Paper) => p.summary?.results || 'Empirical findings' },
    { key: 'limitations', label: 'Identified Limitations', render: (p: Paper) => p.summary?.limitations || 'Limitations' },
    { key: 'futureWork', label: 'Future Research Directions', render: (p: Paper) => p.summary?.futureWork || 'Future Work' }
  ];

  const handleExportMatrix = () => {
    const textData = comparedPapers
      .map((p) => `${p.title} (${p.year})\nProblem: ${p.summary?.researchProblem}\nMethod: ${p.summary?.methodology}\n`)
      .join('\n---\n');
    const blob = new Blob([textData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'paper_comparison_matrix.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-1">
            <GitCompare className="w-3.5 h-3.5" />
            <span>CROSS-LITERATURE BENCHMARK</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Methodology Comparison Matrix
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Compare hypotheses, datasets, architectures, and empirical findings across up to 4 papers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {comparePaperIds.length < 4 && (
            <div className="relative">
              <button
                onClick={() => setIsPickerOpen(!isPickerOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Paper to Matrix</span>
              </button>

              {isPickerOpen && (
                <div className="absolute right-0 top-9 z-30 w-72 max-h-72 overflow-y-auto bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-2 space-y-1">
                  <div className="text-[10px] font-mono uppercase text-neutral-400 px-2 py-1">
                    Select Paper
                  </div>
                  {allPapers
                    .filter((p) => !comparePaperIds.includes(p.id))
                    .map((p) => (
                      <button
                        key={p.id}
                        onClick={() => addPaper(p.id)}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 truncate"
                      >
                        {p.title} ({p.year})
                      </button>
                    ))}
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleExportMatrix}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Matrix</span>
          </button>
        </div>
      </div>

      {comparedPapers.length < 2 ? (
        <div className="p-12 text-center border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900">
          <GitCompare className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
            Select At Least 2 Papers
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-4">
            Add papers to compare their research problems, methodologies, and benchmarks side-by-side.
          </p>
          <button
            onClick={() => {
              if (allPapers.length >= 2) {
                setComparePaperIds([allPapers[0].id, allPapers[1].id]);
              }
            }}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
          >
            Load Sample Comparison
          </button>
        </div>
      ) : (
        /* Comparison Table */
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 overflow-x-auto shadow-xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-950/50">
                <th className="py-4 px-4 w-48 font-mono text-[11px] uppercase tracking-wider text-neutral-400 shrink-0">
                  Dimension
                </th>
                {comparedPapers.map((paper) => (
                  <th key={paper.id} className="py-4 px-4 min-w-[260px] align-top">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 leading-snug">
                          {paper.title}
                        </h4>
                        <p className="text-[11px] text-neutral-500 font-normal mt-1">
                          {paper.authors[0]?.name} et al. · {paper.venue} ({paper.year})
                        </p>
                      </div>
                      <button
                        onClick={() => removePaper(paper.id)}
                        className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded"
                        title="Remove paper from comparison"
                        aria-label="Remove paper"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {comparisonRows.map((row) => (
                <tr key={row.key} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20">
                  <td className="py-3.5 px-4 font-mono text-[11px] uppercase tracking-wider text-neutral-500 font-medium bg-neutral-50/30 dark:bg-neutral-950/30 align-top">
                    {row.label}
                  </td>
                  {comparedPapers.map((paper) => (
                    <td key={paper.id} className="py-3.5 px-4 text-neutral-700 dark:text-neutral-300 leading-relaxed align-top">
                      {row.render(paper)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
