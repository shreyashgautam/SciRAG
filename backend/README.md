# SciRAG — Backend Architecture & API Specification

> **Retrieval • Generation • Citation-Grounded Answers**

SciRAG is a production-oriented scientific literature research assistant powered by Retrieval-Augmented Generation (RAG). The backend pipeline is structured strictly across:

```
Ingestion ➔ Indexing ➔ Retrieval ➔ Generation ➔ Evaluation
```

---

## 1. High-Level Architecture

```
                    SCIRAG
                       │
                       ▼
                 React Frontend
                       │
                       │ REST API / SSE (/api/v1)
                       ▼
                FastAPI Backend
                       │
       ┌───────────────┼────────────────┐
       │               │                │
       ▼               ▼                ▼
   MongoDB         Cloudinary         Grok API
   Atlas           PDF Storage        Generation
       │
       ├── Documents
       ├── Chunks (Vector + Metadata)
       ├── Users (Argon2 / JWT)
       ├── Conversations & Messages
       ├── Citations
       └── Evaluations
       │
       ▼
  MongoDB Vector Search (BGE/E5 Dense)
       +
  MongoDB Atlas Search (BM25 Keyword)
       │
       ▼
   Hybrid Retrieval (Reciprocal Rank Fusion)
       │
       ▼
     Cross-Encoder Reranker
       │
       ▼
  Structured Evidence Context
       │
       ▼
      Grok (xAI)
       │
       ▼
Citation Grounding & Strict Validation
       │
       ▼
    RAGAS & Baseline Evaluation
```

---

## 2. Directory Structure

```
backend/
├── app/
│   ├── main.py                    # Master FastAPI Application Entry
│   ├── core/                      # Config, Security (JWT/Argon2), Logging, Exceptions, Middleware
│   ├── db/                        # MongoDB Atlas connection, Indexes, Vector Search
│   ├── models/                    # Pydantic/Document Models (User, Paper, Chunk, Citation, etc.)
│   ├── schemas/                   # API Request/Response Schemas
│   ├── services/                  # Business Logic & External Service Connectors (Auth, Paper, Grok, Cloudinary)
│   ├── ingestion/                 # PyMuPDF parser, GROBID client, Section detector, Document cleaner
│   ├── embeddings/                # Sentence Transformers / BGE embedder
│   ├── retrieval/                 # Dense vector search, BM25 keyword search, RRF fusion, CrossEncoder reranker
│   ├── rag/                       # Master pipeline, Context builder, Citation grounder, Deep research loop
│   ├── evaluation/                # RAGAS metrics & Baseline evaluation
│   └── utils/                     # ID generators, PDF magic byte validators, Text utilities
├── scripts/                       # create_indexes.py, seed_data.py
├── tests/                         # Security isolation, JWT, Retrieval, RAG citation tests
├── requirements.txt               # Dependencies
├── .env.example                   # Environment configuration template
└── README.md
```

---

## 3. Environment Configuration (`backend/.env.example`)

| Variable | Description | Default |
| :--- | :--- | :--- |
| `APP_NAME` | Service name | `SciRAG` |
| `API_PREFIX` | Base API prefix | `/api/v1` |
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `MONGODB_DATABASE` | Database name | `scirag` |
| `JWT_SECRET` | Secret key for JWT signing | 32+ characters |
| `XAI_API_KEY` | xAI API key for Grok models | *Server-side only* |
| `XAI_MODEL` | Grok model checkpoint | `grok-2-latest` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account name | Configurable |
| `CLOUDINARY_API_KEY` | Cloudinary access key | Configurable |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | *Server-side only* |
| `EMBEDDING_MODEL` | HuggingFace embedding checkpoint | `BAAI/bge-large-en-v1.5` |
| `RERANKER_MODEL` | HuggingFace CrossEncoder | `cross-encoder/ms-marco-MiniLM-L-6-v2` |
| `CHUNK_SIZE` | Target tokens per chunk | `400` |
| `CHUNK_OVERLAP` | Target overlap tokens | `50` |

---

## 4. API Endpoints (`/api/v1`)

- **Authentication**: `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `GET /auth/me`
- **Papers**: `GET /papers`, `GET /papers/{id}`, `PATCH /papers/{id}`, `DELETE /papers/{id}`, `GET /papers/{id}/sections`, `GET /papers/{id}/chunks`
- **Uploads & Ingestion**: `POST /uploads/paper`, `POST /uploads/import-remote`
- **Retrieval & Search**: `GET /search`, `POST /retrieval/dense`, `POST /retrieval/bm25`, `POST /retrieval/hybrid`, `POST /retrieval/rerank`
- **Research Copilot**: `POST /chat`, `POST /chat/stream` (SSE), `GET /chat/conversations`
- **Provenance**: `GET /citations/{id}`, `GET /citations/paper/{id}`
- **Collections**: `POST /collections`, `GET /collections`, `DELETE /collections/{id}`
- **Synthesis & Comparison**: `POST /summaries/paper/{id}`, `POST /compare`, `POST /research/gaps`, `POST /research/deep`
- **Evaluation**: `POST /evaluation/ragas`, `POST /evaluation/baseline`, `GET /evaluation/results`
- **Health**: `GET /health`

---

## 5. Running the Backend Locally

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run MongoDB indexes
python scripts/create_indexes.py

# Start FastAPI server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 6. Running Tests

```bash
cd backend
pytest tests/ -v
```
