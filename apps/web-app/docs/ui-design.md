---
name: frontend-design-verbose
description: Create distinctive, production-grade frontend interfaces with exquisite modern design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples include websites, landing pages, dashboards, React components, HTML/CSS layouts, or when styling/beautifying any web UI). Generates creative, polished code and UI design that avoids generic AI aesthetics while adhering to professional real-world design standards.
license: Complete terms in LICENSE.txt
---

This skill guides the creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics while strictly adhering to real-world professional design principles. Implement working code with exceptional attention to visual hierarchy, spacing systems, shadow theory, typography, color, and compositional craft.

The user provides frontend requirements: a component, page, application, or interface to build. They may include context about the purpose, audience, or technical constraints.

---

## Phase 1 — Design Thinking (Before Any Code)

Before writing a single line of code, commit fully to a design direction. This phase defines everything.

### 1.1 Understand Context

- **Purpose**: What problem does this interface solve? Who uses it, when, and why?
- **Emotional register**: Should it feel trustworthy, energetic, premium, minimal, playful, authoritative, warm, clinical?
- **Audience**: Developer tool? Consumer product? Executive dashboard? Onboarding flow? Each has different information density needs and visual expectations.
- **Content type**: Text-heavy (editorial), data-heavy (dashboard), action-heavy (app), or impression-heavy (marketing)?

### 1.2 Pick an Aesthetic Direction and Commit

Choose one clear conceptual direction and execute it with full conviction. Do not hedge. Examples to pick from:

- **Refined Minimal**: Extreme whitespace, one dominant typeface, invisible structure, surgical precision
- **Editorial / Magazine**: Column grids, pull quotes, dense typographic hierarchy, ink-on-paper feeling
- **Luxury / Premium**: Gold accents, serif type, generous padding, muted palettes, material metaphors
- **Industrial / Utilitarian**: Monospace, borders instead of shadows, high contrast, functional density
- **Soft / Organic**: Rounded corners, warm neutrals, blurred pastel backgrounds, gentle motion
- **Retro-Futuristic**: Scanlines, glow effects, terminal aesthetics, grid overlays, vintage tech
- **Brutalist / Raw**: Bold asymmetry, clashing weights, visible structure, type as texture
- **Art Deco / Geometric**: Symmetry, ornamental frames, gold + black, precise angles

**CRITICAL**: Bold maximalism and refined minimalism both produce unforgettable work — the key is intentionality, not intensity. Pick the direction that serves the content best, then execute it without compromise.

---

## Phase 2 — The Design System (Core Variables)

Every production-grade UI is built on a system, not ad-hoc decisions. Before styling anything, establish these foundations explicitly in CSS custom properties (or JS tokens).

### 2.1 Spacing Scale

Use an 8pt base grid. Never use arbitrary pixel values like 13px, 22px, or 37px. Every spacing decision maps to the scale.

```css
:root {
  --space-1: 4px; /* Micro: icon gap, tight label spacing */
  --space-2: 8px; /* XS: internal padding, tight rows */
  --space-3: 12px; /* SM: compact component padding */
  --space-4: 16px; /* Base unit: standard padding */
  --space-5: 24px; /* MD: section-internal gaps */
  --space-6: 32px; /* LG: between related components */
  --space-7: 48px; /* XL: section breaks */
  --space-8: 64px; /* 2XL: major page sections */
  --space-9: 96px; /* 3XL: hero padding, page extremes */
  --space-10: 128px; /* Max: full-bleed hero spacing */
}
```

**Spacing rules:**

- Padding inside a card: `--space-4` to `--space-6` depending on density
- Gap between list items: `--space-3` to `--space-4`
- Gap between sections: `--space-7` to `--space-9`
- Inline spacing (between icon and label): `--space-2`
- Form field internal padding: `--space-3` vertical, `--space-4` horizontal
- Never use `margin: auto` for spacing rhythm — use gap/padding instead

### 2.2 Type Scale

Use a modular type scale (ratio: 1.25 Minor Third or 1.333 Perfect Fourth). Never use random font sizes.

