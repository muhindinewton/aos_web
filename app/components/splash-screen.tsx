'use client';

import React, { useState, useEffect } from 'react';

// Modern splash — deliberately minimal, per current launch-screen practice:
// resolve in well under 2s, one focal element (the logo), quiet micro-motion
// (blur-to-sharp + a soft breathing glow) rather than a spin/burst, and a thin
// progress line instead of a spinner. The logo already contains the "AOS"
// wordmark, so there is no separate text lockup. A deep gradient replaces the
// old dark card: the logo's white shapes stay legible without a box around it.

interface SplashScreenProps { onComplete: () => void; }

const PRIMARY_RED = '#C1121F';
const KENYA_GREEN = '#0B7A3B';

// Total ≈ 1.6s of presence + a 420ms fade. Snappy on a real device; the logo
// itself resolves in the first ~700ms.
const HOLD_MS  = 1600;
const FADE_MS  = 420;

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [revealed, setRevealed] = useState(false);  // logo blur/scale/opacity in
  const [fading, setFading]     = useState(false);
  const [reduced, setReduced]   = useState(false);

  useEffect(() => {
    const rm = typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    setReduced(!!rm);

    // Next frame so the initial (hidden) state paints before we transition in —
    // otherwise the browser collapses both into one frame and the reveal is lost.
    const raf = requestAnimationFrame(() => setRevealed(true));
    const t1  = setTimeout(() => setFading(true), HOLD_MS);
    const t2  = setTimeout(onComplete, HOLD_MS + FADE_MS);

    return () => { cancelAnimationFrame(raf); clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  const revealMs = reduced ? 200 : 720;

  return (
    <div
      className="fixed inset-0 z-[200] overflow-hidden"
      style={{
        // Deep, slightly warm charcoal → near-black. Not flat black — the radial
        // lift gives the logo something to sit in.
        background: 'radial-gradient(120% 120% at 50% 38%, #1B1C22 0%, #101116 55%, #08090C 100%)',
        opacity: fading ? 0 : 1,
        transition: `opacity ${FADE_MS}ms ease`,
      }}
    >
      <style>{`
        @keyframes aos-drift-a {
          0%,100% { transform: translate3d(-4%, -2%, 0) scale(1); }
          50%     { transform: translate3d(4%, 3%, 0) scale(1.08); }
        }
        @keyframes aos-drift-b {
          0%,100% { transform: translate3d(3%, 2%, 0) scale(1.05); }
          50%     { transform: translate3d(-3%, -3%, 0) scale(1); }
        }
        @keyframes aos-glow {
          0%,100% { opacity: .55; transform: translate(-50%, -50%) scale(1); }
          50%     { opacity: .8;  transform: translate(-50%, -50%) scale(1.06); }
        }
        @media (prefers-reduced-motion: reduce) {
          .aos-anim { animation: none !important; }
        }
      `}</style>

      {/* Soft colour blobs — a quiet gradient-mesh depth, not the old bubble field. */}
      <div
        className="aos-anim pointer-events-none absolute"
        style={{
          top: '-10%', left: '-8%', width: '55vmax', height: '55vmax',
          background: `radial-gradient(circle, ${PRIMARY_RED}2E 0%, ${PRIMARY_RED}00 62%)`,
          filter: 'blur(12px)',
          animation: 'aos-drift-a 9s ease-in-out infinite',
        }}
      />
      <div
        className="aos-anim pointer-events-none absolute"
        style={{
          bottom: '-14%', right: '-10%', width: '52vmax', height: '52vmax',
          background: `radial-gradient(circle, ${KENYA_GREEN}26 0%, ${KENYA_GREEN}00 62%)`,
          filter: 'blur(12px)',
          animation: 'aos-drift-b 11s ease-in-out infinite',
        }}
      />

      {/* Center stack */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-8">
        <div className="relative flex items-center justify-center" style={{ width: 168, height: 168 }}>
          {/* Breathing glow directly behind the logo — gives the white shapes a
              halo so they never read as floating on nothing. */}
          <div
            className="aos-anim absolute left-1/2 top-1/2 pointer-events-none"
            style={{
              width: 220, height: 220, borderRadius: '50%',
              background: `radial-gradient(circle, ${PRIMARY_RED}3A 0%, ${PRIMARY_RED}00 68%)`,
              transform: 'translate(-50%, -50%)',
              opacity: revealed ? 1 : 0,
              transition: `opacity ${revealMs}ms ease`,
              animation: revealed ? 'aos-glow 3.4s ease-in-out infinite' : 'none',
            }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/aos-logo.png"
            alt="AOS — Africa Online Space"
            style={{
              width: '100%', height: '100%', objectFit: 'contain',
              position: 'relative',
              opacity: revealed ? 1 : 0,
              transform: revealed ? 'scale(1)' : 'scale(0.9)',
              filter: revealed
                ? 'drop-shadow(0 8px 26px rgba(0,0,0,0.45))'
                : 'blur(10px) drop-shadow(0 8px 26px rgba(0,0,0,0.45))',
              transition: `opacity ${revealMs}ms ease, transform ${revealMs}ms cubic-bezier(0.16,1,0.3,1), filter ${revealMs}ms ease`,
            }}
          />
        </div>

        {/* Tagline — the wordmark lives in the logo, so this is the only text. */}
        <div
          style={{
            marginTop: 26,
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'translateY(0)' : 'translateY(10px)',
            transition: `opacity ${revealMs}ms ease ${reduced ? 0 : 220}ms, transform ${revealMs}ms ease ${reduced ? 0 : 220}ms`,
          }}
        >
          <span
            style={{
              fontFamily: 'Poppins, system-ui, sans-serif',
              fontWeight: 500, fontSize: 12.5, letterSpacing: 4,
              color: 'rgba(255,255,255,0.72)', textTransform: 'uppercase',
            }}
          >
            Africa Online Space
          </span>
        </div>
      </div>

      {/* Thin determinate progress line — modern loading cue over a spinner. */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ bottom: 'max(48px, 9vh)', width: 132, height: 3, borderRadius: 3, background: 'rgba(255,255,255,0.10)', overflow: 'hidden' }}
      >
        <div
          style={{
            height: '100%', borderRadius: 3,
            background: `linear-gradient(90deg, ${PRIMARY_RED}, #E63946)`,
            width: revealed ? '100%' : '0%',
            transition: `width ${HOLD_MS - 120}ms cubic-bezier(0.4,0,0.2,1)`,
          }}
        />
      </div>
    </div>
  );
}
