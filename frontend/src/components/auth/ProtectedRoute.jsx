'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, isAdmin, isPengguna, getCurrentUser } from '../../lib/auth';

export default function ProtectedRoute({
  children,
  requiredRole = null, // 'Admin' or 'Pengguna'
  redirectTo = '/login',
  fallback = null
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      const user = getCurrentUser();

      if (!authenticated) {
        setIsAuthorized(false);
        setIsLoading(false);
        router.push(redirectTo);
        return;
      }

      if (requiredRole) {
        if (requiredRole === 'Admin' && !isAdmin()) {
          setIsAuthorized(false);
          setIsLoading(false);
          router.push('/dashboard'); // Redirect users to user dashboard
          return;
        }

        if (requiredRole === 'Pengguna' && !isPengguna()) {
          setIsAuthorized(false);
          setIsLoading(false);
          router.push('/admin/products'); // Redirect admins to admin dashboard
          return;
        }
      }

      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router, requiredRole, redirectTo]);

  if (isLoading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Will redirect in useEffect
  }

  return children;
}