```css
:root {
  --text-xs: 0.75rem; /* 12px — labels, captions, legal */
  --text-sm: 0.875rem; /* 14px — secondary body, helper text */
  --text-base: 1rem; /* 16px — primary body text */
  --text-md: 1.125rem; /* 18px — large body / lead paragraph */
  --text-lg: 1.25rem; /* 20px — small headings, card titles */
  --text-xl: 1.5rem; /* 24px — section headings */
  --text-2xl: 1.875rem; /* 30px — page-level headings */
  --text-3xl: 2.25rem; /* 36px — hero subheadings */
  --text-4xl: 3rem; /* 48px — hero headings */
  --text-5xl: 4rem; /* 64px — display / statement type */
  --text-6xl: 5.5rem; /* 88px — oversized editorial type */
}
```

**Line height rules:**

- Display type (4xl+): `line-height: 1.05–1.15` (tight, impactful)
- Heading type (xl–3xl): `line-height: 1.2–1.35`
- Body text: `line-height: 1.6–1.75` (comfortable reading)
- UI labels / buttons: `line-height: 1.2–1.4`
- Captions: `line-height: 1.5`

**Letter spacing rules:**

- All-caps labels: `letter-spacing: 0.08em–0.12em`
- Display headings: `letter-spacing: -0.02em–-0.04em` (slight tightening for large type)
- Body text: `letter-spacing: 0` or `0.01em`
- Monospace / code: `letter-spacing: 0`

### 2.3 Color System

Define a palette with clear roles. Every color has a purpose.

```css
:root {
  /* Backgrounds — layered depth */
  --color-bg-base: #0f0f0f; /* Page background */
  --color-bg-surface: #1a1a1a; /* Cards, panels */
  --color-bg-raised: #242424; /* Dropdowns, overlays */
  --color-bg-sunken: #0a0a0a; /* Input fields, inset areas */

  /* Borders */
  --color-border-subtle: rgba(255, 255, 255, 0.06);
  --color-border-default: rgba(255, 255, 255, 0.1);
  --color-border-strong: rgba(255, 255, 255, 0.18);

  /* Text */
  --color-text-primary: rgba(255, 255, 255, 0.92);
  --color-text-secondary: rgba(255, 255, 255, 0.55);
  --color-text-tertiary: rgba(255, 255, 255, 0.35);
  --color-text-disabled: rgba(255, 255, 255, 0.2);

  /* Accent — one primary, one secondary, one semantic */
  --color-accent: #e8c97a; /* Primary CTA, key highlights */
  --color-accent-subtle: rgba(232, 201, 122, 0.12);
  --color-accent-hover: #f0d88a;

  /* Semantic */
  --color-success: #4ade80;
  --color-warning: #fbbf24;
  --color-error: #f87171;
  --color-info: #60a5fa;
}
```

**Color rules:**

- Use at most 2 accent colors. One dominant, one complementary.
- Backgrounds must be layered: base → surface → raised → overlay. Cards sit on surface, not on base.
- Text hierarchy: primary (headings, body), secondary (supporting text), tertiary (metadata, hints), disabled.
- NEVER apply accent color to large areas — it's for highlights, interactive states, and focal points only.
- Contrast ratios: body text ≥ 4.5:1, large text ≥ 3:1, UI components ≥ 3:1 (WCAG AA).

### 2.4 Border Radius Scale

```css
:root {
  --radius-sm: 4px; /* Tags, badges, small chips */
  --radius-md: 8px; /* Buttons, inputs, small cards */
  --radius-lg: 12px; /* Cards, modals, panels */
  --radius-xl: 16px; /* Large cards, sheet drawers */
  --radius-2xl: 24px; /* Hero sections, feature cards */
  --radius-full: 9999px; /* Pills, avatars, toggles */
}
```

**Radius rules:**

- Be consistent: if cards use `--radius-lg`, inputs should use `--radius-md`, not `--radius-xl`
- Small components get smaller radii; large components get larger radii — match scale
- Never mix pill buttons with sharp-cornered cards in the same component family
- Brutalist / editorial designs often use `--radius-sm: 0` intentionally

---

## Phase 3 — Shadow System (Depth & Elevation)

Shadows are the most misused element in UI design. The goal is to communicate elevation, not decoration.

### 3.1 Shadow Scale

