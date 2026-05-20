'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ChevronRight, Zap, Car, Smartphone, Monitor, Sofa, Shirt, Sparkles, Wrench, Home as HomeIcon, Baby, Cat, ChevronLeft, Flame, Award, Package, Gift, ArrowRight, Grid3X3, Compass, Play, Radio, Eye, Activity, Leaf, Hammer, Briefcase, Users, UtensilsCrossed, Music, BookOpen, Gamepad2, Plane, HeartPulse, TrendingUp, Palette, ChevronsDown, Truck, ShieldCheck } from 'lucide-react';
import { products, categories, services, promoTips } from './lib/data';
import { ProductCard } from './components/product-card';

const categoryIcons: Record<string, React.ElementType> = {
  Vehicles: Car, Property: HomeIcon, Phones: Smartphone, Electronics: Monitor,
  Furniture: Sofa, Fashion: Shirt, Beauty: Sparkles, Services: Wrench, Kids: Baby, Pets: Cat,
};

const feedItems = [
  { id: '1',  type: 'live',  creator: 'TechDeals_KE',   avatar: 'T', viewers: 1247,  title: 'Flash Sale Electronics!' },
  { id: '2',  type: 'short', creator: 'SneakerHead',     avatar: 'S', views: 23500,   title: 'New Jordan 1s 🔥' },
  { id: '3',  type: 'short', creator: 'FashionHub',      avatar: 'F', views: 15200,   title: 'Summer collection' },
  { id: '4',  type: 'live',  creator: 'BeautyQueen',     avatar: 'B', viewers: 892,   title: 'Skincare routine live' },
  { id: '5',  type: 'short', creator: 'HomeDecor254',    avatar: 'H', views: 5600,    title: 'Room makeover on a budget' },
  { id: '6',  type: 'short', creator: 'GadgetGuru',      avatar: 'G', views: 8900,    title: 'iPhone 15 Pro review' },
  { id: '7',  type: 'live',  creator: 'NairobiFashion',  avatar: 'N', viewers: 3410,  title: 'New arrivals try-on haul' },
  { id: '8',  type: 'short', creator: 'KitchenVibes',    avatar: 'K', views: 41200,   title: 'Best blender for 2025 🍳' },
  { id: '9',  type: 'live',  creator: 'CarMart_KE',      avatar: 'C', viewers: 678,   title: 'Toyota Prado walkthrough' },
  { id: '10', type: 'short', creator: 'FitnessPro',      avatar: 'P', views: 19800,   title: 'Home gym setup under 5k' },
  { id: '11', type: 'short', creator: 'StyleByAmos',     avatar: 'A', views: 32100,   title: 'Outfit of the week 💃' },
  { id: '12', type: 'live',  creator: 'ElectroBazaar',   avatar: 'E', viewers: 2150,  title: 'Samsung Galaxy S25 unboxing' },
  { id: '13', type: 'short', creator: 'PetCorner_KE',    avatar: 'P', views: 7400,    title: 'Cute puppy products 🐶' },
  { id: '14', type: 'live',  creator: 'MommaShop',       avatar: 'M', viewers: 540,   title: 'Baby essentials flash sale' },
  { id: '15', type: 'short', creator: 'DecorByLucy',     avatar: 'D', views: 12300,   title: 'Affordable living room glow-up' },
  { id: '16', type: 'short', creator: 'TravelKenya',     avatar: 'T', views: 28700,   title: 'Safari packages you NEED to see' },
];

