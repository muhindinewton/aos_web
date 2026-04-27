'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Eye, EyeOff, Check } from 'lucide-react';
import ProtectedRoute from '../../components/protected-route';

function SecurityPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'password' | 'security'>('password');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [rememberPassword, setRememberPassword] = useState(true);
  const [faceId, setFaceId] = useState(false);
  const [biometricId, setBiometricId] = useState(true);

  const isFormValid = oldPassword && newPassword && confirmPassword;

  const handleUpdate = () => {
    if (isFormValid) setShowSuccess(true);
  };

  return (
    <>
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-6 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="w-11 h-11 rounded-xl bg-surface border border-theme flex items-center justify-center text-theme-primary hover:bg-elevated transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="flex-1 text-center text-lg font-semibold text-theme-primary">
            {activeTab === 'password' ? 'Change Password' : 'Account Security'}
          </h1>
          <div className="w-11" />
        </div>

        {/* Tab Selector */}
        <div className="flex bg-elevated rounded-full p-1 mb-6">
          {(['password', 'security'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-theme-primary text-theme-inverted'
                  : 'text-theme-muted'
              }`}
            >
              {tab === 'password' ? 'Change password' : 'Security'}
            </button>
          ))}
        </div>

        {activeTab === 'password' ? (
          <>
            <div className="flex-1 space-y-5">
              <PasswordField
                label="Old password"
                placeholder="Enter your old password"
                value={oldPassword}
                onChange={setOldPassword}
                show={showOld}
                onToggle={() => setShowOld((v) => !v)}
              />
              <PasswordField
                label="New password"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={setNewPassword}
                show={showNew}
                onToggle={() => setShowNew((v) => !v)}
              />
              <PasswordField
                label="Confirm password"
                placeholder="Re-enter your new password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                show={showConfirm}
                onToggle={() => setShowConfirm((v) => !v)}
              />
            </div>
            <button
              onClick={handleUpdate}
              disabled={!isFormValid}
              className={`w-full mt-8 py-4 rounded-full font-semibold text-base transition-colors ${
                isFormValid
                  ? 'bg-primary text-white hover:bg-primary-hover'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              Update
            </button>
          </>
        ) : (
          <div className="bg-surface border border-theme rounded-2xl divide-y divide-theme">
            <SecurityToggle
              label="Remember Password"
              value={rememberPassword}
              onChange={setRememberPassword}
            />
            <SecurityToggle label="Face ID" value={faceId} onChange={setFaceId} />
            <SecurityToggle label="Biometric ID" value={biometricId} onChange={setBiometricId} />
          </div>
        )}
      </div>

      {/* Success Sheet */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowSuccess(false)} />
          <div className="relative bg-surface rounded-t-3xl w-full max-w-md p-6 text-center animate-slide-up">
            <div className="w-16 h-16 rounded-full bg-theme-primary flex items-center justify-center mx-auto mb-5">
              <Check className="w-8 h-8 text-theme-inverted" />
            </div>
            <h2 className="text-lg font-semibold text-theme-primary mb-2">
              Password Change Successful
            </h2>
            <p className="text-sm text-theme-muted mb-6">
              Your password has been updated successfully.
            </p>
            <button
              onClick={() => {
                setShowSuccess(false);
                router.back();
              }}
              className="w-full py-3.5 rounded-full bg-primary text-white font-semibold hover:bg-primary-hover transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function SecurityPageWrapper() {
  return <ProtectedRoute><SecurityPage /></ProtectedRoute>;
}

function PasswordField({
  label,
  placeholder,
  value,
  onChange,
  show,
  onToggle,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-theme-primary mb-2">{label}</label>
      <div className="flex items-center bg-surface border border-theme rounded-xl px-4 py-3 focus-within:border-primary transition-colors">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-theme-primary placeholder:text-theme-muted outline-none"
        />
        <button onClick={onToggle} className="ml-2 text-theme-muted hover:text-theme-primary transition-colors">
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

function SecurityToggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-4">
      <span className="font-medium text-theme-primary">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`w-12 h-7 rounded-full transition-colors flex items-center px-1 ${
          value ? 'bg-theme-primary' : 'bg-gray-300 dark:bg-gray-600'
        }`}
      >
        <div
          className={`w-5 h-5 rounded-full bg-surface shadow-sm transition-transform ${
            value ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
