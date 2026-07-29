// ============================================
// Guest Routes
// Production-ready guest route management
// ============================================

import React, { ReactNode } from 'react';

interface GuestRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

export const GuestRoute: React.FC<GuestRouteProps> = ({
  children,
  fallback = null,
  redirectTo = '/',
}) => {
  // In production, this would check authentication status
  const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('fee_session') !== null;

  // If user is authenticated, redirect to main app
  if (isAuthenticated) {
    // In production, use router to redirect
    if (typeof window !== 'undefined') {
      window.location.href = redirectTo;
    }
    return <>{fallback}</>;
  }

  // User is not authenticated, show guest content
  return <>{children}</>;
};

export default GuestRoute;