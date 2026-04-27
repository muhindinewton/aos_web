'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  Search, Phone, MessageSquare,
  PhoneIncoming, PhoneOutgoing, PhoneMissed, PhoneCall,
  MicOff, Mic, Volume2, VolumeX, PhoneOff, Video, VideoOff,
} from 'lucide-react';

type CallType = 'incoming' | 'outgoing' | 'missed';
type CallLog = { id: string; name: string; avatar: string; type: CallType; time: string; duration?: string; date: string };
type Message  = { id: string; name: string; avatar: string; lastMessage: string; time: string; unread: number };

const CALL_LOGS: CallLog[] = [
  { id: '1', name: 'TechHub Kenya',     avatar: 'T', type: 'incoming', time: '10:32 AM', duration: '5:23',  date: 'Today'       },
  { id: '2', name: 'Jane Mwangi',       avatar: 'J', type: 'missed',   time: '9:45 AM',                     date: 'Today'       },
  { id: '3', name: 'Peter Ochieng',     avatar: 'P', type: 'outgoing', time: '8:30 AM',  duration: '12:45', date: 'Today'       },
  { id: '4', name: 'Mary Wanjiku',      avatar: 'M', type: 'missed',   time: '6:15 PM',                     date: 'Yesterday'   },
  { id: '5', name: 'John Kamau',        avatar: 'J', type: 'incoming', time: '3:20 PM',  duration: '8:12',  date: 'Yesterday'   },
  { id: '6', name: 'Electronics Plus',  avatar: 'E', type: 'outgoing', time: '11:00 AM', duration: '2:34',  date: 'Yesterday'   },
  { id: '7', name: 'Sarah Njeri',       avatar: 'S', type: 'missed',   time: '5:45 PM',                     date: 'Mon, Jan 27' },
  { id: '8', name: 'AutoMart Kenya',    avatar: 'A', type: 'incoming', time: '2:10 PM',  duration: '3:21',  date: 'Mon, Jan 27' },
];

const MESSAGES: Message[] = [
  { id: '1', name: 'TechHub Kenya',       avatar: 'T', lastMessage: 'Yes, the iPhone is still available. Whe…',   time: '10:32AM',   unread: 3 },
  { id: '2', name: 'Jane Mwangi',         avatar: 'J', lastMessage: 'I can do Ksh 140,000 for the MacBook. …',    time: '9:45AM',    unread: 1 },
  { id: '3', name: 'Peter Ochieng',       avatar: 'P', lastMessage: 'Thanks for the purchase! Enjoy you…',        time: 'Yesterday', unread: 0 },
  { id: '4', name: 'Nairobi Electronics', avatar: 'N', lastMessage: 'We have restocked the Samsung G…',           time: 'Yesterday', unread: 2 },
  { id: '5', name: 'Mary Wanjiku',        avatar: 'M', lastMessage: 'Is the price negotiable? I am in Westlan…',  time: 'Mon',       unread: 0 },
  { id: '6', name: 'David Kimani',        avatar: 'D', lastMessage: 'Can you send more photos of the laptop …',   time: 'Sat',       unread: 1 },
];

