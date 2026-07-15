# AOS (Africa Online Space) — Web Design System

> **Framework:** Next.js (App Router) + Tailwind CSS
> **Font family:** Google Fonts — **Poppins** (all text; splash logotype uses PlayfairDisplay)
> **Theme mode:** Light + Dark, toggled at runtime (class strategy — `.dark` on `<html>`, persisted in `localStorage['aos-theme']`)
> **Counterpart:** mirrors `aos_app/design-system.md` (Flutter); mobile is the design source of truth.

---

## 1. Color

### 1.1 Brand

| Token | Value | Tailwind / CSS | Usage |
|---|---|---|---|
| `primary` | `#C1121F` | `bg-primary`, `text-primary`*, `var(--primary)` | Primary actions, active nav, links, badges, price highlights |
| `primary-hover` | `#A00E1A` | `hover:bg-primary-hover` | Hover/pressed state on primary buttons |
| `primary-soft` | `rgba(193,18,31,0.10)` | `bg-primary/10`, `var(--primary-soft)` | Selected chip bg, tinted icon squares, avatar fills |

\* `text-primary` (Tailwind color) is the red; `text-theme-primary` (utility) is body text. Don't confuse them.

Common alpha tints of `primary`: `/5` (active nav bg), `/10` (icon squares, avatar fills), `/15` (selected chips, Connect avatars), `/20` (borders on tinted cards).

### 1.2 Status

| Token | Value | Usage |
|---|---|---|
| `success` | `#2ECC71` | Online dots, success toasts, call-log answer icon |
| `warning` | `#F5A623` | Restore-window chip, caution badges |
| `error` | `#FF4D4D` | Error views, delete-account emblem, destructive labels |
| `info` | `#4DA3FF` | Read receipts (blue double-check), informational badges |

### 1.3 Semantic (theme-aware CSS variables)

| Variable | Light | Dark | Utility class | Usage |
|---|---|---|---|---|
| `--text-primary` | `#1A1A1A` | `#FFFFFF` | `text-theme-primary` | Headings, body |
| `--text-secondary` | `#555555` | `#B3B3B3` | `text-theme-secondary` | Subtitles, secondary copy |
| `--text-muted` | `#8A8A8A` | `#666666` | `text-theme-muted` | Hints, timestamps, placeholders |
| `--bg` | `#FAFAFA` | `#0B0B0B` | `bg-theme` | Page background |
| `--surface` | `#FFFFFF` | `#151515` | `bg-surface` | Cards, headers, sheets, popovers |
| `--elevated` | `#F5F5F5` | `#1C1C1C` | `bg-elevated` | Inputs, icon squares, skeletons |
| `--border` | `#E8E8E8` | `#2A2A2A` | `border-theme` | Card borders, dividers, input borders |

Rule: never hard-code grays — always the semantic utilities so dark mode works for free. The only fixed colors are white-on-primary text, overlays (`bg-black/40`–`/70`), and the dark editor canvas (`#0F1115` / `#16181D`) used by the reel editor.

### 1.4 Accent usage inline

| Color | Usage |
|---|---|
| `text-amber-500` + `fill-amber-500` | Star ratings |
| `fill-sky-500` | Verified badge (`BadgeCheck`, white check on blue) |
| `#2ECC71` filled | Call action phone glyph |
| `text-emerald-500` | Buyer Protection shield |
| Story gradients | `#FF6CAB→#7366FF`, `#F7971E→#FFD200`, `#11998E→#38EF7D`, `#2193B0→#6DD5ED`, `#CB356B→#BD3F32`, `#C1121F→#8E0E15` |

---

## 2. Typography

**All text is Poppins** (loaded in `app/layout.tsx`, weights 300–800). No serif/mono anywhere except the splash logotype.

### 2.1 Scale in use

