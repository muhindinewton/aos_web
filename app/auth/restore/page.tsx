'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useToast } from '../../providers/toast-provider';

const DELETED_AT_KEY = 'aos-account-deleted-at';
const RESTORE_DAYS = 30;

export default function RestoreAccountPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [digits, setDigits] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(RESTORE_DAYS);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const [deletedEmail, setDeletedEmail] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DELETED_AT_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const at = parsed && typeof parsed === 'object' ? Number(parsed.at) : Number(raw);
      if (parsed?.email) setDeletedEmail(String(parsed.email));
      if (at) {
        const elapsed = Math.floor((Date.now() - at) / 86_400_000);
        setDaysRemaining(Math.max(RESTORE_DAYS - elapsed, 0));
      }
    } catch { /* storage unavailable */ }
  }, []);

  // Fills all boxes from a pasted/typed multi-digit string.
  const fillCode = (raw: string) => {
    const clean = raw.replace(/\D/g, '').slice(0, 6);
    if (!clean) return;
    const next = Array(6).fill('');
    clean.split('').forEach((c, idx) => { next[idx] = c; });
    setDigits(next);
    setError(null);
    inputsRef.current[Math.min(clean.length, 5)]?.focus();
  };

  const setDigit = (i: number, val: string) => {
    const cleaned = val.replace(/\D/g, '');
    if (cleaned.length > 1) { fillCode(cleaned); return; }
    setDigits(prev => prev.map((d, idx) => (idx === i ? cleaned : d)));
    setError(null);
    if (cleaned && i < 5) inputsRef.current[i + 1]?.focus();
  };

  const onKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) inputsRef.current[i - 1]?.focus();
  };

  const code = digits.join('');

  const restore = () => {
    if (code.length < 6) {
      setError('Please enter the full 6-digit code.');
      return;
    }
    setRestoring(true);
    setTimeout(() => {
      try {
        window.localStorage.removeItem(DELETED_AT_KEY);
      } catch { /* storage unavailable */ }
      showToast('Welcome back! Your account has been restored.');
      router.push('/auth/login');
    }, 900);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* App bar */}
      <div className="px-4 py-3 flex items-center gap-3">
        <Link
          href="/auth/login"
          className="w-9 h-9 rounded-full bg-surface border border-theme flex items-center justify-center hover:bg-elevated transition-colors"
          aria-label="Back to login"
        >
          <ArrowLeft className="w-[18px] h-[18px] text-theme-primary" />
        </Link>
        <h1 className="text-base font-semibold text-theme-primary">Restore Account</h1>
      </div>

      <div className="flex-1 flex flex-col items-center px-6 pt-8 max-w-md mx-auto w-full">
        {/* Emblem */}
        <div className="w-[120px] h-[120px] rounded-full bg-primary/10 flex items-center justify-center">
          <div className="w-[82px] h-[82px] rounded-full bg-primary flex items-center justify-center">
            <RotateCcw className="w-9 h-9 text-white" />
          </div>
        </div>

        <h2 className="text-[22px] font-semibold text-theme-primary mt-7 text-center">
          Restore your account
        </h2>

        <span className="mt-2.5 px-3 py-1.5 rounded-full bg-[#F5A623]/15 text-[#F5A623] text-xs font-semibold">
          {daysRemaining <= 1 ? 'Less than a day left to restore' : `${daysRemaining} days left to restore`}
        </span>

        <p className="text-sm text-theme-secondary mt-4 text-center">Enter the 6-digit code we sent to</p>
        <p className="text-sm font-semibold text-theme-primary mt-0.5 break-all text-center">
          {deletedEmail || 'your email address'}
        </p>

        {error && (
          <div className="w-full mt-6 p-3 rounded-lg bg-red-500/10 border border-red-500/25">
            <p className="text-[13px] text-red-500 text-center">{error}</p>
          </div>
        )}

        {/* Code inputs */}
        <div className="flex gap-2 mt-7 w-full">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={el => { inputsRef.current[i] = el; }}
              value={d}
              onChange={e => setDigit(i, e.target.value)}
              onKeyDown={e => onKeyDown(i, e)}
              onPaste={e => { e.preventDefault(); fillCode(e.clipboardData.getData('text')); }}
              inputMode="numeric"
              maxLength={1}
              className="flex-1 min-w-0 h-[55px] bg-surface border border-theme rounded-xl text-center text-[22px] font-semibold text-theme-primary outline-none focus:border-theme-primary focus:border-2"
              aria-label={`Digit ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={restore}
          disabled={restoring}
          className="w-full mt-8 py-3.5 rounded-2xl bg-primary text-white font-semibold text-[15px] hover:bg-primary-hover transition-colors disabled:opacity-60"
        >
          {restoring ? 'Restoring…' : 'Restore my account'}
        </button>

        <p className="text-sm text-theme-secondary mt-5">
          Didn&apos;t get a code?{' '}
          <button
            onClick={() => showToast('A new code has been sent.')}
            className="text-primary font-semibold"
          >
            Resend
          </button>
        </p>

        <Link href="/auth/login" className="text-sm text-theme-muted mt-6 mb-10 hover:text-theme-primary">
          Cancel and keep deletion
        </Link>
      </div>
    </div>
  );
}
