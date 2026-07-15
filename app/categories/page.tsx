'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
  Smartphone, Car, Home, Monitor, Sofa, Shirt, Sparkles, Wrench, Hammer,
  Briefcase, Activity, Baby, Leaf, Cat, Users, Tag,
  Tablet, Plug, Watch, Zap, BatteryCharging, Headphones, Shield, Scan,
  Bus, Truck, Bike, Cog, Anchor, HardHat, Gauge, Circle,
  Building, Building2, Map, Store, BedDouble, Warehouse, PartyPopper,
  Laptop, Tv, Speaker, Gamepad2, Camera, Printer, Wifi, HardDrive,
  Palette, ChefHat, Package, TreePine, Lamp, Box, Droplets,
  ShoppingBag, Gem, Glasses, Wind, Heart, Pill, Dumbbell, Scissors, GraduationCap,
  UtensilsCrossed, Music, Tent, Award, Fish, Bird, Wheat,
  Factory, PenLine, Calculator, ClipboardList, TrendingUp, Dog,
} from 'lucide-react';
import { ProductCard } from '../components/product-card';
import { products } from '../lib/data';

type SubcatDef = { name: string; Icon: LucideIcon };
type CatDef = {
  name: string;
  dataName: string | null;
  Icon: LucideIcon;
  color: string;
  subcategories: SubcatDef[];
};

