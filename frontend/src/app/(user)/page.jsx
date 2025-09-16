"use client";

import React, { useState } from "react";
import UserHeader from "./UserHeader";
import Footer from "./Footer";

export default function HomePage() {
  // Simulate login state
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <UserHeader isLoggedIn={isLoggedIn} />
      <main className="max-w-7xl mx-auto p-4">
        <section className="text-center my-8">
          <h1 className="text-4xl font-bold mb-4">Welcome to Stuffus</h1>
          <p className="text-gray-600">
            This is your dashboard home page. Explore our products and blog.
          </p>
          <button
            onClick={() => setIsLoggedIn(!isLoggedIn)}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {isLoggedIn ? "Logout" : "Login"}
          </button>
        </section>
      </main>
      <Footer />
    </>
  );
}
