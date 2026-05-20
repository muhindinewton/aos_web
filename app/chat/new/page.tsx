'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, BadgeCheck, MapPin, Star, UserX } from 'lucide-react';
import { products } from '../../lib/data';

interface SellerOption {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  verified: boolean;
  description: string;
  location: string;
  reviews: number;
}

// Derive verified sellers from product data (one entry per unique seller)
function useVerifiedSellers(): SellerOption[] {
  return useMemo(() => {
    const seen = new Map<string, SellerOption>();
    for (const p of products) {
      const s = p.seller;
      if (!s || !s.verified || seen.has(s.id)) continue;
      seen.set(s.id, {
        id: s.id,
        name: s.name,
        avatar: s.avatar,
        rating: s.rating,
        verified: true,
        description: `Trusted ${p.category.toLowerCase()} seller`,
        location: p.location,
        reviews: Math.round(s.rating * 73),
      });
    }
    return Array.from(seen.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, []);
}

export default function NewChatPage() {
  const router = useRouter();
  const sellers = useVerifiedSellers();
  const [search, setSearch] = useState('');

  const q = search.trim().toLowerCase();
  const filtered = !q ? sellers : sellers.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.description.toLowerCase().includes(q) ||
    s.location.toLowerCase().includes(q)
  );

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
        <h1 className="flex-1 text-xl font-semibold text-theme-primary">New Message</h1>
      </div>

      {/* ── Search ── */}
      <div className="px-4 pb-3 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search sellers…"
            autoFocus
            className="w-full bg-elevated border border-theme rounded-full py-2.5 pl-10 pr-4 text-sm text-theme-primary placeholder:text-theme-muted outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* ── Section heading ── */}
      <div className="px-4 pb-2 flex-shrink-0">
        <p className="text-xs font-semibold text-theme-muted uppercase tracking-wide">
          {q ? `${filtered.length} result${filtered.length === 1 ? '' : 's'}` : 'Verified Sellers'}
        </p>
      </div>

      {/* ── Seller list ── */}
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-theme-muted">
            <UserX className="w-16 h-16 opacity-30" />
            <p className="text-sm font-semibold mt-3 text-theme-primary">No sellers found</p>
            <p className="text-xs mt-1">Try a different search term</p>
          </div>
        ) : (
          filtered.map(s => (
            <Link
              key={s.id}
              href={`/chat/${s.id}`}
              className="flex items-start gap-3 px-4 py-3 hover:bg-surface transition-colors border-b border-theme last:border-0"
            >
              <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary">{s.avatar}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <p className="text-sm font-semibold text-theme-primary truncate">{s.name}</p>
                    {s.verified && <BadgeCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Star className="w-3.5 h-3.5 text-yellow-500" fill="currentColor" />
                    <span className="text-[12px] font-semibold text-theme-primary">{s.rating.toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-xs text-theme-muted mt-0.5">{s.description}</p>
                <div className="flex items-center gap-1 mt-1 text-[11px] text-theme-muted">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{s.location}</span>
                  <span className="ml-1">• {s.reviews} reviews</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
