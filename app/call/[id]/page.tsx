'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  ChevronDown,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  Grid3x3,
  PhoneOff,
  Phone,
  MoreVertical,
  SignalHigh,
} from 'lucide-react';
import { chats } from '../../lib/data';
import { markContacted } from '../../lib/contacted-sellers';

export default function CallPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const sp = useSearchParams();

  const isIncoming = sp.get('incoming') === '1';
  const isVideoStart = sp.get('video') === '1';

  const chat = chats.find(c => c.id === params?.id) || chats[0];

  // Record this seller as contacted so the Review Product CTA unlocks
  useEffect(() => {
    const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params!.id[0] : null;
    markContacted(id);
  }, [params?.id]);

  const [connected, setConnected] = useState(false);
  const [accepted, setAccepted]   = useState(!isIncoming); // outgoing auto-rings; incoming waits for accept
  const [seconds, setSeconds]     = useState(0);
  const [muted, setMuted]         = useState(false);
  const [videoOn, setVideoOn]     = useState(isVideoStart);
  const [speakerOn, setSpeakerOn] = useState(true);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const connectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Once "accepted" (outgoing immediately, incoming after tap), simulate
  // a 3-second ringing window before transitioning to the connected state.
  useEffect(() => {
    if (!accepted) return;
    connectTimeoutRef.current = setTimeout(() => setConnected(true), 3000);
    return () => {
      if (connectTimeoutRef.current) clearTimeout(connectTimeoutRef.current);
    };
  }, [accepted]);

  // Tick the duration timer once we're connected
  useEffect(() => {
    if (!connected) return;
    timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [connected]);

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const endCall = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (connectTimeoutRef.current) clearTimeout(connectTimeoutRef.current);
    router.back();
  };

  const statusLabel =
    connected ? fmt(seconds)
    : accepted ? 'Calling…'
    : 'Incoming call…';

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-theme">
      {/* ── Top bar ── */}
      <div className="flex items-center px-4 pt-6 pb-3">
        <button
          onClick={endCall}
          className="w-10 h-10 rounded-full bg-elevated border border-theme flex items-center justify-center"
          aria-label="Minimise call"
        >
          <ChevronDown className="w-5 h-5 text-theme-primary" />
        </button>
        <div className="flex-1 flex items-center justify-center gap-1 text-theme-muted text-xs">
          <SignalHigh className="w-3.5 h-3.5" />
          AOS Voice Call
        </div>
        <button className="w-10 h-10 rounded-full bg-elevated border border-theme flex items-center justify-center">
          <MoreVertical className="w-5 h-5 text-theme-primary" />
        </button>
      </div>

      {/* ── Caller card ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        {/* Avatar with pulse rings while ringing */}
        <div className="relative flex items-center justify-center">
          {!connected && (
            <>
              <span className="absolute w-44 h-44 rounded-full bg-primary/10 animate-ping" />
              <span className="absolute w-36 h-36 rounded-full bg-primary/15 animate-ping [animation-delay:0.4s]" />
            </>
          )}
          <div
            className="relative w-32 h-32 md:w-36 md:h-36 rounded-full bg-surface flex items-center justify-center shadow-2xl"
            style={{ borderWidth: 3, borderStyle: 'solid', borderColor: 'rgba(193,18,31,0.30)' }}
          >
            <span className="text-5xl md:text-6xl font-semibold text-primary">{chat.avatar}</span>
          </div>
        </div>

        <h1 className="mt-7 text-2xl md:text-3xl font-semibold text-theme-primary truncate max-w-xs">
          {chat.name}
        </h1>
        <p className="mt-1 text-sm text-theme-muted">+254 7•• ••• •••</p>

        {/* Status pill */}
        <div className="mt-5 inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-elevated border border-theme">
          {connected ? (
            <>
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="font-mono text-sm tracking-wider text-theme-primary">{fmt(seconds)}</span>
            </>
          ) : (
            <>
              <span
                className="w-4 h-4 rounded-full border-2 border-primary/30 animate-spin"
                style={{ borderTopColor: 'var(--primary)' }}
              />
              <span className="text-sm text-theme-secondary">{statusLabel}</span>
            </>
          )}
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="px-6 pb-10 md:pb-14">
        {/* Incoming + not yet accepted: show Decline + Accept */}
        {!accepted ? (
          <div className="flex items-center justify-center gap-16">
            <CircleAction
              color="bg-primary"
              ring="shadow-[0_0_30px_rgba(193,18,31,0.40)]"
              onClick={endCall}
              ariaLabel="Decline call"
            >
              <PhoneOff className="w-7 h-7 text-white" />
            </CircleAction>
            <CircleAction
              color="bg-green-500"
              ring="shadow-[0_0_30px_rgba(34,197,94,0.45)]"
              onClick={() => setAccepted(true)}
              ariaLabel="Accept call"
            >
              <Phone className="w-7 h-7 text-white" />
            </CircleAction>
          </div>
        ) : (
          <div className="max-w-md mx-auto flex flex-col items-center gap-9">
            {/* 4-button row: Mute / Video / Speaker / Keypad */}
            <div className="flex items-center justify-center gap-5 md:gap-7">
              <ControlButton
                active={muted}
                icon={muted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                label={muted ? 'Unmute' : 'Mute'}
                onClick={() => setMuted(m => !m)}
              />
              <ControlButton
                active={videoOn}
                icon={videoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                label="Video"
                onClick={() => setVideoOn(v => !v)}
              />
              <ControlButton
                active={speakerOn}
                icon={speakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                label="Speaker"
                onClick={() => setSpeakerOn(s => !s)}
              />
              <ControlButton
                icon={<Grid3x3 className="w-5 h-5" />}
                label="Keypad"
                onClick={() => {}}
              />
            </div>

            {/* End call */}
            <button
              onClick={endCall}
              aria-label="End call"
              className="w-[72px] h-[72px] rounded-full bg-primary flex items-center justify-center shadow-[0_0_30px_rgba(193,18,31,0.50)] hover:bg-primary-hover active:scale-95 transition-all"
            >
              <PhoneOff className="w-8 h-8 text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ControlButton({
  active, icon, label, onClick,
}: { active?: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 group"
    >
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center border border-theme transition-colors"
        style={{
          backgroundColor: active ? 'var(--primary)' : 'var(--elevated)',
          color:           active ? '#FFFFFF'        : 'var(--text-primary)',
        }}
      >
        {icon}
      </div>
      <span className="text-[11px] text-theme-secondary">{label}</span>
    </button>
  );
}

function CircleAction({
  color, ring, onClick, ariaLabel, children,
}: {
  color: string;
  ring: string;
  onClick: () => void;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`w-[72px] h-[72px] rounded-full ${color} ${ring} flex items-center justify-center active:scale-95 transition-transform`}
    >
      {children}
    </button>
  );
}
