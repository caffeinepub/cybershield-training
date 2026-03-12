# Alangh Academy

## Current State
The platform has a home page with multiple sections, a registration page at `/register`, and various informational/course pages. The registration form captures Name, Email, Phone, Address, profile/work experience, and motivation. After successful submission, it currently shows a success message inline.

## Requested Changes (Diff)

### Add
- New `/self-assessment` route and `SelfAssessment.tsx` page
- Self-assessment section on the home page (Landing.tsx) with a brief description and a button linking to `/register`
- 40-question data pool (all questions from Chapters 1-7) defined as a constant
- Logic to randomly select 20 questions per attempt, ensuring no repeat questions from previous attempt (tracked in sessionStorage)
- Multi-choice and single-choice question support
- Scoring: pass = 16+ out of 20 correct
- Pass state: success message + CTA to enroll in courses
- Fail state: score display + option to retake (loads 20 NEW questions not from previous set)

### Modify
- `Register.tsx`: after successful form submission, redirect user to `/self-assessment` instead of showing inline success message
- `App.tsx`: add `selfAssessmentRoute` at path `/self-assessment`

### Remove
- Nothing removed

## Implementation Plan
1. Create `src/frontend/src/pages/SelfAssessment.tsx` with full question bank (40 questions), random selection of 20, answer tracking, scoring, pass/fail states, retake logic using sessionStorage to avoid question repeats
2. Update `App.tsx` to add the `/self-assessment` route
3. Update `Register.tsx` to redirect to `/self-assessment` on successful submission
4. Update `Landing.tsx` to add a self-assessment section with description and "Start Self-Assessment" button linking to `/register`
