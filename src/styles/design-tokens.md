# CineStream - Design Tokens & Guidelines

Documenting the design system tokens, color palettes, typography specs, and component patterns for the CineStream Vietsub Movie platform.

---

## 1. Color System

### Dark Mode (Primary Theme)
- **Background Main**: `#0a0a0f` (`bg-brand-bg`) - Rich deep void background
- **Surface Level 1**: `#12131c` (`bg-brand-surface`) - Primary card, navigation bar, drawer
- **Surface Level 2**: `#1a1c29` (`bg-brand-surface-light`) - Hover states, active tabs, modal dialogs
- **Surface Border**: `#26293b` (`border-brand-surface-border`) - Subtle divider lines & input outlines
- **Primary Accent (CTA)**: `#ff3b5c` (`bg-brand-accent`) - Crimson Flame (Play buttons, active filters, primary badges)
- **Primary Accent Hover**: `#e02848` (`hover:bg-brand-accent-hover`)
- **Accent Glow**: `rgba(255, 59, 92, 0.25)` (`shadow-accent-glow`)

### Typography Colors
- **Primary Text**: `#f8fafc` (`text-brand-text`) - Off-white / Ivory for maximum readability without eye strain
- **Secondary Text**: `#94a3b8` (`text-brand-muted`) - Soft slate grey for meta info (year, duration, tags)
- **Tertiary/Dim Text**: `#64748b` (`text-brand-dim`) - Disclaimers, copyright, disabled controls
- **Gold Rating**: `#eab308` (`text-brand-gold`) - Star ratings & IMDb indicators

---

## 2. Typography

- **Font Family**: `Be Vietnam Pro`, sans-serif
- **Scale**:
  - `H1 / Display`: 2.25rem - 3rem (36px - 48px), bold (700/800)
  - `H2 / Section Title`: 1.5rem - 1.875rem (24px - 30px), semi-bold (600/700)
  - `H3 / Card Header`: 1.125rem - 1.25rem (18px - 20px), medium (500/600)
  - `Body Regular`: 0.938rem (15px), normal (400)
  - `Body Small / Meta`: 0.813rem (13px), normal (400/500)
  - `Caption / Badge`: 0.75rem (12px), semi-bold (600)

---

## 3. Layout & Aspect Ratios

- **Poster Aspect Ratio**: `2:3` (`aspect-poster`)
- **Backdrop Aspect Ratio**: `16:9` (`aspect-backdrop`)
- **Border Radius**:
  - Small elements (Badges, Buttons): `rounded-md` (6px) or `rounded-lg` (8px)
  - Medium elements (Cards, Controls): `rounded-xl` (12px)
  - Large containers (Modals, Player container): `rounded-2xl` (16px)
- **Container Max Width**: `max-w-7xl` (1280px) with responsive horizontal padding `px-4 sm:px-6 lg:px-8`

---

## 4. Animation & Transitions

- **Hover Transition**: `transition-all duration-200 ease-out`
- **Poster Card Hover**: `transform hover:scale-105 transition-transform duration-300 ease-out`
- **Shimmer Loading**: Infinite pulse/shimmer animation for Skeleton components
