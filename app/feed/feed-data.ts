// Shared feed types + seed data used by feed pages and creator/profile pages.

export type FeedCategory = 'shop' | 'places' | 'vibes' | 'learn' | 'fun';

export interface FeaturedProduct {
  id?: string;
  name: string;
  price: string;
  originalPrice?: string;
  discount?: string;
}

export interface FeedItem {
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
  category: FeedCategory;
}

export interface SuggestedCreator {
  name: string;
  avatar: string;
  followers: string;
  isVerified: boolean;
  avatarUrl: string;
}

export interface CategoryMeta {
  key: FeedCategory | null;
  label: string;
  color: string;
}

// Mirrors mobile color palette for category chips + pills
export const CATEGORY_META: CategoryMeta[] = [
  { key: null,       label: 'All',       color: '#C1121F' },
  { key: 'shop',     label: 'Shop',      color: '#E53935' },
  { key: 'fun',      label: 'Fun',       color: '#F57C00' },
  { key: 'places',   label: 'Geography', color: '#43A047' },
  { key: 'vibes',    label: 'Talents',   color: '#8E24AA' },
  { key: 'learn',    label: 'Learn',     color: '#1E88E5' },
];

export const CATEGORY_COLOR: Record<FeedCategory, string> = {
  shop:   '#E53935',
  fun:    '#F57C00',
  places: '#43A047',
  vibes:  '#8E24AA',
  learn:  '#1E88E5',
};

export const CATEGORY_LABEL: Record<FeedCategory, string> = {
  shop:   'Shop',
  fun:    'Fun',
  places: 'Geography',
  vibes:  'Talents',
  learn:  'Learn',
};

export const SEED_FEED: FeedItem[] = [
  {
    id: '1', type: 'video',
    videoUrl: 'https://picsum.photos/seed/feed1/400/600',
    duration: '0:22', isVerified: true, category: 'shop',
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
    duration: '0:22', category: 'shop',
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
    category: 'shop',
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
    duration: '0:35', category: 'shop',
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
    duration: '0:18', category: 'shop',
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
    duration: '0:45', isVerified: true, category: 'shop',
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
    isVerified: true, category: 'shop',
    description: 'LIVE: Baby products showcase + giving away strollers! Stay till the end',
    creatorName: 'Baby World KE', creatorAvatar: 'B',
    isLive: true, viewerCount: 847,
    likeCount: 2100, commentCount: 534, shareCount: 67,
    featuredProducts: [
      { id: '20', name: 'Baby Stroller Deluxe', price: 'Ksh 18,000', originalPrice: 'Ksh 22,000', discount: '18% off' },
      { id: '21', name: 'Air Conditioner 24K BTU', price: 'Ksh 48,000', originalPrice: 'Ksh 58,000', discount: '17% off' },
    ],
  },
  // ── Geography / Places ─────────────────────────────────────
  {
    id: 'geo_1', type: 'video',
    videoUrl: 'https://picsum.photos/seed/geo1/400/600',
    duration: '1:12', isVerified: true, category: 'places',
    description: 'Sunrise at Maasai Mara — witness the Great Migration! Best time to visit is July–October.',
    hashtags: ['#maasaimara', '#safari', '#kenya', '#wildlife'],
    creatorName: 'Wild Kenya Tours', creatorAvatar: 'W',
    likeCount: 5240, commentCount: 312, shareCount: 890,
    featuredProducts: [
      { name: 'Maasai Mara Safari 3 Days', price: 'Ksh 45,000' },
      { name: 'Safari Binoculars Pro', price: 'Ksh 8,500' },
    ],
  },
  {
    id: 'geo_2', type: 'live',
    videoUrl: 'https://picsum.photos/seed/geo2/400/600',
    category: 'places',
    description: 'LIVE: Diani Beach sunset tour! Crystal clear waters and white sand. Cottage bookings open now!',
    creatorName: 'Coast KE Travel', creatorAvatar: 'C',
    isLive: true, viewerCount: 920,
    likeCount: 4100, commentCount: 310, shareCount: 195,
    featuredProducts: [
      { name: 'Diani Beach Cottage (2 nights)', price: 'Ksh 22,000' },
      { name: 'Snorkelling Gear Set', price: 'Ksh 5,500' },
    ],
  },
  {
    id: 'geo_3', type: 'video',
    videoUrl: 'https://picsum.photos/seed/geo3/400/600',
    duration: '0:47', isVerified: true, category: 'places',
    description: 'Lake Nakuru flamingo season! Thousands of flamingos paint the lake pink.',
    hashtags: ['#lakenakuru', '#flamingos', '#kenyawildlife'],
    creatorName: 'Nature Africa', creatorAvatar: 'N',
    likeCount: 6720, commentCount: 408, shareCount: 1240,
  },
  // ── Talents / Vibes ────────────────────────────────────────
  {
    id: 'tal_1', type: 'video',
    videoUrl: 'https://picsum.photos/seed/tal1/400/600',
    duration: '0:45', isVerified: true, category: 'vibes',
    description: 'Watch me turn plain fabric into a stunning dress in under 60 seconds! DM to order your custom outfit.',
    hashtags: ['#fashion', '#tailoring', '#customdesign', '#kenyafashion'],
    creatorName: 'Stitch & Style KE', creatorAvatar: 'S',
    likeCount: 4560, commentCount: 389, shareCount: 720,
    featuredProducts: [
      { name: 'Custom Dress (Made to Order)', price: 'Ksh 4,500' },
      { name: 'Sewing Machine Pro', price: 'Ksh 18,000' },
    ],
  },
  {
    id: 'tal_2', type: 'live',
    videoUrl: 'https://picsum.photos/seed/tal2/400/600',
    isVerified: true, category: 'vibes',
    description: 'LIVE COOKING: Kenyan nyama choma masterclass + secret marinade!',
    creatorName: 'Chef Wanjiru', creatorAvatar: 'C',
    isLive: true, viewerCount: 1840,
    likeCount: 5900, commentCount: 620, shareCount: 340,
    featuredProducts: [
      { name: 'Professional Grill Pan', price: 'Ksh 4,200' },
      { name: 'Spice Set 20 Jars', price: 'Ksh 2,800' },
    ],
  },
  // ── Learn / Health & Tech ──────────────────────────────────
  {
    id: 'ht_1', type: 'video',
    videoUrl: 'https://picsum.photos/seed/ht1/400/600',
    duration: '1:05', isVerified: true, category: 'learn',
    description: '5-minute morning routine that boosted my productivity 10x! Simple habits, big impact.',
    hashtags: ['#wellness', '#morningroutine', '#productivity'],
    creatorName: 'HealthHub KE', creatorAvatar: 'H',
    likeCount: 3890, commentCount: 245, shareCount: 612,
  },
  {
    id: 'ht_2', type: 'video',
    videoUrl: 'https://picsum.photos/seed/ht2/400/600',
    duration: '0:58', category: 'learn',
    description: 'How I built my first smart home setup for under Ksh 30k. Step-by-step guide in bio!',
    hashtags: ['#smarthome', '#diy', '#techkenya'],
    creatorName: 'SmartHome KE', creatorAvatar: 'S',
    likeCount: 2100, commentCount: 178, shareCount: 295,
  },
  // ── Fun ─────────────────────────────────────────────────────
  {
    id: 'fun_1', type: 'video',
    videoUrl: 'https://picsum.photos/seed/fun1/400/600',
    duration: '0:33', category: 'fun',
    description: 'Nairobi matatu jokes that hit too close to home 😂 Tag a friend who needs this.',
    hashtags: ['#nairobi', '#comedy', '#matatu'],
    creatorName: 'Nairobi Laughs', creatorAvatar: 'N',
    likeCount: 8920, commentCount: 712, shareCount: 2340,
  },
  {
    id: 'fun_2', type: 'video',
    videoUrl: 'https://picsum.photos/seed/fun2/400/600',
    duration: '0:48', isVerified: true, category: 'fun',
    description: 'Open mic night at Stage254! New comedians serving raw, unfiltered jokes 🎤',
    creatorName: 'Stage254', creatorAvatar: 'S',
    likeCount: 4150, commentCount: 380, shareCount: 890,
  },
];

