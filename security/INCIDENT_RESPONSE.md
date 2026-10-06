# SciRAG Incident Response Plan

This document establishes the incident response protocol for detecting, containing, analyzing, and recovering from security anomalies affecting SciRAG services and researcher data.

---

## 1. Severity Classification

| Level | Definition | Response SLA | Escalation Path |
| :--- | :--- | :--- | :--- |
| **SEV-1 (Critical)** | Active data exfiltration, compromise of vector store namespaces, unauthorized database access, or arbitrary code execution. | Immediate (< 15 mins) | Security Lead, CTO, On-Call Engineering, Legal Counsel |
| **SEV-2 (High)** | Failure of authentication rate limits, suspected indirect prompt injection on document ingestion, localized tenant permission leak. | < 1 hour | Security Engineering, Backend Leads |
| **SEV-3 (Medium)** | Minor dependency vulnerability, abnormal API traffic spikes, isolated XSS report in sandboxed iframe. | < 6 hours | Triage Engineer, Frontend Lead |
| **SEV-4 (Low)** | Informational finding, minor UI bug with zero security exploitability. | < 48 hours | Standard Development Backlog |

---

## 2. Response Lifecycle

### Phase 1: Identification & Triage
- Automated detection via cloud SIEM alerts, runtime anomaly monitors, and audit log analysis.
- Security officer verifies exploitability and assigns a SEV level.
- Incident commander (IC) and communication liaison appointed.

### Phase 2: Containment
- **Short-term containment**:
  - Revoke active user sessions and refresh tokens via global Redis invalidation.
  - Temporarily throttle or isolate affected endpoints or tenant namespaces.
  - Rotate exposed service credentials or IAM keys.
- **Long-term containment**:
  - Deploy targeted WAF rules and patch identified attack vectors.

### Phase 3: Investigation & Eradication
- Perform forensic analysis on immutable access logs, vector index logs, and file storage hashes.
- Identify the root cause, ingress path, and full blast radius of the incident.
- Eradicate malicious artifacts, unauthorized records, and compromised dependencies.

### Phase 4: Recovery & Validation
- Restore services from verified clean backups if necessary.
- Validate system integrity via automated integration and penetration test suites.
- Gradually restore user traffic and verify nominal operations under heightened monitoring.

### Phase 5: User Notification & Compliance
- If user document confidentiality is compromised, notify affected researchers and institutional compliance officers within 72 hours in compliance with GDPR, FERPA, and academic data agreements.
- Provide transparent incident advisories detailing affected scope and protective actions taken.

### Phase 6: Post-Incident Review (PIR)
- Conduct blameless post-mortem within 5 business days.
- Publish documented root-cause analysis (RCA) with preventative action items assigned to upcoming engineering sprints.
