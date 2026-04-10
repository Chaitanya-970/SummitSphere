# DESIGN.md — SummitSphere 🏔️

> Agent-readable design system for SummitSphere — India's community-driven Himalayan trekking platform.
> Drop this file in your project root and reference it in every AI prompt for perfectly consistent UI.

---

## 1. Brand Identity

**Product name:** SummitSphere  
**Tagline:** India's Trail Network  
**Tone:** Adventurous yet refined. Think editorial outdoor magazine meets modern SaaS. Never overly playful or corporate.  
**Audience:** Trekkers, outdoor enthusiasts, adventure travellers in India.  
**Platform:** React + Vite + Tailwind CSS (with CSS custom properties for theming).

---

## 2. Color System

All colors are defined as CSS custom properties on `:root` (light) and `.dark` (dark).
**Always use `var(--token-name)` — never hardcode hex values in components.**

### Light Mode (`:root`)

| Token | Value | Usage |
|---|---|---|
| `--bg-primary` | `#faf9f6` | Page background, main canvas |
| `--bg-secondary` | `#f2ede4` | Section backgrounds, footer |
| `--bg-card` | `#ffffff` | Card surfaces, modals, dropdowns |
| `--bg-input` | `#f5f0e8` | Input field backgrounds |
| `--bg-nav` | `rgba(250,249,246,0.94)` | Sticky navbar (with backdrop-filter) |
| `--text-primary` | `#1a1208` | Headings, body, primary text |
| `--text-secondary` | `#4a3f2f` | Sub-headings, secondary labels |
| `--text-muted` | `#8c7b65` | Captions, placeholders, nav links |
| `--text-faint` | `#b5a48e` | Meta labels, timestamps, dividers |
| `--border-primary` | `#e5ddd0` | Main borders |
| `--border-light` | `#ede8df` | Subtle dividers, card borders |
| `--accent-green` | `#2d6a4f` | Primary CTA, icons, active states |
| `--accent-green-light` | `#52b788` | Hover states, hero accent text |
| `--accent-green-bg` | `#d8f3dc` | Badge backgrounds, highlight areas |
| `--accent-amber` | `#c77b2a` | Moderate difficulty, warnings |
| `--accent-amber-bg` | `#fef3e2` | Amber badge backgrounds |
| `--accent-rose` | `#c0392b` | Hard difficulty, danger, delete |
| `--accent-rose-bg` | `#fde8e6` | Rose badge backgrounds |

### Dark Mode (`.dark`)

| Token | Value | Usage |
|---|---|---|
| `--bg-primary` | `#0d1117` | Page background |
| `--bg-secondary` | `#161b22` | Section backgrounds |
| `--bg-card` | `#1c2128` | Card surfaces |
| `--bg-input` | `#21262d` | Input backgrounds |
| `--bg-nav` | `rgba(13,17,23,0.96)` | Sticky navbar |
| `--text-primary` | `#e6d9c5` | Primary text |
| `--text-secondary` | `#c9b99a` | Secondary text |
| `--text-muted` | `#8b7a66` | Muted text |
| `--text-faint` | `#5a4f43` | Faint text |
| `--border-primary` | `#30363d` | Borders |
| `--border-light` | `#21262d` | Light borders |
| `--accent-green` | `#52b788` | Primary green (brighter in dark) |
| `--accent-green-light` | `#74c69d` | Light green |
| `--accent-green-bg` | `#1a3a2a` | Green badge bg |
| `--accent-amber` | `#e09132` | Amber |
| `--accent-amber-bg` | `#2d1f0e` | Amber bg |
| `--accent-rose` | `#f85149` | Rose/danger |
| `--accent-rose-bg` | `#2d1a1a` | Rose bg |

### Shadow Tokens

```css
--shadow-sm:     0 1px 3px rgba(26,18,8,0.08)
--shadow-md:     0 4px 16px rgba(26,18,8,0.10)
--shadow-lg:     0 12px 40px rgba(26,18,8,0.14)
--shadow-accent: 0 8px 30px rgba(45,106,79,0.25)   /* green glow */
```

---

## 3. Typography

### Font Families

| Role | Font | Import |
|---|---|---|
| **Display / Brand** | `Fraunces` | Google Fonts — italic, weights 300/400/700/900 |
| **UI / Body** | `Syne` | Google Fonts — weights 400/500/600/700/800 |