const ALL_CATEGORIES: CatDef[] = [
  {
    name: 'Phones & Accessories', dataName: 'Phones', Icon: Smartphone, color: '#3B82F6',
    subcategories: [
      { name: 'Mobile Phones', Icon: Smartphone }, { name: 'Tablets', Icon: Tablet },
      { name: 'Phone Accessories', Icon: Plug }, { name: 'Smart Watches', Icon: Watch },
      { name: 'Chargers & Cables', Icon: Zap }, { name: 'Power Banks', Icon: BatteryCharging },
      { name: 'Headphones', Icon: Headphones }, { name: 'Phone Cases', Icon: Shield },
      { name: 'Screen Protectors', Icon: Scan },
    ],
  },
  {
    name: 'Vehicles', dataName: 'Vehicles', Icon: Car, color: '#F97316',
    subcategories: [
      { name: 'Cars', Icon: Car }, { name: 'Buses & Microbuses', Icon: Bus },
      { name: 'Trucks & Trailers', Icon: Truck }, { name: 'Motorbikes', Icon: Bike },
      { name: 'Vehicle Parts', Icon: Cog }, { name: 'Watercraft', Icon: Anchor },
      { name: 'Heavy Equipment', Icon: HardHat }, { name: 'Car Accessories', Icon: Gauge },
      { name: 'Tyres & Rims', Icon: Circle },
    ],
  },
  {
    name: 'Property', dataName: null, Icon: Home, color: '#14B8A6',
    subcategories: [
      { name: 'Houses for Rent', Icon: Home }, { name: 'Houses for Sale', Icon: Building },
      { name: 'Apartments', Icon: Building2 }, { name: 'Land & Plots', Icon: Map },
      { name: 'Commercial', Icon: Store }, { name: 'Short Stay', Icon: BedDouble },
      { name: 'Office Space', Icon: Briefcase }, { name: 'Warehouses', Icon: Warehouse },
      { name: 'Event Venues', Icon: PartyPopper },
    ],
  },
  {
    name: 'Electronics', dataName: 'Electronics', Icon: Monitor, color: '#6366F1',
    subcategories: [
      { name: 'Computers', Icon: Monitor }, { name: 'Laptops', Icon: Laptop },
      { name: 'TV & DVD', Icon: Tv }, { name: 'Audio & Music', Icon: Speaker },
      { name: 'Video Games', Icon: Gamepad2 }, { name: 'Cameras', Icon: Camera },
      { name: 'Printers', Icon: Printer }, { name: 'Networking', Icon: Wifi },
      { name: 'Storage Devices', Icon: HardDrive },
    ],
  },
  {
    name: 'Home & Furniture', dataName: 'Furniture', Icon: Sofa, color: '#F59E0B',
    subcategories: [
      { name: 'Furniture', Icon: Sofa }, { name: 'Home Decor', Icon: Palette },
      { name: 'Kitchen', Icon: ChefHat }, { name: 'Appliances', Icon: Package },
      { name: 'Bedding', Icon: BedDouble }, { name: 'Garden', Icon: TreePine },
      { name: 'Lighting', Icon: Lamp }, { name: 'Storage', Icon: Box },
      { name: 'Bathroom', Icon: Droplets },
    ],
  },
  {
    name: 'Fashion', dataName: 'Fashion', Icon: Shirt, color: '#EC4899',
    subcategories: [
      { name: "Men's Wear", Icon: Shirt }, { name: "Women's Wear", Icon: Shirt },
      { name: "Men's Shoes", Icon: ShoppingBag }, { name: "Women's Shoes", Icon: ShoppingBag },
      { name: 'Bags', Icon: ShoppingBag }, { name: 'Watches', Icon: Watch },
      { name: 'Jewelry', Icon: Gem }, { name: 'Kids Wear', Icon: Baby },
      { name: 'Accessories', Icon: Glasses },
    ],
  },
  {
    name: 'Beauty', dataName: 'Beauty', Icon: Sparkles, color: '#F43F5E',
    subcategories: [
      { name: 'Makeup', Icon: Sparkles }, { name: 'Skin Care', Icon: Droplets },
      { name: 'Hair Care', Icon: Scissors }, { name: 'Fragrances', Icon: Wind },
      { name: 'Personal Care', Icon: Heart }, { name: 'Health', Icon: Activity },
      { name: 'Vitamins', Icon: Pill }, { name: 'Medical', Icon: Heart },
      { name: 'Fitness', Icon: Dumbbell },
    ],
  },
  {
    name: 'Services', dataName: 'Services', Icon: Wrench, color: '#06B6D4',
    subcategories: [
      { name: 'Automotive', Icon: Car }, { name: 'Business', Icon: Briefcase },
      { name: 'IT Services', Icon: Laptop }, { name: 'Cleaning', Icon: Sparkles },
      { name: 'Events', Icon: PartyPopper }, { name: 'Beauty', Icon: Scissors },
      { name: 'Moving', Icon: Truck }, { name: 'Tours', Icon: Map },
      { name: 'Education', Icon: GraduationCap },
    ],
  },
  {
    name: 'Repair', dataName: null, Icon: Hammer, color: '#EAB308',
    subcategories: [
      { name: 'Building Materials', Icon: Building }, { name: 'Plumbing', Icon: Droplets },
      { name: 'Electrical', Icon: Zap }, { name: 'Hand Tools', Icon: Hammer },
      { name: 'Power Tools', Icon: Wrench }, { name: 'Roofing', Icon: Home },
      { name: 'Flooring', Icon: Box }, { name: 'Painting', Icon: Palette },
      { name: 'Hardware', Icon: Cog },
    ],
  },
  {
    name: 'Commercial', dataName: null, Icon: Briefcase, color: '#8B5CF6',
    subcategories: [
      { name: 'Manufacturing', Icon: Factory }, { name: 'Restaurant', Icon: UtensilsCrossed },
      { name: 'Store Equipment', Icon: Store }, { name: 'Office Furniture', Icon: Sofa },
      { name: 'Medical', Icon: Heart }, { name: 'Salon', Icon: Scissors },
      { name: 'Printing', Icon: Printer }, { name: 'Stationery', Icon: PenLine },
      { name: 'Packaging', Icon: Package },
    ],
  },
  {
    name: 'Sports & Leisure', dataName: null, Icon: Activity, color: '#22C55E',
    subcategories: [
      { name: 'Sports Gear', Icon: Activity }, { name: 'Gym Equipment', Icon: Dumbbell },
      { name: 'Instruments', Icon: Music }, { name: 'Books', Icon: GraduationCap },
      { name: 'Bicycles', Icon: Bike }, { name: 'Camping', Icon: Tent },
      { name: 'Toys', Icon: Gamepad2 }, { name: 'Art', Icon: Palette },
      { name: 'Collectibles', Icon: Award },
    ],
  },
  {
    name: 'Babies & Kids', dataName: null, Icon: Baby, color: '#0EA5E9',
    subcategories: [
      { name: 'Baby Clothing', Icon: Baby }, { name: 'Kids Clothing', Icon: Shirt },
      { name: 'Baby Shoes', Icon: ShoppingBag }, { name: 'Strollers', Icon: Baby },
      { name: 'Toys', Icon: Gamepad2 }, { name: 'Baby Gear', Icon: Package },
      { name: 'Feeding', Icon: UtensilsCrossed }, { name: 'Bathing', Icon: Droplets },
      { name: 'Maternity', Icon: Heart },
    ],
  },
  {
    name: 'Agriculture', dataName: null, Icon: Leaf, color: '#84CC16',
    subcategories: [
      { name: 'Farm Machinery', Icon: Cog }, { name: 'Livestock', Icon: Cat },
      { name: 'Seeds', Icon: Leaf }, { name: 'Fertilizers', Icon: Droplets },
      { name: 'Crops', Icon: Wheat }, { name: 'Poultry', Icon: Bird },
      { name: 'Fish', Icon: Fish }, { name: 'Farm Tools', Icon: Hammer },
      { name: 'Irrigation', Icon: Droplets },
    ],
  },
  {
    name: 'Pets', dataName: null, Icon: Cat, color: '#D97706',
    subcategories: [
      { name: 'Dogs', Icon: Dog }, { name: 'Cats', Icon: Cat },
      { name: 'Birds', Icon: Bird }, { name: 'Fish', Icon: Fish },
      { name: 'Reptiles', Icon: Leaf }, { name: 'Pet Food', Icon: UtensilsCrossed },
      { name: 'Pet Accessories', Icon: ShoppingBag }, { name: 'Grooming', Icon: Scissors },
      { name: 'Cages', Icon: Box },
    ],
  },
  {
    name: 'Jobs', dataName: null, Icon: Users, color: '#64748B',
    subcategories: [
      { name: 'Accounting', Icon: Calculator }, { name: 'Admin', Icon: ClipboardList },
      { name: 'Engineering', Icon: Cog }, { name: 'Healthcare', Icon: Heart },
      { name: 'IT', Icon: Laptop }, { name: 'Marketing', Icon: TrendingUp },
      { name: 'Sales', Icon: ShoppingBag }, { name: 'Teaching', Icon: GraduationCap },
      { name: 'Hospitality', Icon: Building },
    ],
  },
];

