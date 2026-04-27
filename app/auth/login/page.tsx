'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../providers/auth-provider';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'apple' | null>(null);
  const { login, loginWithGoogle, loginWithApple } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setIsLoading(true);
    try {
      await login(email, password);
      router.push('/');
    } catch {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setSocialLoading('google');
    try {
      await loginWithGoogle();
      router.push('/');
    } catch {
      setError('Google sign-in failed. Please try again.');
    } finally {
      setSocialLoading(null);
    }
  };

  const handleApple = async () => {
    setError('');
    setSocialLoading('apple');
    try {
      await loginWithApple();
      router.push('/');
    } catch {
      setError('Apple sign-in failed. Please try again.');
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-theme-muted hover:text-primary mb-6">
          <ChevronLeft className="w-4 h-4" /> Back to Home
        </Link>
        <div className="bg-surface border border-theme rounded-2xl p-6 md:p-8 shadow-soft">
          <h1 className="text-2xl font-bold text-theme-primary mb-1">Welcome Back</h1>
          <p className="text-sm text-theme-muted mb-6">Sign in to continue shopping and selling</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-theme-primary mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-elevated border border-theme rounded-xl py-3.5 pl-12 pr-4 text-theme-primary placeholder:text-theme-muted outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-theme-primary mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-elevated border border-theme rounded-xl py-3.5 pl-12 pr-12 text-theme-primary placeholder:text-theme-muted outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2">
                  {showPassword ? <EyeOff className="w-5 h-5 text-theme-muted" /> : <Eye className="w-5 h-5 text-theme-muted" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link href="/auth/forgot-password" className="text-sm text-primary font-medium">
                Forgot Password?
              </Link>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !!socialLoading}
              className="w-full bg-primary text-white py-3 rounded-xl font-semibold disabled:opacity-50 hover:bg-primary-hover transition-colors"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-theme" />
            <span className="text-xs text-theme-muted font-medium">OR</span>
            <div className="flex-1 h-px bg-theme" />
          </div>

          {/* Social Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleGoogle}
              disabled={!!socialLoading || isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 rounded-xl py-3 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60 transition-colors shadow-sm"
            >
              {socialLoading === 'google' ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              Continue with Google
            </button>

            <button
              onClick={handleApple}
              disabled={!!socialLoading || isLoading}
              className="w-full flex items-center justify-center gap-3 bg-black border border-black rounded-xl py-3 font-medium text-white hover:bg-gray-900 disabled:opacity-60 transition-colors"
            >
              {socialLoading === 'apple' ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.3.07 2.18.73 2.95.75.93-.14 1.81-.81 2.95-.81 1.28.11 2.29.79 2.88 2.01-2.64 1.59-2.26 5.44.59 6.43-.52 1.32-1.24 2.61-2.37 3.5zM12.03 7.25c-.1-2.33 1.86-4.24 4.02-4.25.13 2.56-2.32 4.5-4.02 4.25z"/>
                </svg>
              )}
              Continue with Apple
            </button>
          </div>

          <p className="text-center mt-5 text-sm text-theme-muted">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-primary font-semibold hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
