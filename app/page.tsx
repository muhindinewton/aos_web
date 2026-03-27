'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ChevronRight, Zap, Truck, TrendingUp, MapPin, Heart, Star, Clock, Car, Smartphone, Monitor, Sofa, Shirt, Sparkles, Wrench, Home as HomeIcon, Baby, Cat, ChevronLeft, Flame, Award, Package, Shield, Gift, ArrowRight, Grid3X3, Compass } from 'lucide-react';
import { products, categories, bannerSlides, services, secondaryBanners, promoTips } from './lib/data';
import { ProductCard } from './components/product-card';

const categoryIcons: Record<string, React.ElementType> = {
  Vehicles: Car, Property: HomeIcon, Phones: Smartphone, Electronics: Monitor,
  Furniture: Sofa, Fashion: Shirt, Beauty: Sparkles, Services: Wrench, Kids: Baby, Pets: Cat,
};

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
  const [cardWidth, setCardWidth] = useState(192);

  useEffect(() => {
    const updateCardWidth = () => {
      const isMd = window.innerWidth >= 768;
      setCardWidth(isMd ? 232 : 192);
    };
    updateCardWidth();
    window.addEventListener('resize', updateCardWidth);
    return () => window.removeEventListener('resize', updateCardWidth);
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
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 2) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: cardWidth, behavior: 'smooth' });
      }
    }, speed);
    return () => { clearInterval(t); el.removeEventListener('pointerdown', pause); el.removeEventListener('pointerup', resume); el.removeEventListener('touchstart', pause); el.removeEventListener('touchend', resume); };
  }, [speed, cardWidth]);

  const scrollLeft = () => {
    const el = ref.current;
    if (el) el.scrollBy({ left: -cardWidth, behavior: 'smooth' });
  };

  const scrollRight = () => {
    const el = ref.current;
    if (el) el.scrollBy({ left: cardWidth, behavior: 'smooth' });
  };

  return (
    <div className="relative group">
      <div ref={ref} className="flex gap-3 overflow-x-auto hide-scrollbar pb-1 -mx-4 px-4 md:-mx-6 md:px-6 scroll-smooth">
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
  icon?: string;
}

