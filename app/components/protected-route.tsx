'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../providers/auth-provider';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

// Screenshot harness bypass — the capture script sets this flag so protected
// screens render their content without a signed-in session. Client-side only;
// these pages hold demo seed data, so this is a UX gate, not security.
const screenshotMode = () =>
  typeof window !== 'undefined' && window.sessionStorage.getItem('aos-screenshot-mode') === '1';

export default function ProtectedRoute({ children, redirectTo = '/auth/login' }: ProtectedRouteProps) {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isLoggedIn && !screenshotMode()) {
      router.replace(redirectTo);
    }
  }, [isLoggedIn, loading, router, redirectTo]);

  if (screenshotMode()) return <>{children}</>;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return <>{children}</>;
}
