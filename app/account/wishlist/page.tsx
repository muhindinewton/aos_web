'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Search, Heart, Star, ChevronDown, LayoutGrid, Rows,
  SlidersHorizontal, Check,
} from 'lucide-react';
import ProtectedRoute from '../../components/protected-route';
import { products } from '../../lib/data';
import { usePageLoad, SkeletonGrid, AppErrorView } from '../../components/app-state-views';

const SORTS = ['Best Match', 'Price: Low to High', 'Price: High to Low', 'Top Rated'] as const;
type Sort = typeof SORTS[number];

const priceValue = (p: string) => Number(p.replace(/[^0-9]/g, '')) || 0;

function WishlistPage() {
  const router = useRouter();
  const [wishlist, setWishlist] = useState(products.slice(0, 6).map(p => p.id));
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<Sort>('Best Match');
  const [sortOpen, setSortOpen] = useState(false);
  const [gridView, setGridView] = useState(true);
  const { loading, error, retry, forceEmpty } = usePageLoad();

  const items = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = forceEmpty ? [] : products.filter(p => wishlist.includes(p.id));
    if (q) list = list.filter(p => p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q));
    if (sort === 'Price: Low to High') list = [...list].sort((a, b) => priceValue(a.price) - priceValue(b.price));
    if (sort === 'Price: High to Low') list = [...list].sort((a, b) => priceValue(b.price) - priceValue(a.price));
    if (sort === 'Top Rated')          list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [wishlist, search, sort, forceEmpty]);

  const remove = (id: string) => setWishlist(prev => prev.filter(pid => pid !== id));

  return (
    <div className="max-w-3xl mx-auto px-4 py-5 pb-24 lg:pb-10">
      {/* ── Back + search row ── */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => router.push('/account')}
          className="w-10 h-10 flex items-center justify-center flex-shrink-0"
          aria-label="Back"
        >
          <ArrowLeft className="w-6 h-6 text-theme-primary" />
        </button>
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-muted" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search wishlist..."
            className="w-full bg-surface border border-theme rounded-2xl py-3 pl-12 pr-4 text-[15px] text-theme-primary placeholder:text-theme-muted outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* ── Toolbar: sort · view toggle · filter ── */}
      <div className="flex items-center justify-between mb-4">
        <div className="relative">
          <button
            onClick={() => setSortOpen(v => !v)}
            className="flex items-center gap-1.5 text-primary text-[17px] font-semibold"
          >
            {sort === 'Best Match' ? 'Best Match' : sort}
            <ChevronDown className={`w-5 h-5 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
          </button>
          {sortOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setSortOpen(false)} />
              <div className="absolute left-0 top-8 w-56 bg-surface border border-theme rounded-xl shadow-2xl overflow-hidden z-40 py-1">
                {SORTS.map(s => (
                  <button
                    key={s}
                    onClick={() => { setSort(s); setSortOpen(false); }}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-theme-primary hover:bg-elevated transition-colors"
                  >
                    {s}
                    {sort === s && <Check className="w-4 h-4 text-primary" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="flex items-center gap-5">
          <button
            onClick={() => setGridView(v => !v)}
            className="text-theme-secondary hover:text-theme-primary transition-colors"
            aria-label="Toggle view"
          >
            {gridView ? <LayoutGrid className="w-6 h-6" /> : <Rows className="w-6 h-6" />}
          </button>
          <button className="flex items-center gap-2 text-theme-primary text-[17px] font-medium">
            Filter <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <SkeletonGrid items={6} />
      ) : error ? (
        <AppErrorView onRetry={retry} />
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center px-8 py-20">
          <div className="w-[88px] h-[88px] rounded-full bg-elevated flex items-center justify-center">
            <Heart className="w-10 h-10 text-theme-muted" />
          </div>
          <h2 className="mt-5 text-[17px] font-semibold text-theme-primary">
            {search ? 'No matches found' : 'Your wishlist is empty'}
          </h2>
          <p className="mt-2 text-[13.5px] text-theme-secondary">
            {search ? 'Try a different search term.' : 'Items you save will appear here.'}
          </p>
          {!search && (
            <Link
              href="/shop"
              className="mt-5 px-6 py-2.5 rounded-full border border-primary text-primary text-sm font-semibold hover:bg-primary/5 transition-colors"
            >
              Browse products
            </Link>
          )}
        </div>
      ) : (
        <div className={gridView ? 'grid grid-cols-2 sm:grid-cols-3 gap-3' : 'space-y-3'}>
          {items.map(p => (
            <Link
              key={p.id}
              href={`/product/${p.id}`}
              className={`bg-surface rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.05)] overflow-hidden ${
                gridView ? 'block p-2.5' : 'flex items-center gap-3 p-3'
              }`}
            >
              {/* Image area with heart button */}
              <div className={`relative bg-elevated rounded-xl overflow-hidden flex-shrink-0 ${gridView ? 'h-[150px]' : 'w-24 h-24'}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://picsum.photos/seed/${p.id}/400/300`}
                  alt={p.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={e => { e.preventDefault(); remove(p.id); }}
                  className="absolute top-2 right-2 w-9 h-9 rounded-full bg-white shadow flex items-center justify-center hover:scale-110 transition-transform"
                  aria-label="Remove from wishlist"
                >
                  <Heart className="w-[18px] h-[18px] text-primary" fill="currentColor" />
                </button>
              </div>

              {/* Details */}
              <div className={gridView ? 'pt-2.5' : 'flex-1 min-w-0'}>
                <p className="text-base font-semibold text-theme-primary truncate">{p.title}</p>
                <p className="text-[13px] text-theme-secondary truncate mt-0.5">{p.location}</p>
                <p className="text-base font-bold text-theme-primary mt-1.5">{p.price}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="flex items-center">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i <= Math.round(p.rating) ? 'text-amber-500 fill-amber-500' : 'text-theme-muted'}`}
                      />
                    ))}
                  </span>
                  <span className="text-xs text-theme-muted">({p.reviews})</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function WishlistPageWrapper() {
  return <ProtectedRoute><WishlistPage /></ProtectedRoute>;
}
