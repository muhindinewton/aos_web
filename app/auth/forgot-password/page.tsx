'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { sendPasswordResetOTP, resetPasswordWithOTP } from '../../lib/otp-service';

type Step = 'email' | 'otp' | 'password' | 'success';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Fills all boxes from a pasted/typed multi-digit string.
  const fillOtp = (raw: string) => {
    const clean = raw.replace(/\D/g, '').slice(0, 6);
    if (!clean) return;
    const next = ['', '', '', '', '', ''];
    clean.split('').forEach((c, idx) => { next[idx] = c; });
    setOtp(next);
    document.getElementById(`otp-${Math.min(clean.length, 5)}`)?.focus();
  };

  const handleOtpChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length > 1) { fillOtp(cleaned); return; }
    const newOtp = [...otp];
    newOtp[index] = cleaned;
    setOtp(newOtp);

    // Auto-focus next input
    if (cleaned && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      // Emails a 6-digit reset code (Cloud Function; mobile parity).
      await sendPasswordResetOTP(email.trim());
      setStep('otp');
    } catch {
      setError("Couldn't send the code. Check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    // The code is checked authoritatively when the new password is submitted
    // (resetPasswordWithOTP), so this step just advances.
    setStep('password');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      // Verifies the code and sets the new password server-side.
      await resetPasswordWithOTP(email.trim(), otp.join(''), password);
      setStep('success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not reset your password. Please try again.';
      setError(message);
      // Bad or expired code — return to the code step to retry.
      if (message.toLowerCase().includes('code')) {
        setOtp(['', '', '', '', '', '']);
        setStep('otp');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'otp') setStep('email');
    else if (step === 'password') setStep('otp');
  };

  return (
    <div className="min-h-screen bg-theme flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {step !== 'success' && (
          <button
            onClick={step === 'email' ? undefined : handleBack}
            className="mb-6 p-2 rounded-full border border-theme hover:bg-elevated transition-colors"
          >
            {step === 'email' ? (
              <Link href="/auth/login">
                <ArrowLeft className="w-5 h-5 text-theme-primary" />
              </Link>
            ) : (
              <ArrowLeft className="w-5 h-5 text-theme-primary" />
            )}
          </button>
        )}

        <div className="bg-surface border border-theme rounded-2xl p-6 md:p-8 shadow-soft">
          {step === 'email' && (
            <>
              <h1 className="text-2xl font-bold text-theme-primary mb-2">Forgot Password</h1>
              <p className="text-theme-secondary text-sm mb-6">
                Enter your email address and we will send you a verification code
              </p>

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-theme-primary mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-muted" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full bg-elevated border border-theme rounded-xl py-3 pl-11 pr-4 text-theme-primary placeholder:text-theme-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-full transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    'Send OTP'
                  )}
                </button>

                <p className="text-center text-sm text-theme-secondary">
                  Remember your password?{' '}
                  <Link href="/auth/login" className="font-semibold text-theme-primary hover:text-primary">
                    Login
                  </Link>
                </p>
              </form>
            </>
          )}

          {step === 'otp' && (
            <>
              <h1 className="text-2xl font-bold text-theme-primary mb-2">Enter Verification Code</h1>
              <p className="text-theme-secondary text-sm mb-6">
                We have sent a verification code to {email}
              </p>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="flex gap-2 justify-between">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={(e) => { e.preventDefault(); fillOtp(e.clipboardData.getData('text')); }}
                      className="w-12 h-14 bg-elevated border border-theme rounded-xl text-center text-xl font-semibold text-theme-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  ))}
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-full transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Verifying...
                    </span>
                  ) : (
                    'Verify'
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="w-full text-center text-sm font-semibold text-theme-primary hover:text-primary"
                >
                  Resend Code
                </button>
              </form>
            </>
          )}

          {step === 'password' && (
            <>
              <h1 className="text-2xl font-bold text-theme-primary mb-2">Create New Password</h1>
              <p className="text-theme-secondary text-sm mb-6">
                Enter your new password below
              </p>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-theme-primary mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-muted" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full bg-elevated border border-theme rounded-xl py-3 pl-11 pr-11 text-theme-primary placeholder:text-theme-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-muted hover:text-theme-primary"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-theme-primary mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-muted" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full bg-elevated border border-theme rounded-xl py-3 pl-11 pr-11 text-theme-primary placeholder:text-theme-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-muted hover:text-theme-primary"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-full transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Resetting...
                    </span>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </form>
            </>
          )}

          {step === 'success' && (
            <div className="text-center py-6">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold text-theme-primary mb-2">Password Updated</h1>
              <p className="text-theme-secondary text-sm mb-6">
                Your password has been reset successfully
              </p>
              <Link
                href="/auth/login"
                className="block w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-full transition-colors text-center"
              >
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
