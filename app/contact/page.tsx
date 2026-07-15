'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Search, Phone, MessageSquare,
  PhoneIncoming, PhoneOutgoing, PhoneMissed,
  MicOff, Mic, Volume2, VolumeX, PhoneOff, Video, VideoOff,
  Plus, X, User, ImageIcon, ChevronLeft, ChevronRight,
  Menu, MailCheck, Star, Settings, Pin, Check, CheckCheck,
} from 'lucide-react';
import { callLogs as CALL_LOGS } from '../lib/data';
import type { CallLog, CallType } from '../types';
import { SkeletonList, AppErrorView, usePageLoad } from '../components/app-state-views';

/* ── Stories ─────────────────────────────────────────────────────── */
type StorySegment = { caption: string; gradient: [string, string] };
type Story = { name: string; time: string; seen?: boolean; segments: StorySegment[] };

const SEED_STORIES: Story[] = [
  { name: 'Eleanor P.', time: '2h ago', segments: [
    { caption: 'Good morning! ☀️', gradient: ['#FF6CAB', '#7366FF'] },
    { caption: 'Coffee time ☕', gradient: ['#F7971E', '#FFD200'] },
  ]},
  { name: 'Dianne R.', time: '4h ago', segments: [
    { caption: 'New arrivals in store! 🛍️', gradient: ['#11998E', '#38EF7D'] },
  ]},
  { name: 'Guy Hawkins', time: '6h ago', seen: true, segments: [
    { caption: 'On the road 🚗', gradient: ['#2193B0', '#6DD5ED'] },
  ]},
  { name: 'Jacob Jones', time: '8h ago', seen: true, segments: [
    { caption: 'Sunset vibes 🌅', gradient: ['#EE9CA7', '#FFDDE1'] },
  ]},
  { name: 'Cody F.', time: '10h ago', segments: [
    { caption: 'Big sale this weekend 🔥', gradient: ['#CB356B', '#BD3F32'] },
  ]},
];

const STORY_GRADIENTS: [string, string][] = [
  ['#FF6CAB', '#7366FF'],
  ['#F7971E', '#FFD200'],
  ['#11998E', '#38EF7D'],
  ['#2193B0', '#6DD5ED'],
  ['#CB356B', '#BD3F32'],
  ['#C1121F', '#8E0E15'],
];

const SEGMENT_MS = 4000;

