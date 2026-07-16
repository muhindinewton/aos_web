'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MailCheck } from 'lucide-react';
import { useToast } from '../../providers/toast-provider';
import { sendVerificationOTP, verifyOTP } from '../../lib/otp-service';

const PENDING_EMAIL_KEY = 'aos-pending-verify-email';
const RESEND_COOLDOWN_S = 60;

export default function VerifyEmailPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [digits, setDigits] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    try {
      const pending = sessionStorage.getItem(PENDING_EMAIL_KEY);
      if (pending) setEmail(pending);
      else router.replace('/auth/signup');
    } catch { /* storage unavailable */ }
  }, [router]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown(c => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

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
    const clean = val.replace(/\D/g, '');
    if (clean.length > 1) { fillCode(clean); return; }
    setDigits(prev => prev.map((d, idx) => (idx === i ? clean : d)));
    setError(null);
    if (clean && i < 5) inputsRef.current[i + 1]?.focus();
  };

  const onKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) inputsRef.current[i - 1]?.focus();
    if (e.key === 'Enter') handleVerify();
  };

  const code = digits.join('');

  const handleVerify = async () => {
    if (code.length < 6) {
      setError('Please enter the full 6-digit code.');
      return;
    }
    setVerifying(true);
    setError(null);
    try {
      await verifyOTP(email, code);
      try { sessionStorage.removeItem(PENDING_EMAIL_KEY); } catch { /* ignore */ }
      showToast('Email verified — welcome to AOS!');
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setCooldown(RESEND_COOLDOWN_S);
    setError(null);
    try {
      await sendVerificationOTP(email);
      showToast('A new code has been sent.');
    } catch {
      setError("Couldn't send the code. Check your connection and try Resend again.");
      setCooldown(5);
    }
  };

  return (
    <div className="min-h-screen bg-theme flex flex-col">
      {/* App bar */}
      <div className="px-4 py-3 flex items-center gap-3">
        <Link
          href="/auth/signup"
          className="w-9 h-9 rounded-full bg-surface border border-theme flex items-center justify-center hover:bg-elevated transition-colors"
          aria-label="Back to sign up"
        >
          <ArrowLeft className="w-[18px] h-[18px] text-theme-primary" />
        </Link>
        <h1 className="text-base font-semibold text-theme-primary">Verify Email</h1>
      </div>

      <div className="flex-1 flex flex-col items-center px-6 pt-8 max-w-md mx-auto w-full">
        {/* Emblem */}
        <div className="w-[120px] h-[120px] rounded-full bg-primary/10 flex items-center justify-center">
          <div className="w-[82px] h-[82px] rounded-full bg-primary flex items-center justify-center">
            <MailCheck className="w-9 h-9 text-white" />
          </div>
        </div>

        <h2 className="text-[22px] font-semibold text-theme-primary mt-7 text-center">
          Verify your email
        </h2>

        <p className="text-sm text-theme-secondary mt-3 text-center">Enter the 6-digit code we sent to</p>
        <p className="text-sm font-semibold text-theme-primary mt-0.5 break-all text-center">{email || 'your email'}</p>

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
              autoComplete={i === 0 ? 'one-time-code' : 'off'}
              className="flex-1 h-[55px] min-w-0 bg-surface border border-theme rounded-xl text-center text-[22px] font-semibold text-theme-primary outline-none focus:border-theme-primary focus:border-2"
              aria-label={`Digit ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={verifying}
          className="w-full mt-8 py-3.5 rounded-2xl bg-primary text-white font-semibold text-[15px] hover:bg-primary-hover transition-colors disabled:opacity-60"
        >
          {verifying ? 'Verifying…' : 'Verify email'}
        </button>

        <p className="text-sm text-theme-secondary mt-5">
          Didn&apos;t get a code?{' '}
          <button
            onClick={handleResend}
            disabled={cooldown > 0}
            className={`font-semibold ${cooldown > 0 ? 'text-theme-muted cursor-not-allowed' : 'text-primary'}`}
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend'}
          </button>
        </p>

        <Link href="/" className="text-sm text-theme-muted mt-6 mb-10 hover:text-theme-primary">
          I&apos;ll verify later
        </Link>
      </div>
    </div>
  );
}