```css
:root {
  /* Flat — no elevation (for inset or sunken elements) */
  --shadow-none: none;

  /* Subtle — barely lifted (tight focus rings, active states) */
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);

  /* Low — standard card lift */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);

  /* Medium — modals, dropdowns, popovers */
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06);

  /* High — floating action buttons, active cards, dialogs */
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);

  /* Very high — command palettes, sheets, tooltips with emphasis */
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15), 0 8px 10px rgba(0, 0, 0, 0.08);

  /* Extreme — full-page overlays, spotlight modals */
  --shadow-2xl: 0 40px 60px rgba(0, 0, 0, 0.25);

  /* Ambient glow — for accent-colored elements */
  --shadow-glow:
    0 0 20px rgba(232, 201, 122, 0.25), 0 0 60px rgba(232, 201, 122, 0.1);

  /* Inner — inset fields, sunken containers */
  --shadow-inset: inset 0 2px 4px rgba(0, 0, 0, 0.15);
}
```

### 3.2 Shadow Philosophy

**Layer shadows for realism.** Real-world objects cast multiple shadow types:

- **Contact shadow**: Very close to the element, dark, sharp (represents a direct overhead light)
- **Ambient shadow**: Larger, lighter, softer (represents environmental bounce light)

```css
/* Two-layer shadow — realistic card elevation */
--shadow-card:
  0 2px 4px rgba(0, 0, 0, 0.12),
  /* Contact shadow */ 0 8px 24px rgba(0, 0, 0, 0.08); /* Ambient shadow */

/* Three-layer for premium feel */
--shadow-premium:
  0 1px 1px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08),
  0 16px 32px rgba(0, 0, 0, 0.06);
```

**Shadow direction consistency.** All light sources must be from the same direction. Use top-left (most common) or directly above. Never mix shadows pointing in different directions.

**Colored shadows for branded depth:**

```css
/* Accent-tinted shadow — use on primary buttons or featured cards */
--shadow-accent: 0 4px 16px rgba(232, 201, 122, 0.3);
```

**Avoid these shadow mistakes:**

- `box-shadow: 0 0 10px rgba(0,0,0,0.5)` — spreads evenly in all directions (unrealistic, looks amateur)
- 100% black with high opacity — use `rgba` with 0.05–0.20 opacity, not `rgba(0,0,0,0.8)`
- Using the same shadow for every elevation level — differentiate cards, modals, and tooltips
- Applying shadows to flat design elements (defeats the purpose of the style)

---

## Phase 4 — Visual Hierarchy

Hierarchy is the single most important design principle. Users should always know what to look at first, second, and third.

### 4.1 The Three-Level Hierarchy Rule

Every screen must have exactly three levels of visual importance:

1. **Primary (Hero/Focus)**: One element dominates — the headline, the main CTA, the key number
2. **Secondary (Supporting)**: Context that helps understand the primary — subtitle, sub-labels, card content
3. **Tertiary (Ambient)**: Everything else — metadata, timestamps, dividers, hints

If everything looks equally important, nothing is important. Ruthlessly downgrade elements.

### 4.2 Hierarchy Through Size

- Primary content: `--text-2xl` to `--text-5xl`
- Secondary content: `--text-base` to `--text-xl`
- Tertiary content: `--text-xs` to `--text-sm`
- Never have two adjacent elements at the same size if one supports the other

### 4.3 Hierarchy Through Weight

```css
font-weight: 800; /* Display headings, key numbers */
font-weight: 700; /* Section headings, CTA labels */
font-weight: 600; /* Card headings, active nav items */
font-weight: 500; /* Subheadings, emphasized body */
font-weight: 400; /* Body text */
font-weight: 300; /* Captions, legal, secondary labels */
```

Never jump more than 2 weight steps between adjacent hierarchical levels.

### 4.4 Hierarchy Through Color

- Primary: `--color-text-primary` (high contrast, full attention)
- Secondary: `--color-text-secondary` (~55% opacity — clearly readable but recessed)
- Tertiary: `--color-text-tertiary` (~35% opacity — readable on hover/focus, ambient at rest)
- Accent for emphasis: Use `--color-accent` on exactly one focal element per section

### 4.5 Hierarchy Through Space

Use proximity to group and space to separate:

- Related items: `--space-2` to `--space-3` apart
- Items within a component: `--space-3` to `--space-5` apart
- Components from each other: `--space-6` to `--space-7` apart
- Major sections: `--space-8` to `--space-10` apart

