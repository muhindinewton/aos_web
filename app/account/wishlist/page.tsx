'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Search, Heart, ChevronDown,
  SlidersHorizontal, Check,
} from 'lucide-react';
import ProtectedRoute from '../../components/protected-route';
import { ProductCard } from '../../components/product-card';
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

      {/* ── Toolbar: sort · filter ── */}
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
        <button className="flex items-center gap-2 text-theme-primary text-[17px] font-medium">
          Filter <SlidersHorizontal className="w-5 h-5" />
        </button>
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
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
          {items.map(p => (
            // Shared card, same as the rest of the app. The heart is controlled
            // here so tapping it removes the item from the wishlist.
            <ProductCard
              key={p.id}
              product={p}
              liked
              onLikeChange={() => remove(p.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function WishlistPageWrapper() {
  return <ProtectedRoute><WishlistPage /></ProtectedRoute>;
}
