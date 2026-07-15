'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  MessageCircle,
  Store,
  TrendingDown,
  Tag,
  Radio,
  PlayCircle,
  UserPlus,
  ShoppingBag,
  Shield,
  Check,
  Trash2,
  X,
  RotateCw,
  ArrowRight,
} from 'lucide-react';
import { usePageLoad, SkeletonList, AppErrorView } from '../components/app-state-views';

type NotificationType = 'message' | 'listing' | 'price_drop' | 'promotion' | 'live_stream' | 'short_video' | 'follower' | 'order' | 'system';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: Date;
  isRead: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'message',
    title: 'TechHub Kenya',
    body: 'Sent you a message: "Yes, the iPhone is still available. When can you pick it up?"',
    createdAt: new Date(Date.now() - 12 * 60 * 1000),
    isRead: false,
  },
  {
    id: '2',
    type: 'live_stream',
    title: 'SneakerHead_KE is Live!',
    body: 'Flash sale on sneakers — join now before they sell out!',
    createdAt: new Date(Date.now() - 35 * 60 * 1000),
    isRead: false,
  },
  {
    id: '3',
    type: 'listing',
    title: 'Listing Approved',
    body: 'Your listing "Samsung Galaxy S24 Ultra" is now live and visible to buyers.',
    createdAt: new Date(Date.now() - 60 * 60 * 1000),
    isRead: true,
  },
  {
    id: '4',
    type: 'price_drop',
    title: 'Price Drop Alert',
    body: 'iPhone 15 Pro Max dropped from KES 165,000 to KES 145,000 — an item on your wishlist!',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isRead: false,
  },
  {
    id: '5',
    type: 'follower',
    title: 'New Follower',
    body: 'FashionHub254 started following your store.',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    isRead: true,
  },
  {
    id: '6',
    type: 'short_video',
    title: 'Your Short is Trending!',
    body: 'Your short video "New Arrivals" has reached 1.2K views and 85 likes.',
    createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000),
    isRead: false,
  },
  {
    id: '7',
    type: 'order',
    title: 'Order Inquiry',
    body: 'A buyer inquired about your "Dumbbell Set 50kg" — respond to close the sale.',
    createdAt: new Date(Date.now() - 29 * 60 * 60 * 1000),
    isRead: true,
  },
  {
    id: '8',
    type: 'message',
    title: 'NairobiStyle',
    body: 'Sent you a message: "Do you deliver to Westlands? I\'m interested in the sofa set."',
    createdAt: new Date(Date.now() - 32 * 60 * 60 * 1000),
    isRead: true,
  },
  {
    id: '9',
    type: 'promotion',
    title: 'AOS Flash Sale Starts Now!',
    body: 'Up to 60% off on Electronics, Fashion & Home. Don\'t miss out — ends in 24 hours.',
    createdAt: new Date(Date.now() - 34 * 60 * 60 * 1000),
    isRead: true,
  },
  {
    id: '10',
    type: 'system',
    title: 'Verification Approved',
    body: 'Congratulations! Your seller identity has been verified. You now have a trusted badge.',
    createdAt: new Date(Date.now() - 38 * 60 * 60 * 1000),
    isRead: true,
  },
  {
    id: '11',
    type: 'listing',
    title: 'Listing Expired',
    body: 'Your listing "Vintage Leather Jacket" has expired. Renew it to keep it visible.',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    isRead: true,
  },
  {
    id: '12',
    type: 'price_drop',
    title: 'Price Drop Alert',
    body: 'Nike Air Max 90 dropped by 15% — now KES 8,500. It\'s on your wishlist!',
    createdAt: new Date(Date.now() - 3.25 * 24 * 60 * 60 * 1000),
    isRead: true,
  },
];

const tabs = ['All', 'Messages', 'Activity', 'Promotions'];

const getIcon = (type: NotificationType) => {
  switch (type) {
    case 'message': return MessageCircle;
    case 'listing': return Store;
    case 'price_drop': return TrendingDown;
    case 'promotion': return Tag;
    case 'live_stream': return Radio;
    case 'short_video': return PlayCircle;
    case 'follower': return UserPlus;
    case 'order': return ShoppingBag;
    case 'system': return Shield;
  }
};

const getColor = (type: NotificationType) => {
  switch (type) {
    case 'message': return 'bg-blue-500/10 text-blue-500';
    case 'listing': return 'bg-primary/10 text-primary';
    case 'price_drop': return 'bg-green-500/10 text-green-500';
    case 'promotion': return 'bg-amber-500/10 text-amber-500';
    case 'live_stream': return 'bg-primary/10 text-primary';
    case 'short_video': return 'bg-purple-500/10 text-purple-500';
    case 'follower': return 'bg-blue-500/10 text-blue-500';
    case 'order': return 'bg-orange-500/10 text-orange-500';
    case 'system': return 'bg-gray-500/10 text-gray-500';
  }
};

