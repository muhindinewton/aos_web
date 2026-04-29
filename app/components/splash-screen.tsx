'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Globe, ShoppingCart, Truck, Plane, MapPin, Store, Languages, Package,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface SplashScreenProps { onComplete: () => void; }
interface Bubble { x: number; y: number; radius: number; speed: number; phase: number; }
type SplashPhase = 'init' | 'logo' | 'wheel' | 'text' | 'done';

// ─── Constants ────────────────────────────────────────────────────────────────
const RING_RADIUS   = 130;          // px — matches mobile's size.width*0.32 ≈ 125
const INNER_R       = 57.5;         // half of logo 115px
const OUTER_R       = RING_RADIUS - 24;
const WHEEL_ICONS   = [Globe, ShoppingCart, Truck, Plane, MapPin, Store, Languages, Package];
const PRIMARY_RED   = '#C1121F';

// ─── Easing helpers ───────────────────────────────────────────────────────────
const easeOutCubic    = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInCubic     = (t: number) => t * t * t;
const easeInOut       = (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const easeOutSine     = (t: number) => Math.sin(t * Math.PI / 2);
const easeInSine      = (t: number) => 1 - Math.cos(t * Math.PI / 2);
const easeInOutCubic  = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function sleep(ms: number) { return new Promise<void>(r => setTimeout(r, ms)); }

function generateBubbles(): Bubble[] {
  return Array.from({ length: 12 }, () => ({
    x:      Math.random(),
    y:      Math.random(),
    radius: 30 + Math.random() * 80,
    speed:  0.3 + Math.random() * 0.7,
    phase:  Math.random() * Math.PI * 2,
  }));
}

// ─── Logo image with text fallback ───────────────────────────────────────────
function LogoImage() {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: 30, color: PRIMARY_RED, letterSpacing: -1, lineHeight: 1 }}>
        AOS
      </span>
    );
  }
  return (
    <img
      src="/logo_redone.png"
      alt="AOS"
      onError={() => setFailed(true)}
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />
  );
}

