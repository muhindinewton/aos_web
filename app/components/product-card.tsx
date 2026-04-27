'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Star, MapPin, Clock, Eye } from 'lucide-react';
import { Product } from '../types';
import { useToast } from '../providers/toast-provider';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [liked, setLiked] = useState(false);
  const { showToast } = useToast();

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newLiked = !liked;
    setLiked(newLiked);
    if (newLiked) {
      showToast('Added to wishlist', 'wishlist');
    } else {
      showToast('Removed from wishlist', 'info');
    }
  };

  return (
    <div className="group bg-surface border border-theme rounded-xl overflow-hidden hover:shadow-card transition-all flex flex-col">
      {/* Image */}
      <Link href={`/product/${product.id}`} className="relative aspect-[4/3] bg-elevated overflow-hidden block flex-shrink-0">
        <img
          src={`https://picsum.photos/seed/p${product.id}/400/300`}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.isOffer && product.discount && (
          <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
            -{product.discount}%
          </span>
        )}
        <button
          onClick={handleLike}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur flex items-center justify-center hover:bg-white transition-colors"
        >
          <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-primary text-primary' : 'text-gray-600'}`} />
        </button>
        {product.offerExpiry && product.offerExpiry <= 3 && (
          <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur text-white text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
            <Clock className="w-3 h-3" />{product.offerExpiry}d left
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-2.5 flex-1 flex flex-col">
        {/* Title */}
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-sm text-theme-primary truncate group-hover:text-primary transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Location */}
        <div className="flex items-center gap-1 mt-1 text-theme-muted text-[11px]">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{product.location}</span>
        </div>

        {/* Price — fixed 2-line height to keep original price space consistent */}
        <div className="mt-1 h-9 flex flex-col justify-center">
          <span className="font-bold text-primary text-sm leading-none">{product.price}</span>
          <span className="text-[11px] text-theme-muted line-through leading-none mt-0.5 h-3.5">
            {product.originalPrice ?? ''}
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-auto pt-1 text-[11px] text-theme-muted">
          <div className="flex items-center gap-px">
            {[1, 2, 3, 4, 5].map(i => (
              <Star
                key={i}
                className={`w-3 h-3 ${i <= Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="ml-0.5">{product.rating}</span>
          <span>({product.reviews})</span>
        </div>

        {/* View Details */}
        <Link
          href={`/product/${product.id}`}
          className="mt-2 w-full bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          View Details
        </Link>
      </div>
    </div>
  );
}
