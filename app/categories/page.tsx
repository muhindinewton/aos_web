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

const CAROUSEL_ITEMS = [
  { title: 'Special Offers',  sub: 'Up to 50% off selected items' },
  { title: 'New Arrivals',    sub: 'Fresh products just landed' },
  { title: 'Best Sellers',    sub: 'Top picks from our community' },
  { title: 'Flash Sale',      sub: 'Limited time deals — hurry!' },
];

function SubcategoryTile({ sub, cat }: { sub: SubcatDef; cat: CatDef }) {
  const SubIcon = sub.Icon;
  return (
    <Link
      href={`/shop?category=${encodeURIComponent(cat.name)}`}
      className="flex flex-col items-center gap-1.5 group"
    >
      <div
        className="w-full rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-105"
        style={{
          aspectRatio: '1 / 1',
          background: `${cat.color}18`,
          border: `1px solid ${cat.color}30`,
        }}
      >
        <SubIcon className="w-6 h-6" style={{ color: cat.color }} />
      </div>
      <span className="text-[10px] font-medium text-theme-primary text-center leading-tight line-clamp-2 w-full">
        {sub.name}
      </span>
    </Link>
  );
}

export default function CategoriesPage() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [carouselIdx, setCarouselIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCarouselIdx(i => (i + 1) % CAROUSEL_ITEMS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const cat = ALL_CATEGORIES[selectedIdx];

  const forYouProducts = cat.dataName
    ? products.filter(p => p.category === cat.dataName).slice(0, 8)
    : products.slice(0, 8);

  return (
    <div className="flex bg-theme" style={{ height: 'calc(100vh - 64px)', overflow: 'hidden' }}>

      {/* ── Panel 1: Category Sidebar ── */}
      <div
        className="flex-shrink-0 overflow-y-auto border-r border-theme bg-theme hide-scrollbar"
        style={{ width: 85 }}
      >
        {ALL_CATEGORIES.map((c, i) => {
          const active = i === selectedIdx;
          return (
            <button
              key={c.name}
              onClick={() => setSelectedIdx(i)}
              className="w-full flex flex-col items-center py-3 px-2 transition-colors"
              style={{
                borderLeft: `3px solid ${active ? c.color : 'transparent'}`,
                background: active ? 'var(--surface)' : 'transparent',
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: active ? `${c.color}1A` : 'var(--elevated)' }}
              >
                <c.Icon
                  className="w-[22px] h-[22px]"
                  style={{ color: active ? c.color : 'var(--text-secondary)' }}
                />
              </div>
              <span
                className="text-[10px] font-semibold text-center mt-1 leading-tight"
                style={{ color: active ? c.color : 'var(--text-primary)' }}
              >
                {c.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Panel 2: Subcategories (2-col grid) ── */}
      <div
        className="flex-shrink-0 overflow-y-auto border-r border-theme bg-surface hide-scrollbar"
        style={{ width: 220 }}
      >
        <div
          className="sticky top-0 z-10 px-3 py-2.5 border-b border-theme"
          style={{ background: 'var(--surface)' }}
        >
          <p className="text-[13px] font-bold text-theme-primary leading-tight">{cat.name}</p>
        </div>
        <div className="p-2.5 grid grid-cols-2 gap-2">
          {cat.subcategories.map(sub => (
            <SubcategoryTile key={sub.name} sub={sub} cat={cat} />
          ))}
        </div>
      </div>

      {/* ── Panel 3: Banner + For You ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4 pb-10">

          {/* Promo Carousel */}
          <div>
            <div className="relative rounded-2xl overflow-hidden" style={{ height: 140 }}>
              {CAROUSEL_ITEMS.map((item, i) => (
                <div
                  key={i}
                  className="absolute inset-0 flex flex-col justify-center px-6 transition-opacity duration-500"
                  style={{
                    opacity: i === carouselIdx ? 1 : 0,
                    background: 'linear-gradient(135deg, var(--primary-hover), var(--primary))',
                    pointerEvents: i === carouselIdx ? 'auto' : 'none',
                  }}
                >
                  <Tag className="absolute right-5 top-1/2 -translate-y-1/2 opacity-20 w-16 h-16 text-white" />
                  <p className="text-white font-bold text-xl leading-tight">{item.title}</p>
                  <p className="text-white/90 text-sm mt-1">{item.sub}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center items-center gap-1.5 mt-2.5">
              {CAROUSEL_ITEMS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCarouselIdx(i)}
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: i === carouselIdx ? 20 : 8,
                    background: i === carouselIdx ? 'var(--primary)' : 'var(--border)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* For You */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-theme-primary">For you</span>
              <Link
                href={`/shop?category=${encodeURIComponent(cat.dataName ?? cat.name)}`}
                className="px-3 py-1 rounded-full text-xs font-medium text-primary"
                style={{ background: 'rgba(var(--primary-rgb),0.10)' }}
              >
                See all
              </Link>
            </div>
            {forYouProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {forYouProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <p className="text-xs text-theme-muted text-center py-10">No products yet in this category</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
