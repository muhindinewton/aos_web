'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X, TrendingUp, Mic, Camera, ArrowLeft } from 'lucide-react';
import { products, categories } from '../lib/data';
import { ProductCard } from '../components/product-card';
import { usePageLoad, SkeletonList, AppErrorView } from '../components/app-state-views';

const trendingSearches = ['iPhone 15', 'Toyota', 'Apartment Nairobi', 'PS5', 'Laptop', 'Sofa Set', 'Samsung TV', 'Nike Sneakers'];
const initialRecentSearches = ['Apple Watch 5', 'Suitcase Arrow', 'iPhone Case', 'Patch Sneaker'];

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><p className="text-theme-muted">Loading...</p></div>}>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Derived from ?q=, not local state — the header owns the input, so the URL
  // is the single source of truth for what's being searched. Picking a recent
  // or trending term navigates, which updates both this page and the header box.
  const query = searchParams.get('q') ?? '';
  const runSearch = (term: string) =>
    router.push(term ? `/search?q=${encodeURIComponent(term)}` : '/search');
  const [recentSearches, setRecentSearches] = useState(initialRecentSearches);

  // What's typed in the mobile box before submitting. Re-seeded whenever the
  // committed query changes, so trending taps and back/forward stay in sync.
  const [draft, setDraft] = useState(query);
  useEffect(() => { setDraft(query); }, [query]);
  const { loading, error, retry } = usePageLoad();

  const filtered = query.length >= 2
    ? products.filter(p =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.location.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const removeRecentSearch = (term: string) => {
    setRecentSearches(prev => prev.filter(s => s !== term));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-5">
      {/* ── Top bar: floating back button + centered title ── */}
      <div className="relative flex items-center justify-center pb-5">
        <button
          onClick={() => router.back()}
          className="absolute left-0 w-11 h-11 rounded-full bg-surface shadow-[0_2px_10px_rgba(0,0,0,0.08)] flex items-center justify-center hover:bg-elevated transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5 text-theme-primary" />
        </button>
        <h1 className="text-xl sm:text-[26px] font-bold text-theme-primary">Search</h1>
      </div>

      {/* Mobile-only search box. The header's search bar is `hidden lg:block`,
          so below lg this is the only way to type a query — but on desktop it
          would duplicate the header, hence lg:hidden. */}
      <form
        onSubmit={e => { e.preventDefault(); runSearch(draft.trim()); }}
        className="relative mb-6 lg:hidden"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-muted pointer-events-none" />
        <input
          type="search"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder="Search products, categories, locations..."
          aria-label="Search"
          className="w-full bg-surface border border-theme rounded-xl py-3.5 pl-12 pr-28 text-theme-primary placeholder:text-theme-muted outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm [&::-webkit-search-cancel-button]:hidden"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {draft && (
            <button
              type="button"
              onClick={() => { setDraft(''); router.push('/search'); }}
              aria-label="Clear search"
              className="w-7 h-7 rounded-full bg-elevated flex items-center justify-center hover:bg-theme-muted/20 transition-colors"
            >
              <X className="w-4 h-4 text-theme-muted" />
            </button>
          )}
          <button
            type="button"
            onClick={() => router.push('/search/voice')}
            aria-label="Voice search"
            className="w-10 h-9 rounded-xl bg-elevated flex items-center justify-center hover:bg-theme-muted/20 transition-colors text-theme-secondary"
          >
            <Mic className="w-[18px] h-[18px]" />
          </button>
          <button
            type="button"
            onClick={() => router.push('/search/image')}
            aria-label="Image search"
            className="w-10 h-9 rounded-xl bg-elevated flex items-center justify-center hover:bg-theme-muted/20 transition-colors text-theme-secondary"
          >
            <Camera className="w-[18px] h-[18px]" />
          </button>
        </div>
      </form>

      {/* Load lifecycle for the browse content */}
      {loading && <SkeletonList rows={5} />}
      {error && !loading && <AppErrorView onRetry={retry} />}

      {/* No query - show trending and categories */}
      {!loading && !error && query.length < 2 && (
        <>
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold text-theme-primary">Recent Searches</h2>
                <button
                  onClick={() => setRecentSearches([])}
                  className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors"
                >
                  Delete
                </button>
              </div>
              <div className="bg-surface rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] overflow-hidden">
                {recentSearches.map((term, i) => (
                  <div
                    key={term}
                    className={`flex items-center gap-3 px-4 py-3.5 ${i > 0 ? 'border-t border-theme/60' : ''}`}
                  >
                    <span className="w-10 h-10 rounded-xl bg-elevated flex items-center justify-center flex-shrink-0">
                      <Search className="w-4.5 h-4.5 w-[18px] h-[18px] text-theme-muted" />
                    </span>
                    <button
                      onClick={() => runSearch(term)}
                      className="flex-1 text-left text-[17px] text-theme-primary hover:text-primary transition-colors truncate"
                    >
                      {term}
                    </button>
                    <button
                      onClick={() => removeRecentSearch(term)}
                      className="w-9 h-9 rounded-full bg-elevated flex items-center justify-center hover:bg-theme-muted/20 transition-colors flex-shrink-0"
                      aria-label={`Remove ${term}`}
                    >
                      <X className="w-4 h-4 text-theme-muted" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trending Searches */}
          <div className="mb-8">
            <h2 className="font-bold text-theme-primary text-sm mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Trending Searches
            </h2>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => runSearch(term)}
                  className="bg-surface border border-theme rounded-full px-4 py-2 text-sm text-theme-secondary hover:border-primary hover:text-primary transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Browse Categories */}
          <div>
            <h2 className="font-bold text-theme-primary text-sm mb-3">Browse by Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {categories.slice(1).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.name}`}
                  className="bg-surface border border-theme rounded-xl p-3 flex items-center gap-3 hover:border-primary hover:shadow-soft transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold text-sm">{cat.name[0]}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-theme-primary">{cat.name}</h3>
                    <p className="text-[11px] text-theme-muted">{cat.subcategories.length} subcategories</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Results */}
      {!loading && !error && query.length >= 2 && (
        <>
          <p className="text-sm text-theme-muted mb-4">
            {filtered.length > 0 ? `${filtered.length} ${filtered.length === 1 ? 'result' : 'results'} for "${query}"` : `No results for "${query}"`}
          </p>

          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-14 h-14 text-theme-muted mx-auto mb-3 opacity-30" />
              <h2 className="font-semibold text-theme-primary mb-1">No products found</h2>
              <p className="text-sm text-theme-muted">Try a different search term or browse categories</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 md:gap-3">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
