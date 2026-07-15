'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, BadgeCheck, MapPin, Star, UserX } from 'lucide-react';
import { usePageLoad, SkeletonList, AppErrorView } from '../../components/app-state-views';

// Verified sellers seed — mirrors mobile's new_chat_screen.dart.
interface SellerOption {
  id: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  reviews: string;
  online: boolean;
}

const VERIFIED_SELLERS: SellerOption[] = [
  { id: '2',  name: 'TechHub Kenya',   category: 'Electronics & Gadgets',        location: 'Nairobi, Kenya', rating: 4.8, reviews: '1.2K', online: true },
  { id: '50', name: 'KE Gadgets Store', category: 'Mobile Phones & Accessories', location: 'Mombasa, Kenya', rating: 4.9, reviews: '2.3K', online: true },
  { id: '5',  name: 'Mary Wanjiku',    category: 'Furniture & Home Decor',       location: 'Nakuru, Kenya',  rating: 4.6, reviews: '678',  online: false },
  { id: '1',  name: 'AutoMart Kenya',  category: 'Cars & Vehicles',              location: 'Nairobi, Kenya', rating: 4.7, reviews: '1.5K', online: true },
  { id: '13', name: 'HomeStyle Decor', category: 'Home & Garden',                location: 'Nairobi, Kenya', rating: 4.8, reviews: '1.1K', online: true },
];

export default function NewChatPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const { loading, error, retry, forceEmpty } = usePageLoad();

  const q = search.trim().toLowerCase();
  const sellers = forceEmpty ? [] : VERIFIED_SELLERS;
  const filtered = !q ? sellers : sellers.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.category.toLowerCase().includes(q) ||
    s.location.toLowerCase().includes(q)
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
        <h1 className="text-xl sm:text-[26px] font-bold text-theme-primary">New Message</h1>
      </div>

      {/* ── Search ── */}
      <div className="px-4 pb-4 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-muted" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search sellers..."
            autoFocus
            className="w-full bg-surface border border-theme rounded-2xl py-3.5 pl-12 pr-4 text-[15px] text-theme-primary placeholder:text-theme-muted outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* ── Section heading ── */}
      <div className="px-4 pb-1 flex-shrink-0">
        <h2 className="text-xl font-bold text-theme-primary">
          {q ? `${filtered.length} result${filtered.length === 1 ? '' : 's'}` : 'Verified Sellers'}
        </h2>
      </div>

      {/* ── Seller list ── */}
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-6">
        {loading ? (
          <SkeletonList rows={5} />
        ) : error ? (
          <AppErrorView onRetry={retry} />
        ) : filtered.length === 0 ? (
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
              className="flex items-center gap-4 px-4 py-4 hover:bg-surface transition-colors border-b border-theme last:border-0"
            >
              {/* Avatar with online dot (bottom-left, like mobile) */}
              <div className="relative flex-shrink-0">
                <div className="w-[60px] h-[60px] rounded-full bg-elevated flex items-center justify-center">
                  <span className="text-2xl font-semibold text-theme-primary">{s.name[0].toUpperCase()}</span>
                </div>
                <span className={`absolute bottom-0.5 -left-0.5 w-3.5 h-3.5 rounded-full border-2 border-[var(--bg,#fff)] ${s.online ? 'bg-[#2ECC71]' : 'bg-theme-muted'}`} />
              </div>

              {/* Name + category + location */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-[17px] font-bold text-theme-primary truncate">{s.name}</p>
                  <BadgeCheck className="w-[18px] h-[18px] text-white fill-sky-500 flex-shrink-0" />
                </div>
                <p className="text-sm text-theme-secondary truncate mt-0.5">{s.category}</p>
                <p className="flex items-center gap-1 text-sm text-theme-muted mt-0.5">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{s.location}</span>
                </p>
              </div>

              {/* Rating */}
              <div className="flex flex-col items-end flex-shrink-0">
                <span className="flex items-center gap-1">
                  <Star className="w-[18px] h-[18px] text-amber-500 fill-amber-500" />
                  <span className="text-[17px] font-bold text-theme-primary">{s.rating.toFixed(1)}</span>
                </span>
                <span className="text-[13px] text-theme-muted mt-0.5">{s.reviews} reviews</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
