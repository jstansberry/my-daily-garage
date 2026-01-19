# Project Redesign Phases

This document outlines the roadmap for the complete redesign and expansion of the application. The goal is to modernize the tech stack, visual identity, and scalability of the platform.

Each phase is designed to be executed sequentially.

---

## Phase 1: Architecture & Reliability
**Theme:** *Bulletproof Engine.* Establishing the testing harness and ensuring efficient routing before handling the UI.

- [x] **1.A: Route Standardization**
    - Ensure strict route hierarchy:
        - `/games/daily-wager`
        - `/games/driving-blind`
        - `/games/grand-prix`
    - Implement a dynamic `GameLayout` wrapper for shared game UI elements (header, footer, score tracking).
- [x] **1.B: Test Framework Initialization**
    - Install and configure Vitest (or Jest) and React Testing Library.
    - Create `src/tests/setup.js` and configuration files.
    - Configure CI/CD pipeline (if applicable) or pre-commit hooks.
- [ ] **1.C: Baseline Unit Testing**
    - Write unit tests for critical utilities (e.g., Score calculation logic).
    - Write component tests for `Login`, `Header`, and basic `GameContainer` rendering.

## Phase 2: Visual Identity & "F1 2026" Redesign
**Theme:** *The "Haas 2026" Makeover.* Modern, sleek, sci-fi aesthetic with high contrast and smooth motion.

- [ ] **2.A: Brand Identity Creation**
    - **Design System:** Define CSS Variables for the new palette (e.g., `--color-chassis-carbon`, `--color-aero-red`, `--color-track-asphalt`).
    - Typography: Select modern, wide/geometric fonts for headers and legible sans-serif for UI.
- [ ] **2.B: UI Shell Implementation**
    - Build a new `NavBar` with glassmorphism and motion effects.
    - Create a reusable `Card` and `Panel` component with the new "Sci-Fi" borders and shadings.
    - Implement a new global Background (animated subtle grid or dark gradient).
- [ ] **2.C: Page Reskinning**
    - Update Home/Dashboard page.
    - Update individual game containers to inherit the new theme.
    - Ensure mobile responsiveness is "Premium" (no layout shifts, smooth transitions).
- [ ] **2.D: Logo & Brand Assets**
    - **Logo:** Design a new vector logo (using `generate_image` for ideation/assets) that fits the "Sleek F1" vibe.

## Phase 3: Data Modernization & Schema Refactor
**Theme:** *Foundation First.* preparing the database for scalability and consistency.

- [ ] **3.A: Supabase Dev Environment Setup**
    - Connect to the new "Dev" Supabase project.
    - Convert the provided `supabase.sql` dump into proper Supabase CLI migration files.
    - Implement Row Level Security (RLS) policies within the migrations.
    - Verify the Dev database matches Prod structure.
- [ ] **3.B: Database Schema Audit & Planning**
    - Analyze existing tables (`daily_games`, `driving_blind`, `user_scores`, etc.).
    - Map out new naming conventions (e.g., prefixing per game like `game_daily_car`, `game_driving_blind`).
    - Design the `global_leaderboard` schema to aggregate scores from multiple disparate game tables.
- [ ] **3.C: Database Migration**
    - Rename `daily_games` to `games_daily_wager`.
    - Rename `driving_blind` to `games_driving_blind`.
    - Rename `user_scores` to `scores_daily_wager` (or migrate to a unified scoring table).
    - Update all foreign key relationships.
- [ ] **3.D: Backend Logic Updates**
    - Update Supabase client calls in `src/lib` and components to reference new table names.
    - Create a specialized "Repair" script to verify no data was lost during renaming.

## Phase 4: Social & Competition Features
**Theme:** *Community & Virality.* Connecting players and encouraging sharing.

- [ ] **4.A: Global Leaderboard Implementation**
    - Create the `GlobalLeaderboard` component.
    - Implement the logic to sum scores from all active games for a "Daily Total".
    - Design the Leaderboard UI (Rank, User, Total Score, breakdown by game).
- [ ] **4.B: Social Sharing Engine**
    - Create a `ShareButton` component.
    - Implement logic to generate a text/image summary (like Wordle squares or formatted text) for each game.
    - "I scored X points on My Daily Garage! 🏎️"
    - Add Open Graph dynamic image generation (optional advanced step).

## Phase 5: Scalability & Expansion
**Theme:** *Unlocking Potential.* Preparing the admin for n-games and launching new titles.

- [ ] **5.A: Universal Admin Dashboard**
    - Refactor `AdminDashboard` to be data-driven.
    - Instead of hardcoded tabs, fetch "Registered Games" from a config/DB.
    - Create a generic "Game Editor" interface that adapts based on the game's schema.
- [ ] **5.B: New Game Development (Game #4)**
    - Scaffold files for Game 4.
    - Implement Game 4 Logic & UI.
    - Add to Routes and Leaderboard.
- [ ] **5.C: New Game Development (Game #5)**
    - Scaffold files for Game 5.
    - Implement Game 5 Logic & UI.
    - Final Polish & Integration.
