'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, MessageCircle, Store, Ban, Flag, BellOff, Timer, Lock,
  ChevronRight, ImageIcon, UserPlus, Check,
} from 'lucide-react';
import { chats } from '../../../lib/data';
import { useToast } from '../../../providers/toast-provider';

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export default function ChatProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const chat = chats.find(c => c.id === params.id) || chats[0];

  const [isFollowing, setIsFollowing] = useState(false);
  const [muted, setMuted] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'Block' | 'Report' | null>(null);

  // Deterministic demo stats derived from the chat id
  const seed = Number(chat.id) || 1;
  const following = 12 + seed * 7;
  const followers = 340 + seed * 913;
  const likes = 1200 + seed * 2417;

  return (
    <div className="max-w-2xl mx-auto pb-24 lg:pb-8">
      {/* App bar */}
      <div className="sticky top-0 z-20 bg-surface border-b border-theme px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-surface border border-theme flex items-center justify-center hover:bg-elevated transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-[18px] h-[18px] text-theme-primary" />
        </button>
        <h1 className="text-base font-semibold text-theme-primary">Contact info</h1>
      </div>

      <div className="px-4 pt-6 space-y-4">
        {/* Identity */}
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-primary/15 flex items-center justify-center ring-4 ring-primary/10">
            <span className="text-3xl font-bold text-primary">{chat.avatar}</span>
          </div>
          <h2 className="mt-3 text-xl font-bold text-theme-primary">{chat.name}</h2>
          <p className="text-sm text-theme-muted mt-0.5">Content creator on AOS Africa</p>
          <p className={`text-xs mt-1.5 flex items-center gap-1.5 ${chat.online ? 'text-green-500' : 'text-theme-muted'}`}>
            <span className={`w-2 h-2 rounded-full ${chat.online ? 'bg-green-500' : 'bg-theme-muted'}`} />
            {chat.online ? 'Online' : 'Offline'}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-8 mt-5">
            {[
              { value: fmt(following), label: 'Following', href: `/feed/followers/${encodeURIComponent(chat.name)}` },
              { value: fmt(followers), label: 'Followers', href: `/feed/followers/${encodeURIComponent(chat.name)}` },
              { value: fmt(likes), label: 'Likes', href: null },
            ].map(s => {
              const inner = (
                <div className="text-center">
                  <p className="text-lg font-bold text-theme-primary">{s.value}</p>
                  <p className="text-xs text-theme-muted">{s.label}</p>
                </div>
              );
              return s.href
                ? <Link key={s.label} href={s.href}>{inner}</Link>
                : <div key={s.label}>{inner}</div>;
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-5 w-full max-w-sm">
            <button
              onClick={() => setIsFollowing(f => !f)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                isFollowing
                  ? 'bg-elevated border border-theme text-theme-primary'
                  : 'bg-primary text-white hover:bg-primary-hover'
              }`}
            >
              {isFollowing ? <Check className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              {isFollowing ? 'Following' : 'Follow'}
            </button>
            <Link
              href={`/chat/${chat.id}`}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full border border-primary text-primary text-sm font-semibold hover:bg-primary/5 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Message
            </Link>
          </div>
        </div>

        {/* Media, links and docs */}
        <div className="bg-surface border border-theme rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-theme-primary">Media, links and docs</h3>
            <Link href={`/chat/${chat.id}`} className="text-xs font-semibold text-primary flex items-center">
              See all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="flex flex-col items-center py-8 text-theme-muted">
            <ImageIcon className="w-10 h-10 opacity-40" />
            <p className="text-xs mt-2">No media yet</p>
          </div>
        </div>

        {/* Chat settings */}
        <div className="bg-surface border border-theme rounded-2xl divide-y divide-[var(--border,#E8E8E8)] overflow-hidden">
          <button
            onClick={() => setMuted(m => !m)}
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-elevated transition-colors"
          >
            <BellOff className="w-5 h-5 text-theme-muted" />
            <span className="flex-1 text-left text-sm text-theme-primary">Mute notifications</span>
            <span className={`w-10 h-6 rounded-full p-0.5 transition-colors ${muted ? 'bg-primary' : 'bg-theme-muted/30'}`}>
              <span className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${muted ? 'translate-x-4' : ''}`} />
            </span>
          </button>
          <div className="flex items-center gap-3 px-4 py-3.5">
            <Timer className="w-5 h-5 text-theme-muted" />
            <span className="flex-1 text-sm text-theme-primary">Disappearing messages</span>
            <span className="text-xs text-theme-muted">Off</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3.5">
            <Lock className="w-5 h-5 text-theme-muted" />
            <div className="flex-1">
              <p className="text-sm text-theme-primary">Encryption</p>
              <p className="text-[11px] text-theme-muted">Messages are end-to-end encrypted</p>
            </div>
          </div>
        </div>

        {/* Marketplace */}
        <div className="bg-surface border border-theme rounded-2xl overflow-hidden">
          <Link
            href={`/seller/${chat.id}`}
            className="flex items-center gap-3 px-4 py-3.5 hover:bg-elevated transition-colors"
          >
            <Store className="w-5 h-5 text-theme-muted" />
            <span className="flex-1 text-sm text-theme-primary">View storefront</span>
            <ChevronRight className="w-4 h-4 text-theme-muted" />
          </Link>
        </div>

        {/* Danger zone */}
        <div className="bg-surface border border-theme rounded-2xl divide-y divide-[var(--border,#E8E8E8)] overflow-hidden">
          <button
            onClick={() => setConfirmAction('Block')}
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-elevated transition-colors"
          >
            <Ban className="w-5 h-5 text-primary" />
            <span className="flex-1 text-left text-sm text-primary font-medium">Block {chat.name}</span>
          </button>
          <button
            onClick={() => setConfirmAction('Report')}
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-elevated transition-colors"
          >
            <Flag className="w-5 h-5 text-primary" />
            <span className="flex-1 text-left text-sm text-primary font-medium">Report {chat.name}</span>
          </button>
        </div>
      </div>

      {/* Confirm dialog */}
      {confirmAction && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setConfirmAction(null)} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-sm bg-surface rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-semibold text-theme-primary">
              {confirmAction} {chat.name}?
            </h3>
            <p className="text-sm text-theme-muted mt-2">
              {confirmAction === 'Block'
                ? 'Blocked contacts can no longer call you or send you messages.'
                : 'This contact will be reported to AOS for review.'}
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 rounded-full text-sm font-medium text-theme-muted hover:bg-elevated transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  showToast(`${chat.name} ${confirmAction === 'Block' ? 'blocked' : 'reported'}`);
                  setConfirmAction(null);
                }}
                className="px-4 py-2 rounded-full text-sm font-semibold bg-primary text-white hover:bg-primary-hover transition-colors"
              >
                {confirmAction}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