**Law of proximity**: The closer two things are, the more related they appear. Group labels directly above their fields (4–8px gap). Separate unrelated fields with 20–32px.

---

## Phase 5 — Typography Execution

### 5.1 Font Pairing Strategy

Choose fonts that create contrast, not similarity. Pair along one of these axes:

- **Contrast axis**: Serif display + Sans-serif body (e.g., Playfair Display + DM Sans)
- **Weight axis**: Heavy display cut + Light body cut from the same family
- **Historical axis**: Geometric modern + Humanist traditional
- **Function axis**: Expressive display + Utilitarian mono (for technical tools)

**Avoid:**

- Two similar sans-serifs (both geometric, both humanist)
- Two fonts from the same designer/foundry — they won't contrast enough
- More than 2 font families (a display and a body is sufficient; a third for code/mono is optional)

**Recommended pairings to draw inspiration from (but don't copy exactly — vary per project):**

- `Fraunces` + `Outfit` (editorial warmth)
- `Cabinet Grotesk` + `Lora` (modern premium)
- `Bebas Neue` + `Source Serif 4` (punchy editorial)
- `Cormorant Garamond` + `DM Sans` (luxury minimal)
- `Space Mono` + `Syne` (technical-futuristic)
- `Instrument Serif` + `Geist` (clean modern)

### 5.2 Text Rendering

```css
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  font-feature-settings:
    "kern" 1,
    "liga" 1,
    "calt" 1;
}
```

### 5.3 Heading Treatment

```css
h1,
h2 {
  font-family: var(--font-display);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.1;
}

h3,
h4 {
  font-family: var(--font-display);
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.25;
}

.overline {
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-accent);
}
```

### 5.4 Optimal Reading Measures

- Body text column width: 60–80 characters (`max-width: 65ch`)
- Narrow callouts or sidebar text: 40–50 characters (`max-width: 45ch`)
- Never let body text stretch edge-to-edge on wide screens
- For multi-column layouts, ensure each column respects these measures

---

## Phase 6 — Component Patterns

### 6.1 Cards

Cards must feel materially distinct from their background. Use at least two of these three techniques:

```css
.card {
  background: var(--color-bg-surface); /* 1. Background lift */
  border: 1px solid var(--color-border-subtle); /* 2. Subtle border */
  box-shadow: var(--shadow-card); /* 3. Elevation shadow */
  border-radius: var(--radius-lg);
  padding: var(--space-5) var(--space-6);
}

.card:hover {
  border-color: var(--color-border-default);
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

**Card internal layout:**

- Header area (title + icon/badge): use `--space-4` bottom margin
- Content body: `--text-sm` to `--text-base`, `--color-text-secondary`
- Footer (CTAs, metadata): separated by a subtle border or `--space-4` top gap
- Never stack more than 3 visual zones inside a card without a divider

### 6.2 Buttons

```css
/* Primary CTA — high contrast, accent-filled */
.btn-primary {
  background: var(--color-accent);
  color: #000;
  font-weight: 600;
  font-size: var(--text-sm);
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-md);
  border: none;
  letter-spacing: 0.01em;
  transition:
    background 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.1s ease;
}

.btn-primary:hover {
  background: var(--color-accent-hover);
  box-shadow: var(--shadow-accent);
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: none;
}

/* Secondary — ghost/outline */
.btn-secondary {
  background: transparent;
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-default);
  /* same padding/radius as primary */
}

.btn-secondary:hover {
  background: var(--color-bg-raised);
  border-color: var(--color-border-strong);
}
```

**Button sizing standards:**

- Small: `padding: 6px 12px`, `font-size: var(--text-xs)`
- Default: `padding: 10px 18px`, `font-size: var(--text-sm)`
- Large: `padding: 14px 24px`, `font-size: var(--text-base)`
- XL / Hero CTA: `padding: 16px 32px`, `font-size: var(--text-md)`

**Button rules:**

- Minimum touch target: 44×44px (mobile) — use `min-height` if needed
- Icon-only buttons must include a `title` attribute for accessibility
- Loading state: replace label with a spinner and disable pointer events
- Disabled state: 40% opacity, `cursor: not-allowed`, no hover effects

### 6.3 Form Inputs

```css
.input {
  background: var(--color-bg-sunken);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-size: var(--text-base);
  padding: var(--space-3) var(--space-4);
  width: 100%;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.input::placeholder {
  color: var(--color-text-tertiary);
}

.input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-subtle);
}

