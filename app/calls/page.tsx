'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, X, Phone, PhoneCall,
  PhoneIncoming, PhoneOutgoing, PhoneMissed,
} from 'lucide-react';
import { callLogs } from '../lib/data';
import type { CallLog, CallType } from '../types';
import ChatCallsTabs from '../components/chat-calls-tabs';

type Filter = 'All' | 'Missed' | 'Incoming' | 'Outgoing';
const FILTERS: Filter[] = ['All', 'Missed', 'Incoming', 'Outgoing'];

const GROUP_ORDER = ['Today', 'Yesterday', 'Mon, Jan 27'];

function CallTypeIcon({ type }: { type: CallType }) {
  if (type === 'incoming') return <PhoneIncoming className="w-3.5 h-3.5 text-green-500" />;
  if (type === 'outgoing') return <PhoneOutgoing className="w-3.5 h-3.5 text-theme-muted" />;
  return                          <PhoneMissed className="w-3.5 h-3.5 text-primary" />;
}

export default function CallsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('All');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return callLogs.filter(c => {
      const matchesSearch = !q || c.name.toLowerCase().includes(q);
      const matchesFilter =
        filter === 'All' ||
        (filter === 'Missed'   && c.type === 'missed')   ||
        (filter === 'Incoming' && c.type === 'incoming') ||
        (filter === 'Outgoing' && c.type === 'outgoing');
      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  const groups = filtered.reduce<Record<string, CallLog[]>>((acc, c) => {
    (acc[c.date] ??= []).push(c);
    return acc;
  }, {});

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100dvh-152px)] md:h-[calc(100dvh-156px)] relative">
      <ChatCallsTabs />

      {/* ── Search ── */}
      <div className="px-4 pb-3 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search calls…"
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

      {/* ── Call log ── */}
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-20">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-theme-muted">
            <Phone className="w-16 h-16 opacity-30" />
            <p className="text-sm font-semibold mt-3 text-theme-primary">
              {search ? `No results for "${search}"` : `No ${filter.toLowerCase()} calls`}
            </p>
            <p className="text-xs mt-1">{search ? 'Try a different search term' : 'Your recent calls will appear here'}</p>
          </div>
        ) : (
          GROUP_ORDER.filter(g => groups[g]?.length).map(group => (
            <div key={group}>
              <p className="px-4 py-1.5 text-xs font-semibold text-theme-muted">{group}</p>
              {groups[group].map(call => (
                <button
                  key={call.id}
                  onClick={() => router.push(`/call/${call.id}`)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface transition-colors text-left border-b border-theme last:border-0"
                >
                  <div className="w-11 h-11 rounded-full bg-elevated flex items-center justify-center flex-shrink-0">
                    <span className={`text-sm font-bold ${call.type === 'missed' ? 'text-primary' : 'text-theme-primary'}`}>
                      {call.avatar}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${call.type === 'missed' ? 'text-primary' : 'text-theme-primary'}`}>
                      {call.name}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <CallTypeIcon type={call.type} />
                      <span className="text-xs text-theme-muted">
                        {call.time}{call.duration ? ` • ${call.duration}` : ''}
                      </span>
                    </div>
                  </div>
                  <span
                    role="button"
                    aria-label={`Call ${call.name}`}
                    onClick={(e) => { e.stopPropagation(); router.push(`/call/${call.id}`); }}
                    className="w-9 h-9 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 hover:bg-green-500/20 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-green-500" />
                  </span>
                </button>
              ))}
            </div>
          ))
        )}
      </div>

      {/* ── FAB: new call ── */}
      <button
        onClick={() => router.push('/calls/new')}
        aria-label="Start new call"
        className="absolute bottom-4 right-4 w-14 h-14 rounded-2xl bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/30 flex items-center justify-center transition-all active:scale-95"
      >
        <PhoneCall className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}
