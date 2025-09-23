  "use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isAuthenticated, getCurrentUser, logout } from "@/lib/auth";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";

export default function UserHeader() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartNotification, setCartNotification] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setLoggedIn(isAuthenticated());
    setUser(getCurrentUser());
    updateCartCount();

    // Listen for cart updates
    const handleCartUpdate = () => {
      updateCartCount();
      setCartNotification('Item added to cart!');
      setTimeout(() => setCartNotification(null), 3000);
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalItems);
  };

  const handleLogout = () => {
    logout();
    setLoggedIn(false);
    setUser(null);
    router.push("/");
  };

  const getUserInitials = (user) => {
    if (user && user.user_fullname) {
      return user.user_fullname
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return 'U';
  };

  return (
    <header className="fixed left-1/2 top-0 z-50 w-4/5 -translate-x-1/2 bg-white shadow-lg p-4 px-6 flex items-center justify-between rounded-b-3xl border-b">
      {/* Logo */}
      <Link href="/" className="text-xl font-bold text-black hover:text-gray-600 transition-colors">
        Toko Thrifty
      </Link>

      {/* Navigation */}
      <nav className="hidden md:flex space-x-6">
        <Link href="/" className="text-gray-700 hover:text-black transition-colors font-medium">
          Home
        </Link>
        <Link href="/shop" className="text-gray-700 hover:text-black transition-colors font-medium">
          Shop
        </Link>
        <Link href="/blog" className="text-gray-700 hover:text-black transition-colors font-medium">
          Blog
        </Link>
      </nav>

      {/* Right Side Actions */}
      <div className="flex items-center space-x-3">
        {loggedIn ? (
          <>
            {/* Search Button */}
            <button
              aria-label="Search"
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => router.push('/shop')}
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Cart Button */}
            <Link href="/cart">
              <button
                aria-label="Cart"
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </button>
            </Link>

            {/* User Avatar Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Avatar className="w-8 h-8">
                  {user && user.user_profil_url ? (
                    <AvatarImage src={user.user_profil_url} alt="Profile" />
                  ) : (
                    <AvatarFallback className="bg-black text-white text-sm font-medium">
                      {getUserInitials(user)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <span className="text-sm font-medium text-black hidden sm:block">
                  {user?.user_fullname?.split(' ')[0] || 'User'}
                </span>
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <Link
                    href="/profil"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </Link>
                  <Link
                    href="/orders"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    My Orders
                  </Link>
                  <Link
                    href="/payment-methods"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Payment Methods
                  </Link>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center space-x-3">
            <Button asChild variant="outline" className="hidden sm:inline-flex">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="bg-black hover:bg-purple-700">
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Menu Button (if needed) */}
      <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Cart Notification */}
      {cartNotification && (
        <div className="fixed top-20 right-4 z-50 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-lg">
          {cartNotification}
        </div>
      )}
    </header>
  );
}
