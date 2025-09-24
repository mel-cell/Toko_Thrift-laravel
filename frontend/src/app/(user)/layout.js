"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated, isPengguna, getCurrentUser } from '../../lib/auth';
import UserHeader from "@/components/header/userheader";
import Footer from "@/components/footer/footer";

export default function UserLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      // Allow access to /shop and /blog without authentication
      if (pathname.startsWith('/shop') || pathname.startsWith('/blog')) {
        setIsAuthorized(true);
        setIsLoading(false);
        return;
      }

      const user = getCurrentUser();

      if (!isAuthenticated()) {
        router.push('/login');
        return;
      }

      if (!isPengguna()) {
        router.push('/admin/products');
        return;
      }

      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router, pathname]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // If not authorized, don't render children
  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <UserHeader />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
