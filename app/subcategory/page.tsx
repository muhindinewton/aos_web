'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Search, Grid3X3, List, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { products } from '../lib/data';
import { CATEGORY_SUBS, CATEGORY_DATA_NAMES } from '../lib/category-data';
import { ProductCard } from '../components/product-card';
import { usePageLoad, SkeletonGrid, AppErrorView } from '../components/app-state-views';

const SORT_OPTIONS = ['Best Match', 'Newest First', 'Price: Low to High', 'Price: High to Low', 'Top Rated'];

export default function SubcategoryPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><p className="text-theme-muted">Loading...</p></div>}>
      <SubcategoryContent />
    </Suspense>
  );
}

function SubcategoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const catParam  = searchParams.get('cat')  ?? '';
  const subParam  = searchParams.get('sub')  ?? '';

  const subcategories = CATEGORY_SUBS[catParam] ?? [];
  const dataName      = CATEGORY_DATA_NAMES[catParam] ?? null;

  const [activeSub, setActiveSub]   = useState(subParam || 'All');
  const [search, setSearch]         = useState('');
  const [sort, setSort]             = useState('Best Match');
  const [showSort, setShowSort]     = useState(false);
  const [viewMode, setViewMode]     = useState<'grid' | 'list'>('grid');
  const { loading, error, retry, forceEmpty } = usePageLoad();

  const baseProducts = dataName
    ? products.filter(p => p.category === dataName)
    : products;

  const filtered = (forceEmpty ? [] : baseProducts).filter(p => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'Price: Low to High')  return parseFloat(a.price.replace(/[^0-9.]/g, '')) - parseFloat(b.price.replace(/[^0-9.]/g, ''));
    if (sort === 'Price: High to Low')  return parseFloat(b.price.replace(/[^0-9.]/g, '')) - parseFloat(a.price.replace(/[^0-9.]/g, ''));
    if (sort === 'Top Rated')           return b.rating - a.rating;
    return 0;
  });

  const displayProducts = sorted.length > 0 ? sorted : products.slice(0, 12);

  return (
    <div className="min-h-screen bg-theme pb-20 lg:pb-0">

      {/* ── Header ── */}
      <div className="sticky top-0 z-30 bg-surface border-b border-theme">
        <div className="max-w-7xl mx-auto px-4 md:px-6">

          {/* Top row: back + title */}
          <div className="flex items-center gap-3 py-3">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-xl border border-theme hover:bg-elevated transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4 text-theme-primary" />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-theme-muted leading-none mb-0.5">{catParam}</p>
              <h1 className="text-base font-bold text-theme-primary leading-none truncate">
                {activeSub === 'All' ? catParam : activeSub}
              </h1>
            </div>
            <Link
              href="/categories"
              className="text-xs text-primary font-medium hover:underline flex-shrink-0"
            >
              All Categories
            </Link>
          </div>

          {/* Search bar */}
          <div className="pb-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={`Search in ${activeSub === 'All' ? catParam : activeSub}...`}
                className="w-full pl-9 pr-9 py-2.5 bg-elevated border border-theme rounded-xl text-sm text-theme-primary placeholder:text-theme-muted focus:outline-none focus:border-primary"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-theme-muted" />
                </button>
              )}
            </div>
          </div>

          {/* Subcategory chips */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-3">
            {['All', ...subcategories].map(sub => (
              <button
                key={sub}
                onClick={() => setActiveSub(sub)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-colors whitespace-nowrap ${
                  activeSub === sub
                    ? 'bg-primary text-white'
                    : 'bg-elevated border border-theme text-theme-secondary hover:border-primary/40 hover:text-primary'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Results bar ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-3">
        <p className="text-sm text-theme-muted">
          <span className="font-semibold text-theme-primary">{displayProducts.length}</span> results
          {activeSub !== 'All' && <span> in <span className="font-medium text-primary">{activeSub}</span></span>}
        </p>
        <div className="flex items-center gap-2">
          {/* Sort */}
          <div className="relative">
            <button
              onClick={() => setShowSort(v => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-theme rounded-lg text-xs text-theme-primary hover:border-primary/40 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              {sort}
              <ChevronDown className={`w-3 h-3 transition-transform ${showSort ? 'rotate-180' : ''}`} />
            </button>
            {showSort && (
              <div className="absolute right-0 top-full mt-1 z-20 bg-surface border border-theme rounded-xl shadow-xl py-1 min-w-[180px]">
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    onClick={() => { setSort(opt); setShowSort(false); }}
                    className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${sort === opt ? 'text-primary font-semibold bg-primary/5' : 'text-theme-primary hover:bg-elevated'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* View toggle */}
          <div className="flex gap-0.5 bg-elevated rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-surface text-primary shadow-sm' : 'text-theme-muted'}`}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-surface text-primary shadow-sm' : 'text-theme-muted'}`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Product Grid ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-10">
        {loading ? (
          <SkeletonGrid items={8} />
        ) : error ? (
          <AppErrorView onRetry={retry} />
        ) : displayProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-theme-muted text-sm">No products found</p>
            <button onClick={() => { setSearch(''); setActiveSub('All'); }} className="mt-3 text-primary text-sm font-medium hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          <div className={`grid gap-3 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1 md:grid-cols-2'}`}>
            {displayProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