function Slider({ slides, interval = 4000, tall }: { slides: SlideData[]; interval?: number; tall?: boolean }) {
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

  const slide = slides[idx];

  return (
    <div className={`relative ${tall ? 'h-48 md:h-64 lg:h-80' : 'h-36 md:h-44'} rounded-2xl overflow-hidden shadow-elevated group`} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {/* Background with transition */}
      <div className="absolute inset-0 transition-all duration-700 ease-out" style={{ background: slide.bg }}>
        {/* Decorative shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-16 -top-16 w-64 h-64 md:w-96 md:h-96 rounded-full bg-white/[0.08]" />
          <div className="absolute right-12 bottom-0 w-40 h-40 md:w-56 md:h-56 rounded-full bg-white/[0.06]" />
          <div className="absolute left-1/3 -bottom-8 w-32 h-32 rounded-full bg-black/[0.08]" />
        </div>
      </div>

      {/* Content with crossfade */}
      <div className="absolute inset-0 flex">
        {slides.map((s, i) => (
          <div key={i} className={`absolute inset-0 transition-all duration-500 ${i === idx ? 'opacity-100 translate-x-0' : i < idx ? 'opacity-0 -translate-x-full' : 'opacity-0 translate-x-full'}`}>
            <div className="h-full flex items-center">
              {tall ? (
                <div className="h-full p-5 md:p-8 lg:p-10 flex flex-col justify-center relative z-10 max-w-[70%] md:max-w-[60%]">
                  <span className="text-[10px] md:text-xs font-bold bg-white/20 backdrop-blur-sm border border-white/10 px-3 py-1 rounded-full w-fit mb-2 md:mb-3 uppercase tracking-wider">{s.badge || 'Featured'}</span>
                  <h2 className="text-xl md:text-3xl lg:text-4xl font-extrabold leading-tight text-white drop-shadow-sm">{s.title}</h2>
                  <p className="text-sm md:text-lg font-semibold text-white/95 mt-1">{s.subtitle}</p>
                  <p className="text-[11px] md:text-sm text-white/70 mt-0.5">{s.description}</p>
                  <Link href="/shop" className="mt-3 md:mt-5 bg-white text-gray-900 px-5 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold w-fit hover:bg-gray-100 transition-all hover:scale-105 shadow-lg inline-flex items-center gap-1.5">
                    Shop Now <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </Link>
                </div>
              ) : (
                <div className="h-full p-3 md:p-4 flex items-center relative z-10">
                  <div className="max-w-[60%]">
                    {s.badge && <span className="text-[9px] md:text-[10px] font-bold bg-white/90 text-gray-900 px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap inline-block">{s.badge}</span>}
                    <h3 className="text-base md:text-lg font-bold mt-1 leading-tight text-white drop-shadow-sm">{s.title}</h3>
                    <p className="text-[11px] md:text-xs text-white/90 font-medium leading-tight">{s.subtitle}</p>
                    <Link href="/shop" className="mt-1.5 md:mt-2 inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm border border-white/20 px-2.5 py-1 rounded-full text-[11px] font-semibold text-white hover:bg-white/30 transition-all">
                      Shop <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60 shadow-lg">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60 shadow-lg">
        <ChevronRight className="w-5 h-5" />
      </button>
      <div className={`absolute ${tall ? 'bottom-3' : 'bottom-2'} left-1/2 -translate-x-1/2 flex gap-2 z-20`}>
        {slides.map((_, i) => (
          <button key={i} onClick={() => go(i)} className={`rounded-full transition-all duration-300 ${i === idx ? 'w-7 h-2 bg-white shadow-md' : 'w-2 h-2 bg-white/50 hover:bg-white/70'}`} />
        ))}
      </div>
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
    badge: '🚚 Free Delivery',
    title: 'Free Shipping',
    subtitle: 'On orders above Ksh 1,000',
    description: 'Fast & reliable shipping across the country',
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

export default function HomePage() {
  const flash = products.filter(p => p.isOffer);
  const electronics = products.filter(p => p.category === 'Electronics');
  const furniture = products.filter(p => p.category === 'Furniture');
  const fashion = products.filter(p => p.category === 'Fashion');
  const beauty = products.filter(p => p.category === 'Beauty');
  const kids = products.filter(p => p.category === 'Kids');

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-5">

      {/* ===== HERO CAROUSEL ===== */}
      <section className="mb-6">
        <Slider slides={heroSlides} interval={3000} tall />
      </section>

      {/* ===== QUICK ACTIONS ===== */}
      <section className="mb-6">
        <div className="grid grid-cols-4 md:grid-cols-4 gap-2 md:gap-3">
          {[
            { icon: Zap, title: 'Flash Sale', gradient: 'from-red-500 to-orange-500' },
            { icon: Flame, title: 'Trending', gradient: 'from-blue-500 to-cyan-500' },
            { icon: Gift, title: 'Free Ship', gradient: 'from-green-500 to-emerald-500' },
            { icon: Award, title: 'Top Deals', gradient: 'from-purple-500 to-pink-500' },
          ].map((item) => (
            <Link key={item.title} href="/shop" className={`bg-gradient-to-br ${item.gradient} rounded-xl p-2.5 md:p-4 text-white hover:opacity-90 transition-opacity text-center`}>
              <item.icon className="w-5 h-5 md:w-7 md:h-7 mx-auto mb-1 opacity-90" />
              <p className="font-semibold text-xs md:text-sm">{item.title}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="mb-6">
        <SectionHeader title="Categories" href="/categories" icon={Grid3X3} />
        <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-3 md:gap-4">
          {categories.slice(1).map((cat) => {
            const Icon = categoryIcons[cat.name] || Wrench;
            return (
              <Link key={cat.id} href={`/shop?category=${cat.name}`} className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-elevated border border-theme flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-colors">
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-theme-secondary group-hover:text-primary transition-colors" />
                </div>
                <span className="text-[10px] md:text-xs font-medium text-theme-secondary text-center">{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ===== FLASH SALES ===== */}
      <section className="mb-6">
        <SectionHeader title="AOS Flash Sales" href="/shop?filter=flash" icon={Zap} />
        <AutoScrollRow speed={3000}>
          {flash.slice(0, 8).map((p) => (
            <div key={p.id} className="w-[180px] md:w-[220px] flex-shrink-0"><ProductCard product={p} /></div>
          ))}
        </AutoScrollRow>
      </section>

      {/* ===== SERVICES NEAR YOU ===== */}
      <section className="mb-6">
        <SectionHeader title="Services Near You" href="/shop?category=Services" icon={Wrench} />
        <AutoScrollRow speed={4000}>
          {services.map((svc) => (
            <div key={svc.id} className="w-[180px] md:w-[220px] flex-shrink-0">
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
            <div key={p.id} className="w-[180px] md:w-[220px] flex-shrink-0"><ProductCard product={p} /></div>
          ))}
        </AutoScrollRow>
      </section>

      {/* ===== AOS DEALS (same as flash but different slice) ===== */}
      <section className="mb-6">
        <SectionHeader title="AOS Deals" href="/shop?filter=deals" icon={Flame} />
        <AutoScrollRow speed={3200}>
          {flash.map((p) => (
            <div key={`deal-${p.id}`} className="w-[180px] md:w-[220px] flex-shrink-0"><ProductCard product={p} /></div>
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
            <div key={p.id} className="w-[180px] md:w-[220px] flex-shrink-0"><ProductCard product={p} /></div>
          ))}
        </AutoScrollRow>
      </section>

      {/* ===== SECONDARY BANNER SLIDER ===== */}
      <section className="mb-6">
        <Slider slides={secSlides} interval={4000} />
      </section>

      {/* ===== ELECTRONICS ===== */}
      <section className="mb-6">
        <SectionHeader title="Electronics" href="/shop?category=Electronics" icon={Monitor} />
        <AutoScrollRow speed={3600}>
          {electronics.map((p) => (
            <div key={`elec-${p.id}`} className="w-[180px] md:w-[220px] flex-shrink-0"><ProductCard product={p} /></div>
          ))}
        </AutoScrollRow>
      </section>

      {/* ===== FASHION ===== */}
      <section className="mb-6">
        <SectionHeader title="Fashion" href="/shop?category=Fashion" icon={Shirt} />
        <AutoScrollRow speed={3400}>
          {fashion.map((p) => (
            <div key={p.id} className="w-[180px] md:w-[220px] flex-shrink-0"><ProductCard product={p} /></div>
          ))}
        </AutoScrollRow>
      </section>

      {/* ===== KIDS ===== */}
      <section className="mb-6">
        <SectionHeader title="Kids" href="/shop?category=Kids" icon={Baby} />
        <AutoScrollRow speed={3700}>
          {kids.map((p) => (
            <div key={p.id} className="w-[180px] md:w-[220px] flex-shrink-0"><ProductCard product={p} /></div>
          ))}
        </AutoScrollRow>
      </section>

      {/* ===== BEAUTY ===== */}
      <section className="mb-6">
        <SectionHeader title="Beauty" href="/shop?category=Beauty" icon={Sparkles} />
        <AutoScrollRow speed={3300}>
          {beauty.map((p) => (
            <div key={p.id} className="w-[180px] md:w-[220px] flex-shrink-0"><ProductCard product={p} /></div>
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
