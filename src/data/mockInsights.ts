import { ResearchInsight, CitationTrendData } from '../types';

export const MOCK_INSIGHTS: ResearchInsight[] = [
  {
    id: 'insight-1',
    category: 'emerging_topic',
    title: 'Graph-based RAG & Community Summarization',
    description: 'Transitioning from localized chunk-level cosine similarity toward global graph-topology synthesis. Hierarchical clustering across entity relationships enables answering macro-level queries that vector search misses entirely.',
    confidence: 96,
    associatedPapers: [
      { id: 'graphrag-edge-2024', title: 'From Local to Global: A Graph RAG Approach', year: 2024 },
      { id: 'rag-survey-gao-2023', title: 'Retrieval-Augmented Generation Survey', year: 2023 }
    ],
    impactScore: 'High Growth (+142% citations/yr)'
  },
  {
    id: 'insight-2',
    category: 'research_gap',
    title: 'Limited Evaluation of Retrieval Under Adversarial & Noisy Evidence',
    description: 'Most empirical benchmarks test models with relevant passages or pure non-relevant distractor passages, leaving an unstudied vulnerability zone when candidate documents contain subtle contradictory claims or hallucinated preprints.',
    confidence: 92,
    associatedPapers: [
      { id: 'crag-yan-2024', title: 'Corrective Retrieval Augmented Generation (CRAG)', year: 2024 },
      { id: 'self-rag-asai-2023', title: 'Self-RAG: Learning to Retrieve, Generate, and Critique', year: 2024 }
    ],
    impactScore: 'Critical Gap (Under-benchmarked)'
  },
  {
    id: 'insight-3',
    category: 'method_trend',
    title: 'Hybrid Retrieval & Re-ranking Displacing Pure Vector Cosine Similarity',
    description: 'Empirical adoption of Reciprocal Rank Fusion (RRF) blending dense neural vectors (e.g., DPR, BGE) with sparse lexical signals (BM25) has risen by 68% in recent literature to recover rare technical nomenclature and acronyms.',
    confidence: 94,
    associatedPapers: [
      { id: 'rag-survey-gao-2023', title: 'Retrieval-Augmented Generation Survey', year: 2023 },
      { id: 'dpr-karpukhin-2020', title: 'Dense Passage Retrieval for Open-Domain QA', year: 2020 }
    ],
    impactScore: 'Standardized Practice'
  },
  {
    id: 'insight-4',
    category: 'emerging_topic',
    title: 'Adaptive Self-Reflection Over Continuous Retrieval Schedules',
    description: 'Replacing rigid top-k retrieval schedules with dynamic threshold tokens ([Retrieve], [IsREL], [IsSUP]), reducing inference token overhead while preventing context pollution.',
    confidence: 89,
    associatedPapers: [
      { id: 'self-rag-asai-2023', title: 'Self-RAG', year: 2024 },
      { id: 'rag-lewis-2020', title: 'Retrieval-Augmented Generation for NLP Tasks', year: 2020 }
    ],
    impactScore: 'Active Frontier'
  }
];

export const MOCK_CITATION_TRENDS: CitationTrendData[] = [
  { year: 2020, citations: 420, ragPapers: 35, hybridPapers: 12 },
  { year: 2021, citations: 1150, ragPapers: 98, hybridPapers: 34 },
  { year: 2022, citations: 2980, ragPapers: 240, hybridPapers: 86 },
  { year: 2023, citations: 7420, ragPapers: 680, hybridPapers: 275 },
  { year: 2024, citations: 14800, ragPapers: 1450, hybridPapers: 720 },
  { year: 2025, citations: 21900, ragPapers: 2100, hybridPapers: 1240 }
];
