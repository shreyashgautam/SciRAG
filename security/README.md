# SciRAG Security Philosophy & Governance

## 1. Security Philosophy
SciRAG operates under the premise that scientific literature, research inquiries, annotations, and unreleased preprints represent intellectual property and sensitive academic assets. Our security model enforces defense-in-depth across frontend interactions, the FastAPI retrieval-augmented generation (RAG) backend, and underlying MongoDB Atlas and Cloudinary data stores.

The guiding principles are:
- **Zero-Trust Access**: No client request is inherently trusted; all actions are authenticated via JWT Bearer tokens and authorized against user ownership records.
- **Strict Cross-User Isolation**: Every MongoDB query and vector similarity search strictly enforces `owner_id = current_user.id` to eliminate multi-tenant data leakage.
- **Evidence Provenance & Integrity**: Retrieved passages and citations map strictly to verified vector chunks (`[S1]`, `[S2]`) to prevent citation spoofing or phantom reference generation.
- **Passive Data Separation (Anti-Prompt Injection)**: Retrieved literature passages are injected as passive DATA blocks separated from system instructions.
- **No Secret Exposure in Client Code**: `XAI_API_KEY`, `MONGODB_URI`, `CLOUDINARY_API_SECRET`, and `JWT_SECRET` remain strictly server-side.

---

## 2. Security Controls & Architecture

| Attack Surface | Threat | Mitigation in SciRAG Backend |
| :--- | :--- | :--- |
| **Authentication** | Broken Authentication, Credential Stuffing, Session Hijacking | Argon2 / Bcrypt password hashing, short-lived JWT access tokens (30m), signed refresh tokens (7d), constant-time verification. |
| **PDF Ingestion** | Malicious PDFs, Polyglot Files, Zip Bombs | File size limits (25MB), magic header byte inspection (`%PDF-`), PyMuPDF safe text-only parsing, Cloudinary authenticated uploads. |
| **Vector Search** | Cross-User Data Leakage, Retrieval Poisoning | Vector queries enforce MongoDB compound filters `{"owner_id": current_user.id}`. Chunks from other users are mathematically inaccessible. |
| **Generation** | Indirect Prompt Injection, Hallucinated Citations | Strict system prompt rules; retrieved text is sandboxed as passive data; hallucinated citations (`[S99]`) are systematically rejected. |
| **API Endpoints** | API Abuse, Denial of Service | Centralized rate limiting middleware, request payload limits, structured logging without secret leaks. |
| **Frontend Interface** | Cross-Site Scripting (XSS), CSRF | React JSX context escaping, strict Content Security Policy headers, no dangerous `eval` or inline HTML rendering of PDF extracts. |
