'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RotateCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the failure so it's discoverable in the browser console and any
    // attached monitoring. Next.js already reports server errors on its own.
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/10 flex items-center justify-center">
        <AlertTriangle className="w-10 h-10 md:w-12 md:h-12 text-primary" />
      </div>

      <h1 className="mt-6 text-2xl md:text-3xl font-bold text-theme-primary">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-md text-sm md:text-base text-theme-muted">
        An unexpected error occurred while loading this page. You can try again or head back home.
      </p>

      {error?.digest && (
        <p className="mt-3 text-[11px] font-mono text-theme-muted/70">
          Error ref: {error.digest}
        </p>
      )}

      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors"
        >
          <RotateCw className="w-4 h-4" />
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-theme bg-surface text-theme-primary text-sm font-semibold hover:bg-elevated transition-colors"
        >
          <Home className="w-4 h-4" />
          Go to home
        </Link>
      </div>
    </div>
  );
}
