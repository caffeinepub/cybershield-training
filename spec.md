# Alangh Academy

## Current State
The app has a single `/admin` route rendering `AdminPortal.tsx` with tabs for Users, Courses, and Enrollments. It is guarded by an `isAdmin` check via Internet Identity.

## Requested Changes (Diff)

### Add
- `/admin/login` — Admin login page with username/password form. Uses localStorage-based session (hardcoded credentials: admin / alangh@2024). Redirects to `/admin/dashboard` on success.
- `/admin/dashboard` — Overview page with stat cards: total registered users, total courses, upcoming sessions, recent registrations list.
- `/admin/users` — Full user management table showing registrations from the public registration form (stored in localStorage), with columns: Name, Email, Phone, Registration Date, Self-Assessment Score. Includes search/filter.
- `/admin/courses` — Course content management with list of all hardcoded courses (Beginner/Intermediate), ability to add notes or announcements per course (stored locally), and enrollment stats.
- `/admin/schedule` — Training session scheduling page. Admins can add/edit/delete training sessions with fields: Session Title, Course, Date, Time, Mode (Online/Hybrid/Onsite), Max Participants, Description. Sessions stored in localStorage.
- `AdminLayout` component — Shared sidebar layout for all admin pages with navigation links, Alangh Academy branding, logout button. Sidebar links: Dashboard, Users, Courses, Schedule. Does NOT use the main Navbar/Footer.
- Admin routes added to App.tsx under `/admin/*` prefix, each protected by login session check.

### Modify
- `App.tsx` — Replace single `/admin` route with nested admin routes: `/admin/login`, `/admin/dashboard`, `/admin/users`, `/admin/courses`, `/admin/schedule`. The old AdminPortal route redirects to `/admin/login`.

### Remove
- Old single-tab `AdminPortal.tsx` replaced by the new multi-page system.

## Implementation Plan
1. Create `src/frontend/src/pages/admin/AdminLogin.tsx` — login form with localStorage session
2. Create `src/frontend/src/pages/admin/AdminLayout.tsx` — sidebar layout with nav and logout
3. Create `src/frontend/src/pages/admin/AdminDashboard.tsx` — stats overview
4. Create `src/frontend/src/pages/admin/AdminUsers.tsx` — user management table
5. Create `src/frontend/src/pages/admin/AdminCourses.tsx` — course management
6. Create `src/frontend/src/pages/admin/AdminSchedule.tsx` — session scheduling CRUD
7. Update `App.tsx` to wire all new admin routes
