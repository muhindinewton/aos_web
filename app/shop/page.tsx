'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Grid3X3, List } from 'lucide-react';
import { products, categories } from '../lib/data';
import { ProductCard } from '../components/product-card';

type FilterType = 'all' | 'recent' | 'deals' | 'flash' | 'offers';

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><p className="text-theme-muted">Loading...</p></div>}>
      <ShopContent />
    </Suspense>
  );
}

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const filterParam = searchParams.get('filter') as FilterType;

  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'All');
  const [filter, setFilter] = useState<FilterType>(filterParam || 'all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredProducts = products.filter((product) => {
    if (selectedCategory !== 'All' && product.category !== selectedCategory) return false;
    if (filter === 'deals' && !product.isOffer) return false;
    if (filter === 'flash' && !product.isOffer) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <h1 className="text-2xl font-bold text-theme-primary mb-4">Shop</h1>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-3">
        {['All', 'Recent', 'Deals', 'Flash'].map((f) => (
          <button key={f} onClick={() => setFilter(f.toLowerCase() as FilterType)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === f.toLowerCase() ? 'bg-primary text-white' : 'bg-surface text-theme-primary border border-theme hover:border-primary/40'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-5">
        {categories.map((cat) => (
          <button key={cat.id} onClick={() => setSelectedCategory(cat.name)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${selectedCategory === cat.name ? 'bg-primary/10 text-primary border border-primary' : 'bg-surface text-theme-secondary border border-theme'}`}>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Results bar */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-theme-muted">{filteredProducts.length} results</p>
        <div className="flex gap-1">
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'text-theme-muted'}`}><Grid3X3 className="w-4 h-4" /></button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary/10 text-primary' : 'text-theme-muted'}`}><List className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Products */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16"><p className="text-theme-muted">No products found for this filter.</p></div>
      ) : (
        <div className={`grid gap-3 md:gap-4 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2'}`}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