// ─── Wheel (ring + spokes + icon circles) ────────────────────────────────────
function Wheel() {
  const n         = WHEEL_ICONS.length;
  const container = RING_RADIUS * 2 + 120;
  const cx        = container / 2;
  const cy        = container / 2;

  return (
    <div style={{ position: 'relative', width: container, height: container }}>
      {/* SVG ring + spokes */}
      <svg
        width={container} height={container}
        style={{ position: 'absolute', inset: 0 }}
      >
        {/* Ring */}
        <circle
          cx={cx} cy={cy} r={RING_RADIUS}
          fill="none"
          stroke={PRIMARY_RED} strokeWidth={1.2} strokeOpacity={0.35}
        />
        {/* Spokes */}
        {Array.from({ length: n }, (_, i) => {
          const angle = -Math.PI / 2 + (2 * Math.PI * i / n);
          return (
            <line key={i}
              x1={cx + INNER_R * Math.cos(angle)}
              y1={cy + INNER_R * Math.sin(angle)}
              x2={cx + OUTER_R * Math.cos(angle)}
              y2={cy + OUTER_R * Math.sin(angle)}
              stroke={PRIMARY_RED} strokeWidth={0.8} strokeOpacity={0.22}
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      {/* Icon circles */}
      {WHEEL_ICONS.map((Icon, i) => {
        const angle = -Math.PI / 2 + (2 * Math.PI * i / n);
        const x     = cx + RING_RADIUS * Math.cos(angle) - 24;
        const y     = cy + RING_RADIUS * Math.sin(angle) - 24;
        return (
          <div
            key={i}
            style={{
              position:     'absolute',
              left:         x,
              top:          y,
              width:        48,
              height:       48,
              borderRadius: '50%',
              background:   'white',
              display:      'flex',
              alignItems:   'center',
              justifyContent: 'center',
              boxShadow:    `0 2px 8px rgba(193,18,31,0.12), 0 1px 3px rgba(0,0,0,0.06)`,
            }}
          >
            <Icon style={{ width: 22, height: 22, color: PRIMARY_RED }} />
          </div>
        );
      })}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function SplashScreen({ onComplete }: SplashScreenProps) {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const bubblesRef  = useRef<Bubble[]>(generateBubbles());
  const rafBubbles  = useRef<number>(0);

  const [phase,        setPhase]        = useState<SplashPhase>('init');
  const [wheelProg,    setWheelProg]    = useState(0);
  const [textProg,     setTextProg]     = useState(0);
  const [fading,       setFading]       = useState(false);

  // ── Bubble canvas animation ─────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = (ts: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const progress = (ts / 12000) % 1;

      for (const b of bubblesRef.current) {
        const time = progress * Math.PI * 2 + b.phase;
        const t1   = time * b.speed;
        const t2   = time * b.speed * 0.6 + 1.2;
        const t3   = time * b.speed * 0.3 + 2.4;
        const fx   = Math.sin(t1) * 12 + Math.sin(t2) * 8 + Math.cos(t3) * 5;
        const fy   = Math.cos(t1 * 0.8) * 10 + Math.sin(t2 * 0.7) * 6;
        const x    = b.x * canvas.width  + fx;
        const y    = b.y * canvas.height + fy;
        const pulse = 1 + (Math.sin(time * 0.8) * 0.5 + 0.5) * 0.08;
        const r    = b.radius * pulse;

        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0,    'rgba(193,18,31,0.125)');
        g.addColorStop(0.45, 'rgba(193,18,31,0.055)');
        g.addColorStop(1,    'rgba(193,18,31,0)');
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }
      rafBubbles.current = requestAnimationFrame(draw);
    };
    rafBubbles.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafBubbles.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // ── Main animation sequence ─────────────────────────────────────────────────
  const animate = useCallback((duration: number, setter: (v: number) => void) =>
    new Promise<void>(resolve => {
      const start = performance.now();
      const tick  = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        setter(p);
        if (p < 1) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    }), []);

  useEffect(() => {
    const run = async () => {
      await sleep(350);
      setPhase('logo');

      await sleep(700);
      setPhase('wheel');
      await animate(3200, setWheelProg);

      setPhase('text');
      await animate(1000, setTextProg);

      await sleep(900);
      setFading(true);
      await sleep(600);
      onComplete();
    };
    run();
  }, [animate, onComplete]);

  // ── Wheel scale TweenSequence (mirrors Flutter) ─────────────────────────────
  const wheelScale = (() => {
    const p = wheelProg;
    if (p < 0.28) return easeOutCubic(p / 0.28);
    if (p < 0.50) return 1 + easeInOut((p - 0.28) / 0.22) * 0.02;
    if (p < 0.72) return 1.02 - easeInOut((p - 0.50) / 0.22) * 0.02;
    return 1 - easeInCubic((p - 0.72) / 0.28);
  })();

  const wheelFade = (() => {
    const p = wheelProg;
    if (p < 0.22) return easeOutSine(p / 0.22);
    if (p < 0.78) return 1;
    return 1 - easeInSine((p - 0.78) / 0.22);
  })();

  const wheelRot     = easeInOutCubic(wheelProg) * Math.PI * 0.35; // radians

  const showLogo     = phase !== 'init';
  const showWheel    = phase === 'wheel' || phase === 'text' || phase === 'done';
  const showText     = phase === 'text'  || phase === 'done';

  const textOpacity  = easeOutCubic(textProg);
  const textY        = (1 - easeOutCubic(textProg)) * 14;
  const subOpacity   = Math.max(0, (textProg - 0.15) / 0.85);
  const subY         = (1 - easeOutCubic(Math.max(0, (textProg - 0.1) / 0.9))) * 12;

  return (
    <div
      className="fixed inset-0 z-[200] overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #FFF5F5 0%, #FAF0F0 35%, #F5F8F5 70%, #F8F8F8 100%)',
        opacity:    fading ? 0 : 1,
        transition: fading ? 'opacity 600ms ease' : 'none',
      }}
    >
      {/* ── Kenyan flag accent layers ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '22%',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.11) 0%, rgba(0,0,0,0) 100%)' }} />
        <div style={{ position: 'absolute', top: '21%', left: 0, right: 0, height: '2.5%',
          background: 'rgba(255,255,255,0.22)' }} />
        <div style={{ position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(193,18,31,0.15) 0%, rgba(193,18,31,0) 70%)' }} />
        <div style={{ position: 'absolute', top: '76.5%', left: 0, right: 0, height: '2.5%',
          background: 'rgba(255,255,255,0.22)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '22%',
          background: 'linear-gradient(to top, rgba(0,102,0,0.12) 0%, rgba(0,102,0,0) 100%)' }} />
      </div>

      {/* ── Floating bubbles canvas ── */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* ── Icon wheel ── */}
      {showWheel && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: `scale(${wheelScale}) rotate(${wheelRot}rad)`,
            opacity:   Math.max(0, Math.min(1, wheelFade)),
          }}
        >
          <Wheel />
        </div>
      )}

      {/* ── Center content (logo + text) ── */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 10 }}>
        <div className="flex flex-col items-center">

          {/* Logo card */}
          <div style={{
            width:        115,
            height:       115,
            borderRadius: 26,
            background:   'white',
            display:      'flex',
            alignItems:   'center',
            justifyContent: 'center',
            padding:      14,
            boxShadow:    '0 8px 32px rgba(193,18,31,0.10), 0 2px 12px rgba(0,0,0,0.07)',
            transform:    showLogo ? 'scale(1)' : 'scale(0)',
            opacity:      showLogo ? 1 : 0,
            transition:   'transform 900ms cubic-bezier(0.34,1.56,0.64,1), opacity 540ms ease-out',
          }}>
            <LogoImage />
          </div>

          {/* Final text */}
          {showText && (
            <div className="flex flex-col items-center" style={{ marginTop: textProg * 32 }}>
              <div style={{ opacity: textOpacity, transform: `translateY(${textY}px)` }}>
                <span style={{
                  fontFamily:   '"Playfair Display", Georgia, serif',
                  fontWeight:   800,
                  fontSize:     52,
                  color:        '#1A1A1A',
                  letterSpacing: 16,
                  display:      'block',
                  textAlign:    'center',
                }}>
                  AOS
                </span>
              </div>
              <div style={{
                opacity:   Math.max(0, Math.min(1, subOpacity)),
                transform: `translateY(${subY}px)`,
                marginTop: textProg * 10,
              }}>
                <span style={{
                  fontFamily:   'Poppins, sans-serif',
                  fontWeight:   600,
                  fontSize:     12,
                  color:        '#888888',
                  letterSpacing: 5,
                  display:      'block',
                  textAlign:    'center',
                }}>
                  AFRICA ONLINE STORES
                </span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
