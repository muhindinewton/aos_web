'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronLeft, Heart, Share2, MessageCircle, Star, MapPin, Shield, ChevronRight, Phone, ShoppingCart, Clock, Calendar, Package, AlertTriangle, Flag, BadgeDollarSign, ThumbsUp, ThumbsDown, Store } from 'lucide-react';
import { products } from '../../lib/data';
import { ProductCard } from '../../components/product-card';

const reviews = [
  { name: 'Grace Wanjiku', date: 'Jan 22, 2026', text: 'Amazing product! Exactly as described. The seller was very responsive and shipped within hours. Will definitely buy from them again.', rating: 5 },
  { name: 'James Kamau', date: 'Jan 20, 2026', text: 'Good quality, fast delivery. Minor scratches on the side that were not mentioned. Overall decent purchase.', rating: 4 },
  { name: 'Mercy Njeri', date: 'Jan 15, 2026', text: 'Exactly what I was looking for. Great condition and fair price!', rating: 5 },
];

export default function ProductDetailPage() {
  const params = useParams();
  const product = products.find(p => p.id === params.id) || products[0];
  const [liked, setLiked] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const imageCount = 4;

  useEffect(() => {
    const t = setInterval(() => setCurrentImage(p => (p + 1) % imageCount), 4000);
    return () => clearInterval(t);
  }, []);

  const similarProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 6);

  const specs = [
    { label: 'Category', value: product.category },
    { label: 'Condition', value: product.isOffer ? 'Like New' : 'Used' },
    { label: 'Location', value: product.location },
    { label: 'Rating', value: `${product.rating} / 5` },
    { label: 'Listed', value: 'Recently' },
  ];

  return (
    <>
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 pb-28 md:pb-6">
      <Link href="/shop" className="inline-flex items-center gap-1 text-sm text-theme-muted hover:text-primary mb-4">
        <ChevronLeft className="w-4 h-4" /> Back to Shop
      </Link>

      {/* ===== TOP: Image Gallery + Product Info (side-by-side on desktop) ===== */}
      <div className="grid md:grid-cols-2 gap-6 lg:gap-10 mb-6">
        {/* Image Gallery */}
        <div>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-elevated mb-3 group" onTouchStart={(e) => { (e.currentTarget as any)._ts = e.touches[0].clientX; }} onTouchEnd={(e) => { const d = ((e.currentTarget as any)._ts || 0) - e.changedTouches[0].clientX; if (Math.abs(d) > 50) setCurrentImage(p => d > 0 ? (p + 1) % imageCount : (p - 1 + imageCount) % imageCount); }}>
            {Array.from({ length: imageCount }).map((_, i) => (
              <div key={i} className={`absolute inset-0 transition-all duration-500 ${i === currentImage ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}>
                <img src={`https://picsum.photos/seed/p${product.id}-${i}/800/600`} alt={product.title} className="w-full h-full object-cover" />
              </div>
            ))}
            {product.isOffer && product.discount && (
              <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-3 py-1 rounded-lg z-10">-{product.discount}% OFF</span>
            )}
            <div className="absolute top-3 right-3 flex gap-2 z-10">
              <button className="w-10 h-10 rounded-full bg-surface/90 backdrop-blur flex items-center justify-center shadow-sm hover:bg-surface transition-colors">
                <Share2 className="w-5 h-5 text-theme-primary" />
              </button>
              <button onClick={() => setLiked(!liked)} className="w-10 h-10 rounded-full bg-surface/90 backdrop-blur flex items-center justify-center shadow-sm hover:bg-surface transition-colors">
                <Heart className={`w-5 h-5 ${liked ? 'fill-primary text-primary' : 'text-theme-primary'}`} />
              </button>
            </div>
            <button onClick={() => setCurrentImage(p => (p - 1 + imageCount) % imageCount)} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/30 backdrop-blur text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={() => setCurrentImage(p => (p + 1) % imageCount)} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/30 backdrop-blur text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><ChevronRight className="w-4 h-4" /></button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {Array.from({ length: imageCount }).map((_, i) => (
                <button key={i} onClick={() => setCurrentImage(i)} className={`rounded-full transition-all ${i === currentImage ? 'w-6 h-2 bg-primary' : 'w-2 h-2 bg-white/60'}`} />
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            {Array.from({ length: imageCount }).map((_, i) => (
              <button key={i} onClick={() => setCurrentImage(i)} className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${i === currentImage ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                <img src={`https://picsum.photos/seed/p${product.id}-${i}/160/160`} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info + Price */}
        <div>
          <div className="bg-surface border border-theme rounded-xl p-5 mb-4">
            <div className="flex items-center gap-1.5 text-sm text-theme-muted mb-2">
              <MapPin className="w-4 h-4 text-primary" />{product.location}
            </div>
            <h1 className="text-xl md:text-2xl font-semibold text-theme-primary mb-2">{product.title}</h1>
            <div className="flex items-center gap-1 mb-3">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className={`w-4 h-4 ${i <= Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
              ))}
              <span className="text-sm text-theme-muted ml-1">{product.reviews} Reviews</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-theme-primary">{product.price}</span>
              {product.originalPrice && <span className="text-base text-theme-muted line-through">{product.originalPrice}</span>}
              <span className="ml-auto flex items-center gap-1.5 text-xs border border-theme rounded-full px-3 py-1.5 text-theme-secondary">
                <BadgeDollarSign className="w-3.5 h-3.5" />Negotiable
              </span>
            </div>
          </div>

          {/* Desktop action buttons (visible on md+) */}
          <div className="hidden md:flex gap-3 mb-4">
            <button className="w-12 h-12 rounded-xl bg-elevated border border-theme flex items-center justify-center flex-shrink-0 hover:bg-primary/5 transition-colors">
              <ShoppingCart className="w-5 h-5 text-theme-primary" />
            </button>
            <Link href="/contact" className="flex-1 h-12 border border-primary rounded-xl font-semibold text-sm text-primary flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors">
              <Phone className="w-4 h-4" />Call
            </Link>
            <Link href="/contact" className="flex-[2] h-12 bg-primary rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors">
              <MessageCircle className="w-4 h-4" />Message
            </Link>
          </div>

          {/* Seller Information (shown next to image on desktop for quick access) */}
          <div className="bg-surface border border-theme rounded-xl p-5">
            <h2 className="font-semibold text-theme-primary text-base mb-3">Seller Information</h2>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-elevated border border-theme flex items-center justify-center flex-shrink-0">
                <Store className="w-6 h-6 text-theme-muted" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm text-theme-primary">{product.seller?.name}</h3>
                  {product.seller?.verified && (
                    <span className="text-[10px] font-medium text-green-600 bg-green-50 dark:bg-green-500/10 px-1.5 py-0.5 rounded">Verified</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-theme-muted mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-medium text-theme-primary">{product.seller?.rating}</span>
                  <span>• 1.2K followers</span>
                </div>
              </div>
            </div>
            <div className="bg-elevated rounded-xl p-3 grid grid-cols-3 gap-2 mb-3">
              {[
                { icon: Clock, label: 'Responds within', value: '1 hour' },
                { icon: Calendar, label: 'Joined', value: 'Mar 2021' },
                { icon: Package, label: 'Listings', value: '45' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <stat.icon className="w-4 h-4 text-theme-muted mx-auto mb-1" />
                  <p className="text-[10px] text-theme-muted">{stat.label}</p>
                  <p className="text-xs font-semibold text-theme-primary">{stat.value}</p>
                </div>
              ))}
            </div>
            <button className="w-full py-2.5 bg-primary/5 text-primary rounded-xl text-sm font-semibold hover:bg-primary/10 transition-colors">
              Visit Seller Store
            </button>
          </div>
        </div>
      </div>

      {/* ===== BELOW: Full-width sections ===== */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        {/* Product Details */}
        <div className="bg-surface border border-theme rounded-xl p-5">
          <h2 className="font-semibold text-theme-primary text-lg mb-3">Product Details</h2>
          <h3 className="font-semibold text-theme-primary text-sm mb-2">Description</h3>
          <p className="text-sm text-theme-secondary leading-relaxed mb-4">{product.description || 'No description available for this product.'}</p>
          <h3 className="font-semibold text-theme-primary text-sm mb-2">Specifications</h3>
          <div className="divide-y divide-theme">
            {specs.map((spec, i) => (
              <div key={i} className="flex items-center py-2.5">
                <div className="w-1 h-5 bg-theme-muted/30 rounded mr-3" />
                <span className="text-sm text-theme-muted w-28 flex-shrink-0">{spec.label}</span>
                <span className="text-sm text-theme-primary">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Tips + Actions */}
        <div className="space-y-4">
          <div className="bg-surface border border-theme rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-theme-primary">Safety Tips</h2>
            </div>
            <ul className="space-y-2 text-sm text-theme-secondary">
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />Meet in a public place for transactions</li>
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />Check the item before you pay</li>
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />Pay only after collecting the item</li>
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />Never send money in advance</li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button className="py-2.5 border border-primary rounded-xl text-sm font-medium text-primary hover:bg-primary/5 transition-colors">Review Product</button>
            <button className="py-2.5 border border-theme rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/5 transition-colors flex items-center justify-center gap-1.5"><Flag className="w-3.5 h-3.5" />Report</button>
          </div>
          <Link href="/sell" className="block w-full py-2.5 border border-primary rounded-xl text-sm font-medium text-primary text-center hover:bg-primary/5 transition-colors">Post an Ad like this</Link>
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-surface border border-theme rounded-xl p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-theme-primary text-lg">Reviews ({reviews.length * 10})</h2>
          <button className="text-sm text-primary font-medium flex items-center gap-0.5 hover:underline">See all reviews <ChevronRight className="w-3.5 h-3.5" /></button>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          {reviews.map((r, i) => (
            <div key={i} className="bg-elevated rounded-xl p-4">
              <div className="flex items-start gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-semibold text-primary text-sm">{r.name[0]}</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-theme-primary">{r.name}</p>
                  <div className="flex items-center gap-1.5">
                    <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} className={`w-3 h-3 ${s <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />)}</div>
                    <span className="text-[11px] text-theme-muted">{r.date}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-theme-secondary leading-relaxed">{r.text}</p>
              <div className="flex items-center justify-end gap-3 mt-2">
                <span className="text-[11px] text-theme-muted">Helpful?</span>
                <button className="flex items-center gap-1 text-theme-muted hover:text-primary text-[11px]"><ThumbsUp className="w-3.5 h-3.5" />(24)</button>
                <button className="flex items-center gap-1 text-theme-muted hover:text-primary text-[11px]"><ThumbsDown className="w-3.5 h-3.5" />(0)</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-theme-primary">Similar Products</h2>
            <Link href={`/shop?category=${product.category}`} className="text-xs text-primary font-medium flex items-center gap-0.5 hover:underline">
              See all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1 -mx-4 px-4 md:-mx-6 md:px-6 scroll-smooth">
            {similarProducts.map((p) => (
              <div key={p.id} className="w-[180px] md:w-[220px] flex-shrink-0">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>

    {/* Mobile Sticky Bottom Bar */}
    <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-theme z-40 md:hidden">
      <div className="flex items-center gap-2 px-4 py-3">
        <button className="w-12 h-12 rounded-xl bg-elevated border border-theme flex items-center justify-center flex-shrink-0 hover:bg-primary/5 transition-colors">
          <ShoppingCart className="w-5 h-5 text-theme-primary" />
        </button>
        <Link href="/contact" className="flex-1 h-12 border border-primary rounded-xl font-semibold text-sm text-primary flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors">
          <Phone className="w-4 h-4" />Call
        </Link>
        <Link href="/contact" className="flex-[2] h-12 bg-primary rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors">
          <MessageCircle className="w-4 h-4" />Message
        </Link>
      </div>
    </div>
    </>
  );
}