| Role | Size / class | Weight | Color |
|---|---|---|---|
| Screen title (centered app-bar) | `text-xl sm:text-[26px]` | `font-bold` | theme-primary |
| Page/section title | `text-xl` – `text-2xl` | `font-bold` | theme-primary |
| Card title / row name | `text-[15px]`–`text-[17px]` | `font-semibold`/`font-bold` | theme-primary |
| Body | `text-sm` (14) / `text-[15px]` | `font-normal` | theme-primary |
| Secondary line | `text-[13px]`–`text-sm` | normal | theme-secondary |
| Meta (timestamps, counts) | `text-xs` (12) | normal / `font-semibold` when unread | theme-muted / primary |
| Chip label | `text-[13px]` | `font-medium` | primary when active, theme-secondary otherwise |
| Badge number | `text-[10px]`–`text-[11px]` | `font-bold` | white on primary |
| Empty/error title | `text-[17px]` | `font-semibold` | theme-primary |
| Empty/error message | `text-[13.5px]`, `leading-relaxed` | normal | theme-secondary |
| Nav link (desktop row) | `text-sm` | `font-medium` | primary when active |
| Bottom-nav label | `text-[10px]` | `font-medium`/`font-semibold` | primary when active, theme-muted otherwise |

Numbers are truncated with the shared `fmt()` helpers (`1.2K`, `24.5K`, `1.5M`).

---

## 3. Layout & Breakpoints

### 3.1 The chrome rule

- **Content breakpoints use `md:` (768px)** — grids gaining columns, two-pane layouts.
- **Chrome breakpoints use `lg:` (1024px)** — which navigation shell you get. Below `lg`: mobile chrome (bottom tab bar, per-page app bars). At `lg`+: desktop chrome (two-row header + footer). Portrait tablets therefore behave like large phones.

### 3.2 Chrome dimensions

| Element | Size |
|---|---|
| Desktop header row 1 (logo · search · actions) | `h-[68px]` |
| Desktop header row 2 (location · nav links · trust) | `h-11` (44px) → header total **112px** |
| Mobile bottom tab bar | `h-16` (64px), main gets `pb-20 lg:pb-0` (80px clearance) |
| Full-height screens (Connect, chat, map, categories) | `h-[calc(100dvh-80px)] lg:h-[calc(100dvh-112px)]` |

If chrome heights change, update **both** the header markup and this height formula everywhere it appears.

### 3.3 Containers

| Context | Max width |
|---|---|
| Desktop header / home | `max-w-7xl` |
| Product grids, search | `max-w-6xl`–`max-w-7xl` |
| App-like screens (Connect, chat, wishlist) | `max-w-2xl`–`max-w-3xl`, centered |
| Forms (auth, delete, restore) | `max-w-md`–`max-w-xl` |

### 3.4 Grid recipes

| Content | Columns |
|---|---|
| Product cards | `grid-cols-2 md:grid-cols-3 lg:grid-cols-4` (+`xl:grid-cols-5` on wide pages) |
| Profile video tiles (9:16) | `grid-cols-3 sm:grid-cols-4 lg:grid-cols-5`, `gap-[2px]` |
| Subcategory tiles | `grid-cols-3 md:grid-cols-4 gap-2` |
| Attachment sheet options | `grid-cols-4 sm:grid-cols-5 gap-4` |

Horizontal rows (stories, chips, friends) scroll with `overflow-x-auto hide-scrollbar`.

### 3.5 Block dimensions (the recurring "frames")

Exact sizes of the repeating blocks. Anything not listed here: the component's
Tailwind classes are the redline — inspect the element in DevTools or read the
component file.

