# SciRAG — An Intelligent Research Assistant for Scientific Literature Using Retrieval-Augmented Generation

> **Retrieval • Generation • Citation-Grounded Answers**

SciRAG is a research-grade scientific literature assistant engineered to bridge dense non-parametric vector retrieval with verifiable generative synthesis. The platform allows researchers to ingest scientific papers, execute hybrid semantic searches, synthesize multi-document literature reviews, inspect granular passage citations, and verify claims with zero parameter hallucination.

---

## Core Capabilities

1. **Research Copilot & Grounded Mode**
   - Active literature scope management across isolated collections or multi-paper sets
   - Evidence-grounded answer generation with inline interactive citations `[1]`, `[2]`
   - Parameter-drift mitigation via dense passage retrieval conditioning

2. **Source Inspector & Provenance Audit**
   - Granular citation inspector displaying exact paper title, author attribution, publication venue, and page
   - Relevance match scoring (e.g. 94% relevance match against target vector)
   - Verifiable excerpt quotes and technical retrieval telemetry (Bi-Encoder embeddings, chunk indices, cosine similarity)
   - One-click slide navigation directly into the interactive Paper Viewer

3. **Slide Navigation & Document Reader**
   - Fluid slide transitions between document pages and sections
   - Automatic slide navigation to cited passages with animated evidence highlights
   - Normalized multi-column scientific reader with zoom HUD and outline navigation
   - AI literature synthesis breakdown (TL;DR, Problem, Contribution, Methodology, Benchmarks, Limitations)

4. **Multi-Paper Methodology Comparison**
   - Side-by-side architectural and experimental metric comparisons
   - Trade-off matrix analysis and shared citation discovery

5. **Scientific Knowledge Graph**
   - Interactive research ecosystem visualizing papers, methodologies, datasets, and author clusters

---

## Technical Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS (strict monochrome black, white, and neutral grays)
- **Animations & Transitions**: Framer Motion (`motion/react`)
- **Iconography**: Lucide React
- **Architecture**: Modular service layer ready for RAG backend integration (FAISS, DPR, BGE-M3, Gemini API)

---

## Visual Design Philosophy

SciRAG follows an uncompromising scientific laboratory aesthetic:
- **Light Mode**: Pure white backgrounds, sharp high-contrast black typography, subtle 1px gray borders.
- **Dark Mode**: Deep black / charcoal backgrounds, crisp white typography, minimal luminescence.
- Semantic indicators (emerald, amber, rose) reserved strictly for verified provenance and status indicators.
