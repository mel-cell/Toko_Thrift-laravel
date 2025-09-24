import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import AuthButton from "./auth/AuthButton";
import { getPakaian } from "../lib/api";
import { isAuthenticated } from "../lib/auth";
import { useRouter } from "next/navigation";

function StarRating({ rating }) {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center text-yellow-400 text-sm">
      {[...Array(fullStars)].map((_, i) => (
        <svg key={`full-${i}`} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.561-.955L10 0l2.949 5.955 6.561.955-4.755 4.635 1.123 6.545z" />
        </svg>
      ))}
      {halfStar && (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half-grad">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path fill="url(#half-grad)" d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.561-.955L10 0l2.949 5.955 6.561.955-4.755 4.635 1.123 6.545z" />
        </svg>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <svg key={`empty-${i}`} className="w-4 h-4 fill-gray-300" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.561-.955L10 0l2.949 5.955 6.561.955-4.755 4.635 1.123 6.545z" />
        </svg>
      ))}
    </div>
  );
}

function ProductCard({ product }) {
  const router = useRouter();

  const addToCart = () => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));

    // Dispatch cart update event for header notification
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const buyNow = () => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    addToCart();
    router.push(`/shop/${product.id}`);
  };

  return (
    <Link href={`/shop/${product.id}`} className="block">
      <div className="bg-white rounded-lg shadow p-4 flex flex-col h-100 hover:shadow-lg transition-shadow duration-300">
        <div className="relative">
          <img
            src={product.gambar_url || '/placeholder.jpg'}
            alt={product.nama}
            className="w-full h-55 object-contain rounded"
          />
          <span className="absolute top-2 right-2 bg-gray-200 text-xs px-2 py-1 rounded">
            {product.kategori?.nama || 'No Category'}
          </span>
        </div>
        <h3 className="mt-2 font-semibold text-black">{product.nama}</h3>
        <p className="mt-1 font-bold text-black">Rp {parseInt(product.harga).toLocaleString()}</p>
        <div className="mt-2 flex items-center">
          <StarRating rating={4} />
          <span className="ml-2 text-sm text-gray-600">4.0 (10 reviews)</span>
        </div>
        <div className="mt-4 flex space-x-2">
           <Button variant="outline" className="flex-1 border border-gray-300 bg-white text-gray-900 py-2 px-4 rounded hover:bg-gray-50 transition-colors" onClick={(e) => { e.preventDefault(); addToCart(); }}>
                      Add to Cart
                    </Button>
                    <Button className="flex-1 bg-gray-950 text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors" onClick={(e) => { e.preventDefault(); buyNow(); }}>Buy Now</Button>
        </div>
      </div>
    </Link>
  );
}

export default function RelatedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getPakaian();
        // Get random 6 products
        const shuffled = Array.isArray(data) ? data.sort(() => 0.5 - Math.random()) : [];
        setProducts(shuffled.slice(0, 6));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
            <div className="h-55 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
