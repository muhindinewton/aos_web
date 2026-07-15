'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Send, Phone, Video, MoreVertical, Mic, Plus, Smile,
  X, Reply, Copy, Trash2, Forward, Image as ImageIcon, FileText,
  MapPin, User, Ban, Pause, Play, Wallpaper, CheckCircle2, RefreshCw,
  Camera, Languages,
} from 'lucide-react';
import { chats } from '../../lib/data';
import { markContacted } from '../../lib/contacted-sellers';
import { useTheme } from '../../providers/theme-provider';
import {
  getWallpaper, setWallpaper, LIGHT_PRESETS, DARK_PRESETS,
  type ChatWallpaper,
} from '../../lib/chat-wallpaper';

/* ── Message model (superset of the seed data shape) ─────────────── */
interface Msg {
  id: string;
  sender: 'user' | 'other';
  text: string;
  timestamp: string;
  deleted?: boolean;
  reaction?: string;
  replyTo?: { sender: 'user' | 'other'; text: string } | null;
  voiceDuration?: string;
  location?: { label: string; lat: number; lng: number };
  contact?: { name: string; phone: string };
  media?: { url: string; type: 'image' | 'video' | 'document'; name?: string };
  translation?: string;
  translationLang?: string;
  translationLoading?: boolean;
}

/* ── Translation (mirrors mobile: live translate, phrasebook fallback) ── */
const TRANSLATION_LANGUAGES = [
  { code: 'sw', name: 'Swahili',    flag: '🇰🇪' },
  { code: 'fr', name: 'French',     flag: '🇫🇷' },
  { code: 'es', name: 'Spanish',    flag: '🇪🇸' },
  { code: 'de', name: 'German',     flag: '🇩🇪' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ar', name: 'Arabic',     flag: '🇸🇦' },
  { code: 'zh', name: 'Mandarin',   flag: '🇨🇳' },
  { code: 'hi', name: 'Hindi',      flag: '🇮🇳' },
  { code: 'en', name: 'English',    flag: '🇬🇧' },
];

// Tiny offline fallback for a few common chat words, used when the live
// translation request fails (offline, blocked, etc.).
const PHRASEBOOK: Record<string, Record<string, string>> = {
  sw: { hello: 'habari', hi: 'mambo', thanks: 'asante', yes: 'ndiyo', no: 'hapana', good: 'nzuri', price: 'bei', available: 'inapatikana' },
  fr: { hello: 'bonjour', hi: 'salut', thanks: 'merci', yes: 'oui', no: 'non', good: 'bon', price: 'prix', available: 'disponible' },
  es: { hello: 'hola', hi: 'hola', thanks: 'gracias', yes: 'sí', no: 'no', good: 'bueno', price: 'precio', available: 'disponible' },
  de: { hello: 'hallo', hi: 'hallo', thanks: 'danke', yes: 'ja', no: 'nein', good: 'gut', price: 'Preis', available: 'verfügbar' },
  pt: { hello: 'olá', hi: 'oi', thanks: 'obrigado', yes: 'sim', no: 'não', good: 'bom', price: 'preço', available: 'disponível' },
};

function phrasebookTranslate(text: string, code: string): string {
  const dict = PHRASEBOOK[code];
  if (!dict) return text;
  return text.replace(/[a-zA-Z]+/g, w => {
    const t = dict[w.toLowerCase()];
    if (!t) return w;
    return w[0] === w[0].toUpperCase() ? t[0].toUpperCase() + t.slice(1) : t;
  });
}

async function translateText(text: string, code: string): Promise<string> {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${code}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    const translated = (data?.[0] ?? []).map((seg: unknown[]) => seg?.[0] ?? '').join('');
    return translated || phrasebookTranslate(text, code);
  } catch {
    return phrasebookTranslate(text, code);
  }
}

const QUICK_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];
const EMOJI_ROWS = [
  '😀 😃 😄 😁 😆 😅 😂 🤣 😊 😇',
  '🙂 😉 😍 🥰 😘 😋 😜 🤔 😎 🤩',
  '👍 👎 👏 🙌 🤝 🙏 💪 ✌️ 👌 🤞',
  '❤️ 🧡 💛 💚 💙 💜 🖤 🤍 💯 🔥',
  '🎉 ✨ ⭐ 🌟 💫 ⚡ 🌈 ☀️ 🌙 ❄️',
].map(r => r.split(' '));

