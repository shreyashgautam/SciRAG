import { KnowledgeGraphData } from '../types';

export const MOCK_GRAPH_DATA: KnowledgeGraphData = {
  nodes: [
    // Papers
    { id: 'p-lewis-2020', label: 'RAG (Lewis 2020)', type: 'paper', paperId: 'rag-lewis-2020', x: 420, y: 260 },
    { id: 'p-gao-2023', label: 'RAG Survey (Gao 2023)', type: 'paper', paperId: 'rag-survey-gao-2023', x: 620, y: 160 },
    { id: 'p-asai-2024', label: 'Self-RAG (Asai 2024)', type: 'paper', paperId: 'self-rag-asai-2023', x: 260, y: 410 },
    { id: 'p-yan-2024', label: 'CRAG (Yan 2024)', type: 'paper', paperId: 'crag-yan-2024', x: 580, y: 390 },
    { id: 'p-edge-2024', label: 'Graph RAG (Edge 2024)', type: 'paper', paperId: 'graphrag-edge-2024', x: 740, y: 320 },
    { id: 'p-karpukhin-2020', label: 'DPR (Karpukhin 2020)', type: 'paper', paperId: 'dpr-karpukhin-2020', x: 250, y: 180 },
    { id: 'p-vaswani-2017', label: 'Attention (Vaswani 2017)', type: 'paper', paperId: 'attention-vaswani-2017', x: 120, y: 120 },
    { id: 'p-borgeaud-2022', label: 'RETRO (Borgeaud 2022)', type: 'paper', paperId: 'retro-borgeaud-2022', x: 440, y: 480 },

    // Methods
    { id: 'm-dense-retrieval', label: 'Dense Passage Retrieval', type: 'method', x: 340, y: 220 },
    { id: 'm-reflection-tokens', label: 'Reflection Critique Tokens', type: 'method', x: 170, y: 360 },
    { id: 'm-leiden', label: 'Leiden Community Detection', type: 'method', x: 860, y: 360 },
    { id: 'm-reranking', label: 'Cross-Encoder Re-ranking', type: 'method', x: 660, y: 250 },
    { id: 'm-self-attention', label: 'Scaled Dot-Product Attention', type: 'method', x: 90, y: 240 },

    // Concepts
    { id: 'c-hallucination', label: 'Hallucination Mitigation', type: 'concept', x: 440, y: 130 },
    { id: 'c-parametric', label: 'Parametric vs Non-Parametric', type: 'concept', x: 500, y: 340 },
    { id: 'c-global-summarization', label: 'Global Corpus Synthesis', type: 'concept', x: 820, y: 220 },

    // Datasets
    { id: 'd-natural-questions', label: 'Natural Questions (NQ)', type: 'dataset', x: 300, y: 90 },
    { id: 'd-popqa', label: 'PopQA Benchmark', type: 'dataset', x: 400, y: 440 },
    { id: 'd-hotpotqa', label: 'HotpotQA (Multi-Hop)', type: 'dataset', x: 680, y: 90 }
  ],
  edges: [
    // Citations & Extensions
    { id: 'e1', source: 'p-gao-2023', target: 'p-lewis-2020', type: 'CITES', label: 'cites' },
    { id: 'e2', source: 'p-asai-2024', target: 'p-lewis-2020', type: 'EXTENDS', label: 'extends' },
    { id: 'e3', source: 'p-yan-2024', target: 'p-lewis-2020', type: 'EXTENDS', label: 'extends' },
    { id: 'e4', source: 'p-edge-2024', target: 'p-lewis-2020', type: 'CITES', label: 'cites' },
    { id: 'e5', source: 'p-lewis-2020', target: 'p-karpukhin-2020', type: 'USES', label: 'uses' },
    { id: 'e6', source: 'p-karpukhin-2020', target: 'p-vaswani-2017', type: 'USES', label: 'uses' },
    { id: 'e7', source: 'p-borgeaud-2022', target: 'p-vaswani-2017', type: 'EXTENDS', label: 'extends' },

    // Methods
    { id: 'e8', source: 'p-lewis-2020', target: 'm-dense-retrieval', type: 'USES', label: 'uses' },
    { id: 'e9', source: 'p-asai-2024', target: 'm-reflection-tokens', type: 'INTRODUCES', label: 'introduces' },
    { id: 'e10', source: 'p-edge-2024', target: 'm-leiden', type: 'USES', label: 'uses' },
    { id: 'e11', source: 'p-gao-2023', target: 'm-reranking', type: 'EVALUATES', label: 'evaluates' },
    { id: 'e12', source: 'p-vaswani-2017', target: 'm-self-attention', type: 'INTRODUCES', label: 'introduces' },

    // Concepts
    { id: 'e13', source: 'p-lewis-2020', target: 'c-hallucination', type: 'RELATED_TO', label: 'targets' },
    { id: 'e14', source: 'p-asai-2024', target: 'c-hallucination', type: 'RELATED_TO', label: 'targets' },
    { id: 'e15', source: 'p-lewis-2020', target: 'c-parametric', type: 'INTRODUCES', label: 'formalizes' },
    { id: 'e16', source: 'p-edge-2024', target: 'c-global-summarization', type: 'RELATED_TO', label: 'solves' },

    // Datasets
    { id: 'e17', source: 'p-lewis-2020', target: 'd-natural-questions', type: 'EVALUATES', label: 'evaluated on' },
    { id: 'e18', source: 'p-asai-2024', target: 'd-popqa', type: 'EVALUATES', label: 'evaluated on' },
    { id: 'e19', source: 'p-yan-2024', target: 'd-popqa', type: 'EVALUATES', label: 'evaluated on' },
    { id: 'e20', source: 'p-gao-2023', target: 'd-hotpotqa', type: 'EVALUATES', label: 'surveys' }
  ]
};
