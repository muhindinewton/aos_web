'use client';

import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

// Slim app-wide banner shown whenever the browser loses connectivity, so
// every page gets an offline signal without wiring it individually.
export function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    setOffline(!navigator.onLine);
    const onDown = () => setOffline(true);
    const onUp = () => setOffline(false);
    window.addEventListener('offline', onDown);
    window.addEventListener('online', onUp);
    return () => {
      window.removeEventListener('offline', onDown);
      window.removeEventListener('online', onUp);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="sticky top-0 z-[90] bg-[#1E1E1E] text-white text-xs font-medium px-4 py-2 flex items-center justify-center gap-2">
      <WifiOff className="w-3.5 h-3.5" />
      You&apos;re offline — some things may not work until you reconnect.
    </div>
  );
}