.input:invalid {
  border-color: var(--color-error);
  box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.12);
}
```

**Label placement:**

- Labels always above the field, never inside (placeholder ≠ label)
- Gap between label and input: `--space-2` (4–6px)
- Label size: `--text-sm`, weight 500, color `--color-text-secondary`
- Helper text below input: `--text-xs`, `--color-text-tertiary`, `--space-2` top gap
- Error text below input: `--text-xs`, `--color-error`, `--space-2` top gap

### 6.4 Navigation

```css
.nav {
  display: flex;
  align-items: center;
  padding: var(--space-4) var(--space-6);
  background: rgba(var(--color-bg-base-rgb), 0.85);
  backdrop-filter: blur(12px) saturate(1.5);
  border-bottom: 1px solid var(--color-border-subtle);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-item {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  transition:
    color 0.15s ease,
    background 0.15s ease;
}

.nav-item:hover {
  color: var(--color-text-primary);
  background: var(--color-bg-raised);
}

.nav-item.active {
  color: var(--color-text-primary);
  font-weight: 600;
}
```

---

## Phase 7 — Motion & Interaction

### 7.1 Animation Timing Functions

```css
:root {
  /* Standard ease — most UI transitions */
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);

  /* Ease out — elements entering the screen */
  --ease-out: cubic-bezier(0, 0, 0.2, 1);

  /* Ease in — elements leaving the screen */
  --ease-in: cubic-bezier(0.4, 0, 1, 1);

  /* Spring — interactive elements, hover lifts */
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Expo out — snappy panel slides, drawer openings */
  --ease-expo: cubic-bezier(0.16, 1, 0.3, 1);
}
```

**Duration guidelines:**

- Micro-interactions (hover, focus): `100–150ms`
- Component transitions (expand, collapse): `200–300ms`
- Page-level transitions (route changes, modal open): `300–500ms`
- Ambient animations (background movement, loops): `2000–8000ms`

### 7.2 Page Load Sequence

Orchestrate reveals with staggered animation delays. The eye follows motion — use this deliberately:

```css
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-overline {
  animation: fadeUp 0.5s var(--ease-out) 0s both;
}
.hero-headline {
  animation: fadeUp 0.6s var(--ease-out) 0.1s both;
}
.hero-subhead {
  animation: fadeUp 0.6s var(--ease-out) 0.2s both;
}
.hero-cta {
  animation: fadeUp 0.5s var(--ease-out) 0.35s both;
}
.hero-image {
  animation: fadeUp 0.8s var(--ease-out) 0.45s both;
}
```

**Animation rules:**

- One coordinated reveal sequence per section maximum
- Never animate more than 5–6 elements in a single stagger chain
- Use `animation-fill-mode: both` to prevent flash-of-unstyled-content
- `prefers-reduced-motion` must always be respected:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 7.3 Hover State System

Hover states must always be perceived as intentional responses, not accidents:

- **Scale**: Use `transform: scale(1.02)` on cards, `scale(1.05)` on icons. Never more.
- **Lift**: `transform: translateY(-2px)` for cards, `-1px` for buttons
- **Glow**: Add `box-shadow: var(--shadow-glow)` on accent elements
- **Color shift**: Change color by one step on the hierarchy scale
- **Background reveal**: `background: var(--color-bg-raised)` on nav items and list rows
- All hover states use `transition: all 0.2s var(--ease-default)` minimum

---

## Phase 8 — Layout & Composition

### 8.1 Grid System

```css
.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

.container-sm {
  max-width: 640px;
}
.container-md {
  max-width: 768px;
}
.container-lg {
  max-width: 1024px;
}
.container-xl {
  max-width: 1280px;
}
.container-2xl {
  max-width: 1536px;
}

