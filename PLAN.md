# Maxie Apps Centralized Website (maxie-apps-homepage) — Phased Build Plan

**Status: All 9 phases complete.** See commit history on `main` for one commit per phase.

Known limitation (not fixable from this repo): `maxmacro-download`'s current
GitHub release notes have the wrong mirror comment tag
(`MAXCLICKER_RELEASE_MIRRORS` instead of `MAXMACRO_RELEASE_MIRRORS`) and a
Backblaze URL under a different domain shape than MaxClicker's. GitHub
download still works for MaxMacro; the Backblaze mirror button just won't
appear until that release's notes are corrected in `maxmacro-download`.

## Context

Two products (MaxClicker, MaxMacro) currently have separate, static, framework-less download pages with no shared identity. `maxie-apps-homepage` is a fresh empty repo meant to become the real centralized site: React, multi-page, both products introduced and linked, with a proper Downloads section. This plan is based on directly inspecting `maxclicker-download` (existing site + release-fetching logic + real navy/blue/amber palette) and the real MaxMacro desktop app theme (crimson/near-black, from `Maxmacro/App/Themes/MaxmacroTheme.xaml`) — not assumptions.

Because of a tight session time budget, the work is split into **independent phases**, each small enough to finish and verify in one sitting, each ending in its own commit + push so nothing is lost between sessions.

## Key facts carried into every phase (don't re-derive)

- **MaxClicker palette**: navy bg (`#061121→#113259`), blue accent (`#21a7e3`), amber accent (`#ffb24a`), light text (`#eef7ff`), "Rajdhani" bold font.
- **MaxMacro palette**: near-black bg (`#1F1F1F`/`#111111`/`#151515`), crimson accent (`#B91C2B`), success green (`#20D89A`), light text (`#F5F7FA`), muted text (`#8E9AAD`).
- **Release-fetching** (from `maxclicker-download/index.html` inline script): `GET https://api.github.com/repos/{repo}/releases/latest` → find asset via name regex → show version/date/size → blob-preload download button (fetch bytes ahead of click, fallback to direct URL on failure) → Backblaze mirrors parsed from a hidden HTML comment in the release body (`<!-- MAXCLICKER_RELEASE_MIRRORS {json} MAXCLICKER_RELEASE_MIRRORS -->`), validated by URL pattern + optional sha256 format.
- **Routing**: `HashRouter` (no custom domain confirmed yet for this repo, so no server-rewrite needed for refresh/direct-nav to work).
- **One `ProductDownloadPage`** component for both products (`/downloads/:productSlug`), never two separate page components — differences live only in config + CSS theme variables.
- Reference repos (siblings of this one): `maxclicker-download`, `maxmacro-download`.

## Phases

Each phase = scaffold/build → verify locally → `git add`/commit/push. Do not start a phase without finishing and pushing the previous one.

