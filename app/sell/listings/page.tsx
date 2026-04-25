'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Plus, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  ToggleLeft, 
  ToggleRight,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  MessageCircle,
  Heart
} from 'lucide-react';

type ListingStatus = 'active' | 'pending' | 'sold' | 'expired' | 'draft';

interface Listing {
  id: string;
  title: string;
  price: string;
  image: string;
  status: ListingStatus;
  views: number;
  likes: number;
  messages: number;
  createdAt: string;
  expiresAt?: string;
}

const mockListings: Listing[] = [
  {
    id: '1',
    title: 'iPhone 14 Pro Max 256GB Space Black',
    price: 'KES 145,000',
    image: 'https://picsum.photos/seed/l1/400/300',
    status: 'active',
    views: 234,
    likes: 18,
    messages: 5,
    createdAt: '2026-04-01',
    expiresAt: '2026-05-01',
  },
  {
    id: '2',
    title: 'Samsung 55" Smart TV Crystal UHD',
    price: 'KES 65,000',
    image: 'https://picsum.photos/seed/l2/400/300',
    status: 'active',
    views: 156,
    likes: 12,
    messages: 3,
    createdAt: '2026-03-28',
    expiresAt: '2026-04-28',
  },
  {
    id: '3',
    title: 'Toyota Axio 2015 Model',
    price: 'KES 1,450,000',
    image: 'https://picsum.photos/seed/l3/400/300',
    status: 'pending',
    views: 0,
    likes: 0,
    messages: 0,
    createdAt: '2026-04-07',
  },
  {
    id: '4',
    title: 'MacBook Pro M2 14-inch',
    price: 'KES 185,000',
    image: 'https://picsum.photos/seed/l4/400/300',
    status: 'sold',
    views: 512,
    likes: 45,
    messages: 12,
    createdAt: '2026-03-15',
  },
  {
    id: '5',
    title: 'Leather Sofa Set 7-Seater',
    price: 'KES 85,000',
    image: 'https://picsum.photos/seed/l5/400/300',
    status: 'expired',
    views: 89,
    likes: 6,
    messages: 2,
    createdAt: '2026-02-01',
    expiresAt: '2026-03-01',
  },
  {
    id: '6',
    title: 'Nike Air Jordan 1 High',
    price: 'KES 18,500',
    image: 'https://picsum.photos/seed/l6/400/300',
    status: 'draft',
    views: 0,
    likes: 0,
    messages: 0,
    createdAt: '2026-04-05',
  },
];

