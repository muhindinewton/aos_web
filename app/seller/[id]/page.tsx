'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ChevronLeft,
  Star,
  MapPin,
  Calendar,
  Clock,
  MessageCircle,
  Phone,
  MoreHorizontal,
  BadgeCheck,
  Users,
  Store,
  ChevronDown,
  Zap,
  Home,
  LayoutGrid,
  PlusCircle,
  User,
  Check,
  Heart,
} from 'lucide-react';
import { products, categories } from '../../lib/data';
import { ProductCard } from '../../components/product-card';

interface SellerStats {
  listings: number;
  sold: number;
  followers: number;
  following: number;
  responseTime: string;
  responseRate: string;
  joinedDate: string;
}

interface SellerInfo {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  verified: boolean;
  description: string;
  location: string;
  businessHours: string;
}

const mockSellerStats: Record<string, SellerStats> = {
  'default': {
    listings: 45,
    sold: 328,
    followers: 1245,
    following: 89,
    responseTime: 'Within 1 hour',
    responseRate: '98%',
    joinedDate: 'March 2021',
  }
};

const mockSellerInfo: Record<string, SellerInfo> = {
  'default': {
    id: '1',
    name: 'TechHub Kenya',
    avatar: 'T',
    rating: 4.5,
    verified: true,
    description: 'TechHub Kenya is your trusted source for premium electronics and tech accessories. We offer quality products at competitive prices across Kenya. Authentic products with warranty.',
    location: 'Nairobi, Kenya',
    businessHours: 'Mon-Fri: 8AM - 6PM, Sat: 9AM - 4PM',
  }
};

const sortOptions = ['Latest', 'Most Popular', 'Highest Price', 'Lowest Price'];
const categoryOptions = ['All Categories', ...categories.filter(c => c.id !== 'all').map(c => c.name)];


