'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Store, Heart, Smartphone, Tag, Users, Package, Star } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

// Mirror of mobile app scatter elements
// angle: radians, dist: fraction of screen height, spin: degrees rotation at peak
const ICONS = [
  { Icon: ShoppingCart, angle: 0.52,  dist: 0.27, size: 28, spin: -20 },
  { Icon: Store,        angle: 2.62,  dist: 0.25, size: 30, spin:  14 },
  { Icon: Heart,        angle: 4.19,  dist: 0.23, size: 26, spin: -23 },
  { Icon: Smartphone,   angle: 1.22,  dist: 0.22, size: 24, spin:  17 },
  { Icon: Tag,          angle: 3.49,  dist: 0.21, size: 26, spin: -11 },
  { Icon: Users,        angle: 5.76,  dist: 0.24, size: 28, spin:  23 },
  { Icon: Package,      angle: 0.87,  dist: 0.20, size: 24, spin: -17 },
  { Icon: Star,         angle: 3.14,  dist: 0.26, size: 26, spin:  11 },
];

const DOTS = [
  { angle: 1.57, dist: 0.32, size: 8 },
  { angle: 4.71, dist: 0.30, size: 6 },
  { angle: 2.09, dist: 0.35, size: 7 },
  { angle: 5.24, dist: 0.19, size: 9 },
];

const DASHES = [
  { angle: 0.26, dist: 0.28, width: 18, spin: 46 },
  { angle: 3.84, dist: 0.23, width: 14, spin: -29 },
  { angle: 2.36, dist: 0.30, width: 16, spin:  34 },
];

type Phase = 'init' | 'logo' | 'ring' | 'scatter-out' | 'scatter-in' | 'text' | 'fade';

