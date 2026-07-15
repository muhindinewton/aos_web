# AOS Web — Developer Handoff

This package is the design reference for building the AOS (Africa Online Space) web app —
use it the way you would a Figma file. The screenshots are the visuals, `design-system.md`
is the spec, and this document is the map that connects them.

> **Environment setup** (clone, install, Firebase, run, regenerate screenshots) lives in
> [`README.md`](README.md) — start there, it takes about two minutes.

## What's in the package

| Item | What it is |
|---|---|
| `screenshots/index.html` | **Start here.** Browsable gallery of every screen — open it in a browser. |
| `screenshots/{mobile,tablet,desktop}/NN-*.png` | Every screen at 390 / 820 / 1440 wide, light theme, content state. |
| `screenshots/*/full/` | Stitched full-length captures of pages taller than one screen. |
| `screenshots/*/{loading,empty,error}/` | The other three states for every data-driven screen. |
| `screenshots/dark/…` | The same tree captured in dark theme. |
| `design-system.md` | Tokens, type scale, layout rules, component recipes — the written contract. |
| Design-system artifact page | Live specimens of every token and component, both themes. |
| This repo's `app/` source | A working reference implementation of every screen with seed data. |

**Source-of-truth order:** the mobile Flutter app (`aos_app`) → these screenshots →
`design-system.md` → this repo's code. When two disagree, the earlier one wins.

## Screen map & flows

Mobile/tablet chrome is a 5-tab bar; desktop is a 2-row header (see design-system §3).

```
Home ─┬─ search ──── /search (voice, image variants)
      ├─ category ── /shop?category=X ── /subcategory ── /product/[id]
      └─ banners ─── /shop, /sell

Product [id] ─┬─ Chat seller ──── /chat/[id]  (unlocks reviews CTA)
              ├─ Call seller ──── /call/[id]
              ├─ Shop location ── /map/[shop] ── Google Maps directions
              ├─ Seller store ─── /seller/[id]
              ├─ Reviews ──────── /reviews/[id] ── /reviews/[id]/write
              └─ Report ───────── /product/[id]/report

Connect (/chat = /calls = /contact) ─┬─ chat row ── /chat/[id] ─┬─ header ── /chat/[id]/profile
                                     │                          └─ menu ──── call · video · wallpaper
                                     ├─ Calls tab ─ call log ── /call/[id]
                                     └─ center FAB ─ /calls/new (New Conversation)
Feed ─┬─ video overlay (like/save/share/products)
      ├─ creator ──── /feed/creator/[slug] ── /feed/followers/[name]
      └─ Go Live ──── /sell/live

Post (center tab) → /sell ─┬─ /sell/post   (listing wizard)
                           ├─ /sell/video  (record → editor → details, drafts)
                           └─ /sell/listings

Account ─┬─ profile card ── /account/profile (the ONE profile page)
         ├─ Get Verified ── /account/verification
         ├─ My Listings · My Storefront (+customize) · My Wishlist · Activity Center
         ├─ Security · Notification prefs · App prefs · Dark mode · Delete account
         └─ Delete flow: /account/delete → sign-out → /auth/restore (30-day window)

Auth: /auth/login ⇄ /auth/signup · /auth/forgot-password · /auth/restore · /onboarding
```

## Interactions the stills can't show

- **Overlays anchor to their trigger — never bottom sheets on web.** Message actions open
  a popover at the bubble (reactions row + Reply/Copy/Translate/Forward/Delete); Delete and
  Translate swap that popover's content in place. Wallpaper picker drops from the chat
  header menu; sort menus drop from their buttons. Centered dialogs only for confirmations
  (logout, block/report, clear activity, delete password check).
- **Chat:** reply quotes, emoji reactions (chip overlaps bubble edge), voice-note recording
  row (timer + pause/cancel/send), attachment grid (gallery/camera/document/location/contact),
  media caption before send, per-chat wallpaper (persisted), live translate with
  "Translating…" spinner then original text under the translation.
- **Stories (Connect):** tap avatar → full-screen viewer, 4s auto-advancing segments with
  progress bars, tap left/right to navigate; "My Story" + button → caption + gradient sheet.
- **Feed:** vertical snap scroll; like/save toggle instantly; share sheet; product tags open
  the product page. Reel editor: draggable text overlays, sound picker, speed, trim; drafts
  saved to localStorage and restorable from the camera screen.
- **Toasts** confirm every mutation ("Saved", "Restored", "Blocked") — bottom-center pill,
  ~2.2s.
- **Header (desktop):** search scope dropdown filters by category before submit; account
  avatar opens the menu holding theme toggle, support, and auth links; location picker
  persists and shows "City, Country" in the nav row.

## Measuring blocks (the "inspect" workflow)

Screenshots show *what*; sizes come from two places:

1. **`design-system.md` §3.5** lists the exact dimensions of every recurring block
   (product cards, banners, tiles, bars, bubbles, avatars).
2. **The running app is the redline file.** `npm run dev`, open any screen, and use
   browser DevTools (right-click → Inspect) to read the precise box model, spacing and
   colors of any element — the same thing Figma's inspect panel gives you. Every size
   is a Tailwind class in the component source, so what you inspect is what's specified.

## States contract

Every data screen has four states — loading (skeleton mirroring the layout), error
(retry), empty (designed message + action), content. `usePageLoad()` in
`app/components/app-state-views.tsx` provides the lifecycle (offline ⇒ real error).
Route-level: `loading.tsx`, `error.tsx`, `global-error.tsx`, `not-found.tsx`, plus a
global offline banner. Force any state with `?__state=loading|error|empty` (this is how
the state screenshots were captured).

## Assets & dependencies

- **Font:** Poppins 300–800 (Google Fonts), loaded in `app/layout.tsx`. Splash logotype: PlayfairDisplay 800.
- **Icons:** `lucide-react` only — no custom icon set.
- **Images:** demo content uses `picsum.photos` seeds; production swaps in real listing media.
- **Maps:** OpenStreetMap iframe embeds (keyless) + Google Maps URL handoff for directions.
- **Seed data:** `app/lib/data.ts` (products, chats, calls), `app/feed/feed-data.ts`,
  `app/lib/category-data.ts` — field shapes match what a real API should return.

## Regenerating the screenshots

```bash
npx next build && npx next start -p 3100 &
node scripts/screenshots.mjs               # light: 51 routes × 3 viewports × 4 states + full-page
THEME=dark node scripts/screenshots.mjs    # dark variant → screenshots/dark/
node scripts/gallery.mjs                   # rebuilds screenshots/index.html
```

The folder is git-ignored — zip `screenshots/` (index.html + images travel together) to share it.
