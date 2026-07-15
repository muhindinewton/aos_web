'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, AlertTriangle, PauseCircle, RotateCcw, Trash2, CheckCircle2,
} from 'lucide-react';
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
  const [confirmingPassword, setConfirmingPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [deleting, setDeleting] = useState(false);

  const armed = phrase.trim().toUpperCase() === CONFIRM_PHRASE;

  const handleDelete = async () => {
    if (!password.trim()) return;
    setDeleting(true);
    try {
      window.localStorage.setItem(DELETED_AT_KEY, String(Date.now()));
    } catch { /* storage unavailable */ }
    await logout();
    showToast('Your account has been deactivated. You have 30 days to restore it.');
    router.push('/auth/restore');
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
          onClick={() => setConfirmingPassword(true)}
          disabled={!armed}
          className="w-full mt-6 py-3.5 rounded-2xl bg-[#FF4D4D] text-white font-semibold text-[15px] hover:bg-[#e04343] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Delete my account
        </button>
        <button
          onClick={() => router.back()}
          className="w-full mt-3 py-3.5 rounded-2xl text-theme-muted font-medium text-sm hover:bg-elevated transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* Password confirmation dialog */}
      {confirmingPassword && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setConfirmingPassword(false)} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-sm bg-surface rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-semibold text-theme-primary">Confirm your password</h3>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full mt-4 bg-elevated border border-theme rounded-xl p-3 text-sm text-theme-primary placeholder:text-theme-muted outline-none focus:border-primary"
            />
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setConfirmingPassword(false)}
                className="px-4 py-2 rounded-full text-sm font-medium text-theme-muted hover:bg-elevated transition-colors"
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
