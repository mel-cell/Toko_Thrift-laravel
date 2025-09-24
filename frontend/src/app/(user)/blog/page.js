'use client';

import React from "react";
import { Card } from "../../../components/ui/card";

const blogPosts = [
  {
    id: 1,
    title: "Trend Fashion Musim Panas 2024",
    excerpt: "Jelajahi koleksi terbaru untuk musim panas yang akan membuat gaya Anda semakin menawan. Dari dress flowy hingga aksesoris pantai, temukan inspirasi untuk tampil memukau di setiap kesempatan.",
    content: "Musim panas 2024 membawa tren yang lebih berani dan ekspresif. Warna-warna cerah seperti kuning lemon, biru langit, dan coral menjadi pilihan utama. Dress dengan potongan asimetris dan detail ruffle menjadi favorit para fashionista. Untuk pria, linen shirt dengan celana pendek menjadi kombinasi sempurna untuk tampil santai namun tetap stylish.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop",
    date: "15 Januari 2024",
    readTime: "5 min read",
    category: "Trend Fashion",
    author: "Sarah Fashion"
  },
  {
    id: 2,
    title: "Tips Memilih Pakaian Sesuai Bentuk Tubuh",
    excerpt: "Panduan lengkap untuk memilih pakaian yang tepat sesuai dengan bentuk tubuh Anda. Ketahui rahasia tampil percaya diri dengan pilihan outfit yang sesuai.",
    content: "Memilih pakaian yang tepat sesuai bentuk tubuh adalah kunci utama untuk tampil percaya diri. Untuk bentuk tubuh apple, pilihan empire dress atau A-line skirt akan memberikan siluet yang lebih proporsional. Bentuk tubuh pear cocok dengan atasan berpotongan V-neck dan celana straight leg. Sedangkan untuk bentuk tubuh hourglass, wrap dress dan fitted jeans adalah pilihan terbaik.",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=400&fit=crop",
    date: "12 Januari 2024",
    readTime: "7 min read",
    category: "Fashion Tips",
    author: "Maya Style"
  },
  {
    id: 3,
    title: "Sustainable Fashion: Tren Ramah Lingkungan",
    excerpt: "Pelajari bagaimana fashion industry berkembang menuju praktik yang lebih berkelanjutan. Mulai dari bahan ramah lingkungan hingga proses produksi yang bertanggung jawab.",
    content: "Sustainable fashion bukan lagi tren sesaat, melainkan kebutuhan mendesak di era modern ini. Bahan-bahan seperti organic cotton, Tencel, dan recycled polyester menjadi pilihan utama. Brand-brand fashion kini berkomitmen untuk transparansi dalam rantai pasokan mereka. Konsumen juga semakin sadar akan dampak fashion terhadap lingkungan, memilih untuk berinvestasi pada pakaian berkualitas yang tahan lama daripada fast fashion.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop",
    date: "10 Januari 2024",
    readTime: "6 min read",
    category: "Sustainable Fashion",
    author: "Eco Fashion"
  },
  {
    id: 4,
    title: "Mix and Match: Padu Padan Warna untuk Tampilan Maksimal",
    excerpt: "Rahasia padu padan warna yang tepat untuk menciptakan tampilan yang stunning. Pelajari color wheel dan teknik layering untuk gaya yang tak terlupakan.",
    content: "Mix and match warna adalah seni yang bisa dipelajari siapa saja. Color wheel menjadi panduan utama: warna complementary seperti biru dan orange menciptakan kontras yang menarik, sementara warna analogous seperti biru dan hijau memberikan kesan harmonis. Teknik layering dengan warna netral sebagai base juga efektif untuk tampilan yang sophisticated.",
    image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&h=400&fit=crop",
    date: "8 Januari 2024",
    readTime: "4 min read",
    category: "Style Guide",
    author: "Color Expert"
  },
  {
    id: 5,
    title: "Fashion untuk Pesta: Elegan dan Berkelas",
    excerpt: "Panduan memilih outfit untuk berbagai jenis pesta. Dari cocktail party hingga gala dinner, temukan gaya yang tepat untuk setiap kesempatan spesial.",
    content: "Pemilihan outfit untuk pesta tergantung pada jenis acara dan dress code. Untuk cocktail party, little black dress dengan aksesoris statement adalah pilihan klasik. Gala dinner membutuhkan gaun panjang dengan detail mewah. Sementara untuk garden party, dress dengan bahan ringan dan floral print sangat cocok. Yang terpenting adalah memilih outfit yang membuat Anda merasa percaya diri dan nyaman.",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=400&fit=crop",
    date: "5 Januari 2024",
    readTime: "5 min read",
    category: "Party Fashion",
    author: "Glam Style"
  },
  {
    id: 6,
    title: "Aksesoris yang Wajib Dimiliki di 2024",
    excerpt: "Koleksi aksesoris must-have untuk melengkapi gaya Anda di tahun 2024. Dari statement earrings hingga trendy bags, lengkapi koleksi fashion Anda.",
    content: "Tahun 2024 membawa tren aksesoris yang berani dan ekspresif. Statement earrings dengan ukuran oversized menjadi favorit, begitu juga dengan layered necklaces. Untuk tas, mini bags dan baguette bags kembali populer. Scarf dengan motif unik juga menjadi aksesoris serbaguna yang wajib dimiliki. Yang terpenting adalah memilih aksesoris yang mencerminkan kepribadian Anda.",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=400&fit=crop",
    date: "3 Januari 2024",
    readTime: "4 min read",
    category: "Accessories",
    author: "Trend Setter"
  }
];

export default function BlogPage() {
  return (
    <div className="bg-gray-50 mt-20">
      {/* Blog Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-12 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Fashion Blog</h1>
          <p className="text-gray-600 text-lg">
            Temukan inspirasi fashion, tips styling, dan tren terbaru untuk melengkapi gaya hidup Anda
          </p>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="container mx-auto px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-white">
              <div className="relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                    {post.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded text-sm font-medium text-gray-700">
                  {post.readTime}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span>Oleh {post.author}</span>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h2>

                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                  {post.excerpt}
                </p>

                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
                  Baca Selengkapnya →
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium">
            Muat Lebih Banyak Artikel
          </button>
        </div>
      </div>
    </div>
  );
}