| Block | Size |
|---|---|
| Product card image | fluid width in its grid column, `aspect-[4/3]`, `rounded-xl` |
| Product card (whole) | grid cell of `grid-cols-2 md:3 lg:4` with `gap-3 md:gap-4`; `p-2.5` padding |
| Wishlist card image | `h-[150px]` grid view · `w-24 h-24` list thumb |
| Listing row thumb | `w-24 h-24` (sm: `w-32 h-32`) |
| Home hero banner | `h-[175px]` mobile → `md:h-72` → `lg:h-80`; desktop split banner `h-[360px]` |
| Quick-action icon box | `68×68`, `rounded-2xl` |
| Shorts rail tile (home) | `130×200`, `rounded-2xl` |
| Feed discovery tile | fluid width, `aspect-[3/4]` |
| Live rail card (feed) | `w-[130px]` |
| Profile video tile | grid cell, `aspect-[9/16]`, `gap-[2px]` |
| Categories sidebar | `w-[88px]`; subcategory tiles `aspect-square` in `grid-cols-3` |
| Story avatar | `68×68` ring outer (64 inner) |
| Chat bubble | `max-w-[78%]` of the thread column |
| Connect search bar | `h-[54px]`; chat-detail inputs `~44px` (`py-2.5`) |
| Connect bottom bar / FAB | bar `h-[60px]` pill · FAB `54×54`, overlaps bar by half |
| Shop-location map preview | `h-[150px]` card embed; full map page fills remaining viewport |
| Empty/error emblem | `88×88` circle, icon `40px` |
| Buttons / inputs | `~44px` tall (`py-2.5–3.5`); hero CTA `py-4` |

### 3.6 Navigation model

- **Mobile bottom tabs:** Home `/` · Feed `/feed` · **Post** (center 40px red circle, `/sell`) · Connect `/chat` · Account `/account`.
- **Desktop nav row:** location picker (left) · Home / Shop / Shorts / Wishlist / Connect (centered) · Buyer Protection (right).
- `/chat`, `/calls`, `/contact` all render the **AOS Connect** screen (`/calls` opens on the Calls tab).
- One profile page: `/account/profile` (`/feed/profile` re-exports it).

---

## 4. Radius

| Token | Usage |
|---|---|
| `rounded-lg` (8) | Small buttons, inline chips-in-cards |
| `rounded-xl` (12) | Inputs, icon squares, menu rows, listing cards |
| `rounded-2xl` (16) | Cards, popovers, sheets, header buttons, chat bubbles |
| `rounded-[20px]`–`rounded-[24px]` | Large empty-state cards, Connect search pill |
| `rounded-full` | Chips, pills, search bars, avatars, badges, FAB, Connect bottom bar, primary CTAs (`Sell Now`, `Try again`) |
| Chat bubble | `rounded-2xl` with the corner on the sender's side squared (`rounded-tr-none` sent / `rounded-tl-none` received) |

---

## 5. Elevation & Shadows

| Token / literal | Value | Usage |
|---|---|---|
| `shadow-soft` | `0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04)` | Resting cards |
| `shadow-card` | `0 2px 8px rgba(0,0,0,.08)` | Product cards |
| `shadow-elevated` | `0 4px 16px rgba(0,0,0,.12)` | Hovering/overlay cards |
| `shadow-nav` | `0 -1px 3px rgba(0,0,0,.08)` | Bottom tab bar |
| Floating app-bar button | `0 2px 10px rgba(0,0,0,.07)` on `bg-surface`, borderless | Back/menu squares |
| Connect bottom bar | `0 6px 20px rgba(0,0,0,.10)` on solid `bg-surface` pill | |
| FAB glow | `0 6px 14px rgba(193,18,31,.35)` + `ring-[7px]` page-colored ring (fakes the notch) | |
| Popovers/menus | `shadow-2xl` + `border-theme` | |

---

## 6. Iconography

**lucide-react only.** Sizes: `w-3.5 h-3.5` (meta), `w-4 h-4` (menu rows), `w-[18px] h-[18px]` (buttons), `w-5 h-5` (nav/actions), `w-6 h-6` (tab bar), `w-10 h-10` (empty/error emblems). Active tab icons use `fill="currentColor"`; inactive stay outlined. Recurring bindings: `Heart` wishlist/likes · `MessageSquare`/`MessageCircle` chat · `Phone` calls (green filled = call action) · `BadgeCheck` verified · `MapPin` location · `Star` ratings · `Shield` trust · `Trash2` destructive.