const statusConfig: Record<ListingStatus, { label: string; color: string; icon: React.ElementType }> = {
  active: { label: 'Active', color: 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400', icon: CheckCircle },
  pending: { label: 'Pending Review', color: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400', icon: Clock },
  sold: { label: 'Sold', color: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400', icon: CheckCircle },
  expired: { label: 'Expired', color: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400', icon: XCircle },
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400', icon: Edit },
};

const tabs: { key: ListingStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'pending', label: 'Pending' },
  { key: 'sold', label: 'Sold' },
  { key: 'expired', label: 'Expired' },
  { key: 'draft', label: 'Drafts' },
];

export default function MyListingsPage() {
  const [activeTab, setActiveTab] = useState<ListingStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMenu, setShowMenu] = useState<string | null>(null);

  const filteredListings = mockListings.filter(listing => {
    const matchesTab = activeTab === 'all' || listing.status === activeTab;
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const stats = {
    total: mockListings.length,
    active: mockListings.filter(l => l.status === 'active').length,
    views: mockListings.reduce((sum, l) => sum + l.views, 0),
    messages: mockListings.reduce((sum, l) => sum + l.messages, 0),
  };

  return (
    <div className="min-h-screen bg-theme pb-20 md:pb-0">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-surface border-b border-theme">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/sell" className="p-2 rounded-xl border border-theme hover:bg-elevated transition-colors">
              <ArrowLeft className="w-5 h-5 text-theme-primary" />
            </Link>
            <h1 className="text-lg font-bold text-theme-primary">My Listings</h1>
          </div>
          <Link
            href="/sell/post"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-hover transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Listing
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-surface border border-theme rounded-xl p-4">
            <p className="text-2xl font-bold text-theme-primary">{stats.total}</p>
            <p className="text-sm text-theme-muted">Total Listings</p>
          </div>
          <div className="bg-surface border border-theme rounded-xl p-4">
            <p className="text-2xl font-bold text-green-500">{stats.active}</p>
            <p className="text-sm text-theme-muted">Active</p>
          </div>
          <div className="bg-surface border border-theme rounded-xl p-4">
            <div className="flex items-center gap-1">
              <Eye className="w-5 h-5 text-theme-muted" />
              <p className="text-2xl font-bold text-theme-primary">{stats.views}</p>
            </div>
            <p className="text-sm text-theme-muted">Total Views</p>
          </div>
          <div className="bg-surface border border-theme rounded-xl p-4">
            <div className="flex items-center gap-1">
              <MessageCircle className="w-5 h-5 text-theme-muted" />
              <p className="text-2xl font-bold text-theme-primary">{stats.messages}</p>
            </div>
            <p className="text-sm text-theme-muted">Messages</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search listings..."
              className="w-full bg-surface border border-theme rounded-xl py-2.5 pl-10 pr-4 text-theme-primary placeholder:text-theme-muted focus:outline-none focus:border-primary"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-surface border border-theme rounded-xl text-theme-secondary hover:bg-elevated transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1 mb-6">
          {tabs.map(tab => {
            const count = tab.key === 'all' 
              ? mockListings.length 
              : mockListings.filter(l => l.status === tab.key).length;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.key
                    ? 'bg-primary text-white'
                    : 'bg-surface border border-theme text-theme-secondary hover:text-theme-primary'
                }`}
              >
                {tab.label}
                <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                  activeTab === tab.key ? 'bg-white/20' : 'bg-elevated'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Listings */}
        {filteredListings.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-elevated flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-theme-muted" />
            </div>
            <h3 className="text-lg font-semibold text-theme-primary mb-1">No listings found</h3>
            <p className="text-sm text-theme-secondary mb-4">
              {searchQuery ? 'Try a different search term' : 'Start by creating your first listing'}
            </p>
            <Link
              href="/sell/post"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Listing
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredListings.map(listing => {
              const status = statusConfig[listing.status];
              const StatusIcon = status.icon;
              
              return (
                <div
                  key={listing.id}
                  className="bg-surface border border-theme rounded-xl p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-elevated flex-shrink-0">
                      <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link href={`/product/${listing.id}`} className="font-semibold text-theme-primary hover:text-primary line-clamp-1">
                            {listing.title}
                          </Link>
                          <p className="text-lg font-bold text-primary mt-0.5">{listing.price}</p>
                        </div>
                        <div className="relative">
                          <button
                            onClick={() => setShowMenu(showMenu === listing.id ? null : listing.id)}
                            className="p-2 rounded-lg hover:bg-elevated transition-colors"
                          >
                            <MoreVertical className="w-5 h-5 text-theme-muted" />
                          </button>
                          {showMenu === listing.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-surface border border-theme rounded-xl shadow-lg py-2 z-10">
                              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-theme-primary hover:bg-elevated transition-colors">
                                <Eye className="w-4 h-4" /> View Listing
                              </button>
                              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-theme-primary hover:bg-elevated transition-colors">
                                <Edit className="w-4 h-4" /> Edit
                              </button>
                              {listing.status === 'active' ? (
                                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-theme-primary hover:bg-elevated transition-colors">
                                  <ToggleLeft className="w-4 h-4" /> Deactivate
                                </button>
                              ) : listing.status === 'expired' || listing.status === 'draft' ? (
                                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-theme-primary hover:bg-elevated transition-colors">
                                  <ToggleRight className="w-4 h-4" /> Activate
                                </button>
                              ) : null}
                              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                                <Trash2 className="w-4 h-4" /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                        {listing.expiresAt && listing.status === 'active' && (
                          <span className="text-xs text-theme-muted">
                            Expires {new Date(listing.expiresAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 mt-3 text-sm text-theme-muted">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {listing.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {listing.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {listing.messages}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
