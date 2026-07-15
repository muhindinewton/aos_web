# AOS Web — Africa Online Space

Web app for the AOS marketplace (Next.js App Router + Tailwind CSS + Firebase Auth).
It mirrors the mobile Flutter app (`aos_app`), which is the design source of truth.

**New here? Read in this order:**
1. This file — get it running.
2. [`HANDOFF.md`](HANDOFF.md) — the screen map, flows, and interaction spec (use it like a Figma file, together with `screenshots/index.html`).
3. [`design-system.md`](design-system.md) — tokens, type scale, layout rules, component recipes.

---

## 1. Prerequisites

- **Node.js 18+** (developed on Node 26) and npm
- A modern browser; **Google Chrome** is additionally required only for the screenshot harness

## 2. Install & run

```bash
git clone <repo-url> aos_web
cd aos_web
npm install
npm run dev          # http://localhost:3000
```

That's it for a working app — all product/chat/feed data is local seed data
(`app/lib/data.ts`, `app/feed/feed-data.ts`), so nothing else has to be provisioned.

## 3. Firebase (auth)

Login/signup uses Firebase Auth. A demo Firebase project's web config is checked in
(`app/lib/firebase.ts`), so auth works out of the box for development.

To point at **your own** Firebase project:

```bash
cp .env.local.example .env.local   # then fill in the values
```

The values come from Firebase Console → Project Settings → Your apps → Web app.
Enable **Email/Password** and **Google** sign-in providers in Firebase Auth.
Env values override the checked-in config where wired; extend `app/lib/firebase.ts`
to read all keys from env before shipping to production.

## 4. Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload (port 3000) |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |

## 5. Screenshot harness (design reference)

Regenerates the full visual spec — every route × mobile/tablet/desktop × the four
page states, light and dark, plus full-page captures of long pages and a browsable
gallery:

```bash
npm run build && npx next start -p 3100 &   # harness expects port 3100
node scripts/screenshots.mjs                # light theme
THEME=dark node scripts/screenshots.mjs     # dark theme → screenshots/dark/
node scripts/gallery.mjs                    # builds screenshots/index.html
```

Open `screenshots/index.html` to browse. The folder is git-ignored; zip it to share.
Useful while developing: append `?__state=loading|error|empty` to any data screen to
pin it in that state.

## 6. Project structure

```
app/
  layout.tsx            root layout: providers, navbar, offline banner, footer
  page.tsx              home
  components/           shared UI (navbar/bottom tabs, state views, product card…)
  providers/            theme, auth, location, preferences, toast (React context)
  lib/                  seed data, firebase, i18n, chat wallpaper, shop locations
  <route>/page.tsx      one folder per screen (shop, product, chat, account, sell…)
  loading|error|not-found.tsx   route-level states
scripts/
  screenshots.mjs       capture harness (Puppeteer + system Chrome)
  gallery.mjs           builds screenshots/index.html
design-system.md        the written design contract
HANDOFF.md              screen map, flows, interaction notes
```

## 7. Conventions that will bite you if skipped

- **Theme:** never hard-code grays — use `text-theme-*` / `bg-surface|elevated|theme` /
  `border-theme` utilities so dark mode works. `text-primary` is the brand **red**;
  `text-theme-primary` is body text.
- **Breakpoints:** content responds at `md:`; navigation chrome switches at `lg:`.
  Full-height screens use `h-[calc(100dvh-80px)] lg:h-[calc(100dvh-112px)]`.
- **Overlays:** popovers/dropdowns anchored to the trigger — no bottom sheets on web.
- **States:** every data screen ships loading/empty/error/content via `usePageLoad()`
  (`app/components/app-state-views.tsx`).
- **Icons:** `lucide-react` only. **Font:** Poppins only.

## 8. Deploying

`netlify.toml` is configured for Netlify. Any Node host that runs `next build` +
`next start` works. Before production: move all Firebase config to env vars and
replace seed data with real APIs (the seed shapes are the intended API contracts).
