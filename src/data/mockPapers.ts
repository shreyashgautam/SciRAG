import { Paper } from '../types';

export const MOCK_PAPERS: Paper[] = [
  {
    id: 'rag-lewis-2020',
    title: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks',
    authors: [
      { name: 'Patrick Lewis', affiliation: 'Facebook AI Research & UCL' },
      { name: 'Ethan Perez', affiliation: 'New York University' },
      { name: 'Aleksandra Piktus', affiliation: 'Facebook AI Research' },
      { name: 'Fabio Petroni', affiliation: 'Facebook AI Research' },
      { name: 'Vladimir Karpukhin', affiliation: 'Facebook AI Research' },
      { name: 'Sebastian Riedel', affiliation: 'Facebook AI Research & UCL' },
      { name: 'Douwe Kiela', affiliation: 'Facebook AI Research' }
    ],
    year: 2020,
    venue: 'NeurIPS 2020',
    source: 'arxiv',
    doi: '10.48550/arXiv.2005.11401',
    arxivId: '2005.11401',
    abstract: 'Large pre-trained language models store substantial factual knowledge within their parameters and achieve state-of-the-art results on downstream NLP tasks. However, their ability to precisely access and manipulate knowledge is limited, and they prone to hallucinations. We propose retrieval-augmented generation (RAG) — general-purpose fine-tuning recipes for models that combine pre-trained parametric and non-parametric memory.',
    tags: ['RAG', 'Dense Retrieval', 'Parametric Memory', 'DPR', 'BART'],
    status: 'ready',
    lastOpened: '12 minutes ago',
    fileSize: '2.4 MB',
    pageCount: 19,
    citationCount: 4210,
    chunkCount: 42,
    targetChunkTokens: '300–500 tokens',
    collections: ['rag-research', 'literature-review'],
    isFavorite: true,
    sections: [
      {
        id: 'sec-abstract',
        title: 'Abstract',
        page: 1,
        content: 'Large pre-trained language models store substantial factual knowledge within their parameters and achieve state-of-the-art results on downstream NLP tasks. We develop RAG architectures that combine pre-trained parametric memory (a seq2seq generator) with non-parametric memory (a dense vector index of Wikipedia passages retrieved via DPR).'
      },
      {
        id: 'sec-intro',
        title: '1. Introduction',
        page: 1,
        content: 'Pre-trained neural language models demonstrate surprising memorization abilities. Nevertheless, parametric-only models suffer from inherent limitations: they cannot easily expand or revise their factual memory, struggle to state precise provenance for their decisions, and can hallucinate fictitious content.'
      },
      {
        id: 'sec-related',
        title: '2. Related Work & Model Architecture',
        page: 2,
        content: 'Retrieval-Augmented Generation reduces reliance on information stored only within model parameters by introducing external evidence during generation. We formulate RAG-Token and RAG-Sequence where passage retrieval conditions token distribution directly. Early open-domain QA frameworks utilized BM25 lexical ranking to retrieve candidate passages into extractors; RAG unifies modern dense passage retrieval (DPR) with sequence-to-sequence neural generators in an end-to-end differentiable graph.'
      },
      {
        id: 'sec-method',
        title: '3. Methodology & Formulation',
        page: 3,
        content: 'RAG models combine a pre-trained sequence-to-sequence model (BART) with a non-parametric dense vector index of Wikipedia passages queried via a Dense Passage Retriever (DPR). We formulate two variants: RAG-Token, which marginalizes passage probabilities at each generated token step, and RAG-Sequence, which uses a single retrieved document across the entire generation sequence.'
      },
      {
        id: 'sec-experiments',
        title: '4. Experiments and Benchmarks',
        page: 6,
        content: 'We evaluate RAG on open-domain question answering datasets (Natural Questions, WebQuestions, CuratedTREC) and knowledge-intensive generation tasks including MS-MARCO and Jeopardy! generation.'
      },
      {
        id: 'sec-results',
        title: '5. Empirical Results',
        page: 8,
        content: 'RAG models establish state-of-the-art results on Natural Questions (44.5 Exact Match) and CuratedTREC. Human evaluations confirm that generated outputs are significantly more factual and specific than pure BART baselines.'
      },
      {
        id: 'sec-discussion',
        title: '6. Discussion',
        page: 10,
        content: 'Retrieved passage diversity provides explicit auditability. Inspecting token-level marginalization reveals that the model grounds numeric entities and factual attributes strictly upon top retrieved vectors.'
      },
      {
        id: 'sec-conclusion',
        title: '7. Conclusion',
        page: 11,
        content: 'Combining pre-trained parametric models with non-parametric dense retrieval achieves competitive performance while eliminating full retraining requirements when facts update.'
      },
      {
        id: 'sec-references',
        title: '8. References',
        page: 12,
        content: 'References listed spanning FAISS (Johnson et al. 2019), DPR (Karpukhin et al. 2020), BART (Lewis et al. 2019), and open-domain QA benchmarks.'
      }
    ],
    summary: {
      tldr: 'Pioneering architecture coupling parametric seq2seq models with dense non-parametric vector retrieval from Wikipedia to ground generation.',
      researchProblem: 'Parametric LLMs hallucinate, lack provenance, and cannot easily update outdated factual knowledge without expensive complete retraining.',
      keyContribution: 'Formulation of end-to-end differentiable RAG-Sequence and RAG-Token models bridging DPR passage retrieval and BART generation.',
      methodology: 'Dense Passage Retriever (MIPS search using FAISS) paired with BART-large generator, fine-tuned jointly on knowledge-intensive benchmarks.',
      dataset: 'Natural Questions, WebQuestions, CuratedTREC, MS-MARCO QA, Jeopardy! generation.',
      results: 'State-of-the-art open-domain QA results (44.5 EM on NQ) with dramatically lower hallucination and higher factual specificity.',
      limitations: 'High latency from dense marginalization; retrieval failure directly degrades generation fidelity.',
      futureWork: 'Iterative retrieval loops, adaptive retrieval triggering, and handling multi-hop reasoning over heterogeneous corpora.'
    }
  },
  {
    id: 'rag-survey-gao-2023',
    title: 'Retrieval-Augmented Generation for Large Language Models: A Survey',
    authors: [
      { name: 'Yunfan Gao', affiliation: 'Tongji University' },
      { name: 'Yun Xiong', affiliation: 'Fudan University' },
      { name: 'Xinyu Gao', affiliation: 'Tongji University' },
      { name: 'Kangxiang Jia', affiliation: 'Fudan University' },
      { name: 'Haofen Wang', affiliation: 'Tongji University' }
    ],
    year: 2023,
    venue: 'IEEE TKDE / arXiv:2312.10997',
    source: 'semantic_scholar',
    doi: '10.48550/arXiv.2312.10997',
    arxivId: '2312.10997',
    abstract: 'Retrieval-Augmented Generation (RAG) has rapidly evolved from early naive architectures into advanced and modular paradigms. This survey systematically categorizes RAG frameworks across Naive RAG, Advanced RAG (pre-retrieval, post-retrieval, re-ranking), and Modular RAG. We analyze core retrieval components, generation enhancement techniques, and benchmarking frameworks like RAGAS and TruLens.',
    tags: ['Survey', 'Modular RAG', 'Advanced RAG', 'RAGAS', 'Re-ranking'],
    status: 'ready',
    lastOpened: '1 hour ago',
    fileSize: '3.1 MB',
    pageCount: 26,
    citationCount: 890,
    chunkCount: 58,
    targetChunkTokens: '300–500 tokens',
    collections: ['rag-research', 'llm-research'],
    isFavorite: true,
    sections: [
      { id: 'sec-abstract', title: 'Abstract', page: 1, content: 'This survey provides an exhaustive taxonomy of RAG development, detailing the architectural leap from Naive RAG to Advanced RAG and Modular RAG paradigms.' },
      { id: 'sec-intro', title: '1. Introduction', page: 2, content: 'With the explosive expansion of foundational large language models, mitigating hallucinations and grounding factual synthesis has become an urgent scientific priority.' },
      { id: 'sec-taxonomy', title: '2. RAG Paradigm Taxonomy', page: 3, content: 'We classify RAG into three sequential epochs: Naive RAG (simple index-retrieve-generate pipeline), Advanced RAG (incorporating query rewriting, recursive chunking, and cross-encoder re-ranking), and Modular RAG (decoupled routing, iterative search, memory engines).' },
      { id: 'sec-retrieval', title: '3. Retrieval Augmentation Modules', page: 7, content: 'Deep analysis of indexing strategies (sliding window chunking, hierarchical parent-child nodes), embedding representations, and hybrid search blending BM25 lexical signals with dense cosine similarity vectors.' },
      { id: 'sec-evaluation', title: '4. Evaluation Methodologies & RAGAS', page: 14, content: 'Review of reference-free evaluation metrics: Faithfulness (measuring hallucinations against context), Answer Relevance (query alignment), and Context Precision/Recall.' },
      { id: 'sec-conclusion', title: '5. Future Directions', page: 22, content: 'The frontier encompasses agentic scientific RAG, multimodal provenance, and adaptive reflection tokens.' }
    ],
    summary: {
      tldr: 'Comprehensive taxonomy defining the transition from Naive RAG to Advanced RAG (re-ranking, query transformation) and Modular RAG architectures.',
      researchProblem: 'Fragmented RAG research lacked a unified evaluation taxonomy, comparison of modular components, and systematic failure-mode analysis.',
      keyContribution: 'Formal tripartite taxonomy (Naive vs Advanced vs Modular RAG) and benchmarking evaluation framework review.',
      methodology: 'Literature analysis of 200+ papers categorized by pre-retrieval, retrieval, post-retrieval, and generation stages.',
      dataset: 'Multi-hop QA benchmarks, RGB benchmark, CRUD-RAG, HotpotQA.',
      results: 'Identified modular orchestration and hybrid retrieval as the most effective mitigations for noise sensitivity.',
      limitations: 'High engineering complexity in modular orchestration; lacks standardized cross-domain cost benchmarks.',
      futureWork: 'Self-correcting RAG agents, long-context window integration vs retrieval trade-offs, and multi-modal RAG.'
    }
  },
  {
    id: 'paperqa-crowell-2023',
    title: 'PaperQA: Retrieval-Augmented Generation for Scientific Question Answering over Full-Text Articles',
    authors: [
      { name: 'Andrew D. White', affiliation: 'University of Rochester' },
      { name: 'James Crowell', affiliation: 'FutureHouse' }
    ],
    year: 2023,
    venue: 'FutureHouse Tech Report',
    source: 'pubmed',
    pubmedId: 'PMC10842911',
    doi: '10.1101/2023.10.30.564812',
    abstract: 'PaperQA is an agentic scientific RAG tool designed to answer complex domain questions from complete academic literature corpora. It parses full-text PDFs into 300-token semantic chunks, executes dense vector + keyword retrieval, gathers candidate evidence passages, and prompts an LLM with strict citation provenance constraints.',
    tags: ['PaperQA', 'Scientific Literature', 'Full-Text Retrieval', 'Evidence Context', 'Biomedical'],
    status: 'ready',
    lastOpened: '2 hours ago',
    fileSize: '1.9 MB',
    pageCount: 16,
    citationCount: 184,
    chunkCount: 36,
    targetChunkTokens: '300–500 tokens',
    collections: ['rag-research', 'literature-review'],
    isFavorite: true,
    sections: [
      { id: 'sec-abstract', title: 'Abstract', page: 1, content: 'Scientific research demands high precision. PaperQA searches full text, generates localized citation references, and produces evidence-grounded syntheses.' },
      { id: 'sec-intro', title: '1. Introduction', page: 1, content: 'Standard retrieval across raw abstracts omits experimental methodology details hidden inside article body sections.' },
      { id: 'sec-pipeline', title: '2. Ingestion & Chunking Architecture', page: 4, content: 'Target chunk sizes between 300 and 500 tokens preserve localized context while minimizing distractor passage noise.' },
      { id: 'sec-eval', title: '3. Evaluation Against Baseline LLMs', page: 9, content: 'PaperQA achieves >90% precision on evidence citations compared to purely parametric baselines.' }
    ],
    summary: {
      tldr: 'Agentic literature QA framework parsing full-text papers into bounded chunks to generate provably cited scientific answers.',
      researchProblem: 'Abstract-only indexing misses methodology details; standard generative models fail to provide verifiable paper citations.',
      keyContribution: 'Two-stage gather-and-answer retrieval architecture prioritizing full-text passage evidence.',
      methodology: 'Hybrid search with token-budget evidence collection followed by grounded answer generation.',
      dataset: 'Scientific QA benchmarks spanning biology, chemistry, and physics.',
      results: 'Demonstrated superior citation accuracy and reduced factual hallucinations across academic queries.',
      limitations: 'High token consumption during full-corpus candidate gathering.',
      futureWork: 'Integration with automated scientific discovery agents and graph RAG synthesis.'
    }
  },
  {
    id: 'scidqa-zhang-2024',
    title: 'SciDQA: Benchmarking Chunk-Based vs Full-Document Reasoning in Scientific Question Answering',
    authors: [
      { name: 'Sheng Zhang', affiliation: 'Allen Institute for AI' },
      { name: 'Pradeep Dasigi', affiliation: 'Allen Institute for AI' },
      { name: 'Hao Peng', affiliation: 'University of Illinois Urbana-Champaign' }
    ],
    year: 2024,
    venue: 'ACL 2024',
    source: 'arxiv',
    arxivId: '2403.08210',
    doi: '10.48550/arXiv.2403.08210',
    abstract: 'Investigates the trade-offs between chunk-based retrieval-augmented generation and ultra-long-context full-document reasoning on scientific literature. Demonstrates that while long context models absorb larger spans, chunk-based RAG with reranking achieves higher factual precision and evidence focus on complex scientific reasoning tasks.',
    tags: ['SciDQA', 'Evaluation', 'Chunking vs Long-Context', 'ACL 2024', 'RAGAS'],
    status: 'ready',
    lastOpened: '4 hours ago',
    fileSize: '2.8 MB',
    pageCount: 21,
    citationCount: 142,
    chunkCount: 48,
    targetChunkTokens: '300–500 tokens',
    collections: ['rag-research', 'literature-review'],
    isFavorite: false,
    sections: [
      { id: 'sec-abstract', title: 'Abstract', page: 1, content: 'SciDQA establishes an empirical testbed comparing chunk-based RAG against 1M-token context LLMs on deep scientific question answering.' },
      { id: 'sec-intro', title: '1. Introduction', page: 2, content: 'Does expanding context length eliminate the need for retrieval? We show that precision retrieval remains essential to combat lost-in-the-middle degradation.' },
      { id: 'sec-chunking', title: '2. Semantic Chunking Strategy', page: 5, content: 'Boundary-aware chunking preserving section headers prevents fragmented mathematical propositions.' },
      { id: 'sec-results', title: '3. Findings & RAG Precision', page: 12, content: 'Chunk-based RAG with cross-encoder reranking outperformed brute-force long-context LLMs by 14.2% on grounded citation accuracy.' }
    ],
    summary: {
      tldr: 'Benchmark demonstrating that chunk-based RAG with reranking outperforms brute-force long-context LLMs in scientific evidence precision.',
      researchProblem: 'Testing whether long context windows render vector retrieval pipelines obsolete in complex scientific corpora.',
      keyContribution: 'SciDQA benchmark comprising 1,200 multi-step scientific questions requiring localized evidence extraction.',
      methodology: 'Comparison of 300-token chunked hybrid retrieval against 128k-1M long context foundation models.',
      dataset: 'Open-access arXiv and PubMed Central papers in computer science, biology, and physics.',
      results: 'RAG achieved higher context precision and halved factual hallucination rates compared to full-document prompts.',
      limitations: 'Fragmented chunk boundaries occasionally break multi-page mathematical proofs.',
      futureWork: 'Hierarchical parent-child chunk routing with graph-based edge traversal.'
    }
  },
  {
    id: 'self-rag-asai-2023',
    title: 'Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection',
    authors: [
      { name: 'Akari Asai', affiliation: 'University of Washington' },
      { name: 'Zeqiu Wu', affiliation: 'University of Washington' },
      { name: 'Yizhong Wang', affiliation: 'University of Washington' },
      { name: 'Hannaneh Hajishirzi', affiliation: 'UW & AI2' }
    ],
    year: 2024,
    venue: 'ICLR 2024 (Oral)',
    source: 'arxiv',
    doi: '10.48550/arXiv.2310.11511',
    arxivId: '2310.11511',
    abstract: 'Standard RAG retrieves passages indiscriminately, frequently introducing distracting context. We propose Self-Reflective Retrieval-Augmented Generation (Self-RAG), training a language model to adaptively retrieve passages on demand, evaluate passage utility, and critique its own generated tokens using special reflection tokens.',
    tags: ['Self-RAG', 'Reflection Tokens', 'Adaptive Retrieval', 'Critique', 'Hallucination Mitigation'],
    status: 'ready',
    lastOpened: 'Yesterday',
    fileSize: '1.8 MB',
    pageCount: 22,
    citationCount: 654,
    chunkCount: 44,
    targetChunkTokens: '300–500 tokens',
    collections: ['rag-research', 'llm-research'],
    isFavorite: true,
    summary: {
      tldr: 'Equips LLMs with special reflection tokens to autonomously decide when to retrieve, assess passage relevance, and critique factual correctness.',
      researchProblem: 'Indiscriminate retrieval in standard RAG wastes compute and degrades quality by forcing noisy or unnecessary context into prompts.',
      keyContribution: 'Reflection token vocabulary ([Retrieve], [IsREL], [IsSUP], [IsUSE]) trained via offline critic data distillation.',
      methodology: 'Supervised fine-tuning of 7B/13B models on self-reflection trajectories generated by critic annotations.',
      dataset: 'PopQA, TriviaQA, ARC-Challenge, PubHealth, ASQA.',
      results: 'Self-RAG 7B exceeds standard RAG on citation precision and factual adherence.',
      limitations: 'Inference overhead from generating critique tokens across multiple candidate beams.',
      futureWork: 'Extending critique mechanisms to multimodal retrieval and scientific tool execution.'
    }
  },
  {
    id: 'crag-yan-2024',
    title: 'Corrective Retrieval Augmented Generation (CRAG)',
    authors: [
      { name: 'Shi-Qi Yan', affiliation: 'USTC' },
      { name: 'Jia-Chen Gu', affiliation: 'USTC' },
      { name: 'Yun Zhu', affiliation: 'Google Research' },
      { name: 'Zhen-Hua Ling', affiliation: 'USTC' }
    ],
    year: 2024,
    venue: 'arXiv:2401.15884',
    source: 'arxiv',
    doi: '10.48550/arXiv.2401.15884',
    arxivId: '2401.15884',
    abstract: 'Retrieval systems in RAG inevitably return irrelevant or misleading documents. We propose Corrective Retrieval Augmented Generation (CRAG) with a lightweight retrieval evaluator assessing document confidence (Correct, Ambiguous, Incorrect) and triggering corrective search.',
    tags: ['CRAG', 'Corrective Retrieval', 'Document Evaluator', 'Web Fallback'],
    status: 'ready',
    lastOpened: '2 days ago',
    fileSize: '1.5 MB',
    pageCount: 16,
    citationCount: 312,
    chunkCount: 32,
    targetChunkTokens: '300–500 tokens',
    collections: ['rag-research'],
    isFavorite: false,
    summary: {
      tldr: 'Self-correcting RAG pipeline using a lightweight retrieval evaluator that triggers internal document refinement or fallback search.',
      researchProblem: 'Standard RAG blindly passes noisy or incorrect retrieved documents into LLMs, leading to hallucinated outputs.',
      keyContribution: 'Confidence evaluator with tri-state actions: Correct, Incorrect, and Ambiguous.',
      methodology: 'Evaluator model trained to predict document confidence; knowledge refinement decomposing passages into key strips.',
      dataset: 'PopQA, Biography, PubHealth, Arc-Challenge.',
      results: 'Consistently improves QA accuracy across benchmarks by eliminating misleading retrieval noise.',
      limitations: 'Dependency on external search latency when fallback is triggered.',
      futureWork: 'End-to-end integration with iterative query decomposition agents.'
    }
  },
  {
    id: 'graphrag-edge-2024',
    title: 'From Local to Global: A Graph RAG Approach to Query-Focused Summarization',
    authors: [
      { name: 'Darren Edge', affiliation: 'Microsoft Research' },
      { name: 'Ha Trinh', affiliation: 'Microsoft Research' },
      { name: 'Newman Cheng', affiliation: 'Microsoft Research' },
      { name: 'Jonathan Larson', affiliation: 'Microsoft Research' }
    ],
    year: 2024,
    venue: 'Microsoft Research Technical Report',
    source: 'doi',
    doi: '10.48550/arXiv.2404.16130',
    arxivId: '2404.16130',
    abstract: 'Vector similarity RAG systems struggle with global corpus-level queries. We introduce Graph RAG: an approach combining LLM-extracted knowledge graphs, hierarchical community detection (Leiden algorithm), and recursive community summaries to enable holistic answering over entire text corpora.',
    tags: ['Graph RAG', 'Knowledge Graphs', 'Global Summarization', 'Leiden Algorithm'],
    status: 'ready',
    lastOpened: '3 days ago',
    fileSize: '4.2 MB',
    pageCount: 20,
    citationCount: 420,
    chunkCount: 52,
    targetChunkTokens: '300–500 tokens',
    collections: ['rag-research', 'graph-rag'],
    isFavorite: true,
    summary: {
      tldr: 'Combines LLM-generated knowledge graphs with hierarchical community summarization to answer global corpus-level research questions.',
      researchProblem: 'Vector search fails on global queries requiring synthesis across disparate documents because top-k cosine similarity only finds local matches.',
      keyContribution: 'Two-stage pipeline: LLM entity/relationship graph extraction followed by Leiden community detection and pre-computed community summaries.',
      methodology: 'Hierarchical community summaries generated at multiple levels of granularity.',
      dataset: 'Podcast transcripts and multi-document news corpora.',
      results: 'Superior comprehensiveness and diversity over vector baseline RAG on broad synthesis benchmarks.',
      limitations: 'High token cost during initial graph construction and community summary generation.',
      futureWork: 'Incremental graph updating and hybrid vector-graph routing.'
    }
  },
  {
    id: 'custom-uploaded-preprint',
    title: 'Hierarchical Dense-Lexical Fusion for Scientific Document Retrieval',
    authors: [
      { name: 'Dr. Elena Rostova', affiliation: 'SciRAG Research Lab' },
      { name: 'Marcus Vance', affiliation: 'Oxford University' }
    ],
    year: 2025,
    venue: 'Uploaded Laboratory Manuscript',
    source: 'pdf',
    abstract: 'Empirical analysis of hybrid retrieval combining BGE-M3 dense embeddings with BM25 keyword matching across specialized scientific notation and mathematical formulations.',
    tags: ['Uploaded PDF', 'Hybrid Fusion', 'Preprint', 'Laboratory Manuscript'],
    status: 'ready',
    lastOpened: 'Just now',
    fileSize: '3.4 MB',
    pageCount: 14,
    citationCount: 0,
    chunkCount: 28,
    targetChunkTokens: '300–500 tokens',
    collections: ['literature-review'],
    isFavorite: true,
    summary: {
      tldr: 'Laboratory manuscript evaluating Reciprocal Rank Fusion on mathematical formulas and chemical symbols.',
      researchProblem: 'Dense neural embeddings lose precision on exact chemical formulas and acronyms.',
      keyContribution: 'Weighted reciprocal rank fusion tuned for scientific nomenclature.',
      methodology: 'BGE-M3 + BM25 combined via calibrated alpha parameters.',
      dataset: 'Internal scientific testbed.',
      results: 'Recovered 28% more relevant equation passages than pure cosine similarity.',
      limitations: 'Preliminary unreviewed preprint.',
      futureWork: 'Submitting to EMNLP 2025.'
    }
  }
];
