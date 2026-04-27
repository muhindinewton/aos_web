'use client';

import React from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';

interface LoginPromptModalProps {
  featureName?: string;
  onClose: () => void;
}

export default function LoginPromptModal({ featureName, onClose }: LoginPromptModalProps) {
  const feature = featureName ?? 'this feature';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-surface w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6">
        {/* Handle bar */}
        <div className="w-10 h-1 bg-theme rounded-full mx-auto mb-6 sm:hidden" />

        {/* Lock icon */}
        <div className="w-18 h-18 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5 w-[72px] h-[72px]">
          <Lock className="w-9 h-9 text-primary" />
        </div>

        {/* Title */}
        <h2 className="text-[22px] font-bold text-theme-primary text-center mb-3">
          Login Required
        </h2>

        {/* Description */}
        <p className="text-sm text-theme-muted text-center leading-relaxed mb-7">
          Please login or create an account to access {feature}.
        </p>

        {/* Buttons */}
        <div className="flex gap-3 mb-3">
          <Link
            href="/auth/login"
            onClick={onClose}
            className="flex-1 py-3.5 rounded-full border border-theme text-theme-primary font-semibold text-center text-sm hover:bg-elevated transition-colors"
          >
            Login
          </Link>
          <Link
            href="/auth/signup"
            onClick={onClose}
            className="flex-1 py-3.5 rounded-full bg-primary text-white font-semibold text-center text-sm hover:bg-primary-hover transition-colors"
          >
            Sign Up
          </Link>
        </div>

        {/* Maybe later */}
        <button
          onClick={onClose}
          className="w-full py-2.5 text-sm text-theme-muted font-medium hover:text-theme-primary transition-colors"
        >
          Maybe Later
        </button>
      </div>
    </div>
  );
}