function FeedSection() {
  const formatCount = (n: number) => n >= 1000 ? `${(n/1000).toFixed(1)}k` : n.toString();
  
  return (
    <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1 -mx-4 px-4 md:-mx-6 md:px-6">
      {feedItems.map((item) => (
        <Link
          key={item.id}
          href="/feed"
          className="w-[130px] h-[200px] flex-shrink-0 rounded-2xl overflow-hidden relative bg-black group"
        >
          <img
            src={`https://picsum.photos/seed/feed${item.id}/260/400`}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
          
          {item.type === 'live' ? (
            <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 rounded-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              <span className="text-white text-[10px] font-bold">LIVE</span>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 text-black ml-0.5" />
              </div>
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${item.type === 'live' ? 'bg-red-500/80 text-white border border-red-400' : 'bg-white/90 text-black'}`}>
                {item.avatar}
              </div>
              <span className="text-white text-[11px] font-semibold truncate">@{item.creator}</span>
            </div>
            <div className="flex items-center gap-1 text-white/80">
              <Eye className="w-3 h-3" />
              <span className="text-[10px]">
                {item.type === 'live' ? `${formatCount(item.viewers!)} watching` : `${formatCount(item.views!)} views`}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function SectionHeader({ title, href, icon: Icon }: { title: string; href: string; icon?: React.ElementType }) {
  return (
    <div className="flex items-center justify-between mb-3 bg-primary/5 -mx-4 md:-mx-6 px-4 md:px-6 py-2.5 rounded-lg">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-5 h-5 text-primary" />}
        <h2 className="text-base md:text-lg font-bold text-primary">{title}</h2>
      </div>
      <Link href={href} className="text-xs text-primary font-medium flex items-center gap-0.5 hover:underline">
        See all <ChevronRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

function AutoScrollRow({ children, speed = 3000 }: { children: React.ReactNode; speed?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const paused = useRef(false);

  const getCardWidth = useCallback(() => {
    const el = ref.current;
    const first = el?.firstElementChild as HTMLElement | null;
    return first ? first.offsetWidth + 12 : 200; // 12 = gap-3
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const pause = () => { paused.current = true; };
    const resume = () => { setTimeout(() => { paused.current = false; }, 2000); };
    el.addEventListener('pointerdown', pause);
    el.addEventListener('pointerup', resume);
    el.addEventListener('touchstart', pause, { passive: true });
    el.addEventListener('touchend', resume);
    const t = setInterval(() => {
      if (!el || paused.current) return;
      const cw = getCardWidth();
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 2) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: cw, behavior: 'smooth' });
      }
    }, speed);
    return () => { clearInterval(t); el.removeEventListener('pointerdown', pause); el.removeEventListener('pointerup', resume); el.removeEventListener('touchstart', pause); el.removeEventListener('touchend', resume); };
  }, [speed, getCardWidth]);

  const scrollLeft  = () => ref.current?.scrollBy({ left: -getCardWidth(), behavior: 'smooth' });
  const scrollRight = () => ref.current?.scrollBy({ left:  getCardWidth(), behavior: 'smooth' });

  return (
    <div className="relative group">
      <div ref={ref} className="flex gap-3 overflow-x-auto hide-scrollbar pb-1 scroll-smooth snap-x snap-mandatory">
        {children}
      </div>
      <button onClick={scrollLeft} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 shadow-lg -ml-2 md:-ml-4">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={scrollRight} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 shadow-lg -mr-2 md:-mr-4">
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

interface SlideData {
  bg: string;
  title: string;
  subtitle: string;
  description: string;
  badge?: string;
  image?: string;
  Icon?: React.ElementType;
}

function BannerContent({ slide, tall, secondary }: { slide: SlideData; tall?: boolean; secondary?: boolean }) {
  const TitleTag = tall ? 'h2' : 'h3';
  const SlideIcon = slide.Icon;

  return (
    <>
      {/* ── Mobile: compact left-text + right-icon (matches mobile app) ── */}
      <div className="md:hidden relative z-10 h-full flex items-center px-4 py-3">
        <div className="flex-1 min-w-0">
          {slide.badge && (
            <span className="inline-block bg-white text-slate-800 text-[9px] font-extrabold px-2 py-0.5 rounded-md mb-2 uppercase tracking-wide">
              {slide.badge}
            </span>
          )}
          <h2 className="text-white font-black text-[19px] leading-tight">{slide.title}</h2>
          <p className="text-white/90 text-sm font-semibold mt-0.5">{slide.subtitle}</p>
          <p className="text-white/70 text-xs mt-0.5 line-clamp-1">{slide.description}</p>
        </div>
        {SlideIcon && (
          <div className="w-[68px] h-[68px] bg-white/15 rounded-2xl flex items-center justify-center flex-shrink-0 ml-4">
            <SlideIcon className="w-9 h-9 text-white/80" />
          </div>
        )}
      </div>

      {/* ── Desktop SECONDARY: centered text, no glass card ── */}
      {secondary ? (
        <div className="hidden md:flex relative z-10 h-full w-full items-center justify-center px-8">
          <div className="text-white text-center max-w-3xl" style={{ textShadow: '0 1px 12px rgba(0,0,0,0.18)' }}>
            <span className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-[2px] font-bold uppercase tracking-[0.18em] text-white px-3 py-1 text-[10px]">
              {slide.badge || 'Featured'}
            </span>
            <h3 className="mt-3 font-black leading-[0.95] tracking-tight text-white text-2xl md:text-3xl">
              {slide.title}
            </h3>
            <p className="mt-2 font-semibold text-white/95 text-sm md:text-base">{slide.subtitle}</p>
            <p className="mt-1 text-white/80 text-xs md:text-sm">{slide.description}</p>
            <Link
              href="/shop"
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-white font-semibold text-slate-900 transition-all hover:-translate-y-0.5 hover:bg-slate-50 shadow-md px-5 py-2 text-xs md:text-sm"
            >
              Shop Now <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        /* ── Desktop HERO: centered glassmorphism card (unchanged) ── */
        <div className="hidden md:flex relative z-10 h-full w-full items-center justify-center px-4 py-4 md:px-10">
          <div
            className={`w-full text-center text-white backdrop-blur-md ${
              tall
                ? 'max-w-3xl rounded-[2rem] border border-white/15 bg-white/10 px-6 py-7 shadow-[0_24px_80px_rgba(15,23,42,0.28)] md:px-10 md:py-10'
                : 'max-w-xl rounded-[1.75rem] border border-white/15 bg-black/10 px-4 py-4 shadow-[0_18px_50px_rgba(15,23,42,0.24)] md:px-7 md:py-6'
            }`}
          >
            <span className={`inline-flex items-center rounded-full border border-white/20 bg-white/15 font-semibold uppercase tracking-[0.24em] text-white/95 ${
              tall ? 'px-4 py-1.5 text-[10px] md:text-xs' : 'px-3 py-1 text-[9px] md:text-[10px]'
            }`}>
              {slide.badge || 'Featured'}
            </span>
            <TitleTag className={`mt-3 font-black leading-[0.95] tracking-tight text-white ${
              tall ? 'text-3xl md:text-5xl' : 'text-xl md:text-2xl'
            }`}>
              {slide.title}
            </TitleTag>
            <p className={`mt-2 font-semibold text-white/95 ${tall ? 'text-base md:text-xl' : 'text-sm md:text-base'}`}>
              {slide.subtitle}
            </p>
            <p className={`mx-auto mt-2 max-w-2xl text-pretty text-white/75 ${
              tall ? 'text-sm md:text-base' : 'text-xs md:text-sm'
            }`}>
              {slide.description}
            </p>
            <Link href="/shop" className={`mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-white font-semibold text-slate-900 transition-all hover:-translate-y-0.5 hover:bg-slate-50 ${
              tall ? 'px-6 py-3 text-sm md:px-7' : 'px-4 py-2 text-xs md:px-5 md:text-sm'
            }`}>
              Shop Now <ArrowRight className={tall ? 'h-4 w-4' : 'h-3.5 w-3.5'} />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

function Slider({ slides, interval = 4000, tall, fill, secondary }: { slides: SlideData[]; interval?: number; tall?: boolean; fill?: boolean; secondary?: boolean }) {
  const [idx, setIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStart = useRef(0);

  const next = useCallback(() => setIdx(p => (p + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setIdx(p => (p - 1 + slides.length) % slides.length), [slides.length]);
  const go = useCallback((i: number) => setIdx(i), []);

  useEffect(() => {
    timerRef.current = setInterval(next, interval);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [interval, next]);

  const onTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); }
  };

  const dots = (
    <div className="flex justify-center items-center gap-1.5">
      {slides.map((_, i) => (
        <button
          key={i}
          onClick={() => go(i)}
          className={`rounded-full transition-all duration-300 ${
            i === idx ? 'w-5 h-2 bg-primary shadow-sm' : 'w-2 h-2 bg-border hover:bg-theme-muted'
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className={fill ? 'relative h-full' : ''}>
      <div className={`relative ${fill ? 'h-full rounded-none' : tall ? 'h-[175px] md:h-72 lg:h-80 rounded-3xl' : 'h-40 md:h-48 rounded-3xl'} overflow-hidden shadow-elevated group`} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {secondary ? (
          /* Cross-fade stack — secondary banner dissolves between slides */
          slides.map((s, i) => (
            <div
              key={i}
              className="absolute inset-0 transition-opacity duration-700 ease-in-out"
              style={{ background: s.bg, opacity: i === idx ? 1 : 0, pointerEvents: i === idx ? 'auto' : 'none' }}
              aria-hidden={i !== idx}
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15),transparent_50%)]" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
              <BannerContent slide={s} tall={tall} secondary={secondary} />
            </div>
          ))
        ) : (
          /* Sliding track — used by hero banners */
          <div
            className="flex h-full transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${idx * (100 / slides.length)}%)`, width: `${slides.length * 100}%` }}
          >
            {slides.map((s, i) => (
              <div
                key={i}
                className="relative h-full flex-shrink-0"
                style={{ width: `${100 / slides.length}%`, background: s.bg }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15),transparent_50%)]" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
                <BannerContent slide={s} tall={tall} secondary={secondary} />
              </div>
            ))}
          </div>
        )}

        {/* Navigation arrows */}
        <button onClick={prev} className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 dark:bg-black/50 backdrop-blur-sm text-slate-800 dark:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={next} className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 dark:bg-black/50 backdrop-blur-sm text-slate-800 dark:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg">
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots overlaid — fill (desktop sidebar) mode only */}
        {fill && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-black/20 backdrop-blur-sm rounded-full px-2 py-1.5">
            {dots}
          </div>
        )}
      </div>

      {/* Dots below the banner — all non-fill modes */}
      {!fill && <div className="mt-2.5">{dots}</div>}
    </div>
  );
}

