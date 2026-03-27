'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../../providers/auth-provider';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      await signup(email, password, name);
      router.push('/');
    } catch (err) {
      setError('Failed to create account');
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
          <h1 className="text-2xl font-bold text-theme-primary mb-1">Create Account</h1>
          <p className="text-sm text-theme-muted mb-6">Join millions of buyers and sellers</p>

          <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-theme-primary mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-muted" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full bg-elevated border border-theme rounded-xl py-3.5 pl-12 pr-4 text-theme-primary placeholder:text-theme-muted outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>
          </div>

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
                placeholder="Create a password"
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
            <p className="text-xs text-theme-muted mt-1.5">Must be at least 6 characters</p>
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
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-5 text-sm text-theme-muted">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-primary font-semibold hover:underline">
            Sign In
          </Link>
        </p>
        </div>
      </div>
    </div>
  );
}
