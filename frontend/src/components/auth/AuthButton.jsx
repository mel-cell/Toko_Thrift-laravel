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
  ...props
}) {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);

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
      onClick(e);
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
    <button
      className={className}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
