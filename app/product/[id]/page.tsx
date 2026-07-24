'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  BadgeDollarSign,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flag,
  Heart,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Share2,
  Shield,
  Star,
  Store,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
  Navigation,
} from 'lucide-react';
import { products, services } from '../../lib/data';
import { ProductCard } from '../../components/product-card';
import { useHasContactedSeller } from '../../lib/contacted-sellers';
import { getProductShopLocation, osmEmbedUrl, type ShopLocation } from '../../lib/shop-location';

const reviews = [
  {
    name: 'Grace Wanjiku',
    date: 'Jan 22, 2026',
    text: 'Amazing product. Exactly as described, and the seller was very responsive throughout.',
    rating: 5,
  },
  {
    name: 'James Kamau',
    date: 'Jan 20, 2026',
    text: 'Good quality item. There were a few small marks, but overall it still felt like a solid deal.',
    rating: 4,
  },
  {
    name: 'Mercy Njeri',
    date: 'Jan 15, 2026',
    text: 'Exactly what I was looking for. Clean condition, fair price, and easy communication with the seller.',
    rating: 5,
  },
];

const safetyTips = [
  'Meet in a public place for transactions',
  'Inspect the item fully before making payment',
  'Pay only after collecting the item',
  'Avoid sending money in advance',
];