```css
/* Google Fonts import (already in index.css) */
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Fraunces:ital,wght@0,300;0,400;0,700;0,900;1,300;1,700;1,900&display=swap');

font-family: 'Syne', system-ui, sans-serif;      /* default body */
font-family: 'Fraunces', Georgia, serif;           /* display class */
```

### Type Scale & Usage Rules

| Element | Font | Style | Size | Weight | Notes |
|---|---|---|---|---|---|
| Hero H1 | Fraunces | italic | `clamp(36px, 9vw, 100px)` | 900 | letter-spacing `-0.04em` |
| Page H2 | Fraunces | italic | `clamp(28px, 4vw, 38px)` | 900 | letter-spacing `-0.03em` |
| Card title | Fraunces | italic | `22px` | 900 | letter-spacing `-0.02em` |
| Section H3 | Fraunces | italic | `18–24px` | 700–900 | |
| Body text | Syne | normal | `14–16px` | 400–500 | line-height 1.6–1.7 |
| Labels / caps | Syne | UPPERCASE | `9–11px` | 700 | letter-spacing `0.1–0.2em` |
| Buttons | Syne | UPPERCASE | `11–12px` | 700 | letter-spacing `0.06–0.1em` |
| Meta / faint | Syne | normal | `11–12px` | 500–600 | color `var(--text-faint)` |

**Utility class:** `.font-display` applies `font-family: 'Fraunces', Georgia, serif`.

### Typography Rules
- Headlines always use **Fraunces italic** — this is the brand signature.
- Never use Fraunces for body copy or buttons.
- All-caps micro-labels (e.g. "DURATION", "ALTITUDE", "EXPLORER") use Syne 700 with heavy letter-spacing.
- Line-height for display text: `0.95–1.1`. For body: `1.6–1.7`.

---

## 4. Spacing & Layout

### Grid System
- Max content width: `1400px` centered with `margin: 0 auto`
- Default horizontal padding: `24px` desktop, `16px` mobile
- Section vertical gaps: `56–80px`
- Card grid: `repeat(auto-fill, minmax(300px, 1fr))` with `24px` gap

### Spacing Scale
| Name | Value | Usage |
|---|---|---|
| xs | `6–8px` | Icon padding, tiny gaps |
| sm | `12–14px` | Inline gaps, badge padding |
| md | `16–20px` | Card padding, section gaps |
| lg | `24–32px` | Component spacing |
| xl | `48–56px` | Section-level spacing |
| 2xl | `72–80px` | Page-level gaps |

---

## 5. Component Patterns

### 5.1 Buttons

**Primary CTA (dark fill):**
```css
background: var(--text-primary);
color: var(--bg-primary);
padding: 13px 20px;
border-radius: 12px;
font-family: Syne;
font-weight: 700;
font-size: 11px;
letter-spacing: 0.1em;
text-transform: uppercase;

/* Hover */
background: var(--accent-green);
transform: translateY(-1px);
```

**Green CTA (accent):**
```css
background: var(--accent-green);
color: white;
padding: 8px 16px;
border-radius: 10px;
font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;

/* Hover */
background: var(--accent-green-light);
```

**Ghost / Icon button:**
```css
padding: 8px;
border-radius: 10px;
color: var(--text-muted);
background: transparent;
border: none;
transition: all 0.2s;

/* Hover */
background: var(--accent-green-bg);
color: var(--accent-green);
```

**Danger button:**
```css
background: var(--accent-rose-bg);
color: var(--accent-rose);
border: 1px solid rgba(192,57,43,0.2);
border-radius: 12px; padding: 14px 16px;
```

### 5.2 Cards (Trek Cards)

```css
background: var(--bg-card);
border: 1px solid var(--border-light);
border-radius: 20px;
overflow: hidden;
box-shadow: var(--shadow-sm);

/* Hover (class: trek-card) */
transform: translateY(-5px);
transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease;
```

- Image height: `220px`, `object-fit: cover`
- Always add gradient overlay on card image: `linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)`
- Card content padding: `20px`
- Always include difficulty badge on image (bottom-left)

### 5.3 Difficulty Badges

```css
/* Easy */   background: var(--accent-green-bg); color: var(--accent-green);
/* Moderate */ background: var(--accent-amber-bg); color: var(--accent-amber);
/* Hard */   background: var(--accent-rose-bg);  color: var(--accent-rose);

/* Shared */
padding: 4px 12px; border-radius: 20px;
font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
```

### 5.4 Input Fields (`.input-field`)

