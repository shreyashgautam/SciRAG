# SciRAG Data Protection Specification

This document details data protection standards, encryption practices, confidentiality tiers, and document lifecycle governance for academic research assets.

---

## 1. Research Paper Privacy
Academic preprints, grant drafts, and literature compilations often contain patent-pending concepts or embargoed results. SciRAG treats all ingested documents as confidential private assets by default:
- **Private By Default**: Uploaded papers are restricted exclusively to the uploader's account and authorized research workspace collections.
- **No Training on User Papers**: User document texts, embeddings, queries, and conversational dialogues are **never** utilized to train foundation models or fine-tune public embeddings.
- **Zero Public Indexing**: User papers are never indexed into public search engines or unauthenticated knowledge graphs.

## 2. Data Minimization & Sanitization
- Only text, vector representations, and essential document metadata (authors, title, publication date, DOI, abstract) are extracted.
- Embedded metadata tracking tags, camera metadata, and tracking pixels inside uploaded PDFs are stripped during document normalization.

## 3. Environment Variables & Secrets Management
- All secrets, API keys, database credentials, and service accounts are managed strictly server-side using Google Cloud Secret Manager or AWS Secrets Manager.
- Frontend `.env` files contain only public runtime variables (`VITE_APP_NAME`, `VITE_API_BASE_URL`).
- Git repository enforces automated pre-commit scanning (`gitleaks`) and `.gitignore` controls to prevent inadvertent credential leakage.

## 4. Encryption In Transit & At Rest
- **In Transit**: All HTTP communications are enforced via TLS 1.3 with strict HTTP Strict Transport Security (`HSTS: max-age=63072000; includeSubDomains; preload`). Weak cipher suites are rejected.
- **At Rest**: 
  - Raw PDF files stored in encrypted object storage (AES-256 with Customer-Managed Encryption Keys / KMS).
  - Relational metadata stored in PostgreSQL encrypted with LUKS and table-level column encryption for sensitive fields.
  - Vector embeddings encrypted at rest within the vector index.

## 5. File Upload Validation
- Strict validation pipeline:
  1. Maximum file size capped at 50 MB.
  2. Magic byte verification (`%PDF-1.` format signature) to prevent disguised executable uploads.
  3. Antivirus and malware sandboxing (ClamAV / VirusTotal API) prior to parsing.
  4. Disabling PDF action scripts, embedded macros, and external hyperlink execution.

## 6. Data Retention, Export & Deletion
- **User Data Export**: Researchers can export their complete library metadata, citation graph exports (BibTeX, RIS, JSON-LD), and chat transcripts via `/settings/privacy`.
- **Permanent Account Deletion**: When an account is terminated:
  - Document files are purged from object storage within 24 hours.
  - Vector embeddings and chunk indices are erased from vector databases immediately.
  - Relational records undergo cryptographic erasure and hard-deletion after a 7-day safety retention grace period.
