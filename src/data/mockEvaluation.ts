import {
  EvaluationMetricData,
  PotentialResearchGap,
  HowItWorksStage,
  LiteratureMilestone
} from '../types';

export const MOCK_EVALUATION_METRICS: EvaluationMetricData[] = [
  {
    id: 'eval-faithfulness',
    name: 'Faithfulness',
    description: 'Measures the factual consistency of generated statements against the retrieved source evidence passages.',
    sciRagScore: 91.4,
    baselineScore: 61.2,
    benchmarkDataset: 'SciDQA Test Corpus (1,200 scientific queries)',
    formulaDescription: 'Faithfulness = |Claims Supported by Context| / |Total Expressed Claims|'
  },
  {
    id: 'eval-answer-relevance',
    name: 'Answer Relevance',
    description: 'Quantifies how directly the synthesized response addresses the original scientific query without drifting.',
    sciRagScore: 89.7,
    baselineScore: 74.5,
    benchmarkDataset: 'PaperQA Benchmark Suite',
    formulaDescription: 'Cosine similarity between generated answer embeddings and generated query variants.'
  },
  {
    id: 'eval-context-precision',
    name: 'Context Precision',
    description: 'Evaluates whether all ground-truth relevant chunks are ranked at the top of the candidate evidence window.',
    sciRagScore: 87.2,
    baselineScore: 48.0,
    benchmarkDataset: 'PubMed Central & arXiv Scientific QA',
    formulaDescription: 'Mean Average Precision (MAP) of retrieved passages containing gold factual support.'
  },
  {
    id: 'eval-context-recall',
    name: 'Context Recall',
    description: 'Measures the proportion of gold-standard source evidence successfully retrieved into the LLM context.',
    sciRagScore: 84.9,
    baselineScore: 52.3,
    benchmarkDataset: 'Natural Questions Scientific Subset',
    formulaDescription: 'Context Recall = |Retrieved Gold Passages| / |Total Ground Truth Gold Passages|'
  },
  {
    id: 'eval-citation-correctness',
    name: 'Citation Correctness',
    description: 'Determines whether cited inline markers [1], [2] accurately attribute claims to their true document source & page.',
    sciRagScore: 93.1,
    baselineScore: 18.4,
    benchmarkDataset: 'SciRAG Verifiable Attribution Benchmark',
    formulaDescription: 'Attribution Precision = |Verifiable Citations with Exact Match| / |Total Inline Citations|'
  }
];

export const MOCK_RESEARCH_GAPS: PotentialResearchGap[] = [
  {
    id: 'gap-1',
    gapTitle: 'Limited evaluation of retrieval systems under noisy or contradictory evidence conditions',
    description: 'Most scientific RAG benchmarks evaluate queries against clean, non-conflicting corpora. However, unreviewed preprints frequently assert contradictory findings, leaving an unstudied vulnerability zone where generators produce hybrid hallucinations.',
    supportingPapersCount: 7,
    evidenceStatus: 'Available',
    confidenceScore: 82,
    papers: [
      { id: 'crag-yan-2024', title: 'Corrective Retrieval Augmented Generation (CRAG)', year: 2024 },
      { id: 'self-rag-asai-2023', title: 'Self-RAG', year: 2024 },
      { id: 'rag-survey-gao-2023', title: 'RAG for Large Language Models: A Survey', year: 2023 }
    ]
  },
  {
    id: 'gap-2',
    gapTitle: 'Degradation of standard dense embeddings on domain-specific mathematical and chemical notation',
    description: 'General-purpose dense embedding models (e.g. text-embedding-ada, standard BGE) exhibit severe similarity collapse on complex mathematical LaTeX equations and IUPAC chemical formulas, failing to retrieve exact symbolic derivations.',
    supportingPapersCount: 5,
    evidenceStatus: 'Available',
    confidenceScore: 85,
    papers: [
      { id: 'custom-uploaded-preprint', title: 'Hierarchical Dense-Lexical Fusion for Scientific Document Retrieval', year: 2025 },
      { id: 'scidqa-zhang-2024', title: 'SciDQA: Benchmarking Chunk-Based vs Full-Document Reasoning', year: 2024 }
    ]
  },
  {
    id: 'gap-3',
    gapTitle: 'Absence of standardized provenance-tracking benchmarks across multi-hop scientific reasoning',
    description: 'Existing QA datasets test single-hop factoid retrieval. Cross-paper synthesis requiring premises from Paper A to interpret experimental outcomes in Paper B lacks standardized automated verification metrics.',
    supportingPapersCount: 4,
    evidenceStatus: 'Partial',
    confidenceScore: 78,
    papers: [
      { id: 'graphrag-edge-2024', title: 'From Local to Global: A Graph RAG Approach', year: 2024 },
      { id: 'paperqa-crowell-2023', title: 'PaperQA: Retrieval-Augmented Generation for Scientific QA', year: 2023 }
    ]
  }
];