### Avatars

Initial-letter circles, no images (except real user photos): `bg-primary/15` fill + `text-primary` initial (chat/contacts), `bg-elevated` + `text-theme-primary` (call log, seller lists). Sizes: 32 (header) · 44–52 (rows) · 60–68 (featured rows/stories) · 90–96 (profiles, with 2.5px primary ring). Online dot: `#2ECC71`, 12–14px, 2px surface ring — **bottom-left** on chat rows, bottom-right elsewhere. Story rings: unseen `border-[3px] border-primary`, seen `border border-theme`, white gap via `p-[3px]`.

### Badges

Count: `min-w`/`h` 15–20px red circle, white bold 9–11px number, optional 2px surface ring when sitting on an icon. Dot: `w-2 h-2 bg-primary rounded-full` (+ `animate-pulse` for Live).

---

## 7. Components

### 7.1 Desktop header (two rows, 112px)

- **Row 1:** logo (36px red rounded-xl `Store` icon + "AOS") · search pill (`bg-elevated rounded-full`, category-scope segment "All ▾" with icon + divider + query input; submit routes to `/search` or `/shop?category=…`) · bell (dot badge) · avatar dropdown (My Account / theme toggle / Support, or Login+Register) · solid `Sell Now` pill.
- **Row 2:** location button (flag + `City, Country`, opens picker; persisted) · centered nav links (active = red text + 24×2px underline dot; Shorts has pulsing red Live dot) · Buyer Protection.

### 7.2 Mobile bottom tab bar

Fixed, `bg-surface border-t`, five items; active = icon in `bg-primary/10 rounded-xl` + red label; center Post = 40px red circle with glow.

### 7.3 AOS Connect screen

Header ✕ / title / ≡ in floating 44px `rounded-2xl` surface squares; 54px `rounded-[24px]` search with soft shadow; stories row (68px ringed circles, My Story with red + badge); filter chips; chat rows (50px avatars, pin icon, read receipts — single gray `Check` sent, gray `CheckCheck` delivered, blue read — red unread time + badge, `VolumeX` muted); floating solid-white pill bottom bar (Chats · Calls with badges, active = filled red icon + red bold label) with a 54px red FAB docked halfway into the bar.

### 7.4 Chat detail

Wallpaper layer (per-chat, default or solid preset, `localStorage`); date separator chip; bubbles max-w 78% — sent: `color-mix(in srgb, #C1121F 72%, var(--surface))` white text; received: `bg-surface border-theme`; reply quotes, product cards, location/contact/voice tiles inside bubbles; reaction chip overlapping bubble edge. **Message actions are an anchored popover at the bubble** (quick reactions row + Reply/Copy/Translate/Forward/Delete) that swaps in place to the delete chooser or the translate language list. Composer: + attach, pill input with emoji toggle, red mic/send; recording row with pulsing dot + timer.

### 7.5 Product card

`bg-surface rounded-xl p-2.5` + `shadow-card`; image `rounded-xl` with white circular heart button (filled red when saved) top-right and red `-18%` discount badge top-left; title (semibold, truncated) → location (13px secondary) → bold price (+ strikethrough original) → amber stars + `(count)`.

### 7.6 Chips & pills

Filter chip: `px-4 py-2 rounded-full text-[13px] font-medium`; active `bg-primary/15 text-primary`, inactive plain `text-theme-secondary`. Count chip (listings): tinted active with number bubble. Segmented toggle: `bg-elevated rounded-2xl p-1.5`, active segment solid red with white text.

### 7.7 Buttons