```css
width: 100%;
background: var(--bg-input);
border: 2px solid var(--border-light);
border-radius: 14px;
padding: 14px 18px;
color: var(--text-primary);
font-family: 'Syne', sans-serif;
font-weight: 500;
font-size: 14px;

/* Focus */
border-color: var(--accent-green);
background: var(--bg-card);
box-shadow: 0 0 0 4px rgba(82,183,136,0.12);
```

### 5.5 Navbar

```css
background: var(--bg-nav);
border-bottom: 1px solid var(--border-light);
backdrop-filter: blur(16px);
-webkit-backdrop-filter: blur(16px);
position: sticky; top: 0; z-index: 1000;
height: 60px;
```

- Logo: Mountain icon in green rounded square + "Summit**Sphere**" in Fraunces italic 900
- Brand green accent only on "Sphere" part of the logo text

### 5.6 Dark Mode Toggle (FAB)

```css
position: fixed; bottom: 28px; right: 28px;
width: 54px; height: 54px; border-radius: 50%;
background: var(--accent-green);
color: white;
box-shadow: var(--shadow-accent);
border: 2px solid rgba(255,255,255,0.15);
backdrop-filter: blur(10px);
z-index: 9999;
transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);

/* Hover */
transform: scale(1.12) rotate(20deg);
```

### 5.7 Stat Tiles (inside cards / detail pages)

```css
/* Icon container */
width: 34px; height: 34px;
border-radius: 10px;
background: var(--accent-green-bg);
color: var(--accent-green);
display: flex; align-items: center; justify-content: center;

/* Label above value */
font-size: 9px; font-weight: 700; letter-spacing: 0.12em;
text-transform: uppercase; color: var(--text-faint);

/* Value */
font-size: 13px; font-weight: 700; color: var(--text-primary);
```

### 5.8 Section Dividers

```css
height: 1px; background: var(--border-light);
```

### 5.9 Loading Skeleton (`.shimmer`)

```css
background: linear-gradient(90deg,
  var(--bg-secondary) 25%,
  var(--border-light) 50%,
  var(--bg-secondary) 75%
);
background-size: 200% 100%;
animation: shimmer 1.5s infinite;
```

---

## 6. Animations & Motion

```css
/* Fade up reveal */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
.fade-up { animation: fadeUp 0.5s ease forwards; }

/* Card hover spring */
transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);

/* General transitions */
transition: all 0.2s ease;           /* buttons, links */
transition: all 0.3s ease;           /* theme switches */
transition: background 0.3s ease, color 0.3s ease;  /* dark mode */
```

**Rules:**
- Use `cubic-bezier(0.34, 1.56, 0.64, 1)` for spring/bounce effects (cards, FAB).
- Use `ease` for smooth transitions (colors, opacity).
- Stagger fade-up animations using `animation-delay` for grid reveals.
- Image hover: `transform: scale(1.07)` with `transition: transform 0.7s ease`.

---

## 7. Hero Section Pattern

```
┌─────────────────────────────────────────┐
│  Full-bleed Himalayan background image  │
│  height: clamp(420px, 70vh, 640px)      │
│                                         │
│  Gradient overlay: linear-gradient(     │
│    to bottom,                           │
│    rgba(0,0,0,0.35) 0%,                 │
│    rgba(0,0,0,0.55) 60%,                │
│    var(--bg-primary) 100%               │
│  )                                      │
│                                         │
│  ┌─ Pill badge ─────────────────────┐   │
│  │ 🏔 INDIA'S TRAIL NETWORK          │   │
│  │ rgba white glass + blur           │   │
│  └───────────────────────────────────┘   │
│                                         │
│  H1: Find Your                          │
│      Perfect Trail.    ← green accent   │
│  (Fraunces italic 900, huge clamp)      │
│                                         │
│  Sub: Discover, plan and explore...     │
│                                         │
│  [ Search / Filter Bar ]               │
└─────────────────────────────────────────┘
```

**Pill badge style:**
```css
display: inline-flex; align-items: center; gap: 8px;
padding: 7px 18px;
background: rgba(255,255,255,0.12);
backdrop-filter: blur(12px);
border-radius: 100px;
border: 1px solid rgba(255,255,255,0.2);
color: white; font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
```

---

## 8. Page Templates

### 8.1 List/Discovery Page (Home)
- Hero → Discovery Bar → Results Grid (3-col auto-fill)
- Result count tile (Fraunces 900, 32px) top-right of grid header

