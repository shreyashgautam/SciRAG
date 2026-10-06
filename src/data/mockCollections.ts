import { Collection } from '../types';

export const MOCK_COLLECTIONS: Collection[] = [
  {
    id: 'rag-research',
    name: 'Retrieval-Augmented Generation',
    description: 'Foundational architectures, dense retrieval pipelines, re-ranking methods, and hallucination reduction mechanisms.',
    paperCount: 5,
    lastUpdated: '12 minutes ago',
    tags: ['Architecture', 'Retrieval', 'Evaluation'],
    color: 'neutral'
  },
  {
    id: 'llm-research',
    name: 'Large Language Models & Scaling',
    description: 'Transformer pre-training paradigms, autoregressive decoders, attention mechanisms, and parameter efficiency.',
    paperCount: 3,
    lastUpdated: '3 hours ago',
    tags: ['Transformers', 'Pre-training', 'Scaling Laws'],
    color: 'neutral'
  },
  {
    id: 'graph-rag',
    name: 'Graph RAG & Structured Reasoning',
    description: 'Combining knowledge graph topologies, entity extraction, and hierarchical community detection with LLMs.',
    paperCount: 2,
    lastUpdated: 'Yesterday',
    tags: ['Knowledge Graphs', 'Hierarchical Communities', 'Global Queries'],
    color: 'neutral'
  },
  {
    id: 'literature-review',
    name: 'Literature Review 2025',
    description: 'Synthesized corpus for doctoral thesis review on factual grounding and empirical evaluation frameworks.',
    paperCount: 4,
    lastUpdated: '3 days ago',
    tags: ['Dissertation', 'Benchmarking', 'Surveys'],
    color: 'neutral'
  }
];
