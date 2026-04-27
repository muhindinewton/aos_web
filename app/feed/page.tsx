'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Bell,
  ChevronDown,
  Play,
  Eye,
  ThumbsUp,
  MessageCircle,
  Share2,
  Bookmark,
  ArrowLeft,
  MoreHorizontal,
  Check,
  Plus,
  X,
  Send,
  ShoppingCart,
  BadgeCheck,
  Heart,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────
interface FeaturedProduct {
  id?: string;
  name: string;
  price: string;
  originalPrice?: string;
  discount?: string;
}

interface FeedItem {
  id: string;
  type: 'video' | 'live';
  videoUrl: string;
  duration?: string;
  description?: string;
  hashtags?: string[];
  creatorName: string;
  creatorAvatar: string;
  isVerified?: boolean;
  isLive?: boolean;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  viewerCount?: number;
  featuredProducts?: FeaturedProduct[];
}

interface SuggestedCreator {
  name: string;
  avatar: string;
  followers: string;
  isVerified: boolean;
  avatarUrl: string;
}

// ── Mock Data ──────────────────────────────────────────────
const SEED_FEED: FeedItem[] = [
  {
    id: '1', type: 'video',
    videoUrl: 'https://picsum.photos/seed/feed1/400/600',
    duration: '0:22', isVerified: true,
    description: 'This hologram fan is INSANE! Perfect for your shop or events. Watch till the end — DM for bulk orders',
    hashtags: ['#hologramfan', '#businessideas', '#shopsetup', '#viral'],
    creatorName: 'ACEHOLO Official', creatorAvatar: 'A',
    likeCount: 2847, commentCount: 156, shareCount: 892,
    featuredProducts: [
      { id: '3', name: 'Samsung 55" Smart TV', price: 'Ksh 65,000', originalPrice: 'Ksh 78,000', discount: '17% off' },
      { id: '6', name: 'PS5 Console', price: 'Ksh 75,000' },
      { id: '4', name: 'Dell Laptop 15"', price: 'Ksh 55,000' },
    ],
  },
  {
    id: '3', type: 'video',
    videoUrl: 'https://picsum.photos/seed/feed3/400/600',
    duration: '0:22',
    description: 'Unboxing the iPhone 14 Pro Max! Camera quality is absolutely crazy. Watch me test it in low light vs my old phone!',
    hashtags: ['#unboxing', '#iphone', '#techkenya', '#phonereview'],
    creatorName: 'Tech Gadgets', creatorAvatar: 'T',
    likeCount: 1825, commentCount: 234, shareCount: 156,
    featuredProducts: [
      { id: '2', name: 'iPhone 14 Pro Max', price: 'Ksh 145,000', originalPrice: 'Ksh 165,000', discount: '12% off' },
      { id: '3', name: 'Samsung Galaxy S24', price: 'Ksh 125,000' },
      { id: '4', name: 'MacBook Pro M2', price: 'Ksh 185,000' },
    ],
  },
  {
    id: '5', type: 'live',
    videoUrl: 'https://picsum.photos/seed/feed5/400/600',
    description: 'LIVE NOW: Fashion collection drop! First 50 buyers get an exclusive discount',
    creatorName: 'Fashion Hub', creatorAvatar: 'F',
    isLive: true, viewerCount: 1250,
    likeCount: 3400, commentCount: 256, shareCount: 89,
    featuredProducts: [
      { id: '8', name: 'Designer Dress', price: 'Ksh 8,500' },
      { id: '9', name: "Men's Suit Set", price: 'Ksh 15,000' },
      { id: '7', name: 'Sneakers Nike Air', price: 'Ksh 12,000' },
      { id: '10', name: 'Handbag Leather', price: 'Ksh 6,500' },
    ],
  },
  {
    id: '6', type: 'video',
    videoUrl: 'https://picsum.photos/seed/feed6/400/600',
    duration: '0:35',
    description: 'These just landed! Limited edition Nike Air — only 20 pairs in Kenya. Comment your size before they are gone! 100% authentic',
    hashtags: ['#sneakers', '#sneakerhead', '#kickskenya', '#limited'],
    creatorName: 'SneakerHead KE', creatorAvatar: 'S',
    likeCount: 892, commentCount: 145, shareCount: 67,
    featuredProducts: [
      { id: '7', name: 'Sneakers Nike Air', price: 'Ksh 12,000' },
      { id: '10', name: 'Handbag Leather', price: 'Ksh 6,500' },
    ],
  },
  {
    id: '8', type: 'video',
    videoUrl: 'https://picsum.photos/seed/feed8/400/600',
    duration: '0:18',
    description: 'FULL REVIEW: Toyota Axio 2015! Fuel efficient and reliable. Perfect for Nairobi traffic! Drop a comment for more car reviews',
    hashtags: ['#carreview', '#toyota', '#axio', '#carskenya'],
    creatorName: 'AutoKenya', creatorAvatar: 'A',
    likeCount: 2310, commentCount: 198, shareCount: 312,
    featuredProducts: [
      { id: '1', name: 'Toyota Axio 2015', price: 'Ksh 1,450,000', originalPrice: 'Ksh 1,650,000', discount: '12% off' },
      { id: '12', name: 'Honda CRV 2018', price: 'Ksh 2,800,000', originalPrice: 'Ksh 3,100,000', discount: '10% off' },
    ],
  },
  {
    id: '10', type: 'video',
    videoUrl: 'https://picsum.photos/seed/feed10/400/600',
    duration: '0:45', isVerified: true,
    description: 'HOME GYM SETUP! No more gym fees — this equipment set is amazing! Flash sale ending tonight',
    hashtags: ['#homegym', '#fitness', '#workout', '#fitkenya'],
    creatorName: 'FitGear Africa', creatorAvatar: 'F',
    likeCount: 3780, commentCount: 420, shareCount: 178,
    featuredProducts: [
      { id: '15', name: 'Gym Equipment Set', price: 'Ksh 120,000' },
      { id: '16', name: 'Treadmill Pro', price: 'Ksh 95,000' },
      { id: '17', name: 'Dumbbell Set 50kg', price: 'Ksh 18,000' },
      { id: '18', name: 'Exercise Bike', price: 'Ksh 35,000' },
    ],
  },
  {
    id: '11', type: 'live',
    videoUrl: 'https://picsum.photos/seed/feed11/400/600',
    isVerified: true,
    description: 'LIVE: Baby products showcase + giving away strollers! Stay till the end',
    creatorName: 'Baby World KE', creatorAvatar: 'B',
    isLive: true, viewerCount: 847,
    likeCount: 2100, commentCount: 534, shareCount: 67,
    featuredProducts: [
      { id: '20', name: 'Baby Stroller Deluxe', price: 'Ksh 18,000', originalPrice: 'Ksh 22,000', discount: '18% off' },
      { id: '21', name: 'Air Conditioner 24K BTU', price: 'Ksh 48,000', originalPrice: 'Ksh 58,000', discount: '17% off' },
    ],
  },
];

