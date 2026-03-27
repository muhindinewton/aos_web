'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Heart, Trash2 } from 'lucide-react';
import { products } from '../../lib/data';
import { ProductCard } from '../../components/product-card';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState(products.slice(0, 6).map(p => p.id));

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  const removeFromWishlist = (id: string) => {
    setWishlist(prev => prev.filter(pid => pid !== id));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
      <Link href="/account" className="inline-flex items-center gap-1 text-sm text-theme-muted hover:text-primary mb-4">
        <ChevronLeft className="w-4 h-4" /> Back to Account
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-theme-primary">My Wishlist</h1>
        <span className="text-sm text-theme-muted">{wishlistProducts.length} items</span>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="w-16 h-16 text-theme-muted mx-auto mb-4 opacity-30" />
          <h2 className="font-semibold text-theme-primary mb-1">Your wishlist is empty</h2>
          <p className="text-sm text-theme-muted mb-4">Save items you love to find them later</p>
          <Link href="/shop" className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-hover transition-colors">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {wishlistProducts.map((product) => (
            <div key={product.id} className="relative">
              <ProductCard product={product} />
              <button
                onClick={() => removeFromWishlist(product.id)}
                className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
