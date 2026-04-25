'use client';

import React, { useState, useEffect } from 'react';
import { SplashScreen } from './splash-screen';

interface AppWrapperProps {
  children: React.ReactNode;
}

export function AppWrapper({ children }: AppWrapperProps) {
  const [showSplash, setShowSplash] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if user has already seen splash in this session
    const seen = sessionStorage.getItem('aos_splash_seen');
    if (!seen) {
      setShowSplash(true);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem('aos_splash_seen', 'true');
  };

  // Always render children consistently for hydration
  return (
    <>
      {mounted && showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <div className={mounted && showSplash ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}>
        {children}
      </div>
    </>
  );
}
