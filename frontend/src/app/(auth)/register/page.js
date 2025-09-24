"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "../../../lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    user_username: "",
    user_password: "",
    user_fullname: "",
    user_email: "",
    user_nohp: "",
    user_alamat: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await register(form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect based on user role
      if (data.user.user_level === 'Admin') {
        router.push("/admin/products");
      } else if (data.user.user_level === 'Pengguna') {
        router.push("/dashboard");
      } else {
        router.push("/dashboard"); // Default fallback
      }
    } catch (err) {
      setError(err.message || "Registration failed");
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
            <h2 className="text-white text-5xl font-bold mb-4">Join Us!</h2>
            <p className="text-white/90 text-lg">
              Create your account and start your journey in discovering amazing thrifted fashion pieces.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <div className="flex items-center text-white/90">
              <div className="w-2 h-2 bg-white/60 rounded-full mr-3"></div>
              <span>Access to exclusive deals</span>
            </div>
            <div className="flex items-center text-white/90">
              <div className="w-2 h-2 bg-white/60 rounded-full mr-3"></div>
              <span>Personalized recommendations</span>
            </div>
            <div className="flex items-center text-white/90">
              <div className="w-2 h-2 bg-white/60 rounded-full mr-3"></div>
              <span>Easy order tracking</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-lg">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center mb-2">
              <span className="text-white font-bold">T</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Toko Thrifty</h1>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-600">Join thousands of fashion lovers in our community.</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username and Full Name Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  name="user_username"
                  value={form.user_username}
                  onChange={handleChange}
                  required
                  placeholder="Enter username"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="user_fullname"
                  value={form.user_fullname}
                  onChange={handleChange}
                  required
                  placeholder="Enter full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="user_email"
                value={form.user_email}
                onChange={handleChange}
                required
                placeholder="Enter your email address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="text"
                name="user_nohp"
                value={form.user_nohp}
                onChange={handleChange}
                required
                placeholder="Enter your phone number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <textarea
                name="user_alamat"
                value={form.user_alamat}
                onChange={handleChange}
                required
                placeholder="Enter your full address"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors resize-none"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="user_password"
                  value={form.user_password}
                  onChange={handleChange}
                  required
                  placeholder="Create a strong password"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-black hover:text-gray-700 font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
