import React from 'react';
import ProtectedRoute from '../components/protected-route';

export default function AccountProtectedLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
