'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { CONNECT_ROUTES } from './bottom-nav';

// Wraps page content with clearance for the mobile tab bar — except on the
// Connect screen, where the tab bar is hidden and the page runs full-bleed.
export function PageShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const fullBleed = CONNECT_ROUTES.includes(pathname);
  return <main className={fullBleed ? 'pb-0' : 'pb-20 lg:pb-0'}>{children}</main>;
}
