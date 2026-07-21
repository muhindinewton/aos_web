'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { CONNECT_ROUTES } from './bottom-nav';

// Wraps page content with clearance for the mobile tab bar — except on the
// Connect screen, where the tab bar is hidden and the page runs full-bleed.
export function PageShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const fullBleed = CONNECT_ROUTES.includes(pathname);
  // flex-1 makes short pages absorb the leftover height, which is what keeps the
  // footer pinned to the bottom of the viewport (see AppWrapper's flex column).
  return <main className={`flex-1 ${fullBleed ? 'pb-0' : 'pb-20 lg:pb-0'}`}>{children}</main>;
}
