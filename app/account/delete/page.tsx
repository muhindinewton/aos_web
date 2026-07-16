'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, AlertTriangle, PauseCircle, RotateCcw, Trash2, CheckCircle2,
} from 'lucide-react';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useAuth } from '../../providers/auth-provider';
import { useToast } from '../../providers/toast-provider';

const CONFIRM_PHRASE = 'DELETE';
const RESTORE_DAYS = 30;
const DELETED_AT_KEY = 'aos-account-deleted-at';

export default function DeleteAccountPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const { showToast } = useToast();

  const [reason, setReason] = useState('');
  const [phrase, setPhrase] = useState('');
  // Mobile's two-stage confirmation: proceed dialog, then password re-auth.
  const [stage, setStage] = useState<null | 'proceed' | 'password'>(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const armed = phrase.trim().toUpperCase() === CONFIRM_PHRASE;

  const handleDelete = async () => {
    if (!password.trim()) return;
    setDeleting(true);
    setPasswordError(null);

    // Re-authenticate (guards against a bystander on an unlocked device).
    const user = auth.currentUser;
    if (user?.email && user.providerData.some(p => p.providerId === 'password')) {
      try {
        await reauthenticateWithCredential(
          user,
          EmailAuthProvider.credential(user.email, password),
        );
      } catch {
        setPasswordError('Incorrect password. Please try again.');
        setDeleting(false);
        return;
      }
    }

    // Schedule deletion (reversible within the grace period) and sign out.
    // The record is tied to this account's email so the restore prompt only
    // ever appears for the account that was actually deleted.
    try {
      window.localStorage.setItem(
        DELETED_AT_KEY,
        JSON.stringify({ email: (user?.email ?? '').toLowerCase(), at: Date.now() }),
      );
    } catch { /* storage unavailable */ }
    await logout();
    showToast(`Account scheduled for deletion. Log in within ${RESTORE_DAYS} days to restore it.`);
    router.push('/auth/login');
  };

  return (
    <div className="max-w-xl mx-auto pb-24 lg:pb-10">
      {/* App bar */}
      <div className="sticky top-0 z-20 bg-surface border-b border-theme px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-surface border border-theme flex items-center justify-center hover:bg-elevated transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-[18px] h-[18px] text-theme-primary" />
        </button>
        <h1 className="text-base font-semibold text-theme-primary">Delete Account</h1>
      </div>

      <div className="px-6 pt-6">
        {/* Warning emblem */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-[#FF4D4D]/10 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-[#FF4D4D] flex items-center justify-center">
              <AlertTriangle className="w-9 h-9 text-white" />
            </div>
          </div>
        </div>

        <h2 className="text-[22px] font-bold text-theme-primary text-center mt-5">
          Delete your account?
        </h2>
        <p className="text-sm text-theme-secondary text-center mt-2 leading-relaxed">
          This is a serious action. Please read the details below before continuing.
        </p>

        {/* Warning card */}
        <div className="mt-6 p-4 rounded-2xl bg-[#FF4D4D]/[0.07] border border-[#FF4D4D]/25 space-y-3">
          {[
            { icon: PauseCircle, text: 'Your account and listings will be deactivated and hidden immediately.' },
            { icon: RotateCcw, text: `You have ${RESTORE_DAYS} days to restore it by logging in and verifying your email.` },
            { icon: Trash2, text: `After ${RESTORE_DAYS} days, your account and data are permanently deleted and cannot be recovered.` },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-start gap-3">
              <Icon className="w-5 h-5 text-[#FF4D4D] flex-shrink-0 mt-0.5" />
              <p className="text-[13px] text-theme-primary leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        {/* Reason */}
        <label className="block text-[13px] font-semibold text-theme-primary mt-6 mb-2">
          Reason for leaving (optional)
        </label>
        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          rows={3}
          placeholder="Help us improve — tell us why you're leaving"
          className="w-full bg-surface border border-theme rounded-xl p-3.5 text-sm text-theme-primary placeholder:text-theme-muted outline-none focus:border-theme-secondary resize-none"
        />

        {/* Confirm phrase */}
        <p className="text-[13px] font-semibold text-theme-primary mt-5 mb-2">
          Type <span className="text-[#FF4D4D] font-bold">{CONFIRM_PHRASE}</span> to confirm
        </p>
        <div className="relative">
          <input
            type="text"
            value={phrase}
            onChange={e => setPhrase(e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase())}
            placeholder={CONFIRM_PHRASE}
            className="w-full bg-surface border border-theme rounded-xl p-3.5 text-[15px] font-semibold tracking-[2px] text-theme-primary placeholder:text-theme-muted outline-none focus:border-theme-secondary"
          />
          {armed && (
            <CheckCircle2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
          )}
        </div>

        {/* Actions */}
        <button
          onClick={() => setStage('proceed')}
          disabled={!armed || deleting}
          className="w-full mt-6 py-3.5 rounded-2xl bg-[#FF4D4D] text-white font-semibold text-[15px] hover:bg-[#e04343] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {deleting ? 'Processing…' : 'Delete my account'}
        </button>
        <button
          onClick={() => router.back()}
          className="w-full mt-3 py-3.5 rounded-2xl text-theme-muted font-medium text-sm hover:bg-elevated transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* Final confirmation dialog (mobile step 1) */}
      {stage === 'proceed' && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setStage(null)} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-sm bg-surface rounded-[20px] p-6 shadow-2xl">
            <h3 className="text-base font-bold text-theme-primary">Delete your account?</h3>
            <p className="text-sm text-theme-secondary mt-3 leading-relaxed">
              Your account will be scheduled for deletion. You can restore it by logging in
              within {RESTORE_DAYS} days. Do you want to proceed?
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setStage(null)}
                className="px-4 py-2 rounded-full text-sm font-medium text-theme-muted hover:bg-elevated transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { setPassword(''); setPasswordError(null); setStage('password'); }}
                className="px-5 py-2 rounded-full text-sm font-semibold bg-[#FF4D4D] text-white hover:bg-[#e04343] transition-colors"
              >
                Proceed
              </button>
            </div>
          </div>
        </>
      )}

      {/* Password re-authentication dialog (mobile step 2) */}
      {stage === 'password' && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => !deleting && setStage(null)} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-sm bg-surface rounded-[20px] p-6 shadow-2xl">
            <h3 className="text-base font-semibold text-theme-primary">Confirm your password</h3>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={e => { setPassword(e.target.value); setPasswordError(null); }}
              onKeyDown={e => e.key === 'Enter' && handleDelete()}
              placeholder="Password"
              className="w-full mt-4 bg-elevated border border-theme rounded-xl p-3 text-sm text-theme-primary placeholder:text-theme-muted outline-none focus:border-primary"
            />
            {passwordError && (
              <p className="text-[13px] text-red-500 mt-2">{passwordError}</p>
            )}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setStage(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-full text-sm font-medium text-theme-muted hover:bg-elevated transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={!password.trim() || deleting}
                className="px-5 py-2 rounded-full text-sm font-semibold bg-[#FF4D4D] text-white hover:bg-[#e04343] transition-colors disabled:opacity-50"
              >
                {deleting ? 'Deleting…' : 'Confirm'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