function StarRating({ rating, size = 4 }: { rating: number; size?: number }) {
  const iconSize =
    size === 3 ? 'h-3 w-3' : size === 5 ? 'h-5 w-5' : size === 6 ? 'h-6 w-6' : 'h-4 w-4';

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          className={`${iconSize} ${
            value <= Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'
          }`}
        />
      ))}
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = Array.isArray(params.id) ? params.id[0] : params.id;
  // Services live in their own array; the detail route serves both, so a service
  // link like /product/s2 resolves to the real service instead of falling back
  // to the first product.
  const product =
    products.find((item) => item.id === productId) ||
    services.find((item) => item.id === productId) ||
    products[0];
  const seller = product.seller ?? {
    id: 'fallback-seller',
    name: 'Trusted Seller',
    avatar: 'T',
    rating: 4.7,
    verified: false,
  };
  const reviewText = typeof product.reviews === 'string' ? product.reviews : String(product.reviews ?? '0');
  const hasContactedSeller = useHasContactedSeller(seller.id);

  const [liked, setLiked] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [shopLocation, setShopLocation] = useState<ShopLocation | null>(null);
  const touchStartX = useRef<number | null>(null);
  const imageCount = 4;

  useEffect(() => {
    setShopLocation(getProductShopLocation(product));
  }, [product]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((value) => (value + 1) % imageCount);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const similarProducts = useMemo(
    () => [...products, ...services]
      .filter((item) => item.category === product.category && item.id !== product.id)
      .slice(0, 6),
    [product.category, product.id],
  );

  const specs = [
    { label: 'Category', value: product.category },
    { label: 'Condition', value: product.isOffer ? 'Like New' : 'Used' },
    { label: 'Location', value: product.location },
    { label: 'Rating', value: `${product.rating} / 5` },
    { label: 'Availability', value: product.isOffer ? 'In Stock' : 'Limited Stock' },
  ];

  const sellerStats = [
    { icon: Clock, label: 'Response time', value: 'Within 1 hour' },
    { icon: Calendar, label: 'Joined', value: 'Mar 2021' },
    { icon: Package, label: 'Active listings', value: '45' },
  ];

  const reviewCount = Number.parseFloat(reviewText.replace(/[^\d.]/g, '')) || product.rating * 100;

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-5 pb-36 md:px-6 md:py-8 lg:pb-8">
        <Link
          href="/shop"
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-theme bg-surface px-4 py-2 text-sm font-medium text-theme-secondary transition-colors hover:border-primary/30 hover:text-primary"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Shop
        </Link>

        <section className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)] lg:items-start">
          <div className="min-w-0 space-y-4">
            <div
              className="group relative overflow-hidden rounded-[2rem] border border-theme bg-surface shadow-soft"
              onTouchStart={(event) => {
                touchStartX.current = event.touches[0].clientX;
              }}
              onTouchEnd={(event) => {
                if (touchStartX.current === null) return;
                const delta = touchStartX.current - event.changedTouches[0].clientX;
                if (Math.abs(delta) > 50) {
                  setCurrentImage((value) => (delta > 0 ? (value + 1) % imageCount : (value - 1 + imageCount) % imageCount));
                }
                touchStartX.current = null;
              }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.15),transparent_40%)]" />
              <div className="relative aspect-[4/3] overflow-hidden bg-elevated">
                {Array.from({ length: imageCount }).map((_, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-500 ${
                      index === currentImage ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
                    }`}
                  >
                    <img
                      src={`https://picsum.photos/seed/p${product.id}-${index}/1200/900`}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}

                <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
                  <div className="flex flex-wrap gap-2">
                    {product.isOffer && product.discount ? (
                      <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white shadow-lg">
                        Save {product.discount}%
                      </span>
                    ) : null}
                    <span className="rounded-full border border-white/20 bg-black/35 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                      {product.category}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white backdrop-blur-md transition-colors hover:bg-black/50"
                      aria-label="Share product"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setLiked((value) => !value)}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white backdrop-blur-md transition-colors hover:bg-black/50"
                      aria-label="Add to wishlist"
                    >
                      <Heart className={`h-5 w-5 ${liked ? 'fill-primary text-primary' : ''}`} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentImage((value) => (value - 1 + imageCount) % imageCount)}
                  className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white backdrop-blur-md transition-opacity hover:bg-black/50 group-hover:flex"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setCurrentImage((value) => (value + 1) % imageCount)}
                  className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white backdrop-blur-md transition-opacity hover:bg-black/50 group-hover:flex"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                {/* Bottom gradient for dots visibility */}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 z-10">
                  {Array.from({ length: imageCount }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`rounded-full transition-all ${
                        index === currentImage ? 'h-2 w-7 bg-white' : 'h-2 w-2 bg-white/55 hover:bg-white/80'
                      }`}
                      aria-label={`Show image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: imageCount }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`overflow-hidden rounded-2xl border bg-surface transition-all ${
                    index === currentImage
                      ? 'border-primary shadow-[0_10px_30px_rgba(193,18,31,0.18)]'
                      : 'border-theme opacity-75 hover:opacity-100'
                  }`}
                >
                  <img
                    src={`https://picsum.photos/seed/p${product.id}-${index}/240/240`}
                    alt={`${product.title} preview ${index + 1}`}
                    className="aspect-square h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="min-w-0 space-y-4 lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-[2rem] border border-theme bg-surface shadow-soft">
              <div className="border-b border-theme bg-[linear-gradient(135deg,rgba(193,18,31,0.08),rgba(193,18,31,0),rgba(193,18,31,0.04))] p-6">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Trusted listing</span>
                  <span className="rounded-full border border-theme px-3 py-1 text-xs font-medium text-theme-secondary">
                    {product.offerExpiry ? `${product.offerExpiry} days left` : 'Freshly listed'}
                  </span>
                </div>

                {/* Product Title & Location */}
                <h1 className="text-xl md:text-2xl font-bold text-theme-primary leading-tight">{product.title}</h1>
                <p className="flex items-center gap-1.5 text-sm text-theme-secondary mt-1 mb-3">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  {product.location}
                </p>

                <div className="flex items-center gap-2 mb-3">
                  <StarRating rating={product.rating} />
                  <span className="text-sm text-theme-secondary">{product.rating} rating · {reviewText} reviews</span>
                </div>

                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <p className="text-3xl font-black tracking-tight text-theme-primary">{product.price}</p>
                  {product.originalPrice ? (
                    <p className="text-base text-theme-muted line-through">{product.originalPrice}</p>
                  ) : null}
                </div>

                <div className="rounded-2xl border border-theme bg-surface px-4 py-3 text-sm text-theme-secondary shadow-sm">
                  <p className="flex items-center gap-2">
                    <BadgeDollarSign className="h-4 w-4 text-primary" />
                    Negotiable price
                  </p>
                  <p className="mt-1 text-xs text-theme-muted">Message the seller to discuss and agree on a final price.</p>
                </div>
              </div>

              <div className="grid gap-3 p-6">
                <div className="grid grid-cols-[auto_1fr] gap-3 rounded-2xl border border-theme bg-elevated p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-theme-primary">High buyer interest</p>
                    <p className="mt-1 text-sm text-theme-secondary">
                      This listing is getting strong engagement in the {product.category.toLowerCase()} category.
                    </p>
                  </div>
                </div>

                <div className="hidden gap-3 md:grid md:grid-cols-2">
                  <Link
                    href={`/call/${seller.id}`}
                    className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-primary text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
                  >
                    <Phone className="h-4 w-4" />
                    Call Seller
                  </Link>
                  <Link
                    href={`/chat/${seller.id}`}
                    className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Send Message
                  </Link>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-theme bg-surface shadow-soft">
              <div className="border-b border-theme p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Store className="h-7 w-7" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-bold text-theme-primary">{seller.name}</h2>
                      {seller.verified ? (
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                          Verified
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-theme-secondary">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="font-medium text-theme-primary">{seller.rating}</span>
                      <span>1.2K followers</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 p-6 sm:gap-3">
                {sellerStats.map((stat) => (
                  <div key={stat.label} className="min-w-0 rounded-2xl bg-elevated px-2 py-4 text-center sm:px-3">
                    <stat.icon className="mx-auto h-4 w-4 text-theme-muted" />
                    <p className="mt-2 break-words text-[11px] uppercase tracking-[0.12em] text-theme-muted">{stat.label}</p>
                    <p className="mt-1 text-sm font-semibold text-theme-primary">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-theme p-6 pt-0">
                <Link
                  href={`/seller/${seller.id}`}
                  className="mt-6 block w-full rounded-2xl bg-primary/10 px-4 py-3 text-center text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
                >
                  Visit Seller Store
                </Link>
              </div>
            </div>

            {shopLocation && (
              <div className="overflow-hidden rounded-[2rem] border border-theme bg-surface shadow-soft">
                <div className="flex items-center gap-2 p-6 pb-4">
                  <Store className="h-[18px] w-[18px] text-primary" />
                  <h2 className="text-[15px] font-bold text-theme-primary">Shop location</h2>
                </div>
                {/* Static map preview — tap to open the full, followable map. */}
                <Link href={`/map/${encodeURIComponent(shopLocation.shopName)}`} className="block relative">
                  <iframe
                    title={`Map preview of ${shopLocation.shopName}`}
                    src={osmEmbedUrl(shopLocation.lat, shopLocation.lng, 0.02)}
                    className="w-full h-[150px] border-0 pointer-events-none"
                    loading="lazy"
                  />
                  <span className="absolute inset-0" aria-hidden />
                </Link>
                <div className="flex items-center gap-3 p-6 pt-4">
                  <MapPin className="h-4 w-4 text-theme-muted flex-shrink-0" />
                  <p className="flex-1 text-sm text-theme-secondary truncate">{shopLocation.address}</p>
                  <Link
                    href={`/map/${encodeURIComponent(shopLocation.shopName)}`}
                    className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-hover"
                  >
                    <Navigation className="h-3.5 w-3.5" />
                    View map
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <div className="min-w-0 rounded-[2rem] border border-theme bg-surface p-6 shadow-soft">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-theme-primary">Product Details</h2>
                <p className="text-sm text-theme-secondary">Everything buyers usually check before making a decision.</p>
              </div>
            </div>

            <div className="rounded-2xl bg-elevated p-5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-theme-muted">Description</h3>
              <p className="mt-3 text-sm leading-7 text-theme-secondary">
                {product.description || 'No description available for this product.'}
              </p>
            </div>

            <div className="mt-4 rounded-2xl border border-theme">
              {specs.map((spec, index) => (
                <div
                  key={spec.label}
                  className={`grid gap-2 px-5 py-4 sm:grid-cols-[140px_1fr] ${
                    index !== specs.length - 1 ? 'border-b border-theme' : ''
                  }`}
                >
                  <p className="text-sm font-medium text-theme-muted">{spec.label}</p>
                  <p className="text-sm font-semibold text-theme-primary">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[2rem] border border-theme bg-surface p-6 shadow-soft">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-theme-primary">Safety Tips</h2>
                  <p className="text-sm text-theme-secondary">Stay protected while you buy, inspect, and pay.</p>
                </div>
              </div>

              <div className="space-y-3">
                {safetyTips.map((tip) => (
                  <div key={tip} className="flex items-start gap-3 rounded-2xl bg-elevated px-4 py-3">
                    <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-primary" />
                    <p className="text-sm leading-6 text-theme-secondary">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-theme bg-surface p-6 shadow-soft">
              <h2 className="text-xl font-bold text-theme-primary">Quick Actions</h2>
              <p className="mt-1 text-sm text-theme-secondary">
                {hasContactedSeller
                  ? 'Leave feedback, flag issues, or create a similar listing.'
                  : 'Flag issues with this listing, or contact the seller above to unlock reviews.'}
              </p>

              <div className={`mt-5 grid gap-3 ${hasContactedSeller ? 'sm:grid-cols-2' : ''}`}>
                {hasContactedSeller && (
                  <Link
                    href={`/reviews/${product.id}/write`}
                    className="block text-center rounded-2xl border border-primary px-4 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
                  >
                    Review Product
                  </Link>
                )}
                <Link
                  href={`/product/${product.id}/report`}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-theme px-4 py-3 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/5"
                >
                  <Flag className="h-4 w-4" />
                  Report Listing
                </Link>
              </div>

              <Link
                href="/sell"
                className="mt-3 block rounded-2xl bg-primary px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                Post an Ad Like This
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-theme bg-surface p-6 shadow-soft">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-theme-primary">Buyer Reviews</h2>
              <p className="text-sm text-theme-secondary">
                Based on about {Math.round(reviewCount)} recent interactions for similar listings.
              </p>
            </div>
            <Link
              href={`/reviews/${product.id}`}
              className="rounded-full border border-theme px-4 py-2 text-sm font-medium text-primary transition-colors hover:border-primary/30 hover:bg-primary/5"
            >
              See all reviews
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {reviews.map((review) => (
              <div key={review.name} className="rounded-[1.5rem] bg-elevated p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {review.name[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-theme-primary">{review.name}</p>
                      <span className="text-xs text-theme-muted">{review.date}</span>
                    </div>
                    <div className="mt-2">
                      <StarRating rating={review.rating} size={3} />
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-7 text-theme-secondary">{review.text}</p>

                <div className="mt-4 flex items-center justify-end gap-4 text-xs text-theme-muted">
                  <button className="flex items-center gap-1 transition-colors hover:text-primary">
                    <ThumbsUp className="h-3.5 w-3.5" />
                    24
                  </button>
                  <button className="flex items-center gap-1 transition-colors hover:text-primary">
                    <ThumbsDown className="h-3.5 w-3.5" />
                    0
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {similarProducts.length > 0 ? (
          <section className="mt-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-theme-primary">Similar Products</h2>
                <p className="text-sm text-theme-secondary">More options from the same category you might also like.</p>
              </div>
              <Link
                href={`/shop?category=${product.category}`}
                className="rounded-full border border-theme px-4 py-2 text-sm font-medium text-primary transition-colors hover:border-primary/30 hover:bg-primary/5"
              >
                See all
              </Link>
            </div>

            <div className="flex gap-3 overflow-x-auto px-1 pb-1 hide-scrollbar">
              {similarProducts.map((item) => (
                <div key={item.id} className="w-[180px] flex-shrink-0 md:w-[220px]">
                  <ProductCard product={item} />
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <div className="fixed bottom-16 left-0 right-0 z-40 border-t border-theme bg-surface backdrop-blur lg:hidden">
        <div className="flex items-center gap-2 px-4 py-3">
          <Link
            href={`/chat/${seller.id}?call=1`}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-primary text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
          >
            <Phone className="h-4 w-4" />
            Call
          </Link>
          <Link
            href={`/chat/${seller.id}`}
            className="flex h-12 flex-[1.25] items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            <MessageCircle className="h-4 w-4" />
            Message
          </Link>
        </div>
      </div>
    </>
  );
}