const CALL_FILTERS    = ['All', 'Missed', 'Incoming', 'Outgoing'] as const;
const MESSAGE_FILTERS = ['All Chat', 'Read', 'Unread', 'Unanswered'] as const;

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
  const [tab,         setTab]         = useState<'calls' | 'messages'>('messages');
  const [callFilter,  setCallFilter]  = useState<typeof CALL_FILTERS[number]>('All');
  const [msgFilter,   setMsgFilter]   = useState<typeof MESSAGE_FILTERS[number]>('All Chat');
  const [search,      setSearch]      = useState('');
  const [activeCall,  setActiveCall]  = useState<ActiveCall | null>(null);

  const startCall = useCallback((name: string, avatar: string) => {
    setActiveCall({ name, avatar });
  }, []);

  /* ── filtered calls ── */
  const filteredCalls = CALL_LOGS.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = callFilter === 'All'
      || (callFilter === 'Missed'   && c.type === 'missed')
      || (callFilter === 'Incoming' && c.type === 'incoming')
      || (callFilter === 'Outgoing' && c.type === 'outgoing');
    return matchSearch && matchFilter;
  });

  /* ── filtered messages ── */
  const filteredMsgs = MESSAGES.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = msgFilter === 'All Chat'
      || (msgFilter === 'Unread'      && m.unread > 0)
      || (msgFilter === 'Read'        && m.unread === 0)
      || (msgFilter === 'Unanswered'  && m.unread > 0);
    return matchSearch && matchFilter;
  });

  /* ── call logs grouped by date ── */
  const callGroups = filteredCalls.reduce<Record<string, CallLog[]>>((acc, c) => {
    (acc[c.date] ??= []).push(c); return acc;
  }, {});
  const groupOrder = ['Today', 'Yesterday', 'Mon, Jan 27'];

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100dvh-152px)] md:h-[calc(100dvh-156px)] relative">

      {/* ── Tab toggle ── */}
      <div className="px-4 pt-4 pb-3 flex-shrink-0">
        <div className="flex bg-elevated rounded-2xl p-1 gap-1">
          {(['calls', 'messages'] as const).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setSearch(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === t ? 'bg-primary text-white shadow-sm' : 'text-theme-muted hover:text-theme-primary'
              }`}
            >
              {t === 'calls'
                ? <><Phone className="w-4 h-4" /> Calls</>
                : <><MessageSquare className="w-4 h-4" /> Messages</>}
            </button>
          ))}
        </div>
      </div>

      {/* ── Search ── */}
      <div className="px-4 pb-3 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={tab === 'calls' ? 'Search calls…' : 'Search messages…'}
            className="w-full bg-elevated border border-theme rounded-full py-2.5 pl-10 pr-4 text-sm text-theme-primary placeholder:text-theme-muted outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* ── Filter pills ── */}
      <div className="px-4 pb-3 flex gap-2 flex-shrink-0">
        {(tab === 'calls' ? CALL_FILTERS : MESSAGE_FILTERS).map(f => {
          const active = tab === 'calls' ? callFilter === f : msgFilter === f;
          return (
            <button
              key={f}
              onClick={() => tab === 'calls' ? setCallFilter(f as typeof CALL_FILTERS[number]) : setMsgFilter(f as typeof MESSAGE_FILTERS[number])}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                active ? 'bg-primary/15 text-primary' : 'text-theme-muted hover:text-theme-primary'
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto hide-scrollbar">

        {/* CALLS TAB */}
        {tab === 'calls' && (
          <div className="pb-20">
            {groupOrder.filter(g => callGroups[g]?.length).map(group => (
              <div key={group}>
                <p className="px-4 py-1.5 text-xs font-semibold text-theme-muted">{group}</p>
                {callGroups[group].map(call => (
                  <div key={call.id} className="flex items-center gap-3 px-4 py-3 hover:bg-surface transition-colors">
                    <div className="w-10 h-10 rounded-full bg-elevated flex items-center justify-center flex-shrink-0">
                      <span className={`text-sm font-bold ${call.type === 'missed' ? 'text-primary' : 'text-theme-primary'}`}>
                        {call.avatar}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${call.type === 'missed' ? 'text-primary' : 'text-theme-primary'}`}>
                        {call.name}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <CallIcon type={call.type} />
                        <span className="text-xs text-theme-muted">
                          {call.time}{call.duration ? ` • ${call.duration}` : ''}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => startCall(call.name, call.avatar)}
                      className="w-9 h-9 rounded-full bg-green-50 dark:bg-green-500/10 flex items-center justify-center flex-shrink-0 hover:bg-green-100 transition-colors"
                    >
                      <Phone className="w-4 h-4 text-green-500" />
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* MESSAGES TAB */}
        {tab === 'messages' && (
          <div className="pb-20">
            {filteredMsgs.map(msg => (
              <Link key={msg.id} href={`/chat/${msg.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-surface transition-colors">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">{msg.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-theme-primary truncate">{msg.name}</p>
                    <span className="text-[11px] text-theme-muted whitespace-nowrap">{msg.time}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <p className="text-xs text-theme-muted truncate">{msg.lastMessage}</p>
                    {msg.unread > 0 && (
                      <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                        {msg.unread}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ── Active call overlay ── */}
      {activeCall && <CallScreen call={activeCall} onEnd={() => setActiveCall(null)} />}

      {/* ── FAB ── */}
      <button className={`absolute bottom-4 right-4 w-14 h-14 rounded-2xl shadow-lg flex items-center justify-center transition-all active:scale-95 ${
        tab === 'calls' ? 'bg-green-500 hover:bg-green-600' : 'bg-primary hover:bg-primary-hover'
      }`}>
        {tab === 'calls'
          ? <PhoneCall className="w-6 h-6 text-white" onClick={() => startCall('New Call', 'N')}
            />
          : <MessageSquare className="w-6 h-6 text-white" />}
      </button>

    </div>
  );
}
