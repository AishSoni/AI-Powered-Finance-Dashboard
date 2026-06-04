# Wealth Curator Dashboard

> **BrightMoney** — A premium fintech portfolio intelligence dashboard built with React 19, TypeScript, Vite 6, and Tailwind CSS v4.

---

## Table of Contents

- [Architecture](#architecture)
- [Folder Structure](#folder-structure)
- [Design System](#design-system)
- [Custom Hooks](#custom-hooks)
- [Performance](#performance)
- [SEO](#seo)
- [Trade-offs](#trade-offs)
- [Getting Started](#getting-started)

---

## Architecture

> _Describe the high-level design of the application here._

The dashboard follows a **feature-slice** organization pattern. Each concern (pages, components, hooks, data, utilities) lives in its own directory under `src/`. The application is fully client-side rendered via Vite's dev server and production build pipeline.

### Key Principles

- **Separation of concerns** — UI components, data-fetching hooks, and utility functions are completely decoupled.
- **Design-token-first** — All visual values (colors, spacing, typography, shadows) are defined once in `src/styles/tokens.ts` and mirrored as CSS custom properties in `globals.css`. No magic numbers anywhere in component files.
- **Tailwind CSS v4 (Vite plugin)** — Used via `@tailwindcss/vite` for zero-config integration. Utility classes are available globally; component-level overrides use inline CSS variables for dynamic theming.
- **`@/` path alias** — All imports use `@/` to point at `src/`, avoiding brittle relative paths.

### Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Framework    | React 19 + TypeScript               |
| Build tool   | Vite 6                              |
| Styling      | Tailwind CSS v4 + CSS Custom Props  |
| Type-safety  | TypeScript strict mode              |
| Linting      | ESLint (Vite preset)                |

---

## Folder Structure

```
src/
├── components/     # Reusable, headless UI building blocks
│   └── index.ts    # Barrel re-export
├── hooks/          # Custom React hooks (data-fetching, state, effects)
│   └── index.ts
├── pages/          # Route-level page components
│   └── Dashboard.tsx
├── data/           # Static data, mock fixtures, API response schemas
│   └── index.ts
├── styles/
│   ├── tokens.ts   # All design tokens as typed TS constants
│   └── globals.css # CSS custom properties + Tailwind base + reset
└── utils/          # Pure utility functions (no React dependencies)
    └── index.ts
```

---

## Design System

All tokens are defined in `src/styles/tokens.ts` and consumed as CSS custom properties.

### Color Palette

| Token | Value | Usage |
|---|---|---|
| `--color-bg-primary` | `#0A0E1A` | App background |
| `--color-bg-secondary` | `#0F1628` | Card surfaces |
| `--color-gold` | `#C9A84C` | Primary accent |
| `--color-gold-light` | `#E8C87A` | Hover states |
| `--color-text-primary` | `#F0F2FF` | Headings & values |
| `--color-text-secondary` | `#8B94B2` | Body copy |

### Spacing Scale

`4px · 8px · 12px · 16px · 24px · 32px · 48px`

### Utility Classes

- `.glass-card` — Glassmorphic surface with blur + gold border on hover
- `.text-gradient-gold` — Gold gradient text via `background-clip: text`
- `.btn-gold` — Primary CTA with gradient fill and glow shadow
- `.btn-ghost` — Transparent button with gold border hover
- `.stat-badge-{success|warning|error}` — Semantic pill badges

---

## Custom Hooks

> _Document custom hooks as they are implemented._

Planned hooks in `src/hooks/`:

| Hook | Purpose |
|---|---|
| `usePortfolio(clientId)` | Fetches and caches portfolio data for a given client |
| `useTheme()` | Reads/writes theme preference to localStorage |
| `useDebounce(value, delay)` | Debounces a rapidly-changing value |
| `useLocalStorage<T>(key, initial)` | Type-safe localStorage with React state sync |
| `useWindowSize()` | Reactive viewport dimensions for responsive logic |
| `useWebSocket(url)` | Real-time market data subscription |

### Hook Design Guidelines

- **No side effects at module level** — all effects inside `useEffect`.
- **Return stable references** — wrap callbacks in `useCallback`, derived values in `useMemo`.
- **Typed generics** — hooks that handle arbitrary data use TypeScript generics (`useLocalStorage<T>`).
- **Single responsibility** — one concern per hook; compose hooks in page-level components.

---

## Performance

> _Document performance strategies as the application grows._

### Planned Optimizations

| Strategy | Description |
|---|---|
| **Code splitting** | `React.lazy` + `Suspense` for page-level route boundaries |
| **Memoization** | `React.memo` for pure UI components; `useMemo`/`useCallback` for expensive derivations |
| **Virtual lists** | `@tanstack/react-virtual` for large holdings/transaction tables |
| **Asset optimization** | Vite handles tree-shaking, minification, and chunk splitting automatically |
| **Web fonts** | `display=swap` on Google Fonts import prevents FOIT |
| **Bundle analysis** | `vite-bundle-visualizer` for periodic bundle size audits |

### Metrics Targets

- First Contentful Paint (FCP): **< 1.2s**
- Largest Contentful Paint (LCP): **< 2.5s**
- Cumulative Layout Shift (CLS): **< 0.1**
- Total Bundle (gzipped): **< 150KB**

---

## SEO

> _Document SEO strategy for any public-facing pages._

The dashboard is gated behind authentication, so full public SEO is limited. The following practices are applied:

| Concern | Implementation |
|---|---|
| **Semantic HTML** | `<header>`, `<main>`, `<section>`, `<nav>` used throughout |
| **ARIA roles** | `role="table"`, `role="row"`, `role="cell"` on data tables; `aria-label` on regions |
| **Heading hierarchy** | Single `<h1>` per page; `<h2>` for card sections |
| **Focus management** | `:focus-visible` ring styled with gold accent |
| **Meta tags** | Title, description, viewport set in `index.html` |
| **Open Graph** | Add OG tags for any shareable report URLs |

---

## Trade-offs

> _Document key architectural decisions and their trade-offs._

### Tailwind CSS v4 (Vite plugin) vs. PostCSS config

**Chosen:** `@tailwindcss/vite` plugin.  
**Why:** Zero-config setup with Vite; no `tailwind.config.js` required in v4. Utilities available globally without any `content` glob configuration.  
**Trade-off:** Still on the leading edge of the v4 API — some ecosystem plugins may not yet support v4.

### CSS Custom Properties vs. Tailwind Arbitrary Values

**Chosen:** CSS custom properties (`var(--color-gold)`) over Tailwind arbitrary values (`text-[#C9A84C]`).  
**Why:** Custom properties are runtime-dynamic (can be overridden per-component), are readable in DevTools, and decouple the design system from the utility layer.  
**Trade-off:** Can't use JIT tree-shaking on these values; bundle slightly larger.

### Inline Styles for Complex Component Layouts

**Chosen:** Inline styles for complex multi-column grids inside `Dashboard.tsx`.  
**Why:** Avoids class name coupling for data-driven widths (e.g., `allocFill` width is computed from data). Keeps layout logic co-located with component logic.  
**Trade-off:** Less composable than class-based utilities; should be refactored into CSS Modules or component-level styles as complexity grows.

### No Router (yet)

**Chosen:** Single-page, no `react-router-dom`.  
**Why:** MVP has one view. Avoids premature abstraction.  
**Trade-off:** Must add `react-router-dom` before adding any second route.

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Type-check
npm run tsc --noEmit

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## License

MIT © BrightMoney
