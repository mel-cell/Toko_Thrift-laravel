import React from "react";
import Link from "next/link";

export default function UserHeader({ isLoggedIn }) {
  return (
    <header className="w-full bg-white shadow-md p-4 flex items-center justify-between">
      <div className="text-xl font-bold">Stuffus</div>
      <nav className="space-x-4">
        <Link href="/">
          <a className="hover:underline">Beranda</a>
        </Link>
        <Link href="/shop">
          <a className="hover:underline">Shop</a>
        </Link>
        <Link href="/blog">
          <a className="hover:underline">Blog</a>
        </Link>
      </nav>
      <div className="flex items-center space-x-4">
        {!isLoggedIn ? (
          <>
            <Link href="/login">
              <a className="px-4 py-2 border rounded hover:bg-gray-200">Login</a>
            </Link>
            <Link href="/register">
              <a className="px-4 py-2 border rounded hover:bg-gray-200">Register</a>
            </Link>
          </>
        ) : (
          <>
            <button aria-label="Cart" className="p-2 rounded hover:bg-gray-200">
              🛒
            </button>
            <Link href="/profil">
              <a>
                <div className="w-8 h-8 rounded-full bg-gray-300"></div>
              </a>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
