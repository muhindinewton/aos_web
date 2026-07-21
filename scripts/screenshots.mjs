// Screenshot harness — web counterpart of aos_app/lib/screenshot_harness.dart.
// Sweeps every page at mobile / tablet / desktop viewports and captures each
// state: content, plus loading / error / empty for screens wired through
// usePageLoad (forced via the `__state` query param, like mobile's MODE env).
//
// Usage:  node scripts/screenshots.mjs [baseUrl]
// Output: screenshots/{mobile,tablet,desktop}/{slug}.png
//         screenshots/{viewport}/{loading,error,empty}/{slug}.png

import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const BASE = process.argv[2] || 'http://localhost:3100';
// THEME=dark captures the dark theme into screenshots/dark/…
const THEME = process.env.THEME === 'dark' ? 'dark' : 'light';
const OUT = THEME === 'dark' ? path.resolve('screenshots', 'dark') : path.resolve('screenshots');

const CHROME =
  process.env.CHROME_PATH ||
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const VIEWPORTS = {
  mobile:  { width: 390,  height: 844,  deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  tablet:  { width: 820,  height: 1180, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  desktop: { width: 1440, height: 900,  deviceScaleFactor: 1, isMobile: false, hasTouch: false },
};

// stateful: page uses usePageLoad, so __state=loading|error|empty are real.
const ROUTES = [
  { slug: '01-home',                path: '/' },
  { slug: '02-shop',                path: '/shop', stateful: true },
  { slug: '03-categories',          path: '/categories' },
  { slug: '04-subcategory',         path: '/subcategory?cat=Electronics&sub=All', stateful: true },
  { slug: '05-search',              path: '/search', stateful: true },
  { slug: '06-search-voice',        path: '/search/voice' },
  { slug: '07-search-image',        path: '/search/image' },
  { slug: '08-product-detail',      path: '/product/1' },
  { slug: '09-service-detail',      path: '/product/51' },
  { slug: '10-report-product',      path: '/product/1/report' },
  { slug: '11-all-reviews',         path: '/reviews/1' },
  { slug: '12-write-review',        path: '/reviews/1/write' },
  { slug: '13-feed',                path: '/feed' },
  { slug: '14-creator-profile',     path: '/feed/creator/tech-gadgets' },
  { slug: '15-followers-following', path: '/feed/followers/me' },
  { slug: '16-connect-chats',       path: '/chat', stateful: true },
  { slug: '17-connect-calls',       path: '/calls', stateful: true },
  { slug: '17b-chat-settings',      path: '/chat/settings' },
  { slug: '18-chat-detail',         path: '/chat/1' },
  { slug: '19-chat-profile',        path: '/chat/1/profile' },
  { slug: '20-new-chat',            path: '/chat/new', stateful: true },
  { slug: '21-new-conversation',    path: '/calls/new', stateful: true },
  { slug: '22-notifications',       path: '/notifications', stateful: true },
  { slug: '23-account',             path: '/account' },
  { slug: '24-profile',             path: '/account/profile' },
  { slug: '25-wishlist',            path: '/account/wishlist', stateful: true },
  { slug: '26-activity-center',     path: '/account/activity', stateful: true },
  { slug: '27-my-storefront',       path: '/account/storefront' },
  { slug: '28-storefront-customize',path: '/account/storefront/customize' },
  { slug: '29-settings',            path: '/account/settings' },
  { slug: '30-preferences',         path: '/account/preferences' },
  { slug: '31-security',            path: '/account/security' },
  { slug: '32-notification-prefs',  path: '/account/notifications' },
  { slug: '33-verification',        path: '/account/verification' },
  { slug: '34-delete-account',      path: '/account/delete' },
  { slug: '35-restore-account',     path: '/auth/restore' },
  { slug: '36-login',               path: '/auth/login' },
  { slug: '37-signup',              path: '/auth/signup' },
  { slug: '38-forgot-password',     path: '/auth/forgot-password' },
  { slug: '38b-verify-email',       path: '/auth/verify' },
  { slug: '39-onboarding',          path: '/onboarding' },
  { slug: '39b-onboarding-language', path: '/onboarding?step=language' },
  { slug: '39c-onboarding-country',  path: '/onboarding?step=country' },
  { slug: '39d-onboarding-currency', path: '/onboarding?step=currency' },
  { slug: '40-sell-hub',            path: '/sell' },
  { slug: '41-sell-post',           path: '/sell/post' },
  { slug: '42-sell-listings',       path: '/sell/listings', stateful: true },
  { slug: '43-sell-live',           path: '/sell/live' },
  { slug: '43b-sell-video',         path: '/sell/video' },
  { slug: '44-map',                 path: '/map/TechHub%20Kenya' },
  { slug: '45-tips-ranking',        path: '/tips/ranking' },
  { slug: '46-tips-marketing',      path: '/tips/marketing' },
  { slug: '47-tips-photography',    path: '/tips/photography' },
  { slug: '48-help',                path: '/help' },
  { slug: '49-terms',               path: '/terms' },
  { slug: '50-privacy',             path: '/privacy' },
  { slug: '51-not-found',           path: '/this-page-does-not-exist' },
  // Route aliases, deliberately not given their own entries: /contact and
  // /calls both re-export /chat's component (16/17 cover them), and
  // /feed/profile re-exports /account/profile — 54 below shoots it anyway, so
  // a broken alias shows up as a 404 rather than passing silently.
  { slug: '52-seller-storefront',   path: '/seller/1' },
  { slug: '53-active-call',         path: '/call/1' },
  { slug: '53b-active-video-call',  path: '/call/1?video=1' },
  { slug: '54-feed-profile',        path: '/feed/profile' },
];

const STATE_PARAMS = { loading: '__state=loading', error: '__state=error', empty: '__state=empty' };

// Seeded into sessionStorage so AuthProvider skips Firebase and renders the
// signed-in tree. Without this the account screens capture their signed-out
// shell (ProtectedRoute's bypass shows the page, but `user` stays null).
const MOCK_USER = {
  id: 'screenshot-uid',
  email: 'newton@example.com',
  displayName: 'Newton Muhindi',
  photoURL: null,
  phoneNumber: '+254 712 345 678',
  countryCode: 'KE',
  countryName: 'Kenya',
  city: 'Nairobi',
};

// Pages that render a materially different tree when signed OUT. The main pass
// runs signed-in, so these get a second capture under {viewport}/signed-out/.
const SIGNED_OUT_ROUTES = [
  { slug: '23-account',  path: '/account' },
  { slug: '24-profile',  path: '/account/profile' },
  { slug: '01-home',     path: '/' },
];

// ── Interaction flows ────────────────────────────────────────────────────────
// States a plain page load can never reach: dropdowns, sheets, modals, tabs,
// multi-step forms. Each flow navigates, runs its steps, then shoots.
//
// Step vocabulary (see runSteps): ['click', sel] ['text', label] ['hover', sel]
// ['type', sel, value] ['wait', ms] ['press', key]
//
// `only` restricts viewports when the trigger itself is viewport-gated.
const FLOWS = [
  // ── Global chrome ────────────────────────────────────────────────────────
  { slug: 'f01-header-account-menu',    path: '/',  only: ['desktop'], steps: [['click', 'header button[title="Account"]']] },
  // header.lg\:block — no descendant space; the class is on the <header> itself.
  { slug: 'f02-location-picker-city',   path: '/',  only: ['desktop'], steps: [['click', 'header.lg\\:block button:has(.lucide-map-pin)']] },
  { slug: 'f03-location-picker-country',path: '/',  only: ['desktop'], steps: [['click', 'header.lg\\:block button:has(.lucide-map-pin)'], ['wait', 400], ['click', '.fixed button:has(.lucide-chevron-left)']] },
  { slug: 'f04-location-picker-mobile', path: '/',  only: ['mobile'],  steps: [['click', 'header.lg\\:hidden button']] },
  { slug: 'f05-home-category-flyout',   path: '/',  only: ['desktop', 'tablet'], steps: [['hover', 'aside a, .hidden.md\\:flex a']] },

  // ── Account ──────────────────────────────────────────────────────────────
  { slug: 'f10-account-logout-modal',   path: '/account',              steps: [['text', 'Logout']] },
  { slug: 'f11-settings-language',      path: '/account/settings',     steps: [['text', 'Language']] },
  { slug: 'f12-settings-currency',      path: '/account/settings',     steps: [['text', 'Currency']] },
  { slug: 'f13-settings-country',       path: '/account/settings',     steps: [['text', 'Country']] },
  { slug: 'f14-prefs-language-sheet',   path: '/account/preferences',  steps: [['text', 'Language']] },
  { slug: 'f15-prefs-country-sheet',    path: '/account/preferences',  steps: [['text', 'Country']] },
  { slug: 'f16-prefs-currency-sheet',   path: '/account/preferences',  steps: [['text', 'Currency']] },
  { slug: 'f17-wishlist-sort',          path: '/account/wishlist',     steps: [['text', 'Best Match']] },
  { slug: 'f18-wishlist-list-view',     path: '/account/wishlist',     steps: [['click', 'button[aria-label="Toggle view"]']] },
  { slug: 'f19-security-tab',           path: '/account/security',     steps: [['text', 'Security']] },
  { slug: 'f20-activity-clear-confirm', path: '/account/activity',     steps: [['text', 'Clear']] },
  { slug: 'f21-profile-edit-sheet',     path: '/account/profile',      steps: [['text', 'Edit profile']] },
  { slug: 'f22-profile-saved-tab',      path: '/account/profile',      steps: [['text', 'Saved']] },
  { slug: 'f23-profile-liked-tab',      path: '/account/profile',      steps: [['text', 'Liked']] },
  { slug: 'f24-verification-personal',  path: '/account/verification', steps: [['text', 'Personal verification'], ['wait', 300], ['text', 'Continue']] },
  { slug: 'f25-verification-business',  path: '/account/verification', steps: [['text', 'Business verification'], ['wait', 300], ['text', 'Continue']] },

  // ── Catalogue ────────────────────────────────────────────────────────────
  { slug: 'f30-seller-nav-menu',        path: '/seller/1',   steps: [['click', 'button:has(.lucide-more-horizontal)']] },
  { slug: 'f31-seller-sort-sheet',      path: '/seller/1',   steps: [['text', 'Sort by']] },
  { slug: 'f32-seller-category-sheet',  path: '/seller/1',   steps: [['text', 'Categories']] },
  { slug: 'f33-seller-about-expanded',  path: '/seller/1',   steps: [['text', 'About']] },
  { slug: 'f34-subcategory-sort',       path: '/subcategory?cat=Electronics&sub=All', steps: [['text', 'Best Match']] },
  { slug: 'f35-subcategory-list-view',  path: '/subcategory?cat=Electronics&sub=All', steps: [['click', '.bg-elevated.rounded-lg button:nth-of-type(2)']] },
  { slug: 'f36-product-wishlist-toast', path: '/product/1',  steps: [['click', 'button[aria-label="Add to wishlist"]']] },
  { slug: 'f37-product-image-2',        path: '/product/1',  steps: [['click', 'button[aria-label="Next image"]']] },
  { slug: 'f38-report-reason-picked',   path: '/product/1/report', steps: [['text', 'Counterfeit or Fake Product']] },
  { slug: 'f38b-report-submitted',      path: '/product/1/report', steps: [['text', 'Counterfeit or Fake Product'], ['wait', 300], ['text', 'Submit Report'], ['wait', 600]] },
  { slug: 'f39-reviews-filter-modal',   path: '/reviews/1',  steps: [['text', 'Filter']] },
  { slug: 'f40-reviews-newest-tab',     path: '/reviews/1',  steps: [['text', 'Newest']] },

  // ── Feed ─────────────────────────────────────────────────────────────────
  { slug: 'f50-feed-following-tab',     path: '/feed',       steps: [['text', 'Following']] },
  { slug: 'f51-feed-live-tab',          path: '/feed',       steps: [['text', 'Live']] },
  { slug: 'f52-feed-viewer',            path: '/feed',       steps: [['click', 'main img, article'], ['wait', 700]] },
  { slug: 'f53-feed-viewer-comments',   path: '/feed',       steps: [['click', 'main img, article'], ['wait', 700], ['click', 'button:has(.lucide-message-circle)']] },
  { slug: 'f54-feed-viewer-options',    path: '/feed',       steps: [['click', 'main img, article'], ['wait', 700], ['click', 'button:has(.lucide-more-horizontal)']] },
  { slug: 'f55-creator-liked-tab',      path: '/feed/creator/tech-gadgets', steps: [['text', 'Liked']] },
  { slug: 'f56-followers-followers-tab',path: '/feed/followers/me',        steps: [['text', 'Followers']] },
  { slug: 'f57-followers-suggested-tab',path: '/feed/followers/me',        steps: [['text', 'Suggested']] },

  // ── Connect (chats / calls) ──────────────────────────────────────────────
  { slug: 'f60-chats-menu',             path: '/chat',   steps: [['click', 'button[aria-label="Menu"]']] },
  { slug: 'f61-chats-unread-filter',    path: '/chat',   steps: [['text', 'Unread']] },
  { slug: 'f62-calls-tab',              path: '/calls',  steps: [['text', 'Calls']] },
  { slug: 'f63-calls-menu',             path: '/calls',  steps: [['text', 'Calls'], ['wait', 300], ['click', 'button[aria-label="Menu"]']] },
  { slug: 'f64-calls-missed-filter',    path: '/calls',  steps: [['text', 'Calls'], ['wait', 300], ['text', 'Missed']] },
  { slug: 'f65-story-viewer',           path: '/chat',   steps: [['click', '[aria-label^="Story"], .rounded-full.ring-2'], ['wait', 500]] },
  { slug: 'f66-chat-menu',              path: '/chat/1', steps: [['click', 'button[aria-label="More options"]']] },
  { slug: 'f67-chat-wallpaper-picker',  path: '/chat/1', steps: [['click', 'button[aria-label="More options"]'], ['wait', 300], ['text', 'Change wallpaper']] },
  { slug: 'f68-chat-attach-sheet',      path: '/chat/1', steps: [['click', 'button[aria-label="Attach"]']] },
  { slug: 'f69-chat-emoji-picker',      path: '/chat/1', steps: [['click', 'button[aria-label="Emoji"]']] },
  { slug: 'f70-chat-recording',         path: '/chat/1', steps: [['click', 'button[aria-label="Record voice message"]'], ['wait', 500]] },
  { slug: 'f71-chat-profile-block',     path: '/chat/1/profile', steps: [['click', 'button:has(.lucide-ban), button:has(.lucide-shield-off)']] },
  { slug: 'f72-chat-settings-wallpaper',path: '/chat/settings',  steps: [['text', 'Chat wallpaper']] },
  { slug: 'f73-new-conv-friends-tab',   path: '/calls/new',      steps: [['text', 'Friends']] },

  // ── Sell ─────────────────────────────────────────────────────────────────
  { slug: 'f80-listings-active-tab',    path: '/sell/listings', steps: [['text', 'Active']] },
  { slug: 'f81-listings-drafts-tab',    path: '/sell/listings', steps: [['text', 'Drafts']] },
  { slug: 'f82-listings-row-menu',      path: '/sell/listings', steps: [['click', 'button:has(.lucide-more-vertical)']] },
  { slug: 'f83-post-category-picker',   path: '/sell/post',     steps: [['click', 'button:has(.lucide-layout-grid)']] },
  { slug: 'f84-post-location-picker',   path: '/sell/post',     steps: [['click', 'button:has(.lucide-map-pin)']] },
  { slug: 'f85-live-product-picker',    path: '/sell/live',     steps: [['text', 'Add featured products']] },
  // The editor only exists after a take, so record → stop → Next first. Needs
  // Chrome's fake capture device (the launch flags below provide it).
  { slug: 'f86-video-editor',           path: '/sell/video',    steps: [['click', 'button:has(.lucide-video)'], ['wait', 1500], ['click', 'button:has(.lucide-square)'], ['wait', 900], ['text', 'Next'], ['wait', 700]] },
  { slug: 'f87-video-sound-picker',     path: '/sell/video',    steps: [['click', 'button:has(.lucide-video)'], ['wait', 1500], ['click', 'button:has(.lucide-square)'], ['wait', 900], ['text', 'Next'], ['wait', 700], ['text', 'Add sound']] },

  // ── Notifications / onboarding ───────────────────────────────────────────
  { slug: 'f90-notifications-messages', path: '/notifications', steps: [['text', 'Messages']] },
  // Notification rows are <div onClick>, not buttons.
  { slug: 'f91-notification-detail',    path: '/notifications', steps: [['click', 'div.cursor-pointer.rounded-xl.border'], ['wait', 400]] },
  { slug: 'f92-onboarding-lang-sheet',  path: '/onboarding?step=language', steps: [['click', 'button:has(.lucide-chevron-down), main button']] },
  // /categories redirects to /shop at ≥768px, so mobile-only. The left rail is a
  // plain div, not <aside>/<nav>.
  { slug: 'f93-categories-third-cat',   path: '/categories', only: ['mobile'], steps: [['click', '.w-\\[88px\\] > button:nth-of-type(3)']] },
];

const FLOWS_TO_RUN = process.env.ONLY
  ? FLOWS.filter(f => f.slug.includes(process.env.ONLY))
  : (process.env.NO_FLOWS ? [] : FLOWS);

// ONLY=<slug substring> captures a subset — for adding one new page without a
// full re-run, e.g.:  ONLY=verify-email node scripts/screenshots.mjs
const ROUTES_TO_RUN = process.env.ONLY
  ? ROUTES.filter(r => r.slug.includes(process.env.ONLY))
  : ROUTES;

const withParam = (p, q) => (p.includes('?') ? `${p}&${q}` : `${p}?${q}`);
const sleep = ms => new Promise(r => setTimeout(r, ms));

// Pages that leak horizontal overflow (clipped by the global overflow-x:
// hidden, so invisible in stills) are collected here and fail the run.
const overflows = [];

// Flows that never reached their target state — a selector went stale or the
// trigger moved. Reported at the end so a silently-identical shot can't pass
// as coverage.
const flowFailures = [];

// Click the innermost element whose trimmed text matches `label`. Rows here are
// often <div onClick> rather than <button>, so this can't just query buttons.
// el.click() dispatches a real bubbling MouseEvent, which React's delegated
// listener picks up.
async function clickByText(page, label) {
  return page.evaluate(text => {
    const norm = s => (s || '').replace(/\s+/g, ' ').trim();
    const visible = el => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    };
    const els = Array.from(document.querySelectorAll('button, a, [role="button"], [role="tab"], div, span, p, li'))
      .filter(visible);

    // Exact first. Then prefix — tabs and chips append a count with no
    // separator ("Drafts1", "Followers 7"), so an exact match would miss them.
    // Substring last, as the loosest fallback.
    let hits = els.filter(el => norm(el.textContent) === text);
    if (!hits.length) hits = els.filter(el => norm(el.textContent).startsWith(text));
    if (!hits.length) hits = els.filter(el => norm(el.textContent).includes(text));
    if (!hits.length) return false;

    // Innermost = fewest descendants, i.e. the actual control not its wrapper.
    hits.sort((a, b) => a.querySelectorAll('*').length - b.querySelectorAll('*').length);
    let target = hits[0];
    const clickable = target.closest('button, a, [role="button"], [role="tab"]');
    if (clickable) target = clickable;
    target.scrollIntoView({ block: 'center' });
    target.click();
    return true;
  }, label);
}

async function runSteps(page, steps, slug) {
  for (const [op, arg, arg2] of steps) {
    try {
      if (op === 'wait') { await sleep(arg); continue; }
      if (op === 'press') { await page.keyboard.press(arg); continue; }
      if (op === 'text') {
        const ok = await clickByText(page, arg);
        if (!ok) { flowFailures.push({ slug, step: `text:${arg}`, reason: 'no element with that exact text' }); return false; }
      } else if (op === 'click') {
        const el = await page.$(arg);
        if (!el) { flowFailures.push({ slug, step: `click:${arg}`, reason: 'selector matched nothing' }); return false; }
        await el.evaluate(e => e.scrollIntoView({ block: 'center' }));
        // Real mouse click first; fall back to a DOM click for controls Puppeteer
        // rejects as unclickable (hover-revealed carousel arrows, overlapped
        // absolute elements). React's delegated listener handles both.
        try {
          await el.click();
        } catch {
          await el.evaluate(e => e.click());
        }
      } else if (op === 'hover') {
        const el = await page.$(arg);
        if (!el) { flowFailures.push({ slug, step: `hover:${arg}`, reason: 'selector matched nothing' }); return false; }
        await el.hover();
      } else if (op === 'type') {
        const el = await page.$(arg);
        if (!el) { flowFailures.push({ slug, step: `type:${arg}`, reason: 'selector matched nothing' }); return false; }
        await el.type(arg2, { delay: 20 });
      }
      await sleep(350);
    } catch (e) {
      flowFailures.push({ slug, step: `${op}:${arg}`, reason: e.message.split('\n')[0] });
      return false;
    }
  }
  return true;
}

async function capture(page, url, file, settleMs, fullFile = null) {
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 25000 });
  } catch {
    // Media-heavy pages (feed, live) keep connections open — capture anyway.
  }
  // Freeze animations for stable frames.
  try {
    await page.addStyleTag({
      content: '*,*::before,*::after{animation-play-state:paused!important;transition:none!important;caret-color:transparent!important}',
    });
  } catch { /* navigation raced the style tag — the shot is still fine */ }
  await sleep(settleMs);

  // Layout assertion: no page may be wider than the viewport.
  const overflowPx = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  if (overflowPx > 1) {
    overflows.push({ shot: path.relative(OUT, file), overflowPx });
    process.stdout.write(`  ⚠ OVERFLOW +${overflowPx}px ${path.relative(OUT, file)}\n`);
  }

  await page.screenshot({ path: file });
  process.stdout.write(`  ✓ ${path.relative(OUT, file)}\n`);

  // Long pages: also capture the entire scroll height, stitched.
  if (!fullFile) return;
  const { scrollH, viewH } = await page.evaluate(() => ({
    scrollH: document.documentElement.scrollHeight,
    viewH: window.innerHeight,
  }));
  if (scrollH <= viewH + 60) return; // fits in one screen — viewport shot is the full page

  // Walk the page once so lazy images/content below the fold load first.
  await page.evaluate(async () => {
    const step = window.innerHeight;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await sleep(400);
  await page.screenshot({ path: fullFile, fullPage: true });
  process.stdout.write(`  ✓ ${path.relative(OUT, fullFile)} (full page)\n`);
}

// Like capture(), but drives the page into an interaction state first. Steps run
// BEFORE animations are frozen, so entry transitions finish and the overlay is
// shot settled rather than mid-flight.
async function captureFlow(page, url, file, steps, slug) {
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 25000 });
  } catch { /* media-heavy pages hold connections open */ }
  await sleep(1200);

  const reached = await runSteps(page, steps, slug);
  if (!reached) {
    process.stdout.write(`  ✗ ${path.relative(OUT, file)} — flow did not reach its state, not saved\n`);
    return;
  }
  await sleep(500);

  try {
    await page.addStyleTag({
      content: '*,*::before,*::after{animation-play-state:paused!important;transition:none!important;caret-color:transparent!important}',
    });
  } catch { /* fine */ }
  await sleep(200);

  await page.screenshot({ path: file });
  process.stdout.write(`  ✓ ${path.relative(OUT, file)}\n`);
}