const SAVED_IDS_DEFAULT = new Set(['1', '3', '5', '10']);

const SUGGESTED_CREATORS: SuggestedCreator[] = [
  { name: 'SneakerHead KE', avatar: 'S', followers: '14.3k', isVerified: true,  avatarUrl: 'https://picsum.photos/seed/cr1/100/100' },
  { name: 'NairobiTech',    avatar: 'N', followers: '9.4k',  isVerified: true,  avatarUrl: 'https://picsum.photos/seed/cr2/100/100' },
  { name: 'FitGear Africa', avatar: 'F', followers: '25.1k', isVerified: true,  avatarUrl: 'https://picsum.photos/seed/cr3/100/100' },
  { name: 'HomeChef Pro',   avatar: 'H', followers: '8.7k',  isVerified: false, avatarUrl: 'https://picsum.photos/seed/cr4/100/100' },
  { name: 'Beauty Equipment', avatar: 'B', followers: '31.2k', isVerified: true, avatarUrl: 'https://picsum.photos/seed/cr5/100/100' },
  { name: 'Style Kenya',    avatar: 'K', followers: '18.9k', isVerified: false, avatarUrl: 'https://picsum.photos/seed/cr6/100/100' },
];

const BASE_COMMENTS = [
  { user: 'Sarah M.', av: 'S', comment: 'This is amazing! Where can I get one?', time: '2h ago', likes: 24, liked: false },
  { user: 'John K.',  av: 'J', comment: 'Great quality products as always!',     time: '3h ago', likes: 18, liked: true  },
  { user: 'Emma W.',  av: 'E', comment: "Just ordered mine, can't wait!",         time: '5h ago', likes: 12, liked: false },
  { user: 'Mike R.',  av: 'M', comment: 'Best seller in Nairobi! Highly recommend', time: '1d ago', likes: 45, liked: false },
  { user: 'Lucy N.',  av: 'L', comment: 'Do you have this in other colours?', time: '1d ago', likes: 8, liked: false },
];

