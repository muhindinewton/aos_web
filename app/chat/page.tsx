'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, MessageCircle, Plus, X } from 'lucide-react';
import { chats } from '../lib/data';

type Filter = 'All Chat' | 'Read' | 'Unread' | 'Unanswered';
const FILTERS: Filter[] = ['All Chat', 'Read', 'Unread', 'Unanswered'];

export default function ChatListPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('All Chat');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return chats.filter(c => {
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q);
      const matchesFilter =
        filter === 'All Chat' ||
        (filter === 'Read'       && c.unread === 0) ||
        (filter === 'Unread'     && c.unread > 0)  ||
        // "Unanswered" = last message is from the other party (we haven't replied)
        (filter === 'Unanswered' && c.messages.length > 0 && c.messages[c.messages.length - 1].sender === 'other');
      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100dvh-152px)] md:h-[calc(100dvh-156px)] relative">
      {/* ── Header ── */}
      <div className="px-4 pt-4 pb-3 flex items-center gap-3 flex-shrink-0">
        <h1 className="flex-1 text-xl font-semibold text-theme-primary">Messages</h1>
      </div>

      {/* ── Search ── */}
      <div className="px-4 pb-3 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search messages…"
            className="w-full bg-elevated border border-theme rounded-full py-2.5 pl-10 pr-10 text-sm text-theme-primary placeholder:text-theme-muted outline-none focus:border-primary"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-theme-muted/20 flex items-center justify-center"
            >
              <X className="w-3 h-3 text-theme-muted" />
            </button>
          )}
        </div>
      </div>

      {/* ── Filter pills ── */}
      <div className="px-4 pb-3 flex gap-2 flex-shrink-0 overflow-x-auto hide-scrollbar">
        {FILTERS.map(f => {
          const active = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                active ? 'bg-primary/15 text-primary' : 'text-theme-muted hover:text-theme-primary'
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* ── Conversation list ── */}
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-20">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-theme-muted">
            <MessageCircle className="w-16 h-16 opacity-30" />
            <p className="text-sm font-semibold mt-3 text-theme-primary">
              {search ? `No results for "${search}"` : `No ${filter.toLowerCase()} messages`}
            </p>
            <p className="text-xs mt-1">{search ? 'Try a different search term' : 'Your conversations will appear here'}</p>
          </div>
        ) : (
          filtered.map(c => (
            <Link
              key={c.id}
              href={`/chat/${c.id}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-surface transition-colors border-b border-theme last:border-0"
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
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-sm truncate ${c.unread > 0 ? 'font-bold text-theme-primary' : 'font-semibold text-theme-primary'}`}>
                    {c.name}
                  </p>
                  <span className={`text-[11px] whitespace-nowrap ${c.unread > 0 ? 'text-primary font-semibold' : 'text-theme-muted'}`}>
                    {c.timestamp}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <p className={`text-xs truncate ${c.unread > 0 ? 'text-theme-primary' : 'text-theme-muted'}`}>
                    {c.lastMessage}
                  </p>
                  {c.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                      {c.unread}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* ── FAB: new message ── */}
      <Link
        href="/chat/new"
        className="absolute bottom-4 right-4 w-14 h-14 rounded-2xl bg-primary hover:bg-primary-hover shadow-lg shadow-primary/30 flex items-center justify-center transition-all active:scale-95"
      >
        <Plus className="w-6 h-6 text-white" />
      </Link>
    </div>
  );
}
