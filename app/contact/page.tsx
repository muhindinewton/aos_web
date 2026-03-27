'use client';

import React from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { chats } from '../lib/data';

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-theme-primary">Messages</h1>
        <span className="text-sm text-theme-muted">{chats.length} conversations</span>
      </div>

      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
        <input type="text" placeholder="Search messages..." className="w-full bg-surface border border-theme rounded-lg py-2.5 pl-10 pr-4 text-sm text-theme-primary placeholder:text-theme-muted outline-none focus:border-primary" />
      </div>

      <div className="space-y-1">
        {chats.map((chat) => (
          <Link key={chat.id} href={`/chat/${chat.id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface transition-colors">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">{chat.avatar}</span>
              </div>
              {chat.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-900" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-theme-primary text-sm">{chat.name}</h3>
                <span className="text-xs text-theme-muted">{chat.timestamp}</span>
              </div>
              <p className="text-sm text-theme-muted truncate">{chat.lastMessage}</p>
            </div>
            {chat.unread > 0 && (
              <div className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                {chat.unread}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
