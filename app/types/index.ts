export interface Product {
  id: string;
  title: string;
  location: string;
  price: string;
  originalPrice?: string;
  category: string;
  likes: number;
  rating: number;
  reviews: string;
  isOffer?: boolean;
  discount?: number;
  offerExpiry?: number;
  image?: string;
  description?: string;
  seller?: Seller;
}

export interface Seller {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  verified: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'other';
  text: string;
  timestamp: string;
  product?: Product;
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  lastMessage: string;
  timestamp: string;
  unread: number;
  messages: ChatMessage[];
}

export interface FeedItem {
  id: string;
  type: 'short' | 'live';
  seller: string;
  avatar: string;
  description: string;
  sound?: string;
  likes: number;
  comments: number;
  viewers?: number;
  productName: string;
  productPrice: string;
  videoUrl?: string;
  thumbnail?: string;
}
