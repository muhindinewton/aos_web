'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, X, TrendingUp } from 'lucide-react';
import { products, categories } from '../lib/data';
import { ProductCard } from '../components/product-card';

const trendingSearches = ['iPhone 15', 'Toyota', 'Apartment Nairobi', 'PS5', 'Laptop', 'Sofa Set', 'Samsung TV', 'Nike Sneakers'];

export default function SearchPage() {
  const [query, setQuery] = useState('');

  const filtered = query.length >= 2
    ? products.filter(p =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.location.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products, categories, locations..."
          autoFocus
          className="w-full bg-surface border border-theme rounded-xl py-3.5 pl-12 pr-10 text-theme-primary placeholder:text-theme-muted outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-elevated flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <X className="w-4 h-4 text-theme-muted" />
          </button>
        )}
      </div>

      {/* No query - show trending and categories */}
      {query.length < 2 && (
        <>
          {/* Trending Searches */}
          <div className="mb-8">
            <h2 className="font-bold text-theme-primary text-sm mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Trending Searches
            </h2>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
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
      {query.length >= 2 && (
        <>
          <p className="text-sm text-theme-muted mb-4">
            {filtered.length > 0 ? `${filtered.length} results for "${query}"` : `No results for "${query}"`}
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