export const SAVED_IDS_DEFAULT = new Set(['1', '3', '5', '10']);
export const LIKED_IDS_DEFAULT = new Set(['6', '8', 'geo_1', 'tal_1']);

export const SUGGESTED_CREATORS: SuggestedCreator[] = [
  { name: 'SneakerHead KE',  avatar: 'S', followers: '14.3k', isVerified: true,  avatarUrl: 'https://picsum.photos/seed/cr1/100/100' },
  { name: 'NairobiTech',     avatar: 'N', followers: '9.4k',  isVerified: true,  avatarUrl: 'https://picsum.photos/seed/cr2/100/100' },
  { name: 'FitGear Africa',  avatar: 'F', followers: '25.1k', isVerified: true,  avatarUrl: 'https://picsum.photos/seed/cr3/100/100' },
  { name: 'HomeChef Pro',    avatar: 'H', followers: '8.7k',  isVerified: false, avatarUrl: 'https://picsum.photos/seed/cr4/100/100' },
  { name: 'Beauty Equipment',avatar: 'B', followers: '31.2k', isVerified: true,  avatarUrl: 'https://picsum.photos/seed/cr5/100/100' },
  { name: 'Style Kenya',     avatar: 'K', followers: '18.9k', isVerified: false, avatarUrl: 'https://picsum.photos/seed/cr6/100/100' },
];

export const fmt = (n: number) =>
  n >= 1_000_000 ? (n / 1_000_000).toFixed(1) + 'M'
  : n >= 1_000   ? (n / 1_000).toFixed(1) + 'K'
  : String(n);

// "SneakerHead KE" → "sneakerhead-ke" (used in /feed/creator/[slug] routes)
export const creatorSlug = (name: string) =>
  name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const creatorUsername = (name: string) =>
  '@' + name.toLowerCase().trim().replace(/\s+/g, '_');
