'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Phone, UserX } from 'lucide-react';
import { chats } from '../../lib/data';

export default function NewCallPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const sorted = useMemo(
    () => [...chats].sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  const q = search.trim().toLowerCase();
  const filtered = !q ? sorted : sorted.filter(c => c.name.toLowerCase().includes(q));

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100dvh-152px)] md:h-[calc(100dvh-156px)]">
      {/* ── Top bar ── */}
      <div className="px-4 pt-4 pb-3 flex items-center gap-3 flex-shrink-0">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-elevated border border-theme flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-theme-primary" />
        </button>
        <h1 className="flex-1 text-xl font-semibold text-theme-primary">New Call</h1>
      </div>

      {/* ── Search ── */}
      <div className="px-4 pb-3 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search contacts…"
            autoFocus
            className="w-full bg-elevated border border-theme rounded-full py-2.5 pl-10 pr-4 text-sm text-theme-primary placeholder:text-theme-muted outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* ── Section heading ── */}
      <div className="px-4 pb-2 flex-shrink-0">
        <p className="text-xs font-semibold text-theme-muted uppercase tracking-wide">
          {q ? `${filtered.length} result${filtered.length === 1 ? '' : 's'}` : 'Recent Contacts'}
        </p>
      </div>

      {/* ── Contact list ── */}
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-theme-muted">
            <UserX className="w-16 h-16 opacity-30" />
            <p className="text-sm font-semibold mt-3 text-theme-primary">No contacts found</p>
            <p className="text-xs mt-1">Try a different search term</p>
          </div>
        ) : (
          filtered.map(c => (
            <button
              key={c.id}
              onClick={() => router.push(`/call/${c.id}`)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface transition-colors text-left border-b border-theme last:border-0"
            >
              <div className="relative flex-shrink-0">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">{c.avatar}</span>
                </div>
                {c.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 ring-2 ring-[var(--bg)]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-theme-primary truncate">{c.name}</p>
                <p className="text-xs text-theme-muted">{c.online ? 'Online' : 'Tap to call'}</p>
              </div>
              <span className="w-9 h-9 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <Phone className="w-4 h-4 text-green-500" />
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
