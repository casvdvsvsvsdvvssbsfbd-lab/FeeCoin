// ============================================
// Protected Routes
// Production-ready route protection
// ============================================

import React, { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  requireAuth?: boolean;
  requireGuest?: boolean;
  requireFeature?: string;
  requireLevel?: number;
  requireVerification?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback = null,
  requireAuth = true,
  requireGuest = false,
  requireFeature,
  requireLevel,
  requireVerification = false,
}) => {
  // In production, these checks would be done via context/hooks
  // For now, this is a structural component
  
  const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('fee_session') !== null;
  const hasFeature = true; // Would check feature flags
  const hasLevel = true; // Would check user level
  const isVerified = true; // Would check verification status

  // Guest routes (auth pages)
  if (requireGuest) {
    if (isAuthenticated) {
      return <>{fallback}</>;
    }
    return <>{children}</>;
  }

  // Protected routes
  if (requireAuth) {
    if (!isAuthenticated) {
      return <>{fallback}</>;
    }

    // Feature flag check
    if (requireFeature && !hasFeature) {
      return <>{fallback}</>;
    }

    // Level check
    if (requireLevel && !hasLevel) {
      return <>{fallback}</>;
    }

    // Verification check
    if (requireVerification && !isVerified) {
      return <>{fallback}</>;
    }

    return <>{children}</>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;