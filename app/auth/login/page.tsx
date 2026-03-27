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
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
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
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-theme-muted" />
                ) : (
                  <Eye className="w-5 h-5 text-theme-muted" />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <Link href="/auth/forgot-password" className="text-sm text-primary font-medium">
              Forgot Password?
            </Link>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-3 text-error text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold disabled:opacity-50 hover:bg-primary-hover transition-colors"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-5 text-sm text-theme-muted">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-primary font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
        </div>
      </div>
    </div>
  );
}