const heroSlides: SlideData[] = [
  {
    bg: 'linear-gradient(135deg, #C1121F 0%, #8B0000 40%, #FF4500 100%)',
    badge: '🔥 Flash Sale',
    title: 'Up to 70% Off',
    subtitle: 'Mega Savings Event',
    description: 'Biggest deals of the season — limited time only!',
  },
  {
    bg: 'linear-gradient(135deg, #0F2027 0%, #203A43 40%, #2C5364 100%)',
    badge: '✨ New Arrivals',
    title: 'Latest Collections',
    subtitle: 'Fresh Products Daily',
    description: 'Discover trending items before everyone else',
  },
  {
    bg: 'linear-gradient(135deg, #134E5E 0%, #1A6B3C 50%, #71B280 100%)',
    badge: '✅ Verified Sellers',
    title: 'Buy with Confidence',
    subtitle: 'Trusted & Verified Listings',
    description: 'Every seller is reviewed by real buyers across Africa',
  },
  {
    bg: 'linear-gradient(135deg, #4A0E4E 0%, #7B1FA2 50%, #CE93D8 100%)',
    badge: '⚡ Limited Time',
    title: 'Electronics Week',
    subtitle: 'Tech at Unbeatable Prices',
    description: 'Top brands, lowest prices — shop now!',
  },
];