export const MOCK_HOW_IT_WORKS_STAGES: HowItWorksStage[] = [
  {
    id: 'stage-sources',
    title: 'Scientific Sources',
    category: 'Ingestion Layer',
    shortDescription: 'Multi-source acquisition from arXiv, PubMed, Semantic Scholar, DOI, and uploaded PDFs.',
    technicalDetails: 'Connectors gather open-access metadata, full-text PDFs, and supplementary materials while standardizing file formats.',
    plannedArchitecture: 'REST APIs (arXiv API, NCBI E-utilities, Semantic Scholar Graph API) + Local file validation.'
  },
  {
    id: 'stage-ingestion',
    title: 'Document Ingestion',
    category: 'Ingestion Layer',
    shortDescription: 'Sanitization, malware scanning, magic byte verification, and document queue orchestration.',
    technicalDetails: 'Verifies PDF 1.4-1.7 formatting, strips embedded executable macros, and normalizes layout structures.',
    plannedArchitecture: 'Asynchronous Celery/Redis document queue with ClamAV sandboxing and 50MB file size limits.'
  },
  {
    id: 'stage-parsing',
    title: 'Scientific Parsing',
    category: 'Ingestion Layer',
    shortDescription: 'Preserving document outline: Abstract, Methods, Results, Discussions, Formulas, and Tables.',
    technicalDetails: 'Extracts structural hierarchies rather than raw character streams to prevent breaking equation contexts.',
    plannedArchitecture: 'GROBID / PyMuPDF pipeline extracting XML/TEI representations with detected section boundaries.'
  },
  {
    id: 'stage-chunking',
    title: 'Semantic Chunking',
    category: 'Representation Layer',
    shortDescription: 'Targeting 300–500 token semantic windows bounded by scientific section headers.',
    technicalDetails: 'Sliding-window chunker with 10% overlap, appending paper title and section header as metadata headers.',
    plannedArchitecture: 'Recursive character splitter with token counter (tiktoken / HuggingFace tokenizer) respecting paragraph boundaries.'
  },
  {
    id: 'stage-embeddings',
    title: 'Dense Vector Embeddings',
    category: 'Representation Layer',
    shortDescription: 'Transforming text chunks into high-dimensional semantic vectors tailored for scientific domains.',
    technicalDetails: 'Maps 300-token passages into dense representations preserving technical terminology and relational semantics.',
    plannedArchitecture: 'BGE-M3 / SciBERT / SPECTER-2 dense bi-encoder generating 768 to 1024-dimensional normalized vectors.'
  },
  {
    id: 'stage-index',
    title: 'Vector Index & Storage',
    category: 'Storage Layer',
    shortDescription: 'Partitioned FAISS / HNSW indexing providing sub-millisecond approximate nearest neighbor search.',
    technicalDetails: 'Stores vector representations and relational metadata in isolated tenant namespaces with cryptographic boundaries.',
    plannedArchitecture: 'FAISS (Facebook AI Similarity Search) HNSW index with metadata store in PostgreSQL pgvector.'
  },
  {
    id: 'stage-retrieval',
    title: 'Hybrid Retrieval (Dense + BM25)',
    category: 'Retrieval Engine',
    shortDescription: 'Combining neural semantic similarity (dense) with exact BM25 keyword matching (sparse).',
    technicalDetails: 'Reciprocal Rank Fusion (RRF) unifies dense cosine scores with BM25 lexical signals, capturing rare acronyms.',
    plannedArchitecture: 'RRF algorithm: Score(d) = Σ [ 1 / (60 + rank_dense(d)) ] + Σ [ 1 / (60 + rank_bm25(d)) ].'
  },
  {
    id: 'stage-reranking',
    title: 'Cross-Encoder Reranking',
    category: 'Retrieval Engine',
    shortDescription: 'Refining candidate passages from top-20 to top-5 high-relevance evidence passages.',
    technicalDetails: 'Cross-encoder models jointly attend over (query, passage) pairs to filter distractor noise.',
    plannedArchitecture: 'BGE-Reranker-large / Cohere Rerank evaluating candidate pairs with deep cross-attention.'
  },
  {
    id: 'stage-context',
    title: 'Evidence Context Assembly',
    category: 'Synthesis Layer',
    shortDescription: 'Assembling curated evidence passages into structured XML prompts with strict token budgets.',
    technicalDetails: 'Formats passages with explicit metadata: <evidence id="1" paper="..." page="..." section="...">[text]</evidence>.',
    plannedArchitecture: 'Template composer with token-budget manager and prompt injection safety fences.'
  },
  {
    id: 'stage-llm',
    title: 'Generative Synthesis (LLM)',
    category: 'Synthesis Layer',
    shortDescription: 'Synthesizing evidence-grounded answers strictly anchored to provided retrieved literature.',
    technicalDetails: 'Directs the model to answer only using retrieved passages, explicitly stating when evidence is insufficient.',
    plannedArchitecture: 'Configurable LLM provider (Gemini 2.5 Flash, Claude 3.5 Sonnet, Llama-3-70B) via server-side proxies.'
  },
  {
    id: 'stage-grounding',
    title: 'Citation Grounding',
    category: 'Verification Layer',
    shortDescription: 'Extracting and validating verifiable citation markers [1], [2] linked to source passages.',
    technicalDetails: 'Validates that each numeric citation token in the answer maps to a genuine retrieved passage.',
    plannedArchitecture: 'Post-generation citation verifier checking sentence-level token overlap against source chunks.'
  },
  {
    id: 'stage-evaluation',
    title: 'RAGAS Evaluation',
    category: 'Verification Layer',
    shortDescription: 'Automated reference-free evaluation assessing Faithfulness, Relevance, and Citation Correctness.',
    technicalDetails: 'Evaluates system adherence to academic facts using standardized benchmark suites.',
    plannedArchitecture: 'RAGAS Python framework evaluating synthetic and gold test sets on ongoing deployment cycles.'
  }
];

