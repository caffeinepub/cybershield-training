# Alangh Academy

## Current State
- Login page asks for Full Name + Email Address, finds user by email match
- Register page captures name, email, phone, address, profile, reason — no password
- User passwords are not stored; authentication is identity-based (name+email lookup)
- Build script calls `pnpm copy:env` which fails on Cloudflare (pnpm not available)

## Requested Changes (Diff)

### Add
- Password field on registration form with real-time policy feedback
- Confirm Password field on registration form with match validation
- Password stored (hashed via btoa for client-side storage) alongside user record
- Password field on login form
- Password complexity policy: min 8 chars, uppercase, lowercase, number, special character
- Visual password strength indicator on registration
- Show/hide password toggle on both password fields

### Modify
- Register.tsx: add password + confirm password fields; validate policy before submit; store password hash with user
- Login.tsx: replace Full Name field with Password field; authenticate by email + password match
- package.json: fix build script — replace `vite build && pnpm copy:env` with a node-based copy that works everywhere
- vite.config.ts: handle env.json copy via plugin so no shell command needed

### Remove
- Full Name field from Login page (login now uses email + password)
- Name-based lookup fallback in login

## Implementation Plan
1. Fix build script in package.json: change `build` to `vite build && node -e "require('fs').copyFileSync('env.json','dist/env.json')"` — works on any environment without pnpm
2. Update Register.tsx:
   - Add `password` and `confirmPassword` fields to form state
   - Add password policy validation helper (uppercase, lowercase, number, special char, min 8)
   - Real-time policy checklist shown under password field
   - Show/hide toggle for both password fields
   - On submit, store password with user object (btoa encode for basic obfuscation)
3. Update Login.tsx:
   - Replace name field with password field
   - Authenticate: find user by email, then verify password
   - Show clear error if email not found vs password wrong
   - Show/hide toggle for password field
