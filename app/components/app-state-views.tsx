'use client';

// Web port of mobile's app_state_views.dart — shared loading / error / empty
// views so every screen presents data states the same way.

import React, { useCallback, useEffect, useState } from 'react';
import { Inbox, CloudOff, RefreshCw } from 'lucide-react';

/* ── Page load lifecycle ──────────────────────────────────────────── */

// Screenshot/debug override, mirroring mobile's ScreenStateDebug: a
// `__state=loading|error|empty` query param pins every usePageLoad screen in
// that state so each state can be captured.
function forcedState(): 'loading' | 'error' | 'empty' | null {
  if (typeof window === 'undefined') return null;
  const v = new URLSearchParams(window.location.search).get('__state');
  return v === 'loading' || v === 'error' || v === 'empty' ? v : null;
}

// Gives a page the standard load lifecycle: a brief skeleton phase (matching
// mobile's simulated fetch), a real error state when the browser is offline,
// and a retry that re-runs the load. Seed-data pages get honest states now
// and swap in a real fetch later without changing the page markup.
export function usePageLoad(ms = 700) {
  const [status, setStatus] = useState<'loading' | 'error' | 'ready'>('loading');
  const [forceEmpty, setForceEmpty] = useState(false);

  const retry = useCallback(() => {
    const forced = forcedState();
    if (forced === 'loading') { setStatus('loading'); return; }
    if (forced === 'error') { setStatus('error'); return; }
    if (forced === 'empty') setForceEmpty(true);
    setStatus('loading');
    const t = setTimeout(() => {
      const offline = typeof navigator !== 'undefined' && !navigator.onLine;
      setStatus(offline ? 'error' : 'ready');
    }, ms);
    return () => clearTimeout(t);
  }, [ms]);

  useEffect(() => retry(), [retry]);

  return { loading: status === 'loading', error: status === 'error', retry, forceEmpty };
}

/* ── Skeletons ────────────────────────────────────────────────────── */

export function SkeletonBox({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-elevated rounded-xl ${className}`} />;
}

export function SkeletonList({ rows = 6 }: { rows?: number }) {
  return (
    <div className="px-4 space-y-3 py-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <SkeletonBox className="w-11 h-11 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <SkeletonBox className="h-3.5 w-2/5" />
            <SkeletonBox className="h-3 w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonGrid({ items = 6 }: { items?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 px-4 py-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="space-y-2">
          <SkeletonBox className="w-full aspect-square" />
          <SkeletonBox className="h-3.5 w-4/5" />
          <SkeletonBox className="h-3 w-3/5" />
        </div>
      ))}
    </div>
  );
}

/* ── Empty state ──────────────────────────────────────────────────── */

export function AppEmptyView({
  icon: Icon = Inbox,
  title,
  message,
  actionLabel,
  onAction,
}: {
  icon?: React.ElementType;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-8 py-14">
      <div className="w-[88px] h-[88px] rounded-full bg-elevated flex items-center justify-center">
        <Icon className="w-10 h-10 text-theme-muted" />
      </div>
      <h3 className="mt-5 text-[17px] font-semibold text-theme-primary">{title}</h3>
      {message && (
        <p className="mt-2 text-[13.5px] leading-relaxed text-theme-secondary max-w-xs">{message}</p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 px-6 py-2.5 rounded-full border border-primary text-primary text-sm font-semibold hover:bg-primary/5 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

/* ── Error state ──────────────────────────────────────────────────── */

export function AppErrorView({
  message,
  onRetry,
  icon: Icon = CloudOff,
}: {
  message?: string;
  onRetry?: () => void;
  icon?: React.ElementType;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-8 py-14">
      <div className="w-[88px] h-[88px] rounded-full bg-[#FF4D4D]/10 flex items-center justify-center">
        <Icon className="w-10 h-10 text-[#FF4D4D]" />
      </div>
      <h3 className="mt-5 text-[17px] font-semibold text-theme-primary">Something went wrong</h3>
      <p className="mt-2 text-[13.5px] leading-relaxed text-theme-secondary max-w-xs">
        {message ?? 'Please check your connection and try again.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
      )}
    </div>
  );
}

/* ── Orchestrator ─────────────────────────────────────────────────── */

// Picks the right view for the current data state, in priority order:
// loading → error → empty → content.
export function AsyncStateView({
  loading,
  error,
  empty,
  skeleton = <SkeletonList />,
  emptyTitle = 'Nothing here yet',
  emptyMessage,
  emptyIcon,
  onRetry,
  children,
}: {
  loading: boolean;
  error?: boolean;
  empty?: boolean;
  skeleton?: React.ReactNode;
  emptyTitle?: string;
  emptyMessage?: string;
  emptyIcon?: React.ElementType;
  onRetry?: () => void;
  children: React.ReactNode;
}) {
  if (loading) return <>{skeleton}</>;
  if (error) return <AppErrorView onRetry={onRetry} />;
  if (empty) return <AppEmptyView icon={emptyIcon} title={emptyTitle} message={emptyMessage} />;
  return <>{children}</>;
}
