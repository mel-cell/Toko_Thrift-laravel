"use client";

import React, { useState, useEffect } from "react";
import { isAuthenticated, getCurrentUser } from "@/lib/auth";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";

export default function UserHeader() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setLoggedIn(isAuthenticated());
    setUser(getCurrentUser());
  }, []);

  return (
    <header className="fixed left-1/2 top-0 z-50 w-4/5 -translate-x-1/2 bg-white shadow p-4 px-6 flex items-center justify-between rounded-b-4xl">
      <div className="text-xl font-bold">Stuffus</div>
      <nav className="space-x-4">
        <a href="/" className="hover:underline">Beranda</a>
        <a href="/shop" className="hover:underline">Shop</a>
        <a href="/blog" className="hover:underline">Blog</a>
      </nav>
      <div className="flex items-center space-x-4">
        {loggedIn ? (
          <>
            <button aria-label="Search" className="p-2 rounded hover:bg-gray-200">
              🔍
            </button>
            <button aria-label="Cart" className="p-2 rounded hover:bg-gray-200">
              🛒
            </button>
            <Avatar>
              {user && user.avatar ? (
                <AvatarImage src={user.avatar} alt="User Avatar" />
              ) : (
                <AvatarFallback>
                  <span className="text-xs">U</span>
                </AvatarFallback>
              )}
            </Avatar>
          </>
        ) : (
          <Button asChild>
            <a href="/login">Login</a>
          </Button>
        )}
      </div>
    </header>
  );
}