export default function ChatDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const chat = chats.find(c => c.id === params.id) || chats[0];
  const chatKey = `chat-${chat.id}`;

  const [messages, setMessages] = useState<Msg[]>(chat.messages as Msg[]);
  const [newMessage, setNewMessage] = useState('');
  const [replyTo, setReplyTo] = useState<Msg | null>(null);
  const [actionsFor, setActionsFor] = useState<string | null>(null);
  // Which view the anchored message popover shows: quick actions, the delete
  // chooser, or the translate language list.
  const [popView, setPopView] = useState<'actions' | 'delete' | 'translate'>('actions');
  const [showMenu, setShowMenu] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showAttach, setShowAttach] = useState(false);
  const [showWallpaperPicker, setShowWallpaperPicker] = useState(false);
  const [wallpaper, setWallpaperState] = useState<ChatWallpaper>({ kind: 'default' });
  const [mounted, setMounted] = useState(false);

  // Voice recording (simulated timer, like the mobile UI)
  const [recording, setRecording] = useState(false);
  const [recordPaused, setRecordPaused] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);

  // Pending media attachment with caption
  const [pendingMedia, setPendingMedia] = useState<Msg['media'] | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    setWallpaperState(getWallpaper(chatKey));
  }, [chatKey]);

  // Legacy: links of the form /chat/[id]?call=1 now redirect to /call/[id]
  useEffect(() => {
    if (searchParams.get('call') === '1') router.replace(`/call/${chat.id}`);
  }, [searchParams, chat.id, router]);

  // Record this seller as contacted so the Review Product CTA unlocks
  useEffect(() => {
    const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : null;
    markContacted(id);
  }, [params.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  useEffect(() => {
    if (!recording || recordPaused) return;
    const t = setInterval(() => setRecordSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [recording, recordPaused]);

  const nowTime = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const pushMessage = useCallback((partial: Partial<Msg>) => {
    setMessages(prev => [...prev, {
      id: String(Date.now()),
      sender: 'user',
      text: '',
      timestamp: nowTime(),
      ...partial,
    }]);
  }, []);

  const handleSend = () => {
    const text = newMessage.trim();
    if (!text && !pendingMedia) return;
    pushMessage({
      text,
      media: pendingMedia ?? undefined,
      replyTo: replyTo ? { sender: replyTo.sender, text: bubblePreview(replyTo) } : undefined,
    });
    setNewMessage('');
    setPendingMedia(null);
    setReplyTo(null);
    setShowEmoji(false);
  };

  const stopRecording = (send: boolean) => {
    if (send && recordSeconds > 0) {
      const m = Math.floor(recordSeconds / 60);
      const s = recordSeconds % 60;
      pushMessage({ voiceDuration: `${m}:${String(s).padStart(2, '0')}` });
    }
    setRecording(false);
    setRecordPaused(false);
    setRecordSeconds(0);
  };

  const shareLocation = () => {
    setShowAttach(false);
    const fallback = { label: 'Current location', lat: -1.286389, lng: 36.817223 };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => pushMessage({ location: { label: 'Current location', lat: pos.coords.latitude, lng: pos.coords.longitude } }),
        () => pushMessage({ location: fallback }),
        { timeout: 5000 },
      );
    } else {
      pushMessage({ location: fallback });
    }
  };

  const shareContact = () => {
    setShowAttach(false);
    pushMessage({ contact: { name: 'My AOS contact', phone: '+254 700 000 000' } });
  };

  const onFilePicked = (e: React.ChangeEvent<HTMLInputElement>, kind: 'media' | 'document') => {
    const file = e.target.files?.[0];
    e.target.value = '';
    setShowAttach(false);
    if (!file) return;
    if (kind === 'document') {
      setPendingMedia({ url: '', type: 'document', name: file.name });
    } else {
      const url = URL.createObjectURL(file);
      setPendingMedia({
        url,
        type: file.type.startsWith('video') ? 'video' : 'image',
        name: file.name,
      });
    }
    inputRef.current?.focus();
  };

  const react = (msg: Msg, emoji: string) => {
    setMessages(prev => prev.map(m =>
      m.id === msg.id ? { ...m, reaction: m.reaction === emoji ? undefined : emoji } : m,
    ));
    setActionsFor(null);
  };

  const closePopover = () => {
    setActionsFor(null);
    setPopView('actions');
  };

  const deleteForMe = (msg: Msg) => {
    setMessages(prev => prev.filter(m => m.id !== msg.id));
    closePopover();
  };

  const deleteForEveryone = (msg: Msg) => {
    setMessages(prev => prev.map(m =>
      m.id === msg.id ? { ...m, deleted: true, text: '', media: undefined, location: undefined, contact: undefined, voiceDuration: undefined, reaction: undefined } : m,
    ));
    closePopover();
  };

  const applyTranslation = async (msg: Msg, code: string, name: string) => {
    closePopover();
    if (!msg.text.trim()) return;
    setMessages(prev => prev.map(m =>
      m.id === msg.id ? { ...m, translationLang: name, translationLoading: true, translation: undefined } : m,
    ));
    const translated = await translateText(msg.text, code);
    setMessages(prev => prev.map(m =>
      m.id === msg.id ? { ...m, translation: translated, translationLoading: false } : m,
    ));
  };

  const removeTranslation = (msg: Msg) => {
    closePopover();
    setMessages(prev => prev.map(m =>
      m.id === msg.id ? { ...m, translation: undefined, translationLang: undefined, translationLoading: false } : m,
    ));
  };

  const copyMessage = (msg: Msg) => {
    if (msg.text) navigator.clipboard?.writeText(msg.text).catch(() => {});
    setActionsFor(null);
  };

  const bubblePreview = (m: Msg) => {
    if (m.deleted) return 'Deleted message';
    if (m.voiceDuration) return `Voice message · ${m.voiceDuration}`;
    if (m.location) return '📍 Location';
    if (m.contact) return `👤 ${m.contact.name}`;
    if (m.media) return m.media.type === 'document' ? `📄 ${m.media.name}` : '📷 Media';
    return m.text;
  };

  const applyWallpaper = (w: ChatWallpaper) => {
    setWallpaper(chatKey, w);
    setWallpaperState(w);
    setShowWallpaperPicker(false);
  };

  const presets = mounted && isDarkMode ? DARK_PRESETS : LIGHT_PRESETS;
  const wallpaperStyle: React.CSSProperties =
    mounted && wallpaper.kind === 'solid' && wallpaper.color
      ? { backgroundColor: wallpaper.color }
      : {};

  const fmtRecord = () => {
    const m = Math.floor(recordSeconds / 60);
    const s = recordSeconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100dvh-80px)] lg:h-[calc(100dvh-112px)] relative">
      {/* ── Header ── */}
      <div className="bg-surface border-b border-theme px-4 py-3 flex items-center gap-3 flex-shrink-0 relative z-20">
        <Link
          href="/chat"
          className="w-9 h-9 rounded-full bg-surface border border-theme flex items-center justify-center hover:bg-elevated transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-4.5 h-4.5 w-[18px] h-[18px] text-theme-primary" />
        </Link>

        {/* Avatar + name open the contact profile (WhatsApp-style) */}
        <Link href={`/chat/${chat.id}/profile`} className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
            <span className="font-semibold text-primary">{chat.avatar}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-[15px] text-theme-primary truncate">{chat.name}</h2>
            <p className="text-xs flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${chat.online ? 'bg-green-500' : 'bg-theme-muted'}`} />
              <span className={chat.online ? 'text-green-500' : 'text-theme-muted'}>
                {chat.online ? 'Online' : 'Offline'}
              </span>
            </p>
          </div>
        </Link>

        {/* More options */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(v => !v)}
            className="w-9 h-9 rounded-full hover:bg-elevated flex items-center justify-center transition-colors"
            aria-label="More options"
          >
            <MoreVertical className="w-5 h-5 text-theme-primary" />
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-11 w-52 bg-surface border border-theme rounded-xl shadow-2xl overflow-hidden z-40 py-1">
                <button
                  onClick={() => { setShowMenu(false); router.push(`/call/${chat.id}`); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-theme-primary hover:bg-elevated transition-colors"
                >
                  <Phone className="w-4 h-4 text-theme-muted" /> Call
                </button>
                <button
                  onClick={() => { setShowMenu(false); router.push(`/call/${chat.id}?video=1`); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-theme-primary hover:bg-elevated transition-colors"
                >
                  <Video className="w-4 h-4 text-theme-muted" /> Video call
                </button>
                <button
                  onClick={() => { setShowMenu(false); setShowWallpaperPicker(true); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-theme-primary hover:bg-elevated transition-colors"
                >
                  <Wallpaper className="w-4 h-4 text-theme-muted" /> Change wallpaper
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Messages over wallpaper ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 transition-colors" style={wallpaperStyle}>
        <div className="text-center mb-4">
          <span className="text-xs text-theme-muted bg-surface/80 px-3 py-1 rounded-full">Today</span>
        </div>

        {messages.map(msg => {
          const isMe = msg.sender === 'user';
          return (
            <div key={msg.id} className={`flex flex-col mb-2 ${isMe ? 'items-end' : 'items-start'}`}>
              <div className="relative max-w-[78%] group">
                <button
                  onClick={() => { setPopView('actions'); setActionsFor(actionsFor === msg.id ? null : msg.id); }}
                  className={`block text-left w-full rounded-2xl overflow-hidden ${
                    isMe
                      ? 'text-white rounded-tr-none'
                      : 'bg-surface border border-theme text-theme-primary rounded-tl-none'
                  }`}
                  style={isMe ? { backgroundColor: 'color-mix(in srgb, #C1121F 72%, var(--surface, #fff))' } : undefined}
                >
                  {msg.deleted ? (
                    <p className={`flex items-center gap-1.5 px-3.5 py-2.5 text-[13px] italic ${isMe ? 'text-white/80' : 'text-theme-muted'}`}>
                      <Ban className="w-3.5 h-3.5" />
                      {isMe ? 'You deleted this message' : 'This message was deleted'}
                    </p>
                  ) : (
                    <>
                      {msg.replyTo && (
                        <div className={`mx-2 mt-2 px-3 py-1.5 rounded-lg border-l-2 ${
                          isMe ? 'bg-white/15 border-white/70' : 'bg-elevated border-primary'
                        }`}>
                          <p className={`text-[11px] font-semibold ${isMe ? 'text-white/90' : 'text-primary'}`}>
                            {msg.replyTo.sender === 'user' ? 'You' : chat.name}
                          </p>
                          <p className={`text-xs truncate ${isMe ? 'text-white/75' : 'text-theme-muted'}`}>
                            {msg.replyTo.text}
                          </p>
                        </div>
                      )}

                      {msg.media && msg.media.type === 'image' && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={msg.media.url} alt="" className="max-h-64 w-full object-cover" />
                      )}
                      {msg.media && msg.media.type === 'video' && (
                        <video src={msg.media.url} controls className="max-h-64 w-full" />
                      )}
                      {msg.media && msg.media.type === 'document' && (
                        <div className={`flex items-center gap-2.5 px-3.5 pt-3 ${msg.text ? '' : 'pb-3'}`}>
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isMe ? 'bg-white/20' : 'bg-primary/10'}`}>
                            <FileText className={`w-4.5 h-4.5 w-[18px] h-[18px] ${isMe ? 'text-white' : 'text-primary'}`} />
                          </div>
                          <span className="text-[13px] font-medium truncate">{msg.media.name}</span>
                        </div>
                      )}

                      {msg.location && (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${msg.location.lat},${msg.location.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="block"
                        >
                          <div className={`w-56 h-28 flex items-center justify-center ${isMe ? 'bg-white/15' : 'bg-elevated'}`}>
                            <MapPin className={`w-8 h-8 ${isMe ? 'text-white' : 'text-primary'}`} />
                          </div>
                          <div className="px-3.5 py-2">
                            <p className="text-[13px] font-semibold">{msg.location.label}</p>
                            <p className={`text-[11px] ${isMe ? 'text-white/70' : 'text-theme-muted'}`}>
                              {msg.location.lat.toFixed(5)}, {msg.location.lng.toFixed(5)} · Open in Maps
                            </p>
                          </div>
                        </a>
                      )}

                      {msg.contact && (
                        <div className="flex items-center gap-3 px-3.5 py-3 w-56">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isMe ? 'bg-white/20' : 'bg-primary/10'}`}>
                            <User className={`w-5 h-5 ${isMe ? 'text-white' : 'text-primary'}`} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-semibold truncate">{msg.contact.name}</p>
                            <p className={`text-xs ${isMe ? 'text-white/70' : 'text-theme-muted'}`}>{msg.contact.phone}</p>
                          </div>
                        </div>
                      )}

                      {msg.voiceDuration && (
                        <div className="flex items-center gap-2 px-3.5 py-3">
                          <Mic className={`w-4.5 h-4.5 w-[18px] h-[18px] ${isMe ? 'text-white' : 'text-primary'}`} />
                          <span className="text-sm font-medium">Voice message · {msg.voiceDuration}</span>
                        </div>
                      )}

                      {msg.text && (
                        <div className="px-3.5 pt-2.5">
                          {msg.translationLoading && (
                            <p className={`flex items-center gap-2 text-[11px] mb-1.5 ${isMe ? 'text-white/80' : 'text-theme-muted'}`}>
                              <span className={`w-3 h-3 rounded-full border-2 border-t-transparent animate-spin ${isMe ? 'border-white' : 'border-primary'}`} />
                              Translating to {msg.translationLang}…
                            </p>
                          )}
                          {msg.translation ? (
                            <>
                              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.translation}</p>
                              <p className={`flex items-center gap-1 text-[10px] mt-1.5 ${isMe ? 'text-white/70' : 'text-theme-muted'}`}>
                                <Languages className="w-3 h-3" /> Translated to {msg.translationLang}
                              </p>
                              <p className={`text-xs italic mt-1 pt-1 border-t whitespace-pre-wrap break-words ${isMe ? 'text-white/70 border-white/20' : 'text-theme-muted border-theme'}`}>
                                {msg.text}
                              </p>
                            </>
                          ) : (
                            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                          )}
                        </div>
                      )}
                      <p className={`text-[10px] px-3.5 pb-2 pt-1 text-right ${isMe ? 'text-white/60' : 'text-theme-muted'}`}>
                        {msg.timestamp}
                      </p>
                    </>
                  )}
                </button>

                {/* Reaction chip */}
                {msg.reaction && (
                  <span className={`absolute -bottom-2.5 ${isMe ? 'right-2' : 'left-2'} bg-surface border border-theme rounded-full px-1.5 py-0.5 text-xs shadow-sm`}>
                    {msg.reaction}
                  </span>
                )}

                {/* Message actions popover */}
                {actionsFor === msg.id && !msg.deleted && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={closePopover} />
                    <div className={`absolute z-40 top-full mt-1.5 ${isMe ? 'right-0' : 'left-0'} bg-surface border border-theme rounded-2xl shadow-2xl overflow-hidden w-56`}>
                      {popView === 'actions' && (
                        <>
                          <div className="flex items-center gap-1 px-3 py-2.5 border-b border-theme">
                            {QUICK_REACTIONS.map(e => (
                              <button
                                key={e}
                                onClick={() => react(msg, e)}
                                className={`text-lg hover:scale-125 transition-transform ${msg.reaction === e ? 'bg-primary/10 rounded-full' : ''}`}
                              >
                                {e}
                              </button>
                            ))}
                          </div>
                          <button onClick={() => { setReplyTo(msg); closePopover(); inputRef.current?.focus(); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-theme-primary hover:bg-elevated">
                            <Reply className="w-4 h-4 text-theme-muted" /> Reply
                          </button>
                          {msg.text && (
                            <button onClick={() => copyMessage(msg)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-theme-primary hover:bg-elevated">
                              <Copy className="w-4 h-4 text-theme-muted" /> Copy
                            </button>
                          )}
                          {msg.text && (
                            <button onClick={() => setPopView('translate')} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-theme-primary hover:bg-elevated">
                              <Languages className="w-4 h-4 text-theme-muted" /> Translate
                            </button>
                          )}
                          <button onClick={closePopover} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-theme-primary hover:bg-elevated">
                            <Forward className="w-4 h-4 text-theme-muted" /> Forward
                          </button>
                          <button onClick={() => setPopView('delete')} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-primary hover:bg-elevated">
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </>
                      )}

                      {popView === 'delete' && (
                        <>
                          <p className="px-4 py-2.5 text-xs font-semibold text-theme-muted border-b border-theme">Delete message?</p>
                          <button onClick={() => deleteForMe(msg)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-theme-primary hover:bg-elevated">
                            <Trash2 className="w-4 h-4 text-theme-muted" /> Delete for me
                          </button>
                          {isMe && (
                            <button onClick={() => deleteForEveryone(msg)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-primary hover:bg-elevated">
                              <Trash2 className="w-4 h-4" /> Delete for everyone
                            </button>
                          )}
                          <button onClick={() => setPopView('actions')} className="w-full px-4 py-2.5 text-sm text-theme-muted hover:bg-elevated text-left">
                            Cancel
                          </button>
                        </>
                      )}

                      {popView === 'translate' && (
                        <>
                          <p className="px-4 py-2.5 text-xs font-semibold text-theme-muted border-b border-theme">Translate to</p>
                          <div className="max-h-56 overflow-y-auto">
                            {msg.translation && (
                              <button onClick={() => removeTranslation(msg)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[#FF4D4D] hover:bg-elevated">
                                <Languages className="w-4 h-4" /> Remove translation
                              </button>
                            )}
                            {TRANSLATION_LANGUAGES.map(lang => (
                              <button
                                key={lang.code}
                                onClick={() => applyTranslation(msg, lang.code, lang.name)}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-theme-primary hover:bg-elevated"
                              >
                                <span className="text-lg leading-none">{lang.flag}</span> {lang.name}
                              </button>
                            ))}
                          </div>
                          <button onClick={() => setPopView('actions')} className="w-full px-4 py-2.5 text-sm text-theme-muted hover:bg-elevated text-left border-t border-theme">
                            Back
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* ── Reply preview ── */}
      {replyTo && (
        <div className="bg-surface border-t border-theme px-4 py-2 flex items-center gap-3 flex-shrink-0">
          <div className="flex-1 min-w-0 border-l-2 border-primary pl-3">
            <p className="text-xs font-semibold text-primary">
              Replying to {replyTo.sender === 'user' ? 'yourself' : chat.name}
            </p>
            <p className="text-xs text-theme-muted truncate">{bubblePreview(replyTo)}</p>
          </div>
          <button onClick={() => setReplyTo(null)} className="w-7 h-7 rounded-full bg-elevated flex items-center justify-center">
            <X className="w-3.5 h-3.5 text-theme-muted" />
          </button>
        </div>
      )}

      {/* ── Pending media preview ── */}
      {pendingMedia && (
        <div className="bg-surface border-t border-theme px-4 py-2 flex items-center gap-3 flex-shrink-0">
          {pendingMedia.type === 'image' ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={pendingMedia.url} alt="" className="w-12 h-12 rounded-lg object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-theme-primary truncate">{pendingMedia.name || 'Attachment'}</p>
            <p className="text-[11px] text-theme-muted">Add a caption below, then send</p>
          </div>
          <button onClick={() => setPendingMedia(null)} className="w-7 h-7 rounded-full bg-elevated flex items-center justify-center">
            <X className="w-3.5 h-3.5 text-theme-muted" />
          </button>
        </div>
      )}

      {/* ── Composer / recording row ── */}
      {recording ? (
        <div className="bg-surface border-t border-theme px-4 py-3 flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => stopRecording(false)}
            className="w-10 h-10 rounded-full bg-elevated flex items-center justify-center"
            aria-label="Cancel recording"
          >
            <Trash2 className="w-4.5 h-4.5 w-[18px] h-[18px] text-theme-muted" />
          </button>
          <div className="flex-1 flex items-center gap-3 bg-elevated rounded-full px-4 py-2.5">
            <span className={`w-2.5 h-2.5 rounded-full bg-primary ${recordPaused ? '' : 'animate-pulse'}`} />
            <span className="text-sm font-semibold text-theme-primary tabular-nums">{fmtRecord()}</span>
            <span className="text-xs text-theme-muted">{recordPaused ? 'Paused' : 'Recording…'}</span>
          </div>
          <button
            onClick={() => setRecordPaused(p => !p)}
            className="w-10 h-10 rounded-full bg-elevated flex items-center justify-center"
            aria-label={recordPaused ? 'Resume' : 'Pause'}
          >
            {recordPaused ? <Play className="w-4.5 h-4.5 w-[18px] h-[18px] text-theme-primary" /> : <Pause className="w-4.5 h-4.5 w-[18px] h-[18px] text-theme-primary" />}
          </button>
          <button
            onClick={() => stopRecording(true)}
            className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-hover"
            aria-label="Send voice message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="bg-surface border-t border-theme px-4 py-3 flex items-center gap-2 flex-shrink-0 relative">
          <button
            onClick={() => { setShowAttach(v => !v); setShowEmoji(false); }}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${showAttach ? 'bg-primary/10 text-primary' : 'bg-elevated text-theme-muted hover:text-theme-primary'}`}
            aria-label="Attach"
          >
            <Plus className="w-5 h-5" />
          </button>
          <div className="flex-1 flex items-center bg-elevated border border-theme rounded-full pl-4 pr-2">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              onFocus={() => setShowEmoji(false)}
              placeholder="Type a message..."
              className="flex-1 bg-transparent py-2.5 text-sm text-theme-primary placeholder:text-theme-muted outline-none"
            />
            <button
              onClick={() => { setShowEmoji(v => !v); setShowAttach(false); }}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${showEmoji ? 'text-primary' : 'text-theme-muted hover:text-theme-primary'}`}
              aria-label="Emoji"
            >
              <Smile className="w-5 h-5" />
            </button>
          </div>
          {newMessage.trim() || pendingMedia ? (
            <button
              onClick={handleSend}
              className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-hover transition-colors"
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => { setRecording(true); setShowEmoji(false); setShowAttach(false); }}
              className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-hover transition-colors"
              aria-label="Record voice message"
            >
              <Mic className="w-4.5 h-4.5 w-[18px] h-[18px]" />
            </button>
          )}
        </div>
      )}

      {/* ── Emoji picker ── */}
      {showEmoji && (
        <div className="bg-surface border-t border-theme px-4 py-3 flex-shrink-0 max-h-44 overflow-y-auto">
          {EMOJI_ROWS.map((row, i) => (
            <div key={i} className="flex justify-between mb-1.5">
              {row.map(e => (
                <button
                  key={e}
                  onClick={() => setNewMessage(m => m + e)}
                  className="text-2xl hover:scale-110 transition-transform p-0.5"
                >
                  {e}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* ── Attachment sheet ── */}
      {showAttach && (
        <div className="bg-surface border-t border-theme px-6 py-4 flex-shrink-0">
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
            {[
              { icon: ImageIcon, label: 'Gallery', color: 'bg-violet-500', onClick: () => fileInputRef.current?.click() },
              { icon: Camera, label: 'Camera', color: 'bg-rose-500', onClick: () => fileInputRef.current?.click() },
              { icon: FileText, label: 'Document', color: 'bg-blue-500', onClick: () => docInputRef.current?.click() },
              { icon: MapPin, label: 'Location', color: 'bg-emerald-500', onClick: shareLocation },
              { icon: User, label: 'Contact', color: 'bg-amber-500', onClick: shareContact },
            ].map(({ icon: Icon, label, color, onClick }) => (
              <button key={label} onClick={onClick} className="flex flex-col items-center gap-1.5">
                <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-[11px] font-medium text-theme-secondary">{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <input ref={fileInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={e => onFilePicked(e, 'media')} />
      <input ref={docInputRef} type="file" className="hidden" onChange={e => onFilePicked(e, 'document')} />

      {/* ── Wallpaper picker (anchored under the header menu) ── */}
      {showWallpaperPicker && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowWallpaperPicker(false)} />
          <div className="absolute right-4 top-16 w-80 bg-surface border border-theme rounded-2xl z-50 p-5 shadow-2xl">
            <h3 className="text-base font-semibold text-theme-primary">Chat wallpaper</h3>
            <p className="text-xs text-theme-muted mb-4">Choose a background for this conversation</p>

            <button
              onClick={() => applyWallpaper({ kind: 'default' })}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border mb-4 transition-colors ${
                wallpaper.kind === 'default'
                  ? 'border-primary bg-primary/5 text-primary font-semibold'
                  : 'border-theme bg-elevated text-theme-primary'
              }`}
            >
              <RefreshCw className="w-5 h-5" />
              <span className="flex-1 text-left text-sm">Default</span>
              {wallpaper.kind === 'default' && <CheckCircle2 className="w-5 h-5" />}
            </button>

            <p className="text-xs font-semibold text-theme-muted mb-3">Solid colors</p>
            <div className="flex flex-wrap gap-3 pb-2">
              {presets.map(color => {
                const selected = wallpaper.kind === 'solid' && wallpaper.color === color;
                return (
                  <button
                    key={color}
                    onClick={() => applyWallpaper({ kind: 'solid', color })}
                    className={`w-14 h-14 rounded-full border transition-all flex items-center justify-center ${
                      selected ? 'border-primary border-2 scale-105' : 'border-theme'
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Wallpaper ${color}`}
                  >
                    {selected && <CheckCircle2 className="w-5 h-5 text-primary" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