const secSlides: SlideData[] = [
  {
    bg: 'linear-gradient(135deg, #E65100 0%, #FF8F00 100%)',
    badge: '⏰ Today Only',
    title: 'Deal of the Day',
    subtitle: 'Up to 60% off electronics',
    description: 'Hurry, offer ends at midnight!',
  },
  {
    bg: 'linear-gradient(135deg, #1565C0 0%, #42A5F5 100%)',
    badge: '🏆 Top Sellers',
    title: 'Best Sellers',
    subtitle: 'Most popular this week',
    description: 'Join thousands of happy buyers',
  },
  {
    bg: 'linear-gradient(135deg, #6A1B9A 0%, #AB47BC 100%)',
    badge: '🆕 Just In',
    title: 'New Arrivals',
    subtitle: 'Fresh new products',
    description: 'Be the first to shop the latest',
  },
  {
    bg: 'linear-gradient(135deg, #2E7D32 0%, #66BB6A 100%)',
    badge: '💰 Save Big',
    title: 'Budget Finds',
    subtitle: 'Quality under Ksh 500',
    description: 'Great products, small prices',
  },
];

const centeredHeroSlides: SlideData[] = [
  {
    bg: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)',
    badge: 'NEW',
    title: 'Free Delivery',
    subtitle: 'On Orders Above Ksh 5,000',
    description: 'Limited Time Offer',
    Icon: Truck,
  },
  {
    bg: 'linear-gradient(135deg, #C1121F 0%, #8B0000 40%, #FF4500 100%)',
    badge: 'SALE',
    title: 'Up to 70% Off',
    subtitle: 'Mega Savings Event',
    description: 'Biggest deals of the season — limited time only!',
    Icon: Zap,
  },
  {
    bg: 'linear-gradient(135deg, #134E5E 0%, #1A6B3C 50%, #71B280 100%)',
    badge: 'TRUSTED',
    title: 'Buy with Confidence',
    subtitle: 'Verified Sellers Only',
    description: 'Every seller reviewed by real buyers',
    Icon: ShieldCheck,
  },
  {
    bg: 'linear-gradient(135deg, #4A0E4E 0%, #7B1FA2 50%, #CE93D8 100%)',
    badge: 'HOT',
    title: 'Electronics Week',
    subtitle: 'Tech at Unbeatable Prices',
    description: 'Top brands, lowest prices — shop now!',
    Icon: Monitor,
  },
];

const centeredSecondarySlides: SlideData[] = [
  {
    bg: 'linear-gradient(135deg, #E65100 0%, #FF8F00 100%)',
    badge: 'Today Only',
    title: 'Deal of the Day',
    subtitle: 'Up to 60% off electronics',
    description: 'Hurry, offer ends at midnight!',
  },
  {
    bg: 'linear-gradient(135deg, #1565C0 0%, #42A5F5 100%)',
    badge: 'Top Sellers',
    title: 'Best Sellers',
    subtitle: 'Most popular this week',
    description: 'Join thousands of happy buyers',
  },
  {
    bg: 'linear-gradient(135deg, #6A1B9A 0%, #AB47BC 100%)',
    badge: 'Just In',
    title: 'New Arrivals',
    subtitle: 'Fresh new products',
    description: 'Be the first to shop the latest',
  },
  {
    bg: 'linear-gradient(135deg, #2E7D32 0%, #66BB6A 100%)',
    badge: 'Save Big',
    title: 'Budget Finds',
    subtitle: 'Quality under Ksh 500',
    description: 'Great products, small prices',
  },
];

