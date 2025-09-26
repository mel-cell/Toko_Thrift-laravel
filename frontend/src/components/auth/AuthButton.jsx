'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '../../lib/auth';

export default function AuthButton({
  children,
  onClick,
  disabled = false,
  className = '',
  requireAuth = true,
  redirectTo = '/login',
  fallbackText = 'Login Required',
  showNotification = false,
  notificationMessage = 'Action completed successfully!',
  ...props
}) {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    setIsAuth(isAuthenticated());
  }, []);

  const handleClick = (e) => {
    if (requireAuth && !isAuth) {
      e.preventDefault();
      router.push(redirectTo);
      return;
    }

    if (onClick && !disabled) {
      const result = onClick(e);

      // Show notification if enabled and action was successful
      if (showNotification && result !== false) {
        setNotification(notificationMessage);
        setTimeout(() => setNotification(null), 3000);
      }
    }
  };

  if (requireAuth && !isAuth) {
    return (
      <button
        className={`${className} opacity-50 cursor-not-allowed`}
        disabled={true}
        title={fallbackText}
        {...props}
      >
        {fallbackText}
      </button>
    );
  }

  return (
    <>
      <button
        className={className}
        onClick={handleClick}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>

      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg shadow-lg">
          {notification}
        </div>
      )}
    </>
  );
}
