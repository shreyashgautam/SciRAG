import { Citation } from '../types';

export const MOCK_CITATIONS: Record<string, Citation> = {
  'cite-1': {
    id: 'cite-1',
    number: 1,
    paperId: 'rag-lewis-2020',
    paperTitle: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks',
    authors: 'Lewis et al.',
    year: 2020,
    page: 2,
    section: '2. Related Work & Model Architecture',
    relevanceScore: 94,
    excerpt: 'Retrieval-Augmented Generation reduces reliance on information stored only within model parameters by introducing external evidence during generation. We formulate RAG-Token and RAG-Sequence where passage retrieval conditions token distribution directly.'
  },
  'cite-2': {
    id: 'cite-2',
    number: 2,
    paperId: 'rag-survey-gao-2023',
    paperTitle: 'Retrieval-Augmented Generation for Large Language Models: A Survey',
    authors: 'Gao et al.',
    year: 2023,
    page: 5,
    section: 'Section 3: Mitigation of Hallucinations',
    relevanceScore: 91,
    excerpt: 'Hallucination mitigation via RAG operates by constraining the decoder hypothesis space to information supported by retrieved passages. Advanced RAG incorporates cross-encoder re-ranking to filter out irrelevant candidates before prompt insertion.'
  },
  'cite-3': {
    id: 'cite-3',
    number: 3,
    paperId: 'self-rag-asai-2023',
    paperTitle: 'Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection',
    authors: 'Asai et al.',
    year: 2024,
    page: 4,
    section: 'Section 2: Reflection Tokens',
    relevanceScore: 88,
    excerpt: 'Indiscriminate retrieval in standard RAG may introduce noisy passages that distract the generator. Self-RAG enforces selective retrieval and evaluates generated claim supportedness via [IsSUP] critique tokens.'
  },
  'cite-4': {
    id: 'cite-4',
    number: 4,
    paperId: 'crag-yan-2024',
    paperTitle: 'Corrective Retrieval Augmented Generation (CRAG)',
    authors: 'Yan et al.',
    year: 2024,
    page: 3,
    section: 'Section 3.2: Retrieval Evaluator',
    relevanceScore: 86,
    excerpt: 'The retrieval evaluator classifies retrieved documents into Correct, Ambiguous, and Incorrect. When confidence is below threshold, CRAG filters misleading passages and issues corrective search queries.'
  },
  'cite-5': {
    id: 'cite-5',
    number: 5,
    paperId: 'graphrag-edge-2024',
    paperTitle: 'From Local to Global: A Graph RAG Approach to Query-Focused Summarization',
    authors: 'Edge et al.',
    year: 2024,
    page: 7,
    section: 'Section 4: Community Summaries',
    relevanceScore: 89,
    excerpt: 'Standard vector similarity retrieves passages that match local semantic centroids, but fails on thematic synthesis. Graph RAG performs hierarchical community detection over entity graphs to generate corpus-level answers.'
  }
};