### 8.2 Detail Page (Trek)
- Full-width hero image → sticky summary card → content sections (map, weather, reviews, bookings)
- Use `max-width: 1400px` container, split into `2fr 1fr` on desktop (content + sidebar)

### 8.3 Auth Pages (Login/Signup)
- Centered card, max-width `420px`
- Logo at top, form below, soft background

### 8.4 Form Pages (Create/Edit Trek)
- Single-column, max-width `720px` centered
- Sections separated by `var(--border-light)` dividers

### 8.5 Admin Dashboard
- Full-width with tabs or sidebar navigation
- Table-style listing for pending items

---

## 9. Icon Usage

**Icon library:** `lucide-react`  
**Default size:** `18px` for nav/UI, `15px` for card stats, `13px` for inline text  
**Default stroke-width:** `2` (default), `2.5` for emphasis  
**Color:** Always use CSS variable tokens, never hardcoded colors

Common icons used:
- `Mountain` — brand logo, trekking context
- `MapPin` — location/state
- `Clock` — duration
- `ArrowUpCircle` — altitude
- `Compass` — exploration / empty states
- `Wind` — status / activity
- `Bookmark` — saved treks
- `Plus` — add trek
- `Sun / Moon` — dark mode toggle
- `Navigation` — distance / near me
- `Star` — reviews / ratings

---

## 10. Scrollbar Styling

```css
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg-secondary); }
::-webkit-scrollbar-thumb { background: var(--border-primary); border-radius: 3px; }
```

---

## 11. Responsive Breakpoints

| Breakpoint | Width | Notes |
|---|---|---|
| Mobile | `< 640px` | Single column, FAB smaller (48px), reduced padding |
| Tablet | `640–1024px` | 2-col grids |
| Desktop | `> 1024px` | 3-col grids, sidebar layouts |
| Wide | `> 1400px` | Content capped at 1400px max-width |

**Mobile-specific:**
- Navbar collapses to hamburger menu (full-screen overlay)
- Dark toggle FAB: `width: 48px; height: 48px; bottom: 20px; right: 20px`
- Grid: `1 column` for trek cards

---

## 12. Dark Mode

- Toggled via `.dark` class on `<html>` — all CSS variables automatically swap.
- Persisted across sessions (localStorage via DarkModeContext).
- All component transitions: `transition: background 0.3s ease, color 0.3s ease`.
- Leaflet maps in dark mode: `filter: brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7)`
- **Never** hardcode `white` or `black` — always use `var(--bg-primary)` / `var(--text-primary)`.

---

## 13. Do's & Don'ts

### ✅ DO
- Use `var(--token)` for every color, shadow, and border.
- Use **Fraunces italic 900** for all display headings.
- Apply `border-radius: 20px` on cards, `12–14px` on buttons/inputs, `10px` on icon buttons.
- Add gradient overlay to every full-bleed image.
- Use spring cubic-bezier `(0.34, 1.56, 0.64, 1)` for interactive hover transforms.
- Apply `.fade-up` animation with `animation-delay` staggering on page loads.
- Match difficulty to color: green (Easy) → amber (Moderate) → rose (Hard).
- Keep max content width at `1400px`.

### ❌ DON'T
- Don't use `Inter`, `Roboto`, or `system-ui` for anything visible — always `Syne` or `Fraunces`.
- Don't hardcode hex values like `#2d6a4f` in components — use `var(--accent-green)`.
- Don't skip backdrop-filter on the navbar — it's part of the elevated feel.
- Don't use generic purple/blue gradient backgrounds — the palette is warm beige + forest green.
- Don't break the warm color story with cold grays — the light mode is warm parchment, not cool white.
- Don't use `border-radius > 24px` on cards (pill shapes reserved for badges only).
- Don't put white text on light backgrounds — check contrast against `var(--bg-primary)`.

---

## 14. Sample Prompt Template

When asking an AI agent to build a component for SummitSphere, use:

```
Using the DESIGN.md for SummitSphere (pasted below or in project root):

Build a [component name] that:
- [Describe what it shows/does]
- Uses var(--token) CSS variables for all colors
- Follows the typography rules (Fraunces italic for headings, Syne for UI)
- Matches the card/button/input patterns in Section 5
- Includes dark mode support via the .dark class variable swaps
- Is responsive: [describe mobile behavior]

DESIGN.md: [paste or reference file]
```

---

*SummitSphere DESIGN.md — v1.0 — Generated for Chaitanya Bhardwaj's portfolio project*  
*Keep this file updated as the design system evolves. Last updated: 2026.*
