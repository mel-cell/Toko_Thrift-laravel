"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "../../../lib/api";
import image from "next/image";
import Cookies from "js-cookie";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ user_username: "", user_password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await login({ user_username: form.user_username, user_password: form.user_password });
      Cookies.set("token", data.token);
      Cookies.set("user", JSON.stringify(data.user));

      console.log('User logged in:', data.user);

      // Redirect based on user role
      if (data.user.user_level === 'Admin') {
        router.push("/admin");
      } else if (data.user.user_level === 'Pengguna') {
        router.push("/dashboard");
      } else {
        router.push("/dashboard"); // Default fallback
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Welcome Section */}
      <div
        className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-center relative overflow-hidden"
        style={{
          backgroundImage: "url('/bgglogin.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Content */}
        <div className="relative z-10">
          {/* Logo */}
          <div className="mb-8">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <h1 className="text-white text-4xl font-bold">Toko Thrifty</h1>
          </div>

          {/* Welcome Text */}
          <div className="mb-8">
            <h2 className="text-white text-5xl font-bold mb-4">Welcome Back!</h2>
            <p className="text-white/90 text-lg">
              Sign in to your account to continue shopping for the best thrifted fashion items.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <div className="flex items-center text-white/90">
              <div className="w-2 h-2 bg-white/60 rounded-full mr-3"></div>
              <span>Discover unique fashion pieces</span>
            </div>
            <div className="flex items-center text-white/90">
              <div className="w-2 h-2 bg-white/60 rounded-full mr-3"></div>
              <span>Save money on quality items</span>
            </div>
            <div className="flex items-center text-white/90">
              <div className="w-2 h-2 bg-white/60 rounded-full mr-3"></div>
              <span>Join our sustainable fashion community</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center mb-2">
              <span className="text-white font-bold">T</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Toko Thrifty</h1>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Login</h2>
            <p className="text-gray-600">Welcome back! Please login to your account.</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Name
              </label>
              <input
                type="text"
                name="user_username"
                value={form.user_username}
                onChange={handleChange}
                required
                placeholder="Enter your username"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="user_password"
                value={form.user_password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                />
                <span className="ml-2 text-sm text-gray-600">Remember Me</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-black hover:text-gray-700">
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              New User?{" "}
              <Link href="/register" className="text-black hover:text-gray-700 font-medium">
                Signup
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