const SIDEBAR_CATS = [
  { name: 'Phones & Accessories', dataName: 'Phones', Icon: Smartphone,
    subs: ['Mobile Phones', 'Tablets', 'Smart Watches', 'Headphones', 'Power Banks', 'Phone Cases', 'Chargers & Cables', 'Phone Accessories', 'Screen Protectors'] },
  { name: 'Vehicles', dataName: 'Vehicles', Icon: Car,
    subs: ['Cars', 'Motorbikes', 'Trucks & Trailers', 'Buses & Microbuses', 'Vehicle Parts', 'Car Accessories', 'Tyres & Rims', 'Watercraft', 'Heavy Equipment'] },
  { name: 'Property', dataName: null, Icon: HomeIcon,
    subs: ['Houses for Rent', 'Houses for Sale', 'Apartments', 'Land & Plots', 'Office Space', 'Warehouses', 'Commercial', 'Short Stay', 'Event Venues'] },
  { name: 'Electronics', dataName: 'Electronics', Icon: Monitor,
    subs: ['Laptops', 'Computers', 'TV & DVD', 'Audio & Music', 'Video Games', 'Cameras', 'Printers', 'Networking', 'Storage Devices'] },
  { name: 'Home & Furniture', dataName: 'Furniture', Icon: Sofa,
    subs: ['Furniture', 'Home Decor', 'Kitchen', 'Appliances', 'Bedding', 'Garden', 'Lighting', 'Storage', 'Bathroom'] },
  { name: 'Fashion', dataName: 'Fashion', Icon: Shirt,
    subs: ["Men's Wear", "Women's Wear", "Men's Shoes", "Women's Shoes", 'Bags', 'Watches', 'Jewelry', 'Kids Wear', 'Accessories'] },
  { name: 'Beauty & Health', dataName: 'Beauty', Icon: Sparkles,
    subs: ['Makeup', 'Skin Care', 'Hair Care', 'Fragrances', 'Personal Care', 'Vitamins', 'Medical', 'Fitness', 'Health'] },
  { name: 'Services', dataName: 'Services', Icon: Wrench,
    subs: ['Automotive', 'IT Services', 'Cleaning', 'Events', 'Moving', 'Tours', 'Education', 'Business', 'Beauty Services'] },
  { name: 'Sports & Leisure', dataName: null, Icon: Activity,
    subs: ['Sports Gear', 'Gym Equipment', 'Instruments', 'Books', 'Bicycles', 'Camping', 'Toys', 'Art', 'Collectibles'] },
  { name: 'Babies & Kids', dataName: null, Icon: Baby,
    subs: ['Baby Clothing', 'Kids Clothing', 'Strollers', 'Toys', 'Baby Gear', 'Feeding', 'Bathing', 'Baby Shoes', 'Maternity'] },
  { name: 'Agriculture', dataName: null, Icon: Leaf,
    subs: ['Farm Machinery', 'Livestock', 'Seeds', 'Crops', 'Poultry', 'Fish', 'Farm Tools', 'Fertilizers', 'Irrigation'] },
  { name: 'Pets', dataName: null, Icon: Cat,
    subs: ['Dogs', 'Cats', 'Birds', 'Fish', 'Pet Food', 'Pet Accessories', 'Grooming', 'Cages', 'Reptiles'] },
  { name: 'Repair & Hardware', dataName: null, Icon: Hammer,
    subs: ['Building Materials', 'Plumbing', 'Electrical', 'Hand Tools', 'Power Tools', 'Roofing', 'Flooring', 'Painting', 'Hardware'] },
  { name: 'Commercial & Office', dataName: null, Icon: Briefcase,
    subs: ['Manufacturing', 'Restaurant Equipment', 'Store Equipment', 'Office Furniture', 'Medical Equipment', 'Salon Equipment', 'Printing', 'Stationery', 'Packaging'] },
  { name: 'Jobs', dataName: null, Icon: Users,
    subs: ['Accounting', 'Admin & Secretarial', 'Engineering', 'Healthcare', 'IT & Tech', 'Marketing', 'Sales', 'Teaching', 'Hospitality'] },
  { name: 'Food & Beverages', dataName: null, Icon: UtensilsCrossed,
    subs: ['Groceries', 'Fresh Produce', 'Snacks & Confectionery', 'Beverages', 'Dairy & Eggs', 'Bakery', 'Meat & Poultry', 'Frozen Foods', 'Organic & Natural'] },
  { name: 'Music & Instruments', dataName: null, Icon: Music,
    subs: ['Guitars', 'Keyboards & Pianos', 'Drums & Percussion', 'Wind Instruments', 'DJ Equipment', 'Studio Equipment', 'Microphones', 'Amplifiers', 'Music Accessories'] },
  { name: 'Books & Stationery', dataName: null, Icon: BookOpen,
    subs: ['Textbooks', 'Fiction & Literature', 'Business & Finance', 'Children Books', 'Magazines', 'Pens & Pencils', 'Notebooks', 'Art Supplies', 'Office Stationery'] },
  { name: 'Gaming', dataName: null, Icon: Gamepad2,
    subs: ['Video Games', 'Gaming Consoles', 'Controllers & Joysticks', 'Gaming Chairs', 'Gaming Monitors', 'Headsets', 'Gaming PCs', 'VR Headsets', 'Gaming Accessories'] },
  { name: 'Travel & Tourism', dataName: null, Icon: Plane,
    subs: ['Flight Tickets', 'Hotel Bookings', 'Holiday Packages', 'Safari Tours', 'Car Hire', 'Travel Insurance', 'Cruise Packages', 'Adventure Activities', 'Travel Accessories'] },
  { name: 'Healthcare', dataName: null, Icon: HeartPulse,
    subs: ['Medical Equipment', 'Wheelchairs & Mobility', 'Hearing Aids', 'Vision Care', 'Orthopaedic', 'Diagnostic Tools', 'Surgical Supplies', 'First Aid', 'Dental Care'] },
  { name: 'Business & Investment', dataName: null, Icon: TrendingUp,
    subs: ['Business for Sale', 'Franchise Opportunities', 'Investment Opportunities', 'Tenders & Contracts', 'Business Equipment', 'Financial Services', 'Legal Services', 'Accounting Services', 'Consulting'] },
  { name: 'Art & Crafts', dataName: null, Icon: Palette,
    subs: ['Paintings', 'Sculptures', 'Photography', 'Handmade Jewelry', 'Pottery & Ceramics', 'Textile Art', 'Prints', 'Craft Supplies', 'Digital Art'] },
];