// Ring sub-phase drives the two-circle illusion
type RingPhase = 'none' | 'grow' | 'donut' | 'thin' | 'hold' | 'contract';

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<Phase>('init');
  const [ringPhase, setRingPhase] = useState<RingPhase>('none');
  const [screenH, setScreenH] = useState(700);

  useEffect(() => {
    setScreenH(window.innerHeight);
  }, []);

  useEffect(() => {
    const run = async () => {
      await sleep(150);
      setPhase('logo');

      await sleep(750);
      setPhase('ring');
      setRingPhase('grow');

      await sleep(480);   // grow phase
      setRingPhase('donut');

      await sleep(560);   // donut phase
      setRingPhase('thin');

      // scatter-out starts during thin phase
      await sleep(220);
      setPhase('scatter-out');

      await sleep(500);   // ring finishes thinning
      setRingPhase('hold');

      await sleep(300);   // hold
      setRingPhase('contract');

      await sleep(200);   // brief overlap
      setPhase('scatter-in');

      await sleep(700);   // ring fully gone
      setRingPhase('none');

      await sleep(200);   // elements arrive back
      setPhase('text');

      await sleep(1000);
      setPhase('fade');

      await sleep(600);
      onComplete();
    };
    run();
  }, [onComplete]);

  const isOut = phase === 'scatter-out';
  const isIn  = phase === 'scatter-in';

  // Ring sizing — capped so animation stays compact on all screen sizes
  const ref    = Math.min(screenH, 420);
  const maxR   = Math.min(ref * 0.40, 220);
  const outerD = maxR * 2;

  // Compute scatter pixel offsets
  const iconPos  = ICONS.map(el => ({
    x: Math.cos(el.angle) * el.dist * ref,
    y: Math.sin(el.angle) * el.dist * ref,
  }));
  const dotPos   = DOTS.map(el => ({
    x: Math.cos(el.angle) * el.dist * ref,
    y: Math.sin(el.angle) * el.dist * ref,
  }));
  const dashPos  = DASHES.map(el => ({
    x: Math.cos(el.angle) * el.dist * ref,
    y: Math.sin(el.angle) * el.dist * ref,
  }));

  const ringStyles = (() => {
    if (ringPhase === 'none') return { outer: { width: 0, height: 0, opacity: 0, borderRadius: '50%', background: 'var(--primary)' }, inner: { width: 0, height: 0, opacity: 0 } };

    const ringColor = 'var(--primary)';

    switch (ringPhase) {
      case 'grow':
        return {
          outer: { width: outerD, height: outerD, background: ringColor, borderRadius: '50%', opacity: 1, transition: 'width 480ms cubic-bezier(0.33,1,0.68,1), height 480ms cubic-bezier(0.33,1,0.68,1), opacity 200ms ease' },
          inner: { width: 0, height: 0, opacity: 0, borderRadius: '50%', background: 'white', transition: 'none' },
        };
      case 'donut':
        return {
          outer: { width: outerD, height: outerD, background: ringColor, borderRadius: '50%', opacity: 1, transition: 'width 100ms, height 100ms' },
          inner: { width: outerD * 0.60, height: outerD * 0.60, opacity: 1, borderRadius: '50%', background: 'white', transition: 'width 560ms cubic-bezier(0.33,1,0.68,1), height 560ms cubic-bezier(0.33,1,0.68,1), opacity 200ms ease' },
        };
      case 'thin':
        return {
          outer: { width: outerD * 1.14, height: outerD * 1.14, background: ringColor, borderRadius: '50%', opacity: 1, transition: 'width 720ms linear, height 720ms linear' },
          inner: { width: outerD * 1.14 - 6, height: outerD * 1.14 - 6, opacity: 1, borderRadius: '50%', background: 'white', transition: 'width 720ms linear, height 720ms linear' },
        };
      case 'hold':
        return {
          outer: { width: outerD * 1.14, height: outerD * 1.14, background: ringColor, borderRadius: '50%', opacity: 1, transition: 'width 300ms, height 300ms' },
          inner: { width: outerD * 1.14 - 6, height: outerD * 1.14 - 6, opacity: 1, borderRadius: '50%', background: 'white', transition: 'width 300ms, height 300ms' },
        };
      case 'contract':
        return {
          outer: { width: 0, height: 0, background: ringColor, borderRadius: '50%', opacity: 0, transition: 'width 700ms cubic-bezier(0.37,0,0.63,1), height 700ms cubic-bezier(0.37,0,0.63,1), opacity 500ms ease 200ms' },
          inner: { width: 0, height: 0, opacity: 0, borderRadius: '50%', background: 'white', transition: 'width 700ms cubic-bezier(0.37,0,0.63,1), height 700ms cubic-bezier(0.37,0,0.63,1), opacity 300ms ease' },
        };
      default:
        return { outer: {}, inner: {} };
    }
  })();

  return (
    <div
      className="fixed inset-0 z-[200] bg-white overflow-hidden"
      style={{
        opacity: phase === 'fade' ? 0 : 1,
        transition: phase === 'fade' ? 'opacity 600ms ease' : 'none',
      }}
    >
      {/* ── Ring (two-circle donut illusion, centered) ── */}
      <div
        className="absolute"
        style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 0 }}
      >
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', ...ringStyles.outer }}>
          <div style={{ position: 'absolute', ...ringStyles.inner }} />
        </div>
      </div>

      {/* ── Icon scatter elements ── */}
      {ICONS.map((el, i) => {
        const staggerMs = i * 45;
        const { x, y } = iconPos[i];
        return (
          <div
            key={`icon-${i}`}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              zIndex: 2,
              transform: isOut
                ? `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${el.spin}deg)`
                : `translate(-50%, -50%) rotate(0deg)`,
              opacity: isOut ? 1 : 0,
              transition: isOut
                ? `transform 750ms cubic-bezier(0.33,1,0.68,1) ${staggerMs}ms, opacity 350ms ease ${staggerMs}ms`
                : isIn
                ? `transform 750ms cubic-bezier(0.37,0,0.63,1), opacity 600ms ease`
                : 'opacity 150ms ease',
            }}
          >
            <el.Icon className="text-primary" style={{ width: el.size, height: el.size }} />
          </div>
        );
      })}

      {/* ── Dot scatter elements ── */}
      {DOTS.map((el, i) => {
        const staggerMs = (ICONS.length + i) * 45;
        const { x, y } = dotPos[i];
        return (
          <div
            key={`dot-${i}`}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              zIndex: 2,
              width: el.size,
              height: el.size,
              borderRadius: '50%',
              background: 'var(--primary)',
              transform: isOut
                ? `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
                : `translate(-50%, -50%)`,
              opacity: isOut ? 0.75 : 0,
              transition: isOut
                ? `transform 750ms cubic-bezier(0.33,1,0.68,1) ${staggerMs}ms, opacity 350ms ease ${staggerMs}ms`
                : isIn
                ? `transform 750ms cubic-bezier(0.37,0,0.63,1), opacity 600ms ease`
                : 'opacity 150ms ease',
            }}
          />
        );
      })}

      {/* ── Dash scatter elements ── */}
      {DASHES.map((el, i) => {
        const staggerMs = (ICONS.length + DOTS.length + i) * 45;
        const { x, y } = dashPos[i];
        return (
          <div
            key={`dash-${i}`}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              zIndex: 2,
              width: el.width,
              height: 3,
              borderRadius: 2,
              background: 'var(--primary)',
              transform: isOut
                ? `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${el.spin}deg)`
                : `translate(-50%, -50%) rotate(0deg)`,
              opacity: isOut ? 0.8 : 0,
              transition: isOut
                ? `transform 750ms cubic-bezier(0.33,1,0.68,1) ${staggerMs}ms, opacity 350ms ease ${staggerMs}ms`
                : isIn
                ? `transform 750ms cubic-bezier(0.37,0,0.63,1), opacity 600ms ease`
                : 'opacity 150ms ease',
            }}
          />
        );
      })}

      {/* ── Logo + text (always on top) ── */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ zIndex: 10 }}
      >
        <div className="flex flex-col items-center">
          {/* Logo box */}
          <div
            style={{
              transform: phase === 'init' ? 'scale(0)' : 'scale(1)',
              opacity:   phase === 'init' ? 0 : 1,
              transition: 'transform 750ms cubic-bezier(0.34,1.56,0.64,1), opacity 600ms ease-out',
            }}
          >
            <div className="w-[80px] h-[80px] rounded-2xl bg-black shadow-2xl flex items-center justify-center">
              <span className="text-primary font-black text-2xl tracking-tight">AOS</span>
            </div>
          </div>

          {/* Text reveal */}
          <div
            style={{
              opacity:   phase === 'text' || phase === 'fade' ? 1 : 0,
              transform: phase === 'text' || phase === 'fade' ? 'translateY(0px)' : 'translateY(18px)',
              marginTop: phase === 'text' || phase === 'fade' ? '28px' : '0px',
              transition: 'opacity 750ms cubic-bezier(0.33,1,0.68,1), transform 750ms cubic-bezier(0.33,1,0.68,1), margin-top 400ms ease',
              textAlign: 'center',
            }}
          >
            <h1 className="text-3xl font-black text-gray-900 tracking-[0.35em]">AOS</h1>
            <p className="text-[10px] font-semibold text-gray-400 tracking-[0.3em] mt-1.5">
              AFRICA ONLINE STORES
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function sleep(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}