// signedIn=false skips the mock-user seed so pages render their logged-out tree.
async function newPage(browser, viewport, signedIn = true) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: THEME }]);
  await page.evaluateOnNewDocument((theme, user) => {
    try {
      sessionStorage.setItem('aos_splash_seen', 'true');
      sessionStorage.setItem('aos-screenshot-mode', '1');
      sessionStorage.setItem('aos-pending-verify-email', 'newton@example.com');
      localStorage.setItem('aos-theme', theme);
      if (user) sessionStorage.setItem('aos-screenshot-user', user);
      else sessionStorage.removeItem('aos-screenshot-user');
    } catch {}
  }, THEME, signedIn ? JSON.stringify(MOCK_USER) : null);
  return page;
}

async function main() {
  // Abort loudly if the app server isn't serving — otherwise every capture
  // is a byte-identical Chrome error page and the run looks "successful".
  const health = await fetch(BASE).catch(() => null);
  if (!health || !health.ok) {
    console.error(`✗ Server not reachable at ${BASE} (status ${health?.status ?? 'none'}). Start it with: npx next start -p 3100`);
    process.exit(2);
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--use-fake-ui-for-media-devices',
      '--use-fake-device-for-media-stream',
      '--hide-scrollbars',
    ],
  });

  // The fake-device flags alone still leave getUserMedia at NotAllowedError —
  // the origin needs an explicit grant. Without this the camera/mic screens
  // (/sell/video, /sell/live, /search/image, /search/voice) all capture their
  // permission-denied fallback instead of the real UI.
  await browser
    .defaultBrowserContext()
    .overridePermissions(BASE, ['camera', 'microphone', 'geolocation']);

  // VP=desktop limits the run to one viewport — for iterating on a flow.
  const vpFilter = process.env.VP ? process.env.VP.split(',') : null;
  const vps = Object.entries(VIEWPORTS).filter(([n]) => !vpFilter || vpFilter.includes(n));

  for (const [vpName, viewport] of vps) {
    // The server can die mid-run (long captures); recheck before each pass.
    const alive = await fetch(BASE).catch(() => null);
    if (!alive || !alive.ok) {
      console.error(`✗ Server stopped responding before the ${vpName} pass — aborting.`);
      process.exit(2);
    }

    // Main pass runs signed-in, so the account tree renders its real content.
    const page = await newPage(browser, viewport, true);

    mkdirSync(path.join(OUT, vpName), { recursive: true });
    mkdirSync(path.join(OUT, vpName, 'full'), { recursive: true });
    mkdirSync(path.join(OUT, vpName, 'flows'), { recursive: true });
    mkdirSync(path.join(OUT, vpName, 'signed-out'), { recursive: true });
    for (const s of Object.keys(STATE_PARAMS)) {
      mkdirSync(path.join(OUT, vpName, s), { recursive: true });
    }

    console.log(`\n── ${vpName} (${viewport.width}×${viewport.height}) ──`);
    for (const route of ROUTES_TO_RUN) {
      // Content state — give usePageLoad's 700ms fetch time to settle.
      // Pages taller than the viewport also get a stitched full-page shot.
      await capture(
        page,
        BASE + route.path,
        path.join(OUT, vpName, `${route.slug}.png`),
        1400,
        path.join(OUT, vpName, 'full', `${route.slug}.png`),
      );

      if (!route.stateful) continue;
      for (const [state, param] of Object.entries(STATE_PARAMS)) {
        await capture(
          page,
          BASE + withParam(route.path, param),
          path.join(OUT, vpName, state, `${route.slug}.png`),
          state === 'empty' ? 1400 : 500,
        );
      }
    }

    // Interaction states — dropdowns, sheets, modals, tabs.
    const flows = FLOWS_TO_RUN.filter(f => !f.only || f.only.includes(vpName));
    if (flows.length) {
      console.log(`   · ${flows.length} interaction flows`);
      for (const flow of flows) {
        await captureFlow(
          page,
          BASE + flow.path,
          path.join(OUT, vpName, 'flows', `${flow.slug}.png`),
          flow.steps,
          `${vpName}/${flow.slug}`,
        );
      }
    }
    await page.close();

    // Signed-out rendering of the pages that branch on auth.
    if (!process.env.ONLY) {
      const anon = await newPage(browser, viewport, false);
      console.log(`   · ${SIGNED_OUT_ROUTES.length} signed-out variants`);
      for (const route of SIGNED_OUT_ROUTES) {
        await capture(
          anon,
          BASE + route.path,
          path.join(OUT, vpName, 'signed-out', `${route.slug}.png`),
          1400,
        );
      }
      await anon.close();
    }
  }

  await browser.close();

  if (flowFailures.length) {
    console.error(`\n✗ ${flowFailures.length} interaction flow(s) never reached their state (no shot saved):`);
    for (const f of flowFailures) console.error(`   ${f.slug}  —  ${f.step}  (${f.reason})`);
    console.error('  Usual cause: the trigger moved or its selector/label changed. Fix the step in FLOWS.');
    process.exitCode = 1;
  }

  if (overflows.length) {
    console.error(`\n✗ ${overflows.length} capture(s) have horizontal overflow (page wider than viewport):`);
    for (const o of overflows) console.error(`   +${o.overflowPx}px  ${o.shot}`);
    console.error('  Usual culprit: a grid/flex child missing min-w-0, or a fixed-width block.');
    process.exitCode = 1;
  }
  console.log(`\nDone → ${OUT}`);
}

main().catch(err => { console.error(err); process.exit(1); });
