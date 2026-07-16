'use client';

// My Storefront — mirrors mobile's my_storefront_screen.dart: profile card
// with quick stats and Customize / Preview / Location actions, then the
// seller's product grid.

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, BadgeCheck, User, Heart, Star } from 'lucide-react';
import ProtectedRoute from '../../components/protected-route';
import { useToast } from '../../providers/toast-provider';
import { setShopLocation } from '../../lib/shop-location';

const SHOP_NAME = 'TechHub Kenya';

// Products shown on the storefront — same seed data as mobile.
const PRODUCTS = [
  { id: '2',  title: 'iPhone 14 Pro Max',  location: 'Nairobi, Kenya', price: 'Ksh. 145,000', rating: 5.0, reviews: '1.4K', isFavorite: true },
  { id: '5',  title: 'Samsung Galaxy S23', location: 'Mombasa, Kenya', price: 'Ksh. 98,000',  rating: 4.5, reviews: '980',  isFavorite: false },
  { id: '6',  title: 'MacBook Pro M2',     location: 'Nairobi, Kenya', price: 'Ksh. 185,000', rating: 5.0, reviews: '1.2K', isFavorite: false },
  { id: '8',  title: 'iPad Air 5th Gen',   location: 'Kisumu, Kenya',  price: 'Ksh. 75,000',  rating: 4.5, reviews: '640',  isFavorite: false },
  { id: '9',  title: 'AirPods Pro 2',      location: 'Nairobi, Kenya', price: 'Ksh. 32,000',  rating: 5.0, reviews: '2.1K', isFavorite: true },
  { id: '10', title: 'Sony WH-1000XM5',    location: 'Nakuru, Kenya',  price: 'Ksh. 42,000',  rating: 4.5, reviews: '410',  isFavorite: false },
];

function MyStorefrontPage() {
  const router = useRouter();
  const { showToast } = useToast();

  // Pins the shop to the seller's current position (mobile opens a map
  // picker; on web we use the browser's geolocation).
  const pinShopLocation = () => {
    if (!navigator.geolocation) {
      showToast('Location is not available in this browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        setShopLocation({
          shopName: SHOP_NAME,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          address: 'Pinned from my current location',
        });
        showToast('Shop location updated');
      },
      () => showToast('Could not get your location — check permissions'),
      { timeout: 8000 },
    );
  };

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-4 pb-24 lg:pb-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-xl bg-surface shadow-[0_2px_10px_rgba(0,0,0,0.07)] flex items-center justify-center text-theme-primary hover:bg-elevated transition-colors"
          aria-label="Back"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold text-theme-primary">
          My Storefront
        </h1>
        <div className="w-10" />
      </div>

      {/* Profile Card */}
      <div className="bg-surface border border-theme rounded-2xl p-5 mb-6 shadow-soft">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-4">
          <div className="p-0.5 rounded-full bg-gradient-to-br from-primary to-red-400 mb-3">
            <div className="w-20 h-20 rounded-full bg-elevated border-2 border-surface flex items-center justify-center">
              <User className="w-9 h-9 text-theme-muted" fill="currentColor" />
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-bold text-theme-primary">{SHOP_NAME}</span>
            <BadgeCheck className="w-5 h-5 text-white fill-sky-500" />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center bg-elevated rounded-xl py-3 px-4 mb-4">
          <QuickStat value="30K" label="Views" />
          <div className="w-px h-8 bg-theme mx-auto" />
          <QuickStat value="2.8K" label="Likes" />
          <div className="w-px h-8 bg-theme mx-auto" />
          <QuickStat value="1.2K" label="Followers" />
        </div>

        {/* Action Buttons — Customize · Preview · Location, like mobile */}
        <div className="flex gap-3">
          <Link
            href="/account/storefront/customize"
            className="flex-1 py-2.5 rounded-xl bg-elevated border border-theme text-theme-primary text-sm font-semibold text-center hover:bg-primary/5 transition-colors"
          >
            Customize
          </Link>
          <Link
            href="/seller/1"
            className="flex-1 py-2.5 rounded-xl bg-elevated border border-theme text-theme-primary text-sm font-semibold text-center hover:bg-primary/5 transition-colors"
          >
            Preview
          </Link>
          <button
            onClick={pinShopLocation}
            className="flex-1 py-2.5 rounded-xl bg-elevated border border-theme text-theme-primary text-sm font-semibold hover:bg-primary/5 transition-colors"
          >
            Location
          </button>
        </div>
      </div>

      {/* Products */}
      <h2 className="text-lg font-bold text-theme-primary mb-3">
        Products ({PRODUCTS.length})
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {PRODUCTS.map(p => (
          <Link
            key={p.id}
            href={`/product/${p.id}`}
            className="bg-surface rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] overflow-hidden"
          >
            {/* Image with wishlist heart */}
            <div className="relative h-[140px] bg-elevated">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://picsum.photos/seed/${encodeURIComponent(p.title)}/400/280`}
                alt={p.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 right-2 w-8 h-8 rounded-full bg-surface shadow flex items-center justify-center">
                <Heart
                  className={`w-[18px] h-[18px] ${p.isFavorite ? 'text-primary' : 'text-theme-muted'}`}
                  fill={p.isFavorite ? 'currentColor' : 'none'}
                />
              </span>
            </div>

            {/* Details */}
            <div className="p-3">
              <p className="text-[15px] font-bold text-theme-primary truncate">{p.title}</p>
              <p className="text-[13px] text-theme-secondary truncate mt-0.5">{p.location}</p>
              <p className="text-[15px] font-bold text-theme-primary mt-1.5">{p.price}</p>
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
    </div>
  );
}

function QuickStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex-1 text-center">
      <p className="text-base font-bold text-theme-primary">{value}</p>
      <p className="text-xs text-theme-muted">{label}</p>
    </div>
  );
}

export default function MyStorefrontPageWrapper() {
  return <ProtectedRoute><MyStorefrontPage /></ProtectedRoute>;
}
