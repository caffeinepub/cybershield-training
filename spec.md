# Alangh Academy — ICP Backend: User Registration & Login (Stage 1)

## Current State
All user registration and login data is stored in browser localStorage (`alangh_users` key). This means data is device-specific, not persistent across devices, and lost if the browser is cleared. The backend canister exists and manages courses/chapters/enrollments, but has no knowledge of user accounts (username/password).

The frontend Register page collects: fullName, username, email, password (hashed), phone, address, profile bio, reason.
The frontend Login page authenticates by matching username + passwordHash against localStorage.

## Requested Changes (Diff)

### Add
- Backend `UserAccount` type: username, fullName, email, passwordHash, phone, address, profileBio, reason, createdAt, isDisabled, enrolledCourse (optional text), assessmentScore (optional Nat), assessmentPassed (optional Bool)
- `registerUser(username, fullName, email, passwordHash, phone, address, profileBio, reason)` — public (no caller auth), returns error text if username/email already taken
- `loginUser(username, passwordHash)` — public, returns UserAccount or null
- `getUserByUsername(username)` — admin only, returns full UserAccount
- `getAllRegisteredUsers()` — admin only, returns all UserAccounts
- `adminResetUserPassword(username, newPasswordHash)` — admin only
- `adminSetUserDisabled(username, isDisabled)` — admin only
- `adminDeleteUser(username)` — admin only
- `adminAssignCourse(username, enrolledCourse)` — admin only
- `saveAssessmentResult(username, score, passed)` — public (user saves their own result after login)
- `getMaskedEmailByUsername(username)` — public, for forgot-password flow: returns masked email if username exists
- Keep all existing course/chapter/enrollment/progress backend APIs unchanged

### Modify
- Existing UserProfile to remain as-is (used for Internet Identity profiles)
- No changes to existing course management functions

### Remove
- Nothing removed from backend

## Implementation Plan
1. Add `UserAccount` stable data type and `Map<Text, UserAccount>` storage (keyed by username)
2. Add secondary index `emailToUsername: Map<Text, Text>` for uniqueness checks
3. Implement all public and admin user management functions
4. Preserve all existing course/chapter/progress functions
5. Update frontend Register.tsx to hash password client-side (SHA-256 via crypto.subtle) and call `registerUser` backend function
6. Update frontend Login.tsx to hash password and call `loginUser` backend function; store returned user data in sessionStorage/localStorage for session
7. Update frontend ForgotPassword.tsx to call `getMaskedEmailByUsername`
8. Update AdminUsers page to call `getAllRegisteredUsers`, `adminResetUserPassword`, `adminSetUserDisabled`, `adminDeleteUser`, `adminAssignCourse`