.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-6);
}
```

**Column usage guidelines:**

- Full-width section content: 12 cols
- Two-column split: 6 + 6 or 7 + 5
- Three-column: 4 + 4 + 4
- Sidebar layout: 3 + 9 or 4 + 8
- Content + aside: 8 + 4 (reading + metadata)
- Hero with image: 6 + 6 or 5 + 7

### 8.2 Visual Rhythm

Visual rhythm is consistent spacing that creates a readable, comfortable pace as the eye moves down the page:

- Use the same vertical rhythm between repeated elements (cards, list items, sections)
- Break rhythm intentionally for emphasis (a wider gap before a key section signals importance)
- Section padding should be symmetric: `padding: var(--space-9) 0` (same top and bottom)
- Avoid sections that are dramatically different heights without visual anchoring

### 8.3 Backgrounds & Depth

Create depth through layered backgrounds rather than flat fills:

```css
/* Gradient mesh — modern, soft depth */
.bg-gradient-mesh {
  background:
    radial-gradient(
      ellipse 80% 50% at 20% 40%,
      rgba(232, 201, 122, 0.06) 0%,
      transparent 70%
    ),
    radial-gradient(
      ellipse 60% 40% at 80% 60%,
      rgba(100, 160, 255, 0.04) 0%,
      transparent 70%
    ),
    var(--color-bg-base);
}

/* Subtle grid texture */
.bg-grid {
  background-image:
    linear-gradient(var(--color-border-subtle) 1px, transparent 1px),
    linear-gradient(90deg, var(--color-border-subtle) 1px, transparent 1px);
  background-size: 32px 32px;
}

/* Grain overlay — adds tactile warmth */
.grain::after {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-size: 256px 256px;
}
```

---

## Phase 9 — Quality Checklist

Before finalizing any design, verify every item:

### Visual Quality

- [ ] Every element maps to the spacing scale (no arbitrary pixel values)
- [ ] Typography uses the defined type scale (no random font sizes)
- [ ] Three distinct hierarchy levels are present (primary, secondary, tertiary)
- [ ] Shadow system is used consistently (no one-off shadow values)
- [ ] Color usage follows the role system (no color used out of context)
- [ ] Font smoothing is applied globally
- [ ] The design is unmistakably distinctive — could not be confused with a template

### Technical Quality

- [ ] All CSS values are CSS custom properties (no hardcoded magic numbers)
- [ ] Hover and focus states exist on all interactive elements
- [ ] Focus styles are visible and keyboard-accessible
- [ ] Touch targets are ≥ 44×44px on interactive elements
- [ ] `prefers-reduced-motion` media query is respected
- [ ] Responsive breakpoints are handled (mobile: 375px, tablet: 768px, desktop: 1280px)
- [ ] Body text columns respect 65ch max-width

### Aesthetic Coherence

- [ ] Font pairing creates intentional contrast, not similarity
- [ ] Light source for shadows is consistent throughout
- [ ] Color palette has a dominant color, not equally distributed accents
- [ ] Animation timing functions match the emotional register of the design
- [ ] The design would be recognized as intentionally crafted, not AI-generated

---

## Anti-Patterns (Never Do These)

1. **Border-radius inconsistency**: Mixing `border-radius: 4px` and `border-radius: 20px` in the same component family
2. **Equal-weight text**: Two adjacent text elements at the same size and weight (kills hierarchy)
3. **Floating shadows**: `box-shadow: 0 0 15px rgba(0,0,0,0.3)` — spreads in all directions, looks amateur
4. **Purple-on-white with Inter**: The quintessential AI design sin. Never.
5. **Centering everything**: Center-aligned layouts feel brochure-like. Use left-aligned text for content-heavy interfaces.
6. **Padding that's too tight**: Cards with `padding: 8px` feel cramped and unfinished. Minimum `16px` everywhere.
7. **Overusing accent color**: If 30% of the page is your accent color, you have no accent color. Keep it under 5% of total surface area.
8. **No hover state**: Interactive elements with no visual feedback feel broken.
9. **Hard black text on white**: Use `#111` or `rgba(0,0,0,0.88)` — pure `#000` on `#fff` creates harsh contrast that fatigues the eye.
10. **Generic stock icon sets**: Feather, Heroicons everywhere. Use an icon set that matches the aesthetic, or style them to be less recognizable.

---

Remember: Craft is in the details. The difference between a good UI and an exceptional one is found in the 3px hover lift, the 0.06 opacity border, the two-layer shadow, and the perfectly chosen type pair. Execute every variable in the system with intention.