export default function SellerStorefrontPage() {
  const params = useParams();
  const router = useRouter();
  const sellerId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [isFollowing, setIsFollowing] = useState(false);
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const [selectedSort, setSelectedSort] = useState('Sort by');
  const [selectedCategory, setSelectedCategory] = useState('Categories');
  const [showSortSheet, setShowSortSheet] = useState(false);
  const [showCategorySheet, setShowCategorySheet] = useState(false);
  const [showNavMenu, setShowNavMenu] = useState(false);

  const sellerProducts = products.filter(
    (p) =>
      p.seller?.name.toLowerCase().replace(/\s+/g, '_') === sellerId?.toLowerCase() ||
      p.seller?.id === sellerId,
  );
  const displayProducts = sellerProducts.length > 0 ? sellerProducts : products.slice(0, 6);

  const sellerInfo = mockSellerInfo['default'];

  const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: LayoutGrid, label: 'Categories', href: '/categories' },
    { icon: PlusCircle, label: 'Sell', href: '/sell' },
    { icon: MessageCircle, label: 'Messages', href: '/chat/1' },
    { icon: User, label: 'Account', href: '/account' },
  ];

  return (
    <>
      <div className="max-w-2xl mx-auto px-4 py-4 pb-36">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-xl bg-surface border border-theme flex items-center justify-center text-theme-primary hover:bg-elevated transition-colors shadow-soft"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="flex-1 text-center text-lg font-semibold text-theme-primary">
            Seller Storefront
          </h1>
          <div className="relative">
            <button
              onClick={() => setShowNavMenu(!showNavMenu)}
              className="w-10 h-10 rounded-xl bg-surface border border-theme flex items-center justify-center text-theme-primary hover:bg-elevated transition-colors"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
            {showNavMenu && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowNavMenu(false)} />
                <div className="absolute right-0 top-12 z-40 bg-surface border border-theme rounded-2xl shadow-elevated py-1 w-44">
                  {navItems.map(({ icon: Icon, label, href }) => (
                    <Link
                      key={label}
                      href={href}
                      onClick={() => setShowNavMenu(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-elevated text-theme-primary transition-colors"
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{label}</span>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-surface border border-theme rounded-2xl p-6 mb-4 shadow-soft">
          <div className="flex flex-col items-center">
            {/* Avatar */}
            <div className="p-0.5 rounded-full bg-gradient-to-br from-primary to-red-400 mb-4">
              <div className="w-[90px] h-[90px] rounded-full bg-elevated flex items-center justify-center text-3xl font-bold text-theme-muted border-[3px] border-surface">
                T
              </div>
            </div>

            {/* Name + verified */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl font-bold text-theme-primary">{sellerInfo.name}</span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-500/15 text-blue-500 text-[11px] font-medium rounded">
                <BadgeCheck className="w-3 h-3" />
                Verified
              </span>
            </div>

            {/* Stats */}
            <div className="w-full bg-elevated rounded-xl py-3 px-4 mb-3">
              <div className="flex items-center justify-around">
                <StatItem icon={Star} value="4.5/5" label="Rating" iconClass="text-amber-400 fill-amber-400" />
                <div className="w-px h-8 bg-theme" />
                <StatItem icon={Users} value="1.2K" label="Followers" iconClass="text-theme-muted" />
                <div className="w-px h-8 bg-theme" />
                <StatItem icon={Calendar} value="Jan 2025" label="Joined" iconClass="text-theme-muted" />
              </div>
            </div>

            {/* Reply time */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/15 rounded-full mb-5">
              <Zap className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                Typically replies within 1 hour
              </span>
            </div>

            {/* Follow */}
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={`w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors ${
                isFollowing
                  ? 'bg-elevated border border-theme text-theme-primary'
                  : 'bg-primary text-white hover:bg-primary-hover'
              }`}
            >
              {isFollowing ? (
                <><Check className="w-4 h-4" /> Following</>
              ) : (
                <><Users className="w-4 h-4" /> Follow</>
              )}
            </button>
          </div>
        </div>

        {/* About (Accordion) */}
        <div className="bg-surface border border-theme rounded-2xl mb-4 shadow-soft overflow-hidden">
          <button
            onClick={() => setIsAboutExpanded(!isAboutExpanded)}
            className="w-full px-5 py-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-primary" />
              <span className="text-lg font-semibold text-theme-primary">About</span>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-theme-muted transition-transform duration-200 ${
                isAboutExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>
          {isAboutExpanded && (
            <div className="px-5 pb-5 space-y-4">
              <div className="p-4 bg-elevated rounded-xl">
                <p className="text-sm text-theme-secondary leading-relaxed">
                  {sellerInfo.description}
                </p>
              </div>
              <InfoRow icon={MapPin} text={sellerInfo.location} sub="Operating Location" />
              <InfoRow icon={Clock} text={sellerInfo.businessHours} sub="Business Hours" />
            </div>
          )}
        </div>

        {/* Products Section */}
        <div className="bg-surface border border-theme rounded-2xl p-4 shadow-soft">
          <h2 className="text-lg font-semibold text-theme-primary mb-4">Products</h2>

          {/* Filter row */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1 hide-scrollbar">
            <button className="flex-shrink-0 px-4 py-2 bg-primary text-white text-sm font-medium rounded-full">
              All Items
            </button>
            <button
              onClick={() => setShowSortSheet(true)}
              className="flex-shrink-0 flex items-center gap-1 px-3 py-2 bg-elevated border border-theme text-sm font-medium rounded-full text-theme-primary"
            >
              {selectedSort}
              <ChevronDown className="w-4 h-4 text-theme-muted" />
            </button>
            <button
              onClick={() => setShowCategorySheet(true)}
              className="flex-shrink-0 flex items-center gap-1 px-3 py-2 bg-elevated border border-theme text-sm font-medium rounded-full text-theme-primary"
            >
              {selectedCategory}
              <ChevronDown className="w-4 h-4 text-theme-muted" />
            </button>
          </div>

          {/* Products grid */}
          <div className="grid grid-cols-2 gap-3">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-theme z-20 px-3 py-2">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link
            href="/"
            className="w-11 h-11 rounded-xl bg-elevated flex items-center justify-center flex-shrink-0"
          >
            <Home className="w-5 h-5 text-theme-primary" />
          </Link>
          <Link
            href="/contact"
            className="flex-1 flex items-center justify-center gap-2 py-3 border border-primary text-primary rounded-xl font-semibold hover:bg-primary/5 transition-colors"
          >
            <Phone className="w-4 h-4" />
            Call
          </Link>
          <Link
            href="/chat/1"
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Message
          </Link>
        </div>
      </div>

      {/* Sort Bottom Sheet */}
      {showSortSheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowSortSheet(false)} />
          <div className="relative bg-surface rounded-t-3xl w-full max-w-md p-5 animate-slide-up">
            <div className="w-10 h-1 bg-theme rounded-full mx-auto mb-5" />
            <h3 className="text-lg font-semibold text-theme-primary mb-4">Sort By</h3>
            <div className="space-y-1">
              {sortOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => { setSelectedSort(opt); setShowSortSheet(false); }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-elevated text-theme-primary transition-colors"
                >
                  <span className="text-sm font-medium">{opt}</span>
                  {selectedSort === opt && <Check className="w-4 h-4 text-primary" />}
                </button>
              ))}
            </div>
            <div className="h-4" />
          </div>
        </div>
      )}

      {/* Category Bottom Sheet */}
      {showCategorySheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCategorySheet(false)} />
          <div className="relative bg-surface rounded-t-3xl w-full max-w-md p-5 animate-slide-up max-h-[70vh] flex flex-col">
            <div className="w-10 h-1 bg-theme rounded-full mx-auto mb-5" />
            <h3 className="text-lg font-semibold text-theme-primary mb-4">Categories</h3>
            <div className="overflow-y-auto space-y-1">
              {categoryOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => { setSelectedCategory(opt); setShowCategorySheet(false); }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-elevated text-theme-primary transition-colors"
                >
                  <span className="text-sm font-medium">{opt}</span>
                  {selectedCategory === opt && <Check className="w-4 h-4 text-primary" />}
                </button>
              ))}
            </div>
            <div className="h-4" />
          </div>
        </div>
      )}
    </>
  );
}

function StatItem({
  icon: Icon,
  value,
  label,
  iconClass,
}: {
  icon: React.ElementType;
  value: string;
  label: string;
  iconClass: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-1 mb-0.5">
        <Icon className={`w-3.5 h-3.5 ${iconClass}`} />
        <span className="text-sm font-semibold text-theme-primary">{value}</span>
      </div>
      <span className="text-[11px] text-theme-muted">{label}</span>
    </div>
  );
}

function InfoRow({ icon: Icon, text, sub }: { icon: React.ElementType; text: string; sub: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-elevated flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-theme-muted" />
      </div>
      <div>
        <p className="font-medium text-sm text-theme-primary">{text}</p>
        <p className="text-xs text-theme-muted">{sub}</p>
      </div>
    </div>
  );
}
