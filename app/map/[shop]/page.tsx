'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Navigation, LocateFixed, Store } from 'lucide-react';
import {
  getShopLocation, distanceKm, osmEmbedUrl, directionsUrl,
} from '../../lib/shop-location';

export default function ShopLocationMapPage() {
  const params = useParams();
  const router = useRouter();
  const shopName = decodeURIComponent(
    typeof params.shop === 'string' ? params.shop : Array.isArray(params.shop) ? params.shop[0] : '',
  );
  const shop = getShopLocation(shopName);

  const [me, setMe] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) { setLocating(false); return; }
    navigator.geolocation.getCurrentPosition(
      pos => {
        setMe({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 8000 },
    );
  }, []);

  if (!shop) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <MapPin className="w-12 h-12 text-theme-muted mx-auto" />
        <h1 className="mt-4 text-lg font-semibold text-theme-primary">No location set</h1>
        <p className="mt-1 text-sm text-theme-muted">
          {shopName || 'This shop'} hasn&apos;t added a location pin yet.
        </p>
        <button
          onClick={() => router.back()}
          className="mt-6 px-6 py-2.5 rounded-full bg-primary text-white text-sm font-semibold"
        >
          Go back
        </button>
      </div>
    );
  }

  const dist = me ? distanceKm(me.lat, me.lng, shop.lat, shop.lng) : null;

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100dvh-80px)] lg:h-[calc(100dvh-112px)]">
      {/* App bar */}
      <div className="bg-surface border-b border-theme px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-surface border border-theme flex items-center justify-center hover:bg-elevated transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-[18px] h-[18px] text-theme-primary" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-semibold text-theme-primary truncate">{shop.shopName}</h1>
          <p className="text-xs text-theme-muted truncate">{shop.address}</p>
        </div>
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold whitespace-nowrap">
          <LocateFixed className="w-3.5 h-3.5" />
          {locating ? 'Locating…' : dist !== null ? `${dist.toFixed(1)} km away` : 'Location off'}
        </span>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <iframe
          title={`Map of ${shop.shopName}`}
          src={osmEmbedUrl(shop.lat, shop.lng)}
          className="absolute inset-0 w-full h-full border-0"
          loading="lazy"
        />
      </div>

      {/* Bottom card */}
      <div className="bg-surface border-t border-theme p-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Store className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-theme-primary truncate">{shop.shopName}</p>
            <p className="text-xs text-theme-muted truncate">{shop.address}</p>
          </div>
          <a
            href={directionsUrl(shop.lat, shop.lng)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors"
          >
            <Navigation className="w-4 h-4" />
            Directions
          </a>
        </div>
      </div>
    </div>
  );
}
