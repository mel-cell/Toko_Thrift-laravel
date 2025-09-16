"use client";

import React, { useState } from "react";
import UserHeader from "../UserHeader";
import Footer from "../Footer";

const blogPosts = [
  {
    id: 1,
    title: "Welcome to Stuffus Blog",
    date: "2024-06-01",
    content:
      "This blog shares news, updates, and tips about our web shop Stuffus. Stay tuned for more!",
  },
  {
    id: 2,
    title: "How to Get the Best Deals",
    date: "2024-06-10",
    content:
      "Learn how to use our shop filters and categories to find the best deals on your favorite products.",
  },
  {
    id: 3,
    title: "New Arrivals This Month",
    date: "2024-06-15",
    content:
      "Check out the latest products added to our shop this month. Don't miss out!",
  },
];

export default function BlogPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <UserHeader isLoggedIn={isLoggedIn} />
      <main className="max-w-7xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Blog</h1>
        <button
          onClick={() => setIsLoggedIn(!isLoggedIn)}
          className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {isLoggedIn ? "Logout" : "Login"}
        </button>
        <section className="space-y-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="border-b pb-4">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <time className="text-sm text-gray-500">{post.date}</time>
              <p className="mt-2 text-gray-700">{post.content}</p>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