export const MOCK_LITERATURE_MILESTONES: LiteratureMilestone[] = [
  {
    year: 2020,
    citation: 'Lewis et al. (NeurIPS 2020)',
    title: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks',
    coreContribution: 'Formulated the foundational RAG paradigm coupling dense passage retrieval (DPR) with sequence-to-sequence neural generators.',
    relevanceToSciRag: 'Establishes the core theoretical foundation: non-parametric external memory eliminates model parameter memorization limits.'
  },
  {
    year: 2023,
    citation: 'Crowell & White (FutureHouse 2023)',
    title: 'PaperQA: Retrieval-Augmented Generation for Scientific Question Answering',
    coreContribution: 'Demonstrated agentic retrieval over full-text scientific PDFs, highlighting the necessity of localized paragraph-level evidence collection.',
    relevanceToSciRag: 'Informs SciRAG’s full-text PDF parsing and 300–500 token chunking strategy rather than abstract-only search.'
  },
  {
    year: 2024,
    citation: 'Zhang et al. (ACL 2024)',
    title: 'SciDQA: Benchmarking Chunk-Based vs Full-Document Reasoning',
    coreContribution: 'Demonstrated that chunk-based RAG with reranking achieves higher factual precision and evidence focus than brute-force long-context LLMs.',
    relevanceToSciRag: 'Directly motivates SciRAG’s cross-encoder reranking stage to counter "lost-in-the-middle" long context degradation.'
  },
  {
    year: 2025,
    citation: 'Edge et al. & Recent Literature',
    title: 'Hybrid Dense-Sparse Fusion & Graph RAG Paradigms',
    coreContribution: 'Coupled Reciprocal Rank Fusion (BGE-M3 + BM25) with hierarchical community detection across scientific entities.',
    relevanceToSciRag: 'Forms SciRAG’s hybrid retrieval engine and optional scientific knowledge graph topology.'
  },
  {
    year: 2025,
    citation: 'Es et al. / Gao et al.',
    title: 'Systematic RAG Evaluation Research (RAGAS Framework)',
    coreContribution: 'Established reference-free evaluation metrics: Faithfulness, Answer Relevance, Context Precision, and Context Recall.',
    relevanceToSciRag: 'Provides the formal evaluation framework powering SciRAG’s /evaluation dashboard.'
  }
];
