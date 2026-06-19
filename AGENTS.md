# AGENTS.md

## Project Overview

Next.js 16 (App Router) platform for "Turnt" — a Chennai-based Gen-Z hangout community focused on high-energy IRL meetups, chill/wild events, and bucket-list activities. Single-page app currently, expanding into a full-stack platform with user authentication and event management. React 19, TypeScript configured but components are `.jsx`, pages are `.js`.

## Core Brand Identity (Crucial for Copywriting & UI)

- **Vibe:** High energy, good vibes, no boring scenes.
- **Audience:** Gen-Z individuals in Chennai who actually want to show up IRL, not just text.

## Commands

- `npm run dev` — dev server on localhost:3000
- `npm run build` — production build
- `npm run lint` — ESLint (next/core-web-vitals + typescript presets)
- No test suite exists

## File Conventions & Refactoring Rules

- Components: `app/components/*.jsx` (not `.tsx`)
- Pages: `app/page.js`, `app/eventbooking/page.js` (plain `.js`)
- Path alias: `@/*` maps to project root
- **Refactoring Mandate:** Break down large files. For example, `EventBookingPage.jsx` (currently ~1065 lines) must be modularized into smaller sub-components (e.g., `EventDetails.jsx`, `PaymentStep.jsx`, `TicketView.jsx`) housed in a dedicated `features/eventbooking/` or `components/eventbooking/` directory. Do not shorten program files for brevity when generating code.

## Styling & Animations

- `app/layout.js` loads fonts via `<link>` tags (Google Fonts + cdnfonts) — not `next/font`
- **Tailwind Mandate:** Transition entirely to Tailwind CSS v4 utility classes. You are permitted to integrate external drop-in Tailwind components. Phase out plain CSS files where possible to ensure UI consistency.
- Animations: framer-motion in Hero, custom requestAnimationFrame in Navbar

## Backend & Feature Architecture (Supabase)

- **Database/Auth Provider:** Supabase. Read migration files for context.
- **Authentication:**
  - Phase 1: Email + Password (No magic links).
  - Phase 2: Google OAuth.
  - Required User Fields: Full Name, Username, WhatsApp Number (Mandatory), Instagram Handle (Optional).
- **Event Flow:**
  - Events display: Name, Description, Registration Link (Razorpay), Date & Time, Venue, Ticket Price.
  - "Interested" Feature: Acts as a bookmark for users. Admins can view a list/count of interested users. Status remains as "Interested" even after booking.
- Razorpay test key is hardcoded for demo — production requires backend order creation.

## Gotchas

- `npm run lint` does not pass a path — runs on entire project
- No `npm run typecheck` script — use `npx tsc --noEmit` if needed
- Remote images allowed only from `images.unsplash.com` and `images.pexels.com` (configured in `next.config.ts`)
- `.env*` files are gitignored. Always provide template environment variables in a `.env.example` file when adding new backend services.

Whenever you take an action or learn new information that alters the team's workflow, capabilities, or setup, you must immediately update this [AGENTS.md] file to reflect the changes.