// Friendly label shown in the detail modal header (mobile shows richer labels than the bare type)
const getTypeLabel = (type: NotificationType): string => {
  switch (type) {
    case 'message':      return 'Message';
    case 'listing':      return 'Listing Update';
    case 'price_drop':   return 'Price Drop';
    case 'promotion':    return 'Promotion';
    case 'live_stream':  return 'Live Stream';
    case 'short_video':  return 'Short Video';
    case 'follower':     return 'New Follower';
    case 'order':        return 'Order';
    case 'system':       return 'System';
  }
};

// Returns the context-aware primary action for a notification — used both for
// the inline chip on the card and the primary button in the detail modal.
// Returning null means there's no actionable destination (modal falls back to "Done").
type Action = { label: string; href: string; icon?: React.ComponentType<{ className?: string }> };

const getAction = (n: Notification): Action | null => {
  const body = n.body.toLowerCase();
  switch (n.type) {
    case 'message':
      return { label: 'Open Chat',      href: '/chat',          icon: MessageCircle };
    case 'live_stream':
      return n.isRead
        ? { label: 'Watch Now',         href: '/feed',          icon: Radio }
        : { label: 'Join Live',         href: '/feed',          icon: Radio };
    case 'price_drop':
      return { label: 'View Deal',      href: '/shop',          icon: TrendingDown };
    case 'order':
      return { label: 'Respond Now',    href: '/chat',          icon: ShoppingBag };
    case 'listing':
      if (body.includes('expired')) return { label: 'Renew Listing', href: '/sell/listings', icon: RotateCw };
      if (body.includes('approved') || body.includes('live and visible'))
                                    return { label: 'View Listing',  href: '/sell/listings', icon: Store };
      return { label: 'View Listings',  href: '/sell/listings', icon: Store };
    case 'short_video':
      return { label: 'View Stats',     href: '/feed/profile',  icon: PlayCircle };
    case 'follower':
      return { label: 'View Profile',   href: '/feed/profile',  icon: UserPlus };
    case 'promotion':
      return { label: 'Shop Sale',      href: '/shop',          icon: Tag };
    case 'system':
      return null;
  }
};

const formatTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};

const getTimeGroup = (date: Date) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const itemDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  if (itemDate >= today) return 'Today';
  if (itemDate >= yesterday) return 'Yesterday';
  if (itemDate >= thisWeek) return 'This Week';
  return 'Earlier';
};

