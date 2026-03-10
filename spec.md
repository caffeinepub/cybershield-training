# CyberShield Training (Alangh Academy)

## Current State
The landing page (Landing.tsx) has a hero section with generic "Defend. Attack. Dominate." copy, a features grid, a featured courses preview, and a CTA. The navbar/footer brand says "CyberShield".

## Requested Changes (Diff)

### Add
- Hero: new headline "Cybersecurity isn't just for hackers. It's for everyone!" + subtext + "Explore Learning Paths" CTA button
- Hero background: use generated hero-shield image
- "Why Cybersecurity" section with career infographic image (/assets/generated/career-infographic.dim_800x500.png) and 5 stats cards (High Demand, Competitive Salary, Job Security, Remote Friendly, Global Opportunities)
- "Why Alangh Academy" section with descriptive copy and 4 differentiator cards (Structured Paths, Real-World Labs, Role-Based Training, Mentorship)
- "Who is this For" section with 4 persona cards: Complete Beginner, IT Professional, Non-Tech Background, Career Switcher
- "Where Should I Start" section with path-decision infographic (/assets/generated/start-path-infographic.dim_800x500.png) and 4 clickable persona options
- Testimonials section with 3 placeholder testimonial cards
- FAQ accordion section with all 8 questions from the provided content
- Final CTA banner: "Ready to Start Your Cybersecurity Journey? This is your launchpad."
- Update navbar/footer brand name from "CyberShield" to "Alangh Academy"

### Modify
- Landing.tsx hero copy and structure to match new brand messaging
- Navbar brand name to "Alangh Academy"
- Footer brand name to "Alangh Academy"

### Remove
- Old hero copy: "Defend. Attack. Dominate."
- Old features section (replaced by Why Alangh Academy)

## Implementation Plan
1. Update Landing.tsx with all new sections using provided content and generated images
2. Update Navbar.tsx brand name to "Alangh Academy"
3. Update Footer.tsx brand name to "Alangh Academy"
4. Use Accordion component for FAQ section
5. Add motion animations on all sections (already using framer-motion)
