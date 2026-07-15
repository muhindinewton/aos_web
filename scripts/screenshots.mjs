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
  { slug: '39-onboarding',          path: '/onboarding' },
  { slug: '40-sell-hub',            path: '/sell' },
  { slug: '41-sell-post',           path: '/sell/post' },
  { slug: '42-sell-listings',       path: '/sell/listings', stateful: true },
  { slug: '43-sell-live',           path: '/sell/live' },
  { slug: '44-map',                 path: '/map/TechHub%20Kenya' },
  { slug: '45-tips-ranking',        path: '/tips/ranking' },
  { slug: '46-tips-marketing',      path: '/tips/marketing' },
  { slug: '47-tips-photography',    path: '/tips/photography' },
  { slug: '48-help',                path: '/help' },
  { slug: '49-terms',               path: '/terms' },
  { slug: '50-privacy',             path: '/privacy' },
  { slug: '51-not-found',           path: '/this-page-does-not-exist' },
];

const STATE_PARAMS = { loading: '__state=loading', error: '__state=error', empty: '__state=empty' };

const withParam = (p, q) => (p.includes('?') ? `${p}&${q}` : `${p}?${q}`);
const sleep = ms => new Promise(r => setTimeout(r, ms));

// Pages that leak horizontal overflow (clipped by the global overflow-x:
// hidden, so invisible in stills) are collected here and fail the run.
const overflows = [];

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

  for (const [vpName, viewport] of Object.entries(VIEWPORTS)) {
    // The server can die mid-run (long captures); recheck before each pass.
    const alive = await fetch(BASE).catch(() => null);
    if (!alive || !alive.ok) {
      console.error(`✗ Server stopped responding before the ${vpName} pass — aborting.`);
      process.exit(2);
    }

    const page = await browser.newPage();
    await page.setViewport(viewport);
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: THEME }]);
    // Skip the splash and unlock protected screens, like the mobile harness.
    await page.evaluateOnNewDocument(theme => {
      try {
        sessionStorage.setItem('aos_splash_seen', 'true');
        sessionStorage.setItem('aos-screenshot-mode', '1');
        localStorage.setItem('aos-theme', theme);
      } catch {}
    }, THEME);

    mkdirSync(path.join(OUT, vpName), { recursive: true });
    mkdirSync(path.join(OUT, vpName, 'full'), { recursive: true });
    for (const s of Object.keys(STATE_PARAMS)) {
      mkdirSync(path.join(OUT, vpName, s), { recursive: true });
    }

    console.log(`\n── ${vpName} (${viewport.width}×${viewport.height}) ──`);
    for (const route of ROUTES) {
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
    await page.close();
  }

  await browser.close();

  if (overflows.length) {
    console.error(`\n✗ ${overflows.length} capture(s) have horizontal overflow (page wider than viewport):`);
    for (const o of overflows) console.error(`   +${o.overflowPx}px  ${o.shot}`);
    console.error('  Usual culprit: a grid/flex child missing min-w-0, or a fixed-width block.');
    process.exitCode = 1;
  }
  console.log(`\nDone → ${OUT}`);
}

main().catch(err => { console.error(err); process.exit(1); });
