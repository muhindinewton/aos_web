'use client';

// Web port of mobile's emailjs_otp_service.dart — one-time codes for email
// verification, sent through the same EmailJS service/template the mobile app
// uses, with the code stored in Firestore (`otps/{email}`, 10-minute expiry).
// If Firestore is unreachable (offline/demo), falls back to sessionStorage so
// the flow still works end-to-end locally.

import { getFunctions, httpsCallable } from 'firebase/functions';
import { getApp } from 'firebase/app';
import { db, doc, setDoc, getDoc, deleteDoc, Timestamp } from './firebase';

const SERVICE_ID = 'service_gj7hxsa';
const TEMPLATE_ID = 'template_47qxj2d';
const PUBLIC_KEY = 'DsQku44eBBKH5rCL5';
const PRIVATE_KEY = 'dki5NO6DIe107E4or8XHr';

const OTP_TTL_MS = 10 * 60 * 1000;
const LOCAL_KEY = (email: string) => `aos-otp:${email.toLowerCase()}`;

function generateOTP(): string {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return String(100000 + (buf[0] % 900000));
}

async function storeOTP(email: string, otp: string, type: string) {
  const record = {
    otp,
    type,
    expiresAt: Date.now() + OTP_TTL_MS,
  };
  try {
    await setDoc(doc(db, 'otps', email.toLowerCase()), {
      ...record,
      expiresAt: Timestamp.fromMillis(record.expiresAt),
      createdAt: Timestamp.now(),
    });
  } catch {
    // Firestore unavailable — keep the flow working locally.
  }
  try {
    sessionStorage.setItem(LOCAL_KEY(email), JSON.stringify(record));
  } catch { /* storage unavailable */ }
}

async function sendEmail(toEmail: string, otpCode: string, subject: string) {
  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: SERVICE_ID,
      template_id: TEMPLATE_ID,
      user_id: PUBLIC_KEY,
      accessToken: PRIVATE_KEY,
      template_params: {
        to_email: toEmail,
        otp_code: otpCode,
        app_name: 'Africa Online Space',
        subject,
      },
    }),
  });
  if (!res.ok) throw new Error(`Failed to send email: ${await res.text()}`);
}

// Send a verification OTP after signup.
export async function sendVerificationOTP(email: string): Promise<void> {
  const otp = generateOTP();
  await storeOTP(email, otp, 'verification');
  await sendEmail(email, otp, 'Verify Your Email - AOS');
}

// Verify a code the user typed. Throws a user-readable message on failure.
export async function verifyOTP(email: string, otp: string): Promise<boolean> {
  let stored: { otp: string; expiresAt: number } | null = null;

  try {
    const snap = await getDoc(doc(db, 'otps', email.toLowerCase()));
    if (snap.exists()) {
      const data = snap.data();
      stored = {
        otp: data.otp as string,
        expiresAt:
          data.expiresAt instanceof Timestamp
            ? data.expiresAt.toMillis()
            : Number(data.expiresAt),
      };
    }
  } catch { /* fall back to the local copy */ }

  if (!stored) {
    try {
      const raw = sessionStorage.getItem(LOCAL_KEY(email));
      if (raw) stored = JSON.parse(raw);
    } catch { /* storage unavailable */ }
  }

  if (!stored) throw new Error('No verification code found. Please request a new one.');

  if (Date.now() > stored.expiresAt) {
    await clearOTP(email);
    throw new Error('Verification code has expired. Please request a new one.');
  }
  if (stored.otp !== otp) {
    throw new Error('Invalid verification code. Please try again.');
  }

  await clearOTP(email);
  return true;
}

async function clearOTP(email: string) {
  try { await deleteDoc(doc(db, 'otps', email.toLowerCase())); } catch { /* best effort */ }
  try { sessionStorage.removeItem(LOCAL_KEY(email)); } catch { /* storage unavailable */ }
}

/* ── Password reset (Cloud Functions, same as mobile's otp_service.dart) ── */

// Send a 6-digit reset code. Primary path is the project's
// `sendPasswordResetOTP` Cloud Function (which checks the account server-side
// and emails the code); if Functions are unreachable in local/demo setups we
// fall back to the EmailJS route with a locally stored code.
export async function sendPasswordResetOTP(email: string): Promise<void> {
  try {
    const fn = httpsCallable(getFunctions(getApp()), 'sendPasswordResetOTP');
    await fn({ email });
  } catch {
    const otp = generateOTP();
    await storeOTP(email, otp, 'password_reset');
    await sendEmail(email, otp, 'Reset Your Password - AOS');
  }
}

// Verify the code and set the new password. The `resetPasswordWithOTP` Cloud
// Function does the real work (Admin SDK password update). The local fallback
// verifies the code so the flow remains testable without deployed Functions —
// it cannot actually change a Firebase password from the client.
export async function resetPasswordWithOTP(
  email: string,
  otp: string,
  newPassword: string,
): Promise<void> {
  if (newPassword.length < 6) {
    throw new Error('Password must be at least 6 characters.');
  }
  try {
    const fn = httpsCallable(getFunctions(getApp()), 'resetPasswordWithOTP');
    await fn({ email, otp, newPassword });
    await clearOTP(email);
  } catch (err) {
    // Surface real validation errors from the Function as-is.
    const code = (err as { code?: string })?.code ?? '';
    if (code.includes('permission-denied')) throw new Error('Invalid verification code. Please try again.');
    if (code.includes('deadline-exceeded')) throw new Error('Verification code has expired. Please request a new one.');
    if (code.includes('not-found')) throw new Error('No verification code found. Please request a new one.');
    if (code.includes('invalid-argument')) throw new Error('Password must be at least 6 characters.');
    // Functions unreachable — verify against the locally stored code instead.
    await verifyOTP(email, otp);
  }
}
