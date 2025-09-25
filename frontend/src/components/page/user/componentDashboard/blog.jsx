'use client';

import React from "react";
import { Card } from "../../../ui/card";

const blogPosts = [
  {
    id: 1,
    title: "Trend Fashion Musim Panas 2024",
    excerpt: "Jelajahi koleksi terbaru untuk musim panas yang akan membuat gaya Anda semakin menawan.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=250&fit=crop",
    date: "15 Januari 2024",
    readTime: "3 min read"
  },
  {
    id: 2,
    title: "Tips Memilih Pakaian Sesuai Bentuk Tubuh",
    excerpt: "Panduan lengkap untuk memilih pakaian yang tepat sesuai dengan bentuk tubuh Anda.",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=250&fit=crop",
    date: "12 Januari 2024",
    readTime: "5 min read"
  },
  {
    id: 3,
    title: "Sustainable Fashion: Tren Ramah Lingkungan",
    excerpt: "Pelajari bagaimana fashion industry berkembang menuju praktik yang lebih berkelanjutan.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop",
    date: "10 Januari 2024",
    readTime: "4 min read"
  }
];

export default function Blog() {
  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Blog Fashion</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Temukan tips, tren terbaru, dan inspirasi fashion untuk melengkapi gaya hidup Anda
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-40 sm:h-44 lg:h-48 object-cover"
                />
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white px-2 py-1 rounded text-xs sm:text-sm font-medium text-gray-700">
                  {post.readTime}
                </div>
              </div>

              <div className="p-4 sm:p-5 lg:p-6">
                <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime}</span>
                </div>

                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-gray-600 text-xs sm:text-sm line-clamp-3 mb-3 sm:mb-4">
                  {post.excerpt}
                </p>

                <button className="text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm transition-colors">
                  Baca Selengkapnya →
                </button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-10 lg:mt-12">
          <button className="bg-gray-900 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm sm:text-base">
            Lihat Semua Artikel
          </button>
        </div>
      </div>
    </section>
  );
}