const CAROUSEL_SLIDES = [
  { title: 'Best Sellers',   sub: 'Up to 50% off selected items', bg: 'linear-gradient(135deg,#c0392b,#e74c3c)' },
  { title: 'New Arrivals',   sub: 'Fresh products just landed',    bg: 'linear-gradient(135deg,#1565C0,#1976D2)' },
  { title: 'Flash Sale',     sub: 'Limited time deals — hurry!',   bg: 'linear-gradient(135deg,#E65100,#F57C00)' },
  { title: 'Top Picks',      sub: 'Curated just for you',          bg: 'linear-gradient(135deg,#6A1B9A,#8E24AA)' },
];

export default function CategoriesPage() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [carouselIdx, setCarouselIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCarouselIdx(i => (i + 1) % CAROUSEL_SLIDES.length), 4000);
    return () => clearInterval(t);
  }, []);

  const cat = ALL_CATEGORIES[selectedIdx];
  const forYouProducts = cat.dataName
    ? products.filter(p => p.category === cat.dataName).slice(0, 6)
    : products.slice(0, 6);
  const displayProducts = forYouProducts.length > 0 ? forYouProducts : products.slice(0, 6);

  return (
    <div className="flex h-[calc(100dvh-80px)] lg:h-[calc(100dvh-112px)] overflow-hidden bg-surface">

      {/* ── Left Sidebar ── */}
      <div className="w-[88px] flex-shrink-0 overflow-y-auto border-r border-theme hide-scrollbar bg-surface">
        {ALL_CATEGORIES.map((c, i) => {
          const active = i === selectedIdx;
          return (
            <button
              key={c.name}
              onClick={() => setSelectedIdx(i)}
              className="w-full flex flex-col items-center py-3 px-2 transition-all"
              style={{
                borderLeft: `3px solid ${active ? c.color : 'transparent'}`,
                background: active ? `${c.color}08` : 'transparent',
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-1 transition-all"
                style={{ background: active ? `${c.color}1A` : 'var(--elevated)' }}
              >
                <c.Icon className="w-6 h-6" style={{ color: active ? c.color : 'var(--text-muted)' }} />
              </div>
              <span
                className="text-[10px] font-semibold text-center leading-tight line-clamp-2"
                style={{ color: active ? c.color : 'var(--text-primary)' }}
              >
                {c.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Right Panel (single scrollable) ── */}
      <div className="flex-1 overflow-y-auto hide-scrollbar">

        {/* Banner Carousel */}
        <div className="mx-3 mt-3 relative rounded-2xl overflow-hidden" style={{ height: 120 }}>
          {CAROUSEL_SLIDES.map((slide, i) => (
            <div
              key={i}
              className="absolute inset-0 flex flex-col justify-center px-5 transition-opacity duration-500"
              style={{
                background: slide.bg,
                opacity: i === carouselIdx ? 1 : 0,
                pointerEvents: i === carouselIdx ? 'auto' : 'none',
              }}
            >
              <Tag className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 text-white/20" />
              <p className="text-white font-bold text-lg leading-tight">{slide.title}</p>
              <p className="text-white/80 text-xs mt-0.5">{slide.sub}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center items-center gap-1.5 mt-2">
          {CAROUSEL_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCarouselIdx(i)}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{ width: i === carouselIdx ? 18 : 6, background: i === carouselIdx ? 'var(--primary)' : 'var(--border)' }}
            />
          ))}
        </div>

        {/* Category Header */}
        <div className="px-3 pt-3 pb-1">
          <h2 className="text-sm font-bold text-theme-primary">{cat.name}</h2>
        </div>

        {/* Subcategory 3-col image grid */}
        <div className="px-2 pb-3">
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {cat.subcategories.map(sub => {
              const seed = sub.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              return (
                <Link
                  key={sub.name}
                  href={`/subcategory?cat=${encodeURIComponent(cat.name)}&sub=${encodeURIComponent(sub.name)}`}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div className="w-full rounded-xl overflow-hidden bg-elevated border border-theme" style={{ aspectRatio: '1/1' }}>
                    <img
                      src={`https://picsum.photos/seed/${seed}/120/120`}
                      alt={sub.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <span className="text-[10px] font-medium text-theme-primary text-center leading-tight line-clamp-2 w-full">
                    {sub.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* For You */}
        <div className="px-3 pb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-theme-primary">For you</span>
            <Link
              href={`/subcategory?cat=${encodeURIComponent(cat.name)}`}
              className="text-xs font-semibold text-primary px-3 py-1 rounded-full"
              style={{ background: 'rgba(var(--primary-rgb,220,38,38),0.10)' }}
            >
              See all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {displayProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>

      </div>
    </div>
  );
}
