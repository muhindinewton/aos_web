'use client';

import React, { useState, useCallback } from 'react';
import { useAuth } from '../providers/auth-provider';
import LoginPromptModal from '../components/login-prompt-modal';

export function useAuthGuard() {
  const { isLoggedIn } = useAuth();
  const [promptFeature, setPromptFeature] = useState<string | null>(null);

  const guard = useCallback(
    (action: () => void, featureName?: string) => {
      if (isLoggedIn) {
        action();
      } else {
        setPromptFeature(featureName ?? 'this feature');
      }
    },
    [isLoggedIn],
  );

  const closePrompt = useCallback(() => setPromptFeature(null), []);

  const Modal = promptFeature !== null
    ? <LoginPromptModal featureName={promptFeature} onClose={closePrompt} />
    : null;

  return { guard, Modal };
}