export default function NotificationsPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const { loading, error, retry, forceEmpty } = usePageLoad();

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const filteredNotifications = (forceEmpty ? [] : notifications).filter(n => {
    switch (selectedTab) {
      case 1: return n.type === 'message';
      case 2: return ['listing', 'price_drop', 'follower', 'order', 'live_stream', 'short_video'].includes(n.type);
      case 3: return ['promotion', 'system'].includes(n.type);
      default: return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    showToast('All notifications marked as read');
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    if (selectedNotification?.id === id) {
      setSelectedNotification(null);
    }
  };

  const groupedNotifications = filteredNotifications.reduce((groups, notification) => {
    const group = getTimeGroup(notification.createdAt);
    if (!groups[group]) groups[group] = [];
    groups[group].push(notification);
    return groups;
  }, {} as Record<string, Notification[]>);

  const groupOrder = ['Today', 'Yesterday', 'This Week', 'Earlier'];

  return (
    <div className="min-h-screen bg-theme">
      <div className="max-w-4xl mx-auto px-4 py-6 md:px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/" className="p-2 rounded-xl border border-theme hover:bg-elevated transition-colors">
            <ArrowLeft className="w-5 h-5 text-theme-primary" />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-theme-primary">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-primary font-medium">{unreadCount} unread</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-lg hover:bg-primary/20 transition-colors"
            >
              Read all
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar pb-1">
          {tabs.map((tab, index) => {
            const tabUnread = index === 0 
              ? unreadCount 
              : notifications.filter(n => {
                  if (index === 1) return n.type === 'message' && !n.isRead;
                  if (index === 2) return ['listing', 'price_drop', 'follower', 'order', 'live_stream', 'short_video'].includes(n.type) && !n.isRead;
                  if (index === 3) return ['promotion', 'system'].includes(n.type) && !n.isRead;
                  return false;
                }).length;

            return (
              <button
                key={tab}
                onClick={() => setSelectedTab(index)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedTab === index
                    ? 'bg-primary text-white'
                    : 'bg-surface border border-theme text-theme-secondary hover:text-theme-primary'
                }`}
              >
                {tab}
                {tabUnread > 0 && (
                  <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                    selectedTab === index ? 'bg-white/20' : 'bg-primary/10 text-primary'
                  }`}>
                    {tabUnread}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Notifications List */}
        {loading ? (
          <SkeletonList rows={6} />
        ) : error ? (
          <AppErrorView onRetry={retry} />
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-elevated flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-theme-muted" />
            </div>
            <h3 className="text-lg font-semibold text-theme-primary mb-1">No notifications</h3>
            <p className="text-sm text-theme-secondary">You&apos;re all caught up!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {groupOrder.map(group => {
              const items = groupedNotifications[group];
              if (!items || items.length === 0) return null;

              return (
                <div key={group}>
                  <h3 className="text-sm font-semibold text-theme-muted mb-3">{group}</h3>
                  <div className="space-y-2">
                    {items.map(notification => {
                      const Icon = getIcon(notification.type);
                      const colorClass = getColor(notification.type);
                      const action = getAction(notification);
                      // Live unread + expired-listing renewal: surface a prominent inline chip
                      const showInlineChip =
                        action && (
                          (notification.type === 'live_stream' && !notification.isRead) ||
                          (notification.type === 'listing' && notification.body.toLowerCase().includes('expired')) ||
                          notification.type === 'price_drop' ||
                          (notification.type === 'order' && !notification.isRead)
                        );
                      const ActionIcon = action?.icon;

                      return (
                        <div
                          key={notification.id}
                          onClick={() => {
                            markAsRead(notification.id);
                            setSelectedNotification(notification);
                          }}
                          className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-sm ${
                            notification.isRead
                              ? 'bg-surface border-theme'
                              : 'bg-primary/5 border-primary/20'
                          }`}
                        >
                          <div className="flex gap-3">
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-semibold text-theme-primary text-sm">{notification.title}</h4>
                                <span className="flex items-center gap-1.5 whitespace-nowrap">
                                  <span className="text-xs text-theme-muted">{formatTime(notification.createdAt)}</span>
                                  {!notification.isRead && <span className="w-2 h-2 rounded-full bg-primary" />}
                                </span>
                              </div>
                              <p className="text-sm text-theme-secondary mt-1 line-clamp-2">{notification.body}</p>
                              {showInlineChip && action && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); markAsRead(notification.id); router.push(action.href); }}
                                  className={`mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                                    notification.type === 'price_drop'
                                      ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20'
                                      : 'bg-primary text-white hover:bg-primary-hover'
                                  }`}
                                >
                                  {ActionIcon && <ActionIcon className="w-3.5 h-3.5" />}
                                  {action.label}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50" onClick={() => setSelectedNotification(null)}>
          <div 
            className="bg-surface w-full max-w-lg rounded-t-3xl md:rounded-3xl max-h-[80vh] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Close button */}
              <div className="flex justify-end mb-4">
                <button 
                  onClick={() => setSelectedNotification(null)}
                  className="p-2 rounded-full hover:bg-elevated transition-colors"
                >
                  <X className="w-5 h-5 text-theme-muted" />
                </button>
              </div>

              {/* Icon & Type */}
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${getColor(selectedNotification.type)}`}>
                  {React.createElement(getIcon(selectedNotification.type), { className: 'w-7 h-7' })}
                </div>
                <div>
                  <p className={`text-sm font-semibold ${getColor(selectedNotification.type).split(' ')[1]}`}>
                    {getTypeLabel(selectedNotification.type)}
                  </p>
                  <p className="text-xs text-theme-muted">{formatTime(selectedNotification.createdAt)}</p>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-theme-primary mb-3">{selectedNotification.title}</h2>

              <hr className="border-theme mb-4" />

              {/* Body */}
              <p className="text-theme-secondary leading-relaxed mb-6">{selectedNotification.body}</p>

              {/* Actions — primary is context-aware (Open Chat, Watch Now, Renew Listing, …) */}
              {(() => {
                const action = getAction(selectedNotification);
                const ActionIcon = action?.icon;
                return (
                  <div className="flex gap-3">
                    <button
                      onClick={() => deleteNotification(selectedNotification.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 border border-theme rounded-xl text-theme-secondary hover:bg-elevated transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                    {action ? (
                      <button
                        onClick={() => { setSelectedNotification(null); router.push(action.href); }}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors"
                      >
                        {ActionIcon ? <ActionIcon className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                        {action.label}
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedNotification(null)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        Done
                      </button>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] bg-green-600 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg flex items-center gap-2">
          <Check className="w-4 h-4" />
          {toast}
        </div>
      )}
    </div>
  );
}
