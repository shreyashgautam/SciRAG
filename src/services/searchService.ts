import { Paper } from '../types';
import { MOCK_PAPERS } from '../data/mockPapers';
import { apiClient } from './apiClient';

export interface SearchResult {
  paper: Paper;
  similarityScore: number;
  highlightPassage: string;
  matchedField: 'title' | 'abstract' | 'section';
}

export const searchResearch = async (query: string): Promise<SearchResult[]> => {
  try {
    const res = await apiClient.get<any>(`/search?q=${encodeURIComponent(query)}&mode=hybrid`);
    if (res && res.results && res.results.length > 0) {
      return res.results.map((r: any) => {
        const foundPaper = MOCK_PAPERS.find((p) => p.id === r.paper_id) || {
          ...MOCK_PAPERS[0],
          id: r.paper_id,
          title: r.paper_title
        };
        return {
          paper: foundPaper,
          similarityScore: Math.round(r.score * 100),
          highlightPassage: r.text.slice(0, 180) + '...',
          matchedField: 'section'
        };
      });
    }
  } catch {
    // Local fallback
  }

  await new Promise((r) => setTimeout(r, 120));
  if (!query.trim()) {
    return MOCK_PAPERS.slice(0, 4).map((p, idx) => ({
      paper: p,
      similarityScore: 95 - idx * 3,
      highlightPassage: p.abstract.slice(0, 180) + '...',
      matchedField: 'abstract'
    }));
  }

  const q = query.toLowerCase();
  const results: SearchResult[] = [];

  for (const paper of MOCK_PAPERS) {
    let score = 0;
    let highlight = paper.abstract.slice(0, 180) + '...';
    let field: 'title' | 'abstract' | 'section' = 'abstract';

    if (paper.title.toLowerCase().includes(q)) {
      score = 96;
      field = 'title';
      highlight = paper.title;
    } else if (paper.tags.some((t) => t.toLowerCase().includes(q))) {
      score = 92;
      highlight = `Tagged with ${paper.tags.join(', ')}`;
    } else if (paper.abstract.toLowerCase().includes(q)) {
      score = 88;
      field = 'abstract';
      const idx = paper.abstract.toLowerCase().indexOf(q);
      const start = Math.max(0, idx - 40);
      highlight = '...' + paper.abstract.slice(start, start + 160) + '...';
    } else if (paper.sections?.some((s) => s.content.toLowerCase().includes(q))) {
      score = 84;
      field = 'section';
      const sec = paper.sections.find((s) => s.content.toLowerCase().includes(q))!;
      highlight = `In ${sec.title}: ` + sec.content.slice(0, 150) + '...';
    } else {
      // Background semantic relevance heuristic
      const words = q.split(/\s+/).filter(Boolean);
      const matched = words.filter((w) => paper.abstract.toLowerCase().includes(w) || paper.title.toLowerCase().includes(w));
      if (matched.length > 0) {
        score = Math.min(85, 60 + matched.length * 10);
      }
    }

    if (score > 60) {
      results.push({
        paper,
        similarityScore: score,
        highlightPassage: highlight,
        matchedField: field
      });
    }
  }

  // Sort by highest similarity
  return results.sort((a, b) => b.similarityScore - a.similarityScore);
};