| Kind | Recipe |
|---|---|
| Primary | `bg-primary text-white rounded-full font-semibold hover:bg-primary-hover` |
| Secondary | `border border-primary text-primary rounded-full hover:bg-primary/5` |
| Quiet | `bg-elevated text-theme-primary rounded-xl/full` |
| Destructive | `bg-[#FF4D4D] text-white` (delete account) or red-tinted rows |
| Hero CTA | full-width `rounded-full bg-gradient-to-r from-primary to-red-600` + `shadow-primary/25` (Post Your First Ad) |
| Icon button | `p-2.5 rounded-full hover:bg-elevated` |
| Toggle | 40–48px track, `bg-primary` when on, white knob, `translate-x` transition |

### 7.8 Overlays — the popover rule

**Desktop/web never uses bottom sheets.** Menus, delete choosers, translate pickers, wallpaper pickers, sort menus render as popovers/dropdowns anchored to their trigger: `absolute` panel + `bg-surface border-theme rounded-xl/2xl shadow-2xl` + invisible `fixed inset-0` click-away layer. Centered modals (`fixed inset-0 bg-black/50` + `max-w-sm rounded-2xl p-6` card) are reserved for confirmations (logout, block, clear). Full-screen immersive overlays: story viewer, video editor, call screen.

### 7.9 State views (`app/components/app-state-views.tsx`)

- **Loading:** `SkeletonList` / `SkeletonGrid` — `animate-pulse bg-elevated` blocks shaped like the real layout.
- **Empty:** 88px `bg-elevated` circle + muted icon, 17px semibold title, 13.5px secondary message, optional outlined-red action pill.
- **Error:** 88px `#FF4D4D/10` circle + red `CloudOff`, "Something went wrong", solid red `Try again` pill with `RefreshCw`.
- **Lifecycle:** `usePageLoad()` → 700ms skeleton, offline ⇒ error with retry; `?__state=loading|error|empty` pins a state (screenshot harness). Route level: `loading.tsx` (branded spinner), `error.tsx`/`global-error.tsx`, `not-found.tsx` (big 404), plus the global dark `OfflineBanner`.

### 7.10 Toasts

Pill bottom-center, `bg-green-600` success / semantic color per type, white 14px text + icon, auto-dismiss ~2.2s (via `ToastProvider`).

---

## 8. Motion

| Pattern | Recipe |
|---|---|
| Hover/state changes | `transition-colors` (~150ms default); never animate layout on hover |
| Press feedback | `active:scale-95` on FABs/primary buttons |
| Reaction/emoji hover | `hover:scale-110`–`125 transition-transform` |
| Entrances | `animate-slide-down` / `animate-slide-up` (0.3s ease-out), `animate-bounce-in` (0.6s spring) |
| Loading | `animate-pulse` skeletons; `animate-spin` ring spinner; recording dot `animate-pulse` |
| Live indicators | small dot `animate-pulse` |
| Story progress | 4s per segment, JS-driven width |

Keep it subtle: color transitions everywhere, transforms only for press/hover feedback and entrances.

---

## 9. Voice & Content

- Currency: `Ksh 145,000` (space, comma thousands); counts: `1.2K`, `24.5K`.
- Empty states are encouraging and actionable ("No Listings Yet — Start selling by creating your first listing!").
- Errors are calm and generic with a retry: "Something went wrong / Please check your connection and try again."
- Destructive flows confirm twice (type `DELETE`, then password) and state the 30-day restore window.

---

## 10. Accessibility & Quality bar

- Icon-only buttons carry `aria-label`; images carry `alt`.
- Focus styles: inputs get `focus:border-primary` (+ ring on desktop forms).
- Touch targets ≥ 40px on mobile chrome.
- Both themes must be checked for any new component — use semantic utilities, not fixed grays.
- Every data screen ships all four states (see §7.9); verify with the screenshot harness: `node scripts/screenshots.mjs` against a local `next start`, which captures 51 routes × mobile/tablet/desktop × content+loading+error+empty into `screenshots/`.