### Phase 1 — Project scaffold + theme foundation
- `npm create vite@latest . -- --template react-ts`, install `react-router-dom`.
- `public/.nojekyll` (empty file, prevents GitHub Pages mangling Vite's `_assets`).
- `src/theme/themes.ts` (both palettes as CSS variable maps, same variable names for both), `src/theme/ThemeProvider.tsx` (`ThemeScope` component setting `data-theme="maxclicker"|"maxmacro"`), `src/theme/global.css` (resets, Rajdhani `@font-face`, base typography using CSS vars).
- `src/config/products.ts` (MaxClicker + MaxMacro: slug, repo, display copy, theme id — release-fetching fields added in Phase 3).
- Verify: `npm run dev` shows a blank app with correct fonts/colors loading, no console errors.
- **Commit + push**: "Scaffold maxie-apps-homepage with Vite/React/TS and dual product theming".

### Phase 2 — Layout shell + routing
- `src/components/Layout/{Layout,Nav,Footer}.tsx` — responsive nav, active-link styling, mobile collapsible menu.
- `src/App.tsx` — `HashRouter` + routes: `/`, `/downloads`, `/downloads/:productSlug`, `/about`, `*` (NotFound), each currently a placeholder page.
- `src/pages/{Home,Downloads,About,NotFound}` placeholder components (just headings for now).
- Verify: all nav links work, direct navigation to each hash route works, mobile menu collapses/expands correctly at narrow widths.
- **Commit + push**: "Add routing shell and responsive navigation".

### Phase 3 — Release-fetching service
- `src/services/releaseTypes.ts`, `src/services/formatBytes.ts`, `src/services/releaseFetcher.ts` (parameterized: repo, asset-name regex, exclude regex, mirror comment tag, mirror URL pattern built from a `pathSegment`).
- `src/hooks/useLatestRelease.ts` (loading/success/error/empty state machine).
- Extend `config/products.ts` with the release-fetching config fields for both products.
- Verify: write a quick throwaway test call (console.log in a temp page or a small script) against the real GitHub API for both `crossgozon/maxclicker-download` and `crossgozon/maxmacro-download` — confirm MaxClicker returns real data and MaxMacro's "no releases yet" case hits the `empty` state, not a crash.
- **Commit + push**: "Add parameterized GitHub release-fetching service with mirror parsing".

### Phase 4 — Shared UI components
- `src/components/common/{Button,Section}.tsx`.
- `src/components/ProductCard/ProductCard.tsx` (theme-agnostic, driven by product config).
- `src/components/ReleasePanel/{ReleasePanel,DownloadButton}.tsx` — loading skeleton, error box (GitHub-page fallback link), success view (primary GitHub download + optional Backblaze mirror button), blob-preload logic ported into `DownloadButton`.
- Verify: build a temporary test page rendering `ReleasePanel` for both products side by side, confirm all 4 states (loading/success/error/empty) render correctly and buttons are never dead/broken-looking.
- **Commit + push**: "Add ProductCard and ReleasePanel shared components".

### Phase 5 — Home page
- `src/pages/Home/Home.tsx` — hero section, two themed `ProductCard`s (each wrapped in its own `ThemeScope`), View Product/Download/Learn More actions linking to `/downloads/:slug`.
- Verify: visually distinct MaxClicker (navy/blue/amber) vs MaxMacro (crimson/near-black) cards, responsive at 360/768/1024/1440.
- **Commit + push**: "Build Home page with themed product cards".

### Phase 6 — Downloads pages
- `src/pages/Downloads/Downloads.tsx` — both products' `ReleasePanel` summaries + links to detail pages.
- `src/pages/Downloads/ProductDownloadPage.tsx` — single component, resolves product from `:productSlug` route param, full themed page (hero copy from config + full `ReleasePanel` + release notes rendering).
- Verify: `/downloads`, `/downloads/maxclicker`, `/downloads/maxmacro` all work via direct navigation and refresh; download buttons produce real files for MaxClicker (MaxMacro may legitimately show the empty state until it has a release).
- **Commit + push**: "Build Downloads and per-product download pages".

### Phase 7 — About page + asset migration
- `src/pages/About/About.tsx` — what Maxie Apps is, what each product is for, where official downloads/updates live. No invented history/team/stats.
- Migrate real assets from `maxclicker-download/assets/` (Rajdhani font, logos) into `public/assets/maxclicker/`; source or placeholder equivalents for `public/assets/maxmacro/`.
- Verify: About page renders correctly, all migrated assets load with correct paths.
- **Commit + push**: "Add About page and migrate MaxClicker assets".

### Phase 8 — Deployment
- `.github/workflows/deploy.yml` — build on push to `main`, `actions/upload-pages-artifact` + `actions/deploy-pages`, env-driven `VITE_BASE_PATH`.
- Enable "GitHub Actions" as the Pages source in repo settings (manual step, note for the user).
- Verify: workflow runs green, deployed site's hash routes survive a hard refresh, both product themes render correctly live.
- **Commit + push**: "Add GitHub Pages deployment workflow".

### Phase 9 — Final polish pass
- Cross-check every item in the original spec's "Validation Requirements" list end-to-end on the deployed site.
- Fix any responsive/state-handling gaps found.
- **Commit + push**: "Final polish and validation pass".

## Verification (applies across phases, re-check at the end)

- `npm run build` completes with no errors/warnings.
- Every nav link and both product download pages work via direct navigation and refresh (hash routing).
- MaxClicker visually reads navy/blue/amber; MaxMacro visually reads crimson/near-black — clearly related but distinct.
- Loading/error/empty states are all reachable and legible, no dead-looking buttons.
- No backend/DB/auth was introduced; no secrets in frontend code (none needed — GitHub API and Backblaze URLs are public).
