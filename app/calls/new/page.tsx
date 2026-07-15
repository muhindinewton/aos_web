'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, BadgeCheck, Phone, MessageSquare, UserX } from 'lucide-react';
import { usePageLoad, SkeletonList, AppErrorView } from '../../components/app-state-views';

// New Conversation — mirrors mobile's new_conversation_screen.dart: a
// Verified Sellers / Friends toggle over contact cards with message + call
// actions.
type Tab = 'sellers' | 'friends';

interface Contact {
  id: string;
  name: string;
  category: string;
  verified: boolean;
  online: boolean;
}

const SELLERS: Contact[] = [
  { id: '2',  name: 'TechHub Kenya',   category: 'Electronics & Gadgets',        verified: true, online: true },
  { id: '50', name: 'KE Gadgets Store', category: 'Mobile Phones & Accessories', verified: true, online: true },
  { id: '1',  name: 'AutoMart Kenya',  category: 'Cars & Vehicles',              verified: true, online: false },
  { id: '13', name: 'HomeStyle Decor', category: 'Home & Garden',                verified: true, online: true },
  { id: '5',  name: 'Mary Wanjiku',    category: 'Furniture & Home Decor',       verified: true, online: false },
];

const FRIENDS: Contact[] = [
  { id: '3',  name: 'Dukes',        category: 'Friend', verified: false, online: true },
  { id: '4',  name: 'Dan Kalutu',   category: 'Friend', verified: true,  online: false },
  { id: '6',  name: 'imtiaz',       category: 'Friend', verified: false, online: true },
  { id: '7',  name: 'Cyber Cafe',   category: 'Friend', verified: true,  online: false },
  { id: '8',  name: 'Brother HOPE', category: 'Friend', verified: false, online: false },
];

export default function NewConversationPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('sellers');
  const [search, setSearch] = useState('');
  const { loading, error, retry, forceEmpty } = usePageLoad();

  const source = forceEmpty ? [] : tab === 'sellers' ? SELLERS : FRIENDS;
  const q = search.trim().toLowerCase();
  const filtered = !q ? source : source.filter(c =>
    c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
  );

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100dvh-80px)] lg:h-[calc(100dvh-112px)]">
      {/* ── Top bar: floating back button + centered title ── */}
      <div className="relative flex items-center justify-center px-4 pt-5 pb-4 flex-shrink-0">
        <button
          onClick={() => router.back()}
          className="absolute left-4 w-11 h-11 rounded-xl bg-surface shadow-[0_2px_10px_rgba(0,0,0,0.08)] flex items-center justify-center hover:bg-elevated transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5 text-theme-primary" />
        </button>
        <h1 className="text-xl sm:text-[26px] font-bold text-theme-primary">New Conversation</h1>
      </div>

      {/* ── Segmented toggle ── */}
      <div className="px-4 pb-4 flex-shrink-0">
        <div className="flex bg-elevated rounded-2xl p-1.5 gap-1">
          {([['sellers', 'Verified Sellers'], ['friends', 'Friends']] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => { setTab(key); setSearch(''); }}
              className={`flex-1 py-3 rounded-xl text-[15px] font-semibold transition-all ${
                tab === key ? 'bg-primary text-white shadow-sm' : 'text-theme-secondary hover:text-theme-primary'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Search ── */}
      <div className="px-4 pb-4 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-muted" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={tab === 'sellers' ? 'Search sellers...' : 'Search friends...'}
            className="w-full bg-surface border border-theme rounded-2xl py-3.5 pl-12 pr-4 text-[15px] text-theme-primary placeholder:text-theme-muted outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* ── Contact cards ── */}
      <div className="flex-1 overflow-y-auto hide-scrollbar px-4 pb-6 space-y-3">
        {loading ? (
          <SkeletonList rows={5} />
        ) : error ? (
          <AppErrorView onRetry={retry} />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-theme-muted">
            <UserX className="w-16 h-16 opacity-30" />
            <p className="text-sm font-semibold mt-3 text-theme-primary">No contacts found</p>
            <p className="text-xs mt-1">Try a different search term</p>
          </div>
        ) : (
          filtered.map(c => (
            <div
              key={c.id}
              className="flex items-center gap-4 bg-surface border border-theme rounded-2xl px-4 py-3.5"
            >
              {/* Avatar with online dot (bottom-right) */}
              <div className="relative flex-shrink-0">
                <div className="w-[52px] h-[52px] rounded-full bg-primary/15 flex items-center justify-center">
                  <span className="text-xl font-semibold text-primary">{c.name[0].toUpperCase()}</span>
                </div>
                {c.online && (
                  <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-[#2ECC71] border-2 border-[var(--surface,#fff)]" />
                )}
              </div>

              {/* Name + category */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-[17px] font-bold text-theme-primary truncate">{c.name}</p>
                  {c.verified && <BadgeCheck className="w-[18px] h-[18px] text-white fill-sky-500 flex-shrink-0" />}
                </div>
                <p className="text-sm text-theme-secondary truncate mt-0.5">{c.category}</p>
              </div>

              {/* Message + Call actions */}
              <div className="flex items-center gap-2.5 flex-shrink-0">
                <Link
                  href={`/chat/${c.id}`}
                  className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                  aria-label={`Message ${c.name}`}
                >
                  <MessageSquare className="w-5 h-5 text-primary" fill="currentColor" />
                </Link>
                <button
                  onClick={() => router.push(`/call/${c.id}`)}
                  className="w-11 h-11 rounded-full bg-green-500/10 flex items-center justify-center hover:bg-green-500/20 transition-colors"
                  aria-label={`Call ${c.name}`}
                >
                  <Phone className="w-5 h-5 text-green-500" fill="currentColor" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
