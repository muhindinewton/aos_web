import Link from 'next/link';
import { Home, Search, ShoppingBag } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="relative">
        <p className="text-[120px] md:text-[160px] font-black text-primary leading-none tracking-tighter select-none">
          404
        </p>
        <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <Search className="w-10 h-10 md:w-12 md:h-12 text-primary" />
          </div>
        </div>
      </div>

      <h1 className="mt-6 text-2xl md:text-3xl font-bold text-theme-primary">
        Page not found
      </h1>
      <p className="mt-2 max-w-md text-sm md:text-base text-theme-muted">
        We couldn&apos;t find the page you were looking for. It may have been moved or removed.
      </p>

      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors"
        >
          <Home className="w-4 h-4" />
          Go to home
        </Link>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-theme bg-surface text-theme-primary text-sm font-semibold hover:bg-elevated transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
          Browse shop
        </Link>
      </div>
    </div>
  );
}
