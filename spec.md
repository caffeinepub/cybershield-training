# Alangh Academy — Stage 2 Backend Integration

## Current State
- Stage 1 complete: User registration, login, and assessment results persist to ICP backend canister
- Certificates: stored in browser localStorage only
- Training resource metadata: stored in browser localStorage; file binaries in IndexedDB
- Audit logs: stored in browser localStorage only
- Admin certificate management reads/writes localStorage
- Admin training content upload reads/writes localStorage + IndexedDB

## Requested Changes (Diff)

### Add
- Backend: `Certificate` type with fields: certificateId, username, fullName, email, courseId, courseName, issuedAt, revokedAt
- Backend: `issueCertificate`, `revokeCertificate`, `getCertificateById`, `getAllCertificates`, `getCertificatesByUsername` functions
- Backend: `TrainingResource` type with fields: id, courseLevel, title, description, resourceType, url, content, fileName, uploadedAt, isActive
- Backend: `addTrainingResource`, `updateTrainingResource`, `deleteTrainingResource`, `getAllTrainingResources`, `getActiveResourcesByLevel` functions
- Backend: `AuditLog` type with fields: id, timestamp, actor, actorType, action, details, resource
- Backend: `addAuditLog`, `getAuditLogs`, `getAuditLogsByActor` functions
- Frontend: backend API calls in AdminCertificates.tsx for issue/revoke/load
- Frontend: backend API calls in AdminTrainingContent.tsx for CRUD resource metadata
- Frontend: backend API calls in auditLog.ts lib to persist logs server-side
- Frontend: UserProfile.tsx loads certificates from backend
- Frontend: CourseLearn.tsx loads active training resources from backend

### Modify
- AdminCertificates.tsx: replace localStorage reads/writes with backend calls; keep localStorage as fallback
- AdminTrainingContent.tsx: save/load resource metadata from backend; file binaries stay in IndexedDB
- SelfAssessment.tsx: check backend for certificate on pass screen
- lib/auditLog.ts: push logs to backend in addition to localStorage
- backend.d.ts: add new type definitions

### Remove
- Nothing removed; localStorage kept as fallback for offline resilience

## Implementation Plan
1. Generate new Motoko backend with Certificate, TrainingResource, AuditLog stable storage and all CRUD functions
2. Update backend.d.ts with new TypeScript type definitions
3. Update AdminCertificates.tsx to call backend APIs
4. Update AdminTrainingContent.tsx to persist metadata to backend
5. Update lib/auditLog.ts to also call backend addAuditLog
6. Update UserProfile.tsx and CourseLearn.tsx to load from backend
7. Validate and deploy