function StoryViewer({ story, onClose, onDone }: { story: Story; onClose: () => void; onDone: () => void }) {
  const [segIndex, setSegIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const seg = story.segments[segIndex];

  useEffect(() => {
    setProgress(0);
    const started = Date.now();
    const t = setInterval(() => {
      const p = (Date.now() - started) / SEGMENT_MS;
      if (p >= 1) {
        clearInterval(t);
        if (segIndex < story.segments.length - 1) setSegIndex(i => i + 1);
        else onDone();
      } else {
        setProgress(p);
      }
    }, 50);
    return () => clearInterval(t);
  }, [segIndex, story, onDone]);

  const goPrev = () => (segIndex > 0 ? setSegIndex(i => i - 1) : onClose());
  const goNext = () => (segIndex < story.segments.length - 1 ? setSegIndex(i => i + 1) : onDone());

  return (
    <div
      className="fixed inset-0 z-[210] flex flex-col"
      style={{ background: `linear-gradient(160deg, ${seg.gradient[0]} 0%, ${seg.gradient[1]} 100%)` }}
    >
      {/* Progress bars */}
      <div className="flex gap-1.5 px-4 pt-4">
        {story.segments.map((_, i) => (
          <div key={i} className="flex-1 h-1 rounded-full bg-white/30 overflow-hidden">
            <div
              className="h-full bg-white rounded-full"
              style={{ width: i < segIndex ? '100%' : i === segIndex ? `${progress * 100}%` : '0%' }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-9 h-9 rounded-full bg-white/25 flex items-center justify-center">
          <span className="text-sm font-bold text-white">{story.name[0].toUpperCase()}</span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">{story.name}</p>
          <p className="text-[11px] text-white/70">{story.time}</p>
        </div>
        <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center" aria-label="Close story">
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Caption + tap zones */}
      <div className="flex-1 relative flex items-center justify-center px-8">
        <p className="text-2xl font-bold text-white text-center drop-shadow-lg">{seg.caption}</p>
        <button className="absolute inset-y-0 left-0 w-1/3" onClick={goPrev} aria-label="Previous" />
        <button className="absolute inset-y-0 right-0 w-1/3" onClick={goNext} aria-label="Next" />
        <ChevronLeft className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-white/40 hidden md:block pointer-events-none" />
        <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-white/40 hidden md:block pointer-events-none" />
      </div>
    </div>
  );
}

function CreateStorySheet({ onClose, onCreate }: { onClose: () => void; onCreate: (seg: StorySegment) => void }) {
  const [caption, setCaption] = useState('');
  const [gradient, setGradient] = useState<[string, string]>(STORY_GRADIENTS[0]);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[200]" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[205] w-[92%] max-w-sm bg-surface rounded-2xl p-5 shadow-2xl">
        <h3 className="text-base font-semibold text-theme-primary mb-1">Add to your story</h3>
        <p className="text-xs text-theme-muted mb-4">Share a moment with your contacts. It disappears after 24 hours.</p>

        {/* Preview */}
        <div
          className="h-36 rounded-xl flex items-center justify-center px-6 mb-4"
          style={{ background: `linear-gradient(160deg, ${gradient[0]} 0%, ${gradient[1]} 100%)` }}
        >
          <p className="text-lg font-bold text-white text-center drop-shadow">{caption || 'Your caption…'}</p>
        </div>

        <input
          type="text"
          value={caption}
          onChange={e => setCaption(e.target.value)}
          placeholder="Write a caption…"
          maxLength={80}
          className="w-full bg-elevated border border-theme rounded-xl py-2.5 px-4 text-sm text-theme-primary placeholder:text-theme-muted outline-none focus:border-primary mb-4"
        />

        <div className="flex gap-2.5 mb-5">
          {STORY_GRADIENTS.map(g => (
            <button
              key={g[0]}
              onClick={() => setGradient(g)}
              className={`w-9 h-9 rounded-full transition-all ${gradient === g ? 'ring-2 ring-primary ring-offset-2 ring-offset-[var(--surface,#fff)] scale-105' : ''}`}
              style={{ background: `linear-gradient(160deg, ${g[0]}, ${g[1]})` }}
              aria-label="Pick color"
            />
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-full text-sm font-medium text-theme-muted hover:bg-elevated transition-colors">
            Cancel
          </button>
          <button
            onClick={() => caption.trim() && onCreate({ caption: caption.trim(), gradient })}
            disabled={!caption.trim()}
            className="px-5 py-2 rounded-full text-sm font-semibold bg-primary text-white hover:bg-primary-hover transition-colors disabled:opacity-40"
          >
            Share
          </button>
        </div>
      </div>
    </>
  );
}

// Chat list seed data — mirrors mobile's contact_screen.dart. `status` drives
// the read-receipt icon for messages I sent; ignored when unread.
type ChatItem = {
  id: string;
  name: string;
  message: string;
  time: string;
  unread: number;
  online: boolean;
  pinned: boolean;
  muted: boolean;
  status: 'sent' | 'delivered' | 'read';
};

const SEED_CHATS: ChatItem[] = [
  { id: '1', name: 'AOS Team',       message: 'Floyd: Good luck team! 🔥',        time: '09:30',     unread: 1, online: true,  pinned: true,  muted: false, status: 'read' },
  { id: '2', name: 'Jerome Bell',    message: 'Thanks sir!',                      time: '16:52',     unread: 0, online: true,  pinned: false, muted: false, status: 'delivered' },
  { id: '3', name: 'Floyd Miles',    message: 'Hello, bro! Can you help me?',     time: '13:06',     unread: 1, online: true,  pinned: false, muted: false, status: 'sent' },
  { id: '4', name: 'Devon Lane',     message: '🎙 Voice message · 00:34',         time: '11:20',     unread: 0, online: false, pinned: false, muted: true,  status: 'read' },
  { id: '5', name: 'Annette Black',  message: 'Well, good job! 👍',               time: 'Yesterday', unread: 0, online: false, pinned: false, muted: false, status: 'delivered' },
  { id: '6', name: 'Kristin Watson', message: 'Whoaah! 😍',                       time: 'Yesterday', unread: 0, online: true,  pinned: false, muted: false, status: 'read' },
];

const CALL_FILTERS = ['All', 'Missed', 'Incoming', 'Outgoing'] as const;
const CHAT_FILTERS = ['All Chats', 'Unread', 'Read'] as const;

function CallIcon({ type }: { type: CallType }) {
  if (type === 'incoming') return <PhoneIncoming  className="w-3.5 h-3.5 text-green-500" />;
  if (type === 'outgoing') return <PhoneOutgoing  className="w-3.5 h-3.5 text-theme-muted" />;
  return                          <PhoneMissed    className="w-3.5 h-3.5 text-primary" />;
}

type ActiveCall = { name: string; avatar: string };

function CallScreen({ call, onEnd }: { call: ActiveCall; onEnd: () => void }) {
  const [status,   setStatus]   = useState<'calling' | 'connected'>('calling');
  const [seconds,  setSeconds]  = useState(0);
  const [muted,    setMuted]    = useState(false);
  const [speaker,  setSpeaker]  = useState(true);
  const [video,    setVideo]    = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const connectTimeout = setTimeout(() => {
      setStatus('connected');
      timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    }, 3000);
    return () => {
      clearTimeout(connectTimeout);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const handleEnd = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    onEnd();
  }, [onEnd]);

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-between py-16 px-6"
      style={{ background: 'linear-gradient(160deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)' }}
    >
      {/* Caller info */}
      <div className="flex flex-col items-center gap-4 mt-8">
        <p className="text-white/60 text-sm tracking-wide">
          {status === 'calling' ? 'Calling…' : fmt(seconds)}
        </p>
        {/* Pulsing rings while calling */}
        <div className="relative flex items-center justify-center">
          {status === 'calling' && (
            <>
              <span className="absolute w-36 h-36 rounded-full bg-white/5 animate-ping" />
              <span className="absolute w-28 h-28 rounded-full bg-white/8 animate-ping [animation-delay:0.3s]" />
            </>
          )}
          <div className="w-24 h-24 rounded-full bg-primary/30 border-4 border-primary/50 flex items-center justify-center z-10">
            <span className="text-4xl font-black text-white">{call.avatar}</span>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mt-2">{call.name}</h2>
        <p className="text-white/50 text-sm">{status === 'calling' ? 'AOS Voice Call' : 'Connected'}</p>
      </div>

      {/* Controls */}
      <div className="w-full max-w-xs flex flex-col gap-6">
        {/* Secondary controls */}
        <div className="flex items-center justify-around">
          <button
            onClick={() => setMuted(m => !m)}
            className={`flex flex-col items-center gap-2 group`}
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              muted ? 'bg-white text-slate-900' : 'bg-white/15 text-white'
            }`}>
              {muted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </div>
            <span className="text-white/60 text-xs">{muted ? 'Unmute' : 'Mute'}</span>
          </button>

          <button
            onClick={() => setSpeaker(s => !s)}
            className="flex flex-col items-center gap-2"
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              speaker ? 'bg-white text-slate-900' : 'bg-white/15 text-white'
            }`}>
              {speaker ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
            </div>
            <span className="text-white/60 text-xs">Speaker</span>
          </button>

          <button
            onClick={() => setVideo(v => !v)}
            className="flex flex-col items-center gap-2"
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              video ? 'bg-white text-slate-900' : 'bg-white/15 text-white'
            }`}>
              {video ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </div>
            <span className="text-white/60 text-xs">Video</span>
          </button>
        </div>

        {/* End call */}
        <div className="flex justify-center">
          <button
            onClick={handleEnd}
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 active:scale-95 flex items-center justify-center shadow-lg shadow-red-500/40 transition-all"
          >
            <PhoneOff className="w-7 h-7 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  const router = useRouter();
  const pathname = usePathname();
  // 0 = Chats, 1 = Calls — bottom bar tabs, like mobile's AOS Connect.
  // The /calls route opens the same screen on the Calls tab.
  const [navIndex,    setNavIndex]    = useState(pathname === '/calls' ? 1 : 0);
  const [callFilter,  setCallFilter]  = useState<typeof CALL_FILTERS[number]>('All');
  const [chatFilter,  setChatFilter]  = useState<typeof CHAT_FILTERS[number]>('All Chats');
  const [search,      setSearch]      = useState('');
  const [activeCall,  setActiveCall]  = useState<ActiveCall | null>(null);
  const [chats,       setChats]       = useState<ChatItem[]>(SEED_CHATS);
  const [menuOpen,    setMenuOpen]    = useState(false);

  /* ── stories state ── */
  const [stories,      setStories]      = useState<Story[]>(SEED_STORIES);
  const [myStory,      setMyStory]      = useState<Story | null>(null);
  const [viewingStory, setViewingStory] = useState<Story | null>(null);
  const [creatingStory, setCreatingStory] = useState(false);

  const openStory = useCallback((story: Story) => {
    setViewingStory(story);
    setStories(prev => prev.map(s => (s.name === story.name ? { ...s, seen: true } : s)));
  }, []);

  const { loading: isLoading, error: loadError, retry, forceEmpty } = usePageLoad();

  const startCall = useCallback((name: string, avatar: string) => {
    setActiveCall({ name, avatar });
  }, []);

  /* ── filtered calls ── */
  const filteredCalls = (forceEmpty ? [] : CALL_LOGS).filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = callFilter === 'All'
      || (callFilter === 'Missed'   && c.type === 'missed')
      || (callFilter === 'Incoming' && c.type === 'incoming')
      || (callFilter === 'Outgoing' && c.type === 'outgoing');
    return matchSearch && matchFilter;
  });

  /* ── filtered chats — pinned chats float to the top ── */
  const filteredChats = (() => {
    const q = search.toLowerCase();
    const result = (forceEmpty ? [] : chats).filter(c => {
      const matchSearch = !q || c.name.toLowerCase().includes(q) || c.message.toLowerCase().includes(q);
      const matchFilter = chatFilter === 'All Chats'
        || (chatFilter === 'Unread' && c.unread > 0)
        || (chatFilter === 'Read'   && c.unread === 0);
      return matchSearch && matchFilter;
    });
    return [...result.filter(c => c.pinned), ...result.filter(c => !c.pinned)];
  })();

  const unreadChatCount = chats.filter(c => c.unread > 0).length;

  const markAllRead = () => {
    setChats(prev => prev.map(c => ({ ...c, unread: 0 })));
    setMenuOpen(false);
  };

  /* ── call logs grouped by date ── */
  const callGroups = filteredCalls.reduce<Record<string, CallLog[]>>((acc, c) => {
    (acc[c.date] ??= []).push(c); return acc;
  }, {});
  const groupOrder = ['Today', 'Yesterday', 'Mon, Jan 27'];

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100dvh-80px)] lg:h-[calc(100dvh-112px)] relative">

      {/* ── Header: close · AOS Connect · menu ── */}
      <div className="px-5 pt-4 pb-1.5 flex-shrink-0">
        <div className="flex items-center">
          <button
            onClick={() => router.push('/')}
            className="w-11 h-11 rounded-2xl bg-surface shadow-[0_2px_10px_rgba(0,0,0,0.07)] flex items-center justify-center hover:bg-elevated transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-theme-primary" />
          </button>
          <h1 className="flex-1 text-center text-xl sm:text-[26px] font-bold text-theme-primary tracking-tight">
            AOS Connect
          </h1>
          <div className="relative">
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="w-11 h-11 rounded-2xl bg-surface shadow-[0_2px_10px_rgba(0,0,0,0.07)] flex items-center justify-center hover:bg-elevated transition-colors"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5 text-theme-primary" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-11 w-52 bg-surface border border-theme rounded-xl shadow-2xl overflow-hidden z-40 py-1">
                  <button onClick={markAllRead} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-theme-primary hover:bg-elevated transition-colors">
                    <MailCheck className="w-4 h-4 text-theme-muted" /> Mark all read
                  </button>
                  <button onClick={() => setMenuOpen(false)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-theme-primary hover:bg-elevated transition-colors">
                    <Star className="w-4 h-4 text-theme-muted" /> Starred messages
                  </button>
                  <Link href="/account/settings" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-theme-primary hover:bg-elevated transition-colors">
                    <Settings className="w-4 h-4 text-theme-muted" /> Settings
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Search bar — surface card with a soft shadow, like mobile */}
        <div className="relative mt-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-muted" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full h-[54px] bg-surface border border-theme rounded-[24px] shadow-[0_3px_12px_rgba(0,0,0,0.06)] pl-12 pr-10 text-base text-theme-primary placeholder:text-theme-muted outline-none focus:border-primary"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-elevated flex items-center justify-center"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5 text-theme-muted" />
            </button>
          )}
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto hide-scrollbar pt-4">

        {isLoading && <SkeletonList rows={8} />}
        {loadError && <AppErrorView onRetry={retry} />}

        {/* CHATS VIEW */}
        {!isLoading && !loadError && navIndex === 0 && (
          <div className="pb-28">
            {/* ── Stories row ── */}
            <div className="flex gap-3 px-5 pb-4 overflow-x-auto hide-scrollbar">
              {/* My Story */}
              <button
                onClick={() => (myStory ? openStory(myStory) : setCreatingStory(true))}
                className="flex flex-col items-center gap-2 w-[76px] flex-shrink-0"
              >
                <div className="relative">
                  <div className={`w-[68px] h-[68px] rounded-full p-[3px] ${myStory ? 'border-[3px] border-primary' : ''}`}>
                    <div className="w-full h-full rounded-full bg-elevated flex items-center justify-center">
                      <User className="w-[30px] h-[30px] text-theme-muted" fill="currentColor" />
                    </div>
                  </div>
                  <span
                    onClick={e => { e.stopPropagation(); setCreatingStory(true); }}
                    className="absolute bottom-0.5 right-0.5 w-6 h-6 rounded-full bg-primary border-2 border-[var(--bg,#fff)] flex items-center justify-center"
                  >
                    <Plus className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                  </span>
                </div>
                <span className="text-xs font-medium text-theme-primary truncate w-full text-center">My Story</span>
              </button>

              {stories.length === 0 ? (
                <div className="flex items-center gap-3 px-4 w-56 flex-shrink-0 bg-surface border border-theme rounded-2xl">
                  <ImageIcon className="w-7 h-7 text-theme-muted" />
                  <div>
                    <p className="text-sm font-semibold text-theme-primary">No Stories to Show</p>
                    <p className="text-xs text-theme-secondary">Be the first to share a moment!</p>
                  </div>
                </div>
              ) : (
                stories.map(story => (
                  <button
                    key={story.name}
                    onClick={() => openStory(story)}
                    className="flex flex-col items-center gap-2 w-[76px] flex-shrink-0"
                  >
                    <div className={`w-[68px] h-[68px] rounded-full p-[3px] ${story.seen ? 'border border-theme' : 'border-[3px] border-primary'}`}>
                      <div className="w-full h-full rounded-full bg-primary/15 flex items-center justify-center">
                        <span className="text-[24px] font-semibold text-primary">{story.name[0].toUpperCase()}</span>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-theme-primary truncate w-full text-center">{story.name}</span>
                  </button>
                ))
              )}
            </div>

            {/* ── Filter chips: All Chats / Unread / Read ── */}
            <div className="flex gap-2 px-4 pb-3">
              {CHAT_FILTERS.map(f => {
                const active = chatFilter === f;
                return (
                  <button
                    key={f}
                    onClick={() => setChatFilter(f)}
                    className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all whitespace-nowrap ${
                      active ? 'bg-primary/15 text-primary' : 'text-theme-secondary hover:text-theme-primary'
                    }`}
                  >
                    {f}
                  </button>
                );
              })}
            </div>

            {/* ── Chat cards ── */}
            {filteredChats.length === 0 ? (
              <div className="mx-5 px-6 py-14 bg-surface border border-theme rounded-[20px] flex flex-col items-center text-center">
                <ImageIcon className="w-16 h-16 text-theme-muted" />
                <p className="mt-5 text-base font-semibold text-theme-primary">Start a Conversation</p>
                <p className="mt-1 text-[13px] text-theme-secondary">Your chats will appear here.</p>
              </div>
            ) : (
              filteredChats.map(chat => (
                <Link
                  key={chat.id}
                  href={`/chat/${chat.id}`}
                  onClick={() => setChats(prev => prev.map(c => (c.id === chat.id ? { ...c, unread: 0 } : c)))}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-surface transition-colors"
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-[50px] h-[50px] rounded-full bg-primary/15 flex items-center justify-center">
                      <span className="text-xl font-semibold text-primary">{chat.name[0].toUpperCase()}</span>
                    </div>
                    {chat.online && (
                      <span className="absolute bottom-0.5 left-0 w-[13px] h-[13px] rounded-full bg-[#2ECC71] border-2 border-[var(--surface,#fff)]" />
                    )}
                  </div>

                  {/* Name + last message */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-[15px] font-semibold text-theme-primary truncate">{chat.name}</p>
                      {chat.pinned && <Pin className="w-3.5 h-3.5 text-theme-muted flex-shrink-0" />}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      {chat.unread === 0 && (
                        chat.status === 'sent'
                          ? <Check className="w-[15px] h-[15px] text-theme-muted flex-shrink-0" />
                          : <CheckCheck className={`w-[15px] h-[15px] flex-shrink-0 ${chat.status === 'read' ? 'text-[#4DA3FF]' : 'text-theme-muted'}`} />
                      )}
                      <p className={`text-[13px] truncate ${chat.unread > 0 ? 'font-medium text-theme-primary' : 'text-theme-secondary'}`}>
                        {chat.message}
                      </p>
                    </div>
                  </div>

                  {/* Time + badges */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className={`text-xs ${chat.unread > 0 ? 'text-primary font-semibold' : 'text-theme-muted'}`}>
                      {chat.time}
                    </span>
                    <span className="flex items-center gap-1.5 h-5">
                      {chat.muted && <VolumeX className="w-[15px] h-[15px] text-theme-muted" />}
                      {chat.unread > 0 && (
                        <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-primary text-white text-[11px] font-semibold flex items-center justify-center">
                          {chat.unread}
                        </span>
                      )}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {/* CALLS VIEW */}
        {!isLoading && !loadError && navIndex === 1 && (
          <div className="pb-28">
            {/* Call filter chips */}
            <div className="flex gap-2 px-4 pb-3">
              {CALL_FILTERS.map(f => {
                const active = callFilter === f;
                return (
                  <button
                    key={f}
                    onClick={() => setCallFilter(f)}
                    className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all whitespace-nowrap ${
                      active ? 'bg-primary/15 text-primary' : 'text-theme-secondary hover:text-theme-primary'
                    }`}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
            {groupOrder.filter(g => callGroups[g]?.length).map(group => (
              <div key={group}>
                <p className="px-5 py-1.5 text-xs font-semibold text-theme-muted">{group}</p>
                {callGroups[group].map(call => (
                  <div key={call.id} className="flex items-center gap-3 px-5 py-3 hover:bg-surface transition-colors">
                    <div className="w-[50px] h-[50px] rounded-full bg-elevated flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-semibold text-theme-primary">{call.avatar}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[15px] font-semibold ${call.type === 'missed' ? 'text-primary' : 'text-theme-primary'}`}>
                        {call.name}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <CallIcon type={call.type} />
                        <span className="text-[13px] text-theme-secondary">
                          {call.time}{call.duration ? ` • ${call.duration}` : ''}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => startCall(call.name, call.avatar)}
                      className="p-2 flex-shrink-0 hover:scale-110 transition-transform"
                      aria-label={`Call ${call.name}`}
                    >
                      <Phone className="w-[22px] h-[22px] text-[#2ECC71]" fill="currentColor" />
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Floating glass bottom bar: Chats · FAB · Calls ── */}
      <div className="absolute bottom-4 left-4 right-4 z-20">
        <div className="relative max-w-md mx-auto">
          {/* Center FAB, docked into the bar */}
          <Link
            href="/calls/new"
            className="absolute left-1/2 -translate-x-1/2 -top-6 w-[54px] h-[54px] rounded-full bg-primary flex items-center justify-center shadow-[0_6px_14px_rgba(193,18,31,0.35)] ring-[7px] ring-[var(--bg,#fff)] hover:bg-primary-hover transition-colors z-10"
            aria-label="New conversation"
          >
            <Plus className="w-7 h-7 text-white" strokeWidth={2.5} />
          </Link>

          <div className="h-[60px] rounded-full bg-surface shadow-[0_6px_20px_rgba(0,0,0,0.10)] flex items-center">
            <button
              onClick={() => { setNavIndex(0); setSearch(''); }}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <span className="relative">
                <MessageSquare
                  className={`w-6 h-6 ${navIndex === 0 ? 'text-primary' : 'text-theme-muted'}`}
                  fill={navIndex === 0 ? 'currentColor' : 'none'}
                />
                {unreadChatCount > 0 && (
                  <span className="absolute -top-2 -right-1.5 min-w-[17px] h-[17px] px-1 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center border-2 border-[var(--surface,#fff)]">
                    {unreadChatCount}
                  </span>
                )}
              </span>
              <span className={`text-base font-bold ${navIndex === 0 ? 'text-primary' : 'text-theme-primary'}`}>Chats</span>
            </button>

            <div className="w-24" /> {/* clearance for the FAB */}

            <button
              onClick={() => { setNavIndex(1); setSearch(''); }}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <span className="relative">
                <Phone
                  className={`w-6 h-6 ${navIndex === 1 ? 'text-primary' : 'text-theme-muted'}`}
                  fill={navIndex === 1 ? 'currentColor' : 'none'}
                />
                <span className="absolute -top-2 -right-1.5 min-w-[17px] h-[17px] px-1 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center border-2 border-[var(--surface,#fff)]">
                  1
                </span>
              </span>
              <span className={`text-base font-bold ${navIndex === 1 ? 'text-primary' : 'text-theme-primary'}`}>Calls</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Active call overlay ── */}
      {activeCall && <CallScreen call={activeCall} onEnd={() => setActiveCall(null)} />}

      {/* ── Story viewer ── */}
      {viewingStory && (
        <StoryViewer
          story={viewingStory}
          onClose={() => setViewingStory(null)}
          onDone={() => setViewingStory(null)}
        />
      )}

      {/* ── Create story ── */}
      {creatingStory && (
        <CreateStorySheet
          onClose={() => setCreatingStory(false)}
          onCreate={seg => {
            setMyStory(prev =>
              prev
                ? { ...prev, time: 'now', segments: [...prev.segments, seg] }
                : { name: 'My Story', time: 'now', segments: [seg] },
            );
            setCreatingStory(false);
          }}
        />
      )}
    </div>
  );
}
