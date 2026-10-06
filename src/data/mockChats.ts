import { ChatMessage, ChatSession } from '../types';
import { MOCK_CITATIONS } from './mockSources';

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'user',
    timestamp: '10:14 AM',
    content: 'How does retrieval augmentation reduce hallucination in neural models?',
    scopePapers: ['rag-lewis-2020', 'rag-survey-gao-2023', 'self-rag-asai-2023']
  },
  {
    id: 'msg-2',
    sender: 'assistant',
    timestamp: '10:15 AM',
    content: `Retrieval-Augmented Generation constrains speculative parameter drift by grounding answers on explicit external evidence retrieved during token generation [1].

Rather than relying strictly on memorized weights, dense non-parametric vector stores condition the decoder hypothesis space, ensuring factual assertions are anchored to verified text passages [2].

Furthermore, recent self-reflective architectures introduce critique tokens to measure whether individual generated assertions are strictly supported by the retrieved passages, penalizing claims that drift beyond the retrieved non-parametric boundary [3].`,
    citations: [
      MOCK_CITATIONS['cite-1'],
      MOCK_CITATIONS['cite-2'],
      MOCK_CITATIONS['cite-3']
    ],
    scopePapers: ['rag-lewis-2020', 'rag-survey-gao-2023', 'self-rag-asai-2023']
  },
  {
    id: 'msg-3',
    sender: 'user',
    timestamp: '10:22 AM',
    content: 'What happens when the retrieved documents contain conflicting or irrelevant noise?',
    scopePapers: ['rag-survey-gao-2023', 'crag-yan-2024']
  },
  {
    id: 'msg-4',
    sender: 'assistant',
    timestamp: '10:23 AM',
    content: `When retrieved passages contain irrelevant distractors or conflicting factual propositions, standard RAG models suffer from context degradation and increased generation entropy.

Research has converged on two primary architectural defenses:
1. **Confidence-gated evaluation**: Approaches such as Corrective RAG (CRAG) employ a dedicated evaluator module to assess document relevance before prompt injection. If the retrieved context is classified as ambiguous or incorrect, the pipeline strips noisy text strips and initiates corrective retrieval [4].
2. **Re-ranking and post-retrieval filtering**: In Advanced RAG pipelines, cross-encoders score passage-query semantic alignment and truncate candidate context windows below strict confidence cutoffs [2].`,
    citations: [
      MOCK_CITATIONS['cite-4'],
      MOCK_CITATIONS['cite-2']
    ],
    scopePapers: ['rag-survey-gao-2023', 'crag-yan-2024']
  }
];

export const MOCK_CHAT_SESSIONS: ChatSession[] = [
  {
    id: 'session-rag-mechanisms',
    title: 'RAG Hallucination & Noise Robustness',
    createdAt: 'Today, 10:14 AM',
    updatedAt: '10:23 AM',
    scopePaperIds: ['rag-lewis-2020', 'rag-survey-gao-2023', 'self-rag-asai-2023', 'crag-yan-2024'],
    messages: MOCK_CHAT_MESSAGES
  },
  {
    id: 'session-graph-rag',
    title: 'Knowledge Graph Integration vs Dense Vectors',
    createdAt: 'Yesterday, 3:45 PM',
    updatedAt: 'Yesterday, 4:10 PM',
    scopePaperIds: ['graphrag-edge-2024', 'dpr-karpukhin-2020'],
    messages: [
      {
        id: 'msg-g1',
        sender: 'user',
        timestamp: '3:45 PM',
        content: 'Why is dense vector similarity insufficient for global multi-document summarization?',
        scopePapers: ['graphrag-edge-2024']
      },
      {
        id: 'msg-g2',
        sender: 'assistant',
        timestamp: '3:46 PM',
        content: 'Dense vector search relies on finding top-k passages closest to a specific query embedding vector. However, global thematic queries (such as discovering cross-corpus motifs or structural relationships) have no single localized text passage to match against. Graph RAG resolves this by pre-computing hierarchical community summaries across extracted knowledge graphs [5].',
        citations: [MOCK_CITATIONS['cite-5']],
        scopePapers: ['graphrag-edge-2024']
      }
    ]
  }
];
