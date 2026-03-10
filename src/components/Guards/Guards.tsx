import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface Props {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: Props) => {
  const { user, loading, profile } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        fontFamily: 'var(--font-family)',
        fontSize: '0.9rem',
        color: 'var(--text-muted)',
      }}>
        Yükleniyor…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (profile && !profile.onboardingComplete && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

export const OnboardingGuard = ({ children }: Props) => {
  const { user, loading, profile } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        fontFamily: 'var(--font-family)',
        fontSize: '0.9rem',
        color: 'var(--text-muted)',
      }}>
        Yükleniyor…
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;
  if (profile?.onboardingComplete) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};
