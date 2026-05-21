'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquare, Phone } from 'lucide-react';

// Shared tab switcher used at the top of both /chat and /calls.
// Mirrors the mobile app where Calls and Messages are sibling tabs
// you can flip between with a single tap.
export default function ChatCallsTabs() {
  const pathname = usePathname() ?? '';
  // /chat, /chat/new, /chat/123 — all live under the Messages tab
  const isMessages = pathname.startsWith('/chat');
  const isCalls    = pathname.startsWith('/call'); // also covers /calls and /call/[id]

  return (
    <div className="px-4 pt-3 pb-2 flex-shrink-0">
      <div className="flex bg-elevated rounded-2xl p-1 gap-1">
        <Link
          href="/calls"
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            isCalls ? 'bg-primary text-white shadow-sm' : 'text-theme-muted hover:text-theme-primary'
          }`}
        >
          <Phone className="w-4 h-4" /> Calls
        </Link>
        <Link
          href="/chat"
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            isMessages ? 'bg-primary text-white shadow-sm' : 'text-theme-muted hover:text-theme-primary'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Messages
        </Link>
      </div>
    </div>
  );
}