const fmt = (n: number) =>
  n >= 1_000_000 ? (n / 1_000_000).toFixed(1) + 'M' : n >= 1000 ? (n / 1000).toFixed(1) + 'K' : String(n);

// ── Comments Sheet ─────────────────────────────────────────
function CommentsSheet({ item, onClose }: { item: FeedItem; onClose: () => void }) {
  const [text, setText] = React.useState('');
  const [comments, setComments] = React.useState(BASE_COMMENTS.map(c => ({ ...c })));

  const addComment = () => {
    if (!text.trim()) return;
    setComments(prev => [{ user: 'You', av: 'Y', comment: text.trim(), time: 'Just now', likes: 0, liked: false }, ...prev]);
    setText('');
  };

  return (
    <div className="fixed inset-0 z-[200] flex flex-col justify-end bg-black/50" onClick={onClose}>
      <div
        className="bg-surface rounded-t-2xl w-full max-w-xl mx-auto overflow-hidden"
        style={{ maxHeight: '80vh' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-elevated" />
        </div>
        <div className="px-4 py-2 border-b border-theme">
          <p className="font-semibold text-theme-primary">
            {fmt(item.commentCount + comments.length - BASE_COMMENTS.length)} Comments
          </p>
        </div>
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(80vh - 140px)' }}>
          {comments.map((c, i) => (
            <div key={i} className="flex gap-3 px-4 py-3 border-b border-theme last:border-0">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-primary text-sm font-bold">{c.av}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-theme-primary">{c.user}</span>
                  <span className="text-xs text-theme-muted">{c.time}</span>
                </div>
                <p className="text-sm text-theme-primary mt-0.5 leading-snug">{c.comment}</p>
                <div className="flex items-center gap-4 mt-2">
                  <button
                    className="flex items-center gap-1"
                    onClick={() => setComments(prev => prev.map((cc, idx) =>
                      idx === i ? { ...cc, liked: !cc.liked, likes: cc.liked ? cc.likes - 1 : cc.likes + 1 } : cc
                    ))}
                  >
                    <Heart className={`w-3.5 h-3.5 ${c.liked ? 'fill-primary text-primary' : 'text-theme-muted'}`} />
                    <span className="text-xs text-theme-muted">{c.likes}</span>
                  </button>
                  <button className="text-xs text-theme-muted font-medium">Reply</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 px-4 py-3 border-t border-theme">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">Y</span>
          </div>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addComment()}
            placeholder="Add a comment..."
            className="flex-1 bg-elevated rounded-full px-4 py-2 text-sm text-theme-primary placeholder:text-theme-muted outline-none border border-theme focus:border-primary"
          />
          <button onClick={addComment} className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Options Sheet ──────────────────────────────────────────
function OptionsSheet({ item, onClose }: { item: FeedItem; onClose: () => void }) {
  const options = [
    { icon: <Eye className="w-5 h-5" />, title: 'Remove the post', sub: 'Show me less of this type of feed content.' },
    { icon: <X className="w-5 h-5" />, title: 'Block the creator', sub: `I no longer want to see posts from ${item.creatorName}` },
    { icon: <MessageCircle className="w-5 h-5" />, title: 'Report the profile/post', sub: 'I would like to express concerns' },
  ];
  return (
    <div className="fixed inset-0 z-[200] flex flex-col justify-end bg-black/50" onClick={onClose}>
      <div className="bg-surface rounded-t-2xl w-full max-w-xl mx-auto pb-8" onClick={e => e.stopPropagation()}>
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-elevated" />
        </div>
        {options.map((opt, i) => (
          <button key={i} onClick={onClose} className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-elevated transition-colors">
            <span className="text-theme-muted">{opt.icon}</span>
            <div>
              <p className="font-medium text-theme-primary text-sm">{opt.title}</p>
              <p className="text-xs text-theme-muted mt-0.5">{opt.sub}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Full Screen View ───────────────────────────────────────
function FullScreenView({ item, allItems, onClose }: { item: FeedItem; allItems: FeedItem[]; onClose: () => void }) {
  const [currentIdx, setCurrentIdx] = React.useState(() => Math.max(0, allItems.findIndex(i => i.id === item.id)));
  const [isLiked, setIsLiked] = React.useState(false);
  const [savedIds, setSavedIds] = React.useState(new Set(SAVED_IDS_DEFAULT));
  const [isFollowing, setIsFollowing] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [showComments, setShowComments] = React.useState(false);
  const [showOptions, setShowOptions] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const current = allItems[currentIdx] ?? item;
  const isSaved = savedIds.has(current.id);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const idx = Math.round(el.scrollTop / el.clientHeight);
    if (idx !== currentIdx && idx >= 0 && idx < allItems.length) {
      setCurrentIdx(idx);
      setExpanded(false);
      setIsLiked(false);
      setIsFollowing(false);
    }
  };

  const toggleSave = () =>
    setSavedIds(prev => {
      const n = new Set(prev);
      n.has(current.id) ? n.delete(current.id) : n.add(current.id);
      return n;
    });

  return (
    <div className="fixed inset-0 z-[150] bg-black">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-scroll snap-y snap-mandatory hide-scrollbar"
      >
        {allItems.map((fi) => (
          /* Each slide fills the viewport; content is centred in a portrait frame */
          <div
            key={fi.id}
            className="relative w-full snap-start snap-always flex-shrink-0 flex items-center justify-center bg-black"
            style={{ height: '100vh' }}
          >
            {/* ── Portrait frame — 9:16, max iPhone-width, centred ── */}
            <div
              className="relative h-full overflow-hidden flex-shrink-0"
              style={{ width: 'min(calc(100vh * 9 / 16), 100vw)', maxWidth: 430 }}
            >
              {/* Background */}
              <img src={fi.videoUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/85" />

              {/* Top header */}
              <div className="absolute top-0 left-0 right-0 z-10 flex items-center gap-2 px-3 pt-12 pb-4">
                <button onClick={onClose} className="w-10 h-10 flex items-center justify-center">
                  <ArrowLeft className="w-6 h-6 text-white" />
                </button>
                <div className="flex-1">
                  {fi.isLive ? (
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-primary text-white text-xs font-bold tracking-wide">LIVE</span>
                      {fi.viewerCount && (
                        <>
                          <Eye className="w-4 h-4 text-white" />
                          <span className="text-white text-sm font-medium">{fmt(fi.viewerCount)}</span>
                        </>
                      )}
                    </div>
                  ) : (
                    <span className="text-white font-semibold text-base">Recommended For You</span>
                  )}
                </div>
                <button
                  onClick={() => { setCurrentIdx(allItems.findIndex(i => i.id === fi.id)); setShowOptions(true); }}
                  className="w-10 h-10 flex items-center justify-center"
                >
                  <MoreHorizontal className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Right side actions */}
              <div className="absolute right-3 z-10 flex flex-col items-center gap-5" style={{ bottom: 200 }}>
                {/* Avatar + follow */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-2 border-white bg-white/20 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{fi.creatorAvatar}</span>
                  </div>
                  <button
                    onClick={() => setIsFollowing(f => !f)}
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: isFollowing ? 'white' : 'var(--primary)' }}
                  >
                    {isFollowing
                      ? <Check className="w-3.5 h-3.5 text-primary" />
                      : <Plus className="w-3.5 h-3.5 text-white" />}
                  </button>
                </div>

                {/* Like */}
                <button onClick={() => setIsLiked(l => !l)} className="flex flex-col items-center gap-1 mt-2">
                  <ThumbsUp className={`w-7 h-7 drop-shadow ${isLiked ? 'fill-primary text-primary' : 'text-white'}`} />
                  <span className="text-white text-xs font-medium">{fmt(fi.likeCount + (isLiked ? 1 : 0))}</span>
                </button>

                {/* Comments */}
                <button
                  onClick={() => { setCurrentIdx(allItems.findIndex(i => i.id === fi.id)); setShowComments(true); }}
                  className="flex flex-col items-center gap-1"
                >
                  <MessageCircle className="w-7 h-7 text-white drop-shadow" />
                  <span className="text-white text-xs font-medium">{fmt(fi.commentCount)}</span>
                </button>

                {/* Share */}
                <button className="flex flex-col items-center gap-1">
                  <Share2 className="w-7 h-7 text-white drop-shadow" />
                  <span className="text-white text-xs font-medium">{fmt(fi.shareCount)}</span>
                </button>

                {/* Save */}
                <button onClick={toggleSave} className="flex flex-col items-center gap-1">
                  <Bookmark className={`w-7 h-7 drop-shadow ${isSaved ? 'fill-primary text-primary' : 'text-white'}`} />
                  <span className="text-white text-xs font-medium">Save</span>
                </button>
              </div>

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 z-10 pb-8 px-4" style={{ right: 76 }}>
                {/* Products carousel */}
                {fi.featuredProducts && fi.featuredProducts.length > 0 && (
                  <div className="mb-3">
                    <p className="text-white/70 text-xs font-medium mb-2">
                      {fi.featuredProducts.length} product{fi.featuredProducts.length > 1 ? 's' : ''} featured
                    </p>
                    <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1" style={{ height: 100 }}>
                      {fi.featuredProducts.map((p, pi) => (
                        <Link key={pi} href={p.id ? `/product/${p.id}` : `/shop?q=${encodeURIComponent(p.name)}`} onClick={e => e.stopPropagation()} className="flex-shrink-0 w-64 h-full bg-white rounded-xl p-2 flex items-center gap-2 hover:shadow-md transition-shadow">
                          <img
                            src={`https://picsum.photos/seed/prod${fi.id}${pi}/70/70`}
                            alt={p.name}
                            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-800 line-clamp-2 leading-tight">{p.name}</p>
                            {p.discount && <p className="text-[10px] text-primary font-medium mt-0.5">{p.discount}</p>}
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-sm font-bold text-primary">{p.price}</span>
                              {p.originalPrice && (
                                <span className="text-[10px] text-gray-400 line-through">{p.originalPrice}</span>
                              )}
                            </div>
                          </div>
                          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                            <ShoppingCart className="w-4 h-4 text-white" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Expandable description */}
                {fi.description && (
                  <button className="text-left w-full mb-3" onClick={() => setExpanded(e => !e)}>
                    <span className={`text-white text-sm leading-snug ${expanded ? '' : 'line-clamp-2'}`}>
                      {fi.description}
                    </span>
                    {!expanded && (fi.description.length > 80 || (fi.hashtags && fi.hashtags.length > 0)) && (
                      <span className="text-white/70 text-sm font-semibold"> more</span>
                    )}
                    {expanded && fi.hashtags && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {fi.hashtags.map(tag => (
                          <span key={tag} className="text-xs font-medium text-blue-400">{tag}</span>
                        ))}
                      </div>
                    )}
                  </button>
                )}

                {/* Creator row */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-base">{fi.creatorAvatar}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-white font-semibold text-sm">{fi.creatorName}</span>
                      {fi.isVerified && <BadgeCheck className="w-4 h-4 text-blue-400" />}
                    </div>
                    {fi.isLive && (
                      <span className="inline-block px-1.5 py-0.5 rounded bg-primary text-white text-[10px] font-bold tracking-wide mt-0.5">
                        LIVE
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* ── end portrait frame ── */}
          </div>
        ))}
      </div>

      {showComments && <CommentsSheet item={current} onClose={() => setShowComments(false)} />}
      {showOptions  && <OptionsSheet  item={current} onClose={() => setShowOptions(false)} />}
    </div>
  );
}

// ── Feed Card (masonry grid) ───────────────────────────────
function FeedCard({ item, onTap }: { item: FeedItem; onTap: () => void }) {
  return (
    <button
      onClick={onTap}
      className="w-full text-left rounded-2xl overflow-hidden bg-surface shadow-sm border border-theme hover:shadow-md transition-shadow mb-2 block"
    >
      {/* Portrait thumbnail */}
      <div className="relative aspect-[3/4]">
        <img src={item.videoUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />

        {/* Duration badge */}
        {item.duration && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/55 backdrop-blur-sm">
            <Play className="w-2.5 h-2.5 text-white" fill="white" />
            <span className="text-white text-[10px] font-semibold">{item.duration}</span>
          </div>
        )}
        {/* LIVE badge */}
        {item.isLive && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-1 rounded-lg bg-primary">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-white text-[10px] font-bold tracking-wide">LIVE</span>
          </div>
        )}
        {/* Viewer count */}
        {item.isLive && item.viewerCount && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/55 backdrop-blur-sm">
            <Eye className="w-2.5 h-2.5 text-white" />
            <span className="text-white text-[10px] font-semibold">{fmt(item.viewerCount)}</span>
          </div>
        )}
      </div>

      {/* Info below image */}
      <div className="px-2.5 pt-2 pb-2.5">
        <p className="text-xs font-medium text-theme-primary line-clamp-2 leading-snug mb-2">
          {item.description ?? item.featuredProducts?.[0]?.name ?? ''}
        </p>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-primary text-[10px] font-bold">{item.creatorAvatar}</span>
          </div>
          <span className="text-[11px] text-theme-secondary font-medium truncate flex-1">{item.creatorName}</span>
          <span className="text-[11px] text-theme-muted">{fmt(item.likeCount)}</span>
          <ThumbsUp className="w-3 h-3 text-theme-muted" />
        </div>
      </div>
    </button>
  );
}

// ── Masonry Grid ───────────────────────────────────────────
function MasonryGrid({ items, onItemTap }: { items: FeedItem[]; onItemTap: (item: FeedItem) => void }) {
  const left  = items.filter((_, i) => i % 2 === 0);
  const right = items.filter((_, i) => i % 2 !== 0);
  return (
    <div className="flex gap-3 px-4 pb-6">
      <div className="flex-1 flex flex-col">
        {left.map(item => <FeedCard key={item.id} item={item} onTap={() => onItemTap(item)} />)}
      </div>
      <div className="flex-1 flex flex-col">
        {right.map(item => <FeedCard key={item.id} item={item} onTap={() => onItemTap(item)} />)}
      </div>
    </div>
  );
}

// ── Suggested Creator Card ─────────────────────────────────
function SuggestedCreatorCard({
  creator, isFollowed, onToggle,
}: { creator: SuggestedCreator; isFollowed: boolean; onToggle: () => void }) {
  return (
    <div className="w-[130px] flex-shrink-0 flex flex-col items-center bg-theme rounded-xl border border-theme p-2 gap-1">
      <div className="w-full flex justify-end">
        <button className="w-5 h-5 flex items-center justify-center text-theme-muted">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="relative">
        <img src={creator.avatarUrl} alt={creator.name} className="w-11 h-11 rounded-full object-cover bg-elevated" />
        {creator.isVerified && (
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
            <Check className="w-2.5 h-2.5 text-white" />
          </div>
        )}
      </div>
      <p className="text-xs font-semibold text-theme-primary text-center line-clamp-1 w-full">{creator.name}</p>
      <p className="text-[10px] text-theme-muted">{creator.followers} Followers</p>
      <button
        onClick={onToggle}
        className="w-full py-1.5 rounded-lg text-xs font-semibold transition-colors"
        style={{ background: isFollowed ? 'var(--elevated)' : 'var(--primary)', color: isFollowed ? 'var(--text-primary)' : 'white' }}
      >
        {isFollowed ? 'Following' : 'Follow'}
      </button>
    </div>
  );
}

// ── Main Feed Page ─────────────────────────────────────────
export default function FeedPage() {
  const [tab, setTab]                   = useState<'foryou' | 'following' | 'saved'>('foryou');
  const [search, setSearch]             = useState('');
  const [filter, setFilter]             = useState<'all' | 'live' | 'video'>('all');
  const [openItem, setOpenItem]         = useState<FeedItem | null>(null);
  const [followedCreators, setFollowed] = useState<Set<string>>(new Set());

  const toggleFollow = (name: string) =>
    setFollowed(prev => { const n = new Set(prev); n.has(name) ? n.delete(name) : n.add(name); return n; });

  const filteredItems = SEED_FEED.filter(item => {
    if (filter === 'live'  && !item.isLive) return false;
    if (filter === 'video' &&  item.isLive) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        item.creatorName.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.hashtags?.some(t => t.toLowerCase().includes(q)) ||
        item.featuredProducts?.some(p => p.name.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const savedItems    = SEED_FEED.filter(i => SAVED_IDS_DEFAULT.has(i.id));
  const followedPosts = SEED_FEED.filter(i => followedCreators.has(i.creatorName));

  return (
    <div className="min-h-screen bg-theme">

      {/* ── Header ── */}
      <div className="sticky top-0 z-30 bg-surface border-b border-theme px-4 py-3">
        <div className="flex items-center gap-2 max-w-2xl mx-auto">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search feed..."
              className="w-full bg-elevated rounded-full py-2.5 pl-9 pr-4 text-sm text-theme-primary placeholder:text-theme-muted outline-none border border-theme focus:border-primary"
            />
          </div>
          {/* Filter dropdown */}
          <div className="relative flex items-center px-3 py-2.5 bg-elevated rounded-xl border border-theme">
            <select
              value={filter}
              onChange={e => setFilter(e.target.value as typeof filter)}
              className="appearance-none bg-transparent outline-none text-theme-primary text-sm pr-5 cursor-pointer"
            >
              <option value="all">All</option>
              <option value="live">Live</option>
              <option value="video">Shorts</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted pointer-events-none" />
          </div>
          {/* Notification bell */}
          <div className="relative">
            <button className="w-10 h-10 rounded-full bg-elevated border border-theme flex items-center justify-center">
              <Bell className="w-5 h-5 text-theme-muted" />
            </button>
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white text-[9px] font-bold">3</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div className="sticky bg-surface border-b border-theme max-w-2xl mx-auto px-4" style={{ top: 65, zIndex: 20 }}>
        <div className="flex gap-6">
          {(['foryou', 'following', 'saved'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-3 text-sm font-semibold border-b-[3px] transition-colors ${
                tab === t ? 'text-theme-primary border-primary' : 'text-theme-muted border-transparent'
              }`}
            >
              {t === 'foryou' ? 'For You' : t === 'following' ? 'Following' : 'Saved'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="max-w-2xl mx-auto pt-2">

        {/* For You */}
        {tab === 'foryou' && (
          filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-theme-muted">
              <Search className="w-16 h-16 mb-4 opacity-30" />
              <p className="font-semibold text-base">
                {search
                  ? `No results for "${search}"`
                  : `No ${filter === 'live' ? 'live streams' : filter === 'video' ? 'shorts' : 'content'} found`}
              </p>
              <p className="text-sm mt-1">{search ? 'Try different keywords' : 'Check back later'}</p>
            </div>
          ) : (
            <MasonryGrid items={filteredItems} onItemTap={setOpenItem} />
          )
        )}

        {/* Following */}
        {tab === 'following' && (
          <div className="px-4 py-4 space-y-6">
            {/* Suggested creators */}
            <div className="bg-surface rounded-2xl border border-theme p-4">
              <p className="text-sm font-medium text-theme-muted mb-4">Suggested for You</p>
              <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
                {SUGGESTED_CREATORS.map(c => (
                  <SuggestedCreatorCard
                    key={c.name}
                    creator={c}
                    isFollowed={followedCreators.has(c.name)}
                    onToggle={() => toggleFollow(c.name)}
                  />
                ))}
              </div>
            </div>

            {/* Posts from followed */}
            {followedPosts.length > 0 && (
              <>
                <p className="font-semibold text-theme-primary">From People You Follow</p>
                <MasonryGrid items={followedPosts} onItemTap={setOpenItem} />
              </>
            )}

            <button
              onClick={() => setTab('foryou')}
              className="w-full py-3 bg-primary text-white font-semibold rounded-xl tracking-wide text-sm"
            >
              EXPLORE MORE
            </button>
          </div>
        )}

        {/* Saved */}
        {tab === 'saved' && (
          savedItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-theme-muted">
              <Bookmark className="w-16 h-16 mb-4 opacity-30" />
              <p className="font-semibold text-base">No saved posts yet</p>
              <p className="text-sm mt-1">Tap the bookmark icon to save posts</p>
            </div>
          ) : (
            <MasonryGrid items={savedItems} onItemTap={setOpenItem} />
          )
        )}

      </div>

      {/* Full Screen View overlay */}
      {openItem && (
        <FullScreenView item={openItem} allItems={SEED_FEED} onClose={() => setOpenItem(null)} />
      )}
    </div>
  );
}