export default function HomePage() {
  const flash = products.filter(p => p.isOffer);
  const electronics = products.filter(p => p.category === 'Electronics');
  const furniture = products.filter(p => p.category === 'Furniture');
  const fashion = products.filter(p => p.category === 'Fashion');
  const beauty = products.filter(p => p.category === 'Beauty');
  const kids = products.filter(p => p.category === 'Kids');
  const [hoveredCat, setHoveredCat] = useState<number | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [sidebarCanScroll, setSidebarCanScroll] = useState(true);

  const handleSidebarScroll = useCallback(() => {
    const el = sidebarRef.current;
    if (!el) return;
    setSidebarCanScroll(el.scrollTop + el.clientHeight < el.scrollHeight - 4);
  }, []);

  useEffect(() => { handleSidebarScroll(); }, [handleSidebarScroll]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-5">

      {/* ===== HERO: Sidebar + Flyout + Banner (desktop) / Banner only (mobile) ===== */}
      <section className="mb-6">

        {/* ── Desktop layout ── */}
        <div
          className="hidden md:flex h-[360px] relative rounded-2xl shadow-elevated"
          onMouseLeave={() => setHoveredCat(null)}
        >
          {/* Category Sidebar */}
          <div className="w-52 flex-shrink-0 relative z-10 flex flex-col rounded-l-2xl overflow-hidden">
            {/* Red header */}
            <div className="bg-primary px-4 py-2.5 flex-shrink-0">
              <p className="text-white font-bold text-[13px] uppercase tracking-wider">Categories</p>
            </div>
            {/* White list */}
            <div
              ref={sidebarRef}
              onScroll={handleSidebarScroll}
              className="flex-1 bg-white dark:bg-surface overflow-y-auto hide-scrollbar"
            >
            {SIDEBAR_CATS.map((cat, i) => (
              <div
                key={cat.name}
                onMouseEnter={() => setHoveredCat(i)}
                className={`flex items-center gap-2.5 px-4 py-[10px] cursor-pointer transition-colors select-none border-b border-gray-100 dark:border-theme ${
                  hoveredCat === i ? 'bg-primary/8' : 'hover:bg-primary/5'
                }`}
              >
                <cat.Icon className={`w-4 h-4 flex-shrink-0 ${hoveredCat === i ? 'text-primary' : 'text-gray-500 dark:text-theme-muted'}`} />
                <span className={`text-[12.5px] font-medium leading-tight flex-1 line-clamp-1 ${
                  hoveredCat === i ? 'text-primary font-semibold' : 'text-gray-800 dark:text-theme-primary'
                }`}>{cat.name}</span>
                <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 ${hoveredCat === i ? 'text-primary' : 'text-gray-400'}`} />
              </div>
            ))}
            </div>
            {/* Scroll-more fade + chevron */}
            {sidebarCanScroll && (
              <div className="absolute bottom-0 left-0 right-0 h-14 pointer-events-none flex flex-col items-center justify-end pb-2"
                style={{ background: 'linear-gradient(to top, white 0%, transparent 100%)' }}
              >
                <ChevronsDown className="w-4 h-4 text-gray-400 animate-bounce" />
              </div>
            )}
          </div>

          {/* Subcategory Flyout — overlays the banner */}
          {hoveredCat !== null && (
            <div className="absolute left-52 top-0 h-full z-20 w-[500px] bg-surface border-y border-r border-theme shadow-2xl flex flex-col">
              <div className="px-4 py-2.5 border-b border-theme flex-shrink-0">
                <p className="text-[11px] font-bold text-primary uppercase tracking-wider">
                  {SIDEBAR_CATS[hoveredCat].name}
                </p>
              </div>
              <div className="flex-1 overflow-y-auto p-3">
                <div className="grid grid-cols-5 gap-x-2 gap-y-3">
                  {SIDEBAR_CATS[hoveredCat].subs.map(sub => {
                    const seed = sub.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    return (
                      <Link
                        key={sub}
                        href={`/subcategory?cat=${encodeURIComponent(SIDEBAR_CATS[hoveredCat!].name)}&sub=${encodeURIComponent(sub)}`}
                        className="flex flex-col items-center gap-1.5 group"
                      >
                        <div className="w-full rounded-lg overflow-hidden bg-elevated border border-theme p-1.5" style={{ aspectRatio: '1/1' }}>
                          <img
                            src={`https://picsum.photos/seed/${seed}/80/80`}
                            alt={sub}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-200"
                          />
                        </div>
                        <span className="text-[10px] text-theme-secondary group-hover:text-primary font-medium text-center leading-tight line-clamp-2 w-full">
                          {sub}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Hero Banner fills remaining space */}
          <div className="flex-1 min-w-0 h-full rounded-r-2xl overflow-hidden">
            <Slider slides={centeredHeroSlides} interval={3000} fill />
          </div>
        </div>

        {/* ── Mobile layout: banner only ── */}
        <div className="md:hidden">
          <Slider slides={centeredHeroSlides} interval={3000} tall />
        </div>

      </section>


      {/* ===== CATEGORIES (mobile only — desktop uses sidebar) ===== */}
      <section className="mb-6 md:hidden">
        <SectionHeader title="Categories" href="/categories" icon={Grid3X3} />
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 -mx-4 px-4">
          {categories.slice(1).map((cat) => {
            const Icon = categoryIcons[cat.name] || Wrench;
            return (
              <Link key={cat.id} href={`/shop?category=${cat.name}`} className="flex flex-col items-center gap-2 group flex-shrink-0">
                <div className="w-14 h-14 rounded-full bg-elevated border border-theme flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-colors">
                  <Icon className="w-6 h-6 text-theme-secondary group-hover:text-primary transition-colors" />
                </div>
                <span className="text-[10px] font-medium text-theme-secondary text-center whitespace-nowrap">{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ===== LIVE & SHORTS ===== */}
      <section className="mb-6">
        <SectionHeader title="Live & Shorts" href="/feed" icon={Radio} />
        <FeedSection />
      </section>

      {/* ===== FLASH SALES ===== */}
      <section className="mb-6">
        <SectionHeader title="AOS Flash Sales" href="/shop?filter=flash" icon={Zap} />
        <AutoScrollRow speed={3000}>
          {flash.slice(0, 8).map((p) => (
            <div key={p.id} className="w-[calc(50vw-22px)] md:w-[220px] flex-shrink-0 snap-start"><ProductCard product={p} /></div>
          ))}
        </AutoScrollRow>
      </section>

      {/* ===== SERVICES NEAR YOU ===== */}
      <section className="mb-6">
        <SectionHeader title="Services Near You" href="/shop?category=Services" icon={Wrench} />
        <AutoScrollRow speed={4000}>
          {services.map((svc) => (
            <div key={svc.id} className="w-[calc(50vw-22px)] md:w-[220px] flex-shrink-0 snap-start">
              <ProductCard product={svc} />
            </div>
          ))}
        </AutoScrollRow>
      </section>

      {/* ===== NEW PRODUCTS ===== */}
      <section className="mb-6">
        <SectionHeader title="New Products in AOS" href="/shop" icon={Package} />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 md:gap-3">
          {products.slice(0, 10).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* ===== ELECTRONICS DEALS ===== */}
      <section className="mb-6">
        <SectionHeader title="AOS Electronics Deals" href="/shop?category=Electronics" icon={Monitor} />
        <AutoScrollRow speed={3500}>
          {electronics.map((p) => (
            <div key={p.id} className="w-[calc(50vw-22px)] md:w-[220px] flex-shrink-0 snap-start"><ProductCard product={p} /></div>
          ))}
        </AutoScrollRow>
      </section>

      {/* ===== AOS DEALS (same as flash but different slice) ===== */}
      <section className="mb-6">
        <SectionHeader title="AOS Deals" href="/shop?filter=deals" icon={Flame} />
        <AutoScrollRow speed={3200}>
          {flash.map((p) => (
            <div key={`deal-${p.id}`} className="w-[calc(50vw-22px)] md:w-[220px] flex-shrink-0 snap-start"><ProductCard product={p} /></div>
          ))}
        </AutoScrollRow>
      </section>

      {/* ===== PROMO TIP CARDS ===== */}
      <section className="mb-6">
        <div className="grid md:grid-cols-3 gap-3">
          {promoTips.map((tip) => (
            <Link key={tip.id} href={tip.link} className={`bg-gradient-to-br ${tip.color} rounded-xl p-5 text-white hover:opacity-90 transition-opacity relative overflow-hidden`}>
              <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/10" />
              <h3 className="font-bold text-sm md:text-base">{tip.title}</h3>
              <p className="text-xs opacity-80 mt-1">{tip.description}</p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold mt-3 bg-white/20 px-3 py-1 rounded-full">
                Learn more <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== FURNITURE ===== */}
      <section className="mb-6">
        <SectionHeader title="Furniture" href="/shop?category=Furniture" icon={Sofa} />
        <AutoScrollRow speed={3800}>
          {furniture.map((p) => (
            <div key={p.id} className="w-[calc(50vw-22px)] md:w-[220px] flex-shrink-0 snap-start"><ProductCard product={p} /></div>
          ))}
        </AutoScrollRow>
      </section>

      {/* ===== SECONDARY BANNER SLIDER ===== */}
      <section className="mb-6">
        <Slider slides={centeredSecondarySlides} interval={4000} secondary />
      </section>

      {/* ===== ELECTRONICS ===== */}
      <section className="mb-6">
        <SectionHeader title="Electronics" href="/shop?category=Electronics" icon={Monitor} />
        <AutoScrollRow speed={3600}>
          {electronics.map((p) => (
            <div key={`elec-${p.id}`} className="w-[calc(50vw-22px)] md:w-[220px] flex-shrink-0 snap-start"><ProductCard product={p} /></div>
          ))}
        </AutoScrollRow>
      </section>

      {/* ===== FASHION ===== */}
      <section className="mb-6">
        <SectionHeader title="Fashion" href="/shop?category=Fashion" icon={Shirt} />
        <AutoScrollRow speed={3400}>
          {fashion.map((p) => (
            <div key={p.id} className="w-[calc(50vw-22px)] md:w-[220px] flex-shrink-0 snap-start"><ProductCard product={p} /></div>
          ))}
        </AutoScrollRow>
      </section>

      {/* ===== KIDS ===== */}
      <section className="mb-6">
        <SectionHeader title="Kids" href="/shop?category=Kids" icon={Baby} />
        <AutoScrollRow speed={3700}>
          {kids.map((p) => (
            <div key={p.id} className="w-[calc(50vw-22px)] md:w-[220px] flex-shrink-0 snap-start"><ProductCard product={p} /></div>
          ))}
        </AutoScrollRow>
      </section>

      {/* ===== BEAUTY ===== */}
      <section className="mb-6">
        <SectionHeader title="Beauty" href="/shop?category=Beauty" icon={Sparkles} />
        <AutoScrollRow speed={3300}>
          {beauty.map((p) => (
            <div key={p.id} className="w-[calc(50vw-22px)] md:w-[220px] flex-shrink-0 snap-start"><ProductCard product={p} /></div>
          ))}
        </AutoScrollRow>
      </section>

      {/* ===== DISCOVER MORE ===== */}
      <section className="mb-6">
        <SectionHeader title="Discover more on AOS" href="/shop" icon={Compass} />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 md:gap-3">
          {products.slice(10).map((p) => <ProductCard key={`disc-${p.id}`} product={p} />)}
        </div>
      </section>

      {/* ===== SELL CTA BANNER ===== */}
      <section className="mb-8">
        <div className="bg-gradient-to-r from-primary to-red-700 rounded-2xl p-6 md:p-10 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/5" />
          <div className="absolute right-20 bottom-0 w-32 h-32 rounded-full bg-white/5" />
          <div className="relative">
            <h2 className="text-xl md:text-2xl font-bold">Start Selling on AOS</h2>
            <p className="text-sm opacity-80 mt-1">Reach millions of buyers across Africa. List your first item free!</p>
          </div>
          <Link href="/sell" className="relative bg-white text-primary px-6 py-3 rounded-full font-semibold text-sm hover:bg-gray-100 transition-colors whitespace-nowrap w-fit inline-flex items-center gap-1.5">
            Post Free Ad <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
